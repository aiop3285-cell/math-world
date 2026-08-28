(function () {
  "use strict";

  var app;

  function parseHash() {
    var h = location.hash.replace(/^#/, "") || "/home";
    var qIdx = h.indexOf("?");
    var query = {};
    if (qIdx !== -1) {
      h.slice(qIdx + 1).split("&").forEach(function (pair) {
        var kv = pair.split("=");
        if (kv[0]) query[kv[0]] = kv[1] || "";
      });
      h = h.slice(0, qIdx);
    }
    var parts = h.split("/").filter(Boolean);
    return { path: parts, query: query };
  }

  function route() {
    if (!app) app = document.getElementById("app");
    var r = parseHash();
    var seg = r.path;
    var page = seg[0] || "home";

    if (page === "auth") {
      if (MW.store.session()) { location.hash = "#/home"; return; }
      MW.views.auth.render(app);
      return;
    }

    if (!MW.store.session()) {
      location.hash = "#/auth";
      return;
    }

    if (page === "admin") {
      if (!MW.store.isAdmin()) { location.hash = "#/home"; return; }
      renderWithShell(function () { MW.views.admin.render(view(), seg[1]); }, "admin");
      return;
    }

    switch (page) {
      case "home":
        renderWithShell(function () { MW.views.home.render(view()); });
        break;
      case "paths":
        renderWithShell(function () { MW.views.paths.renderStages(view()); }, "paths");
        break;
      case "stage":
        if (!seg[1]) { location.hash = "#/paths"; return; }
        renderWithShell(function () { MW.views.paths.renderStage(view(), seg[1]); }, "paths");
        break;
      case "course":
        if (!seg[1]) { location.hash = "#/paths"; return; }
        renderWithShell(function () { MW.views.paths.renderCourse(view(), seg[1]); }, "paths");
        break;
      case "practice":
        if (!seg[1] || !seg[2]) { location.hash = "#/paths"; return; }
        renderWithShell(function () { MW.views.quiz.renderPractice(view(), seg[1], seg[2]); }, "paths");
        break;
      case "final":
        if (!seg[1]) { location.hash = "#/paths"; return; }
        renderWithShell(function () { MW.views.quiz.renderFinal(view(), seg[1]); }, "paths");
        break;
      case "certificate":
        if (!seg[1]) { location.hash = "#/paths"; return; }
        renderWithShell(function () { MW.views.certificate.render(view(), seg[1]); }, "paths");
        break;
      case "placement":
        renderWithShell(function () { MW.views.placement.render(view()); }, "paths");
        break;
      case "formulas":
        renderWithShell(function () { MW.views.formulas.render(view()); }, "formulas");
        break;
      case "bank":
        renderWithShell(function () { MW.views.bank.render(view()); }, "bank");
        break;
      case "path":
        if (!seg[1]) { location.hash = "#/paths"; return; }
        renderWithShell(function () { MW.views.paths.renderTrack(view(), seg[1]); }, "paths");
        break;
      case "lesson":
        if (!seg[1] || !seg[2]) { location.hash = "#/paths"; return; }
        renderWithShell(function () { MW.views.lesson.render(view(), seg[1], seg[2]); }, "paths");
        break;
      case "quiz":
        if (!seg[1] || !seg[2]) { location.hash = "#/paths"; return; }
        renderWithShell(function () { MW.views.quiz.render(view(), seg[1], seg[2]); }, "paths");
        break;
      case "challenge":
        renderWithShell(function () { MW.views.challenge.render(view()); }, "challenge");
        break;
      case "league":
        renderWithShell(function () { MW.views.league.render(view()); }, "league");
        break;
      case "assistant":
        renderWithShell(function () { MW.views.assistant.render(view(), r.query); }, "assistant");
        break;
      case "profile":
        renderWithShell(function () { MW.views.profile.render(view()); }, "profile");
        break;
      default:
        location.hash = "#/home";
    }
  }

  function view() {
    return document.getElementById("view");
  }

  function renderWithShell(drawView, activeKey) {
    var root = app;
    var needsShell = !root.querySelector(".topbar");
    if (needsShell) {
      MW.views.shell.render(root, MW.store.session(), MW.store.getProgress());
    } else {
      MW.store.renderPills();
      var langBtn = root.querySelector("[data-lang]");
      if (langBtn) langBtn.innerHTML = MW.icon("globe") + (document.documentElement.lang === "ar" ? "EN" : "\u0639");
    }
    drawView();
    MW.views.shell.refreshNav(root);
  }

  function boot() {
    app = document.getElementById("app");
    window.addEventListener("hashchange", function () {
      window.scrollTo({ top: 0 });
      route();
    });
    MW.auth.init().then(function () {
      return MW.store.hydrate();
    }).then(function () {
      route();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.MW = window.MW || {};
  MW.router = { render: route };
})();
