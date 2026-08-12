// MENU TOGGLE
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// SCROLL ANIMATION
const revealElements = document.querySelectorAll(".card, .member");

window.addEventListener("scroll", () => {
  revealElements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
});



document.addEventListener("DOMContentLoaded", () => {

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const icon = item.querySelector(".icon");

    question.addEventListener("click", () => {

      const isOpen = item.classList.contains("active");

      // Close all
      faqItems.forEach(i => {
        i.classList.remove("active");
        i.querySelector(".icon").textContent = "+";
      });

      // Open only if it was closed
      if (!isOpen) {
        item.classList.add("active");
        icon.textContent = "−";
      }
    });
  });

});





