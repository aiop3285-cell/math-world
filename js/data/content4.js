(function () {
  "use strict";

  var T = function (ar, en) { return { ar: ar, en: en }; };
  var B = function (h, p, tex) { var b = { h: h, p: p }; if (tex) b.tex = tex; return b; };
  var E = function (q, opts, ans, lvl) { return { q: q, opts: opts, ans: ans, lvl: lvl }; };
  var S = function (t, tex, why) { var s = { t: t }; if (tex) s.tex = tex; if (why) s.why = why; return s; };
  var X = function (q, steps) { return { q: q, steps: steps }; };

  MW.registerTrack({
    id: "engadv", order: 7, icon: "gear", hue: "#54706B",
    title: T("الطرق الهندسية المتقدمة", "Advanced Engineering Topics"),
    desc: T(
      "الوحدات المتقدمة للرياضيات الهندسية: الطرق العددية، حساب المتجهات، والمعادلات التفاضلية الجزئية.",
      "Advanced Engineering Mathematics units: numerical methods, vector calculus and PDEs."
    ),
    units: [
      {
        id: "engadv-u1",
        title: T("الطرق العددية", "Numerical Methods"),
        sub: T("الحلول التقريبية عندما تفشل الصيغ المغلقة", "Approximate solutions when closed forms fail"),
        lessons: [
          {
            id: "eng-l1",
            title: T("لماذا الطرق العددية؟ وفكرة الخطأ", "Why Numerical? & the Idea of Error"),
            minutes: 13,
            videoUrl: null,
            summary: [
              T("كثير من المسائل الهندسية لا تملك حلاً تحليليًا مغلقًا.", "Many engineering problems have no closed-form solution."),
              T("الحل العددي = متتالية تقريبات تتقارب نحو الجواب.", "A numerical solution = a sequence of approximations converging to the answer."),
              T("الخطأ المطلق |تقريب − حقيقي| هو مقياس الجودة.", "Absolute error |approx − exact| measures quality.")
            ],
            explain: [
              B(T("الحقيقة الصادمة", "The honest truth"),
                T("في الجامعة تتعلم حل المعادلات بالصيغ الجميلة، لكن في الهندسة العملية معظم المعادلات — من تدفق الهواء فوق جناح إلى إجهاد جسر معقد — لا تُحل بالرموز إطلاقًا. الحل الوحيد: خوارزميات عددية تعطي أرقامًا تقترب من الجواب بدقة نتحكم بها. لهذا تُعد الطرق العددية لغة الحاسوب الهندسي الأولي.")),
              B(T("التقارب: الاقتراب خطوة خطوة", "Convergence: step by step"),
                T("الفكرة المركزية: ابدأ بتخمين، طبّق قاعدة تحسين، احصل على تخمين أفضل، كرر. كل دورة تسمى «تكرار iteration». نقيس الجودة بالخطأ المطلق بين تقريبنا والقيمة الحقيقية، ونستمر حتى يصغر الخطأ عن حد التسامح المطلوب في التصميم."),
                "|\\text{approx} - \\text{exact}| < \\varepsilon"
              ),
              B(T("مقايضة: دقة مقابل زمن", "Trade-off: accuracy vs time"),
                T("كل تكرار يكلف زمن حاسوب. مضاعفة الدقة قد تعني مضاعفة التكرارات أو أكثر. المهندس يختار ε بحسب الحاجة: تصميم أولي يتسامح مع 1%، بينما حسابات سلامة جناح طائرة تطلب دقة أعلى بكثير. هذه المقايضة تحكم كل خوارزمية عددية ستتعلمها.")
              )
            ],
            examples: [
              X(T("قرّب √2 بالتنصيف بين 1 و2 لثلاثة تكرارات", "Approximate √2 by bisection on [1,2], 3 iterations"), [
                S(T("الدالة f(x)=x²−2، نفحص منتصف الفترة", "f(x)=x²−2, test midpoint"), "f(1.5)=0.25>0", T("الجذر بين 1 و1.5", "Root lies in [1,1.5]")),
                S(T("التكرار الثاني: منتصف [1,1.5]", "Iteration 2: midpoint of [1,1.5]"), "f(1.25)=-0.4375<0", T("الجذر بين 1.25 و1.5", "Root in [1.25,1.5]")),
                S(T("التكرار الثالث", "Iteration 3"), "f(1.375)=-0.109<0\\Rightarrow\\text{root}\\approx1.44", T("نقترب من 1.4142…", "Approaching 1.4142…"))
              ])
            ],
            exercises: [
              E(T("الحل العددي يعني:", "A numerical solution means:"), [T("جوابًا تقريبيًا يتقارب", "An approximation that converges", ), T("جوابًا خاطئًا", "A wrong answer"), T("حلاً بدون حاسوب", "Solving without computers")], 0, 1),
              E(T("الخطأ المطلق يقارن:", "Absolute error compares:"), [T("تقريبًا بالقيمة الحقيقية", "Approximation with exact value"), T("حاسوبين", "Two computers"), T("زمنين", "Two times")], 0, 1),
              E(T("في التنصيف، بعد كل تكرار يصغر طول الفترة:", "In bisection, interval length shrinks by:"), ["نصف", "الربع", "الضعف", "لا يتغير"], 0, 2),
              E(T("تصغير حد التسامح ε يعني عادة:", "Smaller tolerance ε usually means:"), [T("تكرارات أكثر", "More iterations"), T("تكرارات أقل", "Fewer iterations"), T("نفس العدد", "Same count"), T("لا علاقة", "Unrelated")], 0, 2),
              E(T("√3 يقع بين الفترة:", "√3 lies between:"), ["[1,2]", "[2,3]", "[0,1]", "[3,4]"], 0, 2)
            ]
          },
          {
            id: "eng-l2",
            title: T("إيجاد الجذور: التنصيف وطريقة نيوتن", "Root Finding: Bisection & Newton"),
            minutes: 16,
            videoUrl: null,
            summary: [
              T("التنصيف: بسيط ومضمون لكن بطيء (يقسم الفترة نصفين كل مرة).", "Bisection: simple and guaranteed but slow."),
              T("نيوتن-رافسون: سريع جداً باستخدام المشتقة.", "Newton-Raphson: very fast using the derivative."),
              T("شرط نيوتن: تخمين أولي جيد وقابلة للتفاضل.", "Newton needs a good initial guess and differentiability.")
            ],
            explain: [
              B(T("طريقة التنصيف: التقسيم الآمن", "Bisection: the safe splitter"),
                T("إذا كانت f متصلة و f(a) و f(b) بإشارتين مختلفتين، فبنظرية القيم الوسطى يوجد جذر بينهما. نأخذ المنتصف ونجيب السؤال: في أي نصف يقع الجواب؟ نحتفظ بالنصف الذي تختلف إشارتا طرفيه، ونكرر. كل خطوة تضمن تقليص الفترة للنصف — بطيء لكنه لا يفشل أبدًا، لذلك يستخدم لتوليد تخمين أولي آمن لطرق أسرع."),
                "x_m=\\frac{a+b}{2}"
              ),
              B(T("نيوتن-رافسون: الانزلاق على المماس", "Newton-Raphson: sliding on the tangent"),
                T("من تخمين xₙ، ارسم المماس عند النقطة، وإين تقاطع المماس مع المحور x ضعه تخمينًا جديدًا. رياضيًا: x_{n+1} = x_n − f(x_n)/f′(x_n). القوة: يتضاعف عدد الأرقام الصحيحة تقريبًا كل تكرار (تقارب تربيعي). الخطر: تخمين أولي سيئ أو نقطة مشتقة صغيرة قد يبعثرانه."),
                "x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}"
              ),
              B(T("متى تختار أيهما؟", "Which one to pick?"),
                T("عندك مشتقة سهلة وتخمين معقول؟ نيوتن — أسرع بكثير. الدالة معقدة أو المشتقة غير متاحة أو تريد ضمانًا مطلقًا؟ التنصيف. في البرامج الهندسية الحقيقية تُدمج الطرق: نيوتن للسرعة، ومعه ضمانة تنصيف عند التعثر — هذا يسمى أساليب هجينة مثل Brent المستخدمة في أدوات MATLAB وSciPy.")
              )
            ],
            examples: [
              X(T("حل x²−5=0 بنيوتن من x₀=2", "Solve x²−5=0 by Newton from x₀=2"), [
                S(T("الدالة ومشتقتها", "Function and derivative"), "f=x^2-5,\\ f'=2x", T("كل ما يحتاجه نيوتن", "All Newton needs")),
                S(T("التكرار الأول", "First iteration"), "x_1=2-\\frac{4-5}{4}=2.25", T("اقتربنا من 2.236…", "Approaching 2.236…")),
                S(T("التكرار الثاني", "Second iteration"), "x_2=2.25-\\frac{0.0625}{4.5}=2.2361", T("4 أرقام صحيحة بعد تكرارين!", "4 correct digits in two iterations!"))
              ])
            ],
            exercises: [
              E(T("شرط بدء التنصيف على [a,b]:", "Bisection starting condition on [a,b]:"), ["f(a)·f(b)<0", "f(a)=f(b)", "f′=0", "a>b"], 0, 2),
              E(T("صيغة نيوتن هي:", "Newton's update is:"), ["x−f/f′", "x+f/f′", "f′/f", "x−f′/f"], 0, 1),
              E(T("سرعة تقارب نيوتن تسمى:", "Newton's convergence speed is called:"), ["خطية", "تربيعية", "أسية", "لا تقارب"], 1, 2),
              E(T("حل cos x = x يبدأ عادة من x₀=1 يعطي تقريبًا:", "cos x = x from x₀=1 gives ≈"), ["0.739", "1.000", "0.500", "π/4"], 0, 3),
              E(T("خطر نيوتن الرئيسي:", "Main Newton risk:"), ["بطء", "تباعد عند تخمين سيئ", "يحتاج جدول", "لا يوجد"], 1, 2),
              E(T("عدد تكرارات التنصيف لتقليص فترة 1 إلى أقل من 0.001 تقريبًا:", "Bisection iterations to shrink [1] below 0.001 ≈"), ["5", "10", "20", "100"], 1, 3)
            ]
          },
          {
            id: "eng-l3",
            title: T("التكامل العددي: شبه المنحرف وسيمبسون", "Numerical Integration: Trapezoid & Simpson"),
            minutes: 15,
            videoUrl: null,
            summary: [
              T("عندما يتعذر التكامل التحليلي نقرّب المساحة بأشكال هندسية.", "When analytic integration fails, approximate area with shapes."),
              T("شبه المنحرف: يوصل النقاط بخطوط مستقيمة.", "Trapezoid: connect points with straight lines."),
              T("سيمبسون: قطع مكافئ عبر ثلاث نقاط — أدق بكثير.", "Simpson: parabola through points — much more accurate.")
            ],
            explain: [
              B(T("الفكرة: قسّم واجمع", "Idea: slice and sum"),
                T("قسّم الفترة [a,b] إلى n شريحة صغيرة، قرّب مساحة كل شريحة بشكل هندسي بسيط، ثم اجمع. كلما صغرت الشرائح قلّ الخطأ. هذه هي الفكرة نفسها التي يقوم عليها كل برنامج يحسب أحمالًا أو طاقات متكاملة رقميًا."),
                "\\int_a^b f(x)dx\\approx\\sum \\text{(slice areas)}"
              ),
              B(T("قاعدة شبه المنحرف", "Trapezoidal rule"),
                T("كل شريحتين متجاورتين تشكلان شبه منحرف ارتفاعه h وضلعاه f(x_i) و f(x_{i+1}). جمعها يعطي الصيغة الشهيرة — لاحظ أن النقاط الوسطى وزنها 2 والطرفان وزن 1:"),
                "\\int_a^b f\\,dx\\approx\\frac{h}{2}\\Big[f_0+2f_1+2f_2+\\cdots+2f_{n-1}+f_n\\Big]"
              ),
              B(T("قاعدة سيمبسون: القفزة النوعية", "Simpson: the quality leap"),
                T("بدل الخط المستقيم، مرر قوس مكافئ عبر كل ثلاث نقاط متتالية. الخطأ يتناسب مع h⁴ بدل h² — أي أن تنصيف h يقلل الخطأ 16 مرة! الشرط: n زوجي. لهذا سيمبسون هي الخيار الافتراضي عند الحاجة لدقة عالية بعدد نقاط قليل."),
                "\\int_a^b f\\,dx\\approx\\frac{h}{3}\\Big[f_0+4f_1+2f_2+4f_3+\\cdots+f_n\\Big]"
              )
            ],
            examples: [
              X(T("احسب ∫₀¹ x²dx بشارب المنحرف n=4", "Compute ∫₀¹ x²dx with trapezoid n=4"), [
                S(T("h=(1−0)/4=0.25 والقيم", "h=0.25 and values"), "f: 0,\\ 0.0625,\\ 0.25,\\ 0.5625,\\ 1", T("عوّض عند كل نقطة", "Evaluate at each point")),
                S(T("طبّق الصيغة", "Apply formula"), "T=\\frac{0.25}{2}[0+2(0.875)+1]=0.34375", T("الحقيقي 1/3≈0.3333", "Exact is 1/3≈0.3333")),
                S(T("قارن بسيمبسون", "Compare Simpson"), "S=\\frac{0.25}{3}[0+4(0.0625+0.5625)+2(0.25)+1]=\\frac{1}{3}", T("سيمبسون مضبوطة تمامًا للدوال التربيعية!", "Simpson is exact for quadratics!"))
              ])
            ],
            exercises: [
              E(T("في شارب المنحرف، وزن النقاط الوسطى:", "In trapezoid rule, middle points weight:"), ["1", "2", "4", "0"], 1, 2),
              E(T("شرط سيمبسون:", "Simpson's rule requirement:"), ["n فردي", "n زوجي", "n=1", "h=1"], 1, 1),
              E(T("خطأ سيمبسون يتناسب مع:", "Simpson error scales with:"), ["h²", "h³", "h⁴", "h"], 2, 2),
              E(T("∫₀¹ x²dx بالضبط تساوي:", "∫₀¹ x²dx exactly equals:"), ["0.34375", "1/3", "0.5", "1"], 1, 1),
              E(T("متى نلجأ للتكامل العددي؟", "When do we integrate numerically?"), ["دائمًا", "عند استحالة الحل التحليلي أو دوال معطيات تجريبية", "فقط للدوال المثلثية", "لا حاجة له"], 1, 2),
              E(T("مضاعفة عدد الشرائح في شارب المنحرف تقلل الخطأ تقريبًا:", "Doubling slices in trapezoid reduces error ≈"), ["×2", "×4", "×16", "لا يتغير"], 1, 3)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("أسرع طريقة لإيجاد جذر بمشتقة معروفة:", "Fastest root method with known derivative:"), opts: ["التنصيف", "نيوتن-رافسون", "التخمين", "سيمبسون"], ans: 1 },
            { q: T("سيمبسون تتطلب n:", "Simpson requires n:"), opts: ["فرديًا", "زوجيًا", "موجبًا فقط", "أي قيمة"], ans: 1 },
            { q: T("التنصيف يقسم الفترة كل تكرار:", "Bisection halves the interval:"), opts: ["نعم", "لا، ثلث", "يضاعفها", "عشوائي"], ans: 0 }
          ]
        }
      },
      {
        id: "engadv-u2",
        title: T("حساب المتجهات", "Vector Calculus"),
        sub: T("حين يكون لكل نقطة في الفضاء اتجاه", "When every point in space has a direction"),
        lessons: [
          {
            id: "eng-l4",
            title: T("المتجهات: الضرب النقطي والاتجاهي", "Vectors: Dot & Cross Products"),
            minutes: 14,
            videoUrl: null,
            summary: [
              T("المتجه = مقدار + اتجاه؛ يكتب بمركباته i, j, k.", "A vector = magnitude + direction, written in components."),
              T("النقطي يعطي عددًا (شغل، زاوية)؛ الاتجاهي يعطي متجهًا عموديًا (عزم).", "Dot gives a scalar (work, angle); cross gives a perpendicular vector (torque)."),
              T("النقطي: a·b=|a||b|cosθ — الاتجاهي مقداره |a||b|sinθ.", "Dot: a·b=|a||b|cosθ; cross magnitude |a||b|sinθ.")
            ],
            explain: [
              B(T("لغة الاتجاهات في الهندسة", "Engineering's language of direction"),
                T("القوى والسرعات والمجالات الكهربية كلها متجهات. نكتبها بمركباتها على المحاور: F = 3i + 4j تعني قوة مركبتها الأفقية 3 والرأسية 4، ومقدارها √(9+16)=5. الجمع يتم مركبةً مركبة، والطرح يعكس الاتجاه. هذه البساطة الحسابية تخفي قوة هائلة في نمذجة العالم."),
                "\\vec F = 3\\hat i + 4\\hat j,\\quad |\\vec F|=5"
              ),
              B(T("الضرب النقطي: كم يتوافق الاتجاهان؟", "Dot product: how aligned?"),
                T("اضرب المركبات المتناظرة واجمع — النتيجة عدد. معناه الهندسي: |a||b|cosθ. إذا كان الناتج موجبًا فالاتجاهان متوافقان، صفرًا فهما عموديان، سالبًا متعارضان. أشهر تطبيق: الشغل W = F·d — القوة العمودية على الحركة لا تشغل!"),
                "\\vec a\\cdot\\vec b=a_1b_1+a_2b_2+a_3b_3=|a||b|\\cos\\theta"
              ),
              B(T("الضرب الاتجاهي: عمودي على الاثنين", "Cross product: perpendicular to both"),
                T("ينتج متجهًا عموديًا على المستوى الذي يحوي المتجهين، ومقداره مساحة متوازي الأضلاع بينهما: |a×b|=|a||b|sinθ. يُحسب بمحدد مصفوفة 3×3 الصغيرة. تطبيقاته في كل مكان: العزم τ = r×F، والقوة على شحنة في مجال مغناطيسي، ومحور الدوران."),
                "|\\vec a\\times\\vec b|=|a||b|\\sin\\theta"
              )
            ],
            examples: [
              X(T("الشغل: F=2i+3j عبر d=4i (بالمتر)", "Work: F=2i+3j over d=4i (meters)"), [
                S(T("النقطي مباشرة", "Direct dot product"), "W=(2)(4)+(3)(0)=8\\,J", T("المركبة العمودية لا تسهم في الشغل", "Perpendicular component does no work"))
              ]),
              X(T("الزاوية بين a=i+j و b=j", "Angle between a=i+j and b=j"), [
                S(T("النقطي والمقدارات", "Dot and magnitudes"), "\\cos\\theta=\\frac{1}{\\sqrt2\\cdot1}=\\frac{1}{\\sqrt2}", T("قسمة النقطي على حاصل المقدارات", "Dot over product of magnitudes")),
                S(T("الزاوية", "Angle"), "\\theta=45^\\circ", T("منطقي هندسيًا: قطر مربع مع ضلعه", "Geometrically: square diagonal vs side"))
              ])
            ],
            exercises: [
              E(T("i·i يساوي:", "i·i equals:"), ["0", "1", "i", "∞"], 1, 1),
              E(T("إذا كان a·b=0 فإن الزاوية:", "If a·b=0 the angle is:"), ["0°", "45°", "90°", "180°"], 2, 1),
              E(T("مقدار a=3i+4j :", "Magnitude of 3i+4j:"), ["5", "7", "12", "25"], 0, 1),
              E(T("a×a يساوي:", "a×a equals:"), ["|a|²", "0", "a", "عمودي"], 1, 2),
              E(T("الشغل عدد قياسي لأنه حاصل:", "Work is scalar because it is a:"), ["اتجاهي", "نقطي", "اتجاهي مزدوج", "مجموع"], 1, 2),
              E(T("اتجاه a×b يعطي:", "Direction of a×b gives:"), ["محور الدوران (عمودي على الاثنين)", "اتجاه a", "اتجاه b", "القطر"], 0, 2)
            ]
          },
          {
            id: "eng-l5",
            title: T("التدرج والتباعد والدوران", "Gradient, Divergence & Curl"),
            minutes: 17,
            videoUrl: null,
            summary: [
              T("∇ (نابلا) مؤثر يطبق على الدوال ليكشف تغيرها المكاني.", "∇ (nabla) reveals spatial change of fields."),
              T("التدرج: اتجاه أسرع صعود لدالة عددية.", "Gradient: steepest ascent of a scalar field."),
              T("التباعد يقيس التمدد، والدوران يقيس الالتواء.", "Divergence measures spreading; curl measures rotation.")
            ],
            explain: [
              B(T("المؤثر ∇: مجهر التغير المكاني", "Nabla: the spatial-change microscope"),
                T("عرّفه كمجموعة مشتقات جزئية: ∇ = (∂/∂x, ∂/∂y, ∂/∂z). وحده لا معنى له، لكن تطبيقه على الدوال يولد ثلاثة كائنات تصف فيزياء المجالات كلها: التدرج والتباعد والدوران. هذه الثلاثية هي قلب الديناميكا الحرارية وميكانيكا الموائع والكهرومغناطيسية."),
                "\\nabla=\\left(\\frac{\\partial}{\\partial x},\\frac{\\partial}{\\partial y},\\frac{\\partial}{\\partial z}\\right)"
              ),
              B(T("التدرج grad: بوصلة الصعود", "Gradient: the ascent compass"),
                T("طبقه على دالة عددية T(x,y,z) فتحصل على متجه يشير نحو أسرع زيادة، ومقداره معدل هذا الصعود. حرارة لوح معدني: التدرج يشير نحو الأسخن، والحرارة تتدفق عكسه. في التلدين والتبريد الإلكتروني، تصميم مسارات الحرارة يعني هندسة التدرج."),
                "\\nabla T=\\left(T_x,T_y,T_z\\right)"
              ),
              B(T("التباعد div: أين يتمدد المائع؟", "Divergence: where does fluid spread?"),
                T("طبقه على متجه (مثل سرعة مائع) فتحصل على عدد عند كل نقطة: موجب يعني منبعًا (المائع يتمدد للخارج)، سالب مصبًا (يتجمع)، صفرًا يعني عدم قابلية الانضغاط — شرط الماء تقريبًا! معادلة الاستمرارية في الموائع مبنية عليه."),
                "\\nabla\\cdot\\vec v=\\partial_x v_x+\\partial_y v_y+\\partial_z v_z"
              ),
              B(T("الدوران curl: أين يدور التيار؟", "Curl: where does it swirl?"),
                T("طبقه على متجه سرعة فتحصل على متجه محور الدوران المحلي ومقداره سرعة اللفّ. مجال سرعات إعصار له curl كبير حول العين وصفر بعيدًا. في الكهرومغناطيسية: مجال مغناطيسي متغير يولد curlًا كهربيًا — أساس المولدات."),
                "\\nabla\\times\\vec v"
              )
            ],
            examples: [
              X(T("التدرج لـ T=x²y عند (1,2)", "Gradient of T=x²y at (1,2)"), [
                S(T("المشتقات الجزئية", "Partial derivatives"), "\\nabla T=(2xy,\\ x^2)", T("اشتقاق كل متغير والباقي ثابت", "Derive per variable, others constant")),
                S(T("عوض النقطة", "Substitute point"), "\\nabla T(1,2)=(4,\\ 1)", T("أسرع صعود نحو (4,1)", "Steepest ascent toward (4,1)"))
              ])
            ],
            exercises: [
              E(T("∇ يعمل على دالة عددية فيعطي:", "∇ on a scalar gives:"), ["عددًا", "متجهًا (التدرج)", "مصفوفة", "لا شيء"], 1, 1),
              E(T("∇·v موجب عند نقطة يعني:", "Positive ∇·v at a point means:"), ["منبع", "مصب", "دوران", "سكون"], 0, 2),
              E(T("التدرج يشير نحو:", "Gradient points toward:"), ["أسرع هبوط", "أسرع صعود", "الأصل", "المحور x"], 1, 1),
              E(T("مائع غير قابل للانضغاط:", "Incompressible fluid:"), ["∇·v=0", "∇·v>0", "∇×v=0", "∇T=0"], 0, 2),
              E(T("curl مجال سرعة يقيس:", "Curl of velocity field measures:"), ["التمدد", "الالتفاف المحلي", "الحرارة", "الضغط"], 1, 2),
              E(T("∇T عند نقطة على خط تساوي حرارة يكون:", "∇T on an isothermal line is:"), ["أقصى ما يمكن", "عموديًا على الخط", "موازيًا للخط", "صفرًا دائمًا"], 1, 3)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("a·b يعطي:", "a·b gives:"), opts: ["متجهًا", "عددًا", "مصفوفة", "زاوية فقط"], ans: 1 },
            { q: T("التدرج دالة عددية ← :", "Gradient maps scalar →"), opts: ["عدد", "متجه", "عددين", "لا شيء"], ans: 1 },
            { q: T("مجال بلا دوامات يعني:", "A field with no swirls means:"), opts: ["∇·v=0", "∇×v=0", "∇T=0", "v=0"], ans: 1 }
          ]
        }
      },
      {
        id: "engadv-u3",
        title: T("المعادلات التفاضلية الجزئية", "Partial Differential Equations"),
        sub: T("حين تعتمد الكمية على أكثر من متغير", "When a quantity depends on several variables"),
        lessons: [
          {
            id: "eng-l6",
            title: T("مدخل وتصنيف PDEs", "Intro & Classification of PDEs"),
            minutes: 15,
            videoUrl: null,
            summary: [
              T("المجهول دالة بعدة متغيرات والمشتقات جزئية.", "Unknown is a multivariable function with partial derivatives."),
              T("ثلاث عائلات: إهليلجية، قطعية (بارابولية)، زائدية.", "Three families: elliptic, parabolic, hyperbolic."),
              T("أمثلتها الذهبية: لابلاس، الحرارة، الموجة.", "Golden examples: Laplace, heat, wave equations.")
            ],
            explain: [
              B(T("من العادية إلى الجزئية", "From ordinary to partial"),
                T("في ODEs المجهول y(t) يعتمد على متغير واحد. في العالم الحقيقي الحرارة تتبدل بالمكان والزمان معًا: T(x,y,z,t) — مجهول بأربعة متغيرات ومشتقاته جزئية ∂. لهذا تُوصف PDEs بأنها رياضيات الفضاء المستمر: توزيع الجهد، انتشار التلوث، اهتزاز الجسور كلها معادلات جزئية.")),
              B(T("التصنيف الثلاثي بالمعامل A", "The A-coefficient classification"),
                T("للمعادلة من الدرجة الثانية A·u_xx + B·u_xy + C·u_yy + … = 0 احسب Δ=B²−4AC: سالب ⇒ إهليلجية (جهد كهربي، توازن) — تصف حالات استقرار. معدوم ⇒ قطعية (انتشار الحرارة) — تصف تطورًا زمنيًا هادئًا. موجب ⇒ زائدية (الموجات والصوت) — تصف انتشارًا متموجًا. التصنيف يحدد طريقة الحل العددي المناسبة."),
                "\\Delta=B^2-4AC"
              ),
              B(T("المعادلات الثلاث المشهورة", "The famous three"),
                T("لابلاس ∇²u=0: التوزيع المستقر (جهد لوح، تدفق هادئ). الحرارة u_t=k∇²u: كيف ينتشر الحراري مع الزمن. الموجة u_tt=c²∇²u: كيف تنتقل الاضطرابات بسرعة c. حفظ هذه الثلاثة يعني فهم 80% من نماذج الهندسة الفيزيائية."),
                "\\nabla^2u=0,\\quad u_t=k\\nabla^2u,\\quad u_{tt}=c^2\\nabla^2u"
              )
            ],
            examples: [
              X(T("صنّف: 4u_xx + u_yy = 0", "Classify: 4u_xx + u_yy = 0"), [
                S(T("حدد المعاملات", "Identify coefficients"), "A=4,\\ B=0,\\ C=1", T("المعامل هو معامل u_xx", "A is the u_xx coefficient")),
                S(T("احسب Δ", "Compute Δ"), "\\Delta=0-16<0\\Rightarrow\\text{إهليلجية}", T("إهليلجية = مسألة توازن/جهد", "Elliptic = equilibrium problem"))
              ])
            ],
            exercises: [
              E(T("مجهول الـ PDE هو:", "Unknown of a PDE is:"), ["دالة بعدة متغيرات", "عدد", "مشتقة فقط", "مصفوفة"], 0, 1),
              E(T("معادلة الحرارة من نوع:", "Heat equation is:"), ["إهليلجي", "قطعي", "زائدي", "خطي فقط"], 1, 2),
              E(T("Δ=B²−4AC<0 يعني:", "Δ<0 means:"), ["زائدية", "قطعية", "إهليلجية", "لا تصنيف"], 2, 2),
              E(T("∇²u=0 تصف:", "∇²u=0 describes:"), ["موجة", "توازن/جهد مستقر", "انتقال حرارة زمني", "صدمة"], 1, 2),
              E(T("معادلة الموجة:", "Wave equation:"), ["u_tt=c²∇²u", "u_t=k∇²u", "∇²u=0", "u′=u"], 0, 2)
            ]
          },
          {
            id: "eng-l7",
            title: T("فصل المتغيرات: الفكرة الذهبية", "Separation of Variables: the Golden Idea"),
            minutes: 17,
            videoUrl: null,
            summary: [
              T("افترض u(x,t)=X(x)·T(t) وحوّل الـ PDE إلى ODEs.", "Assume u(x,t)=X(x)·T(t) to split the PDE into ODEs."),
              T("كل طرف يعتمد على متغير واحد ⇒ يساوي ثابتًا.", "Each side depends on one variable ⇒ both equal a constant."),
              T("الشروط الحدية تختار القيم المسموحة (الأنماط).", "Boundary conditions select allowed modes.")
            ],
            explain: [
              B(T("الخدعة التي تحل معظم المسائل", "The trick that solves most problems"),
                T("فكرة فورييه العبقرية: ابحث عن حلول على شكل جداء — دالة للمكان مضروبة بدالة للزمن. عند التعويض في معادلة الحرارة تنفصل المتغيرات: طرف يعتمد على t فقط وآخر على x فقط. العدد الوحيد الذي يتساوى معه طرفان مستقلان هو ثابت — نسميه −λ ونحل معادلتي ODE عاديتين جدًا!"),
                "u(x,t)=X(x)\\,T(t)"
              ),
              B(T("دور الشروط الحدية: اختيار الأنماط", "Boundary conditions pick the modes"),
                T("بعد الفصل تظهر قيم λ مسموحة فقط تبعًا للشروط الحدية (أطراف مسمرة، حرة، معزولة). كل λ يعطي نمطًا sin(nπx/L) يتحلل أسّيًا بزمن مميز. الحل الكامل = مجموع هذه الأنماط بأوزان من التوسيع — وهذه سلسلة فورييه التي ستقابلها في الإشارات."),
                "u_n=\\sin\\frac{n\\pi x}{L}e^{-k\\lambda_nt}"
              ),
              B(T("لماذا هي مهمة للمهندس؟", "Why engineers care"),
                T("فصل المتغيرات هو الأساس الذي بُنيت عليه طرق الأنماط في الاهتزازات، وحل المعادلات في الأعمدة والألواح، وحتى خطوة أولى لفهم طرق الفروق المحدودة العددية. إتقان الفكرة يفتح لك قراءة أي كتاب انتقال حراري أو اهتزازات بثقة.")
              )
            ],
            examples: [
              X(T("في معادلة الحرارة بعد الفصل: T′=−λkT", "After separation: T′=−λkT"), [
                S(T("حل معادلة الزمن", "Solve the time ODE"), "T(t)=e^{-k\\lambda t}", T("اضمحلال أسّي للنمط", "Exponential decay of the mode")),
                S(T("المعنى الهندسي", "Engineering meaning"), T("كل نمط مكاني يخفت بسرعته الخاصة — الحدة تختفي أولًا والتموجات الخشنة تبقى أطول.", "Each spatial mode fades at its own rate — sharp details vanish first."))
              ])
            ],
            exercises: [
              E(T("فصل المتغيرات يحول الـ PDE إلى:", "Separation turns a PDE into:"), ["ODEs", "PDE أعلى", "متباينة", "تكامل مزدوج"], 0, 1),
              E(T("الطرفان المستقلان بعد الفصل يساويان:", "Independent sides after separation equal:"), ["صفرًا", "ثابتًا", "بعضهما متغيرًا", "∞"], 1, 2),
              E(T("الأنماط المسموحة تحددها:", "Allowed modes are set by:"), ["الشروط الحدية", "قيمة k فقط", "الزمن", "الحاسوب"], 0, 2),
              E(T("نمط λ أكبر يخفت:", "Larger λ mode decays:"), ["أبطأ", "أسرع", "لا يخفت", "ينمو"], 1, 2),
              E(T("u(x,t)=X(x)T(t) افتراض:", "The ansatz u=XT is:"), ["عام دائمًا", "يولد عائلة حلول تُجمع لاحقًا", "خاطئ", "للموجات فقط"], 1, 3)
            ]
          }
        ],
        quiz: {
          passScore: 60,
          questions: [
            { q: T("فصل المتغيرات ينتج:", "Separation produces:"), opts: ["معادلات عادية", "تكاملات", "مصفوفات", "لا شيء"], ans: 0 },
            { q: T("u_t=k∇²u معادلة:", "u_t=k∇²u is the:"), opts: ["موجة", "حرارة", "لابلاس", "استمرارية"], ans: 1 },
            { q: T("الشروط الحدية تحدد:", "Boundary conditions determine:"), opts: ["الأنماط المسموحة", "الزمن", "الحاسوب", "لا شيء"], ans: 0 }
          ]
        }
      }
    ]
  });
})();
