(function () {
  "use strict";

  var T = function (ar, en) { return { ar: ar, en: en }; };
  var Q = function (area, arQ, enQ, opts, ans) {
    return { area: area, q: T(arQ, enQ), opts: opts, ans: ans };
  };

  var QUESTIONS = [
    Q("arithmetic", "احسب: ٣/٤ + ١/٦", "Compute: 3/4 + 1/6", ["11/12", "4/10", "1/2", "5/6"], 0),
    Q("arithmetic", "كم يساوي 15% من 80؟", "What is 15% of 80?", ["12", "10", "8", "15"], 0),
    Q("algebra", "حل المعادلة: 2x + 6 = 20", "Solve: 2x + 6 = 20", ["x=7", "x=13", "x=−7", "x=3"], 0),
    Q("algebra", "بسّط: (x³)²", "Simplify: (x³)²", ["x⁶", "x⁵", "x⁹", "x²"], 0),
    Q("geometry", "مثلث قائم ضلعاه 3 و4، فالوتر =", "Right triangle legs 3 and 4, hypotenuse =", ["5", "6", "7", "25"], 0),
    Q("geometry", "مجموع زوايا المثلث =", "Sum of triangle angles =", ["180°", "360°", "90°", "270°"], 0),
    Q("functions", "إذا كانت f(x)=2x−1 فإن f(4) =", "If f(x)=2x−1 then f(4) =", ["7", "8", "3", "9"], 0),
    Q("functions", "مجال الدالة f(x)=1/(x−2) هو:", "Domain of f(x)=1/(x−2):", ["x≠2", "كل الأعداد", "x>2", "x≥0"], 0),
    Q("trig", "sin 30° =", "sin 30° =", ["1/2", "√3/2", "√2/2", "1"], 0),
    Q("trig", "في مثلث قائم: tan θ =", "In a right triangle: tan θ =", ["مقابل/مجاور", "مجاور/مقابل", "مقابل/وتر", "وتر/مجاور"], 0),
    Q("calculus", "lim x→3 (2x+1) =", "lim x→3 (2x+1) =", ["7", "6", "9", "لا يوجد"], 0),
    Q("calculus", "مشتقة x³ هي:", "Derivative of x³ is:", ["3x²", "x²", "3x", "x⁴/4"], 0)
  ];

  var state = null;

  function render(root) {
    state = { idx: 0, correct: {}, answers: [] };
    drawIntro(root);
  }

  function drawIntro(root) {
    var saved = MW.store.getProgress().placement;
    root.innerHTML =
      '<div style="max-width:640px;margin-inline:auto">' +
        '<div class="track-hero" style="background:linear-gradient(140deg,#6d4f38,#70513B)">' +
          '<span class="path-icon">' + MW.icon("target") + "</span>" +
          '<h1 style="font-size:clamp(1.4rem,3vw,2rem)">' + MW.t("placement_title") + "</h1>" +
          '<p style="opacity:.9;margin-top:8px;font-size:.95rem;line-height:1.9">' + MW.t("placement_desc") + "</p>" +
        "</div>" +
        '<div class="card" style="text-align:center;padding:28px">' +
          (saved
            ? '<p class="muted" style="margin-bottom:14px">' + MW.t("placement_result") + ": <b>" + levelName(saved.level) + "</b></p>"
            : "") +
          '<button class="btn btn-primary btn-lg" data-start>' + MW.icon("play") + MW.t("placement_start") + "</button>" +
        "</div>" +
      "</div>";
    root.querySelector("[data-start]").addEventListener("click", function () { drawQuestion(root); });
  }

  function levelName(lvl) {
    return MW.t(lvl === "advanced" ? "level_advanced" : lvl === "intermediate" ? "level_intermediate" : "level_beginner");
  }

  function drawQuestion(root) {
    var q = QUESTIONS[state.idx];
    var n = QUESTIONS.length;
    root.innerHTML =
      '<div style="max-width:640px;margin-inline:auto">' +
        '<div class="quiz-progress-dots">' + QUESTIONS.map(function (_, i) {
          return '<span class="q-dot' + (i < state.idx ? " ok" : i === state.idx ? " active" : "") + '"></span>';
        }).join("") + "</div>" +
        '<div class="card" style="padding:clamp(20px,4vw,32px)">' +
          '<div class="faint num" style="font-size:.82rem;font-weight:600;margin-bottom:10px">' + MW.t("quiz_q_of", { i: state.idx + 1, n: n }) + "</div>" +
          '<div style="font-size:1.12rem;font-weight:600;line-height:1.9;margin-bottom:20px">' + MW.pick(q.q) + "</div>" +
          '<div class="stack" style="gap:10px">' +
            q.opts.map(function (opt, oi) {
              return '<button class="opt-btn" data-pick="' + oi + '"><span class="opt-key">' + String.fromCharCode(65 + oi) + '</span><span class="opt-label">' + MW.esc(opt) + "</span></button>";
            }).join("") +
          "</div>" +
        "</div>" +
      "</div>";

    root.querySelectorAll("[data-pick]").forEach(function (b) {
      b.addEventListener("click", function () {
        var chosen = parseInt(b.getAttribute("data-pick"), 10);
        root.querySelectorAll("[data-pick]").forEach(function (o) {
          o.disabled = true;
          var v = parseInt(o.getAttribute("data-pick"), 10);
          if (v === q.ans) o.classList.add("correct");
        });
        if (chosen !== q.ans) b.classList.add("wrong");
        state.answers.push(chosen === q.ans);
        if (chosen === q.ans) state.correct[q.area] = (state.correct[q.area] || 0) + 1;
        setTimeout(function () {
          if (state.idx < n - 1) { state.idx++; drawQuestion(root); }
          else finish(root);
        }, 550);
      });
    });
  }

  function finish(root) {
    var totalCorrect = state.answers.filter(Boolean).length;
    var pct = Math.round(totalCorrect / QUESTIONS.length * 100);
    var level = pct >= 75 ? "advanced" : pct >= 45 ? "intermediate" : "beginner";
    MW.store.savePlacement({ level: level, pct: pct, areas: state.correct, ts: Date.now() });

    var rec = level === "beginner" ? { id: "prep", label: MW.t("level_beginner") }
      : level === "intermediate" ? { id: "secondary", label: MW.t("level_intermediate") }
      : { id: "university", label: MW.t("level_advanced") };
    var stage = MW.curriculum.getStage(rec.id);

    root.innerHTML =
      '<div style="max-width:560px;margin-inline:auto;text-align:center;padding-top:16px">' +
        '<div class="card" style="padding:clamp(26px,5vw,40px)">' +
          '<div style="color:var(--c-teal);width:64px;margin:0 auto 8px">' + MW.icon("award") + "</div>" +
          '<h2 style="font-size:1.3rem">' + MW.t("placement_result") + "</h2>" +
          '<div style="font-size:2rem;font-weight:800;color:var(--c-teal-deep);margin:8px 0">' + levelName(level) + "</div>" +
          '<div class="chip chip-teal num" style="margin-bottom:16px">' + totalCorrect + "/" + QUESTIONS.length + " · " + pct + "%</div>" +
          '<div class="tip-card" style="text-align:start">' + MW.icon("map") +
            "<div><strong style='font-size:.85rem'>" + MW.t("placement_recommend") + ":</strong><br>" + MW.pick(stage.title) + " — " + MW.pick(stage.desc) + "</div></div>" +
          '<div class="stack" style="gap:10px;margin-top:20px">' +
            '<button class="btn btn-primary btn-block" data-go-stage>' + MW.icon("map") + MW.t("placement_recommend") + " → " + MW.pick(stage.title) + "</button>" +
            '<button class="btn btn-ghost btn-block" data-retake>' + MW.icon("refresh") + MW.t("placement_retake") + "</button>" +
          "</div>" +
        "</div>" +
      "</div>";

    root.querySelector("[data-go-stage]").addEventListener("click", function () { location.hash = "#/stage/" + rec.id; });
    root.querySelector("[data-retake]").addEventListener("click", function () { state = { idx: 0, correct: {}, answers: [] }; drawQuestion(root); });
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.placement = { render: render };
})();
