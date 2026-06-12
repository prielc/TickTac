# TickTac — סיכום פרויקט

_עודכן: 2026-06-12_

> **עדכונים אחרונים:**
> - **התחברות/הרשמה הופכות לבלעדיות עם Google (OAuth)**: הוסרה התחברות בסיסמה (`CredentialsProvider`, bcrypt) ומסך ההרשמה. `/login` מציג כפתור "התחבר עם Google" בלבד, `/register` מפנה ל-`/login`. משתמש חדש נוצר אוטומטית ב-DB לפי email בכניסה הראשונה. ראו פירוט בסעיף "אימות והתחברות (Google OAuth)" למטה.
> - נוסף **מסך ניהול לאדמין** (`/admin`) עם הגנת הרשאה, ניהול דיווחים/מודעות/משתמשים/דירוגים, ודשבורד עסקי + טכני עם גרפים. פירוט מלא בסעיף "מסך ניהול אדמין" למטה.
> - מספר "כרטיסים זמינים" בדף הבית ובדף המשחק מחושב עכשיו בזמן אמת מסכום שדה `quantity` של המודעות הפעילות ב-DB (במקום ערך קבוע ב-mock data או ספירת שורות מודעות).
> - הוסר התג "נמכר מהר!" מכרטיסי המשחקים בדף הבית, כולל השדה `isSelling` שכבר לא היה בשימוש.

> לכללי עבודה ולתקציר קצר ראו גם [CLAUDE.md](./CLAUDE.md)

## רעיון עסקי
שוק יד-שנייה (P2P) לכרטיסים לאירועי ספורט בישראל. מי שיש לו כרטיס למשחק ולא יכול/רוצה להגיע — יכול לפרסם אותו למכירה. קונים פוטנציאליים רואים את המודעה ויוצרים קשר ישיר עם המוכר (טלפון/WhatsApp).

**מיקוד נוכחי:** משחקי בית של ביתר ירושלים בכדורגל (4 משחקים קבועים, mock data). בהמשך: עוד קבוצות כדורגל → עוד ענפי ספורט ותרבות.

**מודל עסקה:** קונה ↔ מוכר מתואמים ישירות (WhatsApp/טלפון). אין צ'אט פנימי באתר עדיין (אופציה עתידית), אין תשלום דרך הפלטפורמה.

## ארכיטקטורה טכנית
- **Framework:** Next.js 16.2.7 (App Router, Turbopack), TypeScript, Tailwind CSS v4
- **UI/UX:** עברית RTL (`lang="he" dir="rtl"`), פונט Rubik, צבע ראשי צהוב `#F5C100`, רקע לבן עם דפוס נקודות אפורות, mobile-first עם תפריט תחתון קבוע (NavBar)
- **DB:** PostgreSQL בענן Supabase (project: `czqgufsdoqoterqdpaiz`, region `eu-west-3`)
- **ORM:** Prisma 7 עם `@prisma/adapter-pg` (driver adapter, חובה ב-Prisma 7)
- **Auth:** NextAuth v4, Google OAuth provider בלבד (`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`), JWT sessions
- **Deploy:** Vercel, auto-deploy מ-`main` ב-GitHub (`prielc/TickTac`)
- **Build:** `prisma generate && next build` (קריטי — קבצי ה-client המיוצרים לא ב-git)

### נקודה קריטית: Supabase Connection Pooler
החיבור הישיר לפורט 5432 (`db.czqgufsdoqoterqdpaiz.supabase.co`) **לא עובד מ-Vercel serverless** (שגיאת P1001). חובה להשתמש ב-pooler:
```
postgresql://postgres.czqgufsdoqoterqdpaiz:[PASSWORD]@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
```
מוגדר כ-`DATABASE_URL` ב-Vercel env vars (Production + Preview).

## מבנה נתונים
- **Games (משחקים):** קבועים ב-`lib/mock-data.ts` — לא ב-DB. כל משחק: קבוצות, לוגואים (`public/teams/`), תאריך, אצטדיון, תחרות.
- **Listings (כרטיסים למכירה):** ב-DB (Prisma model `Listing`) — gameId, section, row, seats, price, quantity, phone, isAvailable.
- **User:** email, name, image (מ-Google), phone (אופציונלי — מתבקש לאחר הרשמה דרך באנר ב-`/profile`), **role** (`"user"`/`"admin"`, ברירת מחדל `"user"`), **isBanned** (Boolean, ברירת מחדל `false` — משתמש חסום לא יכול להתחבר). שדה `password` עדיין קיים בסכמה (legacy) אך לא בשימוש.
- **Report (דיווחים):** ב-DB (Prisma model `Report`) — reporterId, listingId, reason, description, **status** (`"open"`/`"resolved"`, ברירת מחדל `"open"`), createdAt. סיבות אפשריות מוגדרות ב-`lib/report-reasons.ts`.
- **Rating (דירוגים):** ב-DB (Prisma model `Rating`) — raterId, ratedUserId, listingId, score (1-5), comment, createdAt/updatedAt. ייחודי לכל זוג (raterId, listingId) — דירוג חוזר על אותה מודעה מעדכן (upsert) ולא יוצר רשומה נוספת.

## מסכים שנבנו
| מסך | נתיב | תיאור |
|-----|------|-------|
| בית | `/` | רשימת משחקים קרובים (GameCard עם לוגואים אמיתיים) |
| משחק | `/games/[id]` | פרטי משחק + כרטיסים זמינים מה-DB |
| כניסה / הרשמה | `/login` | כפתור "התחבר עם Google" בלבד — הרשמה אוטומטית בכניסה הראשונה |
| הרשמה (legacy) | `/register` | מפנה (redirect) ל-`/login` |
| פרסום כרטיס | `/sell` | בחירת משחק, יציע, שורה/מקומות, מחיר/כמות (טלפון נלקח אוטומטית מהפרופיל) |
| פרופיל | `/profile` | שם, אימייל, טלפון של המשתמש המחובר, עם אפשרות עריכה (שם+טלפון, inline) + כפתור התנתקות. דורש התחברות (אחרת מפנה ל-`/login`). אם אין טלפון שמור — באנר שמבקש להשלים אותו |
| המודעות שלי | `/profile/listings` | רשימת כל המודעות שפרסם המשתמש המחובר, עם תגית סטטוס (זמין/נמכר) וכפתור טוגל לסימון כנמכר/זמין |
| חיפוש | `/search` | שדה חיפוש שמסנן את רשימת המשחקים לפי קבוצה/יריבה/אצטדיון/תחרות, עם הודעת "לא נמצאו תוצאות" וקישור לבית |
| ניהול (אדמין) | `/admin` | דשבורד עסקי: כרטיסי סיכום + גרפים. נגיש רק ל-`role: admin` |
| ניהול דיווחים | `/admin/reports` | רשימת כל הדיווחים, סימון טופל/פתוח |
| ניהול מודעות | `/admin/listings` | כל המודעות (כולל נמכר/מוסתר), הסתרה/הצגה/מחיקה |
| ניהול משתמשים | `/admin/users` | רשימת משתמשים + סטטיסטיקות, חסימה, קידום/הורדה מאדמין, מחיקה |
| ניהול דירוגים | `/admin/ratings` | רשימת כל הדירוגים וההערות, מחיקת דירוג |
| דשבורד טכני | `/admin/technical` | בריאות חיבור ל-DB + גידול בטבלאות (7/30 יום) |

## פיצ'רים מרכזיים שמומשו
1. **זרימת מוכר:** התחברות עם Google → פרסום כרטיס → נשמר ב-Supabase
2. **זרימת קונה (Stage 4a):** לחיצה על "קנה" פותחת modal עם כפתורי WhatsApp (הודעה מוכנה עם פרטי הכרטיס) ושיחה — `app/components/ContactModal.tsx`
3. **לוגואים אמיתיים** לכל הקבוצות (הורדו מ-Wikipedia ל-`public/teams/`)
4. **ולידציה** טלפון ישראלי — `lib/validation.ts` (`isValidIsraeliPhone`), משותף ל-client ו-API
5. **ניווט:** NavBar קבוע למטה; אייקון הפרופיל (עם שם המשתמש) מוביל לדף `/profile` ולא מתנתק ישירות; אייקון "חיפוש" מוביל לדף `/search`
6. **עריכת פרופיל:** בדף `/profile` כפתור "ערוך" הופך את התצוגה לטופס inline לעריכת שם וטלפון (`app/components/ProfileDetails.tsx`, `PATCH /api/profile`); לאחר שמירה השם מתעדכן מיידית גם ב-NavBar (session update + `auth.ts` callbacks)
7. **סימון מודעה כנמכרת:** בדף `/profile/listings` ("המודעות שלי") כל מוכר רואה את המודעות שפרסם, עם כפתור טוגל "סמן כנמכר"/"סמן כזמין" (`app/components/MyListingItem.tsx`, `PATCH /api/listings/[id]`, מעדכן `isAvailable`); מודעה שסומנה כנמכרת לא מופיעה יותר בדף המשחק לקונים
8. **פילטרים בדף המשחק:** `app/components/GameListings.tsx` — מיון כרטיסים לפי מחיר (מהזול ליקר/מהיקר לזול) וסינון לפי יציע/כמות, מתוך הערכים שקיימים בפועל ברשימת הכרטיסים הזמינים
9. **חיפוש משחקים:** `/search` — סינון client-side של `lib/mock-data.ts` לפי שם קבוצה/יריבה/אצטדיון/תחרות; תשתית שתקבל ערך גדול יותר ככל שיתווספו עוד משחקים/קבוצות
10. **דיווח על מודעות חשודות:** קישור "דיווח על מודעה" בכל `ListingCard` פותח `app/components/ReportModal.tsx`; משתמש לא מחובר מופנה להתחברות, משתמש מחובר בוחר סיבה (מתוך `lib/report-reasons.ts`) ומוסיף תיאור חופשי, ושולח ל-`POST /api/reports`. ה-API דורש התחברות, מונע דיווח על מודעה של המשתמש עצמו, ושומר את הדיווח ב-DB (`Report`) לבדיקה ידנית — אין כרגע מסך ניהול דיווחים
11. **דירוג משתמשים:** כפתור "דרגו את המוכר" בתוך `ContactModal` פותח `app/components/RatingModal.tsx` — משתמש לא מחובר מופנה להתחברות, משתמש מחובר בוחר 1-5 כוכבים + הערה חופשית ושולח ל-`POST /api/ratings` (דורש התחברות, מונע דירוג עצמי, upsert לפי raterId+listingId). הדירוג הממוצע + מספר הדירוגים של כל מוכר מחושב ב-`lib/ratings.ts` (`getSellerRatings`) ומוצג כתג `RatingBadge` (★ ממוצע (כמות)) על כל מודעה שלו בדף המשחק — מבוסס אמון, ללא אימות שהתבצעה עסקה בפועל
12. **מסך ניהול אדמין (`/admin`):** ראו פירוט מלא בסעיף הבא

## אימות והתחברות (Google OAuth)
- **ספק יחיד**: `GoogleProvider` ב-`auth.ts`, מוגדר עם `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (env vars, גם ב-Vercel). Redirect URIs רשומים ב-Google Cloud Console: `/api/auth/callback/google` עבור localhost ו-production.
- **find-or-create לפי email**: ב-`signIn` callback — אם קיים `User` עם אותו email, מתחברים לחשבון הקיים (משמרים `role`/`isBanned`/מודעות/דירוגים); אם לא קיים, נוצר `User` חדש (`role: "user"`, `isBanned: false`, `emailVerified` מסומן אוטומטית).
- **חסימה**: משתמש עם `isBanned: true` נחסם בכניסה (signIn מחזיר `false`).
- **`/login`**: כפתור "התחבר עם Google" יחיד. **`/register`**: redirect ל-`/login` (נשאר לתאימות לקישורים ישנים).
- **טלפון**: Google לא מספק מספר טלפון; משתמש חדש נכנס בלי טלפון, ובדף `/profile` מוצג באנר שמבקש להשלים אותו (חובה כדי שקונים יוכלו ליצור קשר בוואטסאפ על המודעות שלו).

## מסך ניהול אדמין (`/admin`)

### הרשאות
- שדה `role` ("user"/"admin") ושדה `isBanned` (Boolean) על `User`. `role` ו-`isBanned` נטענים ל-session/JWT (`auth.ts`, `types/next-auth.d.ts`).
- `lib/admin.ts` (`requireAdmin()`) — מחזיר session רק אם `role === "admin"`, אחרת `null`.
- `app/admin/layout.tsx` — מפנה ל-`/` כל משתמש שאינו admin; כולל ניווט בין כל מסכי הניהול.
- משתמש חסום (`isBanned: true`) לא יכול להתחבר (`auth.ts` → `authorize()`).
- כדי לקבל הרשאת אדמין יש לעדכן ידנית את `role` של המשתמש ב-DB (אין מסך הרשמה לאדמין).

### מסכי ניהול
- **דיווחים** (`/admin/reports`, `app/api/admin/reports/[id]/route.ts`): רשימת כל הדיווחים עם פרטי המודעה/מוכר/מדווח, וכפתור החלפת `status` (open/resolved) דרך `ReportStatusButton`.
- **מודעות** (`/admin/listings`, `app/api/admin/listings/[id]/route.ts`): כל המודעות במערכת (כולל מוסתרות), עם `ListingActions` להחלפת `isAvailable` (הסתר/הצג) ולמחיקה מוחלטת (cascade למחיקת דיווחים/דירוגים קשורים).
- **משתמשים** (`/admin/users`, `app/api/admin/users/[id]/route.ts`): רשימת משתמשים + מספר מודעות + דירוג ממוצע, עם `UserActions` לחסימה/שחרור, קידום/הורדה מ-admin, ומחיקה. אדמין לא יכול לבצע פעולות אלו על עצמו (הגנה ב-API לפי השוואת email).
- **דירוגים** (`/admin/ratings`, `app/api/admin/ratings/[id]/route.ts`): רשימת כל הדירוגים/ההערות עם `DeleteRatingButton` למחיקה.

### דשבורד עסקי (`/admin`, `lib/admin-stats.ts`)
גרפים מבוססי `recharts`: כרטיסי סיכום (סה"כ משתמשים/מודעות פעילות/דיווחים פתוחים/דירוגים), הרשמות יומיות ל-30 יום (`SignupsChart`), סטטוס מודעות זמין/נמכר (`ListingsStatusChart`), דיווחים לפי סיבה (`ReportsByReasonChart`), התפלגות ציוני דירוג (`RatingDistributionChart`).

### דשבורד טכני (`/admin/technical`)
בריאות חיבור ל-DB (`SELECT 1` + latency) וגידול בכל טבלה (סה"כ / 7 ימים / 30 ימים) — ללא תלות בשירות חיצוני. הרחבה אפשרית בעתיד: הפעלת Vercel Analytics / Speed Insights.

## מבנה קבצים מרכזי
```
app/
  page.tsx                  # בית
  games/[id]/page.tsx       # פרטי משחק
  search/page.tsx           # חיפוש משחקים
  sell/page.tsx             # פרסום כרטיס
  login/page.tsx            # כפתור "התחבר עם Google"
  register/page.tsx         # redirect ל-/login
  api/auth/                 # NextAuth (Google provider)
  api/listings/             # POST listing
  profile/page.tsx          # פרופיל משתמש + עריכה + התנתקות
  profile/listings/page.tsx # המודעות שלי + סימון כנמכר/זמין
  api/profile/route.ts     # PATCH עריכת שם/טלפון
  api/listings/[id]/route.ts # PATCH סימון מודעה כנמכרת/זמינה
  api/reports/route.ts     # POST דיווח על מודעה
  api/ratings/route.ts     # POST דירוג מוכר
  components/               # GameCard, ListingCard, GameListings, ContactModal, ReportModal, RatingModal, RatingBadge, NavBar, SignOutButton, ProfileDetails, MyListingItem
  components/admin/         # SignupsChart, ListingsStatusChart, ReportsByReasonChart, RatingDistributionChart, ReportStatusButton, ListingActions, UserActions, DeleteRatingButton
  admin/                     # layout.tsx (הגנת admin + ניווט) + page.tsx (דשבורד), reports/, listings/, users/, ratings/, technical/
  api/admin/                 # reports/[id], listings/[id], users/[id], ratings/[id] — endpoints מוגני requireAdmin()
lib/
  mock-data.ts              # משחקים (קבוע)
  prisma.ts                 # Prisma singleton + adapter
  validation.ts             # ולידציה משותפת
  validation.test.ts        # בדיקות יחידה (Vitest) ל-isValidIsraeliPhone
  report-reasons.ts         # רשימת סיבות דיווח משותפת ל-API ול-UI
  ratings.ts                # חישוב ממוצע/כמות דירוגים למוכר + ולידציית ציון
  admin.ts                  # requireAdmin() — guard להרשאת אדמין
  admin-stats.ts            # שאילתות לדשבורד עסקי/טכני
prisma/schema.prisma         # User (role, isBanned), Account, Session, Listing, Report (status), Rating
types/next-auth.d.ts         # הרחבת טיפוסי NextAuth עם role
public/teams/                # לוגואי קבוצות
```

## בדיקות
- **Vitest** מותקן (`npm test`). כרגע יש בדיקות יחידה ל-`isValidIsraeliPhone` ב-`lib/validation.test.ts` — מכסות פורמטים תקינים (עם מקף/רווח/בלי מפריד) ולא תקינים (קידומת בינלאומית, אורך שגוי, קווי, אותיות, ריק).

## סטטוס נוכחי
✅ פרוס ועובד ב-production: https://tick-tac-nu.vercel.app
✅ End-to-end נבדק: הרשמה → התחברות → פרסום כרטיס → הופעה בדף המשחק → יצירת קשר עם מוכר

## מה עוד לא נבנה (רעיונות להמשך)
- הצגת הערות הדירוג (comments) למוכר — כרגע רק ממוצע+כמות מוצגים, ההערות נשמרות ב-DB בלבד
- צ'אט פנימי באתר
- התראות (push/אימייל על מודעות חדשות לפי קריטריונים)
- הוספת משחקים/קבוצות/ענפי ספורט נוספים (כרגע רק ביתר ירושלים, mock data)
- היסטוריית מודעות בדף `/profile`
