(function () {
  "use strict";

  function render(root) {
    var user = MW.store.session();
    var p = MW.store.getProgress();

    if (MW.auth.isLive()) {
      root.innerHTML = '<div class="page-head" style="text-align:center"><h1 class="page-title">' + MW.t("nav_league") + '</h1><p class="page-sub">' + MW.t("loading") + "</p></div>";
      MW.auth.topStudents(10).then(function (top) {
        drawRealBoard(root, top);
      });
      return;
    }

    var rows = MW.demo.students.map(function (s) { return { name: MW.pick(s.name), pts: s.weekPoints, delta: s.delta, me: false }; });
    rows.push({ name: user.name, pts: p.weekXp, delta: 0, me: true });
    rows.sort(function (a, b) { return b.pts - a.pts; });
    drawBoard(root, rows, true);
  }

  function drawRealBoard(root, top) {
    var user = MW.store.session();
    var p = MW.store.getProgress();
    var rows = top.map(function (r) { return { name: r.name || "—", pts: r.points || 0, delta: 0, me: r.id === user.id }; });
    if (!rows.some(function (r) { return r.me; })) {
      rows.push({ name: user.name, pts: p.points, delta: 0, me: true });
      rows.sort(function (a, b) { return b.pts - a.pts; });
    }
    drawBoard(root, rows, false);
  }

  function drawBoard(root, rows, isSample) {
    var user = MW.store.session();
    var p = MW.store.getProgress();
    var myRank = rows.findIndex(function (r) { return r.me; }) + 1;
    var podium = rows.slice(0, 3);
    var tableRows = rows.map(function (r, i) {
      var deltaChip = r.delta > 0
        ? '<span class="chip chip-up delta-chip">' + MW.icon("arrowup") + "+" + r.delta + "</span>"
        : r.delta < 0
          ? '<span class="chip chip-down delta-chip">' + MW.icon("arrowdown") + r.delta + "</span>"
          : '<span class="faint" style="font-size:.8rem">—</span>';
      return '<tr class="' + (r.me ? "hl" : "rank-" + (i + 1)) + '">' +
        '<td><span class="rank-cell"><span class="rank-medal num">' + (i + 1) + "</span>" + MW.avatar(r.name, 34, i < 3 ? "gold" : "") + "<span>" + MW.esc(r.name) + (r.me ? ' <span class="chip chip-teal" style="font-size:.7rem">' + MW.t("league_you_row") + "</span>" : "") + "</span></span></td>" +
        '<td><strong class="num">' + r.pts + "</strong></td>" +
        "<td>" + deltaChip + "</td>" +
      "</tr>";
    }).join("");

    root.innerHTML =
      '<div class="page-head" style="text-align:center">' +
        '<h1 class="page-title">' + MW.t("nav_league") + "</h1>" +
        '<p class="page-sub">' + MW.t("weekly_league_sub") + "</p>" +
        (isSample
          ? '<span class="chip chip-sand" style="margin-top:8px">' + MW.icon("info") + MW.t("preview_data_chip") + "</span>"
          : "") +
      "</div>" +

      '<h2 style="text-align:center;font-size:.95rem;margin-bottom:14px;color:var(--c-muted);font-weight:600">' + MW.t("podium_title") + "</h2>" +
      '<div class="league-podium" style="max-width:560px;margin-inline:auto">' +
        podium.map(function (r, i) {
          return '<div class="podium-card rank-' + (i + 1) + '">' +
            MW.badgeSVG(MW.demo.badges[i === 0 ? 6 : 1], 46, false).replace('class="badge-art', 'class="badge-art') +
            '<div class="podium-name">' + MW.esc(r.name) + "</div>" +
            '<div class="podium-pts num">' + r.pts + " " + MW.t("points_label") + "</div>" +
            '<div class="chip ' + (i === 0 ? "chip-gold" : "") + '" style="margin-top:6px">#' + (i + 1) + "</div>" +
          "</div>";
        }).join("") +
      "</div>" +

      '<div class="card" style="max-width:640px;margin-inline:auto;padding:18px;display:flex;align-items:center;gap:16px;margin-bottom:20px">' +
        MW.avatar(user.name, 46) +
        "<div class='grow'><strong>" + MW.t("league_you_row") + " — #" + myRank + '</strong><div class="muted" style="font-size:.83rem">' + p.weekXp + " " + MW.t("week_points") + "</div></div>" +
        '<span class="chip chip-gold">' + MW.icon("flame") + MW.t("stat_streak") + ": " + p.streak + "</span>" +
      "</div>" +

      '<div class="table-scroll league-table-wrap" style="max-width:720px;margin-inline:auto">' +
        "<table class='tbl'><thead><tr><th>" + MW.t("position") + "</th><th>" + MW.t("student") + "</th><th>" + MW.t("week_points") + "</th><th>Δ</th></tr></thead>" +
        "<tbody>" + tableRows + "</tbody></table>" +
      "</div>";
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.league = { render: render };
})();
