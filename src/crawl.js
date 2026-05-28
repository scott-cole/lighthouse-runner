import fetch from "node-fetch";

export async function crawl(baseUrl) {
  baseUrl = baseUrl.replace(/\/$/, "");

  const sitemapUrl = baseUrl + "/sitemap.xml";
  const response = await fetch(sitemapUrl);

  if (response.ok) {
    const xml = await response.text();
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
    const urls = matches.map((m) => m[1]);
    console.log("Sitemap found with " + urls.length + " pages");
    return urls;
  } else {
    const homeResponse = await fetch(baseUrl);
    const html = await homeResponse.text();
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

    const baseHost = new URL(baseUrl).hostname;
    const internalUrls = new Set();

    for (const href of hrefs) {
      try {
        const fullUrl = new URL(href, baseUrl);
        if (fullUrl.hostname === baseHost) {
          internalUrls.add(fullUrl.href);
        }

        if (internalUrls.size >= 200) break;
      } catch {}
    }
    return [...internalUrls];
  }
}
