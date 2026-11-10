# blut Studio

The place where the blut team edits the website, built with Sanity.

- Online: https://blut-agency.sanity.studio (after `npm run deploy`)
- Locally: `npm install`, then `npm run dev` and open http://localhost:3333

## How content reaches the site

1. Someone edits in the studio and presses Publish.
2. The site's build runs `scripts/sanity-sync.mjs`. It copies all published
   content into `src/content/cms-content.json` and all pictures into
   `public/images/cms/`.
3. Visitors only ever load files from blut.agency, never from Sanity.

The sync only runs when the site has `SANITY_PROJECT_ID` set (and
`SANITY_DATASET`, default `site`). Without it, the site uses the JSON in the repo.

## First import

`npm run import` copies today's cases from `cms-content.json` into the
dataset. It uses your Sanity login and stops if cases already exist.

## What lives where

- Words, pictures, lists, links, video and audio file paths: the studio.
- Layout, colours per page, fonts, spacing and motion: the site's code.
