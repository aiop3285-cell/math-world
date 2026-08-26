(function () {
  "use strict";

  var SUPER = { "\u00B2": "^2", "\u00B3": "^3", "\u2074": "^4", "\u2075": "^5", "\u2076": "^6" };

  function normalize(s) {
    return String(s || "")
      .replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
      .replace(/[\u00B9\u00B2\u00B3\u2074-\u2079]/g, function (c) { return SUPER[c] || "^" + c; })
      .replace(/\u2192/g, "->")
      .replace(/\u2212/g, "-")
      .replace(/\u00D7/g, "*")
      .replace(/\u00F7/g, "/")
      .replace(/\u222B/g, " INT ")
      .toLowerCase();
  }

  function parsePoly(raw) {
    var s = normalize(raw).replace(/\s+/g, "").replace(/int|dx|=|y'|f'\(x\)/g, "");
    var coeffs = [];
    var re = /([+-]?[^+-]+)/g;
    var m;
    while ((m = re.exec(s)) !== null) {
      var term = m[1];
      if (!term || term === "+" || term === "-") continue;
      var sign = term[0] === "-" ? -1 : 1;
      term = term.replace(/^[+-]/, "");
      var cm = term.match(/^(\d*(?:\.\d+)?)\*?x(?:\^(-?\d+))?$/) || term.match(/^(\d+(?:\.\d+)?)$/);
      if (!cm) return null;
      var coef, power;
      if (/^\d+(\.\d+)?$/.test(term)) { coef = parseFloat(term); power = 0; }
      else {
        coef = cm[1] === "" ? 1 : parseFloat(cm[1]);
        power = cm[2] !== undefined ? parseInt(cm[2], 10) : 1;
      }
      coeffs[power] = (coeffs[power] || 0) + sign * coef;
    }
    if (!coeffs.length) return null;
    for (var i = 0; i < coeffs.length; i++) coeffs[i] = coeffs[i] || 0;
    return coeffs;
  }

  function evalPoly(c, x) {
    var r = 0;
    for (var i = c.length - 1; i >= 0; i--) r = r * x + (c[i] || 0);
    return r;
  }

  function derivCoeffs(c) {
    var out = [];
    for (var i = 1; i < c.length; i++) out[i - 1] = i * (c[i] || 0);
    while (out.length && !out[out.length - 1]) out.pop();
    return out.length ? out : [0];
  }

  function integCoeffs(c) {
    var out = [];
    for (var i = 0; i < c.length; i++) {
      if (i === -1) continue;
      out[i + 1] = (c[i] || 0) / (i + 1);
    }
    return out;
  }

  function texPoly(c, variable) {
    variable = variable || "x";
    var s = "";
    for (var i = c.length - 1; i >= 0; i--) {
      var k = c[i] || 0;
      if (!k) continue;
      var abs = Math.abs(k);
      var coefTex = texFrac(abs);
      var piece = "";
      if (i === 0) piece = coefTex;
      else if (i === 1) piece = (abs === 1 ? "" : coefTex) + variable;
      else piece = (abs === 1 ? "" : coefTex) + variable + "^{" + i + "}";
      s += s === "" ? (k < 0 ? "-" : "") + piece : (k < 0 ? " - " : " + ") + piece;
    }
    return s || "0";
  }

  function texFrac(v) {
    if (Number.isInteger(v)) return String(v);
    for (var q = 2; q <= 24; q++) {
      var p = v * q;
      if (Math.abs(p - Math.round(p)) < 1e-9 && Math.round(p) < 1000) {
        return "\\frac{" + Math.round(p) + "}{" + q + "}";
      }
    }
    return String(Math.round(v * 1000) / 1000);
  }

  function fmtNum(n) {
    return Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000);
  }

  function detectIntent(raw) {
    var s = normalize(raw);
    if (/d\/dx|deriv|differentiate|\u0645\u0634\u062a\u0642|\u0627\u0634\u062a\u0642/.test(s)) return "derivative";
    if (/\bint\b|integral|\u062a\u0643\u0627\u0645\u0644/.test(s)) return "integral";
    if (/lim|\u0646\u0647\u0627\u064a\u0629/.test(s)) return "limit";
    if (/dy\/dx|\u0645\u0639\u0627\u062f\u0644\u0629 \u062a\u0641\u0627\u0636\u0644\u064a\u0629|differential equation|ode/.test(s)) return "ode";
    return null;
  }

  function extractExpr(raw) {
    var parenMatch = raw.match(/\(([^()]*)\)\s*\/\s*\(([^()]*)\)/);
    if (parenMatch) return { num: parenMatch[1], den: parenMatch[2] };
    var n = normalize(raw);
    var fracMatch = n.match(/([a-z0-9.^+\-*\s]+?)\s*\/\s*([a-z0-9.^+\-*\s]+)/);
    if (fracMatch && /x/.test(fracMatch[1] + fracMatch[2]) && !/^d$/.test(fracMatch[1].trim()) && !/^dx?$/.test(fracMatch[1].trim())) {
      return { num: fracMatch[1], den: fracMatch[2] };
    }
    var s = n
      .replace(/\bd\s*\/\s*dx\b/g, " ")
      .replace(/\bint(egral)?\b/g, " ")
      .replace(/\bdx\b/g, " ")
      .replace(/\bof\b/g, " ")
      .replace(/\blim[a-z]*\b/g, " ")
      .replace(/[=:]/g, " ");
    var m = s.match(/[-+0-9.x^\s*]+/g);
    var best = "";
    (m || []).forEach(function (chunk) { if (chunk.indexOf("x") !== -1 && chunk.length > best.length) best = chunk; });
    if (!best) best = s;
    return { expr: best.replace(/\s+/g, " ").trim() };
  }

  function pointOf(raw) {
    var m = normalize(raw).match(/x\s*->\s*(-?\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : 0;
  }

  function solveDerivative(raw, langIsAr) {
    var ex = extractExpr(raw);
    var c = parsePoly(ex.expr !== undefined ? ex.expr : raw);
    if (!c) return null;
    var d = derivCoeffs(c);
    var ar = langIsAr;
    return {
      given: ar
        ? "لدينا الدالة f(x) = " + texPlain(texPoly(c)) + " والمطلوب إيجاد المشتقة f\u2032(x)."
        : "We have f(x) = " + texPlain(texPoly(c)) + ", required: f\u2032(x).",
      hint: ar
        ? "طبّق قاعدة القوة على كل حد على حدة: اضرب المعامل في الأس ثم انقص الأس واحدًا."
        : "Apply the power rule term by term: multiply coefficient by exponent, then decrease the exponent.",
      steps: [
        {
          t: ar ? "أعد كتابة الدالة بصيغة القوى" : "Rewrite the function in power form",
          tex: "f(x)=" + texPoly(c),
          why: ar ? "قاعدة القوة تعمل على الصيغة x^n" : "The power rule expects x^n form"
        },
        {
          t: ar ? "طبّق قاعدة القوة على كل حد" : "Apply the power rule to each term",
          tex: "\\frac{d}{dx}x^{n}=nx^{n-1}",
          why: ar ? "القاعدة الأساسية للتفاضل" : "The fundamental differentiation rule"
        },
        {
          t: ar ? "اجمع النتائج" : "Collect the results",
          tex: "f'(x)=" + texPoly(d),
          why: ar ? "التفاضل عملية خطية على الجمع" : "Differentiation is linear over sums"
        }
      ],
      resultTex: "f'(x)=" + texPoly(d),
      similar: makeSimilarDerivative(c),
      lessonRef: { track: "derivatives", lesson: "drv-l2" }
    };
  }

  function makeSimilarDerivative(c) {
    var a = 2 + Math.floor(Math.random() * 4);
    var b = 1 + Math.floor(Math.random() * 5);
    var nc = [];
    nc[2] = a; nc[1] = b; nc[0] = Math.floor(Math.random() * 9) - 3;
    return {
      q: "\\frac{d}{dx}\\left(" + texPoly(nc) + "\\right)",
      ans: texPoly(derivCoeffs(nc))
    };
  }

  function solveIntegral(raw, langIsAr) {
    var ex = extractExpr(raw);
    var src = ex.expr !== undefined ? ex.expr : raw;
    var c = parsePoly(src.replace(/\bint\b|\bdx\b/g, ""));
    if (!c) return null;
    var ic = integCoeffs(c);
    var ar = langIsAr;
    return {
      given: ar
        ? "المطلوب حساب التكامل غير المحدد للمكامل " + texPlain(texPoly(c)) + "."
        : "Compute the indefinite integral of " + texPlain(texPoly(c)) + ".",
      hint: ar
        ? "ارفع كل أس درجة واحدة واقسم على الأس الجديد، ولا تنسَ ثابت التكامل C."
        : "Raise each exponent by one and divide by the new exponent; never forget +C.",
      steps: [
        {
          t: ar ? "اكتب قاعدة القوة التكاملية" : "State the integration power rule",
          tex: "\\int x^{n}dx=\\frac{x^{n+1}}{n+1}+C\\quad(n\\neq-1)",
          why: ar ? "لأن مشتقة الناتج تعيد المكامل" : "Because differentiating the result recovers the integrand"
        },
        {
          t: ar ? "طبّق القاعدة حدًا حدًا" : "Apply term by term",
          tex: "\\int \\left(" + texPoly(c) + "\\right)dx=" + texPoly(ic) + "+C",
          why: ar ? "التكامل خطي مثل الاشتقاق" : "Integration is linear, like differentiation"
        },
        {
          t: ar ? "تحقق بالاشتقاق العكسي" : "Verify by differentiating back",
          tex: "\\frac{d}{dx}\\left[" + texPoly(ic) + "+C\\right]=" + texPoly(c),
          why: ar ? "التحقق يحميك من أخطاء الأسس" : "Back-checking protects against exponent slips"
        }
      ],
      resultTex: "\\int " + texPoly(c) + "dx=" + texPoly(ic) + "+C",
      similar: makeSimilarIntegral(),
      lessonRef: { track: "integrals", lesson: "int-l1" }
    };
  }

  function makeSimilarIntegral() {
    var nc = [];
    nc[2] = 1 + Math.floor(Math.random() * 5);
    nc[1] = -(2 + Math.floor(Math.random() * 4));
    nc[0] = Math.floor(Math.random() * 8) + 1;
    return {
      q: "\\int \\left(" + texPoly(nc) + "\\right)dx",
      ans: texPoly(integCoeffs(nc)) + "+C"
    };
  }

  function solveLimit(raw, langIsAr) {
    var ex = extractExpr(raw);
    if (ex.num === undefined) return null;
    var cn = parsePoly(ex.num), cd = parsePoly(ex.den);
    if (!cn || !cd) return null;
    var a = pointOf(raw);
    var ar = langIsAr;
    var fn = evalPoly(cn, a), fd = evalPoly(cd, a);
    var steps = [];

    steps.push({
      t: ar ? "جرّب التعويض المباشر عند نقطة الاقتراب" : "Try direct substitution at the approach point",
      tex: "\\frac{" + texNum(evalPoly(cn, a)) + "}{" + texNum(evalPoly(cd, a)) + "}",
      why: ar ? "التعويض هو الفحص الأول دائمًا" : "Substitution is always the first probe"
    });

    var resultTex;
    if (fd !== 0) {
      steps.push({
        t: ar ? "المقام لا ينعدم، فالنهاية بقيمة التعويض مباشرة" : "Denominator nonzero, so the limit equals the substituted value",
        tex: "\\lim_{x\\to " + a + "}=" + texNum(fn / fd),
        why: ar ? "استمرارية الدالة النسبية حيث المقام ≠ 0" : "Continuity of rationals where denominator ≠ 0"
      });
      resultTex = texNum(fn / fd);
    } else if (fn === 0) {
      steps.push({
        t: ar ? "حصلنا على صورة 0/0 غير المحددة" : "We hit the indeterminate form 0/0",
        tex: "\\frac{0}{0}",
        why: ar ? "كلا الطرفين ينعدمان لأن (x − a) عامل مشترك" : "Both vanish because (x − a) is a shared factor"
      });
      var dp = derivCoeffs(cn), dq = derivCoeffs(cd);
      steps.push({
        t: ar ? "احذف العامل (x − a) بتحليل المقامين أو استخدم قاعدة لوبيتال" : "Cancel the (x − a) factor, or use L'Hôpital's rule",
        tex: "\\lim_{x\\to " + a + "}\\frac{f'(x)}{g'(x)}=\\frac{" + texNum(evalPoly(dp, a)) + "}{" + texNum(evalPoly(dq, a)) + "}",
        why: ar ? "بعد الحذف يصبح التعويض ممكنًا؛ ولوبيتال اختصار مشروع للصورة 0/0" : "After cancellation substitution works; L'Hôpital legitimately resolves 0/0"
      });
      resultTex = texNum(evalPoly(dp, a) / evalPoly(dq, a));
    } else {
      steps.push({
        t: ar ? "البسط ≠ 0 والمقام → 0 ⇒ النهاية لانهائية" : "Numerator ≠ 0 with denominator → 0 ⇒ infinite limit",
        tex: "\\lim_{x\\to " + a + "}\\to\\infty",
        why: ar ? "القسمة على كمية تتناقص نحو الصفر" : "Division by a shrinking quantity"
      });
      resultTex = "\\infty";
    }

    return {
      given: ar
        ? "نبحث عن سلوك النسبة عند اقتراب x من " + a + ": البسط " + texPlain(texPoly(cn)) + " والمقام " + texPlain(texPoly(cd)) + "."
        : "Behavior of the ratio as x approaches " + a + ": numerator " + texPlain(texPoly(cn)) + ", denominator " + texPlain(texPoly(cd)) + ".",
      hint: ar ? "عوض أولًا؛ إن ظهرت 0/0 فابحث عن العامل المشترك (x − a)." : "Substitute first; if you get 0/0 hunt for the common factor (x − a).",
      steps: steps,
      resultTex: "\\lim_{x\\to " + a + "}\\frac{" + texPoly(cn) + "}{" + texPoly(cd) + "}=" + resultTex,
      similar: makeSimilarLimit(a),
      lessonRef: { track: "limits", lesson: "lim-l3" }
    };
  }

  function texNum(v) {
    return texFrac(v);
  }

  function makeSimilarLimit(a) {
    var root = a + (Math.random() < 0.5 ? 1 : 2);
    var b = root + 1;
    return {
      q: "\\lim_{x\\to " + root + "}\\frac{x^2-" + (root * root) + "}{x-" + root + "}",
      ans: String(2 * root)
    };
  }

  function solveOde(raw, langIsAr) {
    var s = normalize(raw);
    var ar = langIsAr;
    var km = s.match(/dy\/dx\s*=\s*(-?\d*\.?\d*)\*?y\b/);
    if (km) {
      var k = km[1] === "" || km[1] === "-" ? parseFloat(km[1] + "1") : parseFloat(km[1]);
      return {
        given: ar ? "معادلة تفاضلية من الرتبة الأولى: y\u2032 = " + k + "·y" : "First-order ODE: y\u2032 = " + k + "y",
        hint: ar ? "افصل المتغيرات: اجمع كل الـ y مع dy وكل الـ x مع dx." : "Separate variables: gather y terms with dy and x terms with dx.",
        steps: [
          { t: ar ? "افصل المتغيرات" : "Separate variables", tex: "\\frac{dy}{y}=" + k + "\\,dx", why: ar ? "كل دالة مع تفاضلها في طرف" : "Each function stays with its differential" },
          { t: ar ? "كامل الطرفين" : "Integrate both sides", tex: "\\ln|y|=" + k + "x+C_1", why: ar ? "تكامل 1/y هو ln|y|" : "∫dy/y = ln|y|" },
          { t: ar ? "أخرج y أسّيًا" : "Exponentiate", tex: "y=Ce^{" + k + "x}", why: ar ? "e^{ln|y|}=|y| ويُمتص الإشارة في الثابت" : "e^{ln|y|}=|y|, absorbed into C" }
        ],
        resultTex: "y=Ce^{" + k + "x}",
        similar: { q: "\\frac{dy}{dx}=3y", ans: "y=Ce^{3x}" },
        lessonRef: { track: "odes", lesson: "ode-l2" }
      };
    }
    var lin = s.match(/dy\/dx\s*=\s*([+-]?[0-9.x^\s+-]+)$/);
    var c = lin ? parsePoly(lin[1]) : null;
    if (c) {
      var ic = integCoeffs(c);
      return {
        given: ar ? "y\u2032 = " + texPlain(texPoly(c)) + " — تكامل مباشر بعد فصل بسيط." : "y\u2032 = " + texPlain(texPoly(c)) + " — direct integration.",
        hint: ar ? "المشتقة معروفة؟ إذن الدالة هي تكاملها + ثابت يحدده الشرط الابتدائي." : "Known derivative? Integrate it and pin the constant with an initial condition.",
        steps: [
          { t: ar ? "اكمل الطرفين بالنسبة لـ x" : "Integrate both sides w.r.t. x", tex: "y=\\int (" + texPoly(c) + ")dx=" + texPoly(ic) + "+C", why: ar ? "التكامل يعكس الاشتقاق" : "Integration reverses differentiation" },
          { t: ar ? "حدد C من شرط ابتدائي إن وُجد" : "Fix C using any initial condition", tex: "y(0)=y_0\\Rightarrow C=y_0", why: ar ? "الشرط الابتدائي يميز الحل الوحيد" : "An initial condition selects one solution" }
        ],
        resultTex: "y=" + texPoly(ic) + "+C",
        similar: { q: "\\frac{dy}{dx}=6x^2", ans: "y=2x^3+C" },
        lessonRef: { track: "odes", lesson: "ode-l2" }
      };
    }
    return null;
  }

  function texPlain(texHtml) {
    return texHtml;
  }

  function answer(question, lang) {
    var langIsAr = lang !== "en";
    var intent = detectIntent(question);
    var sol = null;
    if (intent === "derivative") sol = solveDerivative(question, langIsAr);
    else if (intent === "integral") sol = solveIntegral(question, langIsAr);
    else if (intent === "limit") sol = solveLimit(question, langIsAr);
    else if (intent === "ode") sol = solveOde(question, langIsAr);

    if (!sol) {
      sol = {
        fallback: true,
        given: "",
        hint: langIsAr
          ? "حدد نوع المسألة أولًا: هل تطلب نهاية أم اشتقاقًا أم تكاملًا؟ اكتبها بصيغة رمزية واضحة."
          : "Classify the problem first: is it a limit, a derivative or an integral? Write it symbolically.",
        steps: (langIsAr
          ? [
              "حدد نوع المسألة (نهاية، اشتقاق، تكامل، معادلة تفاضلية…) وما المطلوب بالضبط.",
              "اكتب المعطيات رمزيًا وحاول تبسيط المقام/الأسي/الأسس أولًا.",
              "طبّق نظرية أو قاعدة معروفة، ثم تحقق من الشروط قبل استخدامها.",
              "بعد الوصول للناتج، اختبره بتعويض قيمة عددية بسيطة."
            ]
          : [
              "Identify the type of problem and what exactly is required.",
              "Write the given data symbolically; simplify denominators and powers first.",
              "Apply a known theorem or rule after checking its conditions.",
              "Sanity-check the final result with a simple numerical value."
            ]
        ).map(function (s, i) { return { t: s, why: "" }; }),
        resultTex: "",
        similar: { q: "\\lim_{x\\to 2}\\frac{x^2-4}{x-2}", ans: "4" },
        lessonRef: { track: "limits", lesson: "lim-l1" }
      };
      intent = "generic";
    }

    var ref = sol.lessonRef || {};
    var lt = MW.findLesson(ref.track || "limits", ref.lesson);
    return {
      intent: intent,
      given: sol.given,
      hint: sol.hint,
      steps: sol.steps,
      resultTex: sol.resultTex,
      similar: sol.similar,
      lesson: lt.lesson ? {
        title: MW.pick(lt.lesson.title),
        trackTitle: MW.pick(lt.track.title),
        href: "#/lesson/" + lt.track.id + "/" + lt.lesson.id
      } : null
    };
  }

  function review(studentAnswer, lang) {
    var ar = lang !== "en";
    var hasEq = /[=]|\\frac|x\^|\u00B2/.test(studentAnswer);
    return {
      ok: hasEq,
      msg: ar
        ? (hasEq
            ? "بنية إجابتك منطقية. تحقق من ثلاثة أمور دائمًا: شروط تطبيق القاعدة، تبسيط قبل التعويض، والوحدات إن وجدت."
            : "لم أرَ خطوات واضحة. أعد كتابة حل مرقّم: المعطى، القاعدة المستخدمة، ثم النتيجة مع سبب كل خطوة.")
        : (hasEq
            ? "Your structure looks reasonable. Always verify three things: rule conditions, simplification before substituting, and units."
            : "I don't see clear steps. Rewrite your solution numbered: given data, the rule applied, then the result with a reason."),
      tip: ar
        ? "أقوى عادة لمهندس: اكتب «لماذا» بجانب كل خطوة كما تفعل لوحات المشاريع الهندسية."
        : "Strongest engineer habit: write a \u201Cwhy\u201D beside every step, like real engineering board work."
    };
  }

  window.MW = window.MW || {};
  MW.ai = { answer: answer, review: review };
})();
