(function () {
  // انسخ هذا الملف باسم env.js وأدخل قيم مشروعك من لوحة Supabase.
  // لا تضع هنا أي مفاتيح سرية (service_role) — المفتاح المطلوب عام (anon) ويعمل مع RLS.
  window.__MW_ENV = {
    SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",
    SUPABASE_ANON_KEY: "YOUR-PUBLIC-ANON-KEY",
    PHONE_AUTH_ENABLED: false
  };
})();
