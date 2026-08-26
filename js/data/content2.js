(function () {
  "use strict";

  var T = function (ar, en) { return { ar: ar, en: en }; };
  var B = function (h, p, tex) { var b = { h: h, p: p }; if (tex) b.tex = tex; return b; };
  var E = function (q, opts, ans, lvl) { return { q: q, opts: opts, ans: ans, lvl: lvl }; };
  var S = function (t, tex, why) { var s = { t: t }; if (tex) s.tex = tex; if (why) s.why = why; return s; };
  var X = function (q, steps) { return { q: q, steps: steps }; };

  MW.registerTrack({
    id: "integrals", order: 3, icon: "integ", hue: "#C89A4B",
    title: T("التكامل", "Integration"),
    desc: T(
      "العملية العكسية للاشتقاق: تجميع التغييرات اللحظية لحساب المساحات والحجوم والشغل — أداة القياس في كل العلوم الهندسية.",
      "The inverse of differentiation: accumulating instantaneous change into areas, volumes and work — the measuring tool of engineering."
    ),
    units: [
      {
        id: "int-u1",
        title: T("التكامل غير المحدد", "Indefinite Integrals"),
        sub: T("المشتقة العكسية والتعويض", "Antiderivatives and substitution"),
        lessons: [
          {
            id: "int-l1",
            title: T("المشتقة العكسية والتكاملات الأساسية", "Antiderivatives & Basic Integrals"),
            minutes: 14,
            videoUrl: null,
            summary: [
              T("∫f dx = F(x)+C حيث F′=f — ولا تنسَ C أبدًا.", "∫f dx = F(x)+C where F′=f — never forget C."),
              T("قاعدة القوة التكاملية وخطتها الخاصة عند n=−1.", "Power rule for integration, with the special n=−1 case."),
              T("التحقق دائمًا بالاشتقاق العكسي.", "Always verify by differentiating back.")
            ],
            explain: [
              B(
                T("عائلة المنحنيات: لماذا +C؟", "The family of curves: why +C?"),
                T("الاشتقاق يفقد المعلومات الرأسية: مشتقة x² هي 2x، ومشتقة x²+7 هي أيضًا 2x — الثابت يموت عند الاشتقاق. لذلك عندما نعكس العملية لا نستطيع معرفة الثابت المفقود، ونحصل على عائلة كاملة من المنحنيات متطابقة الشكل ومزاحة رأسيًا. كتابة +C ليست ترفًا شكليًا؛ إسقاطها خطأ يحسب عليك درجة كاملة لأنه يعني ادعاء معرفة ما لا يُعرف.",
                ),
                "\\int f(x)\\,dx=F(x)+C\\quad\\text{where }F'=f"
              ),
              B(
                T("قاعدة القوة وحالتها الاستثنائية", "Power rule and its exception"),
                T("لرفع الأس درجة واحدة وقسمة عليه: ∫xⁿdx = xⁿ⁺¹/(n+1)+C لكل n عدا −1 لأننا نقسم على صفر! الحالة n=−1 لها قاعدة خاصة وهي مصدر اللوغاريتم الطبيعي: ∫dx/x = ln|x|+C. القيمة المطلقة ليست زينة: بدونها تفقد الإجابة صحتها للقيم السالبة. احفظ هذه الحالة الاستثنائية جيدًا فهي من أشهر فخاخ الامتحانات."),
                "\\int x^{n}dx=\\frac{x^{n+1}}{n+1}+C\\ (n\\neq-1),\\quad \\int\\frac{dx}{x}=\\ln|x|+C"
              ),
              B(
                T("الخطية: تكامل الجمع وجمع التكاملات", "Linearity: sums integrate term by term"),
                T("التكامل عملية خطية تمامًا مثل الاشتقاق: الثابت يخرج خارج التكامل، وتكامل المجموع مجموع التكاملات. هذا يعني أن أي متعددة حدود تتكامل حدًا حدًا بقاعدة القوة. استغل هذه الخطية لتنظيم عملك: وزّع أولًا، بسّط الأسس، ثم تعامل مع كل حد على حدة.")
              ),
              B(
                T("عادة المهندس: التحقق بالاشتقاق", "The engineer's habit: verify by differentiation"),
                T("بما أن التكامل عكس الاشتقاق، فأنت تملك آلة تحقق مجانية ومضمونة: اشتق إجابتك؛ إن حصلت على المكامل الأصلي فأنت محق بلا شك. اجعلها رد فعل تلقائيًا بعد كل مسألة. وفي التطبيقات الحقيقية يكون التحقق أهم بكثير: تكامل خاطئ لدالة حمل قد يقود لتصميم خاطئ.")
              )
            ],
            examples: [
              X(T("احسب ∫(3x²+4x−5)dx", "Compute ∫(3x²+4x−5)dx"), [
                S(T("تكامل كل حد بقاعدة القوة", "Integrate each term with the power rule"), "=x^3+2x^2-5x+C", T("الخطية تسمح بالعمل حدًا حدًا", "Linearity allows term-by-term work")),
                S(T("تحقق بالاشتقاق", "Verify by differentiating"), "\\frac{d}{dx}\\left[x^3+2x^2-5x+C\\right]=3x^2+4x-5", T("استعدنا المكامل الأصلي", "We recovered the original integrand"))
              ]),
              X(T("احسب ∫(1/x²)dx", "Compute ∫(1/x²)dx"), [
                S(T("اكتب بصيغة قوة سالبة", "Rewrite as a negative power"), "\\int x^{-2}\\,dx", T("قاعدة القوة تشمل الأسس السالبة", "Power rule covers negative exponents")),
                S(T("ارفع الأس وقسم عليه", "Raise exponent and divide"), "\\frac{x^{-1}}{-1}+C=-\\frac{1}{x}+C", T("لاحظ n≠−1 هنا لأن n=−2", "Note n=−2 so the rule applies"))
              ])
            ],
            exercises: [
              E(T("∫2x dx :", "∫2x dx:"), ["x²+C", "2x²+C", "2+C", "x+C"], 0, 1),
              E(T("∫cos x dx :", "∫cos x dx:"), ["−cos x+C", "sin x+C", "cos x+C", "−sin x+C"], 1, 1),
              E(T("∫(6x²−4x+1)dx :", "∫(6x²−4x+1)dx:"), ["2x³−2x²+x+C", "12x−4+C", "3x³−2x²+C", "2x³−2x+C"], 0, 2),
              E(T("∫(5/x)dx :", "∫(5/x)dx:"), ["ln|5x| فقط", "5ln|x|+C", "−5/x²+C", "5/x²"], 1, 2),
              E(T("∫√x dx يساوي:", "∫√x dx equals:"), ["2x^{3/2}/3+C", "x^{3/2}/2+C", "(1/2)√x+C", "2/√x+C"], 0, 2),
              E(T("أي إجابة خاطئة بسبب فقدان شيء أساسي؟ ∫x dx = x²/2", "Which answer is wrong due to a missing essential? ∫x dx = x²/2"), [
                "صحيحة تمامًا", "Perfectly correct",
                "ينقصها +C", "Missing +C",
                "الأس خاطئ", "Wrong exponent",
                "المعامل خاطئ", "Wrong coefficient"
              ], 1, 1)
            ]
          },
          {
            id: "int-l2",
            title: T("أسلوب التعويض u", "The Substitution Method"),
            minutes: 16,
            videoUrl: null,
            summary: [
              T("التعويض = قاعدة السلسلة بالاتجاه المعاكس.", "Substitution is the chain rule reversed."),
              T("اختر u الداخلية بحيث يظهر du في المكامل.", "Pick u as the inner function whose du appears."),
              T("في المحدد: غيّر الحدود أو ارجع لـ x قبل التعويض.", "For definite integrals: change bounds or back-substitute first.")
            ],
            explain: [
              B(
                T("من أين جاءت الفكرة؟", "Where does substitution come from?"),
                T("قاعدة السلسلة تصنع مشتقات مركبة: مشتقة F(g(x)) هي F′(g(x))·g′(x). إذا كان لديك مكامل بهذا الشكل — دالة داخلية مضروبة بمشتقتها تقريبًا — فأنت أمام أثر تركيب، والتعويض هو الأداة التي «تفكّ» هذا التركيب. لذلك حين ترى نمطًا مثل 2x·(x²+1)⁵ تعرف فورًا أن هناك دالة أبسط مختبئة خلف (x²+1).")
              ),
              B(
                T("خوارزمية الاختيار: من تكون u؟", "Selection algorithm: who is u?"),
                T("اسأل ثلاثة أسئلة مرتبة: (1) ما الجزء الداخلي الأكثر تعقيدًا؟ (2) هل مشتقته موجودة في المكامل حتى لو بمعامل ثابت؟ (3) هل يبقى بعد التحويل تكامل أبسط أعرفه؟ إذا فشل المرشح الأول جرّب التالي. أمثلة نمطية: في x·e^{x²} اختر u=x² لأن du=2x·dx موجود؛ في sin(x)/(cos²x) اختر u=cos x لأن du=−sin x dx موجود."),
                "u=g(x)\\quad\\Rightarrow\\quad du=g'(x)\\,dx"
              ),
              B(
                T("مسألة المعامل الثابت", "The constant-factor fix"),
                T("كثيرًا ما يظهر du بمعامل مختلف: مثلا تحتاج 2x dx ولديك x dx. الحل قانوني تمامًا: اضرب وقسم على 2 وسحب الثابت خارج التكامل. التكامل يغفر اختلاف الثوابت لأنه خطي. لكنه لا يغفر اختلاف الدوال — إذا لم يظهر جوهر du مهما ضربت بثابت فالتعويض المختار فاشل وابدأ من جديد.")
              ),
              B(
                T("في التكامل المحدد: حدود جديدة توفر عليك الوقت", "Definite integrals: new bounds save time"),
                T("عند حساب تكامل محدد بالتعويض لديك طريقان: إما أن ترجع النتيجة إلى x ثم تعوّض الحدود القديمة، وإما — والأذكى — أن تحوّل الحدود نفسها إلى عالم u فور التعويض وتحسب مباشرة. الطريقة الثانية تختصر الأخطاء لأنك لا تعود إلى المتغير القديم أبدًا.",
                ),
                "\\int_{a}^{b}f(g(x))g'(x)dx=\\int_{g(a)}^{g(b)}f(u)\\,du"
              )
            ],
            examples: [
              X(T("احسب ∫2x·(x²+1)⁵ dx", "Compute ∫2x·(x²+1)⁵ dx"), [
                S(T("ضع u=x²+1 فإن du=2x dx", "Set u=x²+1, then du=2x dx"), null, T("du يظهر تمامًا كما هو في المسألة", "du appears exactly as given")),
                S(T("أعد الكتابة وكامل بقاعدة القوة", "Rewrite and use the power rule"), "\\int u^5du=\\frac{u^6}{6}+C", T("صار تكامل قوي قياسي", "Became a standard power integral")),
                S(T("ارجع إلى x", "Back-substitute"), "\\frac{(x^2+1)^6}{6}+C", T("لا تنسَ الخطوة الأخيرة", "Never skip the last step"))
              ]),
              X(T("احسب ∫cos(3x)dx", "Compute ∫cos(3x)dx"), [
                S(T("u=3x و du=3dx — المعامل 3 زائد", "u=3x, du=3dx — extra factor 3"), "\\frac{1}{3}\\int\\cos u\\,du", T("اضرب وقسم بالثابت الناقص", "Multiply and divide by the missing constant")),
                S(T("كامل وأرجع", "Integrate and return"), "\\frac{\\sin(3x)}{3}+C", T("تحقق: مشتقتها cos(3x)", "Check: derivative is cos(3x)"))
              ])
            ],
            exercises: [
              E(T("∫x·e^{x²}dx :", "∫x·e^{x²}dx:"), ["e^{x²}/2+C", "e^{x²}+C", "2e^{x²}+C", "xe^{x²}+C"], 0, 2),
              E(T("∫(3x²)/(x³+2) dx :", "∫3x²/(x³+2) dx:"), ["ln|x³+2|+C", "ln(x³)+C", "3ln|x³+2|+C", "−ln|x³+2|+C"], 0, 2),
              E(T("في ∫x√(x²+9)dx ما أفضل u؟", "Best choice of u in ∫x√(x²+9)dx?"), ["u=x", "u=x²+9", "u=√x", "u=9"], 1, 1),
              E(T("∫sin(x)cos(x)dx باستخدام u=sin x :", "∫sin x cos x dx using u=sin x:"), ["sin²x/2+C", "cos²x/2+C", "−cos x+C", "sin x+C"], 0, 2),
              E(T("∫₀¹ 2x(x²+1)³dx بعد تغيير الحدود:", "∫₀¹ 2x(x²+1)³dx after changing bounds:"), ["∫₁₂ u³du", "∫₁² u³du", "∫₀¹ u³du", "∫₁⁴ u³du"], 1, 3),
              E(T("متى يفشل التعويض المختار؟", "When does your substitution fail?"), [
                "إذا كان التكامل طويلًا", "If the integral looks long",
                "إذا لم يظهر du في المكامل مهما ضربت بثابت", "If du never appears up to a constant",
                "إذا كانت u سالبة", "If u is negative",
                "لا يفشل أبدًا", "It never fails"
              ], 1, 2)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("∫x³ dx :", "∫x³ dx:"), opts: ["3x²+C", "x⁴/4+C", "x⁴+C", "4x³+C"], ans: 1 },
            { q: T("∫sin(2x)dx :", "∫sin(2x)dx:"), opts: ["cos(2x)+C", "−cos(2x)+C", "−cos(2x)/2+C", "cos(2x)/2+C"], ans: 2 },
            { q: T("∫e^{5x}dx :", "∫e^{5x}dx:"), opts: ["e^{5x}+C", "5e^{5x}+C", "e^{5x}/5+C", "e^{5x}/4+C"], ans: 2 }
          ]
        }
      },
      {
        id: "int-u2",
        title: T("التكامل المحدد وتطبيقاته", "Definite Integrals & Applications"),
        sub: T("النظرية الأساسية والمساحات", "Fundamental theorem and areas"),
        lessons: [
          {
            id: "int-l3",
            title: T("نظرية التكامل الأساسية", "The Fundamental Theorem"),
            minutes: 15,
            videoUrl: null,
            summary: [
              T("∫ₐᵇ f dx = F(b) − F(a): صافي التراكم بين الحدين.", "∫ₐᵇ f dx = F(b) − F(a): net accumulation."),
              T("الثابت C يُلغى تلقائيًا في المحدد.", "Constant C cancels automatically in definite integrals."),
              T("الجزء الأول: اشتقاق التكامل ذي الحد المتغير.", "Part one: derivative of the variable-limit integral.")
            ],
            explain: [
              B(
                T("الجسر الذي وحّد الرياضيات", "The bridge that unified mathematics"),
                T("قبل القرن السابع عشر كانت «مشكلة المساحات» و«مشكلة المماسات» مجالَين منفصلين. نظرية التكامل الأساسية أعلنت أنهما وجهان لعملة واحدة: التكامل والتقابل هما عمليتا عكس. هذا ليس جميلًا فحسب بل مفيد جدًا: لحساب مساحة تحت منحنى غريب لا نحتاج جمع ملايين المستطيلات، يكفي أن نعرف اشتقاقًا عكسيًا واحدًا ونقيّمه عند الحدين.")
              ),
              B(
                T("الجزء الأول: التكامل كدالة", "Part one: the integral as a function"),
                T("عرّف A(x)=∫ₐˣ f(t)dt — المساحة المتراكمة حتى x. النظرية تقول إن مشتقتها هي f(x) نفسها: كل خطوة صغيرة تضيف شريحة ارتفاعها f عند تلك النقطة. هذا يعطي صيغة نيوتن-لايبنتز القوية: اشتقاق تكامل بحد علوي متغير يعيد المكامل (مع سلسلة عند الحد المتغير)."),
                "\\frac{d}{dx}\\int_{a}^{x}f(t)\\,dt=f(x)"
              ),
              B(
                T("الجزء الثاني: الصيغة الحاسبة", "Part two: the evaluation formula"),
                T("لحساب ∫ₐᵇ: أوجد أي اشتقاق عكسي F، ثم احسب F(b)−F(a). لاحظ أن الثابت C يختفي تلقائيًا في الطرح — لهذا نتجاهله هنا. عبارة [F(x)]ₐᵇ هي الترميز المختصر. انتبه لترتيب الطرح: الحد العلوي أولًا؛ وقلبه يجعل نتيجتك سالبة، وهو منطقي لأن التقاطع من اليمين لليسار يعكس الاتجاه."),
                "\\int_{a}^{b}f(x)dx=\\Big[F(x)\\Big]_{a}^{b}=F(b)-F(a)"
              ),
              B(
                T("قراءة فيزيائية: تجميع معدلات", "Physical reading: accumulate rates"),
                T("إذا كانت f(t) سرعةً فإن التكامل مسافة؛ إذا كانت تدفقًا فالحجم المتراكم؛ إذا كانت قدرةً فطاقة. القاعدة الذهبية: تكامل المعدل عبر الزمن يعطي الكمية الكلية. هذه القراءة تجعل من التكامل أداة يومية للمهندس أكثر منه موضوع امتحان.")
              )
            ],
            examples: [
              X(T("احسب ∫₀² x²dx", "Compute ∫₀² x²dx"), [
                S(T("أوجد الاشتقاق العكسي", "Find an antiderivative"), "F(x)=\\frac{x^3}{3}", T("تحقق: F′=x²", "Check F′=x²")),
                S(T("طبّق الفرق عند الحدين", "Evaluate at bounds"), "\\left[\\frac{x^3}{3}\\right]_0^2=\\frac{8}{3}-0=\\frac{8}{3}", T("الحد الأدنى صفر فلم يضف شيئًا", "Lower bound zero adds nothing"))
              ])
            ],
            exercises: [
              E(T("∫₀³ 2x dx :", "∫₀³ 2x dx:"), ["6", "9", "3", "12"], 1, 1),
              E(T("∫₁ᵉ (1/x)dx :", "∫₁ᵉ (1/x)dx:"), ["ln e − ln 1", "e", "0", "1/e"], 0, 2),
              E(T("∫₂² f dx يساوي دائمًا:", "∫₂² f dx always equals:"), ["f(2)", "0", "2f(2)", "غير محدد"], 1, 1),
              E(T("∫₀^{π/2} cos x dx :", "∫₀^{π/2} cos x dx:"), ["0", "1", "−1", "π/2"], 1, 2),
              E(T("d/dx ∫₀ˣ sin(t)dt =", "d/dx of ∫₀ˣ sin(t)dt ="), ["cos x", "sin x", "−cos x", "1"], 1, 2),
              E(T("∫₁² 1/x dx مقارنة بـ ∫₂¹ 1/x dx:", "Compare ∫₁² 1/x dx with ∫₂¹ 1/x dx:"), ["متساويان", "الأول أكبر بإشارة، الثاني سالبه", "كلاهما موجب", "غير محددان"], 1, 2)
            ]
          },
          {
            id: "int-l4",
            title: T("المساحة تحت المنحنى وتطبيقات", "Area Under Curves & Applications"),
            minutes: 17,
            videoUrl: null,
            summary: [
              T("التكامل المحدد يعطي مساحة موقعة: ما دون المحور سالب.", "Definite integrals give signed area: below-axis counts negative."),
              T("للمساحة الهندسية استخدم |f| أو فصل عند الأصفار.", "True geometric area needs |f| or splitting at zeros."),
              T("بين منحنيين: تكامل (علوي − سفلي).", "Between curves: integrate (top − bottom).")
            ],
            explain: [
              B(
                T("مساحة موقعة مقابل مساحة هندسية", "Signed vs geometric area"),
                T("التكامل المحدد لا يقيس المساحة بالمعنى اليومي بل «الصافي»: ما تحت المحور يُخصم وما فوقه يُضاف. مثال شهير: ∫₀^{2π}sin x dx = 0 رغم وجود شكلين متناظرين — لأن النصف الثاني يلغي الأول. إذا طلب منك «المساحة» فعليك بأخذ القيمة المطلقة: حلّل f(x)=0 واجمع تكاملات القطع كل واحدة بقيمتها الموجبة. التمييز بين المصطلحين من أشهر فروقات الامتحانات.")
              ),
              B(
                T("المساحة بين منحنيين", "Area between two curves"),
                T("لحساب المساحة المحصورة بين y_top و y_bottom على مجال: كامل (top − bottom). القاعدة الآمنة: ارسم رسمًا سريعًا لتحديد أيهما أعلى فعلاً، لأن افتراض الأعلى خطأً يعطيك نتيجة سالبة تنبهك للمشكلة. وعندما يتقاطع المنحنيان داخل المجال فقم بتقسيمه عند نقاط التقاطع."),
                "A=\\int_{a}^{b}\\big(f_{\\text{top}}-f_{\\text{bottom}}\\big)dx"
              ),
              B(
                T("تدوير الأقراص: من المساحة إلى الحجم", "Disks: from area to volume"),
                T("لفّ المنطقة حول المحور السيني وستولّد جسم دوران. شريحة عرضية رقيقة عند x تدور فتصنع قرصًا نصف قطره R(x) وحجمه πR²dx. مجموع الأقراص — أي تكاملها — يعطي الحجم الكلي: V=π∫aᵇ R²(x)dx. هذه «طريقة الأقراص» تُستخدم في تصميم الخزانات والأعمدة وأي جسم دوراني صناعي.",
                ),
                "V=\\pi\\int_a^b R^2(x)\\,dx"
              ),
              B(
                T("تطبيقات هندسية مباشرة", "Direct engineering applications"),
                T("الشغل المبذول لتحريك جسم بقوة متغيرة W=∫F dx. مركز الكتلة لجسم غير منتظم يُحسب بتكاملات موزونة. الحمل الكلي على سدّ ماء يتزايد مع العمق: تكامل الضغط عبر الارتفاع. في كل حالة المنطق واحد: قسّم المشكلة لشرائح صغيرة، احسب مساهمة شريحة، ثم اجمع بالتكامل — وهذا هو «التفكير التكاملي» الذي يميز المهندس.")
              )
            ],
            examples: [
              X(T("مساحة المنطقة بين y=4−x² والمحور x من −2 إلى 2", "Area between y=4−x² and the x-axis on [−2,2]"), [
                S(T("الدالة غير سالبة على المجال كله", "Function nonnegative on the whole interval"), "A=\\int_{-2}^{2}(4-x^2)dx", T("لا حاجة للقيمة المطلقة هنا", "No absolute value needed")),
                S(T("كامل واستنتج", "Evaluate"), "=\\left[4x-\\frac{x^3}{3}\\right]_{-2}^{2}=\\frac{32}{3}", T("زوجية الدالة تسمح بمضاعفة النصف", "Evenness allows doubling half the work"))
              ])
            ],
            exercises: [
              E(T("المساحة تحت y=x على [0,2]:", "Area under y=x on [0,2]:"), ["1", "2", "4", "8"], 1, 1),
              E(T("∫₀^{2π} sin x dx تساوي:", "∫₀^{2π} sin x dx equals:"), ["2", "1", "0", "4π"], 2, 2),
              E(T("المساحة الهندسية بين y=sin x والمحور على [0,2π]:", "Geometric area between y=sin x and axis on [0,2π]:"), ["0", "2", "4", "π"], 2, 3),
              E(T("حجم جسم دوران بتدوير y=√x حول محور x على [0,4]:", "Volume revolving y=√x about the x-axis on [0,4]:"), ["8π", "4π", "16π", "2π"], 0, 3),
              E(T("المساحة بين y=x وy=x² على [0,1]:", "Area between y=x and y=x² on [0,1]:"), ["1/2", "1/6", "1/3", "1"], 1, 3),
              E(T("الشغل لمدّ نابض بقوة F=kx مسافة d:", "Work stretching a spring F=kx over distance d:"), ["kd", "kd²/2", "kd²", "k²d/2"], 1, 2)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("∫₀¹ (3x²)dx :", "∫₀¹ 3x² dx:"), opts: ["1", "3", "1/3", "0"], ans: 0 },
            { q: T("∫₁² (1/x)dx :", "∫₁² (1/x)dx:"), opts: ["ln2", "1", "−ln2", "2"], ans: 0 },
            { q: T("صافي المساحة الموقعة لـ y=sin x على [0,2π]:", "Net signed area of y=sin x on [0,2π]:"), opts: ["1", "2", "0", "4"], ans: 2 }
          ]
        }
      }
    ]
  });

  MW.registerTrack({
    id: "odes", order: 4, icon: "ode", hue: "#326262",
    title: T("المعادلات التفاضلية", "Differential Equations"),
    desc: T(
      "لغة الديناميكا والاهتزازات والدوائر: نمذجة الأنظمة التي يتغير فيها كل شيء بالنسبة للزمن، وحلها بخوارزميات مضمونة.",
      "The language of dynamics, vibrations and circuits: modeling evolving systems and solving them reliably."
    ),
    units: [
      {
        id: "ode-u1",
        title: T("مدخل ومعادلات الرتبة الأولى", "First-Order Equations"),
        sub: T("التصنيف والفصل والعامل التكاملي", "Classification, separation, integrating factor"),
        lessons: [
          {
            id: "ode-l1",
            title: T("تصنيف المعادلات التفاضلية", "Classifying ODEs"),
            minutes: 13,
            videoUrl: null,
            summary: [
              T("الرتبة = أعلى مشتقة، الدرجة = قوتها.", "Order = highest derivative, degree = its power."),
              T("الحل العام يحوي عدد ثوابت = الرتبة.", "General solution has constants equal to the order."),
              T("الشرط الابتدائي يحدد الثوابت ويصنع الحل الخاص.", "Initial conditions pin down constants.")
            ],
            explain: [
              B(
                T("ما الذي يميز المعادلة التفاضلية؟", "What makes an equation differential?"),
                T("معادلة اعتيادية مثل x+2=5 تسأل عن رقم. أما المعادلة التفاضلية فتسأل عن دالة كاملة: مجهولها ليس عددًا بل دالة y(x)، والمعادلة تربطها بمشتقاتها. مثال: y′=ky يقول «معدل نموك يتناسب مع حجمك» — جملة تصف آلاف الظواهر من البكتيريا إلى رأس المال إلى التفاعلات الكيميائية. لذلك تُوصف بأنها لغة الديناميكا: أي نظام يتغير مع الزمن يمكن كتابته بها."),
                "y'=k\\,y"
              ),
              B(
                T("التصنيف الثلاثي: رتبة، درجة، خطية", "The triple classification"),
                T("الرتبة هي أعلى مشتقة ظاهرة: y″+y=e^x رتبتها الثانية. الدرجة هي قوة تلك المشتقة الأعلى: (y′)³+x=y درجتها الثالثة. والخطية تعني أن y ومشتقاتها تظهر بأسس أولى وبلا حاصل ضرب بينهما وبلا دوال عليها مثل sin(y). التصنيف ليس ترفًا: كل نوع له نظريات حل خاصة، ومعرفة الرتبة تخبرك كم ثابتًا ستظهر في الحل العام.")
              ),
              B(
                T("عام وخاص وحدّي", "General, particular, singular"),
                T("الحل العام لعائلة كاملة من المنحنيات: y=Ce^{kt} مثلا. الحل الخاص عضو محدد منها بعد تثبيت الثابت بشرط ابتدائي مثل y(0)=5. والحل الحدّي نادر: حل لا يندرج ضمن العائلة العامة لأسباب فنية. عند الحل اطلب دائمًا: هل طلبت مني العائلة أم العضو؟ الشرط الابتدائي في نص المسألة هو المؤشر.")
              ),
              B(
                T("التحقق بالتعويض: عادة لا تتركها", "Verification by substitution"),
                T("لأن الحل اقتراح لدالة، يمكنك اختباره فورًا: اشتقه وعوضه في المعادلة الأصلية؛ إن تحقق التساوي فهو حل. هذه الفحصة تكشف أخطاء الجبر خلال ثوانٍ. وفي المشاريع الهندسية يكون التحقق شرط سلامة قبل استخدام النموذج في قرار تصميمي.")
              )
            ],
            examples: [
              X(T("صنّف: y″ + 3y′ + 2y = 0", "Classify: y″ + 3y′ + 2y = 0"), [
                S(T("افحص أعلى مشتقة وقوتها", "Inspect highest derivative and its power"), "\\text{order }2,\\ \\text{degree }1,\\ \\text{linear}", T("لا قوى ولا ضرب بين y ومشتقاتها", "No powers or products among y and derivatives"))
              ])
            ],
            exercises: [
              E(T("رتبة المعادلة y‴ + y′ = eˣ هي:", "The order of y‴ + y′ = eˣ is:"), ["1", "2", "3", "4"], 2, 1),
              E(T("عدد الثوابت في الحل العام لمعادلة رتبة ثانية:", "Constants in the general second-order solution:"), ["1", "2", "3", "0"], 1, 1),
              E(T("أي المعادلات غير خطية؟", "Which one is nonlinear?"), ["y″+y=0", "y′=xy", "yy′=x", "y′+2y=4"], 2, 2),
              E(T("مجهول المعادلة التفاضلية هو:", "The unknown of an ODE is:"), ["رقم", "دالة", "مشتقة فقط", "ثابت"], 1, 1),
              E(T("الدرجة في (y′)²+y=x هي:", "Degree in (y′)²+y=x is:"), ["1", "2", "3", "0"], 1, 2),
              E(T("y=Ce^{3t} حل عام لمعادلة:", "y=Ce^{3t} solves which ODE?"), ["y′=3y", "y′=3t", "y″=3y", "y′=y/3"], 0, 2)
            ]
          },
          {
            id: "ode-l2",
            title: T("المتغيرات القابلة للفصل", "Separable Equations"),
            minutes: 16,
            videoUrl: null,
            summary: [
              T("إن أمكن كتابتها dy/dx = g(x)·h(y) فارفصل ثم كامل.", "If dy/dx = g(x)h(y), separate and integrate."),
              T("انتبه للحلول الفقدانية مثل y=0.", "Watch for lost solutions like y=0 when dividing."),
              T("الشرط الابتدائي يحدد C في النهاية.", "Apply initial conditions at the end to find C.")
            ],
            explain: [
              B(
                T("الفكرة: كلٌّ مع نظيره", "Idea: keep each variable with its differential"),
                T("بعض المعادلات يمكن إعادة ترتيبها بحيث يصبح كل طرف دالة في متغير واحد فقط: dy/h(y) = g(x)dx. حينها يصبح التكامل ممكنًا على كل طرف بشكل مستقل — تكامل يسار بالنسبة لـ y ويمين بالنسبة لـ x. ليست كل المعادلات قابلة للفصل؛ هذا امتياز بنيوي يجب فحصه أولًا قبل أي محاولة حل."),
                "\\frac{dy}{dx}=g(x)h(y)\\Rightarrow\\int\\frac{dy}{h(y)}=\\int g(x)\\,dx"
              ),
              B(
                T("خوارزمية الحل الكاملة", "Full solving algorithm"),
                T("(1) تحقق من قابلية الفصل وحوّل للصورة g(x)h(y). (2) افصل: كل dy مع دالة y في طرف، كل dx مع دالة x في الآخر. (3) كامل الطرفين ولا تنسَ ثابتًا واحدا فقط — ثابتا الطرفين يدمجان في واحد. (4) حل على y صراحة إن أمكن. (5) طبّق الشرط الابتدائي لإيجاد C. (6) تحقق بالتعويض في الأصل.")
              ),
              B(
                T("فخ القسمة: الحلول الفقدانية", "Division trap: lost solutions"),
                T("للفصل اضطرينا للقسمة على h(y)، وهذه القسمة غير قانونية عندما h(y)=0. تلك القيم قد تمثل حلولًا صحيحة «ضاعت» أثناء القسمة. مثال: dy/dx=xy عند الفصل نقسم على y، لكن y≡0 حل صحيح أيضًا يجب ذكره. المهنون يفحصون أصفار h(y) يدويًا قبل إعلان الحل العام مكتملًا.")
              ),
              B(
                T("لماذا هي الأهم عمليًا؟", "Why this type matters most"),
                T("معظم نماذج الرتبة الأولى في الطبيعة قابلة للفصل: النمو الأسي، التبريد، التفريغ الإشعاعي، خلط المحاليل. حتى عندما لا تكون قابلة للفصل مباشرة فإن تعويضًا بسيطًا يجعلها كذلك. إتقان هذه الخوارزمية الست خطوات يعني قدرتك على بناء وحل نموذج ديناميكي كامل من الصفر — مهارة تُطلب في كل تخصصات الهندسة.")
              )
            ],
            examples: [
              X(T("حل dy/dx = xy مع y(0)=1", "Solve dy/dx = xy, y(0)=1"), [
                S(T("افصل: اجمع y مع dy و x مع dx", "Separate variables"), "\\frac{dy}{y}=x\\,dx", T("قسمة على y — تذكر الحل y≡0", "Dividing by y — remember y≡0")),
                S(T("كامل الطرفين", "Integrate both sides"), "\\ln|y|=\\frac{x^2}{2}+C_1", T("ثابتا الطرفين دمجا في C₁", "Both constants merged into C₁")),
                S(T("أخرج y أسّيًا وطبّق الشرط", "Exponentiate and apply condition"), "y=Ae^{x^2/2},\\ A=1\\Rightarrow y=e^{x^2/2}", T("e^{C₁} ثابت جديد موجب", "e^{C₁} becomes a positive constant"))
              ])
            ],
            exercises: [
              E(T("حل dy/dx = 2x مع y(0)=3:", "Solve dy/dx=2x, y(0)=3:"), ["y=x²+3", "y=2x²+3", "y=x²+C", "y=3x"], 0, 1),
              E(T("∫dy/y يساوي:", "∫dy/y equals:"), ["y²/2", "ln|y|+C", "1/y", "−1/y²"], 1, 1),
              E(T("أي معادلة قابلة للفصل؟", "Which is separable?"), ["y′=x+y", "y′=xy", "y′=x+y²", "y′+y=x"], 1, 2),
              E(T("الحل الفقدان في y′=y² هو:", "The lost solution in y′=y² is:"), ["y=x", "y≡0", "y≡1", "لا يوجد"], 1, 3),
              E(T("حل dy/dx = y tan x :", "Solve dy/dx = y tan x:"), ["y=C/cos x", "y=C cos x", "y=C sin x", "y=Ce^x"], 0, 3),
              E(T("بعد الفصل: ∫dy/(y+1) يعطي:", "After separating: ∫dy/(y+1) gives:"), ["ln|y+1|+C", "1/(y+1)", "y²/2+y", "−1/(y+1)²"], 0, 2)
            ]
          },
          {
            id: "ode-l3",
            title: T("الخطية الأولى والعامل التكاملي", "Linear First-Order & Integrating Factor"),
            minutes: 18,
            videoUrl: null,
            summary: [
              T("الصورة القياسية y′ + p(x)y = q(x).", "Standard form y′ + p(x)y = q(x)."),
              T("العامل μ = e^{∫p dx} يجعل اليسار مشتقة حاصل ضرب.", "μ = e^{∫p dx} turns the left side into a product derivative."),
              T("بعد الضرب بـ μ: تكامل مباشر يعطي الحل.", "After multiplying by μ: direct integration.")
            ],
            explain: [
              B(
                T("لماذا لا تكفي قابلية الفصل؟", "Why isn't separability enough?"),
                T("معادلات مثل y′ + 2y = x لا يمكن فصلها: مصطلح x مع y′ يمنع تجميع y في طرف وحده. هذه «الخطية الأولى» شائعة جدًا في الدوائر والمبادلات الحرارية، ولذلك احتاج الرياضيون خوارزمية عامة تعالجها جميعًا. الخوارزمية تسمى «العامل التكاملي» وفكرتها عبقرية: بدل تغيير المعادلة، سنضربها بكمية ذكية تجعل طرفها الأيسر مشتقة معروفة الشكل."),
                "y'+p(x)y=q(x)"
              ),
              B(
                T("بناء μ ولماذا يعمل", "Building μ and why it works"),
                T("خذ μ=e^{∫p(x)dx}. عند ضرب المعادلة كلها بـ μ يصبح الطرف الأيسر بالضبط (μy)′ — تحقق بنفسك بقاعدة المنتج: مشتقة μy هي μy′+μ′y و μ′=p·μ. هكذا اختفى «الجانب الصعب» وأصبحت المعادلة قابلة للتكامل المباشر: (μy)′=μq. ثم ∫ الطرفين وقسمة على μ. الخطوات آلية ومضمونة لكل معادلة خطية أولى بلا استثناء."),
                "(\\mu y)'=\\mu y'+\\mu' y=\\mu\\big(y'+py\\big)"
              ),
              B(
                T("بروتوكول التنفيذ بخمس خطوات", "Five-step execution protocol"),
                T("(1) رتّب المعادلة إلى الصورة القياسية — إشارة p مهمة جدًا. (2) احسب ∫p ثم ارفعه أسًا: μ. (3) اضرب المعادلة كلها بـ μ وتحقق أن اليسار (μy)′. (4) كامل الطرفين. (5) اقسم على μ للحصول على y الصريح. أخطر خطأ شائع: نساء إشارة p عند حساب μ، فينهار الحل كله. راجع الصورة القياسية مرتين.")
              ),
              B(
                T("متى تختار أي أداة؟", "Choosing your tool"),
                T("قرار سريع: هل يمكن فصل المتغيرين؟ استخدم الفصل — أسرع. هل هي خطية أولى غير قابلة للفصل؟ استخدم العامل التكاملي. هل الرتبة أعلى؟ ستحتاج أدوات المسار التالي (لابلاس أو الحل المتجانس). هذه شجرة قرار صغيرة توفّر وقت الامتحان وتنظّم تفكيرك في المشاريع.")
              )
            ],
            examples: [
              X(T("حل y′ + 2y = 4", "Solve y′ + 2y = 4"), [
                S(T("p=2 ⇒ μ=e^{∫2dx}=e^{2x}", "p=2 ⇒ μ=e^{2x}"), null, T("الصورة قياسية أصلاً", "Already in standard form")),
                S(T("اضرب وتحقق من اليسار", "Multiply and verify left side"), "(e^{2x}y)'=4e^{2x}", T("مشتقة حاصل الضرب ظهرت", "Product-rule structure appeared")),
                S(T("كامل ثم اقسم", "Integrate then divide"), "e^{2x}y=2e^{2x}+C\\Rightarrow y=2+Ce^{-2x}", T("الحد 2 هو الحل المستقر", "2 is the steady-state part"))
              ])
            ],
            exercises: [
              E(T("العامل التكاملي لـ y′+3y=x:", "Integrating factor of y′+3y=x:"), ["e^{3x}", "e^{x}", "3x", "e^{−3x}"], 0, 1),
              E(T("حل y′=y هو:", "Solution of y′=y is:"), ["y=Ce^{x}", "y=x+C", "y=Cx", "y=e^{x}+C"], 0, 1),
              E(T("μ لمعادلة y′+(1/x)y=x² هو:", "μ for y′+(1/x)y=x² is:"), ["x", "e^x", "ln x", "x²"], 0, 3),
              E(T("الخطوة الأولى قبل حساب μ:", "First step before computing μ:"), ["كامل الطرفين", "الترتيب إلى الصورة القياسية", "القسمة على y", "الاشتقاق مرتين"], 1, 1),
              E(T("حل y′ − y = e^x يستخدم μ=", "Solving y′ − y = e^x uses μ="), ["e^{x}", "e^{−x}", "e^{2x}", "x"], 0, 2),
              E(T("الطرف الأيسر بعد الضرب بـ μ هو دائمًا:", "After multiplying by μ the left side is always:"), ["(μy)′", "μ²y", "y′", "ثابت"], 0, 2)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("حل dy/dx = 3x² مع y(0)=5:", "Solve dy/dx=3x², y(0)=5:"), opts: ["y=x³+5", "y=3x³+5", "y=x³", "y=5x³"], ans: 0 },
            { q: T("حل dy/dx = ky هو:", "Solution of dy/dx = ky is:"), opts: ["y=kx+C", "y=Ce^{kx}", "y=k e^{x}", "y=C+kx"], ans: 1 },
            { q: T("μ لمعادلة y′+(1/x)y=x² هو:", "μ for y′+(1/x)y=x² is:"), opts: ["x", "e^x", "ln x", "x²"], ans: 0 }
          ]
        }
      },
      {
        id: "ode-u2",
        title: T("نمذجة هندسية", "Engineering Modeling"),
        sub: T("النمو الأسي والدوائر الكهربية", "Exponential growth and RC circuits"),
        lessons: [
          {
            id: "ode-l4",
            title: T("النمو والاضمحلال الأسي وتطبيقات", "Exponential Growth & Decay Applications"),
            minutes: 15,
            videoUrl: null,
            summary: [
              T("dN/dt = kN ⇒ N=N₀e^{kt}: النمو الذاتي المتناسب.", "dN/dt = kN ⇒ N=N₀e^{kt}."),
              T("زمن النصف t½=ln2/|k| وزمن المضاعفة ln2/k.", "Half-life t½=ln2/|k|, doubling time ln2/k."),
              T("تبريد نيوتن ودائرة RC من نفس العائلة.", "Newton cooling and RC circuits share this family.")
            ],
            explain: [
              B(
                T("من الافتراض إلى المعادلة إلى الحل", "From assumption to equation to solution"),
                T("الافتراض: معدل التغير يتناسب مع الكمية الحالية — كلما زادت البكتيريا زاد معدل انقسامها. ترجمته: dN/dt=kN. حلها بالفصل: dN/N=k dt ثم ln N=kt+C فتظهر الدالة الأسية الشهيرة N=N₀e^{kt}. لاحظ البنية: افتراض بسيط بجملة واحدة يولّد نموذجًا تنبؤيًا كاملًا — هذه قوة المعادلات التفاضلية."),
                "\\frac{dN}{dt}=kN\\Rightarrow N=N_0e^{kt}"
              ),
              B(
                T("أزمنة مميزة: نصف عمر ومضاعفة", "Characteristic times: half-life and doubling"),
                T("سؤال عملي متكرر: كم زمنًا حتى ينصف الكمية أو تتضاعف؟ ضع N=N₀/2 في الحل: e^{kt½}=1/2 فتظهر t½=ln2/|k|. النتيجة المدهشة: زمن النصف ثابت لا يعتمد على الكمية الحالية — لهذا يعمل التأريخ الكربوني. نفس الصيغة بلا إشارة سالبة تعطي زمن المضاعفة للنمو. احفظ ln2≈0.693."),
                "t_{1/2}=\\frac{\\ln 2}{|k|}"
              ),
              B(
                T("تبريد نيوتن: نموذج بفرق", "Newton cooling: a difference model"),
                T("معدل تغير الحرارة يتناسب مع فرقها عن المحيط: dT/dt=−k(T−T_s). لاحظ أنها ليست قابلة للفصل مباشرة بهيئتها لكنها خطية أولى بعامل تكاملي e^{kt}، أو بتعويض ذكي u=T−T_s تحولها لنمو أسي سالب. الحل: T=T_s+(T₀−T_s)e^{−kt} — حرارتك تقترب أسّيًا من حرارة الغرفة. هذا النموذج يُستخدم في تصميم المبادلات وتقدير أوقات التبريد الصناعي."),
                "T=T_s+(T_0-T_s)e^{-kt}"
              ),
              B(
                T("دائرة RC: الشحنة كدالة زمنية", "RC circuit: charge over time"),
                T("قانون كيرشوف لجهد بطارية على مقاومة ومكثف يعطي R(dq/dt)+q/C=V — معادلة خطية أولى بنفس بنية تبريد نيوتن. الشحنة تتشبع أسّيًا نحو CV بثابت زمني τ=RC، يقرأه المهندسون على شاشات الأوسيلوسكوب يوميًا. الخلاصة الكبرى لهذا الدرس: نموذج رياضي واحد يصف تبريد قهوة وتفريغ نووي وشحن مكثف — لذلك نتعمق في المعادلات لا في الأمثلة."),
                "q(t)=CV\\big(1-e^{-t/RC}\\big)"
              )
            ],
            examples: [
              X(T("مادة نصف عمرها 5 سنوات؛ كم تبقى من 100غ بعد 10 سنوات؟", "Half-life 5 years: remaining mass after 10 years from 100g?"), [
                S(T("عدد أنصاف الأعمار المنقضية", "Count elapsed half-lives"), "10/5=2", T("كل نصف عمر يقسم الكمية على 2", "Each half-life halves the amount")),
                S(T("طبّق الاضمحلال", "Apply decay"), "100\\cdot(1/2)^2=25\\text{g}", T("الاضمحلال أسي لا خطي", "Decay is exponential, not linear"))
              ])
            ],
            exercises: [
              E(T("dP/dt=0.02P مع P(0)=1000 تعطي P(t):", "dP/dt=0.02P, P(0)=1000 gives P(t):"), ["1000e^{0.02t}", "1000+0.02t", "20t+1000", "e^{0.02t}"], 0, 1),
              E(T("زمن نصف عمر تقريبي عند k=−0.1:", "Approximate half-life when k=−0.1:"), ["0.69 وحدة", "6.9 وحدة", "69 وحدة", "1 وحدة"], 1, 2),
              E(T("dT/dt=−k(T−Ts) نموذج لـ:", "dT/dt=−k(T−Ts) models:"), ["تبريد نيوتن", "سقوط حر", "تكاثر بكتيري", "دائرة LC"], 0, 1),
              E(T("الثابت الزمني لدائرة RC هو:", "Time constant of an RC circuit:"), ["RC", "R/C", "1/RC", "R²C"], 0, 2),
              E(T("N(t)=N₀e^{−0.05t}: بعد 20 وحدة تبقى تقريبًا:", "N(t)=N₀e^{−0.05t}: after 20 units remains ≈"), ["37% من N₀", "50%", "63%", "5%"], 0, 3),
              E(T("في دائرة RC الشحنة تتبع معادلة رتبتها:", "RC circuit charge satisfies an ODE of order:"), ["الثاني", "الأول", "الثالث", "صفر"], 1, 2)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("حل dT/dt=−k(T−Ts) نموذج لـ:", "dT/dt=−k(T−Ts) models:"), opts: ["تبريد نيوتن", "سقوط حر", "تكاثر بكتيري", "دائرة RL"], ans: 0 },
            { q: T("N(t)=N₀e^{−0.05t}: بعد 20 وحدة يتبقى تقريبًا:", "N(t)=N₀e^{−0.05t}: after 20 units remains about:"), opts: ["37% من N₀", "50% من N₀", "63% من N₀", "5% من N₀"], ans: 0 },
            { q: T("في دائرة RC الشحنة تتبع معادلة رتبتها:", "RC circuit charge satisfies an equation of order:"), opts: ["الثاني", "الأول", "الثالث", "صفر"], ans: 1 }
          ]
        }
      }
    ]
  });
})();
