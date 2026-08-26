(function () {
  "use strict";

  function renderPaths(root) {
    var ordered = MW.content.tracks.slice().sort(function (a, b) { return a.order - b.order; });
    root.innerHTML =
      '<div class="page-head">' +
        '<h1 class="page-title">' + MW.t("nav_paths") + '</h1>' +
        '<p class="page-sub">' + MW.t("unit_quiz_desc") + "</p>" +
      "</div>" +
      '<div class="grid grid-2">' +
        ordered.map(pathCard).join("") +
      "</div>";
    bindPathCards(root);
    root.querySelectorAll("[data-notify]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        MW.auth.updateOwnProfile({ notify_tracks: [b.getAttribute("data-notify")] }).then(function () {
          b.disabled = true;
          b.innerHTML = MW.icon("check") + MW.t("noted_review");
          MW.toast(MW.t("notify_launch"), "success");
        });
      });
    });
  }

  function pathCard(track) {
    var pct = MW.store.trackProgressPct(track);
    var total = 0;
    (track.units || []).forEach(function (u) { total += (u.lessons || []).length; });
    var unitsN = (track.units || []).length;

    if (!total || !unitsN) {
      var expected = track.expectedUnits || "";
      return '<div class="path-card path-coming">' +
        '<span class="path-num num">' + track.order + "</span>" +
        '<span class="path-icon" style="background:' + hexA(track.hue, 0.12) + ";color:" + track.hue + '">' + MW.icon(track.icon) + "</span>" +
        '<h3 class="path-title">' + MW.esc(MW.pick(track.title)) + "</h3>" +
        '<p class="path-desc">' + MW.esc(MW.pick(track.desc)) + "</p>" +
        '<div class="path-stats">' +
          '<span class="chip chip-gold">' + MW.icon("clock") + MW.t("coming_soon") + "</span>" +
          (expected ? '<span class="chip chip-sand num">' + expected + " " + MW.t("units_count") + "</span>" : "") +
        "</div>" +
        '<button class="btn btn-gold btn-sm" style="margin-top:14px;width:100%" data-notify="' + track.id + '">' + MW.icon("zap") + MW.t("notify_launch") + "</button>" +
      "</div>";
    }

    return '<button class="path-card" data-path="' + track.id + '">' +
      '<span class="path-num num">' + track.order + "</span>" +
      '<span class="path-icon" style="background:' + hexA(track.hue, 0.12) + ";color:" + track.hue + '">' + MW.icon(track.icon) + "</span>" +
      '<h3 class="path-title">' + MW.esc(MW.pick(track.title)) + "</h3>" +
      '<p class="path-desc">' + MW.esc(MW.pick(track.desc)) + "</p>" +
      '<div class="path-stats">' +
        '<span class="chip chip-sand num">' + total + " " + MW.t("lessons_count") + "</span>" +
        '<span class="chip chip-sand num">' + unitsN + " " + MW.t("units_count") + "</span>" +
        (pct === 100 ? '<span class="chip chip-teal">' + MW.icon("check") + MW.t("completed") + "</span>" : "") +
      "</div>" +
      '<div class="progress-track" style="margin-top:14px"><span class="progress-fill" style="display:block;width:' + pct + '%"></span></div>' +
      "</button>";
  }

  function hexA(hex, a) {
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }

  function bindPathCards(root) {
    root.querySelectorAll("[data-path]").forEach(function (b) {
      b.addEventListener("click", function () { location.hash = "#/path/" + b.getAttribute("data-path"); });
    });
  }

  function renderTrack(root, trackId) {
    var track = MW.findTrack(trackId);
    if (!track) { location.hash = "#/paths"; return; }

    if (!track.units || !track.units.length) { renderComingTrack(root, track); return; }

    var p = MW.store.getProgress();
    var pct = MW.store.trackProgressPct(track);

    var mapHTML = track.units.map(function (unit, ui) {
      var items = unit.lessons.map(function (lesson) { return lessonItem(track, unit, lesson); }).join("");
      items += quizItem(track, unit);
      return '<section class="map-unit-head-wrap">' +
        '<div class="map-unit-head">' +
          '<span class="unit-index num">' + (ui + 1) + "</span>" +
          "<div><div class=\"unit-title-sm\">" + MW.esc(MW.pick(unit.title)) + '</div><div class="unit-sub-sm">' + MW.esc(MW.pick(unit.sub)) + "</div></div>" +
          '<span class="chip" style="margin-inline-start:auto">' + unit.lessons.length + " " + MW.t("lessons_count") + "</span>" +
        "</div>" +
        '<div class="map-line-wrap"><span class="map-connector"></span>' + items + "</div>" +
      "</section>";
    }).join("");

    root.innerHTML =
      '<button class="link-btn row" data-back style="margin-bottom:14px;gap:6px;color:var(--c-muted)"><span style="transform:scaleX(' + (document.documentElement.dir === "rtl" ? -1 : 1) + ')">' + MW.icon("chevron") + "</span> " + MW.t("back") + "</button>" +
      '<div class="track-hero" style="background:linear-gradient(140deg,' + shade(track.hue) + "," + track.hue + ')">' +
        '<span class="path-icon">' + MW.icon(track.icon) + "</span>" +
        '<h1 style="font-size:clamp(1.4rem,3vw,2rem)">' + MW.esc(MW.pick(track.title)) + "</h1>" +
        '<p style="opacity:.9;max-width:560px;margin-top:6px;font-size:.93rem;line-height:1.8">' + MW.esc(MW.pick(track.desc)) + "</p>" +
        '<div class="track-hero-meta">' +
          '<span class="chip" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.25)">' + pct + "% " + MW.t("completed") + "</span>" +
          '<span class="chip" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.25)">' + track.units.length + " " + MW.t("units_count") + "</span>" +
        "</div>" +
      "</div>" +
      '<div class="lesson-map">' + mapHTML + "</div>";

    root.querySelector("[data-back]").addEventListener("click", function () { history.back(); });

    root.querySelectorAll("[data-lesson]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-lesson");
        if (b.classList.contains("locked")) { MW.toast(MW.t("path_locked_lesson"), "error"); return; }
        location.hash = "#/lesson/" + trackId + "/" + id;
      });
    });
    root.querySelectorAll("[data-quiz]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-quiz");
        if (b.classList.contains("locked")) { MW.toast(MW.t("path_locked_lesson"), "error"); return; }
        location.hash = "#/quiz/" + trackId + "/" + id;
      });
    });
  }

  function renderComingTrack(root, track) {
    root.innerHTML =
      '<button class="link-btn row" data-back style="margin-bottom:14px;gap:6px;color:var(--c-muted)"><span style="transform:scaleX(' + (document.documentElement.dir === "rtl" ? -1 : 1) + ')">' + MW.icon("chevron") + "</span> " + MW.t("back") + "</button>" +
      '<div class="track-hero" style="background:linear-gradient(140deg,' + shade(track.hue) + "," + track.hue + ')">' +
        '<span class="path-icon">' + MW.icon(track.icon) + "</span>" +
        '<h1 style="font-size:clamp(1.4rem,3vw,2rem)">' + MW.esc(MW.pick(track.title)) + "</h1>" +
        '<p style="opacity:.9;max-width:560px;margin-top:6px;font-size:.93rem;line-height:1.8">' + MW.esc(MW.pick(track.desc)) + "</p>" +
        '<div class="track-hero-meta">' +
          '<span class="chip" style="background:rgba(255,255,255,.16);color:#fff;border-color:rgba(255,255,255,.28)">' + MW.icon("clock") + MW.t("coming_soon") + "</span>" +
          (track.expectedUnits ? '<span class="chip num" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.25)">' + track.expectedUnits + " " + MW.t("units_count") + "</span>" : "") +
        "</div>" +
      "</div>" +
      '<div class="card" style="max-width:520px;margin-inline:auto;text-align:center;padding:clamp(24px,5vw,36px)">' +
        '<p class="muted" style="line-height:1.9;font-size:.93rem">' + MW.t("coming_soon") + " — " + MW.esc(MW.pick(track.title)) + "</p>" +
        '<button class="btn btn-gold btn-block" style="margin-top:16px" data-notify="' + track.id + '">' + MW.icon("zap") + MW.t("notify_launch") + "</button>" +
      "</div>";
    root.querySelector("[data-back]").addEventListener("click", function () { location.hash = "#/paths"; });
    var nb = root.querySelector("[data-notify]");
    nb.addEventListener("click", function () {
      MW.auth.updateOwnProfile({ notify_tracks: [track.id] }).then(function () {
        nb.disabled = true;
        nb.innerHTML = MW.icon("check") + MW.t("noted_review");
        MW.toast(MW.t("notify_launch"), "success");
      });
    });
  }

  function shade(hex) {
    return hex + "E6";
  }

  function lessonItem(track, unit, lesson) {
    var p = MW.store.getProgress();
    var done = p.completedLessons.indexOf(lesson.id) !== -1;
    var unlocked = MW.store.isLessonUnlocked(track, unit, lesson.id);
    var next = MW.store.nextLesson();
    var current = next && next.lesson.id === lesson.id;
    var state = done ? "done" : unlocked ? "current" : "locked";
    var nodeCls = "map-node " + (done ? "done" : current ? "current" : unlocked ? "" : "locked");
    var tag = done
      ? '<span class="chip chip-teal map-state-tag">' + MW.icon("check") + MW.t("completed") + "</span>"
      : current
        ? '<span class="chip chip-teal map-state-tag">' + MW.t("current") + "</span>"
        : unlocked
          ? ""
          : '<span class="map-state-tag faint">' + MW.icon("lock") + "</span>";
    return '<button class="map-item' + (unlocked ? "" : " locked") + '" data-lesson="' + lesson.id + '" data-track="' + track.id + '">' +
      '<span class="map-row">' +
        '<span class="' + nodeCls + '">' + (done ? MW.icon("check") : unlocked ? MW.icon("play") : MW.icon("lock")) + "</span>" +
        '<span class="map-card"><span class="map-row" style="gap:10px">' +
          "<span class='grow'><span class=\"map-lesson-title\" style=\"display:block\">" + MW.esc(MW.pick(lesson.title)) + '</span><span class="map-lesson-meta">' + lesson.minutes + " " + MW.t("hours_min") + " · " + MW.esc(MW.pick(unit.title)) + "</span></span>" +
          tag +
        "</span></span>" +
      "</span></button>";
  }

  function quizItem(track, unit) {
    var p = MW.store.getProgress();
    var passed = p.passedQuizzes.indexOf(unit.id) !== -1;
    var lastLessonDone = unit.lessons.every(function (l) { return p.completedLessons.indexOf(l.id) !== -1; });
    var unlocked = lastLessonDone || passed || unit.lessons.some(function (l) { return p.completedLessons.indexOf(l.id) !== -1; });
    var nodeCls = "map-node quiz " + (passed ? "done" : unlocked ? "current" : "locked");
    return '<button class="map-item' + (unlocked ? "" : " locked") + '" data-quiz="' + unit.id + '" data-track="' + track.id + '">' +
      '<span class="map-row">' +
        '<span class="' + nodeCls + '">' + (passed ? MW.icon("check") : MW.icon("clipboard")) + "</span>" +
        '<span class="map-card"><span class="map-row" style="gap:10px">' +
          "<span class='grow'><span class=\"map-lesson-title\" style=\"display:block\">" + MW.t("quiz") + ' — ' + MW.esc(MW.pick(unit.title)) + '</span><span class="map-lesson-meta">' + unit.quiz.questions.length + " · " + MW.t("quiz_pass_score") + " · +30</span></span>" +
          (passed
            ? '<span class="chip chip-gold map-state-tag">' + MW.t("quiz_done") + "</span>"
            : unlocked
              ? '<span class="btn btn-soft btn-sm map-state-tag">' + MW.t("take_quiz") + "</span>"
              : '<span class="map-state-tag faint">' + MW.icon("lock") + "</span>") +
        "</span></span>" +
      "</span></button>";
  }

  function renderStages(root) {
    root.innerHTML =
      '<div class="page-head">' +
        '<h1 class="page-title">' + MW.t("all_stages") + "</h1>" +
        '<p class="page-sub">' + MW.t("stages_sub") + "</p>" +
        '<div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap">' +
          '<a class="btn btn-soft btn-sm" href="#/placement">' + MW.icon("target") + MW.t("placement_title") + "</a>" +
          '<a class="btn btn-ghost btn-sm" href="#/formulas">' + MW.icon("book") + MW.t("formulas_title") + "</a>" +
          '<a class="btn btn-ghost btn-sm" href="#/bank">' + MW.icon("clipboard") + MW.t("bank_title") + "</a>" +
        "</div>" +
      "</div>" +
      '<div class="grid grid-2">' +
        MW.curriculum.stages.map(function (st) {
          var courses = MW.curriculum.coursesOfStage(st.id);
          var live = courses.filter(function (c) { return c.status === "live"; }).length;
          return '<button class="path-card stage-card" data-stage="' + st.id + '">' +
            '<span class="path-icon" style="background:' + hexA(st.hue, 0.12) + ";color:" + st.hue + '">' + MW.icon(st.icon) + "</span>" +
            '<h3 class="path-title">' + MW.esc(MW.pick(st.title)) + "</h3>" +
            '<p class="path-desc">' + MW.esc(MW.pick(st.desc)) + "</p>" +
            '<div class="path-stats"><span class="chip chip-sand num">' + courses.length + " " + MW.t("courses_count") + "</span>" +
            (live ? '<span class="chip chip-teal num">' + live + " live ✓</span>" : "") +
            "</div></button>";
        }).join("") +
      "</div>";
    root.querySelectorAll("[data-stage]").forEach(function (b) {
      b.addEventListener("click", function () { location.hash = "#/stage/" + b.getAttribute("data-stage"); });
    });
  }

  function renderStage(root, stageId) {
    var st = MW.curriculum.getStage(stageId);
    if (!st) { location.hash = "#/paths"; return; }
    var courses = MW.curriculum.coursesOfStage(stageId);
    root.innerHTML =
      '<button class="link-btn row" data-back style="margin-bottom:14px;gap:6px;color:var(--c-muted)"><span style="transform:scaleX(' + (document.documentElement.dir === "rtl" ? -1 : 1) + ')">' + MW.icon("chevron") + "</span> " + MW.t("all_stages") + "</button>" +
      '<div class="track-hero" style="background:linear-gradient(140deg,' + shade(st.hue) + "," + st.hue + ')">' +
        '<span class="path-icon">' + MW.icon(st.icon) + "</span>" +
        '<h1 style="font-size:clamp(1.4rem,3vw,2rem)">' + MW.esc(MW.pick(st.title)) + "</h1>" +
        '<p style="opacity:.9;max-width:560px;margin-top:6px;font-size:.93rem;line-height:1.8">' + MW.esc(MW.pick(st.desc)) + "</p>" +
        '<div class="track-hero-meta"><span class="chip num" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.25)">' + courses.length + " " + MW.t("courses_count") + "</span></div>" +
      "</div>" +
      '<div class="grid grid-2">' + courses.map(courseCard).join("") + "</div>";

    root.querySelector("[data-back]").addEventListener("click", function () { location.hash = "#/paths"; });
    root.querySelectorAll("[data-course]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        if (e.target.closest("[data-notify]")) return;
        var id = b.getAttribute("data-course");
        if (b.classList.contains("path-coming")) { MW.toast(MW.t("coming_soon")); return; }
        location.hash = "#/course/" + id;
      });
    });
    root.querySelectorAll("[data-notify]").forEach(function (b) {
      b.addEventListener("click", function () {
        MW.auth.updateOwnProfile({ notify_tracks: [b.getAttribute("data-notify")] }).then(function () {
          b.disabled = true;
          b.innerHTML = MW.icon("check") + MW.t("noted_review");
          MW.toast(MW.t("notify_launch"), "success");
        });
      });
    });
  }

  function courseCard(course) {
    var stats = course.status === "live" ? MW.curriculum.courseStats(course) : { total: 0, done: 0, pct: 0 };
    var coming = course.status !== "live";
    var next = !coming ? MW.curriculum.courseNextLesson(course) : null;
    var started = stats.done > 0;
    var unitCount = (course.units || []).length;
    var open = coming ? "div" : "button";
    return "<" + open + ' class="path-card' + (coming ? " path-coming" : "") + (course.flag ? " flag-card" : "") + '" data-course="' + course.id + '">' +
      '<span class="path-num num">' + course.order + "</span>" +
      (course.flag ? '<span class="chip chip-gold flag-chip">' + MW.icon("gear") + MW.t("flag_course") + "</span>" : "") +
      '<span class="path-icon" style="background:' + hexA(course.hue, 0.12) + ";color:" + course.hue + '">' + MW.icon(course.icon) + "</span>" +
      '<h3 class="path-title">' + MW.esc(MW.pick(course.title)) + "</h3>" +
      '<p class="path-desc">' + MW.esc(MW.pick(course.desc)) + "</p>" +
      '<div class="path-stats">' +
        (coming
          ? '<span class="chip chip-gold">' + MW.icon("clock") + MW.t("coming_soon") + "</span>"
          : '<span class="chip chip-sand num">' + unitCount + " " + MW.t("course_units") + "</span>" +
            '<span class="chip chip-sand num">' + stats.total + " " + MW.t("lessons_count") + "</span>" +
            (stats.pct === 100 ? '<span class="chip chip-teal">' + MW.icon("check") + MW.t("completed") + "</span>" : "")) +
      "</div>" +
      (!coming ? '<div class="progress-track" style="margin-top:14px"><span class="progress-fill" style="display:block;width:' + stats.pct + '%"></span></div>' +
        '<div class="row-between" style="margin-top:10px"><span class="faint num" style="font-size:.78rem">' + stats.pct + '%</span>' +
        '<span class="btn btn-sm ' + (started ? "btn-primary" : "btn-soft") + '">' + (stats.pct === 100 ? MW.icon("check") : "") + (stats.pct === 100 ? MW.t("done") : started ? MW.t("continue_course") : MW.t("start_course")) + "</span></div>"
        : '<button class="btn btn-gold btn-sm" style="margin-top:14px;width:100%" data-notify="' + course.id + '">' + MW.icon("zap") + MW.t("notify_launch") + "</button>") +
    "</" + open + ">";
  }

  function renderCourse(root, courseId) {
    var course = MW.curriculum.getCourse(courseId);
    if (!course) { location.hash = "#/paths"; return; }
    if (course.status !== "live") { location.hash = "#/stage/" + course.stage; return; }

    var groups = MW.curriculum.courseParts(course);
    var stats = MW.curriculum.courseStats(course);
    var complete = stats.total > 0 && stats.done === stats.total;

    var mapHTML = groups.map(function (grp, gi) {
      var head =
        '<div class="map-unit-head">' +
          '<span class="unit-index num">' + (gi + 1) + "</span>" +
          "<div><div class=\"unit-title-sm\">" + MW.esc(MW.pick(grp.group.title)) + "</div>" +
          '<div class="unit-sub-sm">' + grp.parts.length + " " + MW.t("units_count") + "</div></div>" +
        "</div>";
      if (grp.coming || !grp.parts.length) {
        return '<section>' + head +
          '<div class="empty-state" style="padding:18px">' +
            '<div class="empty-title">' + MW.t("coming_unit") + '</div><div class="empty-sub">' + MW.t("expected_lessons") + "</div>" +
          "</div></section>";
      }
      var items = grp.parts.map(function (pr) {
        var unitLessons = (pr.unit.lessons || []).map(function (l) { return lessonItem(pr.track, pr.unit, l); }).join("");
        return unitLessons + quizItem(pr.track, pr.unit);
      }).join("");
      return "<section>" + head + '<div class="map-line-wrap"><span class="map-connector"></span>' + items + "</div></section>";
    }).join("");

    root.innerHTML =
      '<button class="link-btn row" data-back style="margin-bottom:14px;gap:6px;color:var(--c-muted)"><span style="transform:scaleX(' + (document.documentElement.dir === "rtl" ? -1 : 1) + ')">' + MW.icon("chevron") + "</span> " + MW.esc(MW.pick(MW.curriculum.getStage(course.stage).title)) + "</button>" +
      '<div class="track-hero" style="background:linear-gradient(140deg,' + shade(course.hue) + "," + course.hue + ')">' +
        '<span class="path-icon">' + MW.icon(course.icon) + "</span>" +
        '<h1 style="font-size:clamp(1.4rem,3vw,2rem)">' + MW.esc(MW.pick(course.title)) + "</h1>" +
        '<p style="opacity:.9;max-width:560px;margin-top:6px;font-size:.93rem;line-height:1.8">' + MW.esc(MW.pick(course.desc)) + "</p>" +
        '<div class="track-hero-meta">' +
          '<span class="chip num" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.25)">' + stats.pct + "% " + MW.t("completed") + "</span>" +
          '<span class="chip num" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.25)">' + course.units.length + " " + MW.t("course_units") + "</span>" +
          '<span class="chip num" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.25)">' + stats.done + "/" + stats.total + " " + MW.t("lessons_count") + "</span>" +
        "</div>" +
      "</div>" +
      '<div class="card" style="margin-bottom:20px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">' +
        '<a class="btn btn-gold btn-sm" href="#/final/' + course.id + '">' + MW.icon("trophy") + MW.t("final_assessment") + "</a>" +
        (complete
          ? '<a class="btn btn-primary btn-sm" href="#/certificate/' + course.id + '">' + MW.icon("award") + MW.t("certificate_title") + "</a>"
          : '<span class="faint" style="font-size:.8rem">' + MW.t("final_desc") + "</span>") +
      "</div>" +
      '<div class="lesson-map">' + mapHTML + "</div>";

    root.querySelector("[data-back]").addEventListener("click", function () { location.hash = "#/stage/" + course.stage; });
    root.querySelectorAll("[data-lesson]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.classList.contains("locked")) { MW.toast(MW.t("path_locked_lesson"), "error"); return; }
        location.hash = "#/lesson/" + b.getAttribute("data-track") + "/" + b.getAttribute("data-lesson");
      });
    });
    root.querySelectorAll("[data-quiz]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.classList.contains("locked")) { MW.toast(MW.t("path_locked_lesson"), "error"); return; }
        location.hash = "#/quiz/" + b.getAttribute("data-track") + "/" + b.getAttribute("data-quiz");
      });
    });
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.paths = {
    renderPaths: renderPaths,
    renderStages: renderStages,
    renderStage: renderStage,
    renderCourse: renderCourse,
    renderTrack: renderTrack,
    _lessonItem: lessonItem,
    _quizItem: quizItem
  };
})();
