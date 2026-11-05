# App Master DZ — portfolio

Our work in three categories — e-commerce websites, business management platforms and videos — in English (`/en`) and Arabic (`/ar`, right-to-left).

Home → choose a category → choose a project → it opens full screen:
- **Stores** run as themselves from `public/demos/<store>/`.
- **Platforms** link to the live product (ExcellenceSchool → https://excellenteschool.com/).
- **Videos** play in a full-screen player at `/<locale>/watch/<slug>`.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run start
```

Always use the npm scripts: they preload `scripts/exfat-readlink-fix.cjs`, which is needed while the project lives on an exFAT drive (it can be removed on NTFS).

## Edit content

- Projects, names and covers: `src/lib/data.ts`
- Interface text (EN / AR): `src/i18n/dictionaries.ts`
- Colours, type scale, light/dark tokens: `src/app/globals.css`
- Re-import stores and videos from `D:\videos\sites` and `D:\videos\out`: `node scripts/import-work.cjs`

Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS v4.
