(function () {
  "use strict";

  MW.content = { tracks: [] };
  MW.registerTrack = function (t) { MW.content.tracks.push(t); };

  var T = function (ar, en) { return { ar: ar, en: en }; };
  var B = function (h, p, tex) { var b = { h: h, p: p }; if (tex) b.tex = tex; return b; };
  var E = function (q, opts, ans, lvl) { return { q: q, opts: opts, ans: ans, lvl: lvl }; };
  var S = function (t, tex, why) { var s = { t: t }; if (tex) s.tex = tex; if (why) s.why = why; return s; };
  var X = function (q, steps) { return { q: q, steps: steps }; };

  MW.registerTrack({
    id: "limits", order: 1, icon: "limits", hue: "#3F7A7A",
    title: T("النهايات", "Limits"),
    desc: T(
      "بوابتك الأولى لفهم حساب التفاضل والتكامل: كيف تتصرّف الدوال قرب النقاط وعند اللانهاية، ولماذا تُعد هذه الفكرة أساس كل ما يليها.",
      "Your gateway to calculus: how functions behave near points and at infinity, and why this idea underpins everything that follows."
    ),
    units: [
      {
        id: "lim-u1",
        title: T("مقدمة في النهايات", "Introduction to Limits"),
        sub: T("المفهوم، الحدس، وأولى التقنيات", "Concept, intuition, first techniques"),
        lessons: [
          {
            id: "lim-l1",
            title: T("مفهوم النهاية والحدس الأولي", "The Concept of a Limit"),
            minutes: 14,
            videoUrl: null,
            summary: [
              T("النهاية تصف سلوك الدالة قرب نقطة، لا قيمتها عند النقطة نفسها.", "A limit describes behavior near a point, not the value at the point."),
              T("وجود النهاية عند نقطة يتطلب تطابق النهايتين اليمنى واليسرى.", "Existence requires left and right limits to agree."),
              T("جدول القيم والرسم البياني أداتان للحدس قبل الجبر.", "Tables and graphs build intuition before algebra.")
            ],
            explain: [
              B(
                T("لماذا اخترع الرياضيون فكرة النهاية؟", "Why did mathematicians invent the limit?"),
                T("تخيل أنك تقيس سرعة سيارة في لحظة بعينها. السرعة هي نسبة مسافة إلى زمن، لكن اللحظة لا تحتوي مسافة ولا زمنًا! الحل الذكي: احسب متوسط السرعة خلال فترة صغيرة جدًّا ثم لاحظ إلى أي قيمة تتقارب هذه المتوسطات كلما صغرت الفترة. هذه القيمة المقارَبة هي «السرعة اللحظية»، وفكرتها هي جوهر النهاية. المشكلة نفسها تظهر في الهندسة عند حساب ميل المماس لمنحنى، وفي الفيزياء عند حساب التيار اللحظي في مكثف.")
              ),
              B(
                T("الترميز والقراءة الصحيحة", "Notation and how to read it"),
                T("نكتب lim x→a f(x) = L ونقرأها: «نهاية الدالة عندما يقترب x من a تساوي L». انتبه: الرمز x→a يعني الاقتراب بلا وصول، لذلك لا يهم إطلاقًا هل f(a) معرفة أم لا، وما قيمتها إن كانت معرفة. النهاية تصف رحلة الاقتراب فقط.",
                ),
                "\\lim_{x \\to a} f(x) = L"
              ),
              B(
                T("النهايات المنطقتان: اليسار واليمين", "One-sided limits"),
                T("قد يقترب x من النقطة من جهتين مختلفتين، وقد يتصرف الدالة بشكل مختلف من كل جهة. لذلك نعرّف النهاية اليسرى x→a⁻ والنهاية اليمنى x→a⁺. القاعدة الذهبية: النهاية الكلية موجودة إذا وفقط إذا تساوت الجهتان وتعادلتا في القيمة.",
                ),
                "\\lim_{x\\to a^-} f(x) = \\lim_{x\\to a^+} f(x) = L"
              ),
              B(
                T("متى تفشل النهاية؟ ثلاث حالات شهيرة", "When limits fail: three classic cases"),
                T("الحالة الأولى: اختلاف الجهتين كما في دالة الإشارة عند الصفر. الثانية: التذبذب العنيف — دالة sin(1/x) تتأرجح بين −1 و1 بلا استقرار كلما اقتربنا من الصفر. الثالثة: الانفجار إلى اللانهاية كـ 1/x² عند الصفر. في كل هذه الحالات نقول إن النهاية «غير موجودة» لأن الدالة لا تستقر قرب قيمة واحدة.")
              ),
              B(
                T("تحذير مهني: جدول القيم قد يخدعك", "Professional warning: tables can deceive"),
                T("جدول القيم أداة حدس ممتازة لكنه ليس برهانًا؛ فقد تعطيك عينات قيم توحي بنهاية معينة بينما الدالة تتذبذب بين تلك العينات تمامًا. لهذا نستخدم الجداول لتوليد الفرضية، ثم نثبتها جبريًا أو بقواعد النهايات الرسمية. هذا نمط هندسي عام: الحدس يولّد، والبرهان يضمن.")
              )
            ],
            examples: [
              X(T("أوجد قيمة الدالة المقارَبة لها في الجدول: f(x)=x+2 عند اقتراب x من 1", "Approach value of f(x)=x+2 as x approaches 1"), [
                S(T("عوّض قيمًا قريبة من الجهتين", "Try nearby values from both sides"), "f(0.9)=2.9,\\quad f(0.99)=2.99,\\quad f(1.01)=3.01", T("لاحظ الاتجاه من الجهتين", "Observe the trend from both sides")),
                S(T("القيم تتقارب نحو 3 من الجهتين معًا", "Values converge to 3 from both sides"), "\\lim_{x\\to 1}(x+2)=3", T("تطابق النهايتين المنطقتين يعطي النهاية", "Matching one-sided limits give the limit"))
              ]),
              X(T("هل توجد نهاية دالة الإشارة sgn(x) عند x=0 ؟", "Does sgn(x) have a limit at x=0?"), [
                S(T("احسب كل جهة على حدة", "Compute each side separately"), "\\lim_{x\\to 0^-}\\operatorname{sgn}(x)=-1,\\quad \\lim_{x\\to 0^+}\\operatorname{sgn}(x)=+1", T("الدالة ثابتة قطعيًا حول الصفر", "The function is piecewise constant around zero")),
                S(T("الجهتان مختلفتان ⇒ النهاية غير موجودة", "Sides differ ⇒ the limit does not exist"), null, T("شرط وجود النهاية هو التطابق", "Existence requires equality of the two sides"))
              ])
            ],
            exercises: [
              E(T("ما قيمة lim x→5 (x+3) ؟", "Evaluate lim x→5 (x+3)"), ["8", "15", "5", "غير موجودة"], 0, 1),
              E(T("إذا اقتربت f(x)=1/x من x→∞ فإن f تقترب من:", "As x→∞, f(x)=1/x approaches:"), ["1", "0", "∞", "−1"], 1, 1),
              E(T("lim x→1⁻ sgn(x) يساوي:", "lim x→1⁻ sgn(x) equals:"), ["−1", "0", "+1", "غير موجودة"], 0, 2),
              E(T("f(a)=5 بينما lim x→a f(x)=2. ماذا يمكن أن نقول؟", "f(a)=5 while lim x→a f(x)=2. What can we say?"), [
                T("هذا مستحيل", "Impossible"),
                T("انقطاع قابل للحذف عند a", "Removable discontinuity at a"),
                T("الدالة مستمرة عند a", "Continuous at a"),
                T("النهاية غير موجودة", "The limit does not exist")
              ], 1, 2),
              E(T("أي دالة نهايتها عند x=0 غير موجودة بسبب التذبذب؟", "Which function fails to have a limit at 0 due to oscillation?"), ["sin(1/x)", "x²", "1/x²", "|x|"], 0, 3),
              E(T("إذا كانت النهايتان المنطقتان موجودتان وغير متساويتين فإن النهاية الكلية:", "If one-sided limits exist but differ, the overall limit:"), ["يساوي أصغر الجهتين", "يساوي أكبر الجهتين", "غير موجود", "صفر"], 2, 2)
            ]
          },
          {
            id: "lim-l2",
            title: T("التعويض المباشر والاستمرارية", "Direct Substitution & Continuity"),
            minutes: 12,
            videoUrl: null,
            summary: [
              T("الدالة المستمرة عند a تحقق: النهاية = قيمة الدالة.", "Continuity at a means the limit equals the value."),
              T("كثيرات الحدود مستمرة في كل مكان، والنسبية حيث المقام ≠ 0.", "Polynomials are continuous everywhere; rationals where denominator ≠ 0."),
              T("أنواع الانقطاع: قابل للحذف، قفزي، لانهائي.", "Discontinuity types: removable, jump, infinite.")
            ],
            explain: [
              B(
                T("الاستمرارية: أن يكون المسار متصلًا", "Continuity: an unbroken path"),
                T("حدسيًا، الدالة المستمرة هي التي يُرسم بيانيها دون رفع القلم عن الورقة. رسميًا نطلب ثلاثة شروط مجتمعة عند النقطة a: أن تكون f(a) معرفة، وأن تكون النهاية موجودة، وأن يتساوى الاثنان. فشل أي شرط يعني انقطاعًا، ولكل نوع من الفشل اسم مختلف ودلالة هندسية مختلفة."),
                "\\lim_{x\\to a} f(x) = f(a)"
              ),
              B(
                T("أنواع الانقطاع الثلاثة", "The three types of discontinuity"),
                T("الانقطاع القابل للحذف: النهاية موجودة لكنها لا تساوي القيمة أو القيمة غير معرفة — يمكن «إصلاحه» بتعريف نقطة واحدة. الانقطاع القفزي: الجهتان موجودتان لكنهما مختلفتان كما في رسوم التعرفة المتدرجة. الانقطاع اللانهائي: الدالة تنفجر نحو ∞ عند مقام معدوم مثل 1/(x−2). تشخيص النوع خطوة أولى في كل مسائل الاستمرارية.")
              ),
              B(
                T("أين نضمن الاستمرارية؟", "Where is continuity guaranteed?"),
                T("كثيرات الحدود مستمرة في كل الأعداد الحقيقية. الدوال النسبية (نسبة كثير حدود) مستمرة حيثما كان مقامها غير صفري. الجمع والطرح والضرب يحافظون على الاستمرارية، والقسمة تبقيها حيث المقام ≠ 0، وتركيب دوالتين مستمرتين ينتج دالة مستمرة. بهذه القواعد تستطيع تحديد مناطق الاستمرارية بالفحص لا بالحساب الطويل.")
              ),
              B(
                T("لماذا تهمنا في الهندسة؟", "Why engineers care"),
                T("كثير من النماذج الهندسية دوال قطعية المستمر: منحنى شحن بطارية بمراحل مختلفة، أو حمل على جسر يتغير عند مرور عجلة. الاستمرارية تعني عدم وجود قفزات مفاجئة في القيمة — وهي غالبًا شرط سلامة في التصميم. وعندما نضمن الاستمرارية نضمن عمل أدواتنا الأساسية لاحقًا مثل نظرية القيم القصوى على مجال مغلق.")
              )
            ],
            examples: [
              X(T("احسب lim x→2 (x³−5x+7)", "Compute lim x→2 (x³−5x+7)"), [
                S(T("كثير حدود ⇒ مستمر في كل مكان ⇒ عوّض مباشرة", "Polynomial ⇒ continuous everywhere ⇒ substitute directly"), "=2^3-5(2)+7=8-10+7=5", T("خاصية الاستمرارية تسمح بالتعويض", "Continuity allows direct substitution"))
              ]),
              X(T("عند أي نقاط تفشل استمرارية f(x)=(x+1)/(x²−4) ؟ وصِف نوع الانقطاع.", "Where is f(x)=(x+1)/(x²−4) discontinuous, and what type?"), [
                S(T("افحص أصفار المقام", "Find zeros of the denominator"), "x^2-4=(x-2)(x+2)=0\\Rightarrow x=\\pm 2", T("القسمة على صفر تكسر الاستمرارية", "Division by zero breaks continuity")),
                S(T("عند x=2: البسط ≠ 0 ⇒ انقطاع لانهائي. عند x=−2: البسط = −1 ≠ 0 ⇒ لانهائي أيضًا", "At x=2 numerator ≠ 0 ⇒ infinite jump; at x=−2 also infinite"), null, T("لو انعدم البسط أيضًا لصار قابلًا للحذف", "If the numerator also vanished it would be removable"))
              ])
            ],
            exercises: [
              E(T("lim x→1 (4x²−x) يساوي:", "lim x→1 (4x²−x) equals:"), ["3", "4", "5", "0"], 0, 1),
              E(T("أين تكون f(x)=(x−3)/(x²−9) غير مستمرة؟", "Where is f(x)=(x−3)/(x²−9) discontinuous?"), ["عند x=3 فقط", "عند x=−3 فقط", "عند x=±3", "لا مكان"], 2, 2),
              E(T("نوع الانقطاع في f(x)=(x²−1)/(x−1) عند x=1:", "Type of discontinuity of f(x)=(x²−1)/(x−1) at x=1:"), ["قفزي", "قابل للحذف", "لانهائي", "لا يوجد انقطاع"], 1, 2),
              E(T("أي الشرط الآتي ليس شرطًا للاستمرارية عند a؟", "Which is NOT a continuity condition at a?"), ["f(a) معرفة", "النهاية موجودة", "الدالة متزايدة", "النهاية = f(a)"], 2, 1),
              E(T("إذا كانت g مستمرة و f مستمرة فإن f∘g:", "If g and f are continuous then f∘g:"), ["غير مستمرة بالضرورة", "مستمرة", "متزايدة", "خطية"], 1, 2),
              E(T("صممت دالة تعرفة: 10 ريال لأول كم و20 ريال بعده. نوع الانقطاع عند نقطة التحول؟", "Fare: 10 for first km, 20 after. Discontinuity type at switch point?"), ["قابل للحذف", "قفزي", "لانهائي", "مستمرة"], 1, 3)
            ]
          },
          {
            id: "lim-l3",
            title: T("النهايات غير المحددة 0/0", "Indeterminate Forms 0/0"),
            minutes: 16,
            videoUrl: null,
            summary: [
              T("0/0 صورة غير محددة تعني «عمل جارٍ» وليست استحالة.", "0/0 is indeterminate — work in progress, not impossible."),
              T("التحليل وحذف العامل المشترك هو الحيلة الأولى.", "Factoring and cancelling the common factor comes first."),
              T("المرافق يعالج الجذور، وقاعدة لوبيتال خيار أخير مشروط.", "Conjugates handle radicals; L'Hôpital is a conditional last resort.")
            ],
            explain: [
              B(
                T("معنى 0/0 الحقيقي", "What 0/0 really means"),
                T("عندما يعطي التعويض المباشر 0/0 فهذا لا يعني أن النهاية مستحيلة ولا أنها تساوي واحدًا؛ بل يعني أن «سباقًا» يجري بين بسط ينكمش ومقام ينكمش، والنهاية تعتمد على من ينكمش أسرع. لهذا تسمى صورة غير محددة: الشكل وحده لا يكفي لتحديد الناتج، ونحتاج فحصًا أدق للسرعات النسبية. مثال: (x²)/(x) → 0 بينما (2x)/(x) → 1 وكلاهما 0/0 قبل التبسيط.")
              ),
              B(
                T("الاستراتيجية الأولى: حلّل واحذف", "Strategy one: factor and cancel"),
                T("في كثير من الحالات ينعدم البسط والمقام بسبب عامل مشترك واحد (x−a). حوّل البسط والمقام إلى صورة مضروبات ثم احذف هذا العامل — فأنت لا تحذف صفرًا بل تكتشف أن الدالة الأصلية تطابق دالة أبسط في كل نقطة ما عدا a نفسها، وهذا كافٍ تمامًا للنهاية. تذكّر صيغ التحليل الشهيرة: فرق مربعين، مجموع/فرق مكعبين، تجميع بالتجميع.",
                ),
                "\\frac{x^2-a^2}{x-a}=\\frac{(x-a)(x+a)}{x-a}=x+a"
              ),
              B(
                T("الاستراتيجية الثانية: المرافق للجذور", "Strategy two: conjugate for radicals"),
                T("إذا ظهر جذر في البسط والمقام ينعدمان معًا، اضرب البسط والمقام في مرافق الجذر. الناتج: البسط يتحول إلى فرق مربعين فيتبسط ويختفي الجذر، والمقام يتضخم ظاهريًا لكنه يصبح قابلًا للتعويض بعد الحذف. هذه التقنية قياسية في مسائل مثل (√(x+h)−√x)/h التي ستقابلك في تعريف المشتقة.")
              ),
              B(
                T("قاعدة لوبيتال: سلاح قوي بشروط", "L'Hôpital: powerful but conditional"),
                T("إذا أعطى التعويض 0/0 أو ∞/∞ فإن نهاية النسبة تساوي نهاية نسبة المشتقات — بشرط أن تكون هذه الأخيرة موجودة. التحذير المهني: لوبيتال لا تعمل بدون الصورة غير المحددة؛ مثال counter-example كلاسيكي: lim x→1 (x²)/(x) = 1 لكن نسبة المشتقات تعطي 2/1 = 2! تحقق دائمًا من الصورة قبل استخدام القاعدة، واستخدمها أداةً لا عادةً — فالتحليل الجبري يبقى أعمق فهمًا.")
              )
            ],
            examples: [
              X(T("احسب lim x→2 (x²−4)/(x−2)", "Compute lim x→2 (x²−4)/(x−2)"), [
                S(T("التعويض يعطي 0/0 ⇒ حلّل البسط", "Substitution gives 0/0 ⇒ factor the numerator"), "\\frac{(x-2)(x+2)}{x-2}", T("فرق مربعين", "Difference of squares")),
                S(T("احذف (x−2) — مسموح لأننا قرب a وليس عندها", "Cancel (x−2) — valid near but not at a"), "\\lim_{x\\to 2}(x+2)=4", T("بعد الحذف يصبح التعويض مباشرًا", "After cancellation substitution works"))
              ]),
              X(T("احسب lim x→0 (√(x+9)−3)/x", "Compute lim x→0 (√(x+9)−3)/x"), [
                S(T("التعويض يعطي 0/0 ⇒ اضرب بالمرافق", "0/0 ⇒ multiply by the conjugate"), "\\frac{(\\sqrt{x+9}-3)(\\sqrt{x+9}+3)}{x(\\sqrt{x+9}+3)}", T("المرافق يزيل الجذر", "Conjugate clears the radical")),
                S(T("البسط يصبح (x+9)−9 = x ويُحذف", "Numerator becomes x and cancels"), "\\lim_{x\\to 0}\\frac{1}{\\sqrt{x+9}+3}=\\frac{1}{6}", T("بعدها التعويض مباشر ومقبول", "Then direct substitution applies"))
              ])
            ],
            exercises: [
              E(T("lim x→3 (x²−9)/(x−3) يساوي:", "lim x→3 (x²−9)/(x−3) equals:"), ["0", "6", "3", "غير موجودة"], 1, 1),
              E(T("أي صورة تعد غير محددة؟", "Which form is indeterminate?"), ["5/0", "0/0", "0/5", "∞/1"], 1, 1),
              E(T("lim x→1 (x³−1)/(x−1) يساوي:", "lim x→1 (x³−1)/(x−1) equals:"), ["1", "2", "3", "0"], 2, 2),
              E(T("lim x→0 (√(x+4)−2)/x يساوي:", "lim x→0 (√(x+4)−2)/x equals:"), ["1/4", "0", "4", "1/2"], 0, 3),
              E(T("لماذا تفشل لوبيتال في lim x→2 (x²)/(x+1) ؟", "Why does L'Hôpital fail on lim x→2 x²/(x+1)?"), [
                T("لأن الدالة معقدة", "Function too complex"),
                T("لأن التعويض لا يعطي 0/0 أو ∞/∞", "Substitution gives neither 0/0 nor ∞/∞"),
                T("لأن المشتقات غير موجودة", "Derivatives do not exist"),
                T("لا تفشل، النتيجة نفسها", "It does not fail")
              ], 1, 2),
              E(T("بعد التحليل: lim x→−2 (x²+5x+6)/(x+2) =", "After factoring: lim x→−2 (x²+5x+6)/(x+2) ="), ["−1", "0", "1", "3"], 0, 2)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("lim x→4 (x−4)/(x²−16) يساوي:", "lim x→4 (x−4)/(x²−16) equals:"), opts: ["0", "1/8", "1/4", "8"], ans: 1 },
            { q: T("lim x→∞ (3x²+2x)/(x²−5) يساوي:", "lim x→∞ (3x²+2x)/(x²−5) equals:"), opts: ["0", "3", "∞", "−3"], ans: 1 },
            { q: T("إذا كانت f مستمرة عند a فإن lim x→a f(x) =", "If f is continuous at a then lim x→a f(x) ="), opts: ["f(a)", "0", "∞", "لا يمكن التحديد"], ans: 0 }
          ]
        }
      },
      {
        id: "lim-u2",
        title: T("نهايات اللانهاية والنهايات المثلثية", "Infinite & Trigonometric Limits"),
        sub: T("السلوك بعيد المدى والنهايات القياسية", "Long-run behavior and standard limits"),
        lessons: [
          {
            id: "lim-l4",
            title: T("النهايات عند اللانهاية", "Limits at Infinity"),
            minutes: 15,
            videoUrl: null,
            summary: [
              T("قارن درجات البسط والمقام في الدوال النسبية.", "Compare degrees in rational functions."),
              T("درجات متساوية ⇒ نسبة المعاملين الرئيسيين.", "Equal degrees ⇒ ratio of leading coefficients."),
              T("أدنى درجة بسط ⇒ 0، وأعلى ⇒ ±∞.", "Lower top degree ⇒ 0; higher ⇒ ±∞.")
            ],
            explain: [
              B(
                T("معنى الاقتراب من اللانهاية", "What approaching infinity means"),
                T("x→∞ ليست نقطة على المحور بل وصف اتجاه: نحن نسأل «إلى أين يستقر البياني عندما نكبّر المدخل بلا حدود؟». المفتاح الحدسي: 1/x تتلاشى نحو الصفر مهما كبّرنا x، وبناءً عليها تتلاشى كل 1/xⁿ. لذلك في أي كسر جذري، الحدود ذات الدرجة الأعلى هي التي «تتكلم» في النهاية، وسماها المهندسون الحدود المهيمنة.",
                ),
                "\\lim_{x\\to\\infty}\\frac{1}{x^n}=0"
              ),
              B(
                T("قاعدة الدرجات الثلاثية", "The three-degree rule"),
                T("لكسرة نصفية P(x)/Q(x): إذا تساوت الدرجات فالنهاية نسبة المعاملين الرئيسيين — البياني يقترب من خط أفقي عند ذلك الارتفاع. إذا كانت درجة البسط أقل فالنهاية صفر — المنحنى يهدأ على المحور. إذا كانت أعلى بمقدار فردي فالنهاية ±∞ حسب إشارة المعامل. هذه القاعدة تلخص آلاف العمليات في نظرة واحدة.")
              ),
              B(
                T("الأشكال المركبة: ∞−∞ والجذور", "Harder shapes: ∞−∞ and radicals"),
                T("صور مثل √(x²+x) − x تبدو غير محددة من نوع ∞−∞. الحيلة: ضرب بالمرافق يظهر الفرق مربعين فيتحول الكسر إلى شكل نصفية يمكن قراءته بقاعدة الدرجات. الفكرة العامة: حول أي صورة غامضة إلى كسر نصفية ثم قارن الدرجات.")
              ),
              B(
                T("قراءة هندسية: السلوك المستقر", "Engineering reading: steady-state behavior"),
                T("في الأنظمة الهندسية، نهايات اللانهاية تخبرنا بالحالة المستقرة بعد زمن طويل: أين يستقر الجهد؟ ما نسبة الخلط النهائية في خزان؟ عندما تكون النهاية صفرًا فهذا يعني تخامد التأثير، وعندما تكون نسبة ثابتة فهذا يعني استقرارًا عند قيمة تصميمية. لذلك تُقرأ هذه النهايات في كتب التحكم كـ«الاستجابة الدائمة».")
              )
            ],
            examples: [
              X(T("احسب lim x→∞ (5x³−2x)/(2x³+x)", "Compute lim x→∞ (5x³−2x)/(2x³+x)"), [
                S(T("اقسم كل حد على x³ (أعلى قوة)", "Divide every term by x³"), "=\\lim_{x\\to\\infty}\\frac{5-2/x^2}{2+1/x^2}", T("توحيد القوى يكشف السلوك", "Unifying powers reveals behavior")),
                S(T("الحدود 1/x² تتلاشى", "The 1/x² terms vanish"), "=\\frac{5}{2}", T("قاعدة الدرجات: تساوي ⇒ نسبة المعاملين", "Degree rule: equal ⇒ coefficient ratio"))
              ]),
              X(T("سلوك f(x)=√(x²+x) − x عند x→∞ ؟", "Behavior of √(x²+x) − x as x→∞?"), [
                S(T("اضرب بالمرافق", "Multiply by the conjugate"), "=\\lim_{x\\to\\infty}\\frac{x}{\\sqrt{x^2+x}+x}", T("فرق مربعين يظهر في البسط", "Difference of squares appears")),
                S(T("اقسم البسط والمقام على x", "Divide through by x"), "=\\lim\\frac{1}{\\sqrt{1+1/x}+1}=\\frac{1}{2}", T("الحدود المتلاشية تُهمل", "Vanishing terms drop out"))
              ])
            ],
            exercises: [
              E(T("lim x→∞ (7x²+3)/(x²−1) :", "lim x→∞ (7x²+3)/(x²−1):"), ["0", "7", "∞", "1"], 1, 1),
              E(T("lim x→∞ (2x+1)/(x³+5) :", "lim x→∞ (2x+1)/(x³+5):"), ["2", "∞", "0", "1"], 2, 1),
              E(T("lim x→∞ (4x³)/(8x²+x) :", "lim x→∞ 4x³/(8x²+x):"), ["0", "2", "∞", "1/2"], 2, 2),
              E(T("lim x→∞ √(x²+9x) − x :", "lim x→∞ √(x²+9x) − x:"), ["9/2", "0", "9", "∞"], 0, 3),
              E(T("خط أفقي يقتربه منحنى y=(3x+1)/(x−2) هو:", "Horizontal asymptote of y=(3x+1)/(x−2):"), ["y=0", "y=3", "y=2", "y=1"], 1, 2),
              E(T("إذا كانت درجة البسط أقل باثنين من المقام فإن النهاية:", "If numerator degree is two less than denominator's, the limit is:"), ["∞", "0", "1", "غير موجود"], 1, 1)
            ]
          },
          {
            id: "lim-l5",
            title: T("النهايات المثلثية القياسية", "Standard Trigonometric Limits"),
            minutes: 13,
            videoUrl: null,
            summary: [
              T("lim x→0 sin(x)/x = 1 بالراديان — أهم نهاية مثلثية.", "lim x→0 sin(x)/x = 1 in radians — the key trig limit."),
              T("ومشتقاتها: (1−cos x)/x² = 1/2 و tan x / x = 1.", "Companions: (1−cos x)/x² = 1/2 and tan x/x = 1."),
              T("إعادة التشكيل بالتعويض توصل أي صيغة إلى النموذج القياسي.", "Reshape with substitution to reach the standard form.")
            ],
            explain: [
              B(
                T("برهان حدسي جميل: القرص المتنافر", "A beautiful squeeze argument"),
                T("خذ قطاعًا دائريًا زاويته θ صغيرة. القطاع محصور بين مثلث صغير داخله ومثلث كبير يحيط به. بمقارنة المساحات الثلاث نحصل على المتراجحة sin θ < θ < tan θ، وقسمتها على sin θ يعطي 1 < θ/sin θ < 1/cos θ. وبما أن الطرفين يتقاربان نحو 1 فإن الوسط محصور عليه أن يساوي 1. هذه «مبرهنة الحصر» في العمل: شيء بين شيئين متطابقين يشبههما."),
                "\\lim_{\\theta\\to 0}\\frac{\\sin\\theta}{\\theta}=1"
              ),
              B(
                T("تنبيه الوحدات: الراديان فقط", "Units warning: radians only"),
                T("كل نتائج هذا الدرس صحيحة حصرًا عندما تكون الزوايا بالراديان. لو استخدمت الدرجات لظهرت sin(x°)/x ≈ π/180 وليس 1. السبب العميق: الراديان هو الوحدة التي فيها طول القوس = الزاوية × نصف القطر بلا معامل تصحيح، وهذا ما جعل البرهان الهندسي ممكنًا أصلًا. اجعل آلة حاسبتك دائمًا على وضع RAD قبل أي حساب نهايات.")
              ),
              B(
                T("العائلة الكاملة للنهايات المشتقة", "The full derived family"),
                T("من النموذج الأم نستخرج العائلة: tan(x)/x = [sin(x)/x]·[1/cos(x)] → 1. و (1−cos x)/x² → 1/2 باستخدام المتطابقة 1−cos x = 2sin²(x/2) ثم تطبيق النموذج الأم على نصف الزاوية. حفظ هذه العائلة يوفر عليك إعادة الاشتقاق في الامتحان، لكن افهم كيف وُلدت كل واحدة منها."),
                "\\frac{1-\\cos x}{x^2}=\\frac{2\\sin^2(x/2)}{x^2}\\to\\frac{1}{2}"
              ),
              B(
                T("التقنية العملية: اصنع النموذج", "Practical technique: manufacture the model"),
                T("معظم مسائل الاختبار ليست بالنموذج الخام بل تحتاج «هندسة» بسيطة: عامل مشترك ثابت، أو تعويض u = kx بحيث تظهر النسبة sin(u)/u تمامًا. الخطوات: (1) حدد ما يشبه sin(شيء)/(الشيء نفسه)، (2) اضرب وقسم بالمعامل اللازم، (3) اسحب الثابت خارج النهاية، (4) طبّق النموذج. مع التمرين تصبح هذه العين تلقائية.")
              )
            ],
            examples: [
              X(T("احسب lim x→0 sin(3x)/x", "Compute lim x→0 sin(3x)/x"), [
                S(T("اصنع النموذج: اضرب وقسم على 3", "Manufacture the model: multiply and divide by 3"), "=\\lim_{x\\to 0} 3\\cdot\\frac{\\sin(3x)}{3x}", T("لتظهر الصورة sin(u)/u", "To reveal the sin(u)/u pattern")),
                S(T("بما أن 3x→0 فالنسبة تقترب من 1", "Since 3x→0 the ratio approaches 1"), "=3\\cdot 1=3", T("اسحب الثابت خارج النهاية", "Pull the constant outside"))
              ]),
              X(T("احسب lim x→0 (1−cos(2x))/x²", "Compute lim x→0 (1−cos(2x))/x²"), [
                S(T("استخدم 1−cos(2x)=2sin²(x)", "Use 1−cos(2x)=2sin²(x)"), "=\\lim_{x\\to 0}\\frac{2\\sin^2 x}{x^2}", T("متطابقة نصف الزاوية", "Half-angle identity")),
                S(T("طبّق النموذج على sin(x)/x", "Apply the model to sin(x)/x"), "=2\\cdot 1^2=2", T("مربع النموذج الأم", "Square of the parent model"))
              ])
            ],
            exercises: [
              E(T("lim x→0 sin(5x)/x :", "lim x→0 sin(5x)/x:"), ["1", "0", "5", "∞"], 2, 1),
              E(T("lim x→0 tan(x)/x :", "lim x→0 tan(x)/x:"), ["0", "1", "∞", "غير موجودة"], 1, 1),
              E(T("lim x→0 sin(2x)/(3x) :", "lim x→0 sin(2x)/(3x):"), ["1", "2/3", "3/2", "0"], 1, 2),
              E(T("lim x→0 (1−cos x)/x² :", "lim x→0 (1−cos x)/x²:"), ["1", "1/2", "2", "0"], 1, 2),
              E(T("وضع الآلة الحاسبة الصحيح لهذه النهايات:", "Correct calculator mode for these limits:"), ["DEG", "RAD", "GRAD", "لا يهم"], 1, 1),
              E(T("lim x→0 sin(7x)/sin(2x) :", "lim x→0 sin(7x)/sin(2x):"), ["1", "7/2", "2/7", "14"], 1, 3)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("lim x→∞ (4x)/(x²+1) :", "lim x→∞ (4x)/(x²+1):"), opts: ["4", "0", "∞", "1"], ans: 1 },
            { q: T("lim x→0 sin(2x)/(3x) :", "lim x→0 sin(2x)/(3x):"), opts: ["1", "2/3", "3/2", "0"], ans: 1 },
            { q: T("lim x→∞ (2x³)/(x³−9x) :", "lim x→∞ (2x³)/(x³−9x):"), opts: ["2", "0", "∞", "9"], ans: 0 }
          ]
        }
      }
    ]
  });

  MW.registerTrack({
    id: "derivatives", order: 2, icon: "deriv", hue: "#70513B",
    title: T("التفاضل", "Derivatives"),
    desc: T(
      "قياس التغيّر اللحظي: من معدلات السرعة إلى رسم المنحنيات وتحسين التصاميم الهندسية بأقل تكلفة وأفضل أداء.",
      "Measuring instantaneous change: from velocity rates to curve sketching and engineering optimization."
    ),
    units: [
      {
        id: "drv-u1",
        title: T("بناء المشتقة", "Building the Derivative"),
        sub: T("التعريف والقواعد الأساسية", "Definition and core rules"),
        lessons: [
          {
            id: "drv-l1",
            title: T("معدل التغير والمشتقة", "Rate of Change & the Derivative"),
            minutes: 15,
            videoUrl: null,
            summary: [
              T("المشتقة = نهاية معدلات التغير المتوسطة.", "The derivative is the limit of average rates."),
              T("هندسيًا: ميل المماس عند النقطة.", "Geometrically: slope of the tangent line."),
              T("قابلية التفاضل تستلزم الاستمرارية والعكس ليس صحيحًا.", "Differentiability implies continuity, not conversely.")
            ],
            explain: [
              B(
                T("من المتوسط إلى اللحظي", "From average to instantaneous"),
                T("عندما تقول إن سرعتك في رحلة كانت 100 كم/س فأنت تتحدث عن معدل تغير متوسط عبر ساعة كاملة. لكن عداد السرعة يعرض رقمًا الآن — سرعة لحظية. كيف نحسبها؟ خذ معدل التغير عبر فاصل زمني h ثم صغّر h تدريجيًا: ساعة، دقيقة، ثانية... المشتقة هي النهاية الرياضية لهذه العملية، وهي الإجابة عن سؤال «بأي سرعة تتغير الكمية في هذه اللحظة تحديدًا؟».",
                ),
                "f'(x)=\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}"
              ),
              B(
                T("الوجه الهندسي: من القاطع إلى المماس", "Geometric face: secant becomes tangent"),
                T("الكسر [f(x+h)−f(x)]/h هو ميل خط قاطع يمر بنقطتين على المنحنى. عندما يذهب h إلى الصفر تنزلق النقطة الثانية نحو الأولى ويستقر الخط في موضع المماس. لذلك نسمي المشتقة «دالة الميل»: أدخلها أي x تعطيك ميل المنحنى عنده. هذه الصورة البصرية تفسر فورًا لماذا المشتقة الموجبة تعني صعودًا والسالبة هبوطًا والمنعدمة أفقًا مؤقتًا.")
              ),
              B(
                T("قابلية التفاضل تستلزم الاستمرارية", "Differentiability implies continuity"),
                T("إن كانت f قابلة للتفاضل عند نقطة فهي بالضرورة مستمرة عندها — لا يمكن لميلٍ محددٍ أن يوجد فوق فجوة. لكن العكس خاطئ: |x| مستمرة عند الصفر ومع ذلك ليس لها مشتقة هناك، لأن الميل من اليمين +1 ومن اليسار −1. النتيجة العملية: عند أي «زاوية حادة» أو سنّ في المنحنى توقّع عدم وجود مشتقة، وهذا مهم في نمذجة الارتطامات والاصطدامات الهندسية.")
              ),
              B(
                T("تدوينات تقرؤها في كل الكتب", "Notations you will meet everywhere"),
                T("تدوين لاغرانج f′(x) مختصر ومناسب للحسابات. تدوين ليبنتز dy/dx يذكر المتغيرات ويُفضَّل في المعادلات التفاضلية والفيزياء لأنه يعامل dy و dx ككميات. و df/dx(x₀) ترميز النقطة المحددة. كلها تصف الشيء نفسه، وإتقان التنقل بينها مهارة قراءة أساسية لأي ورقة هندية.")
              )
            ],
            examples: [
              X(T("اشتق f(x)=x² من التعريف", "Derive f′ for f(x)=x² from definition"), [
                S(T("اكتب الفرق وبسّط", "Write the difference quotient and simplify"), "\\frac{(x+h)^2-x^2}{h}=\\frac{2xh+h^2}{h}=2x+h", T("الحذف داخل النهاية مسموح لأن h≠0 أثناء الاقتراب", "Cancellation is valid since h≠0 during approach")),
                S(T("خذ النهاية عندما h→0", "Take the limit as h→0"), "f'(x)=2x", T("الحد 2x+h يستقر على 2x", "2x+h settles on 2x"))
              ]),
              X(T("بيّن أن |x| غير قابلة للتفاضل عند 0", "Show |x| is not differentiable at 0"), [
                S(T("احسب ميل اليمين", "Right slope"), "\\lim_{h\\to 0^+}\\frac{|h|}{h}=+1", T("لأن |h|=h عندما h>0", "Because |h|=h when h>0")),
                S(T("احسب ميل اليسار وقارن", "Left slope and compare"), "\\lim_{h\\to 0^-}\\frac{|h|}{h}=-1", T("اختلاف الجهتين ⇒ لا مشتقة", "Sides differ ⇒ no derivative"))
              ])
            ],
            exercises: [
              E(T("ميل المماس لـ y=x³ عند x=1 :", "Slope of tangent to y=x³ at x=1:"), ["1", "2", "3", "6"], 2, 1),
              E(T("إذا كانت f قابلة للتفاضل عند a فهي:", "If f is differentiable at a, it is:"), ["مستمرة عند a", "متزايدة", "زوجية", "لا شيء مما سبق"], 0, 1),
              E(T("من التعريف: مشتقة f(x)=5 هي:", "From definition, f′ of f(x)=5 is:"), ["5", "0", "5x", "غير معرفة"], 1, 1),
              E(T("أي دالة مستمرة لكنها غير قابلة للتفاضل عند 0؟", "Which is continuous but not differentiable at 0?"), ["x²", "|x|", "sin x", "eˣ"], 1, 2),
              E(T("f'(2)=−3 تعني أن المنحنى عند x=2:", "f'(2)=−3 means the curve at x=2:"), ["يصعد", "يهبط", "قمة", "قاع"], 1, 2),
              E(T("من التعريف: f'(x) لدالة f(x)=mx+b تساوي:", "By definition, f′ of f(x)=mx+b is:"), ["mx", "b", "m", "x"], 2, 2)
            ]
          },
          {
            id: "drv-l2",
            title: T("قواعد الاشتقاق الأساسية", "Basic Differentiation Rules"),
            minutes: 17,
            videoUrl: null,
            summary: [
              T("قاعدة القوة: (xⁿ)′ = n·xⁿ⁻¹.", "Power rule: (xⁿ)′ = n·xⁿ⁻¹."),
              T("الجمع خطي؛ الضرب والقسمة لهما قاعدتان خاصتان.", "Sums are linear; products and quotients need special rules."),
              T("جدول أساسي: eˣ و ln x و sin x و cos x.", "Core table: eˣ, ln x, sin x, cos x.")
            ],
            explain: [
              B(
                T("بناء القواعد: لماذا لا نشتق حدين الضرب حدين؟", "Why term-by-term fails for products"),
                T("الجمع والطرح «خطيان»: مشتقة المجموع مجموع المشتقات، وهذه خاصية تنبع مباشرة من حدود التعريف. لكن الحدس يخوننا عند الضرب: (uv)′ ≠ u′v′ عمومًا. جرّب مثالًا بسيطًا لتقنع نفسك: x·x = x² مشتقته 2x بينما u′v′ = 1·1 = 1. لذلك اخترع الرياضيون قاعدة المنتج المصححة، وشكلها منطقي: كل حد يأخذ المشتق من طرف ويترك الآخر سليمًا.",
                ),
                "(uv)'=u'v+uv'"
              ),
              B(
                T("قاعدة المنتج وخارج القسمة بالتفصيل", "Product and quotient rules up close"),
                T("قاعدة المنتج: أول × مشتقة الثاني + الثاني × مشتقة الأول — توزيع عادل للمشتق. قاعدة الخارج من القسمة نسخة مدفوعة الثمن منها: (البسط′ × المقام − البسط × المقام′) فوق مربع المقام. حيلة حفظ شائعة لها: «منخفض دي المرتفع ناقص المرتفع دي المنخفض، والكل فوق المنخفض مربع». اكتب القاعدتين على ورقة حتى تصبحا ردود فعل تلقائية.",
                ),
                "\\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}"
              ),
              B(
                T("جدول المشتقات الذي تستخدمه كل يوم", "The everyday derivatives table"),
                T("ثابت ← 0. قوة ← قاعدة القوة. الأسية الطبيعي eˣ ← نفسه، وهي الخاصية الفريدة التي تجعله نجمة الرياضيات التطبيقية. ln x ← 1/x. sin ← cos و cos ← −sin (لاحظ إشارة السالب التي تنساها كثيرًا). مع قاعدتي المنتج والقسمة وقاعدة السلسلة في الدرس القادم، أصبحت قادرًا نظريًا على تفاضل أي دالة تركيبية تعرفها.")
              ),
              B(
                T("تنظيم العمل: اشتفع حدًا حدًا", "Workflow: differentiate term by term"),
                T("قبل أي عملية، وزّع الدالة إلى حدود مستقلة إن أمكن، وحدد لكل حد القاعدة المناسبة (قوة؟ منتج؟ قسمة؟). ثم اجمع النتائج وبسّط بعقلانية — التبسيط المبالغ فيه أحيانًا يزيد الأخطاء بدل أن يقللها. في الهندسة نتحقق دائمًا: عوّض قيمة عددية بسيطة في مشتقتك وقارنها بالميل المقروء من الرسم.")
              )
            ],
            examples: [
              X(T("اشتق f(x)=x³·sin x", "Differentiate f(x)=x³·sin x"), [
                S(T("قاعدة المنتج: الأول×الثاني′ + الثاني×الأول′", "Product rule: first·second′ + second·first′"), "f'(x)=3x^2\\sin x+x^3\\cos x", T("كل حد يأخذ المشتق من طرف", "Each term takes one derivative"))
              ]),
              X(T("اشتق f(x)=(2x+1)/(x−3)", "Differentiate f(x)=(2x+1)/(x−3)"), [
                S(T("قاعدة الخارج من القسمة", "Quotient rule"), "f'=\\frac{2(x-3)-(2x+1)(1)}{(x-3)^2}", T("(u/v)′=(u′v−uv′)/v²", "(u/v)′=(u′v−uv′)/v²")),
                S(T("بسّط البسط", "Simplify the numerator"), "f'=\\frac{2x-6-2x-1}{(x-3)^2}=\\frac{-7}{(x-3)^2}", T("حدود x تختفي — نتيجة نظيفة", "x terms cancel — clean result"))
              ])
            ],
            exercises: [
              E(T("d/dx (x⁵) :", "d/dx (x⁵):"), ["5x⁴", "x⁴", "5x⁵", "4x⁵"], 0, 1),
              E(T("d/dx (3x⁴−2x+7) :", "d/dx (3x⁴−2x+7):"), ["12x³−2", "12x³−2x", "7x³−2", "12x³+5"], 0, 1),
              E(T("d/dx (x·cos x) :", "d/dx (x·cos x):"), ["cos x − x sin x", "cos x + x sin x", "−sin x", "x cos x"], 0, 2),
              E(T("d/dx (x²/(x+1)) :", "d/dx (x²/(x+1)):"), ["(x²+2x)/(x+1)²", "(2x(x+1)−x²)/(x+1)²", "2x/(x+1)", "1"], 1, 2),
              E(T("d/dx (ln x) عند x=e يساوي:", "d/dx (ln x) at x=e equals:"), ["e", "1/e", "1", "0"], 1, 2),
              E(T("أوجد النقطة التي يكون فيها ميل y=x²−4x مساويًا للصفر:", "Find where the slope of y=x²−4x is zero:"), ["x=0", "x=2", "x=4", "x=−2"], 1, 3)
            ]
          },
          {
            id: "drv-l3",
            title: T("قاعدة السلسلة", "The Chain Rule"),
            minutes: 16,
            videoUrl: null,
            summary: [
              T("(f∘g)′ = f′(g(x)) · g′(x) — اشتق الخارجية ثم اضرب بمشتقة الداخلية.", "(f∘g)′ = f′(g(x)) · g′(x)."),
              T("فكر فيها كمضاعفة معدلات عبر طبقات.", "Think: rates multiplied through layers."),
              T("أساس التفاضل الضمني والمعلمي.", "Foundation of implicit and parametric differentiation.")
            ],
            explain: [
              B(
                T("الفكرة: التغيّر ينتقل عبر الطبقات", "Idea: change flows through layers"),
                T("تخيل ثلاث عجلات مترابطة: دوران العجلة الأولى يسبب دوران الثانية بمعدل معين، والثانية تحرك الثالثة. سرعة الثالثة بالنسبة للأولى = حاصل ضرب النسبتين. قاعدة السلسلة هي هذا المنطق بالضبط في عالم الدوال: إذا كان y يعتمد على u و u يعتمد على x فإن تأثير x على y يمر عبر u، والمعدلات تتجمع ضربًا. لهذا يسميها الفيزيائيون «قاعدة المعدلات المتسلسلة».",
                ),
                "\\frac{dy}{dx}=\\frac{dy}{du}\\cdot\\frac{du}{dx}"
              ),
              B(
                T("الخوارزمية العملية: خارج ثم داخل", "Working algorithm: outer then inner"),
                T("عند مواجهة دالة مركبة مثل sin(5x) أو (3x²+1)⁵: حدد الطبقة الخارجية أولًا (جيب؟ قوة؟ جذر؟ لوغاريتم؟). اشتقها كما لو أن الداخل مجرد x واحد. ثم اضرب الناتج بمشتقة الداخلية كما هي. كرر إن وُجدت أكثر من طبقة. أشهر خطأ في العالم كله هنا: نسيان ضرب المشتقة الداخلية — راقب نفسك.")
              ),
              B(
                T("التفاضل الضمني: عندما تختبئ y داخل المعادلة", "Implicit differentiation"),
                T("أحيانًا لا يمكن فك y وحدها: دائرة x²+y²=25 مثلًا. الحل: اشتق الطرفين بالنسبة لـ x، وكلما قابلتَ y عاملتها كسلسلة: مشتقة y² هي 2y·y′. ثم حل المعادلة الناتجة على y′. هكذا تحصل على ميل المماس لأي نقطة على الدائرة دون استخراج صريح لـ y — تقنية أساسية في هندسة المسارات والمنحنيات.",
                ),
                "x^2+y^2=25 \\Rightarrow 2x+2y\\,y'=0"
              ),
              B(
                T("أين تظهر في الهندسة؟", "Where engineering meets the chain"),
                T("كل نمذجة تتضمن طبقات تستخدمها: معدل تغير الحمل مع الزمن حين يكون الحمل دالة للحرارة والحرارة دالة للعمق. أو تفاضل مسار روبوت معلميًا حيث الموقع دالة للزاوية والزاوية دالة للوقت. قاعدة السلسلة هي الأداة التي تربط معدل بمعدل عبر شبكة الاعتماديات — لغة التحليل الهندسي اليومية.")
              )
            ],
            examples: [
              X(T("اشتق y=(3x²+1)⁵", "Differentiate y=(3x²+1)⁵"), [
                S(T("الخارجية قوة والداخلية 3x²+1", "Outer power, inner quadratic"), "y'=5(3x^2+1)^4\\cdot(6x)", T("اشتق القوة كأن الداخل متغير واحد", "Differentiate as if inner were one variable")),
                S(T("رتّب الناتج", "Tidy up"), "y'=30x(3x^2+1)^4", T("لا تنسَ ضرب مشتقة الداخل", "Never skip multiplying by the inner derivative"))
              ]),
              X(T("أوجد ميل المماس لدائرة x²+y²=25 عند النقطة (3,4)", "Slope of tangent to x²+y²=25 at (3,4)"), [
                S(T("اشتفع الطرفين ضمنيًا", "Differentiate implicitly"), "2x+2yy'=0", T("y′ ظهرت عبر قاعدة السلسلة", "y′ appeared via the chain rule")),
                S(T("عوّض النقطة", "Substitute the point"), "y'=\\frac{-x}{y}=\\frac{-3}{4}", T("المماس عمودي على نصف القطر", "Tangent ⊥ radius — geometric check"))
              ])
            ],
            exercises: [
              E(T("d/dx (x²+4)⁷ :", "d/dx (x²+4)⁷:"), ["7(x²+4)⁶", "14x(x²+4)⁶", "7(2x)⁶", "14x"], 1, 2),
              E(T("d/dx sin(5x) :", "d/dx sin(5x):"), ["cos(5x)", "5cos(5x)", "−5cos(5x)", "5sin(5x)"], 1, 1),
              E(T("d/dx ln(x²+4) :", "d/dx ln(x²+4):"), ["1/(x²+4)", "2x/(x²+4)", "2x·ln(x²+4)", "2/x"], 1, 2),
              E(T("d/dx e^{3x²} :", "d/dx e^{3x²}:"), ["e^{3x²}", "6xe^{3x²}", "3x²e^{3x²}", "6x"], 1, 2),
              E(T("ميل المماس للدائرة x²+y²=25 عند (3,−4):", "Tangent slope to x²+y²=25 at (3,−4):"), ["3/4", "−3/4", "4/3", "−4/3"], 0, 3),
              E(T("أشهر خطأ في قاعدة السلسلة هو:", "The most common chain-rule mistake:"), [
                "نسيان مشتقة الداخلية", "Forgetting the inner derivative",
                "جمع المشتقتين", "Adding the derivatives",
                "قلب الإشارة", "Flipping the sign",
                "لا يوجد", "None"
              ], 0, 1)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("d/dx (x·eˣ) :", "d/dx (x·eˣ):"), opts: ["eˣ", "xeˣ", "(x+1)eˣ", "x²eˣ"], ans: 2 },
            { q: T("d/dx cos(2x) :", "d/dx cos(2x):"), opts: ["2sin(2x)", "−2sin(2x)", "−sin(2x)", "−2cos(2x)"], ans: 1 },
            { q: T("ميل y=x²−4x عند x=2 :", "Slope of y=x²−4x at x=2:"), opts: ["0", "2", "−4", "4"], ans: 0 }
          ]
        }
      },
      {
        id: "drv-u2",
        title: T("تطبيقات التفاضل", "Applications of Derivatives"),
        sub: T("القيم القصوى ورسم المنحنيات", "Extrema and curve sketching"),
        lessons: [
          {
            id: "drv-l4",
            title: T("القيم القصوى المحلية", "Local Extrema"),
            minutes: 18,
            videoUrl: null,
            summary: [
              T("النقاط الحرجة: f′=0 أو غير موجودة.", "Critical points: f′=0 or undefined."),
              T("اختبار الإشارة الأولى يصنف القمة من القاع.", "First-derivative sign test classifies them."),
              T("على مجال مغلق: افحص الحرجة والأطراف.", "On closed intervals: test critical points and endpoints.")
            ],
            explain: [
              B(
                T("مبرهنة فيرمات: شرط لازم لا كافٍ", "Fermat's theorem: necessary, not sufficient"),
                T("عند قمة محلية يصبح المنحنى أفقياً للحظة — لذلك المشتقة تنعدم هناك. هذه مبرهنة فيرمات: النقطة الحرجة شرط لازم لوجود قيمة قصوى داخل المجال. لكنها ليست كافية: y=x³ مشتقتها 3x² تنعدم عند الصفر والمنحنى لا قمة له هناك بل يعبر بسرعة. لذلك إصفار المشتقة «مرشح» يحتاج تحقيقًا، والتحقيق يتم باختبار الإشارة أو اختبار المشتقة الثانية.")
              ),
              B(
                T("اختبار الإشارة الأولى: اقرأ حركة السائر", "First-derivative test: read the walker's motion"),
                T("تخيل سائراً يمشي على المنحنى من اليسار لليمين والمشتقة هي اتجاه صعوده. إذا كان يصعد ثم يهبط (موجب ثم سالب) فقد عبر قمة. إذا كان يهبط ثم يصعد فقد عبر قاعًا. إذا ظل اتجاهه نفسه فالنقطة الحرجة مجرد «مستوى راحة» مثل نقطة انعطاف y=x³. هذا الاختبار بصري وآمن حتى عندما تكون المشتقة الثانية مزعجة الحساب.")
              ),
              B(
                T("القيم المطلقة على مجال مغلق", "Absolute extrema on a closed interval"),
                T("نظرية القيم القصوى تضمن وجود أعلى وأدنى قيمة على مجال مغلق محدود. الخوارزمية: (1) أوجد كل النقاط الحرجة داخل المجال، (2) احسب f عندها، (3) احسب f عند الطرفين، (4) الأكبر مطلق والأصغر مطلق. لا تنسَ النقاط التي تنعدم فيها قابلية التفاضل مثل زاوية |x| — فهي حرجة أيضًا.")
              ),
              B(
                T("مسألة تحسين هندسية كاملة", "A complete optimization example"),
                T("نريد صندوقًا مفتوحًا من صفيحة مربعة 12×12 نقص منها مربعات زوايا جانبها x. الحجم V=x(12−2x)². خطوات النمذجة الأربع: (1) ارسم وسمِّ المتغيرات، (2) اكتب الدالة الهدف وقيودها 0<x<6، (3) اشتق وساوي بصفر: V′=12x(4−x)... أي x=4، (4) تحقق أنه حد أعلى بإشارة المشتقة حوله. النتيجة: قص مربعات 2×2 يعطي أقصى حجم — قرار مصنع حقيقي مأخوذ بمشتقة واحدة.")
              )
            ],
            examples: [
              X(T("أوجد القيم القصوى المحلية لـ f(x)=x³−3x", "Find local extrema of f(x)=x³−3x"), [
                S(T("اشتق وساوي بصفر", "Differentiate and set to zero"), "f'=3x^2-3=0\\Rightarrow x=\\pm 1", T("النقاط الحرجة مرشحات فقط", "Critical points are only candidates")),
                S(T("افحص إشارة f′ حول كل نقطة", "Check f′ signs around each point"), "x=-1:\\ max,\\quad x=1:\\ min", T("+ إلى − قمة، − إلى + قاع", "+→− peak, −→+ valley")),
                S(T("احسب القيم", "Compute values"), "f(-1)=2,\\quad f(1)=-2", T("القيمة العظمى 2 والصغرى −2", "Max value 2, min −2"))
              ])
            ],
            exercises: [
              E(T("النقاط الحرجة لـ f(x)=x²−6x+5 عند x=", "Critical point of f(x)=x²−6x+5 at x="), ["3", "−3", "5", "1"], 0, 1),
              E(T("إذا تغيرت f′ من سالب إلى موجب عند c فإن f(c):", "If f′ changes − to + at c then f(c) is a:"), ["قيمة عظمى", "قيمة صغرى", "نقطة انقلاب", "لا شيء"], 1, 1),
              E(T("f′(c)=0 لكن ليست قمة ولا قاع. مثال مطابق:", "f′(c)=0 yet neither max nor min. Example:"), ["y=x² عند 0", "y=x³ عند 0", "y=|x|", "y=sin x عند 0"], 1, 2),
              E(T("القيمة المطلقة العظمى لـ f(x)=−x²+4x على [0,5]:", "Absolute max of f(x)=−x²+4x on [0,5]:"), ["0", "4", "5", "−5"], 1, 2),
              E(T("صندوق من صفيحة 12×12 بأقصى حجم يقص زوايا:", "Max-volume box from a 12×12 sheet cuts corners of:"), ["1×1", "2×2", "3×3", "4×4"], 1, 3),
              E(T("شرط فيرمات عند القيمة القصوى الداخلية:", "Fermat's condition at an interior extremum:"), ["f″=0", "f′=0 أو غير موجودة", "f مستمرة فقط", "النقطة طرف مجال"], 1, 2)
            ]
          },
          {
            id: "drv-l5",
            title: T("التقعر ونقاط الانقلاب", "Concavity & Inflection"),
            minutes: 15,
            videoUrl: null,
            summary: [
              T("f″>0 مقعرة لأعلى، f″<0 لأسفل.", "f″>0 opens up, f″<0 opens down."),
              T("نقطة الانقلاب: تغيّر التقعر.", "Inflection: concavity changes."),
              T("منهجية رسم كاملة تجمع كل الأدوات.", "Full sketching workflow combines all tools.")
            ],
            explain: [
              B(
                T("المشتقة الثانية: ميل الميل", "Second derivative: slope of the slope"),
                T("إذا كانت f′ تخبرك هل تصعد أم تهبط، فإن f″ تخبرك هل صعودك يشتد أم يخفت. تقنيًا هي معدل تغير الميل: عندما f″>0 فإن الميل يتزايد والمنحنى ينحني كالفنجان المقلوب (مقعرة لأعلى) ويلتقي المماسي من الأسفل؛ وعندما f″<0 ينحني كالقبة. هذا «اختبار المقبض»: امسك المنحنى من الأسفل إن كان فنجانًا."),
                "\\text{concave up}: f''>0"
              ),
              B(
                T("اختبار المشتقة الثانية للقصوى", "Second-derivative test"),
                T("عند نقطة حرجة f′(c)=0: إذا كانت f″(c)>0 فالمنحنى مقعر لأعلى عندها ⇒ قاع (قيمة صغرى). إذا كانت f″(c)<0 ⇒ قمة. أما إذا كانت f″(c)=0 فالاختبار «لا يقرر» وتعود لإشارة f′ حول النقطة. عمليًا هذا الاختبار أسرع من اختبار الإشارة عندما تكون المشتقة الثانية سهلة الحساب.")
              ),
              B(
                T("نقاط الانقلاب", "Inflection points"),
                T("نقطة الانقلاب هي حيث يتغير التقعر من فنجان إلى قبة أو العكس، وعندها عادةً f″ تعبر الصفر — لكن العبور وحده لا يكفي: يجب أن يتغير الإشارة فعلاً، تمامًا كما فعلنا مع f′ في القيم القصوى. هندسيًا هذه النقاط مهمة في تصميم الطرق والسكك: الانتقال بين مقطرين هو حيث تُدار منحنيات التنعيم لتوزيع القوة الطاردة المركزية بسلاسة.")
              ),
              B(
                T("منهجية الرسم الكاملة", "The full curve-sketching protocol"),
                T("لرسم أي دالة باحتراف: (1) النطاق ونقاط التقاطع، (2) التناظر (زوجية/فردية)، (3) f′ ⇒ فترات صعود وهبوط وقيم قصوى، (4) f″ ⇒ تقعر وانقلابات، (5) النهايات عند اللانهاية والخطوط المقاربة، (6) اجمع كل شيء في رسم واحد. هذه القائمة هي «قائمة فحص قبل الإقلاع» لكل مهندس يقرأ سلوك نظام من معادلته.")
              )
            ],
            examples: [
              X(T("أوجد نقاط انقلاب f(x)=x³−6x²+9x", "Inflection points of f(x)=x³−6x²+9x"), [
                S(T("المشتقة الثانية", "Second derivative"), "f''=6x-12=0\\Rightarrow x=2", T("مرشح انقلاب عند إصفار f″", "Zero of f″ is the candidate")),
                S(T("تحقق من تغير الإشارة", "Verify the sign change"), "x<2:\\ f''<0,\\quad x>2:\\ f''>0", T("تغير التقعر مؤكد ⇒ انقلاب عند (2,2)", "Confirmed change ⇒ inflection at (2,2)"))
              ])
            ],
            exercises: [
              E(T("f″>0 على مجال ما يعني المنحنى:", "f″>0 on an interval means the curve is:"), ["مقعرة لأعلى", "مقعرة لأسفل", "متزايدة دائمًا", "ثابتة"], 0, 1),
              E(T("عند نقطة انقلاب تكون f″:", "At an inflection point f″ typically:"), ["موجبة", "سالبة", "تعبر الصفر بتغير إشارة", "غير معرفة دائمًا"], 2, 1),
              E(T("نقطة انقلاب f(x)=x⁴−4x³ عند x=", "Inflection point of f(x)=x⁴−4x³ at x="), ["0", "2", "3", "4"], 1, 3),
              E(T("إذا كانت f′>0 و f″>0 فإن الدالة:", "If f′>0 and f″>0 the function is:"), ["تصعد وتشتد", "تصعد ويخفت صعودها", "تهبط", "ثابتة"], 0, 2),
              E(T("اختبار المشتقة الثانية «لا يقرر» عندما:", "The second-derivative test is inconclusive when:"), ["f″>0", "f″<0", "f″=0", "f′≠0"], 2, 2),
              E(T("f(x)=x³: عند x=0 لدينا:", "For f(x)=x³ at x=0 we have:"), ["قيمة عظمى", "قيمة صغرى", "نقطة انقلاب", "لا شيء"], 2, 2)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("القيمة العظمى المحلية لـ f(x)=x³−3x تحدث عند x=", "Local max of f(x)=x³−3x occurs at x="), opts: ["−1", "1", "0", "3"], ans: 0 },
            { q: T("نقطة انقلاب f(x)=x⁴−4x³ عند x=", "Inflection point of f(x)=x⁴−4x³ at x="), opts: ["0", "2", "3", "4"], ans: 1 },
            { q: T("إذا كانت f′>0 و f″<0 فإن الدالة:", "If f′>0 and f″<0 the function is:"), opts: ["متزايدة مقعرة لأعلى", "متزايدة مقعرة لأسفل", "متناقصة مقعرة لأعلى", "ثابتة"], ans: 1 }
          ]
        }
      }
    ]
  });
})();
