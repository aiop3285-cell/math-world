(function () {
  "use strict";

  var pendingImage = null;

  function render(root, params) {
    pendingImage = null;
    var prefill = params && params.lesson ? decodeURIComponent(params.lesson) : "";
    var q = params && params.q ? decodeURIComponent(params.q) : "";

    root.innerHTML =
      '<div class="page-head">' +
        '<h1 class="page-title">' + MW.t("assistant_greeting_title") + "</h1>" +
        '<p class="page-sub">' + MW.t("assistant_greeting_sub") + "</p>" +
      "</div>" +
      '<div class="chat-layout">' +
        '<aside class="assistant-side stack">' +
          capCard("info", MW.t("assistant_cap_understand")) +
          capCard("bulb", MW.t("assistant_cap_steps")) +
          capCard("refresh", MW.t("assistant_cap_similar")) +
          capCard("checkc", MW.t("assistant_cap_review")) +
          capCard("map", MW.t("assistant_cap_link")) +
          '<div class="assistant-note">' + MW.icon("alert") + " " + MW.t("assistant_warning") + "</div>" +
        "</aside>" +
        '<div class="chat-panel">' +
          '<div class="chat-log" id="chat-log"></div>' +
          '<div class="composer">' +
            '<div id="attach-preview"></div>' +
            '<div class="composer-main">' +
              '<button class="icon-btn attach-btn" data-attach title="' + MW.t("assistant_attach") + '">' + MW.icon("image") + '<span class="chip chip-danger soon-chip">' + MW.t("img_soon_chip") + "</span></button>" +
              '<textarea id="chat-input" rows="1" placeholder="' + MW.t("assistant_placeholder") + '"></textarea>' +
              '<button class="composer-send" data-send title="' + MW.t("assistant_send") + '">' + MW.icon("send") + "</button>" +
            "</div>" +
            '<input type="file" id="chat-file" accept="image/*" hidden>' +
          "</div>" +
        "</div>" +
      "</div>";

    var log = root.querySelector("#chat-log");
    botMessage(log,
      "<strong>" + MW.t("assistant_greeting_title") + "</strong><br>" + MW.t("assistant_greeting_sub") +
      '<div style="margin-top:10px;font-size:.85rem"><span class="faint">' + MW.t("ai_quick_examples") + '</span><div class="ai-actions" data-examples></div></div>'
    );
    fillExamples(log);

    var input = root.querySelector("#chat-input");
    if (q && !prefill) { input.value = q; }
    else if (prefill && !q) {
      input.value = document.documentElement.lang === "ar"
        ? "أنا أدرس درس «" + prefill + "». اشرح لي فكرته الأساسية خطوة بخطوة مع تلميح أولي."
        : "I'm studying the lesson \u201C" + prefill + "\u201D. Walk me through its core idea step by step with an initial hint.";
    } else if (prefill && q) {
      input.value = document.documentElement.lang === "ar"
        ? "في درس «" + prefill + "\": " + q
        : "In the lesson \u201C" + prefill + "\u201D: " + q;
    }

    bindComposer(root, log);
  }

  function capCard(iconName, text) {
    return '<div class="capability-card">' + MW.icon(iconName) + "<span>" + text + "</span></div>";
  }

  function fillExamples(log) {
    var box = log.querySelector("[data-examples]");
    if (!box) return;
    var examples = document.documentElement.lang === "ar"
      ? ["lim x->2 (x^2-4)/(x-2)", "d/dx 3x^2+5x-2", "INT x^2+3x dx", "dy/dx = 4y"]
      : ["lim x->2 (x^2-4)/(x-2)", "d/dx 3x^2+5x-2", "INT x^2+3x dx", "dy/dx = 4y"];
    examples.forEach(function (ex) {
      var b = document.createElement("button");
      b.className = "btn btn-ghost btn-sm";
      b.dir = "ltr";
      b.style.fontSize = ".78rem";
      b.textContent = ex.replace("INT ", "\u222B ");
      b.addEventListener("click", function () {
        var inp = document.getElementById("chat-input");
        inp.value = ex;
        inp.focus();
        submit(document.getElementById("chat-log"), ex);
      });
      box.appendChild(b);
    });
  }

  function addUserBubble(log, html, imgDataUrl) {
    var row = document.createElement("div");
    row.className = "msg-row user";
    var u = MW.store.session();
    row.innerHTML = MW.avatar(u.name, 34, "brown") +
      '<div class="msg-bubble">' + (imgDataUrl ? '<img class="msg-img-preview" src="' + imgDataUrl + '" alt="attached">' : "") + html + "</div>";
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function botMessage(log, html) {
    var row = document.createElement("div");
    row.className = "msg-row bot";
    row.innerHTML = '<span class="msg-avatar" style="background:var(--c-teal);color:#fff;border-radius:11px;display:grid;place-items:center;width:34px;height:34px">' + MW.icon("bot").replace("<svg ", '<svg style="width:19px;height:19px" ') + "</span>" +
      '<div class="msg-bubble">' + html + "</div>";
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row.querySelector(".msg-bubble");
  }

  function showTyping(log) {
    return botMessage(log, '<span class="typing-dots"><span></span><span></span><span></span></span> <span class="muted" style="font-size:.82rem">' + MW.t("assistant_thinking") + "</span>");
  }

  function answerHTML(res) {
    var h = '<div class="ai-answer-blocks">';
    if (res.given) h += '<div class="ai-block given"><div class="ai-block-title">' + MW.t("ai_block_given") + "</div><div>" + res.given + "</div></div>";
    h += '<div class="ai-block hint"><div class="ai-block-title">' + MW.t("ai_block_hint") + "</div><div>" + res.hint + "</div></div>";
    if (!res.fallbackOnlyShowStepsLater) {
      h += '<div class="ai-block step"><div class="ai-block-title">' + MW.t("ai_block_steps") + "</div>";
      h += res.steps.map(function (s, i) {
        return '<div style="display:flex;gap:9px;margin-bottom:8px"><span class="step-num num">' + (i + 1) + "</span><div class='grow'><div>" + s.t + "</div>" +
          (s.tex ? '<div class="math" style="overflow-x:auto;padding:6px 0">' + MW.tex(s.tex, true) + "</div>" : "") +
          (s.why ? '<div class="step-why"><em>' + MW.t("ai_step_reason") + ":</em> " + s.why + "</div>" : "") + "</div></div>";
      }).join("");
      h += "</div>";
    }
    if (res.resultTex) h += '<div class="ai-block given"><div class="ai-block-title">' + MW.t("ai_block_result") + '</div><div class="math" style="overflow-x:auto">' + MW.tex(res.resultTex, true) + "</div></div>";
    h += "</div>";
    h += '<div class="ai-actions">';
    if (res.similar) h += '<button class="btn btn-soft btn-sm" data-similar=\'' + JSON.stringify(res.similar).replace(/'/g, "&#39;") + "'>" + MW.icon("refresh") + MW.t("ai_similar_btn") + "</button>";
    h += '<button class="btn btn-ghost btn-sm" data-review>' + MW.icon("checkc") + MW.t("ai_review_btn") + "</button>";
    if (res.lesson) h += '<a class="btn btn-gold btn-sm" href="' + res.lesson.href + '">' + MW.icon("book") + MW.t("ai_block_lesson") + ": " + MW.esc(res.lesson.title) + "</a>";
    h += "</div>";
    return h;
  }

  function submit(log, text) {
    text = String(text || "").trim();
    var img = pendingImage;
    if (!text && !img) return;
    addUserBubble(log, MW.esc(text), img);
    var input = document.getElementById("chat-input");
    if (input) { input.value = ""; }
    clearAttachPreview();

    var typing = showTyping(log);
    setTimeout(function () {
      typing.innerHTML = "";
      if (img && !text) {
        typing.innerHTML = MW.t("ai_image_note") +
          '<div class="ai-actions" style="margin-top:8px"><span class="chip chip-sand">' + MW.icon("image") + (document.documentElement.lang === "ar" ? "تحليل الصورة: اكتب المسألة نصيًا لأدق نتيجة" : "Image analyzed: type the problem for best accuracy") + "</span></div>";
        return;
      }
      var lang = document.documentElement.lang === "en" ? "en" : "ar";
      var res = MW.ai.answer(text, lang);
      typing.innerHTML = answerHTML(res);
      bindAnswerActions(typing, log, text, lang);
    }, 900 + Math.random() * 500);
  }

  function bindAnswerActions(bubble, log, originalText, lang) {
    var simBtn = bubble.querySelector("[data-similar]");
    if (simBtn) simBtn.addEventListener("click", function () {
      try {
        var sim = JSON.parse(simBtn.getAttribute("data-similar"));
        var bubble2 = botMessage(log,
          "<strong>" + MW.t("ai_block_similar") + "</strong>" +
          '<div class="math" style="overflow-x:auto;padding:6px 0">' + MW.tex(sim.q, true) + "</div>" +
          '<details style="margin-top:4px"><summary class="link-btn" style="font-size:.83rem">' + MW.t("challenge_solution_title") + '</summary><div class="math" style="padding:6px 0">' + MW.tex("\\text{ }" + sim.ans, true) + "</div></details>"
        );
      } catch (e) {}
    });
    var revBtn = bubble.querySelector("[data-review]");
    if (revBtn) revBtn.addEventListener("click", function () {
      var m = MW.modal({
        title: MW.t("ai_review_title"),
        body: '<textarea class="input" id="review-text" style="min-height:120px" placeholder="' + (lang === "ar" ? "الصق إجابتك أو خطوات حلّ هنا…" : "Paste your solution steps here…") + '"></textarea>' +
              '<button class="btn btn-primary btn-block" id="review-go" style="margin-top:12px">' + MW.t("ai_review_btn") + "</button>"
      });
      m.body.querySelector("#review-go").addEventListener("click", function () {
        var txt = m.body.querySelector("#review-text").value.trim();
        if (!txt) return;
        m.close();
        var rv = MW.ai.review(txt, lang);
        botMessage(log,
          "<strong>" + MW.t("ai_review_title") + "</strong><br>" + MW.esc(rv.msg) +
          '<div class="assistant-note" style="margin-top:8px">' + MW.icon("bulb") + " " + rv.tip + "</div>"
        );
      });
    });
  }

  function clearAttachPreview() {
    pendingImage = null;
    var zone = document.getElementById("attach-preview");
    if (zone) zone.innerHTML = "";
  }

  function bindComposer(root, log) {
    var input = root.querySelector("#chat-input");
    var fileInput = root.querySelector("#chat-file");

    root.querySelector("[data-send]").addEventListener("click", function () { submit(log, input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(log, input.value); }
    });
    input.addEventListener("input", function () {
      input.style.height = "auto";
      input.style.height = Math.min(140, input.scrollHeight) + "px";
    });

    root.querySelector("[data-attach]").addEventListener("click", function () {
      MW.toast(MW.t("img_soon_msg"));
    });
    fileInput.disabled = true;
  }

  window.MW = window.MW || {};
  MW.views = MW.views || {};
  MW.views.assistant = { render: render };
})();
