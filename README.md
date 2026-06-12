# TickTac — שוק הכרטיסים המשני לאירועי ספורט בישראל

> The central marketplace for buying and selling sports event tickets in Israel.

---

## הבעיה

אוהדים המעוניינים לקנות או למכור כרטיסים לאירועי ספורט נאלצים כיום:

- לחפש בעשרות קבוצות פייסבוק, וואטסאפ וטלגרם
- להתמודד עם מידע מפוזר וחסר אמינות
- לחשוש מהונאות וקונים/מוכרים לא אמינים
- לפספס עסקאות רלוונטיות בגלל חוסר ריכוזיות

## הפתרון

**TickTac** היא פלטפורמה דיגיטלית מרכזית למסחר בכרטיסים לאירועי ספורט בישראל — מקום אחד, בטוח ונוח לקנות ולמכור כרטיסים.

## החזון

להפוך למקום המרכזי למסחר בכרטיסים לאירועי ספורט ובידור בישראל, החל ממשחקי הבית של בית"ר ירושלים ובהמשך לכלל האירועים בארץ.

## סטטוס

> בפיתוח פעיל — גרסה ראשונית חיה ב-production

🔗 **אתר חי:** https://tick-tac-nu.vercel.app

מה כבר עובד: התחברות עם Google, פרופיל משתמש, פרסום כרטיס למכירה, צפייה בכרטיסים זמינים למשחק, ויצירת קשר עם המוכר דרך WhatsApp/טלפון.

לפירוט מלא על הארכיטקטורה, מה נבנה ומה עוד לא — ראו [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md).

## טכנולוגיות

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Deployment:** Vercel

## התחלה מהירה

```bash
npm install
npm run dev
```

פתח את [http://localhost:3000](http://localhost:3000) בדפדפן.

---

© 2026 TickTac. All rights reserved.
