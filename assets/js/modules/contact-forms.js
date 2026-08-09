(function () {
  const FALLBACK_EMAIL = "abd.alrahman.zitre.2005@gmail.com";
  const ENDPOINT = "/api/send-message";

  async function sendMessage(payload) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 500) throw new Error("not-configured");
    if (!res.ok) throw new Error("send-failed");
    return res.json();
  }

  function setFeedback(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove("is-success", "is-error");
    if (type) el.classList.add(type === "success" ? "is-success" : "is-error");
  }

  function shake(el) {
    if (!el) return;
    el.classList.remove("input-shake");
    void el.offsetWidth;
    el.classList.add("input-shake");
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    const aboutForm = document.getElementById("aboutMeForm");
    if (aboutForm) {
      const usernameInput = document.getElementById("aboutMeUsername");
      const messageInput = document.getElementById("aboutMeMessage");
      const feedbackEl = document.getElementById("aboutMeFeedback");
      const submitBtn = document.getElementById("aboutMeSubmit");

      aboutForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const message = messageInput.value.trim();

        if (!username) {
          shake(usernameInput);
          setFeedback(feedbackEl, "Please enter your name.", "error");
          usernameInput.focus();
          return;
        }
        if (!message) {
          shake(messageInput);
          setFeedback(feedbackEl, "Message can't be empty.", "error");
          messageInput.focus();
          return;
        }

        submitBtn.disabled = true;
        const idleLabel = submitBtn.textContent;
        submitBtn.textContent = "Sending…";
        try {
          await sendMessage({ type: "about", username, message });
          setFeedback(feedbackEl, "Sent! I'll get back to you soon.", "success");
          aboutForm.reset();
        } catch (err) {
          if (err.message === "not-configured") {
            setFeedback(feedbackEl, `Not wired up yet — email me at ${FALLBACK_EMAIL}.`, "error");
          } else {
            setFeedback(feedbackEl, "Something went wrong — please try again.", "error");
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = idleLabel;
        }
      });

      [usernameInput, messageInput].forEach((input) => {
        input.addEventListener("input", () => setFeedback(feedbackEl, "", null));
      });
    }

    const subscribeForm = document.getElementById("subscribeForm");
    if (subscribeForm) {
      const emailInput = document.getElementById("subscribeEmail");
      const feedbackEl = document.getElementById("subscribeFeedback");
      const submitBtn = subscribeForm.querySelector('input[type="submit"]');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      subscribeForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email) {
          shake(emailInput);
          setFeedback(feedbackEl, "Please enter your email.", "error");
          emailInput.focus();
          return;
        }
        if (!emailPattern.test(email)) {
          shake(emailInput);
          setFeedback(feedbackEl, "That email doesn't look right.", "error");
          emailInput.focus();
          return;
        }

        submitBtn.disabled = true;
        try {
          await sendMessage({ type: "subscribe", email });
          setFeedback(feedbackEl, "Subscribed! You'll hear from me when there's news.", "success");
          subscribeForm.reset();
        } catch (err) {
          if (err.message === "not-configured") {
            setFeedback(feedbackEl, `Not wired up yet — email me at ${FALLBACK_EMAIL}.`, "error");
          } else {
            setFeedback(feedbackEl, "Something went wrong — please try again.", "error");
          }
        } finally {
          submitBtn.disabled = false;
        }
      });

      emailInput.addEventListener("input", () => setFeedback(feedbackEl, "", null));
    }
  });
})();