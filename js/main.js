// Simple interactions for the portfolio.

// 1. Mobile menu: open and close the navigation links.
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuButton.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

// Close the menu after a link is tapped (useful on mobile).
navLinks.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

// 2. Footer year stays current automatically.
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
