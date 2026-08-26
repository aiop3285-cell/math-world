(function () {
  "use strict";

  var TABS = [
    { id: "overview", icon: "chart", label: "admin_overview" },
    { id: "students", icon: "users", label: "admin_students" },
    { id: "content", icon: "map", label: "admin_content" },
    { id: "quizzes", icon: "clipboard", label: "admin_quizzes" },
    { id: "challenges", icon: "target", label: "admin_challenges" },
    { id: "rewards", icon: "medal", label: "admin_rewards" },
    { id: "insights", icon: "bot", label: "admin_ai" }
  ];

  function render(root, tab) {
    tab = TABS.some(function (t) { return t.id === tab; }) ? tab : "overview";
    root.innerHTML =
      '<div class="page-head">' +
        '<h1 class="page-title">' + MW.t("admin_panel") + "</h1>" +
        '<p class="page-sub">' + MW.t("tagline") + "</p>" +
      "</div>" +
      '<div class="admin-layout">' +
        '<nav class="admin-nav" aria-label="admin tabs">' +
          TABS.map(function (t) {
            return '<a href="#/admin/' + t.id + '" class="admin-nav-item' + (t.id === tab ? " active" : "") + '">' + MW.icon(t.icon) + MW.t(t.label) + "</a>";
          }).join("") +
        "</nav>" +
        '<section id="admin-body"></section>' +
      "</div>";

    var body = root.querySelector("#admin-body");
    if (tab === "overview") drawOverview(body);
    else if (tab === "students") drawStudents(body);
    else if (tab === "content") drawContent(body);
    else if (tab === "quizzes") drawQuizzes(body);
    else if (tab === "challenges") drawChallenges(body);
    else if (tab === "rewards") drawRewards(body);
    else drawInsights(body);
  }

  function kpi(iconName, value, label, bg, fg) {
    return '<div class="stat-card"><span class="stat-icon" style="background:' + bg + ";color:" + fg + '">' + MW.icon(iconName) + '</span><div><div class="stat-value num">' + value + '</div><div class="stat-label">' + label + "</div></div></div>";
  }

  function barList(items, colorClass) {
    return '<div class="bar-list">' + items.map(function (it) {
      return "<div><div class='bar-row-label'><span>" + MW.esc(MW.pick(it.label)) + "</span><strong class=\"num\">" + (it.suffix || "") + it.value + "%</strong></div>" +
        '<div class="bar-track"><span class="bar-fill ' + (colorClass || "") + '" style="display:block;width:' + Math.min(100, it.value) + '%"></span></div></div>';
    }).join("") + "</div>";
  }

  function drawOverview(el) {
    var s = MW.demo.adminStats;
    el.innerHTML =
      (!MW.auth.isLive()
        ? '<div class="chip chip-gold" style="margin-bottom:14px">' + MW.icon("info") + MW.t("preview_data_chip") + "</div>"
        : "") +
      '<div class="kpi-grid">' +
        kpi("users", s.totalStudents, MW.t("admin_total_students"), "var(--c-teal-soft)", "var(--c-teal-deep)") +
        kpi("zap", s.activeToday, MW.t("admin_active_today") + " (" + s.weeklyGrowth + ")", "var(--c-gold-soft)", "#8a6524") +
        kpi("checkc", "68%", MW.t("admin_active_rate"), "var(--c-sand-soft)", "var(--c-brown-deep)") +
        kpi("book", "30", MW.t("lessons_count"), "var(--c-bg-soft)", "var(--c-muted)") +
      "</div>" +
      '<div class="grid grid-2" style="margin-top:22px">' +
        '<div class="card"><h3 style="font-size:1rem;margin-bottom:16px">' + MW.t("admin_active_rate") + " — " + MW.t("nav_paths") + "</h3>" + barList(s.completionByTrack) + "</div>" +
        '<div class="card"><h3 style="font-size:1rem;margin-bottom:16px">' + MW.t("admin_hard_lessons") + "</h3>" +
          barList(s.hardestLessons.map(function (h) { return { label: h.title, value: h.rate }; }), "brown") +
        "</div>" +
      "</div>" +
      '<div class="card" style="margin-top:18px"><h3 style="font-size:1rem;margin-bottom:8px">' + MW.t("admin_faq_topics") + "</h3>" +
        s.faqTopics.map(function (f) {
          return '<div class="list-row">' + MW.icon("info") + "<span class='grow'>" + MW.pick(f.title) + '</span><span class="chip chip-teal num">' + f.count + " " + MW.t("admin_questions_count") + "</span></div>";
        }).join("") +
      "</div>";
  }

  function drawStudents(el) {
    if (MW.auth.isLive()) { drawRealStudents(el); return; }
    var user = MW.store.session();
    var rows = [{ name: user.name + " (" + MW.t("league_you_row") + ")", track: "limits", progress: MW.store.trackProgressPct(MW.findTrack("limits")), points: MW.store.getProgress().points, me: true }]
      .concat(MW.demo.students.map(function (s) {
        return { name: MW.pick(s.name), track: s.track, progress: s.progress, points: s.points };
      }));
    el.innerHTML =
      '<div class="chip chip-gold" style="margin-bottom:14px">' + MW.icon("info") + MW.t("preview_data_chip") + "</div>" +
      '<div class="card" style="padding:0">' +
        '<div class="table-scroll"><table class="tbl"><thead><tr>' +
          "<th>" + MW.t("students_table_name") + "</th><th>" + MW.t("students_table_track") + "</th><th>" + MW.t("students_table_progress") + "</th><th>" + MW.t("students_table_points") + "</th><th>" + MW.t("students_table_action") + "</th>" +
        "</tr></thead><tbody>" +
        rows.map(function (r, i) {
          var tr = MW.findTrack(r.track);
          return "<tr" + (r.me ? ' class="hl"' : "") + ">" +
            "<td><div class='row' style='gap:9px'>" + MW.avatar(r.name, 32) + "<strong style='font-weight:600;font-size:.9rem'>" + MW.esc(r.name) + "</strong></div></td>" +
            "<td>" + MW.esc(MW.pick(tr.title)) + "</td>" +
            '<td style="min-width:130px"><div class="bar-track"><span class="bar-fill" style="display:block;width:' + r.progress + '%"></span></div></td>' +
            '<td><strong class="num">' + r.points + "</strong></td>" +
            "<td><button class='btn btn-ghost btn-sm' data-edit-student='" + i + "' data-pts='" + r.points + "'>" + MW.icon("edit") + MW.t("adjust_points") + "</button></td>" +
          "</tr>";
        }).join("") +
        "</tbody></table></div></div>";

    el.querySelectorAll("[data-edit-student]").forEach(function (b) {
      b.addEventListener("click", function () {
        var wrap = document.createElement("div");
        wrap.innerHTML =
          '<div class="field"><label class="field-label">' + MW.t("students_table_points") + '</label><input type="number" class="input num" id="pts-input" value="' + b.getAttribute("data-pts") + '" dir="ltr"></div>' +
          '<button class="btn btn-primary btn-block" id="pts-save">' + MW.t("save") + "</button>";
        var m = MW.modal({ title: MW.t("adjust_points"), body: wrap });
        wrap.querySelector("#pts-save").addEventListener("click", function () {
          m.close();
          MW.toast(MW.t("points_updated"), "success");
        });
      });
    });
  }

  function drawRealStudents(el) {
    el.innerHTML = '<p class="muted" style="margin-bottom:14px">' + MW.t("loading") + "</p>";
    MW.auth.listStudents().then(function (list) {
      if (!list.length) {
        el.innerHTML = '<div class="empty-state"><div class="empty-title">—</div><div class="empty-sub">' + MW.t("preview_data_chip") + "</div></div>";
        return;
      }
      el.innerHTML =
        '<div class="card" style="padding:0"><div class="table-scroll"><table class="tbl"><thead><tr>' +
          "<th>" + MW.t("students_table_name") + "</th><th>" + MW.t("students_table_points") + "</th><th>" + MW.t("obj_difficulty") + "</th>" +
        "</tr></thead><tbody>" +
        list.map(function (r) {
          return "<tr" + (r.id === (MW.auth.user() || {}).id ? ' class="hl"' : "") + ">" +
            '<td><div class="row" style="gap:9px">' + MW.avatar(r.name || "?", 32) + "<strong style='font-weight:600;font-size:.9rem'>" + MW.esc(r.name || "—") + "</strong>" +
            (r.role === "admin" ? '<span class="chip chip-gold" style="font-size:.68rem">admin</span>' : "") + "</div></td>" +
            '<td><strong class="num">' + (r.points || 0) + "</strong></td>" +
            "<td><span class='faint' style='font-size:.8rem'>" + MW.esc(r.role || "student") + "</span></td>" +
          "</tr>";
        }).join("") +
        "</tbody></table></div></div>";
    });
  }

  function drawContent(el) {
    el.innerHTML =
      '<p class="muted" style="font-size:.9rem;margin-bottom:14px;line-height:1.8">' + MW.t("content_tree_hint") + "</p>" +
      MW.content.tracks.map(function (track) {
        return '<div class="card" style="margin-bottom:14px;padding:0;overflow:hidden">' +
          '<details open><summary style="cursor:pointer;display:flex;align-items:center;gap:12px;padding:16px 20px;background:var(--c-surface-2);list-style:none">' +
            '<span class="path-icon" style="width:40px;height:40px;border-radius:11px;margin:0;background:' + hexA(track.hue, .12) + ";color:" + track.hue + '">' + MW.icon(track.icon).replace("<svg ", '<svg style="width:21px;height:21px" ') + "</span>" +
            "<strong class='grow'>" + MW.pick(track.title) + "</strong>" +
            '<span class="chip chip-sand num">' + MW.store.trackProgressPct(track) + "%</span>" +
          "</summary>" +
          '<div style="padding:6px 20px 18px">' +
            track.units.map(function (unit, ui) {
              return '<div style="margin-top:14px"><div class="row-between" style="margin-bottom:6px"><strong style="font-size:.88rem;color:var(--c-brown-deep)">' + (ui + 1) + ". " + MW.pick(unit.title) + '</strong><button class="btn btn-ghost btn-sm" data-unit-quiz="' + unit.id + '">' + MW.icon("clipboard") + unit.quiz.questions.length + "</button></div>" +
                unit.lessons.map(function (l) {
                  return '<div class="list-row">' +
                    "<span class='grow'><strong style='font-weight:600;font-size:.88rem'>" + MW.pick(l.title) + "</strong>" +
                    '<div class="faint" style="font-size:.76rem">' + l.minutes + " " + MW.t("hours_min") + " · <code dir='ltr' style='font-size:.72rem'>" + l.id + "</code></div></span>" +
                    '<span class="chip ' + (l.videoUrl ? "chip-teal" : "chip-danger") + '">' + MW.icon("film") + (l.videoUrl ? MW.t("lesson_status_ready") : MW.t("lesson_status_coming")) + "</span>" +
                    '<button class="icon-btn" data-video=\'' + JSON.stringify({ t: track.id, l: l.id }).replace(/'/g, "&#39;") + "' title=\"" + MW.t("add_lesson_video") + '">' + MW.icon("edit") + "</button>" +
                  "</div>";
                }).join("") +
              "</div>";
            }).join("") +
          "</div></details></div>";
      }).join("");

    el.querySelectorAll("[data-video]").forEach(function (b) {
      b.addEventListener("click", function () {
        var ref = JSON.parse(b.getAttribute("data-video"));
        var found = MW.findLesson(ref.t, ref.l);
        if (!found.lesson) return;
        var wrap = document.createElement("div");
        wrap.innerHTML =
          '<div class="field"><label class="field-label">' + MW.t("video_url") + '</label><input class="input" dir="ltr" id="vid-url" placeholder="https://www.youtube.com/watch?v=..." value="' + MW.esc(found.lesson.videoUrl || "") + '"></div>' +
          '<button class="btn btn-primary btn-block" id="vid-save">' + MW.t("save") + "</button>";
        var m = MW.modal({ title: MW.t("add_lesson_video") + " — " + MW.pick(found.lesson.title), body: wrap });
        wrap.querySelector("#vid-save").addEventListener("click", function () {
          var url = wrap.querySelector("#vid-url").value.trim();
          found.lesson.videoUrl = url && /^https?:\/\//.test(url) ? url : null;
          m.close();
          MW.toast(MW.t("video_saved"), "success");
          MW.router.render();
        });
      });
    });

    el.querySelectorAll("[data-unit-quiz]").forEach(function (b) {
      b.addEventListener("click", function () { location.hash = "#/admin/quizzes"; });
    });
  }

  function hexA(hex, a) {
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }

  function drawQuizzes(el) {
    el.innerHTML =
      '<p class="muted" style="font-size:.9rem;margin-bottom:14px;line-height:1.8">' + MW.t("quizzes_hint") + "</p>" +
      '<button class="btn btn-primary btn-sm" data-add-q style="margin-bottom:14px">' + MW.icon("plus") + MW.t("add_question") + "</button>" +
      MW.content.tracks.map(function (track) {
        return track.units.map(function (unit) {
          return '<div class="card" style="margin-bottom:12px;padding:0;overflow:hidden">' +
            '<div class="example-head"><strong class="grow">' + MW.pick(track.title) + " — " + MW.pick(unit.title) + '</strong><span class="chip chip-gold num">' + unit.quiz.questions.length + " × " + MW.t("points") + ":10</span></div>" +
            unit.quiz.questions.map(function (q, qi) {
              return '<div class="list-row" style="padding-inline-start:20px;padding-inline-end:20px">' +
                "<span class='grow' style='font-size:.86rem'>" + MW.pick(q.q) + "</span>" +
                '<span class="chip chip-teal">' + String.fromCharCode(65 + q.ans) + "</span>" +
                '<span class="faint num">10</span>' +
              "</div>";
            }).join("") +
          "</div>";
        }).join("");
      }).join("");

    el.querySelector("[data-add-q]").addEventListener("click", function () {
      var opts = [0, 1, 2, 3].map(function (i) {
        return '<div class="field"><label class="field-label">' + String.fromCharCode(65 + i) + '</label><input class="input" data-opt="' + i + '"></div>';
      }).join("");
      var wrap = document.createElement("div");
      wrap.innerHTML =
        '<div class="field"><label class="field-label">' + MW.t("question_text") + '</label><textarea class="input" id="q-text"></textarea></div>' +
        '<div class="grid" style="grid-template-columns:1fr 1fr;gap:10px">' + opts + "</div>" +
        '<div class="field" style="margin-top:10px"><label class="field-label">' + MW.t("students_table_action") + " (A–D)</label><select class='input' id='q-correct'><option>A</option><option>B</option><option>C</option><option>D</option></select></div>" +
        '<button class="btn btn-primary btn-block" id="q-save">' + MW.t("save") + "</button>";
      var m = MW.modal({ title: MW.t("add_question"), body: wrap });
      wrap.querySelector("#q-save").addEventListener("click", function () {
        var text = wrap.querySelector("#q-text").value.trim();
        if (!text) return;
        var optVals = [0, 1, 2, 3].map(function (i) { return wrap.querySelector('[data-opt="' + i + '"]').value.trim() || "—"; });
        var correct = "ABCD".indexOf(wrap.querySelector("#q-correct").value);
        var firstUnit = MW.content.tracks[0].units[0];
        firstUnit.quiz.questions.push({ q: text, opts: optVals, ans: correct });
        m.close();
        MW.toast(MW.t("save"), "success");
        MW.router.render();
      });
    });
  }

  function drawChallenges(el) {
    var idx = Math.floor(Date.now() / 86400000) % MW.demo.dailyChallenges.length;
    var ch = MW.demo.dailyChallenges[idx];
    var wc = MW.demo.weeklyContest;
    el.innerHTML =
      '<p class="muted" style="font-size:.9rem;margin-bottom:14px;line-height:1.8">' + MW.t("challenges_hint") + "</p>" +
      '<div class="grid grid-2">' +
        '<div class="card">' +
          '<div class="challenge-head"><span class="stat-icon" style="background:var(--c-gold-soft);color:#8a6524;width:42px;height:42px;border-radius:12px;display:grid;place-items:center">' + MW.icon("target") + '</span><strong>' + MW.t("daily_challenge_def") + '</strong><span class="chip chip-teal" style="margin-inline-start:auto">+20</span></div>' +
          '<div class="math" style="font-size:1.05rem;margin-bottom:10px">' + MW.pick(ch.q) + "</div>" +
          '<div class="row-between" style="gap:10px"><span class="chip chip-sand">' + MW.t("challenge_your_answer") + ": <bdir='ltr' class='num'>" + MW.esc(ch.answer) + "</b></span>" +
          '<button class="btn btn-ghost btn-sm" data-edit-ch>' + MW.icon("edit") + MW.t("edit") + "</button></div>" +
        "</div>" +
        '<div class="card">' +
          '<div class="challenge-head"><span class="stat-icon" style="background:var(--c-teal-soft);color:var(--c-teal-deep);width:42px;height:42px;border-radius:12px;display:grid;place-items:center">' + MW.icon("trophy") + '</span><strong>' + MW.t("weekly_contest_def") + "</strong></div>" +
          "<strong style='font-size:.95rem'>" + MW.pick(wc.title) + "</strong>" +
          '<p class="muted" style="font-size:.85rem;margin-top:6px;line-height:1.8">' + MW.pick(wc.desc) + "</p>" +
          '<div class="row-between" style="margin-top:10px"><span class="chip chip-gold">' + MW.pick(wc.reward) + '</span><span class="chip">' + MW.pick(wc.endsIn) + "</span></div>" +
        "</div>" +
      "</div>";

    el.querySelector("[data-edit-ch]").addEventListener("click", function () {
      var wrap = document.createElement("div");
      wrap.innerHTML =
        '<div class="field"><label class="field-label">' + MW.t("question_text") + '</label><textarea class="input" id="ch-q">' + MW.esc(MW.pick(ch.q)) + "</textarea></div>" +
        '<div class="field"><label class="field-label">' + MW.t("challenge_your_answer") + '</label><input class="input" id="ch-a" dir="ltr" value="' + MW.esc(ch.answer) + '"></div>' +
        '<button class="btn btn-primary btn-block" id="ch-save">' + MW.t("save") + "</button>";
      var m = MW.modal({ title: MW.t("edit"), body: wrap });
      wrap.querySelector("#ch-save").addEventListener("click", function () {
        ch.q = wrap.querySelector("#ch-q").value.trim();
        ch.answer = wrap.querySelector("#ch-a").value.trim();
        m.close();
        MW.toast(MW.t("save"), "success");
        MW.router.render();
      });
    });
  }

  function drawRewards(el) {
    var p = MW.store.getProgress();
    var rows = MW.demo.students.map(function (s) { return { name: MW.pick(s.name), pts: s.weekPoints }; });
    rows.push({ name: MW.store.session().name + " (" + MW.t("league_you_row") + ")", pts: p.weekXp });
    rows.sort(function (a, b) { return b.pts - a.pts; });
    el.innerHTML =
      '<p class="muted" style="font-size:.9rem;margin-bottom:14px;line-height:1.8">' + MW.t("rewards_hint") + "</p>" +
      '<div class="card" style="margin-bottom:16px;padding:0"><div class="table-scroll"><table class="tbl"><thead><tr>' +
        "<th>#</th><th>" + MW.t("student") + "</th><th>" + MW.t("week_points") + "</th><th>±</th></tr></thead><tbody>" +
        rows.map(function (r, i) {
          return "<tr><td><strong class='num'>" + (i + 1) + "</strong></td><td>" + MW.esc(r.name) + "</td><td><strong class='num'>" + r.pts + "</strong></td>" +
          '<td><button class="btn btn-ghost btn-sm" data-minus>-</button> <button class="btn btn-ghost btn-sm" data-plus>+</button></td></tr>';
        }).join("") +
      "</tbody></table></div></div>" +
      "<h3 style='font-size:1rem;margin-bottom:12px'>" + MW.t("my_badges") + " — " + MW.t("admin_rewards") + "</h3>" +
      '<div class="badges-grid">' +
        MW.demo.badges.map(function (b) {
          var holders = MW.demo.students.filter(function (s) { return s.badges.indexOf(b.id) !== -1; }).length;
          return '<div class="badge-tile">' + MW.badgeSVG(b, 52) +
            '<div class="badge-tile-name">' + MW.t("badge_" + b.id) + '</div><div class="badge-tile-desc num">× ' + holders + "</div></div>";
        }).join("") +
      "</div>";

    el.querySelectorAll("[data-plus]").forEach(function (b, i) {
      b.addEventListener("click", function () { rows[i].pts += 5; MW.toast(MW.t("points_updated") + " (+5)", "success"); });
    });
    el.querySelectorAll("[data-minus]").forEach(function (b, i) {
      b.addEventListener("click", function () { rows[i].pts -= 5; MW.toast(MW.t("points_updated") + " (−5)"); });
    });
  }

  function drawInsights(el) {
    var s = MW.demo.adminStats;
    el.innerHTML =
      '<p class="muted" style="font-size:.9rem;margin-bottom:14px;line-height:1.8">' + MW.t("admin_ai_hint") + "</p>" +
      '<button class="btn btn-primary" id="gen-summary" style="margin-bottom:18px">' + MW.icon("bot") + MW.t("generate_summary") + "</button>" +
      '<div id="summary-zone"></div>' +
      '<div class="stack" style="gap:12px">' +
        insightCard("brown", "alert", MW.t("insight_weak_topic"),
          MW.pick({ ar: "«قاعدة السلسلة» تسجّل نسبة تعثر 46% — يُقترح درس تدريبي إضافي مع ٥ أمثلة متدرجة الصعوبة.", en: "\u201CChain Rule\u201D shows a 46% struggle rate — an extra practice lesson with five graded examples is suggested." })) +
        insightCard("", "target", MW.t("insight_suggest_challenge"),
          MW.pick({ ar: "تحدي مقترح: «نهايات عند اللانهاية في 60 ثانية» — ٦ مسائل قصيرة، مكافأة مزدوجة لنهاية الأسبوع.", en: "Suggested challenge: \u201CLimits at infinity in 60 seconds\u201D — six quick items, double reward at week's end." })) +
        insightCard("gold", "book", MW.t("insight_content_search"),
          MW.pick({ ar: "يفتقد المحتوى إلى أمثلة تطبيقية هندسية في «لابلاس»: دوائر RC ومخمدات السيارات هي الأكثر طلبًا في أسئلة الطلاب.", en: "Engineering-applied examples are missing in \u201CLaplace\u201D: RC circuits and car dampers are the most requested by students." })) +
      "</div>" +
      '<div class="card" style="margin-top:16px">' +
        "<h3 style='font-size:.98rem;margin-bottom:10px'>" + MW.t("search") + " — " + MW.t("admin_content") + "</h3>" +
        '<div class="input-wrap">' + MW.icon("search", "lead-icon") + '<input class="input" id="ai-content-search" placeholder="' + MW.t("searchPlaceholder") + '"></div>' +
        '<div id="ai-search-results" style="margin-top:8px"></div>' +
      "</div>";

    el.querySelector("#gen-summary").addEventListener("click", function () {
      var zone = el.querySelector("#summary-zone");
      zone.innerHTML = '<div class="msg-bubble bot" style="border-radius:16px;margin-bottom:16px"><span class="typing-dots"><span></span><span></span><span></span></span></div>';
      setTimeout(function () {
        var lang = document.documentElement.lang;
        zone.innerHTML =
          '<div class="card" style="border-inline-start:4px solid var(--c-teal);margin-bottom:16px">' +
            "<strong style='display:block;margin-bottom:8px'>" + MW.t("ai_admin_summary_title") + "</strong>" +
            "<ul style='list-style:disc;padding-inline-start:20px;font-size:.89rem;line-height:2'>" +
              (lang === "ar"
                ? "<li>الطلاب النشطون هذا الأسبوع ارتفعوا إلى <b>342</b> طالبًا بنموّ 4.2%.</li><li>مسار <b>لابلاس</b> هو الأقل إكمالًا (29%) — يحتاج حملة تحفيز وتحديات قصيرة.</li><li>أعلى نقاط أسبوعية لطالبة <b>سارة العتيبي (340)</b>.</li><li>موضوع <b>قاعدة السلسلة</b> يتصدّر أسئلة المساعد؛ جهّزوا فيديو إضافيًا له.</li>"
                : "<li>Active students rose to <b>342</b> this week (+4.2%).</li><li>The <b>Laplace</b> path has the lowest completion (29%) — needs a motivation push and micro-challenges.</li><li>Highest weekly points: <b>Sara Alotaibi (340)</b>.</li><li><b>Chain Rule</b> tops assistant questions; prepare one extra video for it.</li>") +
            "</ul></div>";
      }, 1100);
    });

    var inp = el.querySelector("#ai-content-search");
    inp.addEventListener("input", function () {
      var q = inp.value.trim().toLowerCase();
      var box = el.querySelector("#ai-search-results");
      if (!q) { box.innerHTML = ""; return; }
      var out = [];
      MW.content.tracks.forEach(function (tr) {
        tr.units.forEach(function (u) {
          u.lessons.forEach(function (l) {
            if ((MW.pick(l.title) + MW.pick(tr.title)).toLowerCase().indexOf(q) !== -1) {
              out.push('<div class="list-row">' + MW.icon("book") + "<span class='grow'>" + MW.pick(l.title) + '</span><span class="chip chip-sand">' + MW.pick(tr.title) + "</span></div>");
            }
          });
        });
      });
      box.innerHTML = out.join("") || '<p class="faint" style="font-size:.84rem;padding:8px 0">' + MW.t("searchEmptyTitle") + "</p>";
    });
  }

  function insightCard(tone, iconName, title, text) {
    return '<div class="insight-card">' +
      '<span class="insight-icon ' + tone + '">' + MW.icon(iconName) + "</span>" +
      "<div><strong style='font-size:.9rem;display:block;margin-bottom:3px'>" + title + "</strong>" +
      "<div class='insight-text muted'>" + text + "</div></div></div>";
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.admin = { render: render };
})();
