(function () {
  "use strict";

  var client = null;
  var state = {
    ready: false,
    mode: "preview",
    user: null,
    profile: null
  };

  function loadSdk() {
    return new Promise(function (resolve, reject) {
      if (window.supabase && window.supabase.createClient) { resolve(); return; }
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("sdk")); };
      document.head.appendChild(s);
    });
  }

  var GENERIC = "err_generic_auth";

  function mapAuthError(err) {
    var m = String((err && err.message) || "").toLowerCase();
    if (m.indexOf("invalid login") !== -1 || m.indexOf("invalid credentials") !== -1) return "err_wrongCreds";
    if (m.indexOf("email not confirmed") !== -1) return "err_confirm_email";
    if (m.indexOf("rate limit") !== -1 || m.indexOf("too many") !== -1) return "err_rate_limit";
    if (m.indexOf("password") !== -1 && m.indexOf("weak") !== -1) return "err_weak_password";
    if (m.indexOf("network") !== -1 || m.indexOf("failed to fetch") !== -1) return "err_network";
    if (m.indexOf("phone") !== -1 && m.indexOf("not") === -1 && m.indexOf("invalid") !== -1) return "err_invalid_phone";
    if (m.indexOf("signups not allowed") !== -1 || m.indexOf("already registered") !== -1) return "err_emailExists";
    return GENERIC;
  }

  function init() {
    if (!MW.config.configured) {
      state.ready = true;
      state.mode = "preview";
      return Promise.resolve(state);
    }
    return loadSdk().then(function () {
      client = window.supabase.createClient(MW.config.url, MW.config.anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      state.mode = "supabase";
      return client.auth.getSession().then(function (res) {
        var user = res.data && res.data.session ? res.data.session.user : null;
        state.user = user || null;
        if (user) return ensureProfile(user).then(function (p) { state.profile = p; });
      }).then(function () {
        client.auth.onAuthStateChange(function (event, session) {
          state.user = session ? session.user : null;
          if (!state.user) { state.profile = null; }
          else { ensureProfile(state.user).then(function (p) { state.profile = p; }); }
          if (event === "SIGNED_OUT") {
            location.hash = "#/auth";
            if (MW.router) MW.router.render();
          }
        });
        state.ready = true;
        return state;
      });
    }).catch(function () {
      state.mode = "error";
      state.ready = true;
      return state;
    });
  }

  function emptyProfile(user) {
    return {
      id: user.id,
      name: (user.user_metadata && user.user_metadata.name) || (user.email || "").split("@")[0],
      phone: user.phone || "",
      role: "student",
      points: 0
    };
  }

  function ensureProfile(user) {
    return client.from("profiles").select("*").eq("id", user.id).single()
      .then(function (res) {
        if (res.data) return res.data;
        var seedRow = emptyProfile(user);
        return client.from("profiles").insert(seedRow).select().single().then(function (r2) {
          return r2.data || seedRow;
        });
      })
      .catch(function () { return emptyProfile(user); });
  }

  function signUpEmail(name, email, password) {
    if (!client) return Promise.resolve({ ok: false, error: "err_network" });
    return client.auth.signUp({
      email: email,
      password: password,
      options: { data: { name: name } }
    }).then(function (res) {
      if (res.error) return { ok: false, error: mapAuthError(res.error) };
      var needsConfirm = !(res.data && res.data.session);
      if (res.data && res.data.session && res.data.session.user) {
        state.user = res.data.session.user;
        return ensureProfile(state.user).then(function (p) {
          state.profile = p;
          return { ok: true };
        });
      }
      return { ok: true, needsConfirmation: needsConfirm };
    });
  }

  function signInPassword(identifier, password) {
    if (!client) return Promise.resolve({ ok: false, error: "err_network" });
    return client.auth.signInWithPassword({ email: identifier, password: password })
      .then(function (res) {
        if (res.error) return { ok: false, error: mapAuthError(res.error) };
        state.user = res.data.user;
        return ensureProfile(res.data.user).then(function (p) {
          state.profile = p;
          return { ok: true };
        });
      });
  }

  function sendPhoneOtp(fullPhone) {
    if (!client) return Promise.resolve({ ok: false, error: "err_network" });
    return client.auth.signInWithOtp({ phone: fullPhone })
      .then(function (res) {
        if (res.error) return { ok: false, error: mapAuthError(res.error) };
        return { ok: true };
      });
  }

  function verifyPhoneOtp(fullPhone, token, name) {
    if (!client) return Promise.resolve({ ok: false, error: "err_network" });
    return client.auth.verifyOtp({ phone: fullPhone, token: token, type: "sms" })
      .then(function (res) {
        if (res.error) {
          var m = String(res.error.message || "").toLowerCase();
          if (m.indexOf("token") !== -1 || m.indexOf("expired") !== -1 || m.indexOf("invalid") !== -1) return { ok: false, error: "err_otp_invalid" };
          return { ok: false, error: mapAuthError(res.error) };
        }
        state.user = res.data.user;
        return ensureProfile(res.data.user).then(function (p) {
          state.profile = p;
          if (name && p && !p.phone) {
            return updateOwnProfile({ phone: fullPhone }).then(function () { return { ok: true }; });
          }
          return { ok: true };
        });
      });
  }

  function requestPasswordReset(email) {
    if (!client) return Promise.resolve({ ok: false, error: "err_network" });
    return client.auth.resetPasswordForEmail(email).then(function (res) {
      if (res.error) return { ok: false, error: mapAuthError(res.error), generic: true };
      return { ok: true };
    });
  }

  function signOut() {
    if (!client) return Promise.resolve();
    return client.auth.signOut();
  }

  function updateOwnProfile(patch) {
    if (!client || !state.user) return Promise.resolve(null);
    var allowed = {};
    ["name", "phone", "notify_tracks"].forEach(function (k) {
      if (patch[k] !== undefined) allowed[k] = patch[k];
    });
    return client.from("profiles").update(allowed).eq("id", state.user.id)
      .then(function (res) {
        if (res.error) throw res.error;
        Object.keys(allowed).forEach(function (k) { if (state.profile) state.profile[k] = allowed[k]; });
        return state.profile;
      })
      .catch(function () { return null; });
  }

  function topStudents(limit) {
    if (!client) return Promise.resolve([]);
    return client.from("leaderboard_view")
      .select("id,name,points")
      .order("points", { ascending: false })
      .limit(limit || 10)
      .then(function (res) { return res.data || []; })
      .catch(function () { return []; });
  }

  function listStudents() {
    if (!client) return Promise.resolve([]);
    return client.from("profiles")
      .select("id,name,role,points,created_at")
      .order("points", { ascending: false })
      .limit(100)
      .then(function (res) { return res.data || []; })
      .catch(function () { return []; });
  }

  function rpc(fn, args) {
    if (!client || !state.user) return Promise.resolve({ data: null, error: { message: "not_authenticated" } });
    return client.rpc(fn, args || {});
  }

  function updatePassword(newPass) {
    if (!client || !state.user) return Promise.resolve({ ok: false, error: "err_network" });
    return client.auth.updateUser({ password: newPass })
      .then(function (res) {
        if (res.error) return { ok: false, error: mapAuthError(res.error) };
        return { ok: true };
      });
  }

  window.MW = window.MW || {};
  MW.auth = {
    init: init,
    state: state,
    isLive: function () { return state.mode === "supabase" && !!client; },
    rpc: rpc,
    user: function () { return state.user; },
    profile: function () { return state.profile; },
    signUpEmail: signUpEmail,
    signInPassword: signInPassword,
    sendPhoneOtp: sendPhoneOtp,
    verifyPhoneOtp: verifyPhoneOtp,
    requestPasswordReset: requestPasswordReset,
    updatePassword: updatePassword,
    signOut: signOut,
    updateOwnProfile: updateOwnProfile,
    topStudents: topStudents,
    listStudents: listStudents
  };
})();
