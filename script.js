console.log("script.js loaded")

import { animate, renderer } from "./modules/ring.js";


console.log(window.innerWidth, window.innerHeight)

const container = document.getElementById("three-container");
container.appendChild(renderer.domElement);



// var modalS = document.getElementById("modalS");
// var modalP = document.getElementById("modalP");
// var modalC = document.getElementById("modalC");
// var addS = document.getElementById("addS");
// var addP = document.getElementById("addP");
// var backS = document.getElementById("backS");
// var backP = document.getElementById("backP");
// var backC = document.getElementById("backC");

// const loadModal = function(modal, add) {
//   add.onclick = function () {
//     modal.style.display = "block";
//   };

//   // Закрытие модального окна только при клике вне модального окна
//   modal.onclick = function(event) {
//     if (event.target === modal) {
//       modal.style.display = "none";
//     }
//   };
// }

// backS.onclick = function() {
//   modalS.style.display = "none";
// }
// backP.onclick = function() {
//   modalP.style.display = "none";
// }
// backC.onclick = function() {
//   modalC.style.display = "none";
// }

// loadModal(modalS, addS);
// loadModal(modalP, addP);
// loadModal(modalC, addC);

const startAnimationRight = (entries, observer) => {
  entries.forEach(entry => {
    entry.target.classList.toggle("slide-in-from-right", entry.isIntersecting);
  });
};
const startAnimationLeft = (entries, observer) => {
  entries.forEach(entry => {
    entry.target.classList.toggle("slide-in-from-left", entry.isIntersecting);
  });
};
const observerRight = new IntersectionObserver(startAnimationRight);
const observerLeft = new IntersectionObserver(startAnimationLeft);
const options = { root: null, rootMargin: '0px', threshold: 1 };
const titles = document.querySelectorAll('h2');
titles.forEach(el => {
  observerRight.observe(el, options);
});
const content = document.querySelectorAll('ul');
content.forEach(el => {
  observerLeft.observe(el, options);
});

// Add new animation for rotating cards
const startCardAnimation = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = "rotate3d(0, 0, 0, 0deg)";
      entry.target.style.opacity = "1";
    } else {
      entry.target.style.transform = "rotate3d(1, 1, 0, 90deg)";
      entry.target.style.opacity = "0";
    }
  });
};

// Create new observer for cards
const cardObserver = new IntersectionObserver(startCardAnimation, {
  threshold: 0.3,
  rootMargin: '0px'
});

// Observe all image cards
const cards = document.querySelectorAll('.image-card');
cards.forEach(card => {
  // Set initial state
  card.style.transition = "all 1.2s ease-out";
  card.style.transform = "rotate3d(1, 1, 0, 90deg)";
  card.style.opacity = "0";
  
  // Start observing
  cardObserver.observe(card);
});
animate();