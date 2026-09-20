import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = {
  "index.html": ["home", "אבירם שגב — מעצב גרפי וביצועיסט"],
  "about.html": ["about", "אודות — אבירם שגב"],
  "portfolio.html": ["portfolio", "תיק עבודות — אבירם שגב"],
  "ai-generated.html": ["ai", "AI Generated — אבירם שגב"],
  "logos.html": ["logos", "לוגואים — אבירם שגב"],
  "clients.html": ["clients", "לקוחות — אבירם שגב"],
  "videos.html": ["videos", "סרטונים — אבירם שגב"],
  "specials.html": ["specials", "מיוחדים — אבירם שגב"],
  "posts.html": ["posts", "כמה מילים על — אבירם שגב"],
  "contact.html": ["contact", "צור קשר — אבירם שגב"],
};

function html(page, title) {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="אבירם שגב — סטודיו לעיצוב גרפי, מיתוג, פרינט ודיגיטל.">
  <meta name="theme-color" content="#ffffff">
  <title>${title}</title>
  <link rel="stylesheet" href="css/style.css">
  <script type="module" src="js/site.js"></script>
</head>
<body data-page="${page}">
  <a class="skip-link" href="#content">דילוג לתוכן</a>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="אבירם שגב — מעצב">
      <img class="brand-portrait" data-brand="portrait" alt="">
      <span class="brand-copy">
        <strong data-brand="name">אבירם שגב</strong>
        <span data-brand="tagline">מעצב</span>
      </span>
    </a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="main-menu">תפריט</button>
    <nav id="main-menu" class="main-nav" aria-label="ניווט ראשי">
      <a data-nav="home" href="index.html">דף הבית</a>
      <a data-nav="about" href="about.html">אודות</a>
      <a data-nav="portfolio" href="portfolio.html">תיק עבודות</a>
      <a data-nav="ai" href="ai-generated.html"><span dir="ltr">AI Generated</span></a>
      <a data-nav="logos" href="logos.html">לוגואים</a>
      <a data-nav="clients" href="clients.html">לקוחות</a>
      <a data-nav="videos" href="videos.html">סרטונים</a>
      <a data-nav="specials" href="specials.html">מיוחדים</a>
      <a data-nav="posts" href="posts.html">כמה מילים על...</a>
      <a data-nav="contact" href="contact.html">צור קשר</a>
    </nav>
  </header>
  <main id="content" tabindex="-1"></main>
  <footer class="site-footer">
    <span>אבירם שגב סטודיו לעיצוב גרפי</span>
    <span aria-hidden="true">|</span>
    <a data-contact="phone"></a>
    <span aria-hidden="true">|</span>
    <a data-contact="email"></a>
  </footer>
  <dialog class="lightbox" aria-label="תצוגת תמונה">
    <button class="lightbox-close" type="button" aria-label="סגירה">×</button>
    <img alt="">
    <p></p>
  </dialog>
</body>
</html>`;
}

for (const [file, [page, title]] of Object.entries(pages)) {
  fs.writeFileSync(path.join(root, file), html(page, title));
}
