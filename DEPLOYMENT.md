# GitHub Pages deployment

The web app is exported as a static Expo site and published at:

<https://rhytid.github.io/CISC498_-UDepop-/>

## One-time setup

1. In the repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
2. Deploy the Convex backend to a hosted Convex deployment. GitHub Pages cannot reach a local `npx convex dev` server.
3. In **Settings → Secrets and variables → Actions → Variables**, add:
   - Name: `EXPO_PUBLIC_CONVEX_URL`
   - Value: the hosted deployment URL ending in `.convex.cloud`

   This URL is included in the client-side web bundle, so it is public by design. Do not use a local URL such as `127.0.0.1`.

## Publish a branch

- Every push to `main` builds and deploys automatically.
- To publish any other branch, open **Actions → Deploy to GitHub Pages → Run workflow**, select the workflow on `main`, enter the target branch name in **Branch to build and publish**, and run it. The input accepts any existing branch name, such as `development`.

The selected branch is exported with the repository's configured Pages base path. All branch deployments publish to the same Pages URL, so publishing another branch replaces the currently live site; this workflow does not create isolated preview URLs per branch.

To build locally, run `npm run build:web`; the generated static site is written to `dist`.
