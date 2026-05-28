# ⚡ Lighthouse Site Scanner

Crawl a website and run Google Lighthouse on every page. See performance, accessibility, best practices, and SEO scores — plus key metrics (LCP, TBT, CLS) — all in your terminal.

## Usage

```bash
node index.js <url> [options]
```

### Examples

```bash
node index.js https://example.com
node index.js https://example.com -c 5 --all
```

### Options

| Flag | Description | Default |
|---|---|---|
| `-c`, `--concurrency=N` | Number of parallel Lighthouse runs | 3 |
| `-a`, `--all` | Show all results | top 15 only |
| `-h`, `--help` | Show help | |

## How it works

1. **Crawl** — tries `sitemap.xml` first, falls back to scraping `<a>` links (max 200 pages)
2. **Scan** — launches headless Chromium (via Puppeteer) and runs Lighthouse on each page
3. **Display** — prints a table, bar charts, category averages, and any failures

## Example output

```
  ⚡ Lighthouse Site Scanner
 28/05/2026, 08:30:00
 https://example.com

- Discovering pages...
✔ Discovered 3 pages
- Scanning 0/3
✔ Completed 3/3 scans
┌──────────────────────┬───────┬──────┬──────┬────┬─────┬──────┬─────┬──────┐
│ URL                  │ Score │ Perf │ A11y │ BP │ SEO │ LCP  │ TBT │ CLS  │
├──────────────────────┼───────┼──────┼──────┼────┼─────┼──────┼─────┼──────┤
│ /                    │ A     │ 100  │ 100  │ 93 │ 80  │ 769  │ 0   │ 0.00 │
│ /about               │ B     │ 85   │ 92   │ 90 │ 100 │ 1200 │ 50  │ 0.02 │
│ /contact             │ C     │ 72   │ 88   │ 78 │ 90  │ 2100 │ 180 │ 0.15 │
└──────────────────────┴───────┴──────┴──────┴────┴─────┴──────┴─────┴──────┘

  ████████████████████ 100%  /
  █████████████████░░░ 85%   /about
  ███████████████░░░░░ 72%   /contact

  ████████████████████ 85%  Performance
  ████████████████████ 93%  Accessibility
  ██████████████████░░ 87%  Best Practices
  ██████████████████░░ 90%  SEO
```

## Install

```bash
git clone https://github.com/scott-cole/lighthouse-runner.git
cd lighthouse-runner
npm install
```

No Chrome installation required — Puppeteer bundles its own Chromium.

## Tech

- [Lighthouse](https://github.com/GoogleChrome/lighthouse) — Google's page quality auditing engine
- [Puppeteer](https://pptr.dev/) — bundles Chromium for headless browsing
- [chrome-launcher](https://github.com/GoogleChrome/chrome-launcher) — manages the Chrome process
- [cli-table3](https://github.com/cli-table/cli-table3) — terminal tables
- [chalk](https://github.com/chalk/chalk) — terminal colors
- [ora](https://github.com/sindresorhus/ora) — spinners
- [p-limit](https://github.com/sindresorhus/p-limit) — concurrency control
