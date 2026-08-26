(function () {
  "use strict";

  var filters = { track: "all", lvl: "all", q: "" };

  function buildIndex() {
    var items = [];
    MW.content.tracks.forEach(function (track) {
      (track.units || []).forEach(function (unit) {
        (unit.lessons || []).forEach(function (lesson) {
          (lesson.exercises || []).forEach(function (ex, i) {
            items.push({
              track: track, unit: unit, lesson: lesson,
              q: MW.pick(ex.q), opts: ex.opts, ans: ex.ans,
              lvl: ex.lvl || 2, key: track.id + "/" + lesson.id + "#" + i
            });
          });
        });
        (unit.quiz.questions || []).forEach(function (qz, i) {
          items.push({
            track: track, unit: unit, lesson: null,
            q: MW.pick(qz.q), opts: qz.opts, ans: qz.ans,
            lvl: 2, key: track.id + "/" + unit.id + "-q#" + i, fromQuiz: true
          });
        });
      });
    });
    return items;
  }

  function render(root) {
    var index = buildIndex();
    var tracks = MW.content.tracks;

    root.innerHTML =
      '<div class="page-head">' +
        '<h1 class="page-title">' + MW.t("bank_title") + "</h1>" +
        '<p class="page-sub">' + MW.t("bank_sub") + "</p>" +
        '<div class="row" style="gap:10px;margin-top:14px;flex-wrap:wrap">' +
          '<select class="input" id="bk-track" style="max-width:220px">' +
            '<option value="all">' + MW.t("bank_filter_track") + ": " + MW.t("bank_all") + "</option>" +
            tracks.map(function (t) { return '<option value="' + t.id + '">' + MW.esc(MW.pick(t.title)) + "</option>"; }).join("") +
          "</select>" +
          '<select class="input" id="bk-lvl" style="max-width:180px">' +
            '<option value="all">' + MW.t("bank_filter_level") + ": " + MW.t("bank_all") + "</option>" +
            '<option value="1">' + MW.t("lvl_easy") + "</option>" +
            '<option value="2">' + MW.t("lvl_medium") + "</option>" +
            '<option value="3">' + MW.t("lvl_hard") + "</option>" +
          "</select>" +
          '<div class="input-wrap grow" style="min-width:200px;max-width:320px">' + MW.icon("search", "lead-icon") +
            '<input class="input" id="bk-q" placeholder="' + MW.t("searchPlaceholder") + '"></div>' +
        "</div>" +
        '<p class="faint num" id="bk-count" style="font-size:.8rem;margin-top:10px"></p>' +
      "</div>" +
      '<div class="stack" id="bk-list" style="gap:14px;max-width:760px"></div>';

    var trackSel = root.querySelector("#bk-track");
    var lvlSel = root.querySelector("#bk-lvl");
    var qInp = root.querySelector("#bk-q");

    function run() {
      filters.track = trackSel.value;
      filters.lvl = lvlSel.value;
      filters.q = qInp.value.trim().toLowerCase();
      draw(root, index);
    }
    trackSel.addEventListener("change", run);
    lvlSel.addEventListener("change", run);
    qInp.addEventListener("input", run);
    draw(root, index);
  }

  function draw(root, index) {
    var list = index.filter(function (it) {
      if (filters.track !== "all" && it.track.id !== filters.track) return false;
      if (filters.lvl !== "all" && String(it.lvl) !== filters.lvl) return false;
      if (filters.q && it.q.toLowerCase().indexOf(filters.q) === -1) return false;
      return true;
    });
    root.querySelector("#bk-count").textContent = list.length + " " + MW.t("bank_count");
    var box = root.querySelector("#bk-list");
    if (!list.length) {
      box.innerHTML = '<div class="empty-state"><div class="empty-title">' + MW.t("searchEmptyTitle") + "</div></div>";
      return;
    }
    var meta = { 1: { label: MW.t("lvl_easy"), cls: "chip-teal" }, 2: { label: MW.t("lvl_medium"), cls: "chip-gold" }, 3: { label: MW.t("lvl_hard"), cls: "chip-danger" } };
    box.innerHTML = list.slice(0, 40).map(function (it, i) {
      var m = meta[it.lvl] || meta[2];
      return '<div class="exercise-item" data-bank="' + i + '" data-ans="' + it.ans + '">' +
        '<div class="exercise-q"><span class="chip ' + m.cls + '" style="font-size:.7rem;margin-inline-end:8px;vertical-align:2px">' + m.label + "</span>" + MW.esc(it.q) + "</div>" +
        '<div class="faint" style="font-size:.74rem;margin-bottom:10px">' + MW.esc(MW.pick(it.track.title)) + " · " + MW.esc(MW.pick(it.unit.title)) + (it.lesson ? " · " + MW.esc(MW.pick(it.lesson.title)) : "") + "</div>" +
        '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr));gap:8px">' +
          it.opts.map(function (opt, oi) {
            return '<button class="opt-btn" data-opt="' + oi + '"><span class="opt-key">' + String.fromCharCode(65 + oi) + '</span><span class="opt-label">' + MW.esc(opt) + "</span></button>";
          }).join("") +
        "</div>" +
        '<div class="field-error" style="margin-top:8px" data-feedback></div>' +
      "</div>";
    }).join("");

    box.querySelectorAll("[data-bank]").forEach(function (card) {
      var it = list[parseInt(card.getAttribute("data-bank"), 10)];
      var correct = it.ans;
      card.querySelectorAll("[data-opt]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var chosen = parseInt(btn.getAttribute("data-opt"), 10);
          card.querySelectorAll("[data-opt]").forEach(function (o) {
            o.disabled = true;
            if (parseInt(o.getAttribute("data-opt"), 10) === correct) o.classList.add("correct");
          });
          var fb = card.querySelector("[data-feedback]");
          if (chosen !== correct) btn.classList.add("wrong");
          fb.innerHTML = MW.icon(chosen === correct ? "check" : "alert") +
            (chosen === correct ? MW.t("correct_answer_msg") : MW.t("challenge_wrong") + ' <b class="num" dir="ltr">' + MW.esc(it.opts[correct]) + "</b>");
          fb.style.color = chosen === correct ? "var(--c-success)" : "var(--c-danger)";
          if (chosen !== correct) {
            var link = document.createElement("a");
            link.className = "link-btn";
            link.style.fontSize = ".8rem";
            link.href = it.lesson ? "#/lesson/" + it.track.id + "/" + it.lesson.id : "#/path/" + it.track.id;
            link.textContent = MW.t("review_now") + " →";
            fb.appendChild(document.createElement("br"));
            fb.appendChild(link);
          }
        });
      });
    });
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.bank = { render: render, buildIndex: buildIndex };
})();
