# TickTac

שוק יד-שנייה (P2P) לכרטיסים לאירועי ספורט בישראל — מתחילים עם משחקי בית של ביתר ירושלים. קונה ומוכר מתואמים ישירות (WhatsApp/טלפון), בלי תשלום דרך הפלטפורמה.

**Stack:** Next.js 16.2.7 (App Router) + TypeScript + Tailwind v4, Prisma 7 (`@prisma/adapter-pg`) + Supabase Postgres (חובה connection pooler בפורט 6543, לא 5432!), NextAuth v4, פרוס ב-Vercel, RTL עברית.

לסיכום מלא ומפורט (ארכיטקטורה, מבנה קבצים, מה נבנה, מה עוד לא) ראו **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)**.

## Notes for Claude
1. "Before writing any code, describe your approach and wait for approval. Always ask clarifying questions before writing any code if requirements are ambiguous. After the approach description, add 2-3 simple sentences explaining what this stage/feature does in plain language (no jargon)."

2. "If a task requires changes to more than 3 files, stop and break it into smaller tasks first."

3. "After writing code, list what could break and suggest tests to cover it."

4. "When there's a bug, start by writing a test that reproduces it, then fix it until the test passes."

5. "Every time I correct you, add a new rule to the CLAUDE .md file so it never happens again."

6. "Every meaningful change must be committed to git with a clear message. After completing each development stage, push to GitHub. Never leave working code uncommitted."

7. "Keep README.md, CLAUDE.md, and PROJECT_SUMMARY.md up to date as the project evolves, each according to its own purpose:
   - **README.md** (public-facing): project pitch, live link, tech stack list, quick start. Update when the tech stack, live URL, or what-currently-works summary changes.
   - **CLAUDE.md** (this file): working rules + a short project snapshot at the top. Update the snapshot when the business focus or core stack changes; add new rules per rule 5.
   - **PROJECT_SUMMARY.md** (detailed reference): architecture, file structure, data model, features built, features pending. Update after each meaningful development stage.
   Keep the cross-links between these three files intact."
