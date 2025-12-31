// 3D Cards effect Section Artecals
VanillaTilt.init(document.querySelectorAll(".articals .box"), {
  max: 25,
  speed: 400,
  glare: true, 
"max-glare": 0.3,
});

// Swiper Slids effect (carosel) Sections: testimonials,
var swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
  },
});

// lottei animation sections: Skills, How it work? 
const nodes = document.querySelectorAll('.lottie');
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    if (!el._lottieStarted) {
      const path = el.dataset.lottie;

      const anim = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path
      });
      el._lottie = anim;
      el._lottieStarted = true;
    }
  });
}, { root: null, rootMargin: '0px', threshold: 0.15 });
nodes.forEach(n => io.observe(n));
