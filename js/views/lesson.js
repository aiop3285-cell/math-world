(function () {
  "use strict";

  var S = null;

  function render(root, trackId, lessonId) {
    var found = MW.findLesson(trackId, lessonId);
    var track = found.track, unit = found.unit, lesson = found.lesson;
    if (!lesson) { location.hash = "#/paths"; return; }

    var p = MW.store.getProgress();
    var unlocked = MW.store.isLessonUnlocked(track, unit, lesson.id);
    if (!unlocked && p.completedLessons.indexOf(lesson.id) === -1) {
      MW.toast(MW.t("path_locked_lesson"), "error");
      location.hash = "#/path/" + trackId;
      return;
    }
    document.body.classList.remove("focus-mode");
    exitFocus(true);

    var meta = MW.lessonMeta(lesson.id, lesson, unit, track);
    S = {
      track: track, unit: unit, lesson: lesson, meta: meta,
      checks: MW.buildChecks(lesson, lesson.explain ? lesson.explain.length : 1),
      sessionPts: 0,
      attempts: {},
      solvedCore: {},
      revealedSol: {},
      checksPassed: {},
      seen: {},
      mistakes: [],
      done: p.completedLessons.indexOf(lesson.id) !== -1
    };

    root.innerHTML = buildPage();

    bindStepper(root);
    bindViz(root);
    bindExamples(root);
    bindChecks(root);
    bindTryProblems(root);
    bindActions(root);
    bindComplete(root);
    bindFocus(root);
    setupScrollSpy(root);

    setTimeout(function () {
      var saved = MW.store.loadLessonPos(lessonId);
      if (saved > 400 && !S.done) window.scrollTo({ top: saved });
    }, 60);
  }

  function buildPage() {
    var t = S.track, u = S.unit, l = S.lesson;
    var lang = document.documentElement.lang;
    return '' +
      '<div class="row-between" style="margin-bottom:14px">' +
        '<button class="link-btn row" data-back style="gap:6px;color:var(--c-muted)"><span style="transform:scaleX(' + (lang === "rtl" ? -1 : 1) + ')">' + MW.icon("chevron") + "</span> " + esc(MW.pick(t.title)) + "</button>" +
        '<button class="btn btn-ghost btn-sm" data-focus>' + MW.icon("eye") + MW.t("focus_mode") + "</button>" +
      "</div>" +
      objectivesCard() +
      sectionStepper() +
      '<div class="lesson-layout" id="lesson-body">' +
        "<div>" +
          '<section id="sec-idea" class="lsec">' + ideaSection() + "</section>" +
          '<section id="sec-example" class="lsec">' + examplesSection() + "</section>" +
          '<section id="sec-try" class="lsec">' + trySection() + "</section>" +
          '<section id="sec-app" class="lsec">' + appSection() + "</section>" +
          '<section id="sec-quiz" class="lsec">' + quizSection() + "</section>" +
        "</div>" +
        asideColumn() +
      "</div>";
  }

  function objectivesCard() {
    var o = S.meta.obj;
    var diffKey = o.diff === 3 ? "diff_hard" : o.diff === 1 ? "diff_easy" : "diff_medium";
    var items = o.items.map(function (it) {
      return '<li class="summary-item">' + MW.icon("target") + "<div>" + MW.pick(it) + "</div></li>";
    }).join("");
    return '<div class="card obj-card">' +
      '<h2 style="font-size:1.05rem;margin-bottom:10px">' + MW.t("obj_title") + "</h2>" +
      '<ul class="summary-list">' + items + "</ul>" +
      '<div class="row" style="gap:8px;margin-top:14px;flex-wrap:wrap">' +
        '<span class="chip chip-teal">' + MW.icon("clock") + MW.t("obj_time") + ": ~" + S.lesson.minutes + " " + MW.t("hours_min") + "</span>" +
        '<span class="chip chip-sand">' + MW.icon("chart") + MW.t("obj_difficulty") + ": " + MW.t(diffKey) + "</span>" +
      "</div></div>";
  }

  function sectionStepper() {
    var secs = [
      ["idea", "sec_idea"],
      ["example", "sec_example"],
      ["try", "sec_try"],
      ["app", "sec_app"],
      ["quiz", "sec_quiz"]
    ];
    return '<nav class="stepper card" aria-label="' + MW.t("sec_progress") + '">' +
      secs.map(function (s) {
        return '<a href="#/lesson/' + S.track.id + "/" + S.lesson.id + '" data-step="' + s[0] + '" data-target="sec-' + s[0] + '" class="step-link">' +
          '<span class="step-dot"></span><span>' + MW.t(s[1]) + "</span></a>";
      }).join("") +
      '<span class="stepper-fill"><span class="stepper-bar" id="stepper-bar"></span></span>' +
    "</nav>";
  }

  function ideaSection() {
    var l = S.lesson;
    var html = '<h2 class="sec-title"><span class="sec-kicker">' + MW.t("sec_idea") + "</span>" + esc(MW.pick(l.title)) + "</h2>";
    if (MW.lessonExtras.viz[l.id]) html += vizCard();
    html += '<div class="stack" style="gap:0;margin-top:6px">';
    (l.explain || []).forEach(function (b, i) {
      html += '<article class="explain-block" data-block="' + i + '">' +
        '<h3 class="explain-h"><span class="explain-idx num">' + (i + 1) + '</span>' + MW.pick(b.h) + "</h3>" +
        '<p class="explain-p">' + MW.pick(b.p) + "</p>" +
        (b.tex ? '<div class="math explain-tex">' + MW.tex(b.tex, true) + "</div>" : "") +
      "</article>";
    });
    html += "</div>";
    html += mistakesSection();
    html += '<h4 style="margin:22px 0 12px;font-size:.95rem;color:var(--c-muted)">' + MW.t("check_title") + "</h4>";
    html += '<div class="stack" style="gap:14px">' + S.checks.map(checkCard).join("") + "</div>";
    return html;
  }

  function mistakesSection() {
    var list = MW.demo.mistakesByTrack && MW.demo.mistakesByTrack[S.track.id];
    if (!list || !list.length) return "";
    var items = list.map(function (m) {
      return '<div class="summary-item" style="color:inherit"><span style="color:var(--c-danger);flex-shrink:0;margin-top:3px">' + MW.icon("alert") + "</span><div>" + MW.pick(m) + "</div></div>";
    }).join("");
    return '<div class="card" style="margin-top:22px;border-inline-start:3px solid var(--c-danger)">' +
      '<h4 style="font-size:.95rem;margin-bottom:10px;display:flex;align-items:center;gap:8px"><span style="color:var(--c-danger)">' + MW.icon("alert") + "</span>" + MW.t("mistakes_title") + "</h4>" +
      '<div class="summary-list">' + items + "</div></div>";
  }

  function checkCard(c, i) {
    return '<div class="exercise-item check-card" data-check="' + i + '" data-ans="' + c.ans + '" data-ref="' + c.ref + '">' +
      '<div class="exercise-q"><span class="chip chip-teal" style="font-size:.7rem;margin-inline-end:8px;vertical-align:2px">' + MW.t("check_title") + "</span>" + c.q + "</div>" +
      '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:10px">' +
        c.opts.map(function (opt, oi) {
          return '<button class="opt-btn" data-opt="' + oi + '"><span class="opt-key">' + String.fromCharCode(65 + oi) + '</span><span class="opt-label">' + esc(opt) + "</span></button>";
        }).join("") +
      "</div>" +
      '<div class="field-error" style="margin-top:10px" data-feedback></div>' +
      '<div class="check-guide" style="display:none;margin-top:10px" data-guide></div>' +
    "</div>";
  }

  function vizCard() {
    return '<div class="viz-card" data-viz>' +
      '<div class="viz-head"><strong style="font-size:.9rem">' + esc(MW.lessonExtras.viz[S.lesson.id].label) + '</strong><span class="chip chip-gold">' + MW.t("viz_limit_label") + '</span></div>' +
      '<svg viewBox="0 0 560 300" class="viz-svg" preserveAspectRatio="xMidYMid meet" role="img"></svg>' +
      '<input type="range" class="viz-slider" min="0" max="1000" value="60" aria-label="x slider">' +
      '<div class="viz-readout">' +
        '<span class="chip chip-sand num" data-vx></span>' +
        '<span class="chip chip-sand num" data-vf></span>' +
      "</div>" +
      '<table class="tbl viz-table"><thead><tr><th>x</th><th>f(x)</th></tr></thead><tbody data-vrows></tbody></table>' +
      '<p class="viz-caption" data-vcap></p>' +
    "</div>";
  }

  function examplesSection() {
    var l = S.lesson;
    var html = '<h2 class="sec-title"><span class="sec-kicker">' + MW.t("sec_example") + "</span>" + MW.t("lesson_examples") + "</h2>";
    html += '<div class="stack" style="gap:16px;margin-top:12px">';
    (l.examples || []).forEach(function (ex, i) {
      html += '<div class="example-block" data-example="' + i + '" data-steps="' + ex.steps.length + '" data-shown="0">' +
        '<div class="example-head"><span class="chip chip-sand">' + MW.t("example_label") + " " + (i + 1) + '</span><span class="grow" style="font-weight:600">' + MW.pick(ex.q) + "</span></div>" +
        '<div class="example-body">' +
          '<div class="ex-hint" style="display:none" data-hintbox></div>' +
          '<div class="example-steps">' +
            ex.steps.map(function (s, si) {
              return '<div class="step-row" data-step-row style="display:none">' +
                '<span class="step-num num">' + (si + 1) + "</span>" +
                '<div class="step-text grow"><div>' + MW.pick(s.t) + "</div>" +
                  (s.tex ? '<div class="math" style="overflow-x:auto;padding:6px 0">' + MW.tex(s.tex, true) + "</div>" : "") +
                  (s.why ? '<div class="step-why"><em>' + MW.t("why_label") + "</em> " + MW.pick(s.why) + "</div>" : "") +
                "</div></div>";
            }).join("") +
          "</div>" +
          '<div class="row" style="gap:8px;margin-top:14px;flex-wrap:wrap">' +
            '<button class="btn btn-soft btn-sm" data-hint-btn>' + MW.icon("bulb") + MW.t("show_hint_btn") + "</button>" +
            '<button class="btn btn-primary btn-sm" data-next-btn>' + MW.t("next_step_btn") + "</button>" +
            '<button class="link-btn" data-full-btn style="font-size:.8rem">' + MW.t("show_full_solution") + "</button>" +
          "</div>" +
        "</div></div>";
    });
    html += "</div>";
    return html;
  }

  function hintForLevel(lvl) {
    var heads = (S.lesson.explain || []).map(function (b) { return MW.pick(b.h); });
    var idx = lvl === 3 ? heads.length - 1 : lvl === 2 ? Math.floor(heads.length / 2) : 0;
    return heads[idx] || "";
  }

  function trySection() {
    var sorted = S.lesson.exercises.map(function (ex, i) { return { ex: ex, i: i }; })
      .sort(function (a, b) { return (a.ex.lvl || 1) - (b.ex.lvl || 1); });
    S.tryItems = sorted;
    var core = sorted.slice(0, 3), extra = sorted.slice(3);
    var html = '<h2 class="sec-title"><span class="sec-kicker">' + MW.t("sec_try") + "</span>" + MW.t("try_title") + "</h2>" +
      '<p class="muted" style="font-size:.83rem;margin-bottom:12px">' + MW.t("try_guess_note") + "</p>" +
      '<div class="stack" style="gap:16px">';
    core.forEach(function (w, idx) { html += tryProblem(w, idx); });
    if (extra.length) {
      html += '<details class="extra-practice"><summary class="link-btn" style="font-size:.85rem">+ ' + extra.length + " " + MW.t("lesson_exercises") + "</summary><div class=\"stack\" style=\"gap:14px;padding-top:12px\">";
      extra.forEach(function (w, idx) { html += tryProblem(w, idx + 3); });
      html += "</div></details>";
    }
    html += "</div>";
    return html;
  }

  function tryProblem(w, displayIdx) {
    var ex = w.ex;
    var meta = lvlMeta(ex.lvl);
    return '<div class="exercise-item try-item" data-try="' + w.i + '" data-lvlpts="' + meta.pts + '" data-attempts="0">' +
      '<div class="exercise-q"><strong class="num faint" style="margin-inline-end:6px">' + MW.t("try_problem") + " " + (displayIdx + 1) + '.</strong>' +
        '<span class="chip ' + meta.cls + '" style="font-size:.7rem;margin-inline-end:8px;vertical-align:2px">' + meta.label + " · +" + meta.pts + "</span>" +
        MW.pick(ex.q) + "</div>" +
      '<div class="try-hints stack" style="gap:8px;margin-bottom:10px" data-hints></div>' +
      '<button class="btn btn-ghost btn-sm" data-hint1-btn style="margin-bottom:10px">' + MW.icon("bulb") + MW.t("show_hint_btn") + "</button>" +
      '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr));gap:10px">' +
        ex.opts.map(function (opt, oi) {
          return '<button class="opt-btn" data-opt="' + oi + '"><span class="opt-key">' + String.fromCharCode(65 + oi) + '</span><span class="opt-label">' + esc(opt) + "</span></button>";
        }).join("") +
      "</div>" +
      '<div class="field-error" style="margin-top:10px" data-feedback></div>' +
      '<div class="row" style="gap:8px;margin-top:10px;display:none" data-afterfail-wrap>' +
        '<button class="btn btn-danger btn-sm" data-reveal-btn>' + MW.icon("eye") + MW.t("try_reveal_sol") + "</button>" +
        '<span class="faint" style="font-size:.78rem">' + MW.t("try_guess_note") + "</span>" +
      "</div>" +
    "</div>";
  }

  function lvlMeta(lvl) {
    if (lvl === 3) return { label: MW.t("lvl_hard"), cls: "chip-danger", pts: 15 };
    if (lvl === 2) return { label: MW.t("lvl_medium"), cls: "chip-gold", pts: 10 };
    return { label: MW.t("lvl_easy"), cls: "chip-teal", pts: 5 };
  }

  function appSection() {
    var app = S.meta.app;
    return '<section><h2 class="sec-title"><span class="sec-kicker">' + MW.t("engineer_title").split(" ").slice(0, 2).join(" ") + "</span>" + MW.t("engineer_title") + "</h2>" +
      '<div class="tip-card" style="margin-top:12px;line-height:2">' + MW.icon("grad") + "<div>" + (app ? MW.pick(app) : "") + "</div></div></section>";
  }

  function quizSection() {
    var passedQuiz = MW.store.getProgress().passedQuizzes.indexOf(S.unit.id) !== -1;
    return '<h2 class="sec-title"><span class="sec-kicker">' + MW.t("sec_quiz") + "</span>" + MW.t("quiz_title") + "</h2>" +
      '<div class="card" style="margin-top:12px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">' +
        '<span class="stat-icon" style="background:var(--c-gold-soft);color:#8a6524;width:46px;height:46px;border-radius:13px;display:grid;place-items:center">' + MW.icon("clipboard") + "</span>" +
        "<div class='grow'><strong>" + MW.pick(S.unit.title) + '</strong><div class="muted" style="font-size:.82rem">' + S.unit.quiz.questions.length + " " + MW.t("admin_questions_count") + " · " + MW.t("quiz_pass_score") + "</div></div>" +
        '<a class="btn btn-gold btn-sm" href="#/quiz/' + S.track.id + "/" + S.unit.id + '">' + (passedQuiz ? MW.icon("check") + MW.t("retry_quiz") : MW.t("take_quiz")) + "</a>" +
      "</div>" +
      '<div style="margin-top:26px;text-align:center">' + completeButtonHtml() + "</div>" +
      '<div class="action-row card">' +
        '<a class="btn btn-soft btn-sm" href="#/assistant?lesson=' + encodeURIComponent(MW.pick(S.lesson.title)) + "&q=" + encodeURIComponent((document.documentElement.lang === "ar" ? "اشرح لي فكرة «" : "Explain the idea \u201C") + MW.pick(S.lesson.title) + (document.documentElement.lang === "ar" ? "\u201D من دروس المنصة خطوة بخطوة" : "\u201D from this platform step by step")) + '">' + MW.icon("bot") + MW.t("ask_assistant") + "</a>" +
        '<button class="btn btn-ghost btn-sm" data-save-bookmark>' + MW.icon("star") + MW.t("save_review") + "</button>" +
        '<button class="btn btn-ghost btn-sm" data-flag-review>' + MW.icon("refresh") + MW.t("need_review") + "</button>" +
      "</div>";
  }

  function completeButtonHtml() {
    if (S.done) {
      return '<div class="chip chip-teal" style="padding:10px 18px;font-size:.9rem">' + MW.icon("check") + MW.t("lesson_completed_msg") + "</div>";
    }
    return '<button class="btn btn-primary btn-lg" data-complete style="min-width:min(320px,100%)">' + MW.icon("checkc") + MW.t("mark_complete") + "</button>";
  }

  function asideColumn() {
    var p = MW.store.getProgress();
    return '<aside class="stack" style="gap:16px">' +
      '<div class="lesson-side-card">' +
        '<div class="row-between" style="margin-bottom:12px"><strong>' + MW.t("lesson_summary") + '</strong><span class="chip chip-teal">' + MW.icon("book") + S.lesson.summary.length + "</span></div>" +
        '<div class="summary-list">' + S.lesson.summary.map(function (s) {
          return '<div class="summary-item">' + MW.icon("checkc") + "<div>" + MW.pick(s) + "</div></div>";
        }).join("") + "</div>" +
      "</div>" +
      '<div class="lesson-side-card">' +
        "<strong style=\"display:block;margin-bottom:10px\">" + MW.t("related_lessons") + "</strong>" +
        S.unit.lessons.map(function (lsn) {
          var lDone = p.completedLessons.indexOf(lsn.id) !== -1;
          var active = lsn.id === S.lesson.id;
          return '<a href="#/lesson/' + S.track.id + "/" + lsn.id + '" class="list-row" style="text-decoration:none;color:inherit;' + (active ? "background:var(--c-teal-soft);border-radius:10px;padding-inline-start:12px" : "") + '">' +
            '<span style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:' + (lDone ? "var(--c-teal)" : "var(--c-bg-soft)") + ";color:" + (lDone ? "#fff" : "var(--c-faint)") + ';flex-shrink:0">' + (lDone ? MW.icon("check") : '<svg viewBox="0 0 24 24" width="12" height="12"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>') + "</span>" +
            "<span style='font-size:.87rem;font-weight:" + (active ? "700" : "500") + "' class='grow'>" + esc(MW.pick(lsn.title)) + "</span>" +
          "</a>";
        }).join("") +
        '<a href="#/quiz/' + S.track.id + "/" + S.unit.id + '" class="list-row" style="text-decoration:none;color:inherit">' +
          '<span style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--c-gold-soft);color:#8a6524;flex-shrink:0">' + MW.icon("clipboard") + "</span>" +
          "<span class='grow' style='font-size:.87rem;font-weight:600'>" + MW.t("quiz") + "</span>" +
          '<span class="chip chip-gold">+30</span></a>' +
      "</div>" +
    "</aside>";
  }

  function bindStepper(root) {
    root.querySelectorAll("[data-step]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute("data-target"));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    root.querySelector("[data-back]").addEventListener("click", function () { location.hash = "#/path/" + S.track.id; });
  }

  function setupScrollSpy(root) {
    var sections = root.querySelectorAll(".lsec");
    var bar = root.querySelector("#stepper-bar");
    var total = sections.length;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id.replace("sec-", "");
          root.querySelectorAll("[data-step]").forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("data-step") === id);
          });
          S.seen[id] = true;
          updateBar();
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
    function updateBar() {
      var n = Object.keys(S.seen).length;
      if (bar) bar.style.width = Math.round(n / total * 100) + "%";
    }
    updateBar();

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      setTimeout(function () {
        ticking = false;
        if (/^#\/lesson\//.test(location.hash) && !S.done) MW.store.saveLessonPos(S.lesson.id, window.scrollY);
      }, 350);
    }, { passive: true });
  }

  function bindViz(root) {
    var cfg = MW.lessonExtras.viz[S.lesson.id];
    var card = root.querySelector("[data-viz]");
    if (!cfg || !card) return;

    var W = 560, H = 300, PADX = 34, PADY = 22;
    var x0 = cfg.domain[0], x1 = cfg.domain[1], y0 = cfg.range[0], y1 = cfg.range[1];
    function X(v) { return PADX + (v - x0) / (x1 - x0) * (W - 2 * PADX); }
    function Y(v) { return H - PADY - (v - y0) / (y1 - y0) * (H - 2 * PADY); }
    function f(t) { try { return Function("t", "return (" + cfg.fn + ")")(t); } catch (e) { return NaN; } }

    var path = "", prevNaN = true;
    for (var px = 0; px <= 260; px++) {
      var xv = x0 + px / 260 * (x1 - x0);
      var nearHole = cfg.hole !== undefined && cfg.hole && Math.abs(xv - cfg.a) < (x1 - x0) / 260;
      var yv = f(xv);
      if (isNaN(yv) || nearHole) { prevNaN = true; continue; }
      var cmd = prevNaN ? "M" : "L";
      path += cmd + X(xv).toFixed(1) + " " + Y(yv).toFixed(1);
      prevNaN = false;
    }

    var axesSvg =
      '<line x1="' + PADX + '" y1="' + Y(0) + '" x2="' + (W - PADX) + '" y2="' + Y(0) + '" stroke="rgba(29,45,53,.25)" stroke-width="1.2"/>' +
      '<line x1="' + X(0) + '" y1="' + PADY + '" x2="' + X(0) + '" y2="' + (H - PADY) + '" stroke="rgba(29,45,53,.25)" stroke-width="1.2"/>' +
      '<path d="' + path + '" fill="none" stroke="#3F7A7A" stroke-width="2.4" stroke-linecap="round"/>' +
      '<line x1="' + X(cfg.a) + '" y1="' + PADY + '" x2="' + X(cfg.a) + '" y2="' + (H - PADY) + '" stroke="rgba(112,81,59,.35)" stroke-dasharray="5 5"/>' +
      '<line x1="' + PADX + '" y1="' + Y(cfg.L) + '" x2="' + (W - PADX) + '" y2="' + Y(cfg.L) + '" stroke="rgba(200,154,75,.55)" stroke-dasharray="5 5"/>' +
      '<text x="' + (X(cfg.a) + 6) + '" y="' + (PADY + 12) + '" font-size="11" fill="#70513B">a</text>' +
      '<text x="' + (W - PADX - 20) + '" y="' + (Y(cfg.L) - 6) + '" font-size="11" fill="#8a6524">L</text>' +
      (cfg.hole ? '<circle cx="' + X(cfg.a) + '" cy="' + Y(cfg.L) + '" r="4.5" fill="#FAF7F2" stroke="#C89A4B" stroke-width="2"/>' :
        '<circle cx="' + X(cfg.a) + '" cy="' + Y(cfg.L) + '" r="4.5" fill="#C89A4B"/>') +
      '<circle data-dot r="6" cx="-99" cy="-99" fill="#70513B" stroke="#FAF7F2" stroke-width="2"/>';
    card.querySelector(".viz-svg").innerHTML = axesSvg;

    var slider = card.querySelector(".viz-slider");
    var vxEI = card.querySelector("[data-vx]");
    var vfEI = card.querySelector("[data-vf]");
    var rows = card.querySelector("[data-vrows]");
    var capEl = card.querySelector("[data-vcap]");
    var log = [];

    function sideOf(t) { return Math.sin(t / 90) > 0 ? 1 : -1; }

    function update() {
      var t = parseInt(slider.value, 10);
      var epsMax = (x1 - x0) * 0.42;
      var eps = Math.max(epsMax * (t / 1000), (x1 - x0) / 900);
      var side = sideOf(t);
      var xv = cfg.a + side * eps;
      var yv = f(xv);

      var dot = card.querySelector("[data-dot]");
      dot.setAttribute("cx", X(xv));
      dot.setAttribute("cy", Y(yv));

      vxEI.textContent = MW.t("viz_x_value") + " " + xv.toFixed(3);
      vfEI.textContent = MW.t("viz_fx_value") + " " + (isNaN(yv) ? "—" : yv.toFixed(3));

      var last = log[log.length - 1];
      if (!last || Math.abs(last.x - xv) > (x1 - x0) / 220) {
        log.push({ x: xv, y: yv });
        if (log.length > 5) log.shift();
        rows.innerHTML = log.slice().reverse().map(function (r) {
          return "<tr><td class='num'>" + r.x.toFixed(3) + "</td><td class='num'>" + (isNaN(r.y) ? "—" : r.y.toFixed(3)) + "</td></tr>";
        }).join("");
      }

      var ratio = eps / epsMax;
      capEl.textContent = ratio > 0.45 ? MW.t("viz_caption_far") : ratio > 0.12 ? MW.t("viz_caption_mid") : MW.t("viz_caption_near");
      capEl.className = "viz-caption" + (ratio <= 0.12 ? " near" : "");
    }
    slider.addEventListener("input", update);
    update();
  }

  function bindExamples(root) {
    root.querySelectorAll("[data-example]").forEach(function (block) {
      var totalSteps = parseInt(block.getAttribute("data-steps"), 10);
      var shown = block.getAttribute("data-shown");
      var rows = block.querySelectorAll("[data-step-row]");
      var nextBtn = block.querySelector("[data-next-btn]");
      var hintBtn = block.querySelector("[data-hint-btn]");
      var hintBox = block.querySelector("[data-hintbox]");
      var fullBtn = block.querySelector("[data-full-btn]");

      hintBtn.addEventListener("click", function () {
        if (hintBox.style.display === "none" || !hintBox.style.display) {
          hintBox.innerHTML = MW.icon("bulb") + "<span>" + MW.t("show_hint_btn") + ": " + hintForLevel(1) + ' <span class="faint num">(' + totalSteps + " " + MW.t("step_label") + ")</span></span>";
          hintBox.style.display = "flex";
        }
      });

      nextBtn.addEventListener("click", function () {
        if (shown < totalSteps) {
          rows[shown].style.display = "flex";
          shown++;
          block.setAttribute("data-shown", String(shown));
          if (shown >= totalSteps) {
            nextBtn.disabled = true;
            nextBtn.innerHTML = MW.icon("check") + MW.t("steps_done");
          }
        }
      });

      fullBtn.addEventListener("click", function () {
        rows.forEach(function (r) { r.style.display = "flex"; });
        shown = totalSteps;
        block.setAttribute("data-shown", String(shown));
        nextBtn.disabled = true;
        nextBtn.innerHTML = MW.icon("check") + MW.t("steps_done");
      });
    });
  }

  function bindChecks(root) {
    root.querySelectorAll("[data-check]").forEach(function (card) {
      var correct = parseInt(card.getAttribute("data-ans"), 10);
      var refIdx = parseInt(card.getAttribute("data-ref"), 10);
      var idx = parseInt(card.getAttribute("data-check"), 10);
      var whyText = (S.checks[idx] || {}).why || "";
      var fb = card.querySelector("[data-feedback]");
      var guide = card.querySelector("[data-guide]");
      card.querySelectorAll("[data-opt]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (card.getAttribute("data-resolved") === "1") return;
          var chosen = parseInt(btn.getAttribute("data-opt"), 10);
          if (chosen === correct) {
            card.setAttribute("data-resolved", "1");
            card.querySelectorAll("[data-opt]").forEach(function (b) {
              b.disabled = true;
              if (parseInt(b.getAttribute("data-opt"), 10) === correct) b.classList.add("correct");
            });
            fb.innerHTML = '<div class="result-banner ok" style="margin-top:0"><div><strong>' + MW.t("check_got_it") + '</strong><div style="font-size:.86rem;margin-top:4px"><em>' + MW.t("check_correct_why") + ":</em> " + whyText + "</div></div></div>";
            S.checksPassed[String(idx)] = true;
            addSessionPts(5);
          } else {
            btn.classList.add("wrong");
            btn.disabled = true;
            guide.style.display = "flex";
            guide.innerHTML =
              '<div class="insight-icon brown" style="width:34px;height:34px">' + MW.icon("alert") + "</div>" +
              '<div><div style="font-weight:600;font-size:.88rem">' + MW.t("check_wrong_guide") + "</div>" +
              '<button class="link-btn" style="font-size:.8rem" data-jump>' + MW.t("review_point_link") + "</button> " +
              '<button class="link-btn" style="font-size:.8rem" data-retry-check>' + MW.t("check_retry") + "</button></div>";
            guide.querySelector("[data-retry-check]").addEventListener("click", function () {
              btn.classList.remove("wrong");
              btn.disabled = false;
              guide.style.display = "none";
            });
            guide.querySelector("[data-jump]").addEventListener("click", function () {
              var blk = document.querySelector('[data-block="' + refIdx + '"]');
              if (blk) {
                blk.scrollIntoView({ behavior: "smooth", block: "start" });
                if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                  blk.animate([{ background: "rgba(200,154,75,.18)" }, { background: "transparent" }], { duration: 1400 });
                }
              }
            });
            recordMistake("check-" + idx, card.querySelector(".exercise-q").textContent.trim(), String.fromCharCode(65 + correct));
          }
        });
      });
    });
  }

  function bindTryProblems(root) {
    root.querySelectorAll("[data-try]").forEach(function (item) {
      var exIdx = parseInt(item.getAttribute("data-try"), 10);
      var wrap = S.tryItems.filter(function (w) { return w.i === exIdx; })[0];
      var ex = wrap.ex;
      var pts = parseInt(item.getAttribute("data-lvlpts"), 10);
      var attempts = item.querySelector("[data-attempts]") ? item : null;
      var feedback = item.querySelector("[data-feedback]");
      var hintsBox = item.querySelector("[data-hints]");
      var hintBtn = item.querySelector("[data-hint1-btn]");
      var afterFail = item.querySelector("[data-afterfail-wrap]");
      var revealBtn = item.querySelector("[data-reveal-btn]");
      var hintsUsed = 0;

      hintBtn.addEventListener("click", function () {
        if (hintsUsed >= 2) return;
        var txt = hintsUsed === 0
          ? MW.t("review_point_link") + ": " + hintForLevel(ex.lvl)
          : (ex.lvl === 3
              ? (document.documentElement.lang === "ar" ? "قسّم المسألة إلى خطوتين وحدد القاعدة قبل الأرقام." : "Split into two steps; identify the rule before numbers.")
              : ex.lvl === 2
                ? (document.documentElement.lang === "ar" ? "بسّط أولًا وابحث عن نمط من الأمثلة المحلولة." : "Simplify first and look for a pattern from the worked examples.")
                : (document.documentElement.lang === "ar" ? "ابدأ بالتعويض المباشر وتحقق من كل رقم." : "Start with direct substitution and verify each number."));
        var el = document.createElement("div");
        el.className = "hint-line";
        el.innerHTML = MW.icon("bulb") + "<span><strong>" + MW.t("show_hint_btn") + " " + (hintsUsed + 1) + ":</strong> " + txt + "</span>";
        hintsBox.appendChild(el);
        hintsUsed++;
        if (hintsUsed >= 2) {
          hintBtn.disabled = true;
          var no = document.createElement("span");
          no.className = "faint";
          no.style.fontSize = ".76rem";
          no.textContent = MW.t("try_no_more_hints");
          hintsBox.appendChild(no);
        } else {
          hintBtn.innerHTML = MW.icon("bulb") + MW.t("show_hint_btn") + " 2";
        }
      });

      revealBtn && revealBtn.addEventListener("click", function () {
        S.revealedSol[exIdx] = true;
        showSolution();
      });

      function showSolution() {
        item.querySelectorAll("[data-opt]").forEach(function (b, bi) {
          b.disabled = true;
          if (bi === ex.ans) b.classList.add("correct");
        });
        if (afterFail) afterFail.style.display = "none";
      }

      item.querySelectorAll("[data-opt]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var key = "t" + exIdx;
          if (S.revealedSol[exIdx]) return;
          var chosen = parseInt(btn.getAttribute("data-opt"), 10);
          S.attempts[key] = (S.attempts[key] || 0) + 1;
          var n = S.attempts[key];

          if (chosen === ex.ans && n <= 2) {
            item.setAttribute("data-resolved", "1");
            item.querySelectorAll("[data-opt]").forEach(function (b, bi) {
              b.disabled = true;
              if (bi === ex.ans) b.classList.add("correct");
            });
            feedback.innerHTML = '<span class="result-banner ok" style="margin-top:0">' + MW.icon("checkc") + "<strong>" + MW.t("try_solved_pts", { n: pts }) + "</strong></span>";
            feedback.style.color = "var(--c-success)";
            S.solvedCore[exIdx] = true;
            addSessionPts(pts);
            if (attempts) attempts.setAttribute("data-attempts", "done");
            return;
          }

          if (n < 2) {
            btn.classList.add("wrong");
            btn.disabled = true;
            feedback.innerHTML = MW.icon("alert") + (hintsUsed === 0 ? MW.t("check_wrong_guide") + " — " + MW.t("show_hint_btn") : MW.t("check_retry"));
            feedback.style.color = "var(--c-danger)";
            if (afterFail && n >= 1) afterFail.style.display = "flex";
          } else {
            S.revealedSol[exIdx] = true;
            showSolution();
            feedback.innerHTML = MW.icon("info") + MW.t("try_guess_note");
            feedback.style.color = "var(--c-danger)";
            recordMistake("try-" + exIdx, item.querySelector(".exercise-q").textContent.trim(), String.fromCharCode(65 + ex.ans));
          }
        });
      });
    });
  }

  function bindActions(root) {
    root.querySelector("[data-save-bookmark]").addEventListener("click", function () {
      var added = MW.store.toggleBookmark({
        lessonId: S.lesson.id, trackId: S.track.id,
        lessonTitle: MW.pick(S.lesson.title),
        q: MW.pick(S.lesson.title)
      });
      MW.toast(added ? MW.t("saved_ok") : MW.t("removed_item"), added ? "success" : "");
    });
    root.querySelector("[data-flag-review]").addEventListener("click", function () {
      MW.store.addReview({
        lessonId: S.lesson.id, trackId: S.track.id,
        lessonTitle: MW.pick(S.lesson.title),
        q: (document.documentElement.lang === "ar" ? "مراجعة نقطة: " : "Review point: ") + MW.pick(S.lesson.title),
        correct: ""
      });
      MW.toast(MW.t("noted_review"), "success");
    });
  }

  function recordMistake(dedupeKey, qText, correctLetter) {
    S._recorded = S._recorded || {};
    if (S._recorded[dedupeKey]) return;
    S._recorded[dedupeKey] = true;
    S.mistakes.push(qText.slice(0, 120));
    MW.store.addReview({
      lessonId: S.lesson.id, trackId: S.track.id,
      lessonTitle: MW.pick(S.lesson.title),
      q: qText.slice(0, 110),
      correct: correctLetter || ""
    });
  }

  function addSessionPts(n) { S.sessionPts += n; }

  function masteryPct() {
    var checksT = S.checks.length || 1;
    var checksP = Object.keys(S.checksPassed).length;
    var coreT = Math.min(3, S.tryItems.length) || 1;
    var coreP = Object.keys(S.solvedCore).filter(function (k) { return S.solvedCore[k]; }).length;
    var secT = 5;
    var secP = Object.keys(S.seen).length;
    return Math.min(100, Math.round(checksP / checksT * 35 + coreP / coreT * 45 + secP / secT * 20));
  }

  function bindComplete(root) {
    var btn = root.querySelector("[data-complete]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      MW.store.completeLesson(S.lesson.id);
      MW.store.clearLessonPos(S.lesson.id);
      var p = MW.store.getProgress();
      var granted = p.newBadges || [];
      var badgeDef = granted.length ? MW.demo.badges.filter(function (b) { return b.id === granted[0]; })[0] : null;
      var tips = MW.demo.tips;
      var mastery = masteryPct();
      var flat = [];
      S.track.units.forEach(function (u) { u.lessons.forEach(function (l2) { flat.push(l2); }); });
      var idx = flat.findIndex(function (l2) { return l2.id === S.lesson.id; });
      var next = flat[idx + 1] || null;
      var circ = 2 * Math.PI * 52;

      var ov = document.createElement("div");
      ov.className = "success-overlay";
      var confetti = "";
      if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
        var colors = ["#3F7A7A", "#C89A4B", "#E6D2B8", "#70513B"];
        for (var ci = 0; ci < 12; ci++) {
          confetti += '<span class="confetti-piece" style="left:' + (4 + ci * 8) + "%;background:" + colors[ci % colors.length] + ';animation-delay:' + (ci * 80) + 'ms"></span>';
        }
      }
      ov.innerHTML =
        '<div class="success-card">' + confetti +
          '<div class="success-burst"></div>' +
          (badgeDef ? '<div class="success-badge-art">' + MW.badgeSVG(badgeDef, 84) + "</div>" : "") +
          '<h2 class="success-title">' + MW.t("done_title") + "</h2>" +
          '<p class="success-sub">' + esc(MW.pick(S.lesson.title)) + "</p>" +
          '<div class="done-stats">' +
            '<div class="done-stat"><svg viewBox="0 0 120 120" style="--pct:' + mastery + '" class="mini-ring"><circle cx="60" cy="60" r="52" class="rb"/><circle cx="60" cy="60" r="52" class="rf" stroke-dasharray="' + circ + '" stroke-dashoffset="' + circ + '"/></svg><strong class="num" data-mastery>0%</strong><span>' + MW.t("mastery_label") + "</span></div>" +
            '<div class="done-stat"><strong class="num" style="color:var(--c-teal-deep)">+' + S.sessionPts + '</strong><span>' + MW.t("gained_points") + "</span></div>" +
          "</div>" +
          '<div class="success-tip">' + MW.icon("bulb") + " " + MW.pick(tips[Math.floor(Math.random() * tips.length)]) + "</div>" +
          '<div class="stack" style="gap:10px;margin-top:18px">' +
            (next
              ? '<button class="btn btn-primary btn-block" data-go-next>' + MW.t("go_next_lesson") + ": " + esc(MW.pick(next.title)) + "</button>"
              : '<button class="btn btn-primary btn-block" data-go-path>' + MW.t("view_path") + "</button>") +
            '<button class="btn btn-ghost btn-block" data-review-mistakes>' + MW.icon("refresh") + MW.t("review_mistakes_btn") + " (" + S.mistakes.length + ")</button>" +
          "</div>" +
        "</div>";

      function close() {
        ov.remove();
        document.body.classList.remove("focus-mode");
        exitFocus(true);
        MW.router.render();
      }
      ov.addEventListener("click", function (e) {
        if (e.target === ov) close();
      });
      ov.querySelector("[data-go-next]") && ov.querySelector("[data-go-next]").addEventListener("click", function () {
        ov.remove(); exitFocus(true);
        location.hash = "#/lesson/" + S.track.id + "/" + next.id;
      });
      ov.querySelector("[data-go-path]") && ov.querySelector("[data-go-path]").addEventListener("click", function () {
        ov.remove(); exitFocus(true);
        location.hash = "#/path/" + S.track.id;
      });
      ov.querySelector("[data-review-mistakes]").addEventListener("click", function () {
        close();
        setTimeout(function () { openReviewPanel(S.mistakes); }, 250);
      });
      document.body.appendChild(ov);

      setTimeout(function () {
        var rf = ov.querySelector(".rf");
        var mv = ov.querySelector("[data-mastery]");
        if (rf) rf.style.strokeDashoffset = String(circ * (1 - mastery / 100));
        if (mv) animateCount(mv, mastery, "%");
      }, 80);
    });
  }

  function animateCount(el, target, suffix) {
    var cur = 0;
    var step = Math.max(1, Math.round(target / 24));
    var iv = setInterval(function () {
      cur = Math.min(target, cur + step);
      el.textContent = cur + suffix;
      if (cur >= target) clearInterval(iv);
    }, 40);
  }

  function openReviewPanel(mistakesList) {
    var log = MW.store.getReviewLog().slice(-8).reverse();
    var body = document.createElement("div");
    var items = (mistakesList && mistakesList.length)
      ? mistakesList.map(function (q) { return '<div class="list-row"><span style="color:var(--c-danger)">' + MW.icon("alert") + "</span><span class='grow' style='font-size:.86rem'>" + esc(q) + "</span></div>"; }).join("")
      : '<p class="muted" style="font-size:.88rem">' + MW.t("no_mistakes_msg") + "</p>";
    body.innerHTML = items +
      '<details style="margin-top:14px"><summary class="link-btn" style="font-size:.83rem">' + MW.t("my_mistakes") + " (" + log.length + ')</summary><div style="padding-top:8px">' +
      (log.length ? log.map(function (r) {
        return '<div class="list-row"><span class="chip chip-sand" style="font-size:.7rem">' + esc(r.lessonTitle.slice(0, 18)) + '</span><span class="grow" style="font-size:.82rem">' + esc(r.q.slice(0, 70)) + "</span></div>";
      }).join("") : '<p class="faint" style="font-size:.82rem">—</p>') +
      "</div></details>" +
      '<p class="faint" style="font-size:.76rem;margin-top:12px">' + MW.t("mistakes_hint") + "</p>";
    MW.modal({ title: MW.t("my_mistakes"), body: body });
  }

  function bindFocus(root) {
    root.querySelector("[data-focus]").addEventListener("click", enterFocus);
  }

  function enterFocus() {
    if (document.body.classList.contains("focus-mode")) return;
    document.body.classList.add("focus-mode");
    var bar = document.createElement("div");
    bar.className = "focus-bar";
    bar.innerHTML =
      '<span class="chip chip-teal num" data-timer>00:00</span>' +
      '<span style="font-size:.8rem;color:var(--c-muted)">' + MW.t("study_timer") + "</span>" +
      '<button class="btn btn-ghost btn-sm" data-exit-focus>' + MW.icon("x") + MW.t("focus_exit") + "</button>";
    document.body.appendChild(bar);
    var seconds = 0;
    S._timer = setInterval(function () {
      seconds++;
      var m = String(Math.floor(seconds / 60)).padStart(2, "0");
      var s = String(seconds % 60).padStart(2, "0");
      var el = document.querySelector("[data-timer]");
      if (el) el.textContent = m + ":" + s;
    }, 1000);
    bar.querySelector("[data-exit-focus]").addEventListener("click", function () { exitFocus(); });
    window.scrollTo({ top: 0 });
  }

  function exitFocus(silent) {
    document.body.classList.remove("focus-mode");
    if (S && S._timer) { clearInterval(S._timer); S._timer = null; }
    var bar = document.querySelector(".focus-bar");
    if (bar) bar.remove();
    if (!silent && S) MW.router.render();
  }

  function esc(s) { return MW.esc(s == null ? "" : s); }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.lesson = { render: render, openReviewPanel: openReviewPanel };
})();
