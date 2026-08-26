(function () {
  "use strict";

  var T = function (ar, en) { return { ar: ar, en: en }; };
  var F = function (cat, arT, enT, tex, note) {
    var f = { cat: cat, title: T(arT, enT), tex: tex };
    if (note) f.note = T(note.ar, note.en);
    return f;
  };

  MW.formulas = [
    // Algebra
    F("algebra", "محددة المربع الكامل", "Perfect square", "a^2\\pm2ab+b^2=(a\\pm b)^2"),
    F("algebra", "فرق مربعين", "Difference of squares", "a^2-b^2=(a-b)(a+b)"),
    F("algebra", "مجموع مكعبين", "Sum of cubes", "a^3+b^3=(a+b)(a^2-ab+b^2)"),
    F("algebra", "القانون العام (المعادلة التربيعية)", "Quadratic formula", "x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}", { ar: "المميز Δ=b²−4ac يحدد عدد الحلول", en: "Δ=b²−4ac determines the number of roots" }),
    F("algebra", "قوى المتغير", "Exponent rules", "x^a\\cdot x^b=x^{a+b},\\quad (x^a)^b=x^{ab}"),
    F("algebra", "اللوغاريتمات", "Logarithm rules", "\\log(ab)=\\log a+\\log b,\\quad \\log\\frac{a}{b}=\\log a-\\log b"),
    F("algebra", "متوسط مجموعة", "Arithmetic mean", "\\bar{x}=\\frac{1}{n}\\sum_{i=1}^{n}x_i"),
    F("algebra", "المتطابقات الأسية", "Exponent identities", "x^{-n}=\\frac{1}{x^n},\\quad x^{1/n}=\\sqrt[n]{x}"),

    // Geometry
    F("geometry", "فيثاغورس", "Pythagorean theorem", "a^2+b^2=c^2"),
    F("geometry", "مساحة المثلث", "Triangle area", "A=\\frac{1}{2}bh"),
    F("geometry", "مساحة الدائرة ومحيطها", "Circle area & circumference", "A=\\pi r^2,\\quad C=2\\pi r"),
    F("geometry", "حجم الأسطوانة", "Cylinder volume", "V=\\pi r^2h"),
    F("geometry", "حجم الكرة ومساحتها", "Sphere volume & surface", "V=\\frac{4}{3}\\pi r^3,\\quad S=4\\pi r^2"),
    F("geometry", "حجم المخروط", "Cone volume", "V=\\frac{1}{3}\\pi r^2h"),
    F("geometry", "قانون الجيب", "Law of sines", "\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}"),
    F("geometry", "قانون جيب التمام", "Law of cosines", "c^2=a^2+b^2-2ab\\cos C"),

    // Trigonometry
    F("trig", "فيثاغورس المثلثية", "Pythagorean identity", "\\sin^2\\theta+\\cos^2\\theta=1"),
    F("trig", "الظل", "Tangent identity", "\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}"),
    F("trig", "جيب مجموع زاويتين", "Sine addition", "\\sin(A\\pm B)=\\sin A\\cos B\\pm\\cos A\\sin B"),
    F("trig", "جيب تمام مجموع زاويتين", "Cosine addition", "\\cos(A\\pm B)=\\cos A\\cos B\\mp\\sin A\\sin B"),
    F("trig", "زاوية مزدوجة", "Double angle", "\\sin2\\theta=2\\sin\\theta\\cos\\theta,\\quad \\cos2\\theta=1-2\\sin^2\\theta"),
    F("trig", "قانون أويلر", "Euler's formula", "e^{i\\theta}=\\cos\\theta+i\\sin\\theta", { ar: "أساس الإشارات والتيارات المترددة", en: "Foundation of AC signals" }),
    F("trig", "جيب تمام نصف الزاوية", "Half angle cosine", "\\cos^2\\frac{\\theta}{2}=\\frac{1+\\cos\\theta}{2}"),
    F("trig", "تحويل المنتج إلى مجموع", "Product to sum", "2\\sin A\\cos B=\\sin(A{+}B)+\\sin(A{-}B)"),

    // Differentiation
    F("differentiation", "تعريف المشتقة", "Definition of derivative", "f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}"),
    F("differentiation", "قاعدة القوة", "Power rule", "\\frac{d}{dx}x^n=nx^{n-1}"),
    F("differentiation", "قاعدة المنتج", "Product rule", "(uv)'=u'v+uv'"),
    F("differentiation", "قاعدة الخارج من القسمة", "Quotient rule", "\\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}"),
    F("differentiation", "قاعدة السلسلة", "Chain rule", "\\frac{dy}{dx}=\\frac{dy}{du}\\cdot\\frac{du}{dx}"),
    F("differentiation", "مشتقة الجيب وجيب التمام", "Sine & cosine derivatives", "\\frac{d}{dx}\\sin x=\\cos x,\\quad \\frac{d}{dx}\\cos x=-\\sin x"),
    F("differentiation", "مشتقة الأسية واللوغاريتم", "Exponential & log derivatives", "\\frac{d}{dx}e^x=e^x,\\quad \\frac{d}{dx}\\ln x=\\frac{1}{x}"),
    F("differentiation", "التفاضل الضمني", "Implicit differentiation", "\\frac{d}{dx}y^n=n y^{n-1}\\,y'"),
    F("differentiation", "المشتقة الثانية والتقعر", "Second derivative & concavity", "f''>0:\\ \\text{concave up},\\quad f''<0:\\ \\text{concave down}"),
    F("differentiation", "المشتقة الجزئية", "Partial derivative", "\\frac{\\partial f}{\\partial x}:\\ \\text{differentiate in }x\\text{, hold others}"),

    // Integration
    F("integration", "قاعدة القوة التكاملية", "Power rule (integration)", "\\int x^n dx=\\frac{x^{n+1}}{n+1}+C\\ (n\\neq-1)"),
    F("integration", "تكامل المقلوب", "Integral of 1/x", "\\int\\frac{dx}{x}=\\ln|x|+C"),
    F("integration", "تكاملات أسية", "Exponential integrals", "\\int e^{kx}dx=\\frac{e^{kx}}{k}+C"),
    F("integration", "تكاملات مثلثية", "Trig integrals", "\\int\\sin x\\,dx=-\\cos x+C,\\quad \\int\\cos x\\,dx=\\sin x+C"),
    F("integration", "نظرية التكامل الأساسية", "Fundamental theorem", "\\int_a^b f(x)dx=F(b)-F(a)"),
    F("integration", "التكامل بالتجزيء", "Integration by parts", "\\int u\\,dv=uv-\\int v\\,du"),
    F("integration", "التعويض", "Substitution", "\\int f(g(x))g'(x)dx=\\int f(u)\\,du"),
    F("integration", "المساحة تحت المنحنى", "Area under curve", "A=\\int_a^b|f(x)|\\,dx"),
    F("integration", "حجم جسم دوران (أقراص)", "Volume of revolution", "V=\\pi\\int_a^b[f(x)]^2dx"),
    F("integration", "شارب المنحرف", "Trapezoidal rule", "\\int_a^b f\\,dx\\approx\\frac{h}{2}[f_0+2f_1+\\cdots+f_n]"),

    // Differential Equations
    F("ode", "النمو الأسي", "Exponential growth/decay", "\\frac{dy}{dx}=ky\\Rightarrow y=Ce^{kx}"),
    F("ode", "المتغيرات القابلة للفصل", "Separable form", "\\frac{dy}{dx}=g(x)h(y)\\Rightarrow\\int\\frac{dy}{h(y)}=\\int g(x)dx"),
    F("ode", "العامل التكاملي", "Integrating factor", "y'+p(x)y=q(x),\\quad \\mu=e^{\\int p\\,dx}"),
    F("ode", "تبريد نيوتن", "Newton cooling", "\\frac{dT}{dt}=-k(T-T_s)"),
    F("ode", "زمن النصف", "Half-life", "t_{1/2}=\\frac{\\ln2}{|k|}"),

    // Laplace
    F("laplace", "التعريف", "Definition", "\\mathcal{L}\\{f(t)\\}=\\int_0^{\\infty}e^{-st}f(t)\\,dt"),
    F("laplace", "الخطية", "Linearity", "\\mathcal{L}\\{af{+}bg\\}=aF(s)+bG(s)"),
    F("laplace", "خاصية المشتقة", "Derivative property", "\\mathcal{L}\\{f'\\}=sF(s)-f(0)"),
    F("laplace", "الإزاحة الأولى", "First shifting", "\\mathcal{L}\\{e^{at}f(t)\\}=F(s-a)"),
    F("laplace", "جدول سريع", "Quick table", "\\mathcal{L}\\{1\\}=\\tfrac{1}{s},\\ \\mathcal{L}\\{e^{at}\\}=\\tfrac{1}{s-a},\\ \\mathcal{L}\\{\\sin\\omega t\\}=\\tfrac{\\omega}{s^2+\\omega^2}"),
    F("laplace", "التحويل العكسي بالكسور", "Inverse via partial fractions", "\\frac{1}{(s-a)(s-b)}=\\frac{1}{a-b}\\left[\\frac{1}{s-a}-\\frac{1}{s-b}\\right]"),
    F("laplace", "دالة الخطوة", "Unit step", "\\mathcal{L}\\{u(t-a)\\}=\\frac{e^{-as}}{s}"),
    F("laplace", "حل المعادلة", "Solving ODEs", "s^2Y-sy(0)-y'(0)+aY=F(s)"),

    // Matrices
    F("matrices", "محدد 2×2", "2×2 determinant", "\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc"),
    F("matrices", "معكوس 2×2", "2×2 inverse", "A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}"),
    F("matrices", "قاعدة كرامر", "Cramer's rule", "x=\\frac{D_x}{D},\\quad D\\neq0"),
    F("matrices", "المعادلة المميزة", "Characteristic equation", "\\det(A-\\lambda I)=0"),
    F("matrices", "الأثر والمحدد", "Trace & determinant", "\\sum\\lambda_i=\\text{tr}(A),\\quad \\prod\\lambda_i=\\det A"),
    F("matrices", "منقول حاصل الضرب", "Transpose of product", "(AB)^T=B^TA^T,\\quad (AB)^{-1}=B^{-1}A^{-1}"),
    F("matrices", "الضرب النقطي بالصيغة", "Dot product (component)", "\\vec a\\cdot\\vec b=a_1b_1+a_2b_2+a_3b_3"),

    // Statistics
    F("statistics", "التباين والانحراف", "Variance & std deviation", "\\sigma^2=\\frac{\\sum(x_i-\\bar x)^2}{n}"),
    F("statistics", "الاحتمال الكلاسيكي", "Classical probability", "P(A)=\\frac{\\text{favorable}}{\\text{total}}"),
    F("statistics", "قاعدة الجمع", "Addition rule", "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)"),
    F("statistics", "الاحتمال الشرطي", "Conditional probability", "P(A|B)=\\frac{P(A\\cap B)}{P(B)}"),
    F("statistics", "التوزيع الطبيعي", "Normal distribution", "f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}"),
    F("statistics", "معامل الارتباط", "Correlation coefficient", "r=\\frac{\\sum(x_i-\\bar x)(y_i-\\bar y)}{\\sqrt{\\sum(x_i-\\bar x)^2\\sum(y_i-\\bar y)^2}}")
  ];

  MW.formulaCategories = [
    { id: "algebra", title: T("الجبر", "Algebra") },
    { id: "geometry", title: T("الهندسة", "Geometry") },
    { id: "trig", title: T("المثلثات", "Trigonometry") },
    { id: "differentiation", title: T("التفاضل", "Differentiation") },
    { id: "integration", title: T("التكامل", "Integration") },
    { id: "ode", title: T("المعادلات التفاضلية", "Differential Equations") },
    { id: "laplace", title: T("لابلاس", "Laplace") },
    { id: "matrices", title: T("المصفوفات", "Matrices") },
    { id: "statistics", title: T("الإحصاء", "Statistics") }
  ];
})();
