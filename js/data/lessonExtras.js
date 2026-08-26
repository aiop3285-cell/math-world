(function () {
  "use strict";

  var T = function (ar, en) { return { ar: ar, en: en }; };

  var O = function (a1, a2, a3, b1, b2, b3, diff) {
    return {
      diff: diff || 2,
      items: [
        T(a1, b1), T(a2, b2), T(a3, b3)
      ]
    };
  };

  MW.lessonExtras = {

    objectives: {
      "lim-l1": O("تفسير رمز النهاية وقراءته بلغة يومية", "التمييز بين قيمة الدالة وقيمة نهايتها", "الحكم على وجود النهاية من الجهتين", "Interpret the limit notation in plain words", "Distinguish f(a) from the limit at a", "Judge existence via one-sided limits", 1),
      "lim-l2": O("تطبيق شروط الاستمرارية الثلاثة على أي نقطة", "تصنيف نوع الانقطاع من الرسم أو المعادلة", "استخدام التعويض المباشر بثقة", "Apply the three continuity conditions", "Classify discontinuity types", "Use direct substitution confidently", 1),
      "lim-l3": O("تشخيص الصورة 0/0 فور ظهورها", "اختيار استراتيجية التحليل أو المرافق", "معرفة متى تُستخدم قاعدة لوبيتال ومتى تفشل", "Recognize the 0/0 form instantly", "Choose factoring vs conjugate strategy", "Know when L'Hôpital applies and fails", 2),
      "lim-l4": O("قراءة سلوك الدوال عند اللانهاية بقاعدة الدرجات", "حساب الخطوط الأفقية المقاربة", "معالجة صور ∞−∞ بالمرافق", "Read end behavior via degree comparison", "Compute horizontal asymptotes", "Handle ∞−∞ with conjugates", 2),
      "lim-l5": O("تطبيق نموذج sin(x)/x وتحويل المسائل إليه", "استخدام عائلة النهايات المثلثية المشتقة", "الانتباه لوحدة الراديان دائمًا", "Reshape problems into sin(x)/x", "Use derived trig limits family", "Always work in radians", 2),
      "drv-l1": O("اشتقاق دوال بسيطة من تعريف الحد", "ربط المشتقة بميل المماس بصريًا", "شرح العلاقة بين التفاضل والاستمرارية", "Derive simple functions from the definition", "Connect derivative to tangent slope", "Explain differentiability vs continuity", 1),
      "drv-l2": O("تفاضل كثيرات الحدود بسرعة ودقة", "استخدام قاعدتي المنتج والقسمة بشكل صحيح", "بناء جدول مشتقات أساسي في ذاكرتك", "Differentiate polynomials fluently", "Apply product and quotient rules correctly", "Memorize the core table", 2),
      "drv-l3": O("تفكيك الدوال المركبة إلى طبقات", "تطبيق قاعدة السلسلة دون فقدان الداخلية", "إجراء التفاضل الضمني للدوائر والمنحنيات", "Decompose composites into layers", "Apply chain rule keeping inner derivative", "Do implicit differentiation", 2),
      "drv-l4": O("إيجاد النقاط الحرجة وتصنيفها", "استخدام اختبار الإشارة الأولى", "حل مسألة تحسين هندسية كاملة الخطوات", "Find and classify critical points", "Use the first-derivative test", "Solve a full optimization problem", 3),
      "drv-l5": O("حساب التقعر من المشتقة الثانية", "تحديد نقاط الانقلاب والتحقق منها", "اتباع منهجية رسم منحنى كاملة", "Compute concavity from f″", "Locate verified inflection points", "Follow full curve-sketching protocol", 2),
      "int-l1": O("تكامل القوى وكثيرات الحدود", "شرح سبب ثابت التكامل C", "التحقق من أي تكامل بالاشتقاق العكسي", "Integrate powers and polynomials", "Explain why +C exists", "Verify any integral by differentiating", 1),
      "int-l2": O("اختيار u الصحيحة من هيئة المكامل", "تنفيذ خطوات التعويض حتى العودة لـ x", "معالجة اختلاف معاملات du", "Pick the right inner substitution", "Run the full substitution workflow", "Fix constant mismatches in du", 2),
      "int-l3": O("تقييم التكامل المحدد بصيغة نيوتن-لايبنتز", "تفسير التكامل كتراكم للمعدلات", "اشتقاق التكامل ذي الحد المتغير", "Evaluate definite integrals via FTC", "Read integrals as accumulation", "Differentiate variable-limit integrals", 2),
      "int-l4": O("التمييز بين المساحة الموقعة والهندسية", "حساب المساحة بين منحنيين", "حساب أحجام أجسام الدوران بالأقراص", "Distinguish signed vs geometric area", "Compute area between curves", "Compute volumes of revolution", 3),
      "ode-l1": O("ترجمة نص ظاهرة إلى معادلة تفاضلية", "تصنيف أي معادلة رتبةً ودرجةً وخطية", "التحقق من حل مقترح بالتعويض", "Translate phenomena into ODEs", "Classify order, degree, linearity", "Verify proposed solutions", 1),
      "ode-l2": O("فحص قابلية الفصل قبل الحل", "تنفيذ خوارزمية الفصل الست خطوات", "اصطياد الحلول الفقدانية عند القسمة", "Check separability first", "Run the six-step separation algorithm", "Catch lost solutions when dividing", 2),
      "ode-l3": O("ترتيب المعادلة للصورة القياسية", "بناء العامل التكاملي μ واستخدامه", "تجنب أشهر أخطاء الإشارة هنا", "Rearrange to standard form", "Build and use integrating factor μ", "Avoid classic sign mistakes", 3),
      "ode-l4": O("اشتقاق نموذج النمو الأسّي من افتراض واحد", "حساب زمني النصف والمضاعفة", "نمذجة تبريد ودائرة RC بنفس البنية", "Derive exponential model from one assumption", "Compute half-life and doubling time", "Model cooling and RC with same structure", 2),
      "lap-l1": O("شرح فكرة التحويل ولماذا يبسّط المسائل", "حساب تحويلات الجدول الأساسية من التعريف", "تحديد منطقة تقارب كل تحويل", "Explain why transforms simplify", "Compute core-table transforms", "Identify regions of convergence", 2),
      "lap-l2": O("توظيف الخطية لتفكيك الدوال", "استخدام خاصية المشتقة لإدخال الشروط الابتدائية", "تطبيق الإزاحة الأولى فورًا", "Use linearity to decompose functions", "Insert initial conditions via derivative rule", "Apply first shifting instantly", 2),
      "lap-l3": O("اختيار هيئة الكسور حسب نوع العوامل", "حساب الثوابت بطريقة غطاء القيم", "مطابقة كل كسر بسطر الجدول العكسي", "Pick fraction form by factor type", "Compute constants by cover-up", "Match each piece to inverse table", 2),
      "lap-l4": O("تنفيذ خطة لابلاس الخمس خطوات كاملة", "قراءة الحل الزمني وسلوكه المستقر", "الحكم متى تُفضَّل لابلاس على الطرق الكلاسيكية", "Run the five-step Laplace plan", "Read steady-state behavior of solutions", "Decide when Laplace beats classical methods", 3),
      "mat-l1": O("تنفيذ ضرب المصفوفات بأبعاد صحيحة", "تفسير المصفوفة كتحويل خطي للمكان", "تبرير عدم تبادلية الضرب بمثال هندسي", "Multiply matrices with valid dimensions", "Read matrices as linear transformations", "Justify non-commutativity geometrically", 1),
      "mat-l2": O("حساب محددات 2×2 و3×3", "قلب مصفوفات 2×2 بالوصفة الكاملة", "ربط det=0 بانطواء الفضاء وفقدان العكس", "Compute 2×2/3×3 determinants", "Invert 2×2 matrices fully", "Link det=0 to collapse and no inverse", 2),
      "mat-l3": O("تطبيق عمليات الصفوف وصولًا للشكل المدرج", "تصنيف الحلول عبر الرتبة", "استخدام كرامر للأحجام الصغيرة بشرط D≠0", "Row-reduce to echelon form", "Classify solutions via rank", "Use Cramer for small systems with D≠0", 2),
      "mat-l4": O("حل المعادلة المميزة لإيجاد λ", "إيجاد المتجهات الذاتية لكل قيمة", "استخدام الأثر والمحدد كفحوص سريعة", "Solve the characteristic equation for λ", "Find eigenvectors per eigenvalue", "Use trace and determinant as checks", 3)
    },

    apps: {
      "limits": T(
        "قبل أن يعبر حملٌ ما قيمة حرجة في تصميم جسر أو أنبوب ضغط، يحتاج المهندس إلى معرفة إلى أين يتجه السلوك قرب تلك القيمة — وليس فقط قيمتها عند النقطة نفسها. النهايات هي أدوات «الإنذار المبكر» في المحاكاة العددية: عندما يقترب مخرج نموذج من حدّ خطر، ترى ذلك في سلوك الاقتراب قبل وقوع الفشل.",
        "Before a load crosses a critical value in a bridge or pressure-vessel design, an engineer needs to know where behavior is heading near that value — not just the value itself. Limits are early-warning tools in numerical simulation: as a model output drifts toward a danger threshold, the approaching behavior reveals it before failure."
      ),
      "derivatives": T(
        "كل قرار تحسين هندسي — أقل وزن لهيكل، أعلى كفاءة لمبادل حراري، أفضل زاوية لألواح شمسية — يُحل بمشتقة تساوي صفرًا. كما أن معدلات التغير اللحظية (سرعة تدفق، استجابة حساس، انحدار طريق) هي لغة المواصفات الفنية التي تكتب بها مخططاتك وتقرأ نتائج القياسات.",
        "Every engineering optimization — lightest frame, most efficient heat exchanger, best solar tilt — is solved by setting a derivative to zero. And instantaneous rates (flow speed, sensor response, road grade) are the specification language you write drawings and read measurements with."
      ),
      "integrals": T(
        "التكامل هو كيف يجمع المهندس ما لا يُعد: شغل متغير عبر مسار، حملاً مائياً على جدار سد يتزايد مع العمق، وطاقة مستهلكة تحت منحنى قدرة. كل تكامل على ورقة التصميم هو إجابة عن سؤال: كم المجموع الكلي؟",
        "Integration is how engineers sum what cannot be counted: work of varying force along a path, hydrostatic load on a dam wall growing with depth, energy under a power curve. Every integral on a design sheet answers one question: what is the total?"
      ),
      "odes": T(
        "أي نظام يتفاعل مع الزمن — مكثف يشحن، مبادل حراري يبرد، مقود سيارة يستجيب — يُكتب كمعادلة تفاضلية أولًا ثم يُحل ليُصمم. مهارة قراءة هذه المعادلات تعني قدرتك على التنبؤ بسلوك النظام قبل بنائه وضبط ثوابت الزمن τ بعناية.",
        "Any time-reacting system — a charging capacitor, a cooling heat exchanger, car steering response — is written as an ODE first and designed from its solution. Reading these equations means predicting system behavior before building it and tuning time constants deliberately."
      ),
      "laplace": T(
        "في غرف التحكم، لا يتحدث المهندسون عن معادلات تفاضلية بل عن دوال انتقال وأقطاب في مستوى s. تحليل لابلاس هو اللغة التي تُصمم بها مثبتات الطيران وأنظمة تعويض المحركات ومرشحات الإشارات — حيث يصبح الاستقرار سؤال موقع نقاط على مستوى.",
        "In control rooms, engineers speak of transfer functions and poles in the s-plane, not differential equations. Laplace analysis is how flight stabilizers, motor compensators and signal filters are designed — where stability becomes a question of where points sit on a plane."
      ),
      "matrices": T(
        "كل رسم ثلاثي الأبعاد في لعبة أو برنامج تصميم هو سلسلة ضربات مصفوفية تدور وتقرب المشهد، وكل شبكة حساسات تُعكَس رياضيًا لاستنتاج قياساتها، وكل نموذج ذكاء اصطناعي حديث في جوهره عملية مصفوفية عملاقة. إتقان هذا المسار هو إتقان الآلة الحسابية للعالم الحديث.",
        "Every 3D render in games or CAD is a chain of matrix multiplications rotating and projecting the scene; every sensor network is inverted to infer its readings; every modern AI model is, at heart, giant matrix arithmetic. Mastering this track is mastering the computational machinery of the modern world."
      ),
      "lessonNotes": {}
    },

    checks: {
      "lim-l1": [
        { ref: 2, q: T("متى نقول إن lim x→a f(x) موجودة؟", "When does lim x→a f(x) exist?"), opts: [T("عندما تكون f(a) كبيرة", "When f(a) is large"), T("عندما تتساوى الجهتان اليمنى واليسرى", "When both sides agree"), T("عندما يكون المنحنى مستقيمًا", "When the curve is straight")], ans: 1, why: T("وجود النهاية شرطه تطابق سلوك الاقتراب من الجهتين، بصرف النظر عن f(a).", "Existence requires both approach sides to agree, regardless of f(a).") },
        { ref: 0, q: T("f(1)=7 بينما lim x→1 f(x)=3. أي تفسير ممكن؟", "f(1)=7 while lim x→1 f(x)=3. Plausible?"), opts: [T("خطأ حسابي لا بد", "Must be a calculation error"), T("انقطاع قابل للحذف عند 1", "Removable discontinuity at 1"), T("النهاية غير موجودة", "The limit does not exist")], ans: 1, why: T("النهاية تصف الاقتراب فقط؛ قيمة النقطة يمكن أن تختلف — وهذا بالضبط الانقطاع القابل للحذف.", "The limit describes approach only; the point value may differ — exactly a removable discontinuity.") }
      ],
      "drv-l3": [
        { ref: 1, q: T("d/dx sin(x²) يساوي:", "d/dx sin(x²) equals:"), opts: ["cos(x²)", "2x·cos(x²)", "x²·cos(x²)"], ans: 1, why: T("قاعدة السلسلة: مشتقة الخارجية cos(u) مضروبة بمشتقة الداخلية u= x² وهي 2x.", "Chain rule: outer derivative cos(u) times inner u=x² derivative 2x.") }
      ]
    },

    viz: {
      "lim-l1": {
        fn: "(x*x-1)/(x-1)",
        label: "f(x) = (x² − 1)/(x − 1)",
        a: 1,
        L: 2,
        domain: [-1.6, 3.6],
        range: [-0.8, 4.6],
        hole: true
      },
      "lim-l3": {
        fn: "(x*x-4)/(x-2)",
        label: "f(x) = (x² − 4)/(x − 2)",
        a: 2,
        L: 4,
        domain: [-0.5, 4.5],
        range: [-0.5, 7],
        hole: true
      },
      "lim-l5": {
        fn: "t===0 ? 1 : Math.sin(t)/t",
        label: "f(x) = sin(x)/x",
        a: 0,
        L: 1,
        domain: [-9, 9],
        range: [-0.45, 1.25]
      }
    },

    tryHints: {}
  };

  MW.lessonMeta = function (lessonId, lesson, unit, track) {
    var ex = MW.lessonExtras;
    var meta = {};
    var obj = ex.objectives[lessonId];
    if (obj) meta.obj = obj;
    else {
      var title = MW.pick(lesson.title);
      meta.obj = {
        diff: 2,
        items: [
          T("شرح فكرة «" + title + "» بلغتك الخاصة", "Explain \u201C" + title + "\u201D in your own words"),
          T("حل مسألة قياسية عليها بخطوات موثقة", "Solve a standard problem on it step by step"),
          T("ربطها بموضوع الدروس التالية في مسار " + MW.pick(track.title), "Connect it to later lessons in " + MW.pick(track.title))
        ]
      };
    }
    var appTrack = ex.apps[track.id];
    var note = ex.apps.lessonNotes[lessonId];
    meta.app = note || appTrack || null;
    return meta;
  };

  MW.buildChecks = function (lesson, explainLen) {
    var authored = MW.lessonExtras.checks[lesson.id];
    if (authored && authored.length) {
      return authored.map(function (c) {
        return {
          q: MW.pick(c.q),
          opts: c.opts.map(MW.pick),
          ans: c.ans,
          why: c.why ? MW.pick(c.why) : "",
          ref: c.ref || 0
        };
      });
    }
    var easyOnes = lesson.exercises.filter(function (e) { return e.lvl === 1; }).slice(0, 2);
    if (easyOnes.length < 2) easyOnes = lesson.exercises.slice(0, 2);
    return easyOnes.map(function (e, i) {
      var blockIdx = Math.min(i, Math.max(0, explainLen - 1));
      return {
        q: MW.pick(e.q),
        opts: e.opts.slice(),
        ans: e.ans,
        why: "",
        ref: blockIdx,
        fallbackWhy: true
      };
    });
  };
})();
