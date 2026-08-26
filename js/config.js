(function () {
  "use strict";

  var env = (typeof window !== "undefined" && window.__MW_ENV) || null;

  var cfg = {
    url: env && env.SUPABASE_URL ? String(env.SUPABASE_URL) : "",
    anonKey: env && env.SUPABASE_ANON_KEY ? String(env.SUPABASE_ANON_KEY) : "",
    phoneAuthEnabled: !!(env && env.PHONE_AUTH_ENABLED === true),
    configured: false
  };

  cfg.configured = /^https?:\/\//.test(cfg.url) && cfg.anonKey.length > 20;

  window.MW = window.MW || {};
  MW.config = cfg;
})();
