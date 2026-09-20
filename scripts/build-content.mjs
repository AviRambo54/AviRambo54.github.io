import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, "..");
const source = JSON.parse(fs.readFileSync(path.resolve(project, "..", "wix-pages.json"), "utf8"));
const assetMap = JSON.parse(fs.readFileSync(path.resolve(project, "..", "asset-map.json"), "utf8")).map;

const navLabels = new Set([
  "דף הבית", "אודות", "תיק עבודות", "AI Generated", "לוגואים", "לקוחות",
  "סרטונים", "מיוחדים", "כמה מילים על...", "צור קשר",
]);

function localize(src) {
  if (!src) return "";
  const original = src.split("/v1/")[0];
  const relative = assetMap[original] || "";
  return relative && fs.existsSync(path.join(project, relative)) ? relative : "";
}

function cleanText(text = "") {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !navLabels.has(line))
    .filter((line) => !line.startsWith("Upgrade your website"))
    .filter((line) => line !== "Upgrade Now")
    .filter((line) => !line.startsWith("אבירם שגב סטודיו לעיצוב גרפי"))
    .join("\n");
}

const sharedImageIds = [
  "7b1559_790073acb35a404282033ce1ca34e377",
  "7b1559_778701ab0ac54b65b794120f6ba3938c",
  "7b1559_9121a27ad2fe4553bd3db7c55c31fa0b",
];

const localVideos = [
  "assets/videos/vim-power-flyer.mp4",
  "assets/videos/herzliya-loves-animals.mp4",
];

function pageImages(page) {
  const seen = new Set();
  return (source[page]?.images || [])
    .filter((image) => image.src && !sharedImageIds.some((id) => image.src.includes(id)))
    .map((image) => ({ alt: image.alt || "עבודה של אבירם שגב", src: localize(image.src) }))
    .filter((image) => image.src && !seen.has(image.src) && seen.add(image.src));
}

const content = {
  brand: {
    logo: "assets/aviram-segev-logo.png",
  },
  contact: {
    phone: "054-8300575",
    email: "aviram.segev@gmail.com",
  },
  home: {
    hero: pageImages("home")[0],
    title: "Hello.",
    caption: "the visual were created using Leonardo.ai software by Aviram Segav",
  },
  about: {
    text: cleanText(source.about.text),
    images: pageImages("about"),
  },
  portfolio: { images: pageImages("portfolio") },
  ai: { images: pageImages("ai") },
  logos: { images: pageImages("logos") },
  clients: { images: pageImages("clients") },
  videos: {
    text: cleanText(source.videos.text),
    images: pageImages("videos").map((image, index) => ({
      ...image,
      video: localVideos[index] || "",
    })),
  },
  specials: {
    text: cleanText(source.specials.text),
    images: pageImages("specials"),
  },
  posts: {
    text: cleanText(source.posts.text),
    images: pageImages("posts"),
  },
};

fs.writeFileSync(path.join(project, "data", "site-content.json"), JSON.stringify(content, null, 2));
