// links drop list
const dropList = document.querySelector(".navbar .drop-list");
const openDropList = document.querySelector("#drop-down");

openDropList.addEventListener("click", () => {
  dropList.classList.toggle("open");
});

// effct button to title section
let btns = document.querySelectorAll(".main-title");

btns.forEach((btn) => {
  btn.onmousemove = function (e) {
    let z = e.pageX - btn.offsetLeft;
    let y = e.pageY - btn.offsetTop;

    btn.style.setProperty("--z", z + "px");
    btn.style.setProperty("--y", y + "px");
  };
});

// Artecls show flip card
document.addEventListener('click', (e) => {
  const read = e.target.closest('.read-more');
  const back = e.target.closest('.btn-back');

  if (read) {
    const box = read.closest('.box');
    if (!box) return;
    box.classList.add('is-flipped');
  }

  if (back) {
    const box = back.closest('.box');
    if (!box) return;
    box.classList.remove('is-flipped');
  }
});

// More content in card features
const AllcardsDetails = document.querySelectorAll(".card-features .details");
const btnsMore = document.querySelectorAll(".btn-more");

btnsMore.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cardFeatures = btn.closest(".card-features");
    const detailsFeatures = cardFeatures.querySelector(".details");

    AllcardsDetails.forEach((d) => {
      if (d !== detailsFeatures) return d.classList.remove("down-details");
    });
    detailsFeatures.classList.toggle("down-details");
  });
});

// Cards Services Effect active
const cardsServices = document.querySelectorAll(".card-service");

cardsServices.forEach((card) => {
  card.onclick = () => {
    card.classList.toggle("active-ser");
  };
});

// Section Skills cercel block
document.addEventListener("DOMContentLoaded", () => {
  const sectionSkills = document.getElementById('our-skills');
  const circlesSkills = document.querySelectorAll('.circle');
  let played = false;

  function animate() {
    circlesSkills.forEach(progress => {
      const targetDegree = parseInt(progress.dataset.degree);
      const targetColor = progress.dataset.color;
      const targetNumber = progress.querySelector('.number');
      let degree = 0;
      const interval = setInterval(() => {
        degree++;
        if (degree > targetDegree) return clearInterval(interval);
        progress.style.background = `conic-gradient(${targetColor} ${degree}%, #222 0%)`;
        targetNumber.innerHTML = degree + "<span>%</span>"; 
        targetNumber.style.color = targetColor;
      }, 50);
    });
  }

  if ('IntersectionObserver' in window && sectionSkills) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !played) {
        played = true;
        animate();
      }
    }, { threshold: 0.2 }).observe(sectionSkills);
  } 
});

// Slider Section Top Projects
const boxProject = document.querySelector('.box-projects');
const thorttleMs = 500;
let isThrottled = false;

function moveNext() {
  const itemsProjects = document.querySelectorAll('.box-projects .item');
  boxProject.appendChild(itemsProjects[0]);
}
function movePrev() {
  const itemsProjects = document.querySelectorAll(".box-projects .item");
  boxProject.prepend(itemsProjects[itemsProjects.length - 1]);
}

function pointerInsideBox(x, y) {
  const rect = boxProject.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function handleWheel(event) {
  if (!pointerInsideBox(event.clientX, event.clientY)) return;
  event.preventDefault();

  if (isThrottled) return;
  isThrottled = true;

  if (event.deltaY > 0) {
    moveNext();
  } else {
    movePrev();
  }

  setTimeout(() => {
    isThrottled = false;
  }, thorttleMs)
}

boxProject.addEventListener('wheel', handleWheel, {
  passive: false
});

let touchStartY = 0, touchStartX = 0;

boxProject.addEventListener('touchstart', (event) => {
  touchStartY = event.touches[0].clientY;
  touchStartX = event.touches[0].clientX;
}, { passive: true });

boxProject.addEventListener('touchmove', (event) => {
  const tX = event.touches[0].clientX;
  const tY = event.touches[0].clientY;
  if (!pointerInsideBox(tX, tY)) return;

  const diff = touchStartY - tY;
  if (Math.abs(diff) < 30) return;

  event.preventDefault();

  if (isThrottled) return;
  isThrottled = true;

  if (diff > 0) {
    moveNext();
  } else {
    movePrev();
  }

  setTimeout(() => {
    isThrottled = false;
  }, thorttleMs);
}, { passive: false });

// Section descraption animation rotate and skewY
const containerForm = document.querySelector('.container-form');
const loginLink = document.querySelector('.sign-in-link');
const registerLink = document.querySelector('.sign-up-link');

registerLink.addEventListener('click', () => {
  containerForm.classList.add('active');
});

loginLink.addEventListener('click', () => {
  containerForm.classList.remove('active');
});

