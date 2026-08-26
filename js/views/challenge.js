(function () {
  "use strict";

  function todayChallenge() {
    var idx = Math.floor(Date.now() / 86400000) % MW.demo.dailyChallenges.length;
    return MW.demo.dailyChallenges[idx];
  }

  function render(root) {
    var ch = todayChallenge();
    var p = MW.store.getProgress();
    var solved = p.challengeDay === MW.store.todayKey();

    root.innerHTML =
      '<div class="page-head" style="text-align:center">' +
        '<h1 class="page-title">' + MW.t("nav_challenge") + "</h1>" +
        '<p class="page-sub">' + MW.t("challenge_page_sub") + "</p>" +
      "</div>" +

      '<div style="max-width:680px;margin-inline:auto">' +
        (solved ? solvedCard(ch, p) : challengeCard(ch)) +
        weeklyContestCard() +
      "</div>";

    if (!solved) bindChallenge(root, ch);
  }

  function challengeCard(ch) {
    return '<div class="challenge-hero">' +
      '<span class="challenge-kicker">' + MW.icon("target") + new Date().toLocaleDateString(document.documentElement.lang === "ar" ? "ar" : "en", { weekday: "long", day: "numeric", month: "long" }) + '</span>' +
      '<div class="challenge-q math" dir="auto">' + MW.pick(ch.q) + "</div>" +
      '<div class="challenge-reward">+20 ' + MW.t("points_label") + " · " + MW.t("stat_streak") + "</div>" +
      '<div class="answer-zone">' +
        '<input class="input answer-input" id="ch-answer" placeholder="' + (document.documentElement.lang === "ar" ? "اكتب إجابتك العددية أو النصية" : "Type your numeric or text answer") + '" autocomplete="off">' +
        '<button class="btn btn-gold btn-lg btn-block" id="ch-submit">' + MW.t("submit_answer") + "</button>" +
        '<button class="btn btn-ghost btn-sm" id="ch-hint" style="align-self:center">' + MW.icon("bulb") + MW.t("challenge_hint_btn") + "</button>" +
      "</div>" +
      '<div id="ch-result"></div>' +
      '<div id="ch-solution" style="margin-top:14px;text-align:start;display:none"><div class="card" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff"><strong style="display:block;margin-bottom:8px;font-size:.9rem">' + MW.t("challenge_solution_title") + '</strong><div class="math" style="overflow-x:auto;color:#EDE7DC">' + MW.tex(ch.solutionTex || "", true) + "</div></div></div>" +
    "</div>";
  }

  function solvedCard(ch, p) {
    return '<div class="card" style="text-align:center;padding:clamp(26px,5vw,40px)">' +
      '<div style="color:var(--c-teal);width:70px;height:70px;margin-inline:auto">' + MW.icon("checkc") + "</div>" +
      '<h2 style="margin-top:12px">' + MW.t("success_well_done") + "</h2>" +
      '<p class="muted" style="margin-top:8px;line-height:1.8">' + MW.t("challenge_already_done") + "</p>" +
      '<div class="chip chip-teal" style="margin-top:16px;font-size:.9rem">' + MW.icon("star") + '<span class="num">' + p.points + "</span> " + MW.t("points_label") + "</div>" +
      '<a href="#/league" class="btn btn-soft" style="margin-top:20px">' + MW.icon("trophy") + MW.t("nav_league") + "</a>" +
    "</div>";
  }

  function weeklyContestCard() {
    var wc = MW.demo.weeklyContest;
    return '<div class="card" style="margin-top:18px">' +
      '<div class="row-between" style="margin-bottom:10px">' +
        "<div><strong>" + MW.pick(wc.title) + '</strong><div class="faint" style="font-size:.82rem;margin-top:3px">' + MW.icon("clock").replace("<svg", '<svg style="width:13px;height:13px;display:inline;vertical-align:-2px"') + " " + MW.pick(wc.endsIn) + "</div></div>" +
        '<span class="chip chip-gold">' + MW.pick(wc.reward) + "</span>" +
      "</div>" +
      '<p class="muted" style="font-size:.9rem;line-height:1.8">' + MW.pick(wc.desc) + "</p>" +
      '<a href="#/league" class="btn btn-primary btn-sm" style="margin-top:14px">' + MW.t("nav_league") + "</a>" +
    "</div>";
  }

  function bindChallenge(root, ch) {
    root.querySelector("#ch-hint").addEventListener("click", function () {
      MW.modal({ title: MW.t("challenge_hint_btn"), body: '<p style="line-height:1.9;font-size:.95rem">' + MW.pick(ch.hint) + "</p>" });
    });
    root.querySelector("#ch-submit").addEventListener("click", function () {
      var val = String(root.querySelector("#ch-answer").value).trim().toLowerCase().replace(/\s+/g, "");
      var expected = String(ch.answer).trim().toLowerCase();
      if (!val) return;
      var correct = val === expected;
      MW.store.recordChallenge(correct);
      var zone = root.querySelector("#ch-result");
      zone.innerHTML =
        '<div class="result-banner ' + (correct ? "ok" : "bad") + '">' +
          MW.icon(correct ? "checkc" : "alert") +
          "<div><strong>" + (correct ? MW.t("challenge_correct", { n: 20 }) : MW.t("challenge_wrong") + ' <b dir="ltr" class="num">' + MW.esc(ch.answer) + "</b>") + "</strong></div>" +
        "</div>";
      root.querySelector("#ch-answer").disabled = true;
      root.querySelector("#ch-submit").disabled = true;
      var sol = root.querySelector("#ch-solution");
      if (sol && !correct) sol.style.display = "";
      if (sol) sol.style.display = "";
    });
    root.querySelector("#ch-answer").addEventListener("keydown", function (e) {
      if (e.key === "Enter") root.querySelector("#ch-submit").click();
    });
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.challenge = { render: render };
})();
