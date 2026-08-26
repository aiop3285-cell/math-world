(function () {
  "use strict";

  var mode = "login";
  var signupMethod = "email";
  var loginMethod = "email";
  var otpCtx = null;
  var ready = false;

  var COUNTRIES = [
    { code: "966", ar: "السعودية", en: "Saudi Arabia" },
    { code: "971", ar: "الإمارات", en: "UAE" },
    { code: "965", ar: "الكويت", en: "Kuwait" },
    { code: "973", ar: "البحرين", en: "Bahrain" },
    { code: "974", ar: "قطر", en: "Qatar" },
    { code: "968", ar: "عمان", en: "Oman" },
    { code: "962", ar: "الأردن", en: "Jordan" },
    { code: "20", ar: "مصر", en: "Egypt" },
    { code: "212", ar: "المغرب", en: "Morocco" },
    { code: "213", ar: "الجزائر", en: "Algeria" },
    { code: "216", ar: "تونس", en: "Tunisia" },
    { code: "218", ar: "ليبيا", en: "Libya" },
    { code: "964", ar: "العراق", en: "Iraq" },
    { code: "90", ar: "تركيا", en: "Turkey" }
  ];

  function render(root) {
    root.innerHTML =
      '<div class="auth-screen">' +
        '<div class="auth-scene" aria-hidden="true">' + sceneSVG() + "</div>" +
        '<button class="lang-btn" data-lang style="position:absolute;top:18px;inset-inline-end:18px;z-index:5">' + MW.icon("globe") + langLabel() + "</button>" +
        '<div class="auth-layout">' +
          '<div class="auth-brand-side">' +
            '<div class="brand-plate fade-in-el" style="--delay:.15s">' +
              '<div class="brand-logo-col">' +
                '<img class="brand-logo-img" src="assets/logo.jpg" alt="شعار ' + MW.t("brand") + '" onerror="this.onerror=null;this.src=\'assets/logo.png\';this.addEventListener(\'error\',function(){this.classList.add(\'hidden\');document.getElementById(\'brand-mark-fallback\').classList.add(\'show\')})">' +
                '<span class="brand-mark" id="brand-mark-fallback"><svg viewBox="0 0 32 32" fill="none" stroke-width="2.6" stroke-linecap="round"><path d="M8 23 L16 9 L24 23"/><circle cx="16" cy="9" r="2.4" fill="#C89A4B" stroke="none"/></svg></span>' +
                '<span class="brand-name">' + MW.t("brand") + "<small>" + MW.t("brandEn") + "</small></span>" +
              "</div>" +
              '<p class="tagline">' + MW.t("tagline") + "</p>" +
            "</div>" +
            '<div class="hero-figure float-slow fade-in-el" style="--delay:.55s">' + studentFigure() + "</div>" +
          "</div>" +
          '<div class="glass-form-wrap">' +
            '<div class="auth-card" id="auth-card"></div>' +
          "</div>" +
        "</div>" +
      "</div>";

    renderCard();
    bindIntro(root);
    root.querySelector("[data-lang]").addEventListener("click", function () {
      MW.i18n.setLang(document.documentElement.lang === "ar" ? "en" : "ar");
      ready = false;
      MW.router.render();
    });
  }

  function langLabel() { return document.documentElement.lang === "ar" ? "EN" : "\u0639"; }
  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function bindIntro(root) {
    var card = root.querySelector("#auth-card");
    if (prefersReduced()) { card.classList.add("ready"); return; }
    setTimeout(function () { card.classList.add("ready"); }, 2100);
  }

  function sceneSVG() {
    return '<svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice" fill="none">' + axes() + isoSolid() + vectors() + curve() + points() + "</svg>";
  }
  function axes() {
    return '<g stroke="#70513B" stroke-opacity=".28" stroke-width="1.6" stroke-linecap="round">' +
      '<path class="draw-path" style="--len:1300;--draw-dur:1.4s;--delay:.05s" d="M80 700 H1320"/>' +
      '<path class="draw-path" style="--len:800;--draw-dur:1.2s;--delay:.15s" d="M180 800 V90"/>' +
      '<path class="draw-path" style="--len:700;--draw-dur:1s;--delay:.25s" d="M180 700 L540 340" stroke-dasharray="2 10"/></g>';
  }
  function isoSolid() {
    var g = 'stroke="#3F7A7A" stroke-width="2" stroke-linejoin="round"';
    return '<g transform="translate(820 250)" opacity=".85">' +
      '<path class="draw-path" ' + g + ' style="--len:520;--draw-dur:1.5s;--delay:.5s" d="M0 120 L110 60 L220 120 L220 260 L110 320 L0 260 Z"/>' +
      '<path class="draw-path" ' + g + ' style="--len:420;--draw-dur:1.2s;--delay:.95s" d="M0 120 L110 180 L220 120 M110 180 V320 M0 120 L110 -20 L220 120 M110 -20 V180"/>' +
      '<path class="draw-path" stroke="#C89A4B" stroke-width="2" style="--len:300;--draw-dur:1s;--delay:1.25s" d="M-40 200 L110 60 L260 160"/></g>';
  }
  function vectors() {
    return '<g stroke-width="2.2" stroke-linecap="round">' +
      '<g stroke="#70513B"><path class="draw-path" style="--len:240;--draw-dur:.8s;--delay:1.45s" d="M300 640 L430 520"/><path class="fade-in-el" style="--delay:2.2s" d="M430 520l-14 -2m14 2l-3 13" stroke="#70513B"/></g>' +
      '<g stroke="#3F7A7A"><path class="draw-path" style="--len:200;--draw-dur:.7s;--delay:1.6s" d="M380 720 L500 630"/><path class="fade-in-el" style="--delay:2.25s" d="M500 630l-14 -2m14 2l-3 13" stroke="#3F7A7A"/></g></g>';
  }
  function curve() {
    return '<g stroke="#3F7A7A" stroke-width="2.4" stroke-linecap="round" opacity=".9"><path class="draw-path" style="--len:600;--draw-dur:1.4s;--delay:.75s" d="M170 620 C 280 620, 330 330, 470 330 S 650 620, 760 620"/></g>';
  }
  function points() {
    function pt(x, y, d, c) {
      return '<circle class="fade-in-el" style="--delay:' + d + 's" cx="' + x + '" cy="' + y + '" r="6" fill="' + (c || "#C89A4B") + '" stroke="#FAF7F2" stroke-width="2.5"/>';
    }
    return pt(470, 330, 2.1) + pt(820, 370, 2.25, "#3F7A7A") + pt(300, 640, 2.4, "#70513B") + pt(1040, 510, 2.5, "#70513B");
  }
  function studentFigure() {
    return '' +
      '<svg viewBox="0 0 360 300" fill="none" role="img" aria-label="طالب هندسة">' +
        '<ellipse cx="185" cy="278" rx="120" ry="12" fill="#E6D2B8" opacity=".5"/>' +
        '<g class="float-slow" style="animation-duration:9s">' +
          '<path d="M150 132 q-26 10 -34 44 l-12 52 h22 l14 -46 10 -34z" fill="#70513B"/>' +
          '<path d="M212 134 q30 8 38 44 l10 50 -22 2 -14 -44 -12 -36z" fill="#70513B"/>' +
          '<rect x="128" y="126" width="100" height="86" rx="30" fill="#F0E4D3"/>' +
          '<path d="M128 168 q50 26 100 0 v44 a30 30 0 01-30 30 h-40 a30 30 0 01-30 -30z" fill="#3F7A7A"/>' +
          '<circle cx="178" cy="96" r="34" fill="#EDCBAA"/>' +
          '<path d="M144 92 a34 34 0 0168 0 l-4 4 a64 64 0 00-60 0z" fill="#C89A4B"/>' +
          '<rect x="140" y="88" width="76" height="10" rx="5" fill="#B9873D"/>' +
          '<rect x="118" y="176" width="66" height="48" rx="5" fill="#FFFFFF" stroke="#E6D2B8" stroke-width="3" transform="rotate(-8 151 200)"/>' +
          '<path d="M148 214 L138 268 h20 l10 -50z" fill="#1D2D35"/><path d="M186 216 l6 52 h20 l-8 -54z" fill="#1D2D35"/>' +
        "</g></svg>";
  }

  function cardShell(titleKey, subKey, inner) {
    return '<h1 class="auth-title">' + MW.t(titleKey) + "</h1>" +
      '<p class="auth-sub">' + MW.t(subKey) + "</p>" + inner;
  }

  function renderCard() {
    var card = document.getElementById("auth-card");
    if (!card) return;

    if (!MW.config.configured || !MW.auth.isLive()) {
      card.innerHTML = setupPanel();
      return;
    }

    if (otpCtx) { renderOtp(card); return; }

    var tabs =
      '<div class="auth-mode-switch" role="tablist">' +
        '<button class="auth-mode-btn' + (mode === "login" ? " active" : "") + '" data-mode="login">' + MW.t("auth_loginTab") + "</button>" +
        '<button class="auth-mode-btn' + (mode === "signup" ? " active" : "") + '" data-mode="signup">' + MW.t("auth_signupTab") + "</button>" +
      "</div>";

    var body = "";
    if (mode === "login") body = tabs + loginForm();
    else body = tabs + signupForm();

    card.innerHTML = cardShell(
      mode === "login" ? "auth_loginTitle" : "auth_signupTitle",
      mode === "login" ? "auth_loginSub" : "auth_signupSub",
      body
    );
    wireCard();
  }

  function setupPanel() {
    return '<div class="setup-panel">' +
      '<div class="stat-icon" style="background:var(--c-gold-soft);color:#8a6524;width:52px;height:52px;border-radius:15px;display:grid;place-items:center;margin-bottom:14px">' + MW.icon("gear") + "</div>" +
      "<h2 style=\"font-size:1.15rem;margin-bottom:8px\">" + MW.t("setup_required") + "</h2>" +
      '<p style="font-size:.92rem;line-height:1.9;color:var(--c-muted);margin-bottom:14px">' + MW.t("setup_desc") + "</p>" +
      '<code dir="ltr" class="env-chip">SUPABASE_URL</code><code dir="ltr" class="env-chip">SUPABASE_ANON_KEY</code>' +
      '<p class="faint" style="font-size:.8rem;margin-top:14px">' + MW.t("see_readme") + "</p>" +
    "</div>";
  }

  function pwField(id) {
    return '<div class="field">' +
      '<label class="field-label" for="' + id + '">' + MW.t("field_password") + "</label>" +
      '<div class="input-wrap">' + MW.icon("lock", "lead-icon") +
      '<input class="input" type="password" id="' + id + '" autocomplete="current-password" dir="ltr" placeholder="' + MW.t("ph_password") + '">' +
      '<button type="button" class="pw-toggle" data-pw-toggle aria-label="' + MW.t("showPassword") + '">' + MW.icon("eye") + "</button></div>" +
      '<div class="field-error" data-err="pw"></div>' +
      (id === "su-pw" ? '<div class="faint" style="font-size:.74rem;margin-top:2px">' + MW.t("pw_rule") + "</div>" : "") +
    "</div>";
  }

  function alertSlot() { return '<div id="auth-alert"></div>'; }

  function loginForm() {
    var methodSwitch = MW.config.phoneAuthEnabled
      ? '<div class="seg-mini row" role="tablist" style="margin-bottom:14px;gap:6px">' +
          '<button class="tab' + (loginMethod === "email" ? " active" : "") + '" data-lmethod="email">' + MW.t("login_method_email") + "</button>" +
          '<button class="tab' + (loginMethod === "phone" ? " active" : "") + '" data-lmethod="phone">' + MW.t("login_method_phone") + "</button>" +
        "</div>"
      : "";
    var fields = loginMethod === "phone"
      ? phoneFields("lg")
      : '<div class="field">' +
          '<label class="field-label" for="ident-input">' + MW.t("field_email") + "</label>" +
          '<div class="input-wrap">' + MW.icon("mail", "lead-icon") +
          '<input class="input" id="ident-input" type="email" autocomplete="username" dir="ltr" placeholder="' + MW.t("ph_email") + '"></div>' +
          '<div class="field-error" data-err="ident"></div></div>';

    return methodSwitch +
      '<form id="auth-form" novalidate>' +
        fields +
        (loginMethod === "email" ? pwField("pw-input") : "") +
        alertSlot() +
        '<div class="auth-row-between">' +
          (loginMethod === "email"
            ? '<label class="check-row"><input type="checkbox" id="remember-me" checked><span>' + MW.t("rememberMe") + "</span></label>" +
              '<button type="button" class="link-btn" data-forgot>' + MW.t("forgotPassword") + "</button>"
            : "<span></span>") +
        "</div>" +
        '<button type="submit" class="btn btn-primary btn-block btn-lg">' +
          (loginMethod === "email" ? MW.t("btn_login") : MW.t("send_otp")) +
        "</button>" +
      "</form>";
  }

  function signupForm() {
    var methodSwitch =
      '<div class="field"><label class="field-label">' + MW.t("signup_method_title") + '</label>' +
        '<div class="row" style="gap:8px">' +
          '<button type="button" class="btn btn-sm ' + (signupMethod === "email" ? "btn-primary" : "btn-ghost") + '" data-smethod="email" style="flex:1">' + MW.icon("mail") + MW.t("method_email") + "</button>" +
          '<button type="button" class="btn btn-sm ' + (signupMethod === "phone" ? "btn-primary" : "btn-ghost") + '" data-smethod="phone" style="flex:1">' + MW.icon("user") + MW.t("method_phone") + "</button>" +
        "</div></div>";

    var inner = signupMethod === "email"
      ? emailSignupFields()
      : phoneComingSoon();

    return '<form id="auth-form" novalidate>' +
      '<div class="field">' +
        '<label class="field-label" for="name-input">' + MW.t("field_name") + "</label>" +
        '<div class="input-wrap">' + MW.icon("user", "lead-icon") +
        '<input class="input" id="name-input" autocomplete="name" placeholder="' + MW.t("ph_name") + '"></div>' +
        '<div class="field-error" data-err="name"></div></div>' +
      methodSwitch + inner +
    "</form>";
  }

  function emailSignupFields() {
    return '<div class="field">' +
        '<label class="field-label" for="ident-input">' + MW.t("field_email") + "</label>" +
        '<div class="input-wrap">' + MW.icon("mail", "lead-icon") +
        '<input class="input" id="ident-input" type="email" autocomplete="email" dir="ltr" placeholder="' + MW.t("ph_email") + '"></div>' +
        '<div class="field-error" data-err="ident"></div></div>' +
      pwField("su-pw") +
      alertSlot() +
      '<button type="submit" class="btn btn-primary btn-block btn-lg">' + MW.t("btn_signup") + "</button>";
  }

  function phoneFields(prefix) {
    var opts = COUNTRIES.map(function (c) {
      var label = document.documentElement.lang === "ar" ? c.ar : c.en;
      return '<option value="' + c.code + '">+' + c.code + " — " + label + "</option>";
    }).join("");
    return '<div class="field"><label class="field-label">' + MW.t("country_select") + '</label><select class="input" id="' + prefix + '-cc">' + opts + "</select></div>" +
      '<div class="field"><label class="field-label">' + MW.t("method_phone") + "</label>" +
      '<div class="input-wrap"><span class="chip chip-sand num" id="' + prefix + '-prefix" style="position:absolute;inset-inline-start:12px">+966</span>' +
      '<input class="input num" id="' + prefix + '-phone" type="tel" inputmode="numeric" dir="ltr" style="padding-inline-start:78px" placeholder="5XXXXXXXX"></div>' +
      '<div class="field-error" data-err="phone"></div></div>';
  }

  function phoneComingSoon() {
    return '<div class="empty-state" style="margin-bottom:14px">' +
        '<div style="color:var(--c-gold)">' + MW.icon("clock").replace("<svg ", '<svg style="width:40px;height:40px;margin-inline:auto" ') + "</div>" +
        '<div class="empty-title">' + MW.t("phone_coming_soon") + "</div>" +
        '<div class="empty-sub">' + MW.t("phone_soon_desc") + "</div>" +
      "</div>" +
      '<button type="button" class="btn btn-gold btn-block" disabled style="opacity:.6">' + MW.t("phone_coming_soon") + "</button>";
  }

  function renderOtp(card) {
    card.innerHTML = cardShell("otp_title", "otp_title",
      '<p style="font-size:.9rem;color:var(--c-muted);line-height:1.8;margin-bottom:16px">' +
        MW.t("otp_sent_desc") + ' <bdir="ltr" class="num">' + otpCtx.displayPhone + "</b></p>" +
      '<form id="otp-form" novalidate>' +
        '<div class="field"><input class="input num otp-input" id="otp-code" inputmode="numeric" maxlength="6" dir="ltr" autocomplete="one-time-code" placeholder="' + MW.t("otp_code_ph") + '"></div>' +
        '<div id="otp-alert"></div>' +
        '<button type="submit" class="btn btn-primary btn-block btn-lg">' + MW.t("otp_verify_btn") + "</button>" +
        '<button type="button" class="link-btn btn-block" data-resend style="margin-top:12px;font-size:.85rem">' + MW.t("otp_resend") + "</button>" +
      "</form>");
    wireOtp();
  }

  function wireCard() {
    var card = document.getElementById("auth-card");

    card.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { mode = b.getAttribute("data-mode"); otpCtx = null; renderCard(); });
    });
    card.querySelectorAll("[data-smethod]").forEach(function (b) {
      b.addEventListener("click", function () { signupMethod = b.getAttribute("data-smethod"); renderCard(); });
    });
    card.querySelectorAll("[data-lmethod]").forEach(function (b) {
      b.addEventListener("click", function () { loginMethod = b.getAttribute("data-lmethod"); renderCard(); });
    });

    card.querySelectorAll("[data-pw-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var inp = b.parentElement.querySelector("input");
        var showing = inp.type === "text";
        inp.type = showing ? "password" : "text";
        b.innerHTML = MW.icon(showing ? "eyeoff" : "eye");
      });
    });

    var ccSel = card.querySelector("#lg-cc, #su-cc");
    if (ccSel) {
      ccSel.addEventListener("change", function () {
        var pre = card.querySelector("#lg-prefix");
        if (pre) pre.textContent = "+" + ccSel.value;
      });
    }

    var forgotBtn = card.querySelector("[data-forgot]");
    if (forgotBtn) forgotBtn.addEventListener("click", openForgot);

    var form = card.querySelector("#auth-form");
    if (form) form.addEventListener("submit", onSubmit);
  }

  function fullPhone(prefixId, numberId) {
    var card = document.getElementById("auth-card");
    var cc = card.querySelector("#" + prefixId).value.replace("+", "");
    var num = card.querySelector("#" + numberId).value.replace(/[\s-]/g, "");
    return { ok: /^\d{7,12}$/.test(num), value: "+" + cc + num };
  }

  function setErr(key, msgKey) {
    var slot = document.querySelector('[data-err="' + key + '"]');
    if (slot) slot.innerHTML = msgKey ? MW.icon("alert") + MW.t(msgKey) : "";
  }

  function showAlert(msgKey) {
    var box = document.getElementById("auth-alert");
    if (!box) box = document.getElementById("otp-alert");
    if (box) box.innerHTML = msgKey ? '<div class="form-alert">' + MW.icon("alert") + MW.t(msgKey) + "</div>" : "";
  }

  function strongPassword(v) {
    return v.length >= 8 && /[A-Za-z\u0600-\u06FF]/.test(v) && /\d/.test(v);
  }

  var MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function onSubmit(e) {
    e.preventDefault();
    showAlert(null);
    setErr("ident", null); setErr("pw", null);
    setErr("name", null); setErr("phone", null);

    var card = document.getElementById("auth-card");
    var busyBtn = card.querySelector('button[type="submit"]');
    busyBtn.disabled = true;

    var finish = function () { busyBtn.disabled = false; };

    if (mode === "login" && loginMethod === "phone") {
      var ph = fullPhone("lg-cc", "lg-phone");
      if (!ph.ok) { setErr("phone", "err_invalid_phone"); finish(); return; }
      MW.auth.sendPhoneOtp(ph.value).then(function (r) {
        if (!r.ok) { showAlert(r.error); finish(); return; }
        otpCtx = { phone: ph.value, displayPhone: ph.value, name: "" };
        renderCard();
      });
      return;
    }

    if (mode === "signup" && signupMethod === "phone") { finish(); return; }

    var nameVal = (card.querySelector("#name-input") || {}).value || "";
    var identEl = card.querySelector("#ident-input");
    var ident = identEl ? identEl.value.trim() : "";
    var passEl = card.querySelector("#pw-input") || card.querySelector("#su-pw");
    var pass = passEl ? passEl.value : "";

    if (mode === "signup") {
      if (nameVal.trim().length < 3) { setErr("name", "err_requiredName"); finish(); return; }
      if (!MAIL_RE.test(ident)) { setErr("ident", ident ? "err_invalidEmail" : "err_requiredEmail"); finish(); return; }
      if (!strongPassword(pass)) { setErr("pw", "err_weak_password"); finish(); return; }
      MW.store.register(nameVal, ident, pass).then(function (res) {
        if (!res.ok) { showAlert(res.error); finish(); return; }
        if (res.needsConfirmation) showCheckInbox(ident);
        else enterApp();
      });
      return;
    }

    if (!ident) { setErr("ident", "err_requiredEmail"); finish(); return; }
    if (!MAIL_RE.test(ident)) { setErr("ident", "err_invalidEmail"); finish(); return; }
    if (!pass) { setErr("pw", "err_requiredPassword"); finish(); return; }

    MW.store.login(ident, pass).then(function (res) {
      if (!res.ok) { showAlert(res.error); finish(); return; }
      enterApp();
    });
  }

  function showCheckInbox(email) {
    var card = document.getElementById("auth-card");
    card.innerHTML = cardShell("check_inbox_title", "check_inbox_desc",
      '<div class="empty-state" style="margin:18px 0">' +
        '<div style="color:var(--c-teal)">' + MW.icon("mail").replace("<svg ", '<svg style="width:42px;height:42px;margin-inline:auto" ') + "</div>" +
        '<bdir="ltr" class="num" style="font-weight:700">' + MW.esc(email) + "</bdir>" +
      "</div>" +
      '<button class="btn btn-primary btn-block" data-back-login>' + MW.t("btn_login") + "</button>");
    card.querySelector("[data-back-login]").addEventListener("click", function () {
      mode = "login"; renderCard();
    });
  }

  function wireOtp() {
    var form = document.getElementById("otp-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var code = document.getElementById("otp-code").value.trim();
      if (!/^\d{4,8}$/.test(code)) { showAlert("err_otp_invalid"); return; }
      showAlert(null);
      MW.auth.verifyPhoneOtp(otpCtx.phone, code, otpCtx.name).then(function (r) {
        if (!r.ok) { showAlert(r.error); return; }
        enterApp();
      });
    });
    document.querySelector("[data-resend]").addEventListener("click", function () {
      MW.auth.sendPhoneOtp(otpCtx.phone).then(function (r) {
        MW.toast(r.ok ? MW.t("otp_resend") : MW.t(r.error || "err_generic_auth"), r.ok ? "success" : "error");
      });
    });
  }

  function openForgot() {
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<p class="muted" style="font-size:.9rem;line-height:1.8;margin-bottom:16px">' + MW.t("forgot_desc") + "</p>" +
      '<div class="field"><label class="field-label">' + MW.t("field_email") + '</label><input class="input" id="fp-email" type="email" dir="ltr"></div>' +
      '<button class="btn btn-primary btn-block" id="fp-go">' + MW.t("next") + "</button>";
    var m = MW.modal({ title: MW.t("forgot_title"), body: wrap });
    wrap.querySelector("#fp-go").addEventListener("click", function () {
      var email = wrap.querySelector("#fp-email").value.trim();
      if (!MAIL_RE.test(email)) { MW.toast(MW.t("err_invalidEmail"), "error"); return; }
      m.close();
      MW.auth.requestPasswordReset(email).then(function (r) {
        MW.toast(MW.t("reset_sent_generic"), r.ok ? "success" : "error");
      });
    });
  }

  function enterApp() {
    location.hash = "#/home";
    MW.router.render();
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.auth = { render: render, isStandalone: true };
})();
