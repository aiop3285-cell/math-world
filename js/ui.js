(function () {
  "use strict";

  var ICONS = {
    home: '<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/>',
    map: '<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v14M15 6v14"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 01-8 0z"/><path d="M8 5H5a3 3 0 003 4M16 5h3a3 3 0 01-3 4"/><path d="M12 13v4m-4 3h8m-6-3h4"/>',
    bot: '<rect x="5" y="8" width="14" height="11" rx="3.5"/><path d="M12 5v3M9 21h6"/><path d="M9.5 13.5h.01M14.5 13.5h.01" stroke-width="2.6"/><path d="M9.5 16.5c.8.7 2.2.7 3-.0" transform="translate(.5 -.5)"/>',
    user: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c1.2-3.4 4-5 7-5s5.8 1.6 7 5"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4.5 7.5l7.5 6 7.5-6"/>',
    users: '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19c.9-2.8 3-4.2 5.5-4.2S13.6 16.2 14.5 19"/><path d="M15.5 6.6a3.2 3.2 0 010 5.4M17.5 14.9c1.5.7 2.6 2 3 4.1"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.8 5.3 3.8 8.5s-1.2 6.1-3.8 8.5c-2.6-2.4-3.8-5.3-3.8-8.5s1.2-6.1 3.8-8.5z"/>',
    eye: '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    eyeoff: '<path d="M4 4l16 16"/><path d="M9.9 5.2A9.8 9.8 0 0112 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 01-3.3 3.9M6 7.3A16 16 0 002.5 12S6 18.2 12 18.2a9.4 9.4 0 003.4-.7"/><path d="M9.9 10.2a2.9 2.9 0 004 4"/>',
    lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    checkc: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.5l2.5 2.5 4.8-5.5"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
    flame: '<path d="M12 3.5c1 3-3.5 4.5-3.5 8a3.5 3.5 0 007 0c0-1.5-.8-2.5-.8-2.5s3.3 1.6 3.3 5a6 6 0 11-12 0c0-5 4.5-7 6-10.5z" fill="currentColor" stroke="none"/>',
    star: '<path d="M12 3.8l2.5 5 5.5.8-4 3.9.9 5.5L12 16.4l-4.9 2.6.9-5.5-4-3.9 5.5-.8z"/>',
    medal: '<circle cx="12" cy="14.5" r="5"/><path d="M12 12.4l.9 1.7 1.9.3-1.4 1.4.3 1.9-1.7-.9-1.7.9.3-1.9-1.4-1.4 1.9-.3z" fill="currentColor" stroke="none"/><path d="M8.5 9.5L6 4h4l2 4 2-4h4l-2.5 5.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14.5 5.5L18.5 9.5"/>',
    trash: '<path d="M4.5 6.5h15M9.5 6.5V4.8A1.3 1.3 0 0110.8 3.5h2.4a1.3 1.3 0 011.3 1.3v1.7M7 6.5l.8 13h8.4l.8-13"/><path d="M10 10v6M14 10v6"/>',
    chart: '<path d="M4 20h16"/><path d="M7 20v-6M12 20V8M17 20v-9"/>',
    film: '<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/>',
    image: '<rect x="3.5" y="5" width="17" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M4.5 17l5-5 3.5 3.5 3-3 3.5 4.5"/>',
    send: '<path d="M4.5 12L20 4.5 15 20l-3.8-6z"/><path d="M11.2 14l8.8-9.5"/>',
    bulb: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3.5a6 6 0 013.5 10.9c-.7.5-1 1.3-1 2.1v.5h-5v-.5c0-.8-.3-1.6-1-2.1A6 6 0 0112 3.5z"/>',
    logout: '<path d="M14 4.5H6.5A1.5 1.5 0 005 6v12a1.5 1.5 0 001.5 1.5H14"/><path d="M10 12h10m0 0l-3.5-3.5M20 12l-3.5 3.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    alert: '<path d="M12 4L2.8 19.5h18.4z"/><path d="M12 10v4.2M12 16.8h.01" stroke-width="2.4"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01" stroke-width="2.4"/>',
    book: '<path d="M5 4.5h6a2.5 2.5 0 012.5 2.5v12.5H7.5A2.5 2.5 0 015 17z"/><path d="M19 4.5h-3.5A2.5 2.5 0 0013 7v12.5h3.5A2.5 2.5 0 0019 17z"/>',
    limits: '<path d="M8.3 8.6C6.4 8.6 5 10.1 5 12s1.4 3.4 3.3 3.4c3.5 0 3.9-6.8 7.4-6.8 1.9 0 3.3 1.5 3.3 3.4s-1.4 3.4-3.3 3.4c-3.5 0-3.9-6.8-7.4-6.8z"/>',
    deriv: '<path d="M4.5 19.5C9 17.5 11 5.5 15.5 4.5"/><path d="M14.5 12.5l4.5 4.5M19 12.5l-4.5 4.5"/>',
    integ: '<text x="12" y="16.5" font-size="15" text-anchor="middle" fill="currentColor" stroke="none" font-family="serif" font-style="italic">∫</text>',
    ode: '<path d="M3 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/><path d="M12 5v2M12 17v2"/>',
    laplace: '<text x="12" y="17" font-size="16" text-anchor="middle" fill="currentColor" stroke="none" font-family="serif" font-style="italic">λ</text>',
    matrix: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    chevron: '<path d="M8.5 5.5L15 12l-6.5 6.5"/>',
    chevd: '<path d="M5.5 8.5L12 15l6.5-6.5"/>',
    clipboard: '<rect x="5.5" y="4.5" width="13" height="16" rx="2.5"/><path d="M9 4.5a3 3 0 016 0"/><path d="M9 11h6M9 14.5h4"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.8 13.5L7 21l5-2.6L17 21l-1.8-7.5"/>',
    zap: '<path d="M13 3L5 13.5h6L11 21l8-10.5h-6z"/>',
    refresh: '<path d="M4.5 12a7.5 7.5 0 0113-5.2L20 9"/><path d="M20 4.5V9h-4.5"/><path d="M19.5 12a7.5 7.5 0 01-13 5.2L4 15"/><path d="M4 19.5V15h4.5"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8l1.2 2.7 2.9-.7 .4 2.9 2.9.4-.7 2.9 2.3 1.9-1.9 2.2 1 2.8-2.8.9-.4 2.9-2.9-.6-1.9 2.2-2.2-2-2.8 1-.8-2.8-2.9-.5.4-2.9L3 12l2.4-1.8-.6-2.9 2.9-.4.4-2.9 2.9.7z"/>',
    grad: '<path d="M3 9l9-4.5L21 9l-9 4.5z"/><path d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4M21 9v5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    arrowup: '<path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/>',
    arrowdown: '<path d="M12 5v14M5.5 12.5L12 19l6.5-6.5"/>'
  };

  function icon(name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.info) + '</svg>';
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function tex(src, display) {
    try {
      if (window.katex && window.katex.renderToString) {
        return katex.renderToString(src, { throwOnError: false, displayMode: !!display, output: "html" });
      }
    } catch (e) {}
    return '<span class="tex-fallback">' + esc(src) + "</span>";
  }

  function toast(msg, type) {
    var zone = document.querySelector(".toast-zone");
    if (!zone) {
      zone = document.createElement("div");
      zone.className = "toast-zone";
      document.body.appendChild(zone);
    }
    var el = document.createElement("div");
    el.className = "toast " + (type || "");
    el.innerHTML = icon(type === "error" ? "alert" : "check") + "<span>" + msg + "</span>";
    zone.appendChild(el);
    setTimeout(function () {
      el.classList.add("leaving");
      setTimeout(function () { el.remove(); }, 320);
    }, 2600);
  }

  function modal(opts) {
    var backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML =
      '<div class="modal-card" role="dialog" aria-modal="true">' +
        '<div class="modal-head"><div class="modal-title">' + (opts.title || "") + '</div>' +
        '<button class="icon-btn" data-close aria-label="close">' + icon("x") + "</button></div>" +
        '<div class="modal-body"></div>' +
      "</div>";
    var body = backdrop.querySelector(".modal-body");
    if (typeof opts.body === "string") body.innerHTML = opts.body;
    else if (opts.body) body.appendChild(opts.body);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop || e.target.closest("[data-close]")) close();
    });
    function close() { backdrop.remove(); if (opts.onClose) opts.onClose(); }
    document.body.appendChild(backdrop);
    return { close: close, body: body };
  }

  function confirmDialog(msg, danger) {
    return new Promise(function (resolve) {
      var wrap = document.createElement("div");
      wrap.innerHTML =
        '<p style="font-size:.95rem;line-height:1.8">' + msg + "</p>" +
        '<div class="row" style="justify-content:flex-end;margin-top:18px">' +
        '<button class="btn btn-ghost btn-sm" data-no>' + MW.t("cancel") + "</button>" +
        '<button class="btn btn-sm ' + (danger ? "btn-danger" : "btn-primary") + '" data-yes>' + MW.t("confirm") + "</button></div>";
      var m = modal({ title: "", body: wrap });
      wrap.querySelector("[data-no]").onclick = function () { m.close(); resolve(false); };
      wrap.querySelector("[data-yes]").onclick = function () { m.close(); resolve(true); };
    });
  }

  function avatar(name, size, tone) {
    var initials = (name || "?").trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("");
    return '<span class="avatar ' + (tone || "") + '" style="width:' + size + "px;height:" + size + "px;font-size:" + Math.round(size * 0.38) + 'px">' + esc(initials) + "</span>";
  }

  function badgeSVG(badge, size, locked) {
    var shapes = {
      hex: "M32 4l24 14v28L32 60 8 46V18z",
      tri: "M32 6l26 48H6z",
      circle: null,
      shield: "M32 5l23 8v18c0 14-9 22-23 28C18 53 9 45 9 31V13z",
      square: "M10 10h44v44H10z",
      diamond: "M32 5l27 27-27 27L5 32z"
    };
    var shapePath = shapes[badge.shape] || "";
    var shapeEl = shapePath
      ? '<path d="' + shapePath + '" fill="#F4E8D2" stroke="#C89A4B" stroke-width="3" stroke-linejoin="round"/>'
      : '<circle cx="32" cy="32" r="27" fill="#F4E8D2" stroke="#C89A4B" stroke-width="3"/>';
    var inner = '<path d="' + shapePath + '" fill="none" stroke="rgba(112,81,59,.35)" stroke-width="1.4" stroke-dasharray="4 3" transform="scale(0.86) translate(5.2 5.2)"/>';
    var glyphSize = (badge.glyph || "").length > 2 ? 15 : 22;
    var textEl = '<text x="32" y="40" text-anchor="middle" font-size="' + glyphSize + '" font-weight="700" fill="#70513B" font-family="Georgia, serif">' + esc(badge.glyph || "\u2606") + "</text>";
    return '<svg class="badge-art' + (locked ? " locked" : "") + '" viewBox="0 0 64 64" style="width:' + (size || 56) + "px;height:" + (size || 56) + 'px" aria-hidden="true">' + shapeEl + inner + textEl + "</svg>";
  }

  function successOverlay(opts) {
    var ov = document.createElement("div");
    ov.className = "success-overlay";
    var confetti = "";
    var colors = ["#3F7A7A", "#C89A4B", "#E6D2B8", "#70513B"];
    for (var i = 0; i < 14; i++) {
      confetti += '<span class="confetti-piece" style="left:' + (4 + i * 6.6) + "%;background:" +
        colors[i % colors.length] + ";border-radius:" + (i % 3 === 0 ? "50%" : "2px") +
        ";animation-delay:" + (i * 90) + 'ms"></span>';
    }
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ov.innerHTML =
      '<div class="success-card">' + (reduced ? "" : confetti) +
        '<div class="success-burst"></div>' +
        (opts.badge ? '<div class="success-badge-art">' + badgeSVG(opts.badge, 96) + "</div>"
          : '<div style="color:var(--c-teal);margin-bottom:10px">' + icon("checkc").replace("<svg ", '<svg style="width:64px;height:64px;margin-inline:auto" ') + "</div>") +
        '<h2 class="success-title">' + opts.title + "</h2>" +
        (opts.sub ? '<p class="success-sub">' + opts.sub + "</p>" : "") +
        (opts.points ? '<div class="success-points"><span class="num">+' + opts.points + "</span> " + MW.t("points_label") + "</div>" : "") +
        (opts.tip ? '<div class="success-tip">' + MW.icon("bulb", "") + " " + opts.tip + "</div>" : "") +
        '<button class="btn btn-primary btn-block" style="margin-top:20px" data-ok>' + (opts.cta || MW.t("success_continue")) + "</button>" +
      "</div>";
    ov.style.position = "fixed";
    ov.addEventListener("click", function (e) {
      if (e.target === ov || e.target.closest("[data-ok]")) { ov.remove(); if (opts.onDone) opts.onDone(); }
    });
    document.body.appendChild(ov);
  }

  function go(path) { location.hash = path; }

  function findTrack(id) {
    return MW.content.tracks.filter(function (t) { return t.id === id; })[0];
  }
  function findLesson(trackId, lessonId) {
    var track = findTrack(trackId);
    if (!track) return {};
    for (var i = 0; i < track.units.length; i++) {
      var unit = track.units[i];
      for (var j = 0; j < unit.lessons.length; j++) {
        if (unit.lessons[j].id === lessonId) return { track: track, unit: unit, lesson: unit.lessons[j] };
      }
    }
    return { track: track };
  }

  function youtubeSearchUrl(query) {
    return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query + " \u0639\u0627\u0644\u0645 \u0627\u0644\u0631\u064a\u0627\u0636\u064a\u0627\u062a math");
  }

  window.MW = window.MW || {};
  MW.icon = icon;
  MW.esc = esc;
  MW.tex = tex;
  MW.toast = toast;
  MW.modal = modal;
  MW.confirmDialog = confirmDialog;
  MW.avatar = avatar;
  MW.badgeSVG = badgeSVG;
  MW.successOverlay = successOverlay;
  MW.go = go;
  MW.findTrack = findTrack;
  MW.findLesson = findLesson;
  MW.youtubeSearchUrl = youtubeSearchUrl;
})();
