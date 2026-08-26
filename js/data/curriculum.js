(function () {
  "use strict";

  var T = function (ar, en) { return { ar: ar, en: en }; };

  function C(id, stage, order, icon, hue, arT, enT, arD, enD, units, opts) {
    var c = {
      id: id, stage: stage, order: order, icon: icon, hue: hue,
      title: T(arT, enT), desc: T(arD, enD),
      status: "live", units: units
    };
    if (opts) Object.keys(opts).forEach(function (k) { c[k] = opts[k]; });
    return c;
  }

  var U = function (t, u) { return { t: t, u: u }; };
  var G = function (arT, enT, parts) { return { title: T(arT, enT), parts: parts }; };
  var COMING = function (arT, enT, arD, enD, expected) {
    return { title: T(arT, enT), desc: T(arD, enD), status: "coming", expectedUnits: expected || 4 };
  };

  MW.curriculum = {

    stages: [
      {
        id: "prep", order: 1, icon: "book", hue: "#3F7A7A",
        title: T("رياضيات الإعدادي", "Middle School Math"),
        desc: T("الأسس المتينة: الحساب، الجبر الأولي، الهندسة، والإحصاء.", "Strong foundations: arithmetic, pre-algebra, geometry, statistics.")
      },
      {
        id: "secondary", order: 2, icon: "grad", hue: "#70513B",
        title: T("رياضيات الثانوي", "High School Math"),
        desc: T("الدوال والمثلثات والتفاضل الأولي — الجسر إلى الجامعة.", "Functions, trigonometry and early calculus — the bridge to university.")
      },
      {
        id: "university", order: 3, icon: "chart", hue: "#326262",
        title: T("رياضيات الجامعي", "University Math"),
        desc: T("سلسلة التفاضل والتكامل، المعادلات التفاضلية، والجبر الخطي.", "The calculus sequence, differential equations and linear algebra.")
      },
      {
        id: "engineering", order: 4, icon: "gear", hue: "#8a684a",
        title: T("الرياضيات الهندسية", "Engineering Mathematics"),
        desc: T("المسار المتخصص: أدوات الرياضيات التي تشتغل بها المحركات والدوائر والجسور.", "The specialist track: the math behind engines, circuits and bridges.")
      }
    ],

    courses: {

      "prep-arithmetic": COMING("أساسيات الحساب", "Arithmetic Foundations", "العمليات، الكسور، النسب، والقوى — حجر الأساس لكل ما بعده.", "Operations, fractions, ratios and powers — the bedrock of everything.", 5),
      "prep-algebra": COMING("الجبر", "Pre-Algebra & Algebra", "الرموز والمتغيرات والتفكيك وأساسيات التعبيرات.", "Symbols, variables, factoring and expression basics.", 5),
      "prep-equations": COMING("المعادلات والمتباينات", "Equations & Inequalities", "حل المعادلات من الدرجة الأولى والثانية والمتباينات.", "Linear and quadratic equations, inequalities.", 4),
      "prep-geometry": COMING("الهندسة", "Geometry", "الزوايا، المثلثات، الدوائر، والمجسمات.", "Angles, triangles, circles and solids.", 5),
      "prep-analytic": COMING("الهندسة التحليلية", "Analytic Geometry", "الإحداثيات، المستقيم، والميل.", "Coordinates, lines and slope.", 4),
      "prep-stats": COMING("الإحصاء والاحتمالات", "Statistics & Probability", "الوسط والوسيط، الرسوم، وقواعد الاحتمال الأولى.", "Mean/median, charts and first probability rules.", 4),

      "sec-algebra2": COMING("الجبر المتقدم", "Advanced Algebra", "الدوال كثيرة الحدود، الأسية واللوغاريتمية.", "Polynomial, exponential and logarithmic functions.", 5),
      "sec-functions": COMING("الدوال", "Functions", "التركيب والانعكاس والتحويلات.", "Composition, inverse and transformations.", 4),
      "sec-sequences": COMING("المتتاليات والمتسلسلات", "Sequences & Series", "الحسابية والهندسية وحدودها.", "Arithmetic, geometric and their limits.", 4),
      "sec-trig": COMING("المثلثات", "Trigonometry", "النسب، الدوال، والمتطابقات.", "Ratios, functions and identities.", 5),
      "sec-analytic": COMING("الهندسة التحليلية", "Analytic Geometry", "الدائرة، القطع المكافئ، والناقص.", "Circle, parabola and ellipse.", 4),
      "sec-calculus": COMING("مدخل إلى التفاضل والتكامل", "Intro to Calculus", "النهايات والاشتقاق الأولى — بوابتك للجامعة.", "Limits and first derivatives — your university gateway.", 4),
      "sec-stats": COMING("الإحصاء والاحتمالات", "Statistics & Probability", "التوزيعات والانحراف المعياري والاحتمال الشرطي.", "Distributions, standard deviation, conditional probability.", 4),

      "uni-calc1": C("uni-calc1", "university", 1, "deriv", "#3F7A7A",
        "التفاضل والتكامل 1", "Calculus I",
        "النهايات وبناء المشتقة وتطبيقاتها: القيم القصوى ورسم المنحنيات.",
        "Limits, building the derivative and its applications: extrema and sketching.",
        [
          G("النهايات", "Limits", [U("limits", "lim-u1"), U("limits", "lim-u2")]),
          G("بناء المشتقة", "Building the Derivative", [U("derivatives", "drv-u1")]),
          G("تطبيقات التفاضل", "Derivative Applications", [U("derivatives", "drv-u2")])
        ]),
      "uni-calc2": C("uni-calc2", "university", 2, "integ", "#C89A4B",
        "التفاضل والتكامل 2", "Calculus II",
        "التكامل غير المحدد والمحدد وتطبيقاته: المساحات والحجوم.",
        "Indefinite and definite integrals with applications: areas and volumes.",
        [
          G("التكامل غير المحدد", "Indefinite Integrals", [U("integrals", "int-u1")]),
          G("التكامل المحدد", "Definite Integrals", [U("integrals", "int-u2")])
        ]),
      "uni-ode": C("uni-ode", "university", 3, "ode", "#326262",
        "المعادلات التفاضلية", "Differential Equations",
        "الرتبة الأولى: الفصل والعامل التكاملي، ثم النمذجة الهندسية.",
        "First order: separation, integrating factor, then engineering modeling.",
        [
          G("الرتبة الأولى", "First Order", [U("odes", "ode-u1")]),
          G("النمذجة", "Modeling", [U("odes", "ode-u2")])
        ]),
      "uni-laplace": C("uni-laplace", "university", 4, "laplace", "#8a684a",
        "تحويل لابلاس", "Laplace Transform",
        "من التفاضل إلى الجبر: التحويل، الخصائص، الكسور، وحل المعادلات.",
        "From calculus to algebra: transform, properties, fractions, solving.",
        [
          G("التحويل وخصائصه", "Transform & Properties", [U("laplace", "lap-u1")]),
          G("الحل والتطبيقات", "Solving & Applications", [U("laplace", "lap-u2")])
        ]),
      "uni-linal": C("uni-linal", "university", 5, "matrix", "#54706B",
        "الجبر الخطي والمصفوفات", "Linear Algebra",
        "العمليات، المحددات، أنظمة المعادلات، والقيم الذاتية.",
        "Operations, determinants, systems and eigenvalues.",
        [
          G("العمليات والمحددات", "Operations & Determinants", [U("matrices", "mat-u1")]),
          G("الأنظمة والقيم الذاتية", "Systems & Eigenvalues", [U("matrices", "mat-u2")])
        ]),

      "eng-math": C("eng-math", "engineering", 1, "gear", "#8a684a",
        "الرياضيات الهندسية", "Engineering Mathematics",
        "المسار المتخصص الكامل: من التفاضل إلى المعادلات الجزئية — بعين هندسية تطبيقية.",
        "The complete specialist track: from differentiation to PDEs — with an applied engineering eye.",
        [
          G("Unit 1 — التفاضل", "Unit 1 — Differentiation", [U("derivatives", "drv-u1"), U("derivatives", "drv-u2")]),
          G("Unit 2 — التكامل", "Unit 2 — Integration", [U("integrals", "int-u1"), U("integrals", "int-u2")]),
          G("Unit 3 — المعادلات التفاضلية", "Unit 3 — Differential Equations", [U("odes", "ode-u1"), U("odes", "ode-u2")]),
          G("Unit 4 — تحويل لابلاس", "Unit 4 — Laplace Transforms", [U("laplace", "lap-u1"), U("laplace", "lap-u2")]),
          G("Unit 5 — المصفوفات والجبر الخطي", "Unit 5 — Matrices & Linear Algebra", [U("matrices", "mat-u1"), U("matrices", "mat-u2")]),
          G("Unit 6 — الطرق العددية", "Unit 6 — Numerical Methods", [U("engadv", "engadv-u1")]),
          G("Unit 7 — حساب المتجهات", "Unit 7 — Vector Calculus", [U("engadv", "engadv-u2")]),
          G("Unit 8 — المعادلات الجزئية", "Unit 8 — Partial Differential Equations", [U("engadv", "engadv-u3")])
        ],
        { flag: true })
    },

    getStage: function (id) {
      return this.stages.filter(function (s) { return s.id === id; })[0];
    },
    getCourse: function (id) {
      return this.courses[id] || null;
    },
    coursesOfStage: function (stageId) {
      var self = this;
      return Object.keys(this.courses)
        .map(function (k) { return self.courses[k]; })
        .filter(function (c) { return c.stage === stageId; })
        .sort(function (a, b) { return a.order - b.order; });
    },
    resolveUnit: function (ref) {
      var track = MW.findTrack(ref.t);
      if (!track || !track.units) return null;
      var unit = track.units.filter(function (u) { return u.id === ref.u; })[0];
      return unit ? { track: track, unit: unit } : null;
    },
    courseParts: function (course) {
      var self = this, out = [];
      (course.units || []).forEach(function (g, gi) {
        if (g.status === "coming") { out.push({ group: g, gi: gi, coming: true, parts: [] }); return; }
        var parts = (g.parts || []).map(function (ref) { return self.resolveUnit(ref); }).filter(Boolean);
        out.push({ group: g, gi: gi, coming: false, parts: parts });
      });
      return out;
    },
    courseStats: function (course) {
      var p = MW.store.getProgress();
      var total = 0, done = 0;
      this.courseParts(course).forEach(function (grp) {
        grp.parts.forEach(function (pr) {
          (pr.unit.lessons || []).forEach(function (l) {
            total++;
            if (p.completedLessons.indexOf(l.id) !== -1) done++;
          });
        });
      });
      return { total: total, done: done, pct: total ? Math.round(done / total * 100) : 0 };
    },
    courseNextLesson: function (course) {
      var p = MW.store.getProgress();
      var found = null;
      this.courseParts(course).some(function (grp) {
        if (grp.coming) return false;
        return grp.parts.some(function (pr) {
          return (pr.unit.lessons || []).some(function (l) {
            if (p.completedLessons.indexOf(l.id) === -1 && !found) {
              found = { track: pr.track, unit: pr.unit, lesson: l };
              return true;
            }
            return false;
          });
        });
      });
      return found;
    },
    courseComplete: function (course) {
      var s = this.courseStats(course);
      return s.total > 0 && s.done === s.total;
    }
  };
})();
