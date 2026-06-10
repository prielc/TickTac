# TickTac — סיכום פרויקט

_עודכן: 2026-06-10_

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
- **Auth:** NextAuth v4, Credentials provider (email+password, bcrypt), JWT sessions
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
- **User:** email, password (hash), name, **phone (חובה בהרשמה)**.

## מסכים שנבנו
| מסך | נתיב | תיאור |
|-----|------|-------|
| בית | `/` | רשימת משחקים קרובים (GameCard עם לוגואים אמיתיים) |
| משחק | `/games/[id]` | פרטי משחק + כרטיסים זמינים מה-DB |
| הרשמה | `/register` | שם, אימייל, טלפון (ולידציה client+server), סיסמה |
| כניסה | `/login` | אימייל + סיסמה |
| פרסום כרטיס | `/sell` | בחירת משחק, יציע, שורה/מקומות, מחיר/כמות (טלפון נלקח אוטומטית מהפרופיל) |
| פרופיל | `/profile` | שם, אימייל, טלפון של המשתמש המחובר, עם אפשרות עריכה (שם+טלפון, inline) + כפתור התנתקות. דורש התחברות (אחרת מפנה ל-`/login`) |
| המודעות שלי | `/profile/listings` | רשימת כל המודעות שפרסם המשתמש המחובר, עם תגית סטטוס (זמין/נמכר) וכפתור טוגל לסימון כנמכר/זמין |

## פיצ'רים מרכזיים שמומשו
1. **זרימת מוכר:** הרשמה → פרסום כרטיס → נשמר ב-Supabase
2. **זרימת קונה (Stage 4a):** לחיצה על "קנה" פותחת modal עם כפתורי WhatsApp (הודעה מוכנה עם פרטי הכרטיס) ושיחה — `app/components/ContactModal.tsx`
3. **לוגואים אמיתיים** לכל הקבוצות (הורדו מ-Wikipedia ל-`public/teams/`)
4. **ולידציה מלאה** בהרשמה (שם, אימייל, טלפון ישראלי, סיסמה) — `lib/validation.ts` משותף ל-client ו-API
5. **ניווט:** NavBar קבוע למטה, "חיפוש" מסומן כ-"בקרוב" (מושבת); אייקון הפרופיל (עם שם המשתמש) מוביל לדף `/profile` ולא מתנתק ישירות
6. **עריכת פרופיל:** בדף `/profile` כפתור "ערוך" הופך את התצוגה לטופס inline לעריכת שם וטלפון (`app/components/ProfileDetails.tsx`, `PATCH /api/profile`); לאחר שמירה השם מתעדכן מיידית גם ב-NavBar (session update + `auth.ts` callbacks)
7. **סימון מודעה כנמכרת:** בדף `/profile/listings` ("המודעות שלי") כל מוכר רואה את המודעות שפרסם, עם כפתור טוגל "סמן כנמכר"/"סמן כזמין" (`app/components/MyListingItem.tsx`, `PATCH /api/listings/[id]`, מעדכן `isAvailable`); מודעה שסומנה כנמכרת לא מופיעה יותר בדף המשחק לקונים
8. **פילטרים בדף המשחק:** `app/components/GameListings.tsx` — מיון כרטיסים לפי מחיר (מהזול ליקר/מהיקר לזול) וסינון לפי יציע/כמות, מתוך הערכים שקיימים בפועל ברשימת הכרטיסים הזמינים

## מבנה קבצים מרכזי
```
app/
  page.tsx                  # בית
  games/[id]/page.tsx       # פרטי משחק
  sell/page.tsx             # פרסום כרטיס
  login/, register/         # auth pages
  api/auth/                 # NextAuth + register endpoint
  api/listings/             # POST listing
  profile/page.tsx          # פרופיל משתמש + עריכה + התנתקות
  profile/listings/page.tsx # המודעות שלי + סימון כנמכר/זמין
  api/profile/route.ts     # PATCH עריכת שם/טלפון
  api/listings/[id]/route.ts # PATCH סימון מודעה כנמכרת/זמינה
  components/               # GameCard, ListingCard, GameListings, ContactModal, NavBar, SignOutButton, ProfileDetails, MyListingItem
lib/
  mock-data.ts              # משחקים (קבוע)
  prisma.ts                 # Prisma singleton + adapter
  validation.ts             # ולידציה משותפת
  validation.test.ts        # בדיקות יחידה (Vitest) ל-isValidIsraeliPhone
prisma/schema.prisma         # User, Account, Session, Listing
public/teams/                # לוגואי קבוצות
```

## בדיקות
- **Vitest** מותקן (`npm test`). כרגע יש בדיקות יחידה ל-`isValidIsraeliPhone` ב-`lib/validation.test.ts` — מכסות פורמטים תקינים (עם מקף/רווח/בלי מפריד) ולא תקינים (קידומת בינלאומית, אורך שגוי, קווי, אותיות, ריק).

## סטטוס נוכחי
✅ פרוס ועובד ב-production: https://tick-tac-nu.vercel.app
✅ End-to-end נבדק: הרשמה → התחברות → פרסום כרטיס → הופעה בדף המשחק → יצירת קשר עם מוכר

## מה עוד לא נבנה (רעיונות להמשך)
- חיפוש (כרגע מושבת, "בקרוב")
- דיווח על משתמשים/מודעות חשודים
- דירוג משתמשים (אמון בין קונה למוכר)
- צ'אט פנימי באתר
- התראות (push/אימייל על מודעות חדשות לפי קריטריונים)
- הוספת משחקים/קבוצות/ענפי ספורט נוספים (כרגע רק ביתר ירושלים, mock data)
- היסטוריית מודעות בדף `/profile`
