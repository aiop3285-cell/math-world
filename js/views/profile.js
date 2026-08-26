(function () {
  "use strict";

  function render(root) {
    var user = MW.store.session();
    var p = MW.store.getProgress();

    root.innerHTML =
      '<div class="page-head"><h1 class="page-title">' + MW.t("profile_title") + "</h1></div>" +

      '<div class="card profile-header">' +
        MW.avatar(user.name, 84, "brown") +
        '<div class="grow">' +
          '<h2 class="profile-name" id="pf-name">' + MW.esc(user.name) + "</h2>" +
          '<div class="profile-mail">' + MW.esc(user.email) + "</div>" +
          '<div class="faint" style="font-size:.8rem;margin-top:4px">' + MW.t("joined_on") + " " + formatDate(user.joined) + "</div>" +
          (user.role === "admin" ? '<a href="#/admin" class="btn btn-soft btn-sm" style="margin-top:10px">' + MW.icon("gear") + MW.t("admin_panel") + "</a>" : "") +
        "</div>" +
        '<button class="btn btn-ghost btn-sm" data-edit-name>' + MW.icon("edit") + MW.t("edit_name") + "</button>" +
      "</div>" +

      '<div class="stat-cards">' +
        statCard("star", p.points, MW.t("stat_points"), "var(--c-teal-soft)", "var(--c-teal-deep)") +
        statCard("flame", p.streak, MW.t("stat_streak"), "var(--c-gold-soft)", "#8a6524") +
        statCard("medal", p.badges.length + "/" + MW.demo.badges.length, MW.t("stat_badges"), "var(--c-sand-soft)", "var(--c-brown-deep)") +
        statCard("checkc", p.completedLessons.length, MW.t("lessons_count"), "var(--c-bg-soft)", "var(--c-muted)") +
      "</div>" +

      '<section style="margin-top:26px">' +
        '<h3 style="font-size:1.05rem;margin-bottom:14px">' + MW.t("my_badges") + "</h3>" +
        '<div class="badges-grid">' +
          MW.demo.badges.map(function (b) {
            var earned = p.badges.indexOf(b.id) !== -1;
            return '<div class="badge-tile' + (earned ? "" : " locked") + '">' +
              MW.badgeSVG(b, 56, !earned) +
              '<div class="badge-tile-name">' + MW.t("badge_" + b.id) + "</div>" +
              '<div class="badge-tile-desc">' + (earned ? MW.t("badge_" + b.id + "_d") : MW.t("badge_locked")) + "</div>" +
            "</div>";
          }).join("") +
        "</div>" +
      "</section>" +

      '<section style="margin-top:30px">' +
        reviewSection() +
      "</section>" +

      '<section class="stack" style="margin-top:26px;gap:12px;max-width:520px">' +
        '<div class="card row-between" style="padding:16px 20px">' +
          "<strong style='font-size:.92rem'>" + MW.t("language_pref") + "</strong>" +
          '<div class="row" style="gap:6px">' +
            '<button class="tab' + (document.documentElement.lang === "ar" ? " active" : "") + '" data-lang-ar>' + MW.t("arabic") + "</button>" +
            '<button class="tab' + (document.documentElement.lang === "en" ? " active" : "") + '" data-lang-en>' + MW.esc(MW.t("english")) + "</button>" +
          "</div>" +
        "</div>" +
        '<button class="btn btn-ghost btn-block" data-change-pw>' + MW.icon("lock") + MW.t("change_password") + "</button>" +
        '<button class="btn btn-danger btn-block" data-signout>' + MW.icon("logout") + MW.t("sign_out") + "</button>" +
        '<button class="btn btn-ghost btn-block" data-reset>' + MW.icon("refresh") + MW.t("reset_progress") + "</button>" +
      "</section>";

    bind(root);
  }

  function reviewSection() {
    var log = MW.store.getReviewLog().slice().reverse();
    var marks = MW.store.getBookmarks().slice().reverse();
    var html = '<div class="card" style="margin-bottom:16px">' +
      '<div class="row-between" style="margin-bottom:6px"><h3 style="font-size:1rem">' + MW.t("my_mistakes") + ' <span class="chip chip-sand num">' + log.length + '</span></h3></div>' +
      '<p class="faint" style="font-size:.78rem;margin-bottom:10px">' + MW.t("mistakes_hint") + "</p>";
    if (!log.length) {
      html += '<p class="muted" style="font-size:.88rem">' + MW.t("no_mistakes_msg") + "</p>";
    } else {
      html += log.slice(0, 12).map(function (r) {
        var due = MW.store.dueDays(r);
        var dueChip = due <= 0
          ? '<span class="chip chip-danger review-due">' + MW.t("due_today") + "</span>"
          : '<span class="chip review-due">' + MW.t("due_in_days", { n: due }) + "</span>";
        return '<div class="review-item">' +
          "<div class='grow' style='min-width:0'><div style='font-weight:600;font-size:.86rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap'>" + MW.esc(r.q || "â€”") + '</div><a href="#/lesson/' + r.trackId + "/" + r.lessonId + '" class="faint" style="font-size:.74rem">' + MW.esc(r.lessonTitle.slice(0, 30)) + "</a></div>" +
          (r.correct ? '<span class="chip chip-teal" style="flex-shrink:0">' + MW.esc(r.correct) + "</span>" : "") +
          dueChip +
          '<button class="btn btn-soft btn-sm" data-reviewed="' + r.id + '" style="flex-shrink:0">' + MW.t("mark_reviewed") + "</button>" +
          '<button class="icon-btn" data-del-review="' + r.id + '" style="width:32px;height:32px;flex-shrink:0" aria-label="' + MW.t("removed_item") + '">' + MW.icon("x") + "</button>" +
        "</div>";
      }).join("");
    }
    html += "</div>";

    if (marks.length) {
      html += '<div class="card"><h3 style="font-size:1rem;margin-bottom:8px">' + MW.t("bookmarks_title") + ' <span class="chip chip-gold num">' + marks.length + "</span></h3>" +
        marks.map(function (b) {
          return '<a class="list-row" href="#/lesson/' + b.trackId + "/" + b.lessonId + '" style="text-decoration:none;color:inherit">' +
            '<span style="color:var(--c-gold)">' + MW.icon("star") + "</span>" +
            "<span class='grow' style='font-size:.87rem;font-weight:600'>" + MW.esc(b.q) + "</span>" +
          "</a>";
        }).join("") + "</div>";
    }
    return html;
  }

  function statCard(iconName, value, label, bg, fg) {
    return '<div class="stat-card">' +
      '<span class="stat-icon" style="background:' + bg + ";color:" + fg + '">' + MW.icon(iconName) + "</span>" +
      '<div><div class="stat-value num">' + value + '</div><div class="stat-label">' + label + "</div></div></div>";
  }

  function formatDate(d) {
    if (!d) return "â€”";
    try {
      return new Date(d).toLocaleDateString(document.documentElement.lang === "ar" ? "ar" : "en", { year: "numeric", month: "long", day: "numeric" });
    } catch (e) { return d; }
  }

  function bind(root) {
    root.querySelectorAll("[data-lang-ar]").forEach(function (b) {
      b.addEventListener("click", function () { switchLang("ar"); });
    });
    root.querySelectorAll("[data-lang-en]").forEach(function (b) {
      b.addEventListener("click", function () { switchLang("en"); });
    });

    var editBtn = root.querySelector("[data-edit-name]");
    editBtn.addEventListener("click", function () {
      var wrap = document.createElement("div");
      wrap.innerHTML =
        '<div class="field"><label class="field-label">' + MW.t("field_name") + '</label><input class="input" id="newname" value="' + MW.esc(MW.store.session().name) + '"></div>' +
        '<button class="btn btn-primary btn-block" id="save-name">' + MW.t("save") + "</button>";
      var m = MW.modal({ title: MW.t("edit_name"), body: wrap });
      wrap.querySelector("#save-name").addEventListener("click", function () {
        var v = wrap.querySelector("#newname").value.trim();
        if (v.length < 3) return;
        MW.auth.updateOwnProfile({ name: v }).then(function () {
          m.close();
          MW.toast(MW.t("name_updated"), "success");
          MW.router.render();
        });
      });
    });

    root.querySelectorAll("[data-reviewed]").forEach(function (b) {
      b.addEventListener("click", function () {
        MW.store.markReviewed(b.getAttribute("data-reviewed"));
        MW.toast(MW.t("mark_reviewed"), "success");
        MW.router.render();
      });
    });
    root.querySelectorAll("[data-del-review]").forEach(function (b) {
      b.addEventListener("click", function () {
        MW.store.removeReview(b.getAttribute("data-del-review"));
        MW.toast(MW.t("removed_item"));
        MW.router.render();
      });
    });

    root.querySelector("[data-change-pw]").addEventListener("click", function () {
      var wrap = document.createElement("div");
      wrap.innerHTML =
        '<p class="faint" style="font-size:.78rem;margin-bottom:12px">' + MW.t("reset_hint") + "</p>" +
        '<div class="field"><label class="field-label">' + MW.t("new_password") + '</label><input class="input" id="np1" type="password" dir="ltr"></div>' +
        '<div class="field"><label class="field-label">' + MW.t("confirm_password") + '</label><input class="input" id="np2" type="password" dir="ltr"></div>' +
        '<button class="btn btn-primary btn-block" id="np-save">' + MW.t("save") + "</button>";
      var m = MW.modal({ title: MW.t("change_password"), body: wrap });
      wrap.querySelector("#np-save").addEventListener("click", function () {
        var a = wrap.querySelector("#np1").value;
        var b = wrap.querySelector("#np2").value;
        if (a !== b) { MW.toast(MW.t("err_pw_mismatch"), "error"); return; }
        if (!(a.length >= 8 && /[A-Za-z\u0600-\u06FF]/.test(a) && /\d/.test(a))) { MW.toast(MW.t("err_weak_password"), "error"); return; }
        MW.auth.updatePassword(a).then(function (r) {
          if (!r.ok) { MW.toast(MW.t(r.error || "err_generic_auth"), "error"); return; }
          m.close();
          MW.toast(MW.t("pw_changed_ok"), "success");
        });
      });
    });

    root.querySelector("[data-signout]").addEventListener("click", function () {
      MW.store.logout().then(function () {
        location.hash = "#/auth";
        MW.router.render();
        MW.toast(MW.t("signed_out"));
      });
    });

    root.querySelector("[data-reset]").addEventListener("click", function () {
      MW.confirmDialog(MW.t("reset_confirm"), true).then(function (yes) {
        if (!yes) return;
        MW.store.resetMyProgress();
        MW.toast(MW.t("reset_done"), "success");
        MW.router.render();
      });
    });
  }

  function switchLang(lang) {
    MW.i18n.setLang(lang);
    MW.router.render();
    MW.toast(MW.t("toast_lang_changed"));
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.profile = { render: render };
})();

