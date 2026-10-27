# Search Console setup — natively-clone.pages.dev

**Status: NOT submitted.** These steps need the site owner's Google account, so they
cannot be done by an agent. Follow them in order; each one takes a few minutes.

## 1. Add the property

1. Go to https://search.google.com/search-console/ and sign in with your Google account.
2. Click **Add property** (top left) and choose **URL prefix**.
3. Enter exactly: `https://natively-clone.pages.dev/`
4. Click **Continue**. Google will ask you to verify ownership.

## 2. Verify ownership — HTML file method (works with Cloudflare Pages)

1. On the verification screen, choose the **HTML file** method.
2. Google gives you a file to download, e.g. `googlea1b2c3d4e5f6g7h8.html`, and a
   verification string inside it. **Download that file — do not edit it.**
3. Copy the file into this repo's root (next to `index.html`), e.g.:
   `~/workspace/natively-clone/googlea1b2c3d4e5f6g7h8.html`
4. Redeploy the site (Cloudflare Pages redeploy — the file must be live at
   `https://natively-clone.pages.dev/googlea1b2c3d4e5f6g7h8.html`).
5. Open that URL in a browser to confirm it loads and shows the verification string.
6. Back in Search Console, click **Verify**. Google checks the live file.
7. **Leave the file in the repo afterwards.** Removing it can drop verification.

Alternative if the HTML-file method fails: use the **HTML tag** method instead —
paste the `<meta name="google-site-verification" content="...">` tag into the
`<head>` of `index.html` and redeploy. (Do not use the DNS method: Cloudflare
Pages subdomains do not give you DNS control.)

## 3. Submit the sitemap

1. In Search Console, open **Sitemaps** in the left menu.
2. Under "Add a new sitemap", enter: `sitemap.xml`
   (full URL: https://natively-clone.pages.dev/sitemap.xml)
3. Click **Submit**. Status should change to "Success" within a day; if it shows
   "Couldn't fetch", wait for the redeploy to propagate and resubmit.

The sitemap lists all 6 pages (extensionless URLs):

- https://natively-clone.pages.dev/
- https://natively-clone.pages.dev/demo
- https://natively-clone.pages.dev/pricing
- https://natively-clone.pages.dev/ai-interview-copilot
- https://natively-clone.pages.dev/free-interview-assistant
- https://natively-clone.pages.dev/compare

## 4. After submission — what to check (next few days)

- **Pages → Indexing:** confirm all 6 pages move from "Discovered" to "Indexed".
  If a page stays unindexed, use **URL Inspection → Request indexing** on that URL.
- **Experience → Core Web Vitals:** should be green — the site is plain HTML/CSS,
  ~19 KB homepage, no frameworks.
- **Enhancements:** the FAQ and SoftwareApplication structured data should appear
  under "Enhancements" once Google re-crawls (use the Rich Results Test at
  https://search.google.com/test/rich-results if you want an instant check).
- **Performance:** search impressions/clicks start appearing 2–3 days after indexing.

## 5. Ongoing

- Every time a page is added or changed, the sitemap must be updated and the site
  redeployed. No re-submission is needed — Google re-reads the sitemap on its own.
- `robots.txt` already allows all crawlers and points to the sitemap; leave it as is.
