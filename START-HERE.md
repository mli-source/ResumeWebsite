# Martin Li website — complete source

This export contains the latest published website source and all website assets, including photos, launch video, CAD downloads, OpenRocket files, résumé, and robotics report.

## Run locally

Install Node.js 22.13 or newer, unzip this folder, and open a terminal inside it.

```sh
npm ci
npx vite
```

Open the local address printed by Vite.

## Production build

```sh
npx vinext build
npx vinext start
```

The original npm scripts are also included; their shell wrappers require Bash and GNU timeout. The direct commands above avoid those wrappers.

## Where to edit

- `app/page.tsx`: homepage and About content
- `app/globals.css`: shared styling and homepage composition
- `app/projects/`: rocket, robotics, and Antigua pages
- `app/work-experience/trs/page.tsx`: paid work experience
- `components/rocket-viewer.tsx`: interactive 3D viewer
- `lib/rocket-model.ts`: rocket geometry, materials, and separation behavior
- `public/`: photos, video, models, and downloadable documents

The website uses React, TypeScript, Vinext/Vite, and Three.js. Dependencies are pinned by package-lock.json and installed with npm ci; node_modules and build output are intentionally excluded. No account credentials or Git history are included. Hosting on another provider requires its compatible runtime/deployment configuration; this is not a single HTML file.
