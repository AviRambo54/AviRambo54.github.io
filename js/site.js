const content = await fetch("data/site-content.json").then((response) => {
  if (!response.ok) throw new Error("לא ניתן לטעון את תוכן האתר");
  return response.json();
});

const page = document.body.dataset.page;
const main = document.querySelector("main");

document.querySelector('[data-brand="portrait"]').src = content.brand.portraitLogo;
document.querySelector('[data-brand="wordmark"]').src = content.brand.wordmark;
document.querySelector(`[data-nav="${page}"]`)?.setAttribute("aria-current", "page");

const phoneLink = `tel:${content.contact.phone.replace(/-/g, "")}`;
for (const el of document.querySelectorAll('[data-contact="phone"]')) {
  el.href = phoneLink;
  el.textContent = content.contact.phone;
}
for (const el of document.querySelectorAll('[data-contact="email"]')) {
  el.href = `mailto:${content.contact.email}`;
  el.textContent = content.contact.email;
}

const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".main-nav");
menuButton.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

const escapeHtml = (value = "") => value.replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[char]));

function gallery(images, kind = "standard") {
  return `<section class="gallery ${kind === "clients" ? "clients" : ""}" aria-label="גלריית עבודות">
    ${images.map((image) => `<button class="gallery-button" type="button" data-lightbox-src="${escapeHtml(image.src)}" data-lightbox-alt="${escapeHtml(image.alt)}">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy">
    </button>`).join("")}
  </section>`;
}

function paragraphs(text) {
  return text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function renderHome() {
  main.innerHTML = `<section class="home-hero">
    <img src="${content.home.hero.src}" alt="${escapeHtml(content.home.hero.alt)}">
    <div class="home-copy"><h1 dir="ltr">${content.home.title}</h1><p dir="ltr">${content.home.caption}</p></div>
  </section>`;
}

function renderAbout() {
  main.innerHTML = `<section class="about">
    <div class="about-photos">${content.about.images.map((image) => `<img src="${image.src}" alt="${escapeHtml(image.alt)}">`).join("")}</div>
    <div class="about-copy">${escapeHtml(content.about.text)}</div>
  </section>`;
}

function renderGallery(title, key, kind) {
  main.innerHTML = `<h1 class="page-title">${title}</h1>${gallery(content[key].images, kind)}`;
}

function renderVideos() {
  const text = paragraphs(content.videos.text).filter((line) => line !== "Play Video");
  const first = text.indexOf("VIM POWER FLYER");
  const second = text.indexOf("doog");
  const cards = [
    { title: "VIM POWER FLYER", image: content.videos.images[0], copy: text.slice(first + 1, second) },
    { title: "Herzliya Loves Animals", image: content.videos.images[1], copy: text.slice(second + 1) },
  ];
  main.innerHTML = `<h1 class="page-title">סרטונים</h1><section class="longform">
    ${cards.map((card) => `<article class="feature">
      ${card.image?.src ? `<img class="feature-image" src="${card.image.src}" alt="${escapeHtml(card.title)}">` : `<div class="video-placeholder" aria-hidden="true"><span>▶</span><strong>${escapeHtml(card.title)}</strong></div>`}
      <div class="feature-copy"><h2>${escapeHtml(card.title)}</h2>${card.copy.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>
    </article>`).join("")}
  </section>`;
}

function renderSpecials() {
  const ps = paragraphs(content.specials.text);
  const split = ps.findIndex((line, index) => index > 0 && line.startsWith("Print advertisement created") && ps.slice(0, index).some((x) => x.startsWith("Print advertisement created")));
  const groups = split > 0 ? [ps.slice(0, split), ps.slice(split)] : [ps];
  main.innerHTML = `<h1 class="page-title">מיוחדים</h1><section class="longform">
    ${groups.map((group, index) => `<article class="feature">
      <img class="feature-image" src="${content.specials.images[index]?.src || ""}" alt="${index ? "RB Doors" : "Land Rover Defender"}">
      <div class="feature-copy"><h2>${index ? "RB Doors" : "Land Rover Defender"}</h2>${group.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>
    </article>`).join("")}
  </section>`;
}

function renderPosts() {
  const ps = paragraphs(content.posts.text);
  const titles = ["יום הכולסטרול הלאומי.​", "עיצוב לוגו עבור וולוו צ'אלנג", "אגנטק אירוע לקוחות", "אתר ג'אנק יארד של יד 2​", "עיצוב לוגו למועדון האופנועים סילבר ווינג"];
  const posts = [];
  for (let i = 0; i < titles.length; i++) {
    const start = ps.findIndex((line) => line === titles[i]);
    const end = i + 1 < titles.length ? ps.findIndex((line) => line === titles[i + 1]) : ps.length;
    if (start >= 0) posts.push({ title: titles[i], copy: ps.slice(start + 1, end) });
  }
  main.innerHTML = `<h1 class="page-title">כמה מילים על...</h1><section class="posts">
    ${posts.map((post, index) => `<article class="post"><h2>${escapeHtml(post.title)}</h2>${post.copy.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}${content.posts.images[index] ? `<img src="${content.posts.images[index].src}" alt="${escapeHtml(post.title)}">` : ""}</article>`).join("")}
  </section>`;
}

function renderContact() {
  main.innerHTML = `<section class="contact-layout">
    <form class="contact-form">
      <label for="name">Name *</label><input id="name" name="name" required autocomplete="name">
      <label for="email">Email *</label><input id="email" name="email" type="email" required autocomplete="email">
      <label for="subject">Subject</label><input id="subject" name="subject">
      <label for="message">Message</label><textarea id="message" name="message"></textarea>
      <button type="submit">Send</button>
    </form>
    <div class="contact-copy">
      <p>יש לך תגובה? שאלה?<br>או רק רצית להגיד שלום&nbsp; : )</p>
      <p>תרגיש/י חופשי ליצור קשר.</p>
      <div class="contact-direct"><a href="${phoneLink}">${content.contact.phone}</a><a href="mailto:${content.contact.email}">${content.contact.email}</a></div>
    </div>
  </section>`;
  main.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = data.get("subject") || "פנייה מאתר אבירם שגב";
    const body = `שם: ${data.get("name")}\nאימייל: ${data.get("email")}\n\n${data.get("message") || ""}`;
    window.location.href = `mailto:${content.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

({
  home: renderHome,
  about: renderAbout,
  portfolio: () => renderGallery("תיק עבודות", "portfolio"),
  ai: () => renderGallery("AI Generated", "ai"),
  logos: () => renderGallery("לוגואים", "logos", "clients"),
  clients: () => renderGallery("לקוחות", "clients", "clients"),
  videos: renderVideos,
  specials: renderSpecials,
  posts: renderPosts,
  contact: renderContact,
}[page] || renderHome)();

const lightbox = document.querySelector(".lightbox");
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lightbox-src]");
  if (!button) return;
  lightbox.querySelector("img").src = button.dataset.lightboxSrc;
  lightbox.querySelector("img").alt = button.dataset.lightboxAlt;
  lightbox.querySelector("p").textContent = button.dataset.lightboxAlt;
  lightbox.showModal();
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
