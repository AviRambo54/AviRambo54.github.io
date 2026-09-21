const content = await fetch("data/site-content.json?v=20260921a", { cache: "no-store" }).then((response) => {
  if (!response.ok) throw new Error("לא ניתן לטעון את תוכן האתר");
  return response.json();
});

const page = document.body.dataset.page;
const main = document.querySelector("main");

document.querySelector('[data-brand="logo"]').src = content.brand.logo;
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
  const [title, lead, ...body] = paragraphs(content.about.text);
  main.innerHTML = `<section class="about">
    <div class="about-photo"><img src="${content.about.images[0].src}" alt="${escapeHtml(content.about.images[0].alt)}"></div>
    <div class="about-copy">
      <span class="eyebrow">אודות</span>
      <h1>${escapeHtml(title)}</h1>
      <p class="about-lead">${escapeHtml(lead)}</p>
      ${body.map((p, index) => `<p${index === body.length - 1 ? ' class="about-closing"' : ""}>${escapeHtml(p)}</p>`).join("")}
    </div>
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
    { title: "VIM POWER FLYER", media: content.videos.images[0], copy: text.slice(first + 1, second) },
    { title: "Herzliya Loves Animals", media: content.videos.images[1], copy: text.slice(second + 1) },
  ];
  main.innerHTML = `<h1 class="page-title">סרטונים</h1><section class="longform">
    ${cards.map((card) => `<article class="feature">
      <video class="feature-video" controls preload="metadata" poster="${escapeHtml(card.media.src)}">
        <source src="${escapeHtml(card.media.video)}" type="video/mp4">
        הדפדפן שלך אינו תומך בהפעלת וידאו.
      </video>
      <div class="feature-copy"><h2>${escapeHtml(card.title)}</h2>${card.copy.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>
    </article>`).join("")}
  </section>`;
}

function renderSpecials() {
  const ps = paragraphs(content.specials.text);
  const rbStart = ps.findIndex((line) => line.includes("RB-DOORS"));
  const landLines = rbStart > 0 ? ps.slice(0, rbStart) : ps;
  const rbLines = rbStart > 0 ? ps.slice(rbStart) : [];
  const landIntro = landLines.length > 1 ? [`${landLines[0]} ${landLines[1]}`, ...landLines.slice(2)] : landLines;
  const copy = (lines) => lines.map((line, index) => `<p${index === 0 ? ' class="special-lead"' : ""}>${escapeHtml(line)}</p>`).join("");
  const logo = '<img class="ads-world-logo" src="assets/ads-of-the-world-logo.png" alt="Ads of the World">';
  const landAlts = ["קמפיין Land Rover Defender — אריה", "קמפיין Land Rover Defender — פיל"];
  main.innerHTML = `<h1 class="page-title">מיוחדים</h1><section class="specials-showcase" dir="ltr">
    <article class="special-project">
      <div class="special-copy">${logo}${copy(landIntro)}</div>
      <div class="special-gallery special-gallery-pair">
        ${content.specials.images.slice(0, 2).map((image, index) => `<figure class="special-artwork"><img src="${escapeHtml(image.src)}" alt="${landAlts[index]}" loading="lazy"></figure>`).join("")}
      </div>
    </article>
    <article class="special-project">
      <div class="special-copy">${logo}${copy(rbLines)}</div>
      <div class="special-gallery special-gallery-single">
        <figure class="special-artwork"><img src="${escapeHtml(content.specials.images[2].src)}" alt="מודעת RB-Doors" loading="lazy"></figure>
      </div>
    </article>
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
    ${posts.map((post, index) => {
      const image = index === 3
        ? { src: "assets/junkyard-yad2-campaign.jpg", alt: "שילוט לקמפיין ג'אנק יארד של יד2" }
        : content.posts.images[index];
      return `<article class="post">
      <div class="post-media" style="background:#fff">${image ? `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || post.title)}" loading="lazy" style="background:#fff">` : ""}</div>
      <div class="post-copy"><span class="post-number">${String(index + 1).padStart(2, "0")}</span><h2>${escapeHtml(post.title)}</h2>${post.copy.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>
    </article>`;
    }).join("")}
  </section>`;
}

function renderContact() {
  main.innerHTML = `<section class="contact-layout">
    <form class="contact-form" action="https://formsubmit.co/${content.contact.email}" method="POST" novalidate>
      <label for="name">שם *</label><input id="name" name="name" required autocomplete="name">
      <label for="email">אימייל *</label><input id="email" name="email" type="email" required autocomplete="email">
      <label for="subject">נושא</label><input id="subject" name="subject">
      <label for="message">הודעה *</label><textarea id="message" name="message" required></textarea>
      <input class="honeypot" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="_subject" value="פנייה חדשה מאתר אבירם שגב">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_captcha" value="false">
      <input type="hidden" name="_url" value="https://aviram-segev.com/contact.html">
      <button type="submit">שליחה</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
    <div class="contact-copy">
      <p>יש לך תגובה? שאלה?<br>או רק רצית להגיד שלום&nbsp; : )</p>
      <p>תרגיש/י חופשי ליצור קשר.</p>
      <div class="contact-direct"><a href="${phoneLink}">${content.contact.phone}</a><a href="mailto:${content.contact.email}">${content.contact.email}</a></div>
    </div>
  </section>`;
  main.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    const status = form.querySelector(".form-status");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    button.disabled = true;
    button.textContent = "שולח...";
    status.className = "form-status";
    status.textContent = "";
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${content.contact.email}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const result = await response.json();
      const accepted = result.success === true || result.success === "true";
      if (!response.ok || !accepted) throw new Error(result.message || "send failed");
      form.reset();
      status.classList.add("is-success");
      status.textContent = "תודה, ההודעה נשלחה בהצלחה.";
    } catch {
      status.classList.add("is-error");
      status.innerHTML = `לא הצלחנו לשלוח כרגע. אפשר לשלוח ישירות ל־<a href="mailto:${content.contact.email}">${content.contact.email}</a>.`;
    } finally {
      button.disabled = false;
      button.textContent = "שליחה";
    }
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
