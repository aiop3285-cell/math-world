(function () {
  "use strict";

  var activeCat = "all";
  var query = "";

  function render(root) {
    root.innerHTML =
      '<div class="page-head">' +
        '<h1 class="page-title">' + MW.t("formulas_title") + "</h1>" +
        '<p class="page-sub">' + MW.t("formulas_sub") + "</p>" +
        '<div class="input-wrap" style="margin-top:14px;max-width:480px">' + MW.icon("search", "lead-icon") +
          '<input class="input" id="fx-search" placeholder="' + MW.t("formulas_search_ph") + '">' +
        "</div>" +
        '<div class="tabs" style="margin-top:14px" id="fx-tabs"></div>' +
      "</div>" +
      '<div class="grid grid-2" id="fx-list"></div>';

    drawTabs(root);
    drawList(root);
    root.querySelector("#fx-search").addEventListener("input", function (e) {
      query = e.target.value.trim().toLowerCase();
      drawList(root);
    });
  }

  function drawTabs(root) {
    var tabs = [{ id: "all", title: { ar: MW.t("bank_all"), en: MW.t("bank_all") } }]
      .concat(MW.formulaCategories);
    var box = root.querySelector("#fx-tabs");
    box.innerHTML = tabs.map(function (c) {
      return '<button class="tab' + (activeCat === c.id ? " active" : "") + '" data-cat="' + c.id + '">' + MW.esc(MW.pick(c.title)) + "</button>";
    }).join("");
    box.querySelectorAll("[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () {
        activeCat = b.getAttribute("data-cat");
        drawTabs(root);
        drawList(root);
      });
    });
  }

  function drawList(root) {
    var list = MW.formulas.filter(function (f) {
      if (activeCat !== "all" && f.cat !== activeCat) return false;
      if (!query) return true;
      return (MW.pick(f.title) + " " + (f.note ? MW.pick(f.note) : "") + " " + f.tex).toLowerCase().indexOf(query) !== -1;
    });
    var box = root.querySelector("#fx-list");
    if (!list.length) {
      box.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-title">' + MW.t("searchEmptyTitle") + "</div></div>";
      return;
    }
    box.innerHTML = list.map(function (f, i) {
      return '<div class="card formula-card" style="padding:18px 20px">' +
        '<div class="row-between" style="margin-bottom:8px">' +
          "<strong style='font-size:.92rem'>" + MW.esc(MW.pick(f.title)) + "</strong>" +
          '<button class="icon-btn" style="width:32px;height:32px" data-copy="' + i + '" title="' + MW.t("copy_tex") + '">' + MW.icon("edit") + "</button>" +
        "</div>" +
        '<div class="math" style="overflow-x:auto;padding:6px 0">' + MW.tex(f.tex, true) + "</div>" +
        (f.note ? '<div class="faint" style="font-size:.8rem;margin-top:6px">' + MW.pick(f.note) + "</div>" : "") +
      "</div>";
    }).join("");
    box.querySelectorAll("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = list[parseInt(b.getAttribute("data-copy"), 10)];
        if (navigator.clipboard) navigator.clipboard.writeText(f.tex);
        MW.toast(MW.t("copied"), "success");
      });
    });
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.formulas = { render: render };
})();
