// Mobile menu toggle and active link highlight.
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

// Open or close the menu and keep aria-expanded in sync for screen readers.
btn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});

// Close the menu after a link is tapped.
nav.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  })
);

// On the home page, mark the nav link for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
if (sections.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        nav.querySelectorAll("a").forEach(a =>
          a.classList.toggle("active", a.getAttribute("href").endsWith("#" + e.target.id)));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(s => obs.observe(s));
}

// ---- Theme toggle: remembers the choice (storage may be blocked, so it is wrapped in try/catch).
const themeBtn = document.getElementById("theme-btn");
function showThemeLabel() {
  themeBtn.textContent = document.documentElement.dataset.theme === "dark" ? "Light mode" : "Dark mode";
}
showThemeLabel();
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
  showThemeLabel();
});

// ---- Small message that fades in and out (used by copy and form).
const toast = document.getElementById("toast");
function say(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---- Scroll progress bar and back-to-top button.
const bar = document.getElementById("progress");
const topBtn = document.getElementById("to-top");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
  topBtn.classList.toggle("show", scrollY > 600);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();
topBtn.addEventListener("click", () => scrollTo({ top: 0 }));

// ---- Copy email button.
document.querySelectorAll("[data-copy]").forEach(b =>
  b.addEventListener("click", () => {
    const text = b.dataset.copy;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => say("Email copied"), () => say(text));
    } else { say(text); }
  })
);

// ---- Contact form: check the fields, then open the visitor's email app with the message filled in.
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.elements.name, email = form.elements.email, msg = form.elements.message;
    const problems = [];
    [name, email, msg].forEach(f => f.classList.remove("invalid"));
    if (!name.value.trim()) { problems.push("Enter your name."); name.classList.add("invalid"); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { problems.push("Enter a valid email address."); email.classList.add("invalid"); }
    if (msg.value.trim().length < 10) { problems.push("Write a message of at least 10 characters."); msg.classList.add("invalid"); }
    document.getElementById("form-error").textContent = problems.join(" ");
    if (problems.length) return;
    const body = msg.value.trim() + "\n\nFrom: " + name.value.trim() + " (" + email.value.trim() + ")";
    location.href = "mailto:okolieleonard2@gmail.com?subject=" + encodeURIComponent("Portfolio message from " + name.value.trim()) + "&body=" + encodeURIComponent(body);
    say("Opening your email app");
  });
}

// ---- Click a screenshot to enlarge it (Esc or clicking outside closes it).
const lb = document.getElementById("lightbox");
document.querySelectorAll(".shots img").forEach(img =>
  img.addEventListener("click", () => {
    lb.querySelector("img").src = img.src;
    lb.querySelector("img").alt = img.alt;
    lb.showModal();
  })
);
document.getElementById("lb-close").addEventListener("click", () => lb.close());
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
