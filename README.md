# Heart Fill

A minimal React app: tap the heart to fill it with red (10 taps), then see an image revealed inside the heart shape. Built with Vite, React, Tailwind CSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

## Replace the image

- **Default:** The app uses `public/heart-image.svg` (a placeholder).
- **Your image:** Add your image as `public/heart-image.jpg` (or `.png`), then in `src/App.tsx` change the `href` from `/heart-image.svg` to `/heart-image.jpg`.

## Deploy on Vercel

1. Push this repo to GitHub (or connect your repo in Vercel).
2. In [Vercel](https://vercel.com), import the project. It will detect Vite and use the existing `vercel.json`.
3. Deploy. The SPA rewrite in `vercel.json` serves `index.html` for all routes.

No extra config is required; the project is set up for Vercel.
