(function () {
  "use strict";

  var T = function (ar, en) { return { ar: ar, en: en }; };

  MW.demo = {
    students: [
      { id: "s1", name: T("سارة العتيبي", "Sara Alotaibi"), track: "derivatives", progress: 72, weekPoints: 340, delta: 2, badges: ["streak3", "derivative"], activeToday: true },
      { id: "s2", name: T("محمد حسان", "Mohammad Hassan"), track: "integrals", progress: 64, weekPoints: 315, delta: -1, badges: ["limits"], activeToday: true },
      { id: "s3", name: T("ليان القحطاني", "Layan Alqahtani"), track: "laplace", progress: 58, weekPoints: 290, delta: 1, badges: ["streak3", "challenger"], activeToday: true },
      { id: "s4", name: T("عمر الشمري", "Omar Alshammari"), track: "matrices", progress: 81, weekPoints: 265, delta: 0, badges: ["matrix", "perfect"], activeToday: false },
      { id: "s5", name: T("نور الدين حمدي", "Nour Aldin Hamdi"), track: "odes", progress: 45, weekPoints: 240, delta: 3, badges: ["first_step"], activeToday: true },
      { id: "s6", name: T("رهف المطيري", "Rahaf Almutairi"), track: "limits", progress: 90, weekPoints: 210, delta: -2, badges: ["limits", "perfect"], activeToday: false },
      { id: "s7", name: T("كريم عبد الله", "Karim Abdullah"), track: "integrals", progress: 38, weekPoints: 185, delta: 1, badges: [], activeToday: true },
      { id: "s8", name: T("جنى الحربي", "Jana Alharbi"), track: "derivatives", progress: 52, weekPoints: 160, delta: -1, badges: ["streak3"], activeToday: true },
      { id: "s9", name: T("يوسف الزهراني", "Yousef Alzahrani"), track: "limits", progress: 30, weekPoints: 140, delta: 0, badges: ["first_step"], activeToday: false },
      { id: "s10", name: T("مريم صالح", "Mariam Saleh"), track: "matrices", progress: 66, weekPoints: 120, delta: -3, badges: ["challenger"], activeToday: true }
    ],

    badges: [
      { id: "first_step", glyph: "\u2733", shape: "hex" },
      { id: "streak3", glyph: "\u0394", shape: "tri" },
      { id: "limits", glyph: "\u221E", shape: "circle" },
      { id: "derivative", glyph: "dy/dx", shape: "hex" },
      { id: "integral", glyph: "\u222B", shape: "shield" },
      { id: "matrix", glyph: "\u229E", shape: "square" },
      { id: "challenger", glyph: "\u26A1", shape: "diamond" },
      { id: "perfect", glyph: "\u2605", shape: "circle" },
      { id: "days7", glyph: "7", shape: "hex" },
      { id: "lessons10", glyph: "10", shape: "square" },
      { id: "calcexpert", glyph: "\u2202", shape: "shield" },
      { id: "course", glyph: "\u2713", shape: "circle" },
      { id: "master", glyph: "\u03A3", shape: "diamond" }
    ],

    mistakesByTrack: {
      limits: [
        { ar: "التعويض عند النقطة نفسها بدل فحص الاقتراب منها — تذكّر: النهاية تصف الرحلة لا الوصول.", en: "Substituting AT the point instead of checking the approach — limits describe the journey." },
        { ar: "إهمال فحص الجهتين اليمنى واليسرى قبل الحكم بوجود النهاية.", en: "Skipping left/right side checks before declaring the limit exists." },
        { ar: "استخدام لوبيتال دون التأكد من صورة 0/0 أو ∞/∞ أولًا.", en: "Applying L'Hôpital without confirming 0/0 or ∞/∞ first." }
      ],
      derivatives: [
        { ar: "نسيان مشتقة الداخلية في قاعدة السلسلة — أشهر خطأ على الإطلاق.", en: "Forgetting the inner derivative in the chain rule — the #1 mistake." },
        { ar: "اشتقاق الضرب حدين بحدين بدل قاعدة المنتج.", en: "Differentiating products term-by-term instead of using the product rule." },
        { ar: "افتراض أن f′=0 يعني دائمًا قيمة قصوى دون اختبار الإشارة.", en: "Assuming f′=0 always means an extremum without the sign test." }
      ],
      integrals: [
        { ar: "إسقاط ثابت التكامل +C في الإجابة النهائية.", en: "Dropping the +C constant in the final answer." },
        { ar: "نسيان قسمة المعامل على الأس الجديد عند تكامل القوى.", en: "Forgetting to divide by the new exponent when integrating powers." },
        { ar: "خلط المساحة الموقعة بالمساحة الهندسية عند وجود أجزاء تحت المحور.", en: "Confusing signed area with geometric area when parts dip below the axis." }
      ],
      odes: [
        { ar: "إشارة p(x) الخاطئة عند بناء العامل التكاملي μ.", en: "Wrong sign of p(x) when building the integrating factor μ." },
        { ar: "إهمال الحلول الفقدانية مثل y=0 عند القسمة أثناء الفصل.", en: "Ignoring lost solutions like y≡0 when dividing during separation." },
        { ar: "تأجيل الشروط الابتدائية للنهاية بدل تطبيقها بعد الحل العام مباشرة.", en: "Delaying initial conditions instead of applying them right after the general solution." }
      ],
      laplace: [
        { ar: "نسيان خصم f(0) في خاصية المشتقة L{f′}=sF−f(0).", en: "Forgetting the −f(0) term in L{f′}=sF−f(0)." },
        { ar: "اختيار هيئة كسور جزئية خاطئة للعوامل المكررة أو التربيعية.", en: "Wrong partial-fraction form for repeated or quadratic factors." },
        { ar: "عدم التحقق من منطقة التقارب s في الجدول.", en: "Ignoring the region of convergence in table entries." }
      ],
      matrices: [
        { ar: "ضرب المصفوفات بترتيب أبعاد غير متطابق — اكتب الأبعاد أولًا.", en: "Multiplying with mismatched dimensions — write dimensions first." },
        { ar: "افتراض AB=BA — الضرب غير تبادلي!", en: "Assuming AB=BA — multiplication is not commutative!" },
        { ar: "حساب المعكوس دون فحص det≠0 أولًا.", en: "Computing an inverse without checking det≠0 first." }
      ],
      engadv: [
        { ar: "تطبيق نيوتن بمشتقة قريبة من الصفر — انفجار مضمون.", en: "Applying Newton with near-zero derivative — guaranteed blow-up." },
        { ar: "استخدام سيمبسون بعدد شرائح فردي.", en: "Using Simpson with an odd number of slices." },
        { ar: "خلط التدرج (متجه) بالتباعد (عدد) في المجالات.", en: "Confusing gradient (vector) with divergence (scalar) in fields." }
      ]
    },

    tips: [
      T("المشتقة ميلٌ لحظي: تخيلها كعدّاد سرعة، لا كمقياس مسافة.", "A derivative is an instant slope: think speedometer, not odometer."),
      T("قبل أي تكامل، اسأل نفسك: هل أعرف اشتقاق الناتج؟ التحقق العكسي يحميك.", "Before integrating, ask: can I differentiate the result? Back-checking protects you."),
      T("في المصفوفات ارسم الأبعاد قبل الضرب: (m×n)(n×p) = (m×p).", "In matrices, sketch dimensions before multiplying: (m×n)(n×p)=(m×p)."),
      T("النهايات تصف الاتجاه لا الوصول؛ فكّر في رحلة لا في نقطة.", "Limits describe approach, not arrival; think journey, not point."),
      T("لابلاس يحوّل مشاكل التفاضل إلى جبر — اختر الأداة التي تبسّط المشكلة.", "Laplace turns calculus into algebra — pick the tool that simplifies."),
      T("المهندس الجيد يعيد فحص وحداته قبل نتيجته النهائية.", "A good engineer checks units before final results."),
      T("ارسم الدالة أولًا: الرسمة البسيطة تختصر عشر دقائق من الجبر.", "Sketch first: a quick graph saves ten minutes of algebra."),
      T("قاعدة السلسلة = ضرب معدلات التغيّر عبر الطبقات، كسلسلة تروس.", "Chain rule = multiplying change rates through layers, like gear trains.")
    ],

    dailyChallenges: [
      {
        id: "dc1",
        q: T("احسب المشتقة الثانية للدالة y = x⁴ − 6x² عند x = 1", "Compute the second derivative of y = x⁴ − 6x² at x = 1"),
        answer: "0",
        hint: T("اشتق مرتين ثم عوّض", "Differentiate twice then substitute"),
        solutionTex: "y'=4x^3-12x\\quad\\Rightarrow\\quad y''=12x^2-12\\quad\\Rightarrow\\quad y''(1)=12-12=0"
      },
      {
        id: "dc2",
        q: T("أوجد lim x→3 (x²−9)/(x−3)", "Find lim x→3 (x²−9)/(x−3)"),
        answer: "6",
        hint: T("حلّل فرق مربعين", "Factor the difference of squares"),
        solutionTex: "\\frac{(x-3)(x+3)}{x-3}=x+3\\Rightarrow 6"
      },
      {
        id: "dc3",
        q: T("∫₀¹ 6x² dx يساوي:", "∫₀¹ 6x² dx equals:"),
        answer: "2",
        hint: T("2x³ عند الحدين", "Evaluate 2x³ at bounds"),
        solutionTex: "\\left[2x^3\\right]_0^1=2"
      },
      {
        id: "dc4",
        q: T("det [[4,3],[6,5]] يساوي:", "det [[4,3],[6,5]] equals:"),
        answer: "2",
        hint: T("ad − bc", "ad − bc"),
        solutionTex: "4\\cdot5-3\\cdot6=20-18=2"
      },
      {
        id: "dc5",
        q: T("حل dy/dx = 4x مع y(0) = 7، أوجد y(2)", "Solve dy/dx=4x with y(0)=7; find y(2)"),
        answer: "15",
        hint: T("y = 2x² + C ثم طبّق الشرط", "y = 2x² + C, apply condition"),
        solutionTex: "y=2x^2+7\\Rightarrow y(2)=8+7=15"
      }
    ],

    weeklyContest: {
      title: T("مسابقة الأسبوع: سباق التفاضل", "Weekly Contest: Derivatives Sprint"),
      desc: T(
        "١٠ أسئلة تفاضل متنوعة خلال الأسبوع — أعلى مجموع نقاط يتصدّر الدوري ويحصل على شارة البطل.",
        "10 varied derivative questions this week — top total leads the league and earns the Champion badge."
      ),
      endsIn: T("ينتهي السبت 11:59 مساءً", "Ends Saturday 11:59 PM"),
      reward: T("+100 نقطة للمراكز الأولى", "+100 pts for top places")
    },

    adminStats: {
      totalStudents: 1248,
      activeToday: 342,
      weeklyGrowth: "+4.2%",
      completionByTrack: [
        { label: T("النهايات", "Limits"), pct: 78 },
        { label: T("التفاضل", "Derivatives"), pct: 64 },
        { label: T("التكامل", "Integrals"), pct: 51 },
        { label: T("المعادلات التفاضلية", "Differential Equations"), pct: 37 },
        { label: T("لابلاس", "Laplace"), pct: 29 },
        { label: T("المصفوفات", "Matrices"), pct: 44 }
      ],
      hardestLessons: [
        { title: T("قاعدة السلسلة", "The Chain Rule"), rate: 46 },
        { title: T("تحليل الكسور الجزئية", "Partial Fractions"), rate: 41 },
        { title: T("النهايات غير المحددة 0/0", "Indeterminate Forms 0/0"), rate: 38 },
        { title: T("القيم الذاتية والمتجهات الذاتية", "Eigenvalues & Eigenvectors"), rate: 35 }
      ],
      faqTopics: [
        { title: T("متى أستخدم قاعدة لوبيتال؟", "When may I use L'Hôpital's rule?"), count: 87 },
        { title: T("كيف أختار u في التعويض؟", "How do I choose u in substitution?"), count: 74 },
        { title: T("ما الفرق بين التقعر والميل؟", "Concavity vs slope difference?"), count: 61 },
        { title: T("لماذا det=0 يعني عدم وجود معكوس؟", "Why does det=0 kill invertibility?"), count: 55 },
        { title: T("خطوات حل معادلة خطية أولى", "Steps for linear first-order ODE"), count: 49 }
      ]
    },

    insights: [
      { type: "weak", icon: "alert" },
      { type: "challenge", icon: "target" },
      { type: "search", icon: "search" }
    ],

    quizBankExtra: [
      { unit: "drv-u1", q: T("d/dx (sin x · cos x) :", "d/dx (sin x·cos x):"), opts: ["cos²x−sin²x", "cos²x+sin²x", "−sin(2x)/2", "cos(2x)/2"], ans: 0, pts: 10 }
    ]
  };
})();
