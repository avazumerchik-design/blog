# The Daily Edit

A lightweight editorial blog hosted on GitHub Pages.

## Run locally

Serve the repository root with any static HTTP server. For example:

```powershell
python -m http.server 4173
```

## Edit and publish

1. Open the site and select **Edit site**.
2. Create a GitHub fine-grained personal access token for `avazumerchik-design/blog`, with **Contents: Read and write** repository permission.
3. Paste the token into the editor and select **Connect**. The token stays in page memory only; it is not written to browser storage or the repository.
4. Click text to edit it, including article headlines, introductions, and body paragraphs. While editing, open an article using its photo or **Read the story** link; category tabs remain available to open and edit category-page text.
5. Select a photo to change its HTTPS image URL or accessibility description. Use **Add story** to create an article.
6. Select **Save to GitHub** to commit text, image, and story edits to `content.json` on `main`. GitHub Pages deploys the commit to the public site after its build completes.

The editor confirms the connection after checking repository access. If `content.json` does not exist in the repository yet, the first successful save creates it. The editor itself must first be published to GitHub before these controls are available on the public site.

Text edits, image URLs and descriptions, and added articles are published through `content.json`. Photos remain hosted at their HTTPS image URLs; this editor changes the photo reference rather than uploading image files.

The visual design is an original lifestyle-magazine layout and is not affiliated with The Everygirl.
