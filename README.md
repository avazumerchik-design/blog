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
4. Choose **Edit text** to change page copy, category text, or article titles, introductions, and body paragraphs. Open an article with its photo or **Read the story** link; use **Save text to GitHub** in the open story or editor panel to publish writing changes.
5. Choose **Edit photos** to select a photo and update its HTTPS URL or accessibility description. Save those separately with **Save photos to GitHub**. Use **Add story** in the text editor to create an article.
6. GitHub Pages deploys each successful save to `content.json` on `main` after its build completes.

The editor confirms the connection after checking repository access. If `content.json` does not exist in the repository yet, the first successful save creates it. The editor itself must first be published to GitHub before these controls are available on the public site.

Text edits, image URLs and descriptions, and added articles are published through `content.json`. Photos remain hosted at their HTTPS image URLs; this editor changes the photo reference rather than uploading image files.

The visual design is an original lifestyle-magazine layout and is not affiliated with The Everygirl.
