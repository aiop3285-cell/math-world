(function () {
  "use strict";

  var LS_SESSION = "mw_session";

  function todayKey() {
    var d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function todayOffset() { return Math.floor(Date.now() / 86400000); }

  function currentUser() {
    if (!MW.auth) return null;
    var u = MW.auth.user();
    var p = MW.auth.profile();
    if (!u) return null;
    return {
      id: u.id,
      email: u.email || "",
      phone: u.phone || (p && p.phone) || "",
      name: (p && p.name) || (u.user_metadata && u.user_metadata.name) || "طالب",
      role: (p && p.role) || "student",
      joined: (p && p.created_at) || (u.created_at || "").slice(0, 10)
    };
  }

  var progCache = {};

  function session() {
    var base = currentUser();
    if (!base) return null;
    if (!progCache[base.id]) {
      var raw = localStorage.getItem(progressKey(base.id));
      progCache[base.id] = raw ? JSON.parse(raw) : defaultProgress();
      touchStreak(progCache[base.id]);
    }
    var u = {};
    Object.keys(base).forEach(function (k) { u[k] = base[k]; });
    u._progCache = progCache[base.id];
    return u;
  }

  function defaultProgress() {
    return {
      points: 0,
      streak: 1,
      lastActiveDay: todayOffset(),
      completedLessons: [],
      passedQuizzes: [],
      quizScores: {},
      badges: [],
      weekXp: 0,
      challengesSolved: 0,
      challengeDay: null,
      perfectQuiz: false,
      xpLog: [],
      placement: null,
      quizHistory: [],
      certificates: {}
    };
  }

  function progressKey(uid) { return "mw_progress_" + uid; }

  function getProgress() {
    var u = session();
    if (!u) return defaultProgress();
    return u._progCache;
  }

  function saveProgress(p) {
    persist(p);
    renderPills();
  }

  function serverCall(fn, args) {
    if (!MW.auth.isLive() || !MW.auth.rpc) return Promise.resolve(null);
    return MW.auth.rpc(fn, args || {}).then(function (res) {
      if (!res || res.error) return null;
      return res.data || null;
    });
  }

  var snapshotTimer = null;
  function persist(p) {
    var u = currentUser();
    if (!u) return;
    var clean = {};
    Object.keys(p).forEach(function (k) { if (k !== "_progCache") clean[k] = p[k]; });
    localStorage.setItem(progressKey(u.id), JSON.stringify(clean));
    if (MW.auth.isLive() && MW.auth.rpc) {
      clearTimeout(snapshotTimer);
      snapshotTimer = setTimeout(function () {
        MW.auth.rpc("save_progress_snapshot", { p_progress: clean });
      }, 250);
    }
  }

  function applyServerPoints(p, data) {
    if (!data || typeof data.total_points !== "number") return;
    p.points = data.total_points;
    persistSilent(p);
    renderPills();
  }

  function touchStreak(p) {
    var diff = todayOffset() - (p.lastActiveDay || todayOffset());
    if (diff === 1) { p.streak += 1; p.lastActiveDay = todayOffset(); }
    else if (diff > 1) { p.streak = 1; p.lastActiveDay = todayOffset(); }
    else if (diff === 0 && p.streak === 0) { p.streak = 1; }
    persistSilent(p);
  }

  function persistSilent(p) {
    var u = currentUser();
    if (!u) return;
    var clean = {};
    Object.keys(p).forEach(function (k) { if (k !== "_progCache") clean[k] = p[k]; });
    localStorage.setItem(progressKey(u.id), JSON.stringify(clean));
  }

  function addPoints(amount, reason) {
    if (MW.auth.isLive()) return false;
    var p = getProgress();
    p.points += amount;
    p.weekXp += amount;
    p.xpLog.push({ t: Date.now(), amt: amount, why: reason || "" });
    checkBadges(p);
    saveProgress(p);
  }

  function completeLesson(lessonId) {
    var p = getProgress();
    if (p.completedLessons.indexOf(lessonId) !== -1) return Promise.resolve(false);
    var live = MW.auth.isLive();
    p.completedLessons.push(lessonId);
    if (!live) { p.points += 15; p.weekXp += 15; }
    checkBadges(p);
    saveProgress(p);
    if (!live) return Promise.resolve(true);
    return serverCall("claim_activity", {
      p_activity_key: "lesson:" + lessonId,
      p_activity_type: "lesson"
    }).then(function (data) {
      if (!data) {
        p.completedLessons = p.completedLessons.filter(function (id) { return id !== lessonId; });
        saveProgress(p);
        return false;
      }
      applyServerPoints(p, data);
      return true;
    });
  }

  function recordQuiz(unitId, scorePct) {
    var p = getProgress();
    var live = MW.auth.isLive();
    p.quizScores[unitId] = Math.max(scorePct, p.quizScores[unitId] || 0);
    p.quizHistory.push({ id: unitId, pct: scorePct, ts: Date.now() });
    if (p.quizHistory.length > 30) p.quizHistory.shift();
    if (scorePct >= 60 && p.passedQuizzes.indexOf(unitId) === -1) {
      p.passedQuizzes.push(unitId);
      if (!live) { p.points += 30; p.weekXp += 30; }
    }
    if (scorePct === 100) {
      p.perfectQuiz = true;
      if (!live) { p.points += 10; p.weekXp += 10; }
    }
    checkBadges(p);
    saveProgress(p);
    if (live) {
      serverCall("claim_activity", {
        p_activity_key: "quiz:" + unitId,
        p_activity_type: "quiz",
        p_score_pct: scorePct
      }).then(function (data) { applyServerPoints(p, data); });
    }
  }

  function recordPractice(correctCount) {
    var p = getProgress();
    var live = MW.auth.isLive();
    var pts = Math.min(20, correctCount * 2);
    if (pts > 0 && !live) { p.points += pts; p.weekXp += pts; }
    saveProgress(p);
    if (live) {
      serverCall("claim_activity", {
        p_activity_key: "practice:" + Date.now() + "_" + Math.floor(Math.random() * 1000000000),
        p_activity_type: "practice",
        p_correct_count: correctCount
      }).then(function (data) { applyServerPoints(p, data); });
    }
  }

  function saveFinal(courseId, pct) {
    var p = getProgress();
    var live = MW.auth.isLive();
    p.quizHistory.push({ id: "final:" + courseId, pct: pct, ts: Date.now() });
    var prev = p.certificates[courseId];
    var course = MW.curriculum.getCourse(courseId);
    var lessons = 0;
    var quizPcts = [];
    if (course) {
      MW.curriculum.courseParts(course).forEach(function (grp) {
        grp.parts.forEach(function (pr) {
          (pr.unit.lessons || []).forEach(function () { lessons++; });
          if (p.quizScores[pr.unit.id] !== undefined) quizPcts.push(p.quizScores[pr.unit.id]);
        });
      });
    }
    var quizAvg = quizPcts.length ? Math.round(quizPcts.reduce(function (a, b) { return a + b; }, 0) / quizPcts.length) : pct;
    p.certificates[courseId] = {
      date: (prev && prev.date) || Date.now(),
      finalPct: Math.max(pct, (prev && prev.finalPct) || 0),
      lessons: lessons,
      quizAvg: quizAvg
    };
    if (!live) { p.points += 50; p.weekXp += 50; }
    checkBadges(p);
    saveProgress(p);
    if (live) {
      serverCall("claim_activity", {
        p_activity_key: "final:" + courseId,
        p_activity_type: "final",
        p_score_pct: pct
      }).then(function (data) { applyServerPoints(p, data); });
    }
  }

  function hydrate() {
    if (!MW.auth.isLive()) return Promise.resolve();
    return serverCall("get_my_progress", {}).then(function (data) {
      if (!data) return;
      var p = getProgress();
      if (typeof data.points === "number") p.points = data.points;
      if (Array.isArray(data.completed_lessons)) p.completedLessons = data.completed_lessons;
      if (Array.isArray(data.passed_quizzes)) p.passedQuizzes = data.passed_quizzes;
      if (data.quiz_scores && typeof data.quiz_scores === "object") p.quizScores = data.quiz_scores;
      persistSilent(p);
      renderPills();
    });
  }

  function getCertificate(courseId) {
    var p = getProgress();
    return (p.certificates && p.certificates[courseId]) || null;
  }

  function savePlacement(data) {
    var p = getProgress();
    p.placement = data;
    persist(p);
  }

  function overallStats() {
    var p = getProgress();
    var total = 0, done = 0;
    MW.content.tracks.forEach(function (t) {
      (t.units || []).forEach(function (u) {
        (u.lessons || []).forEach(function (l) {
          total++;
          if (p.completedLessons.indexOf(l.id) !== -1) done++;
        });
      });
    });
    return { total: total, done: done, pct: total ? Math.round(done / total * 100) : 0 };
  }

  function recordChallenge(correct) {
    var p = getProgress();
    p.challengeDay = todayKey();
    if (correct) {
      if (!MW.auth.isLive()) { p.points += 20; p.weekXp += 20; }
      p.challengesSolved = (p.challengesSolved || 0) + 1;
    }
    checkBadges(p);
    saveProgress(p);
    if (MW.auth.isLive()) {
      serverCall("claim_activity", {
        p_activity_key: "challenge:" + todayKey(),
        p_activity_type: "challenge",
        p_score_pct: correct ? 100 : 0
      }).then(function (data) { applyServerPoints(p, data); });
    }
  }

  function checkBadges(p) {
    function grant(id) {
      if (p.badges.indexOf(id) === -1) { p.badges.push(id); return true; }
      return false;
    }
    var newly = [];
    if (p.completedLessons.length >= 1) if (grant("first_step")) newly.push("first_step");
    if (p.streak >= 3) if (grant("streak3")) newly.push("streak3");
    ["limits", "derivatives", "integrals", "matrices"].forEach(function (tid, i) {
      var badgeIds = ["limits", "derivative", "integral", "matrix"];
      if (trackDone(tid)) if (grant(badgeIds[i])) newly.push(badgeIds[i]);
    });
    if ((p.challengesSolved || 0) >= 3) if (grant("challenger")) newly.push("challenger");
    if (p.perfectQuiz) if (grant("perfect")) newly.push("perfect");
    if (p.streak >= 7) if (grant("days7")) newly.push("days7");
    if (p.completedLessons.length >= 10) if (grant("lessons10")) newly.push("lessons10");
    if (trackDone("derivatives") && trackDone("integrals")) if (grant("calcexpert")) newly.push("calcexpert");
    var anyCourse = ["limits", "derivatives", "integrals", "odes", "laplace", "matrices", "engadv"].some(function (t) { return trackDone(t); });
    if (anyCourse) if (grant("course")) newly.push("course");
    var allDone = ["limits", "derivatives", "integrals", "odes", "laplace", "matrices"].every(function (t) { return trackDone(t); });
    if (allDone) if (grant("master")) newly.push("master");
    p.newBadges = newly;
    return newly;
  }

  function trackDone(trackId) {
    var track = MW.content.tracks.filter(function (t) { return t.id === trackId; })[0];
    if (!track) return false;
    var all = [];
    (track.units || []).forEach(function (u) {
      (u.lessons || []).forEach(function (l) { all.push(l.id); });
    });
    if (!all.length) return false;
    var p = getProgress();
    return all.every(function (id) { return p.completedLessons.indexOf(id) !== -1; });
  }

  function trackProgressPct(track) {
    var total = 0, done = 0;
    var p = getProgress();
    (track.units || []).forEach(function (u) {
      (u.lessons || []).forEach(function (l) {
        total++;
        if (p.completedLessons.indexOf(l.id) !== -1) done++;
      });
    });
    return total ? Math.round(done / total * 100) : 0;
  }

  function nextLesson() {
    var p = getProgress();
    var ordered = MW.content.tracks.slice().sort(function (a, b) { return a.order - b.order; });
    for (var i = 0; i < ordered.length; i++) {
      var units = ordered[i].units || [];
      for (var j = 0; j < units.length; j++) {
        var lessons = units[j].lessons || [];
        for (var k = 0; k < lessons.length; k++) {
          if (p.completedLessons.indexOf(lessons[k].id) === -1) {
            return { track: ordered[i], unit: units[j], lesson: lessons[k] };
          }
        }
      }
    }
    return null;
  }

  function isLessonUnlocked(track, unit, lessonId) {
    var flat = [];
    (track.units || []).forEach(function (u) { (u.lessons || []).forEach(function (l) { flat.push(l.id); }); });
    var idx = flat.indexOf(lessonId);
    if (idx <= 0) return true;
    var p = getProgress();
    return p.completedLessons.indexOf(flat[idx - 1]) !== -1;
  }

  function logout() {
    var u = currentUser();
    if (u) delete progCache[u.id];
    return MW.auth.signOut();
  }

  function resetMyProgress() {
    var u = currentUser();
    if (!u) return;
    progCache[u.id] = defaultProgress();
    persist(progCache[u.id]);
  }

  function isAdmin() {
    var u = currentUser();
    return !!u && u.role === "admin";
  }

  function renderPills() {
    var pts = document.getElementById("pill-points");
    var stk = document.getElementById("pill-streak");
    var p = getProgress();
    if (pts && p) pts.querySelector(".num").textContent = p.points;
    if (stk && p) stk.querySelector(".num").textContent = p.streak;
  }

  function reviewKey() { return "mw_review_" + (currentUser() ? currentUser().id : "anon"); }
  function bookmarkKey() { return "mw_marks_" + (currentUser() ? currentUser().id : "anon"); }

  function getReviewLog() {
    try { return JSON.parse(localStorage.getItem(reviewKey())) || []; }
    catch (e) { return []; }
  }
  function addReview(entry) {
    var log = getReviewLog();
    log.push({
      id: Date.now() + Math.random().toString(36).slice(2, 6),
      lessonId: entry.lessonId,
      lessonTitle: entry.lessonTitle,
      trackId: entry.trackId,
      q: entry.q,
      correct: entry.correct,
      ts: Date.now(),
      stage: 0
    });
    localStorage.setItem(reviewKey(), JSON.stringify(log));
  }
  function markReviewed(id) {
    var log = getReviewLog();
    var it = null;
    log.forEach(function (e) {
      if (e.id === id) { e.stage = Math.min(e.stage + 1, 3); e.last = Date.now(); it = e; }
    });
    if (it && it.stage >= 3) log = log.filter(function (e) { return e.id !== id; });
    localStorage.setItem(reviewKey(), JSON.stringify(log));
    return it;
  }
  function removeReview(id) {
    var log = getReviewLog().filter(function (e) { return e.id !== id; });
    localStorage.setItem(reviewKey(), JSON.stringify(log));
  }
  function dueDays(item) {
    var gaps = [1, 3, 7];
    if (!item.last) return Math.ceil((Date.now() - item.ts) / 86400000);
    var next = item.last + gaps[Math.min(item.stage, 2)] * 86400000;
    return Math.ceil((next - Date.now()) / 86400000);
  }

  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(bookmarkKey())) || []; }
    catch (e) { return []; }
  }
  function toggleBookmark(entry) {
    var list = getBookmarks();
    var idx = list.findIndex(function (b) { return b.lessonId === entry.lessonId && b.q === entry.q; });
    var added;
    if (idx === -1) {
      list.push({ id: Date.now().toString(36), lessonId: entry.lessonId, trackId: entry.trackId, lessonTitle: entry.lessonTitle, q: entry.q, ts: Date.now() });
      added = true;
    } else {
      list.splice(idx, 1);
      added = false;
    }
    localStorage.setItem(bookmarkKey(), JSON.stringify(list));
    return added;
  }

  function saveLessonPos(lessonId, top) {
    try { localStorage.setItem("mw_pos_" + currentUser().id + "_" + lessonId, String(Math.round(top))); } catch (e) {}
  }
  function loadLessonPos(lessonId) {
    try { return parseInt(localStorage.getItem("mw_pos_" + currentUser().id + "_" + lessonId)) || 0; }
    catch (e) { return 0; }
  }
  function clearLessonPos(lessonId) {
    try { localStorage.removeItem("mw_pos_" + currentUser().id + "_" + lessonId); } catch (e) {}
  }

  window.MW = window.MW || {};
  MW.store = {
    login: function (identifier, pass, remember) {
      return MW.auth.signInPassword(String(identifier).trim().toLowerCase(), pass);
    },
    register: function (name, email, pass) {
      return MW.auth.signUpEmail(name.trim(), String(email).trim().toLowerCase(), pass);
    },
    resetPassword: function (email) {
      return MW.auth.requestPasswordReset(email);
    },
    logout: logout,
    session: session,
    hydrate: hydrate,
    getProgress: getProgress,
    addPoints: addPoints,
    completeLesson: completeLesson,
    recordQuiz: recordQuiz,
    recordChallenge: recordChallenge,
    checkBadges: checkBadges,
    trackDone: trackDone,
    trackProgressPct: trackProgressPct,
    nextLesson: nextLesson,
    isLessonUnlocked: isLessonUnlocked,
    resetMyProgress: resetMyProgress,
    isAdmin: isAdmin,
    renderPills: renderPills,
    todayKey: todayKey,
    getReviewLog: getReviewLog,
    addReview: addReview,
    markReviewed: markReviewed,
    removeReview: removeReview,
    dueDays: dueDays,
    getBookmarks: getBookmarks,
    toggleBookmark: toggleBookmark,
    saveLessonPos: saveLessonPos,
    loadLessonPos: loadLessonPos,
    clearLessonPos: clearLessonPos,
    saveFinal: saveFinal,
    getCertificate: getCertificate,
    savePlacement: savePlacement,
    recordPractice: recordPractice,
    overallStats: overallStats
  };
})();
