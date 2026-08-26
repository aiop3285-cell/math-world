(function () {
  "use strict";

  function render(root) {
    var user = MW.store.session();
    var p = MW.store.getProgress();
    var hour = new Date().getHours();
    var greetKey = hour < 12 ? "hello_morning" : hour < 18 ? "hello_afternoon" : "hello_evening";
    var next = MW.store.nextLesson();

    root.innerHTML =
      '<div class="hello-band">' +
        "<div>" +
          '<h1 class="hello-title">' + MW.t("hello_prefix") + "، " + MW.esc(user.name) + "</h1>" +
          '<p class="hello-sub">' + MW.t(greetKey) + "</p>" +
        "</div>" +
        '<div class="row" style="gap:8px;flex-wrap:wrap">' +
          '<span class="chip chip-gold">' + MW.icon("flame") + '<span class="num">' + p.streak + "</span> " + MW.t("streak_days") + "</span>" +
          '<span class="chip chip-teal">' + MW.icon("trophy") + "#" + weeklyRank(p.weekXp) + " " + MW.t("rank_weekly") + "</span>" +
        "</div>" +
      "</div>" +

      '<div class="stat-cards">' +
        statCard("flame", p.streak, MW.t("stat_streak"), "var(--c-gold-soft)", "#8a6524") +
        statCard("star", p.points, MW.t("stat_points"), "var(--c-teal-soft)", "var(--c-teal-deep)") +
        statCard("medal", p.badges.length, MW.t("stat_badges"), "var(--c-sand-soft)", "var(--c-brown-deep)") +
        statCard("trophy", "#" + weeklyRank(p.weekXp), MW.t("stat_rank"), "var(--c-bg-soft)", "var(--c-muted)") +
      "</div>" +

      progressOverview(p) +

      '<div class="home-grid">' +
        "<div>" +
          (next ? nextLessonCard(next) : allDoneCard()) +
          mapProgressPanel() +
        "</div>" +
        "<div class=\"stack\" style=\"gap:16px\">" +
          challengeMini() +
          tipCard() +
          quickAssistant() +
        "</div>" +
      "</div>";

    bindActions(root);
  }

  function progressOverview(p) {
    var ov = MW.store.overallStats();
    var next = MW.store.nextLesson();
    var currentCourse = next ? findCourseOfTrack(next.track.id) : null;
    var html = '<div class="card" style="margin-bottom:16px">' +
      '<div class="row-between" style="margin-bottom:10px"><strong style="font-size:.95rem">' + MW.t("overall_progress") + '</strong><span class="chip chip-teal num">' + ov.pct + "%</span></div>" +
      '<div class="progress-track" style="height:10px"><span class="progress-fill" style="display:block;width:' + ov.pct + '%"></span></div>' +
      '<div class="faint num" style="font-size:.78rem;margin-top:6px">' + ov.done + "/" + ov.total + " " + MW.t("lessons_count") + "</div>";
    if (currentCourse) {
      html += '<a href="#/course/' + currentCourse.id + '" class="list-row" style="text-decoration:none;color:inherit;margin-top:8px">' +
        '<span class="stat-icon" style="width:36px;height:36px;border-radius:10px;background:var(--c-teal-soft);color:var(--c-teal-deep);display:grid;place-items:center">' + MW.icon(currentCourse.icon) + "</span>" +
        "<div class='grow'><div style='font-size:.8rem;color:var(--c-muted)'>" + MW.t("current_course") + "</div><div style='font-weight:700;font-size:.92rem'>" + MW.esc(MW.pick(currentCourse.title)) + "</div></div>" +
        '<span class="chip chip-teal">' + MW.t("continue_course") + "</span></a>";
    }
    html += "</div>";

    var recs = buildRecommendations(p);
    if (recs.length) {
      html += '<div class="card" style="margin-bottom:16px;border-inline-start:3px solid var(--c-gold)">' +
        '<strong style="font-size:.92rem;display:block;margin-bottom:10px">' + MW.t("recommended_review") + "</strong>" +
        '<div class="stack" style="gap:8px">' +
        recs.map(function (r) {
          return '<a href="' + r.href + '" class="list-row" style="text-decoration:none;color:inherit;padding:8px 0">' +
            '<span style="color:var(--c-danger);flex-shrink:0">' + MW.icon("alert") + "</span>" +
            "<span class='grow' style='font-size:.87rem'>" + MW.esc(r.label) + "</span>" +
            '<span class="chip chip-gold">' + MW.t("review_now") + "</span></a>";
        }).join("") + "</div></div>";
    }

    if (!p.placement) {
      html += '<a href="#/placement" class="card row" style="text-decoration:none;color:inherit;gap:14px;margin-bottom:16px;border:1px dashed rgba(200,154,75,.5)">' +
        '<span class="stat-icon" style="background:var(--c-gold-soft);color:#8a6524">' + MW.icon("target") + "</span>" +
        "<div class='grow'><div style='font-weight:700'>" + MW.t("placement_title") + '</div><div class="muted" style="font-size:.8rem">' + MW.t("placement_desc").slice(0, 90) + "…</div></div>" +
        '<span style="color:var(--c-faint)">' + MW.icon("chevron") + "</span></a>";
    }
    return html;
  }

  function findCourseOfTrack(trackId) {
    var courses = Object.keys(MW.curriculum.courses).map(function (k) { return MW.curriculum.courses[k]; });
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i];
      if (c.status !== "live") continue;
      var hit = (c.units || []).some(function (g) {
        return (g.parts || []).some(function (ref) { return ref.t === trackId; });
      });
      if (hit) return c;
    }
    return null;
  }

  function buildRecommendations(p) {
    var recs = [];
    Object.keys(p.quizScores || {}).forEach(function (unitId) {
      if (p.quizScores[unitId] < 60) {
        MW.content.tracks.forEach(function (track) {
          (track.units || []).forEach(function (unit) {
            if (unit.id === unitId) {
              recs.push({ label: MW.pick(unit.title) + " — " + p.quizScores[unitId] + "%", href: "#/quiz/" + track.id + "/" + unitId });
            }
          });
        });
      }
    });
    (MW.store.getReviewLog() || []).slice(-3).forEach(function (r) {
      recs.push({ label: r.q ? r.q.slice(0, 50) : r.lessonTitle, href: "#/lesson/" + r.trackId + "/" + r.lessonId });
    });
    return recs.slice(0, 3);
  }

  function statCard(iconName, value, label, bg, fg) {
    return '<div class="stat-card">' +
      '<span class="stat-icon" style="background:' + bg + ";color:" + fg + '">' + MW.icon(iconName) + "</span>" +
      "<div><div class=\"stat-value num\">" + value + '</div><div class="stat-label">' + label + "</div></div>" +
      "</div>";
  }

  function nextLessonCard(next) {
    var total = 0;
    next.track.units.forEach(function (u) { total += u.lessons.length; });
    return '<div class="next-lesson-card">' +
      '<div class="next-kicker">' + MW.t("next_lesson_kicker") + "</div>" +
      '<h2 class="next-title">' + MW.esc(MW.pick(next.lesson.title)) + "</h2>" +
      '<div class="next-meta">' + MW.esc(MW.pick(next.track.title)) + " · " + MW.esc(MW.pick(next.unit.title)) + " · " + next.lesson.minutes + " " + MW.t("hours_min") + "</div>" +
      '<button class="btn" data-go-lesson="' + next.track.id + "/" + next.lesson.id + '">' + MW.icon("play") + MW.t("start_lesson") + "</button>" +
    "</div>";
  }

  function allDoneCard() {
    return '<div class="next-lesson-card">' +
      '<div class="next-kicker">' + MW.t("success_well_done") + "</div>" +
      '<h2 class="next-title">' + MW.t("success_keep_going") + "</h2>" +
      '<button class="btn" data-go="#/paths">' + MW.icon("map") + MW.t("nav_paths") + "</button>" +
    "</div>";
  }

  function challengeMini() {
    var ch = dailyChallenge();
    var p = MW.store.getProgress();
    var solvedToday = p.challengeDay === MW.store.todayKey();
    return '<div class="challenge-today">' +
      '<div class="challenge-head"><span class="stat-icon" style="background:var(--c-gold-soft);color:#8a6524;width:40px;height:40px;border-radius:12px;display:grid;place-items:center">' + MW.icon("target") + "</span>" +
      '<div><div style="font-weight:700">' + MW.t("challenge_today_card") + '</div><div class="faint" style="font-size:.78rem">+' + 20 + " " + MW.t("points_label") + "</div></div></div>" +
      '<p style="font-size:.92rem;line-height:1.8;margin-bottom:14px">' + MW.esc(MW.pick(ch.q)) + "</p>" +
      '<button class="btn ' + (solvedToday ? "btn-ghost" : "btn-gold") + ' btn-sm" data-go="#/challenge" style="width:100%">' + (solvedToday ? MW.icon("check") : MW.icon("zap")) + (solvedToday ? MW.t("challenge_already_done") : MW.t("challenge_open")) + "</button>" +
    "</div>";
  }

  function tipCard() {
    var tips = MW.demo.tips;
    var dayIdx = Math.floor(Date.now() / 86400000) % tips.length;
    return '<div class="tip-card">' + MW.icon("bulb") +
      "<div><strong style='font-size:.85rem'>" + MW.t("tip_of_day") + "</strong><br>" + MW.pick(tips[dayIdx]) + "</div>" +
      "</div>";
  }

  function quickAssistant() {
    return '<a class="card row" href="#/assistant" style="text-decoration:none;color:inherit;gap:14px">' +
      '<span class="stat-icon" style="background:var(--c-teal-soft);color:var(--c-teal-deep)">' + MW.icon("bot") + "</span>" +
      "<div class='grow'><div style='font-weight:700'>" + MW.t("assistant_greeting_title") + '</div><div class="muted" style="font-size:.83rem">' + MW.t("assistant_warning") + "</div></div>" +
      '<span style="color:var(--c-faint)">' + MW.icon("chevron") + "</span></a>";
  }

  function mapProgressPanel() {
    var rows = MW.content.tracks.map(function (track) {
      var pct = MW.store.trackProgressPct(track);
      var doneCount = countDone(track);
      var nodeCls = pct === 100 ? "mini-node done" : hasStarted(track) ? "mini-node active" : "mini-node";
      return '<button class="mini-track-row" data-go-path="' + track.id + '">' +
        '<span class="' + nodeCls + '">' + (pct === 100 ? MW.icon("check") : track.order) + "</span>" +
        '<span class="mini-track-info">' +
          '<div class="mini-track-name">' + MW.esc(MW.pick(track.title)) + "</div>" +
          '<div class="mini-track-meta"><span class="num">' + doneCount + "</span> / " + lessonsTotal(track) + " " + MW.t("lessons_count") + " · " + pct + "%</div>" +
        "</span>" +
        '<span class="progress-track" style="width:90px;flex-shrink:0"><span class="progress-fill" style="display:block;width:' + pct + '%"></span></span>' +
      "</button>";
    }).join("");
    return '<div class="map-progress-panel" style="margin-top:16px">' +
      '<div class="row-between" style="margin-bottom:10px"><h3 style="font-size:1.02rem">' + MW.t("your_paths_progress") + "</h3></div>" + rows + "</div>";
  }

  function countDone(track) {
    var p = MW.store.getProgress();
    var n = 0;
    track.units.forEach(function (u) { u.lessons.forEach(function (l) { if (p.completedLessons.indexOf(l.id) !== -1) n++; }); });
    return n;
  }
  function lessonsTotal(track) {
    var n = 0;
    track.units.forEach(function (u) { n += u.lessons.length; });
    return n;
  }
  function hasStarted(track) {
    var p = MW.store.getProgress();
    var next = MW.store.nextLesson();
    return !!next && next.track.id === track.id;
  }

  function weeklyRank(weekXp) {
    var list = MW.demo.students.map(function (s) { return s.weekPoints; }).concat([weekXp]);
    list.sort(function (a, b) { return b - a; });
    return list.indexOf(weekXp) + 1;
  }

  function dailyChallenge() {
    var idx = Math.floor(Date.now() / 86400000) % MW.demo.dailyChallenges.length;
    return MW.demo.dailyChallenges[idx];
  }

  function bindActions(root) {
    root.querySelectorAll("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () { location.hash = b.getAttribute("data-go"); });
    });
    root.querySelectorAll("[data-go-lesson]").forEach(function (b) {
      b.addEventListener("click", function () { location.hash = "#/lesson/" + b.getAttribute("data-go-lesson"); });
    });
    root.querySelectorAll("[data-go-path]").forEach(function (b) {
      b.addEventListener("click", function () { location.hash = "#/path/" + b.getAttribute("data-go-path"); });
    });
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.home = { render: render };
})();
