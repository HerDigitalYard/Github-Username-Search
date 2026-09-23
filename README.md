# GitHub Username Search

Search GitHub profiles and public repositories with at least one star or fork.
Built with React, Vite, and Tailwind CSS; hosted on GitHub Pages.

## Development

Use Node.js 24 LTS (`nvm use`) and npm.

```sh
npm ci
npm start
```

Open the local URL printed by Vite. Searches use GitHub's public API without a token.
GitHub's unauthenticated rate limits apply; the app displays an error when the limit is reached.

## Validation

```sh
npm run check
npm audit --audit-level=low
```

`check` runs ESLint, Vitest regression tests, and the production build. CI runs the
same checks on pushes, pull requests, and weekly. Dependabot checks npm dependencies
and GitHub Actions weekly.

## Deployment

```sh
npm run deploy
```

This builds into `build/` and publishes it to the `gh-pages` branch using your Git
credentials. Configure GitHub Pages to serve that branch. The Vite base path is
`/Github-Username-Search/`; update `vite.config.js` if the repository name changes.
Use `npm run preview` to check the production build locally.

The build and test tooling replaces the old Create React App dependency tree.
Runtime requests use browser `fetch`; no API secrets belong in this client app.
