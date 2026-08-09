(function () {
  const EVENT_START_DATE = new Date(2026, 7, 8); // Aug 8, 2026 — when this countdown was set up
  const EVENT_TARGET_DATE = new Date(2027, 6, 24); // Jul 24, 2027 — graduation, 350 days later
  const DAY_MS = 24 * 60 * 60 * 1000;
  const EVENT_TOTAL_DAYS = Math.max(
    1,
    Math.round((EVENT_TARGET_DATE - EVENT_START_DATE) / DAY_MS),
  );

  const EVENT_ENDED_TITLE = "🎓 I Just Graduated!";
  const EVENT_ENDED_DESC =
    "The countdown's over — I've completed my B.Sc. in Mechatronics Engineering at the " +
    "University of Aleppo. Full focus now: building fast, animated, production-grade " +
    "interfaces as a frontend developer. Thanks for following along!";

  function zero(n) {
    return n < 10 ? `0${n}` : `${n}`;
  }

  function buildDots(count, step, activeIndex) {
    let html = "";
    for (let i = 1; i <= count; i++) {
      const rotation = i * step;
      const cls = i === activeIndex ? "dot active" : "dot";
      html += `<div class="${cls}" style="transform: rotate(${rotation}deg)"></div>`;
    }
    return html;
  }

  let intervalId = null;

  function tick() {
    const secDots = document.getElementById("secDots");
    const minDots = document.getElementById("minDots");
    const hrDots = document.getElementById("hrDots");
    const dayDots = document.getElementById("dayDots");
    if (!secDots || !minDots || !hrDots || !dayDots) return;

    const now = new Date();
    const msLeft = EVENT_TARGET_DATE - now;

    if (msLeft <= 0) {
      endEvent();
      return;
    }

    let hours = now.getHours() % 12;
    const amPm = now.getHours() >= 12 ? "PM" : "AM";
    hours = hours === 0 ? 12 : hours;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const daysElapsed = Math.min(
      EVENT_TOTAL_DAYS,
      Math.floor((now - EVENT_START_DATE) / DAY_MS),
    );
    const activeDayDot = Math.min(
      36,
      Math.max(1, Math.round((daysElapsed / EVENT_TOTAL_DAYS) * 36)),
    );

    secDots.innerHTML = `${buildDots(60, 6, seconds)}<b>${amPm}</b><h2>${zero(seconds)}<br><span>Seconds</span></h2>`;
    minDots.innerHTML = `${buildDots(60, 6, minutes)}<h2>${zero(minutes)}<br><span>Minutes</span></h2>`;
    hrDots.innerHTML = `${buildDots(12, 30, hours)}<h2>${zero(hours)}<br><span>Hours</span></h2>`;
    dayDots.innerHTML = `${buildDots(36, 10, activeDayDot)}<h2>${daysElapsed}<br><span>Days</span></h2>`;
  }

  function endEvent() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    const clockEl = document.getElementById("clock");
    const titleEl = document.getElementById("eventTitle");
    const descEl = document.getElementById("eventDesc");

    if (clockEl && !clockEl.classList.contains("timing-ended")) {
      clockEl.classList.add("timing-ended");
      setTimeout(() => {
        clockEl.style.display = "none";
      }, 400);
    }
    if (titleEl) titleEl.textContent = EVENT_ENDED_TITLE;
    if (descEl) descEl.textContent = EVENT_ENDED_DESC;
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    if (!document.getElementById("clock")) return;
    tick();
    intervalId = setInterval(tick, 1000);
  });
})();
