# Aviram Segev Portfolio

אתר סטטי עצמאי שנבנה מחדש על בסיס אתר Wix הקיים, ומוכן לפרסום באמצעות GitHub Pages.

## הפעלה מקומית

```bash
python3 -m http.server 8080
```

לאחר מכן פותחים `http://localhost:8080`.

## פרסום ב-GitHub Pages

1. מעלים את תוכן התיקייה לשורש מאגר GitHub.
2. נכנסים ל-Settings → Pages.
3. בוחרים Deploy from a branch, את הענף `main` ואת התיקייה `/ (root)`.
4. לאחר שהאתר זמין בכתובת GitHub, מחברים את הדומיין דרך Settings → Pages → Custom domain.

הפרויקט מוגדר מראש לדומיין `aviram-segev.com` באמצעות קובץ `CNAME`.

## טופס יצירת קשר

הטופס פותח הודעת דוא״ל חדשה לכתובת `aviram.segev@gmail.com`, ולכן אינו דורש שרת או שירות חיצוני.

## עריכת טקסטים ותמונות

המאגר כולל קובץ `.pages.yml` מוכן ל-Pages CMS. לאחר העלאת המאגר ל-GitHub, ניתן להיכנס אל `https://app.pagescms.org`, לבחור את המאגר ולערוך את תוכן האתר דרך ממשק חזותי. הוראות מלאות נמצאות בקובץ `EDITING.md`.
