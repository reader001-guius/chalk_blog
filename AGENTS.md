# Repository Guidelines

## Project Structure & Module Organization

This repository is a Jekyll blog template. Content lives in `_posts/` using dated Markdown filenames such as `2017-12-23-introducing-chalk.md`. Page templates are in `_layouts/`, reusable fragments are in `_includes/`, and tag definitions are in `_my_tags/`. Static and processed assets are under `_assets/`: JavaScript in `_assets/javascripts/`, Sass in `_assets/stylesheets/`, icons in `_assets/icons/`, fonts in `_assets/fonts/`, and images in `_assets/images/`. Root HTML/XML files such as `index.html`, `about.html`, `tags.html`, and `feed.xml` define top-level pages and feeds.

## Build, Test, and Development Commands

- `npm run setup`: runs `bin/setup`, installs Bundler dependencies, updates gems, installs Yarn, and installs JavaScript packages into `_assets/yarn`.
- `npm run local`: starts `bundle exec jekyll serve --drafts` for local development.
- `bundle exec jekyll build`: builds the site into `_site/`.
- `bundle exec htmlproofer ./_site --only-4xx --allow-hash-href --assume-extension --check-opengraph --url-ignore "feed.xml"`: validates generated links after a build, matching the CI check.
- `npm run publish`: runs `bin/deploy` to build and deploy to the `gh-pages` branch.

## Coding Style & Naming Conventions

Use two-space indentation in YAML, HTML, Liquid templates, JavaScript, and Sass to match the existing files. Keep Liquid includes small and reusable under `_includes/`; prefer adding a new include over duplicating markup in layouts. Name Sass partials with a leading underscore, for example `_assets/stylesheets/modules/_tags.scss`. Name posts with Jekyll's `YYYY-MM-DD-title.md` pattern and keep front matter keys consistent with existing posts.

## Testing Guidelines

There is no separate unit test suite. Treat the generated site build and link validation as the required test path. Before opening a PR, run `bundle exec jekyll build` and then `htmlproofer` against `_site/`. If you change assets, templates, tags, or configuration, also verify the affected pages with `npm run local`.

## Commit & Pull Request Guidelines

Recent history uses short imperative messages, sometimes with a conventional prefix such as `feat:` or `fix:`. Follow that pattern, for example `fix: add missing tag icon` or `Add article footer include`. Pull requests should describe the user-facing change, list validation commands run, link related issues when available, and include screenshots for visual or layout changes.

## Security & Configuration Tips

Do not commit generated `_site/`, dependency folders, secrets, analytics credentials, or local environment files. Keep site-wide settings in `_config.yml`, and verify `baseurl` before publishing project sites.
