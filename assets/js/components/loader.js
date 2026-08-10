document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");

  if (!loader || typeof gsap === "undefined") {
    document.documentElement.classList.remove("is-loading");
    document.body.classList.remove("is-loading");
    document.body.removeAttribute("aria-busy");
    return;
  }

  const countWrappers = document.querySelectorAll(".count-wrapper");
  const countElements = document.querySelectorAll(".count");
  const stars = document.querySelectorAll(
    ".revealer-1, .revealer-2, .revealer-3"
  );
  const cutoutPath = document.querySelector(".cutout-path");
  document.documentElement.classList.add("is-loading");
  document.body.classList.add("is-loading");
  gsap.set(stars, {
    scale: 0,
    opacity: 1,
  });

  gsap.set(cutoutPath, {
    scale: 0,
    svgOrigin: "172 172",
  });

  const windowWidth = window.innerWidth;
  const wrapperWidth = 180;
  const finalPosition = windowWidth - wrapperWidth;
  const stepDistance = finalPosition / 6;
  const countTimeline = gsap.timeline();

  countTimeline.to(countElements, {
    x: -900,
    duration: 0.85,
    delay: 0.5,
    ease: "power4.inOut",
  });

  for (let i = 1; i <= 6; i++) {
    const xPosition = -900 + i * 180;
    countTimeline.to(countElements, {
      x: xPosition,
      duration: 0.85,
      ease: "power4.inOut",

      onStart: () => {
        if (window.innerWidth > 576) {
          gsap.to(countWrappers, {
            x: stepDistance * i,
            duration: 0.85,
            ease: "power4.inOut",
          });
        }
      },
    });
  }
  const starsTimeline = gsap.timeline();
  starsTimeline
    .to(stars[0], {
      scale: 45,
      delay: 7 * 0.85,
      duration: 1,
      ease: "power4.inOut",
    })
    .to(stars[1], {
      scale: 45,
      delay:  -0.5,
      duration: 1,
      ease: "power4.inOut",
    })
    .to(stars[2], {
      scale: 45,
      delay: -0.5,
      duration: 1,
      ease: "power4.inOut",
    })
    .set(stars[0], {
      display: "none",
    })
    .set(stars[1], {
      display: "none",
    })
    .set(stars[2], {
      display: "none",
    });
  const pageLoad = new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }
    window.addEventListener("load", resolve, {
      once: true,
    });
  });

  const fontsLoad = document.fonts
    ? document.fonts.ready
    : Promise.resolve();
  Promise.all([
    countTimeline.then(),
    starsTimeline.then(),
    pageLoad,
    fontsLoad,
  ]).then(() => {
    gsap.to(cutoutPath, {
      scale: 45,
      duration: 2.2,
      ease: "power4.inOut",
      onStart: () => {},
      onComplete: () => {
        loader.style.pointerEvents = "none";
        gsap.to(loader, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            loader.remove();
            document.documentElement.classList.remove("is-loading");
            document.body.classList.remove("is-loading");
            document.body.removeAttribute("aria-busy");
          },
        });
      },
    });
  });
});
