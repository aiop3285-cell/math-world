# عالم الرياضيات | Math World

منصة تعليمية تفاعلية للرياضيات للجامعيين — ثنائية اللغة (عربي RTL / إنجليزي LTR)، مبنية كتطبيق ويب ثابت + Supabase للمصادقة وقاعدة البيانات.

---

## 1) التشغيل المحلي السريع

```bash
node server.js
# ثم افتح http://localhost:8137
```

أو افتح `index.html` مباشرة في المتصفح.

> بدون إعداد Supabase ستعمل المنصة في **وضع المعاينة**: شاشة الدخول تعرض «إعداد مطلوب» ولا يوجد أي حسابات تجريبية أو كلمات مرور مدمجة — هذا مقصود لأمان الإنتاج.

---

## 2) إعداد Supabase (مصادقة حقيقية)

1. أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com).
2. من **SQL Editor** شغّل محتوى الملف `supabase/schema.sql` كاملًا.
   - ينشئ جدول `profiles` بالأعمدة: `id, name, phone, role, points, created_at` (+ `notify_tracks`).
   - ينشئ Trigger يبني ملفًا شخصيًا تلقائيًا لكل مستخدم جديد بدور `student`.
   - يفعّل سياسات RLS: الطالب يقرأ/يعدّل صفه فقط، والمدير فقط يدير الجميع، وقراءة الحد الأدنى للوحة الترتيب.
3. من **Authentication → Providers → Email**: تأكد أن *Confirm email* = ON و*Minimum password length* = 8.
4. انسخ من **Project Settings → API**:
   - `Project URL`
   - `anon public` key (**لا تستخدم** `service_role` في الواجهة أبدًا)
5. أنشئ ملف `env.js` في جذر المشروع من القالب:

```js
window.__MW_ENV = {
  SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-PUBLIC-ANON-KEY",
  PHONE_AUTH_ENABLED: false
};
```

6. **ترقية مدير** (بعد تسجيل أول حساب لك): نفّذ في SQL Editor:

```sql
update public.profiles
   set role = 'admin'
 where id = (select id from auth.users where email = 'you@example.com');
```

الدور يُقرأ من قاعدة البيانات عند كل جلسة؛ صلاحيات الكتابة الإدارية تُفرض على مستوى RLS وليس في الواجهة فقط.

### حدود المحاولات
Supabase يطبّق Rate limiting افتراضيًا على نقاط النهاية الخاصة بالمصادقة (يمكن ضبطها من Authentication). رسائل الخطأ في الواجهة عامة ولا تكشف هل الحساب موجود أم لا.

---

## 3) تسجيل الدخول برقم الهاتف (OTP)

1. من **Authentication → Providers → Phone**: فعّل المزود واربط أحد مزودي SMS:
   - Twilio (Message Service SID + Auth Token)
   - MessageBird / Vonage — بنفس الطريقة
2. اجعل الرمز مكوّنًا من ٦ أرقام ومدة صلاحية 60 ثانية (افتراضي مناسب).
3. في `env.js` غيّر:

```js
PHONE_AUTH_ENABLED: true
```

**ما لم تُفعّل SMS:** يظهر خيار الهاتف داخل التسجيل بحالة واضحة **«التسجيل بالهاتف قريبًا»** معطّلًا تمامًا — لا واجهة مزيفة. الرقم يُحفظ في `profiles.phone` **فقط بعد تحقق OTP ناجح**.

---

## 4) المسارات التعليمية الستة

الترتيب الثابت: **النهايات ← التفاضل ← التكامل ← المعادلات التفاضلية ← لابلاس ← المصفوفات** (`order: 1..6` في ملفات `js/data/content*.js`).

- جميع المسارات الستة موجودة حاليًا بوحدات ودروس كاملة.
- لدعم مسار «قيد الإعداد» مستقبلًا: أنشئ كائن مسار بدون `units` (أو `units: []`) مع `expectedUnits` — ستظهر بطاقة أنيقة بحالة «قريبًا» وزر «أشعرني عند الإطلاق» يحفظ النية في `profiles.notify_tracks`.
- فتح الدروس متسلسل داخل المسار (يفتح الدرس بإكمال سابقه)، ولا يُقفل المسار نفسه.
- كل الشاشات (التقدم، الاختبارات، الشارات، لوحة الإدارة) تتعامل بأمان مع المسارات الفارغة.

---

## 5) الأمان — ملخص القرارات

| البند | القرار |
|---|---|
| كلمات المرور | لا تُخزَّن محليًا إطلاقًا؛ Supabase Auth يديرها (bcrypt داخليًا) |
| الجلسات | جلسة Supabase الرسمية مع تجديد تلقائي — لا نسخ مخصصة في localStorage |
| الدور admin | يُجلب من جدول `profiles` عبر الخادم + فرض RLS على أي عملية كتابة |
| بيانات حساسة في المتصفح | لا شيء سوى تقدّم التعلّم غير الحساس ومواضع قراءة |
| الحسابات التجريبية | حُذفت نهائيًا من الكود والواجهة |

> **خطوة موصى بها قبل إطلاق واسع:** نقل كتابة النقاط إلى دوال RPC على الخادم (`security definer`) لمنع أي تلاعب من العميل بالنقاط، وجدولة المهام الأسبوعية للدوري.

---

## 6) النشر

أي استضافة ملفات ثابتة تكفي (Netlify / Vercel / GitHub Pages / Cloudflare Pages):

1. ارفع مجلد المشروع **مع** `env.js` (أضِفه لقائمة الملفات المسموحة لديهم؛ لا ترفعه إلى Git عمومي).
2. أضِف دومين الاستضافة إلى **Authentication → URL Configuration → Redirect URLs** حتى يعمل رابط تأكيد البريد وإعادة التعيين.
3. فعِّل HTTPS (تلقائي في المنصات أعلاه).

## 7) هيكل المشروع

```
index.html            env.example.js        server.js (اختياري)
supabase/schema.sql
styles/               tokens · base · components · views-a/b/c
js/
  config.js auth.js store.js i18n.js ui.js ai-engine.js main.js
  data/  content.js content2.js content3.js demo.js lessonExtras.js
  views/ auth shell home paths lesson quiz challenge league assistant profile admin
```

## 8) خطوة أخيرة مهمة

احذف `env.js` من أي مستودع عام وأضِفه إلى `.gitignore`، واستخدم لوحات متغيرات البيئة لدى مزود الاستضافة عند الحاجة لإصدارات مختلفة (تجربة/إنتاج).
[![Netlify deployment status badge for the Math World project, displaying the text Netlify Status and the current deployment state, with a link to the project deployment dashboard](https://api.netlify.com/api/v1/badges/15867cc1-e890-4e1c-900c-c5fd8cd17fe4/deploy-status)][def]

[def]: https://app.netlify.com/projects/mathworlld-app/deploys