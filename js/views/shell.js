(function () {
  "use strict";

  function navItems() {
    return [
      { hash: "#/home", icon: "home", label: "nav_home" },
      { hash: "#/paths", icon: "map", label: "nav_paths" },
      { hash: "#/challenge", icon: "target", label: "nav_challenge" },
      { hash: "#/league", icon: "trophy", label: "nav_league" },
      { hash: "#/assistant", icon: "bot", label: "nav_assistant" },
      { hash: "#/profile", icon: "user", label: "nav_profile" }
    ];
  }

  function bottomItems() {
    return [
      { hash: "#/home", icon: "home", label: "nav_home" },
      { hash: "#/paths", icon: "map", label: "bnav_learn" },
      { hash: "#/challenge", icon: "target", label: "bnav_challenges" },
      { hash: "#/assistant", icon: "bot", label: "nav_assistant" },
      { hash: "#/profile", icon: "user", label: "bnav_account" }
    ];
  }

  function renderShell(root, user, progress) {
    root.innerHTML =
      '<header class="topbar"><div class="topbar-inner">' +
        '<a class="row" href="#/home" style="gap:10px;color:inherit">' +
          '<img class="brand-top-img" src="assets/logo.jpg" alt="" onerror="this.onerror=null;this.src=\'assets/logo.png\';this.addEventListener(\'error\',function(){this.classList.add(\'hidden\');document.getElementById(\'top-mark-fallback\').classList.add(\'show\')})">' +
          '<span class="brand-mark" id="top-mark-fallback"><svg viewBox="0 0 32 32" fill="none" stroke-width="2.6" stroke-linecap="round" stroke="#FAF7F2"><path d="M8 23 L16 9 L24 23"/><circle cx="16" cy="9" r="2.4" fill="#C89A4B" stroke="none"/></svg></span>' +
          '<span class="topbar-brand-name">' + MW.t("brand") + "</span>" +
        "</a>" +
        '<nav class="topnav" aria-label="main">' + topLinks("") + "</nav>" +
        '<div class="top-actions">' +
          '<button class="icon-btn" data-search aria-label="' + MW.t("search") + '">' + MW.icon("search") + "</button>" +
          '<button class="lang-btn" data-lang>' + MW.icon("globe") + (document.documentElement.lang === "ar" ? "EN" : "ع") + "</button>" +
          '<span class="points-pill" id="pill-points" title="' + MW.t("stat_points") + '">' + MW.icon("star") + '<span class="num">' + progress.points + "</span></span>" +
          '<span class="streak-pill" id="pill-streak" title="' + MW.t("stat_streak") + '">' + MW.icon("flame") + '<span class="num">' + progress.streak + "</span></span>" +
          '<button class="avatar brown" id="profile-chip" style="width:38px;height:38px;font-size:.85rem;cursor:pointer;border:none" title="' + MW.t("nav_profile") + '">' + MW.esc(initials(user.name)) + "</button>" +
        "</div>" +
      "</div></header>" +
      '<main class="page" id="view"></main>' +
      '<nav class="bottom-nav" aria-label="mobile">' + bottomLinks("") + "</nav>";

    bindCommon(root);
  }

  function initials(name) {
    return (name || "?").trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("");
  }

  function isActive(hash, current) {
    if (hash === "#/paths") return current.indexOf("#/path") === 0 || current === "#/paths";
    return current === hash || (hash === "#/home" && current === "");
  }

  function topLinks() {
    var cur = location.hash || "#/home";
    return navItems().map(function (n) {
      return '<a href="' + n.hash + '" class="topnav-link' + (isActive(n.hash, cur) ? " active" : "") + '" data-nav="' + n.hash + '">' + MW.t(n.label) + "</a>";
    }).join("");
  }

  function bottomLinks() {
    var cur = location.hash || "#/home";
    return bottomItems().map(function (n) {
      return '<a href="' + n.hash + '" class="bnav-item' + (isActive(n.hash, cur) ? " active" : "") + '"><span class="bnav-dot"></span>' + MW.icon(n.icon) + "<span>" + MW.t(n.label) + "</span></a>";
    }).join("");
  }

  function refreshNav(root) {
    var top = root.querySelector(".topnav");
    var bot = root.querySelector(".bottom-nav");
    if (top) top.innerHTML = topLinks();
    if (bot) bot.innerHTML = bottomLinks();
  }

  function bindCommon(root) {
    root.querySelector("[data-lang]").addEventListener("click", function () {
      MW.i18n.setLang(document.documentElement.lang === "ar" ? "en" : "ar");
      MW.router.render();
      MW.toast(MW.t("toast_lang_changed"));
    });
    root.querySelector("[data-search]").addEventListener("click", openSearch);
    var chip = root.querySelector("#profile-chip");
    if (chip) chip.addEventListener("click", function () { location.hash = "#/profile"; });
  }

  function openSearch() {
    var ov = document.createElement("div");
    ov.className = "search-overlay";
    ov.innerHTML =
      '<div class="search-panel">' +
        '<div class="search-input-bar">' + MW.icon("search") +
          '<input class="input" style="border:none;box-shadow:none;padding:0;min-height:auto" id="global-search" placeholder="' + MW.t("searchPlaceholder") + '" autocomplete="off">' +
          '<button class="icon-btn" data-close-search style="width:36px;height:36px">' + MW.icon("x") + "</button>" +
        "</div>" +
        '<div class="search-results" id="search-results"></div>' +
      "</div>";
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) {
      if (e.target === ov || e.target.closest("[data-close-search]")) ov.remove();
    });
    var input = ov.querySelector("#global-search");
    var results = ov.querySelector("#search-results");
    input.focus();

    function run(q) {
      q = q.trim().toLowerCase();
      results.innerHTML = "";
      if (!q) { results.innerHTML = '<p class="faint" style="text-align:center;padding:22px;font-size:.85rem">…</p>'; return; }
      var found = [];
      MW.content.tracks.forEach(function (track) {
        track.units.forEach(function (unit) {
          unit.lessons.forEach(function (lesson) {
            var title = MW.pick(lesson.title);
            var hay = (title + " " + MW.pick(track.title) + " " + MW.pick(unit.title)).toLowerCase();
            var inSummary = lesson.summary.some(function (s) { return MW.pick(s).toLowerCase().indexOf(q) !== -1; });
            if (hay.indexOf(q) !== -1 || inSummary) {
              found.push({ type: "lesson", track: track, unit: unit, lesson: lesson, text: title });
            }
            lesson.examples.forEach(function (ex, i) {
              if (MW.pick(ex.q).toLowerCase().indexOf(q) !== -1) {
                found.push({ type: "example", track: track, unit: unit, lesson: lesson, text: title + " — " + MW.pick(ex.q).slice(0, 60), ex: i });
              }
            });
          });
        });
      });
      (MW.formulas || []).forEach(function (f) {
        if ((MW.pick(f.title) + " " + f.tex).toLowerCase().indexOf(q) !== -1) {
          found.push({ type: "formula", text: MW.pick(f.title), tex: f.tex });
        }
      });
      if (MW.views.bank) {
        MW.views.bank.buildIndex().forEach(function (it) {
          if (it.q.toLowerCase().indexOf(q) !== -1) {
            found.push({ type: "question", text: it.q.slice(0, 70), track: it.track, unit: it.unit, lesson: it.lesson });
          }
        });
      }
      var typeLabels = { lesson: MW.t("nav_paths"), example: MW.t("lesson_examples"), formula: MW.t("formulas_title"), question: MW.t("bank_title") };
      if (!found.length) {
        results.innerHTML = '<div class="empty-state" style="border:none;background:none"><div class="empty-title">' + MW.t("searchEmptyTitle") + '</div><div class="empty-sub">' + MW.t("searchEmptySub") + "</div></div>";
        return;
      }
      found.slice(0, 14).forEach(function (f) {
        var b = document.createElement("button");
        b.className = "search-result";
        var pathText = f.type === "formula" ? MW.t("formulas_title")
          : f.type === "question" ? MW.t("bank_title")
          : MW.esc(MW.pick(f.track.title)) + " › " + MW.esc(MW.pick(f.unit.title));
        b.innerHTML =
          '<div class="sr-path">' + pathText + "</div>" +
          '<div class="sr-title">' + MW.esc(f.text) + "</div>" +
          (f.tex ? '<div class="math" style="font-size:.85rem">' + MW.tex(f.tex) + "</div>" : "") +
          '<span class="chip chip-sand" style="font-size:.65rem;margin-top:4px;display:inline-block">' + (typeLabels[f.type] || "") + "</span>";
        b.addEventListener("click", function () {
          ov.remove();
          if (f.type === "formula") location.hash = "#/formulas";
          else if (f.type === "question") location.hash = "#/bank";
          else location.hash = "#/lesson/" + f.track.id + "/" + f.lesson.id;
        });
        results.appendChild(b);
      });
    }
    input.addEventListener("input", function () { run(input.value); });
    run("");
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.shell = {
    render: renderShell,
    refreshNav: refreshNav,
    openSearch: openSearch,
    isActive: isActive
  };
})();
