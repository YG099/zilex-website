/* =========================================================
   ZiLex — Zilwa Legal Transcription | main.js
   Vanilla JS: nav, header, reveal, scrollspy, mailto form.
   ========================================================= */
(function () {
  "use strict";

  var EMAIL_PRIMARY = "yanga1422@gmail.com";
  var EMAIL_CC      = "zilextranscription@outlook.com";

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  toggle.addEventListener("click", function () {
    setNav(!document.body.classList.contains("nav-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });
  document.addEventListener("click", function (e) {
    if (document.body.classList.contains("nav-open") && !e.target.closest(".site-header")) setNav(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setNav(false);
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Scrollspy (active nav link) ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".site-nav a[href^='#']");
  if ("IntersectionObserver" in window) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id && !link.classList.contains("btn"));
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spyObs.observe(s); });
  }

  /* ---------- Copy-to-clipboard buttons ---------- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        var original = "Copy";
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = original; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* ---------- Quote form -> mailto (both inboxes) ---------- */
  var form = document.getElementById("quote-form");
  var status = document.getElementById("form-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name    = (data.get("name")    || "").toString().trim();
    var email   = (data.get("email")   || "").toString().trim();
    var service = (data.get("service") || "").toString().trim();
    var length  = (data.get("length")  || "Not sure").toString().trim();
    var message = (data.get("message") || "").toString().trim();

    var subject = "Quote request: " + service + " — " + name;
    var body = [
      "Name:      " + name,
      "Email:     " + email,
      "Service:   " + service,
      "Audio:     " + length,
      "",
      "Matter details:",
      message,
      "",
      "-- Sent from the ZiLex website"
    ].join("\n");

    var href = "mailto:" + EMAIL_PRIMARY +
               "?cc=" + encodeURIComponent(EMAIL_CC) +
               "&subject=" + encodeURIComponent(subject) +
               "&body=" + encodeURIComponent(body);

    status.textContent = "Opening your email client… if nothing happens, email " + EMAIL_PRIMARY + " directly.";
    window.location.href = href;
  });
})();
