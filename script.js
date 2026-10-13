const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const collapsibleLists = Array.from(document.querySelectorAll("[data-collapsible]"));

if (year) {
  year.textContent = new Date().getFullYear();
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function updateActiveLink() {
  const offset = window.innerHeight * 0.35;
  let activeId = "";

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= offset) {
      activeId = section.id;
    }
  }

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
}

updateHeader();
updateActiveLink();
window.addEventListener("scroll", () => {
  updateHeader();
  updateActiveLink();
});

for (const list of collapsibleLists) {
  const step = Number(list.dataset.step || 6);
  const items = Array.from(list.children);
  const button = list.parentElement.querySelector("[data-more-button]");
  let visibleCount = step;

  function renderList() {
    items.forEach((item, index) => {
      item.classList.toggle("is-hidden", index >= visibleCount);
    });

    if (button) {
      const hasMoreThanOnePage = items.length > step;
      const isFullyExpanded = visibleCount >= items.length;
      button.classList.toggle("is-hidden", !hasMoreThanOnePage);
      button.textContent = isFullyExpanded
        ? button.dataset.lessLabel || "Collapse"
        : button.dataset.moreLabel || "More";
      button.setAttribute("aria-expanded", String(isFullyExpanded));
    }
  }

  renderList();

  if (button) {
    button.addEventListener("click", () => {
      visibleCount = visibleCount >= items.length ? step : visibleCount + step;
      renderList();
    });
  }
}
