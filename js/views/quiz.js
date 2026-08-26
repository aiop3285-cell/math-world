(function () {
  "use strict";

  var state = null;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function render(root, trackId, unitId) {
    var track = MW.findTrack(trackId);
    var unit = track && track.units.filter(function (u) { return u.id === unitId; })[0];
    if (!unit) { location.hash = "#/paths"; return; }
    start(root, {
      title: MW.t("quiz_title"),
      sub: MW.pick(unit.title),
      questions: unit.quiz.questions.map(function (q) {
        return { q: MW.pick(q.q), opts: q.opts, ans: q.ans, weak: MW.pick(unit.title), lessonLink: null };
      }),
      mode: "unit", unitId: unit.id, trackId: track.id,
      passScore: 60, points: 30
    });
  }

  function renderPractice(root, trackId, unitId) {
    var track = MW.findTrack(trackId);
    var unit = track && track.units.filter(function (u) { return u.id === unitId; })[0];
    if (!unit) { location.hash = "#/paths"; return; }
    var pool = [];
    (unit.lessons || []).forEach(function (l) {
      (l.exercises || []).forEach(function (ex) {
        pool.push({ q: MW.pick(ex.q), opts: ex.opts, ans: ex.ans, weak: MW.pick(lesson_title(l)), lessonLink: "#/lesson/" + trackId + "/" + l.id });
      });
    });
    if (pool.length < 3) { MW.toast(MW.t("coming_soon")); location.hash = "#/path/" + trackId; return; }
    start(root, {
      title: MW.t("practice_quiz"),
      sub: MW.pick(unit.title),
      questions: shuffle(pool).slice(0, Math.min(8, pool.length)),
      mode: "practice", trackId: trackId,
      passScore: 50, points: 0
    });
  }

  function lesson_title(l) { return l.title; }

  function renderFinal(root, courseId) {
    var course = MW.curriculum.getCourse(courseId);
    if (!course || course.status !== "live") { location.hash = "#/paths"; return; }
    var pool = [];
    MW.curriculum.courseParts(course).forEach(function (grp) {
      grp.parts.forEach(function (pr) {
        (pr.unit.quiz.questions || []).forEach(function (qz) {
          pool.push({
            q: MW.pick(qz.q), opts: qz.opts, ans: qz.ans,
            weak: MW.pick(grp.group.title),
            lessonLink: (pr.unit.lessons && pr.unit.lessons[0]) ? "#/lesson/" + pr.track.id + "/" + pr.unit.lessons[0].id : "#/course/" + courseId
          });
        });
      });
    });
    if (pool.length < 4) { location.hash = "#/course/" + courseId; return; }
    start(root, {
      title: MW.t("final_assessment"),
      sub: MW.pick(course.title),
      questions: shuffle(pool).slice(0, Math.min(12, pool.length)),
      mode: "final", courseId: courseId,
      passScore: 60, points: 50
    });
  }

  function start(root, cfg) {
    state = { cfg: cfg, idx: 0, answers: [], correctCount: 0, results: [] };
    drawQuestion(root);
  }

  function drawQuestion(root) {
    var q = state.cfg.questions[state.idx];
    var n = state.cfg.questions.length;

    root.innerHTML =
      '<div style="max-width:640px;margin-inline:auto">' +
        '<div class="row-between" style="margin-bottom:8px">' +
          '<h1 class="page-title">' + state.cfg.title + "</h1>" +
          (state.cfg.points ? '<span class="chip chip-gold">+' + state.cfg.points + " " + MW.t("points_label") + "</span>" : "") +
        "</div>" +
        '<p class="muted" style="font-size:.9rem;margin-bottom:6px">' + MW.esc(state.cfg.sub) + "</p>" +
        '<div class="quiz-progress-dots">' + state.cfg.questions.map(function (_, i) {
          return '<span class="q-dot' + (i < state.idx ? (state.results[i] && state.results[i].ok ? " ok" : " bad") : i === state.idx ? " active" : "") + '"></span>';
        }).join("") + "</div>" +
        '<div class="card" style="padding:clamp(20px,4vw,32px)">' +
          '<div class="faint num" style="font-size:.82rem;font-weight:600;margin-bottom:10px">' + MW.t("quiz_q_of", { i: state.idx + 1, n: n }) + "</div>" +
          '<div style="font-size:1.12rem;font-weight:600;line-height:1.9;margin-bottom:20px">' + q.q + "</div>" +
          '<div class="stack" style="gap:10px">' +
            q.opts.map(function (opt, oi) {
              var ltr = /^[\x00-\x7F 0-9+\-*/=^().]+$/.test(opt) ? "ltr" : "inherit";
              return '<button class="opt-btn" data-pick="' + oi + '" style="direction:' + ltr + '"><span class="opt-key">' + String.fromCharCode(65 + oi) + '</span><span class="opt-label">' + MW.esc(opt) + "</span></button>";
            }).join("") +
          "</div>" +
          '<div style="margin-top:22px;display:flex;justify-content:flex-end">' +
            '<button class="btn btn-primary" data-next disabled>' + (state.idx === n - 1 ? MW.t("quiz_finish") : MW.t("next")) + "</button>" +
          "</div>" +
        "</div>" +
      "</div>";

    var picked = -1;
    root.querySelectorAll("[data-pick]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (picked !== -1) return;
        picked = parseInt(b.getAttribute("data-pick"), 10);
        root.querySelectorAll("[data-pick]").forEach(function (o) {
          o.disabled = true;
          var v = parseInt(o.getAttribute("data-pick"), 10);
          if (v === q.ans) o.classList.add("correct");
        });
        if (picked !== q.ans) b.classList.add("wrong");
        var ok = picked === q.ans;
        if (ok) state.correctCount++;
        state.results.push({ ok: ok, weak: q.weak, link: q.lessonLink, q: q.q, correctOpt: q.opts[q.ans] });
        root.querySelector("[data-next]").disabled = false;
      });
    });

    root.querySelector("[data-next]").addEventListener("click", function () {
      if (state.idx < n - 1) { state.idx++; drawQuestion(root); }
      else finish(root);
    });
  }

  function finish(root) {
    var cfg = state.cfg;
    var total = cfg.questions.length;
    var pct = Math.round(state.correctCount / total * 100);
    var passed = pct >= cfg.passScore;
    var wrongs = state.results.filter(function (r) { return !r.ok; });
    var weakTopics = [];
    wrongs.forEach(function (w) { if (weakTopics.indexOf(w.weak) === -1) weakTopics.push(w.weak); });

    if (cfg.mode === "unit") MW.store.recordQuiz(cfg.unitId, pct);
    else if (cfg.mode === "practice") MW.store.recordPractice(state.correctCount);
    else if (cfg.mode === "final") MW.store.saveFinal(cfg.courseId, pct);

    var wrongList = wrongs.length
      ? '<div class="card" style="margin-top:16px;text-align:start"><strong style="font-size:.9rem;display:block;margin-bottom:8px">' + MW.t("wrong_answers") + " (" + wrongs.length + ')</strong><div class="stack" style="gap:8px">' +
        wrongs.map(function (w) {
          return '<div class="list-row"><span style="color:var(--c-danger);flex-shrink:0">' + MW.icon("x") + "</span>" +
            '<span class="grow" style="font-size:.84rem">' + MW.esc(w.q.slice(0, 90)) + '</span>' +
            '<span class="chip chip-teal num" style="flex-shrink:0">' + MW.esc(w.correctOpt.slice(0, 14)) + "</span></div>";
        }).join("") + "</div></div>"
      : "";

    var weakBlock = weakTopics.length
      ? '<div class="card" style="margin-top:14px;text-align:start"><strong style="font-size:.9rem;display:block;margin-bottom:8px">' + MW.t("weak_topics") + '</strong><div class="row" style="gap:8px;flex-wrap:wrap">' +
        weakTopics.map(function (t) { return '<span class="chip chip-danger">' + MW.esc(t) + "</span>"; }).join("") +
        "</div>" +
        (wrongs[0] && wrongs[0].link ? '<a class="btn btn-soft btn-sm" style="margin-top:12px" href="' + wrongs[0].link + '">' + MW.icon("book") + MW.t("review_now") + "</a>" : "") +
        "</div>"
      : "";

    var certBlock = cfg.mode === "final" && passed
      ? '<a class="btn btn-gold btn-block" style="margin-top:12px" href="#/certificate/' + cfg.courseId + '">' + MW.icon("award") + MW.t("certificate_title") + "</a>"
      : "";

    root.innerHTML =
      '<div style="max-width:600px;margin-inline:auto;text-align:center;padding-top:16px">' +
        '<svg class="score-ring" viewBox="0 0 130 130">' +
          '<circle class="score-circle score-bg" cx="65" cy="65" r="56"/>' +
          '<circle class="score-circle score-fg" cx="65" cy="65" r="56" stroke-dasharray="351.8" stroke-dashoffset="351.8" id="score-fg"/>' +
          '<text x="65" y="72" text-anchor="middle" class="score-value"><tspan class="num">' + pct + "%</tspan></text>" +
        "</svg>" +
        '<div class="faint num" style="font-size:.82rem">' + MW.t("quiz_score") + " — " + state.correctCount + "/" + total + " · " + MW.t("correct_answers") + ": " + state.correctCount + " · " + MW.t("wrong_answers") + ": " + wrongs.length + "</div>" +
        '<h2 style="margin-top:12px;font-size:1.3rem">' + (passed ? MW.t("quiz_passed") : MW.t("quiz_failed")) + "</h2>" +
        '<p class="muted" style="margin-top:4px;font-size:.9rem">' + MW.esc(cfg.sub) + "</p>" +
        wrongList + weakBlock + certBlock +
        '<div class="row" style="justify-content:center;gap:10px;margin-top:22px;flex-wrap:wrap">' +
          '<button class="btn btn-ghost" data-retry>' + MW.icon("refresh") + MW.t("retry_quiz") + "</button>" +
          '<button class="btn btn-primary" data-done>' + MW.t("done") + "</button>" +
        "</div>" +
      "</div>";

    setTimeout(function () {
      var fg = document.getElementById("score-fg");
      if (fg) fg.style.strokeDashoffset = String(351.8 * (1 - pct / 100));
    }, 60);

    root.querySelector("[data-retry]").addEventListener("click", function () {
      if (cfg.mode === "unit") render(root, cfg.trackId, cfg.unitId);
      else if (cfg.mode === "practice") renderPractice(root, cfg.trackId, cfg.unitId);
      else renderFinal(root, cfg.courseId);
    });
    root.querySelector("[data-done]").addEventListener("click", function () {
      if (cfg.mode === "unit" || cfg.mode === "practice") location.hash = "#/path/" + cfg.trackId;
      else location.hash = "#/course/" + cfg.courseId;
    });
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.quiz = { render: render, renderPractice: renderPractice, renderFinal: renderFinal };
})();
