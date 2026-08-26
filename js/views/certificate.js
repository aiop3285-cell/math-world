(function () {
  "use strict";

  function render(root, courseId) {
    var course = MW.curriculum.getCourse(courseId);
    if (!course || course.status !== "live") { location.hash = "#/paths"; return; }
    var cert = MW.store.getCertificate(courseId);
    if (!cert) { location.hash = "#/course/" + courseId; return; }

    var user = MW.store.session();
    var dateStr = new Date(cert.date).toLocaleDateString(document.documentElement.lang === "ar" ? "ar" : "en", { year: "numeric", month: "long", day: "numeric" });

    root.innerHTML =
      '<div class="no-print" style="max-width:640px;margin:0 auto 18px;text-align:center">' +
        '<h1 class="page-title">' + MW.t("congrats_course") + "</h1>" +
        '<p class="page-sub">' + MW.esc(MW.pick(course.title)) + "</p>" +
        '<button class="btn btn-primary" style="margin-top:14px" data-print>' + MW.icon("film") + MW.t("certificate_download") + "</button>" +
      "</div>" +
      '<div class="cert-sheet" id="cert-sheet">' +
        '<div class="cert-border">' +
          '<div class="cert-brand">' +
            '<img src="assets/logo.jpg" alt="" onerror="this.style.display=\'none\'">' +
            "<div><strong>" + MW.t("brand") + '</strong><small>' + MW.t("brandEn") + "</small></div>" +
          "</div>" +
          '<div class="cert-kicker">' + MW.t("certificate_title") + "</div>" +
          '<div class="cert-name">' + MW.esc(user.name) + "</div>" +
          '<div class="cert-line"></div>' +
          '<p class="cert-text">' + (document.documentElement.lang === "ar"
            ? "أتمّ بنجاح متطلبات دورة"
            : "has successfully completed the course") + "</p>" +
          '<div class="cert-course">' + MW.esc(MW.pick(course.title)) + "</div>" +
          '<div class="cert-stats">' +
            "<span><strong class=\"num\">" + cert.finalPct + "%</strong><small>" + MW.t("final_score") + "</small></span>" +
            "<span><strong class=\"num\">" + MW.esc(String(cert.lessons)) + "</strong><small>" + MW.t("lessons_count") + "</small></span>" +
            "<span><strong class=\"num\">" + MW.esc(String(cert.quizAvg || 0)) + "%</strong><small>" + MW.t("quiz_average") + "</small></span>" +
          "</div>" +
          '<div class="cert-foot"><span class="num">' + dateStr + "</span><span>" + MW.t("brand") + " · " + MW.t("brandEn") + "</span></div>" +
        "</div>" +
      "</div>";

    root.querySelector("[data-print]").addEventListener("click", function () { window.print(); });
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.certificate = { render: render };
})();
