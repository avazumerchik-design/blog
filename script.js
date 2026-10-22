const REPOSITORY = "avazumerchik-design/blog";
const BRANCH = "main";
const CONTENT_FILE = "content.json";
const API_FILE_URL = `https://api.github.com/repos/${REPOSITORY}/contents/${CONTENT_FILE}`;
const API_REPOSITORY_URL = `https://api.github.com/repos/${REPOSITORY}`;
const API_CONTENTS_URL = `https://api.github.com/repos/${REPOSITORY}/contents`;
const DEFAULT_STORY_IMAGE =
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=850&q=85";
let siteContent = { version: 1, content: {}, images: {}, stories: [] };
let baseContent = {};
let baseImages = {};
let baseImageAlts = {};
let githubToken = "";
const dirtyContent = new Set();
const dirtyImages = new Set();
const dirtyImageAlts = new Set();
const pendingStories = new Map();
const DEFAULT_EXTRA_STORIES = [
  { id: "style-2", category: "STYLE", title: "The outfit formula we reach for on busy mornings", excerpt: "A few dependable pieces make getting ready feel easy, without making your style feel like an afterthought.", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=850&q=85" },
  { id: "style-3", category: "STYLE", title: "The little accessories that make an outfit yours", excerpt: "Personal style is often in the details: the everyday pieces you reach for and love wearing again.", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=850&q=85" },
  { id: "style-4", category: "STYLE", title: "A fresh edit of the pieces already in your closet", excerpt: "A simple closet reset can make old favorites feel new and your next outfit easier to find.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=850&q=85" },
  { id: "style-5", category: "STYLE", title: "Easy layers to take you from morning to evening", excerpt: "A light layer and a couple of well-loved basics make a dependable outfit for in-between weather.", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=850&q=85" },
  { id: "career-2", category: "CAREER", title: "A calmer way to plan your work week", excerpt: "A few thoughtful check-ins can help you focus on what matters, and leave a little room to breathe.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=850&q=85" },
  { id: "career-3", category: "CAREER", title: "The money check-in worth making a monthly habit", excerpt: "A quick, no-judgment look at your spending can help you feel more confident about what comes next.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=850&q=85" },
  { id: "career-4", category: "CAREER", title: "How to make a small workspace feel like yours", excerpt: "A few personal touches can make even the busiest workday feel a little more welcoming.", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=850&q=85" },
  { id: "career-5", category: "CAREER", title: "A quick end-of-day habit that makes tomorrow easier", excerpt: "Take two minutes to write down your next step, close your tabs, and give yourself a real stopping point.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=850&q=85" },
  { id: "home-2", category: "HOME", title: "Small details that make a room feel finished", excerpt: "A favorite lamp, a little greenery, and the objects you love can bring a room together over time.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=850&q=85" },
  { id: "home-3", category: "HOME", title: "A more inviting corner for slow mornings", excerpt: "Create a spot for your first cup of coffee, a good book, or simply a few minutes to yourself.", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=850&q=85" },
  { id: "home-4", category: "HOME", title: "The little home rituals we look forward to", excerpt: "The everyday routines that make a house feel lived in are often the ones worth keeping.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=850&q=85" },
  { id: "home-5", category: "HOME", title: "A cozy corner for your next favorite book", excerpt: "A comfortable chair, soft light, and a little quiet can turn an unused spot into a favorite place.", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=850&q=85" },
  { id: "wellness-2", category: "WELLNESS", title: "A gentle reset for the middle of a busy day", excerpt: "A breath of fresh air, a stretch, and a glass of water can be a kind place to start.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=850&q=85" },
  { id: "wellness-3", category: "WELLNESS", title: "How to make a bedtime routine feel doable", excerpt: "Small, steady cues can help you wind down without adding another complicated checklist.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=850&q=85" },
  { id: "wellness-4", category: "WELLNESS", title: "A few ways to make more room for yourself", excerpt: "Rest can look different from one day to the next. Start with the kind that feels helpful today.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=850&q=85" },
  { id: "wellness-5", category: "WELLNESS", title: "The case for taking a real lunch break", excerpt: "Step away from your screen, get some fresh air, and give the middle of your day a little breathing room.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=850&q=85" },
  { id: "food-2", category: "FOOD", title: "A colorful lunch for the days you need a reset", excerpt: "A satisfying mix of greens, grains, and whatever crisp vegetables are waiting in your fridge.", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=850&q=85" },
  { id: "food-3", category: "FOOD", title: "The simple dinner we keep coming back to", excerpt: "A flexible, feel-good dinner that is easy to make your own and even better shared.", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=850&q=85" },
  { id: "food-4", category: "FOOD", title: "A little something sweet for a quiet afternoon", excerpt: "An unfussy treat, a warm drink, and an excuse to take a proper break.", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=850&q=85" },
  { id: "food-5", category: "FOOD", title: "Three easy additions that make a meal feel special", excerpt: "Fresh herbs, a bright squeeze of citrus, and something crunchy can transform a simple plate.", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=850&q=85" },
  { id: "culture-2", category: "CULTURE", title: "The good things we are reading and watching lately", excerpt: "A short list of stories and screen-time picks that made us think, laugh, or call a friend.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=850&q=85" },
  { id: "culture-3", category: "CULTURE", title: "The conversation starters we are saving for later", excerpt: "A few thoughtful questions and recommendations to bring to your next catch-up.", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=850&q=85" },
  { id: "culture-4", category: "CULTURE", title: "A little inspiration for your next free afternoon", excerpt: "Ideas for making room for the books, places, and creative projects on your someday list.", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=850&q=85" },
  { id: "culture-5", category: "CULTURE", title: "Good things to share with your group chat this week", excerpt: "A thoughtful mix of recommendations, new discoveries, and stories to keep the conversation going.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=850&q=85" },
];
const FEATURED_STORY_BODIES = {
  "story-1": [
    "There is no one-size-fits-all morning routine. Some days start slowly; some start with a to-do list already in motion. The best ritual is the one that gives you a little room to arrive in your day.",
    "Try choosing one small thing to look forward to: opening a window, making your favorite drink, or taking a few minutes away from a screen. It does not need to be impressive to make a difference.",
    "Keep it simple enough to come back to. A gentler start is not about doing more—it is about finding a moment that feels like your own.",
  ],
  "story-2": [
    "A home does not come together all at once. It grows around the things you use, the objects you keep close, and the small routines that make an ordinary afternoon feel a little more comfortable.",
    "Start with one corner you spend time in. A lamp with warm light, a book you love, or a branch from the market can be more meaningful than a room full of things chosen all at once.",
    "The goal is not a finished room. It is a space that keeps becoming yours.",
  ],
  "story-3": [
    "The best everyday lunches are the ones that leave room to improvise. Start with something filling, add whatever vegetables are already in the fridge, and finish with a dressing or sauce you love.",
    "A little contrast makes it feel special: something crisp with something soft, a squeeze of citrus, or a handful of fresh herbs. There is no need to follow a recipe exactly.",
    "Make enough for tomorrow if you like. Or enjoy the small pleasure of putting together something good just for today.",
  ],
  "story-4": [
    "Getting dressed can be a lot easier when you have a few combinations you already love. Start with a comfortable base, add a layer that works for the weather, and finish with one detail that feels like you.",
    "That detail might be a favorite pair of earrings, a bag you reach for every week, or a color you do not usually wear. The point is to make getting ready feel less like a test and more like a small creative choice.",
    "Keep the pieces that make you feel good in easy reach. A little less decision-making can leave more room for the rest of your day.",
  ],
  "story-5": [
    "A better workday does not have to mean a perfectly optimized calendar. Sometimes it starts with one small boundary: a real lunch break, a short walk between meetings, or a clear stopping point at the end of the day.",
    "Choose a reset that fits the way you work. Put your next task on a sticky note before closing your laptop, step away from your desk for a few minutes, or make space for a quick check-in with a colleague.",
    "Small changes are easier to keep when they work with your life, not against it.",
  ],
  "story-6": [
    "Some weeks call for a thoughtful book, a new show to watch with a friend, or a conversation that stays with you after it ends. This is a little reminder to make space for the things that spark your curiosity.",
    "Save a recommendation from someone you trust, revisit a story you have been meaning to read, or ask a friend what they cannot stop thinking about lately. Good conversations often begin with a simple question.",
    "Take what you like, pass the rest along, and keep a little room for surprise.",
  ],
  "story-lead": [
    "The best costumes are the ones that make you smile before you even leave the house. This year's pop-culture moments give you plenty of playful, easy-to-recognize inspiration.",
    "Go all in with a group costume, pull together a look with pieces you already own, or keep it simple with one unmistakable accessory. A good costume does not need a complicated plan—or a big budget.",
    "Pick the idea that feels fun to wear, make it your own, and enjoy the excuse to be a little extra for one night.",
  ],
};

function useImageFallback(image) {
  const fallback = () => {
    if (!image.src.includes("photo-1515377905703-c4788e51af15")) {
      image.src = DEFAULT_STORY_IMAGE;
    }
  };
  image.addEventListener("error", fallback, { once: true });
  if (image.complete && image.naturalWidth === 0) fallback();
}

const body = document.body;
const editToggle = document.querySelector(".edit-toggle");
const editorToolbar = document.querySelector(".editor-toolbar");
const editableElements = () => [...document.querySelectorAll("[data-editable]")];
const storyGrid = document.querySelector("#story-grid");
const storyDialog = document.querySelector(".story-dialog");
const storyForm = document.querySelector(".story-form");
const searchBar = document.querySelector(".search-bar");
const searchInput = document.querySelector("#site-search");
const emptyState = document.querySelector(".empty-state");
let selectedImage = null;

function setEditableText(element, text) {
  const storyLink = element.matches("a[data-open-story]")
    ? element
    : element.querySelector(":scope > a[data-open-story]");
  if (storyLink) {
    storyLink.textContent = text;
  } else {
    element.textContent = text;
  }
}

function elementIsVisible(element) {
  return element.isConnected && element.getClientRects().length > 0;
}

function makePageTextEditable() {
  const textElements = document.querySelectorAll("p, h1, h2, h3, a, button, label, span, small, strong");
  for (const element of textElements) {
    if (element.matches("a[data-open-story].story-read, a[data-open-story].text-link")) {
      element.removeAttribute("data-editable");
      element.removeAttribute("contenteditable");
      continue;
    }
    if (element.matches(".article-meta")
      || element.closest(".editor-toolbar, .story-dialog, .article-close, svg, [aria-hidden='true'], [hidden]")) continue;
    if (![...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())) continue;
    if (!element.dataset.editable) {
      const path = [];
      let current = element;
      while (current && current !== body) {
        if (current.id) {
          path.unshift(current.id);
          break;
        }
        const siblingIndex = [...current.parentElement.children]
          .filter((sibling) => sibling.tagName === current.tagName)
          .indexOf(current);
        const className = [...current.classList].slice(0, 2).join(".");
        path.unshift(`${current.tagName.toLowerCase()}${className ? `.${className}` : ""}[${siblingIndex}]`);
        current = current.parentElement;
      }
      element.dataset.editable = `page-${path.join("-")}`;
    }
    element.contentEditable = String(body.classList.contains("is-editing") && elementIsVisible(element));
    element.spellcheck = body.classList.contains("is-editing");
  }
}

function loadSavedContent() {
  for (const element of editableElements()) {
    if (typeof siteContent.content[element.dataset.editable] === "string") {
      setEditableText(element, siteContent.content[element.dataset.editable]);
    }
  }
}

function initializeImageKeys() {
  for (const image of document.querySelectorAll("img:not([data-image-key])")) {
    const storyTitle = image.closest("[data-story-card]")?.querySelector("h3 [data-editable]")?.dataset.editable;
    image.dataset.imageKey = storyTitle
      ? `${storyTitle.replace("-title", "")}-image`
      : `image-${image.alt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  }
}

function loadSavedImages() {
  for (const image of document.querySelectorAll("img[data-image-key]")) {
    const source = siteContent.images[image.dataset.imageKey];
    if (typeof source === "string") image.src = source;
    const alt = siteContent.imageAlts[image.dataset.imageKey];
    if (typeof alt === "string") image.alt = alt;
  }
}

function savePageContent() {
  for (const element of editableElements().filter(elementIsVisible)) {
    const key = element.dataset.editable;
    const value = element.textContent;
    siteContent.content[key] = value;
    if (value === baseContent[key]) dirtyContent.delete(key);
    else {
      dirtyContent.add(key);
      document.querySelector(".save-changes").textContent = "SAVE TO GITHUB";
    }
  }
}

function normalizeContent(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("The published content file must contain a JSON object.");
  }
  return {
    version: 1,
    content: data.content && typeof data.content === "object" && !Array.isArray(data.content) ? data.content : {},
    images: data.images && typeof data.images === "object" && !Array.isArray(data.images) ? data.images : {},
    imageAlts: data.imageAlts && typeof data.imageAlts === "object" && !Array.isArray(data.imageAlts) ? data.imageAlts : {},
    stories: Array.isArray(data.stories) ? data.stories : [],
  };
}

function githubHeaders(token) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function githubErrorMessage(response, details) {
  if (response.status === 401) return "GitHub rejected the token. Check that it is valid and has access to this repository.";
  if (response.status === 403) return "GitHub denied access. Grant this token Contents: read and write for this repository.";
  if (response.status === 404) return "GitHub could not find this repository. Check the repository owner and that the token is authorized for it.";
  if (response.status === 409 || response.status === 422) return "The repository changed while saving. Refresh the page and try again.";
  return details.message || `GitHub request failed (${response.status}).`;
}

async function readGithubContent(token) {
  const response = await fetch(`${API_FILE_URL}?ref=${BRANCH}`, {
    headers: githubHeaders(token),
    cache: "no-store",
  });
  const result = await response.json();
  if (response.status === 404) {
    const repositoryResponse = await fetch(API_REPOSITORY_URL, {
      headers: githubHeaders(token),
      cache: "no-store",
    });
    const repositoryResult = await repositoryResponse.json();
    if (!repositoryResponse.ok) {
      throw new Error(githubErrorMessage(repositoryResponse, repositoryResult));
    }
    const contentsResponse = await fetch(`${API_CONTENTS_URL}?ref=${BRANCH}`, {
      headers: githubHeaders(token),
      cache: "no-store",
    });
    const contentsResult = await contentsResponse.json();
    if (!contentsResponse.ok) {
      throw new Error(contentsResponse.status === 403 || contentsResponse.status === 404
        ? "GitHub can access the repository, but not its contents. Grant this token Contents: read and write."
        : githubErrorMessage(contentsResponse, contentsResult));
    }
    return { content: normalizeContent({}), sha: null };
  }
  if (!response.ok) throw new Error(githubErrorMessage(response, result));
  const binary = atob(result.content.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return { content: normalizeContent(JSON.parse(new TextDecoder().decode(bytes))), sha: result.sha };
}

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function renderCurrentContent() {
  for (const story of siteContent.stories) createStoryCard(story);
  makePageTextEditable();
  loadSavedContent();
  loadSavedImages();
  document.querySelectorAll("img").forEach(useImageFallback);
  routePage();
}

async function loadPublishedContent() {
  try {
    const response = await fetch(new URL(CONTENT_FILE, document.baseURI), { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${CONTENT_FILE} (${response.status}).`);
    siteContent = normalizeContent(await response.json());
  } catch (error) {
    console.error("Could not load published site content.", error);
    document.querySelector(".github-save-status").textContent =
      "Could not load the published content file. Built-in stories are shown; check content.json and reload.";
  }
  baseContent = { ...siteContent.content };
  baseImages = { ...siteContent.images };
  baseImageAlts = { ...siteContent.imageAlts };
  for (const story of DEFAULT_EXTRA_STORIES) createStoryCard(story);
  loadSavedStories();
  initializeImageKeys();
  renderCurrentContent();
}

async function connectGithub() {
  const button = document.querySelector(".github-connect");
  const status = document.querySelector(".github-save-status");
  if (githubToken) {
    githubToken = "";
    button.textContent = "CONNECT";
    document.querySelector("#github-token").hidden = false;
    document.querySelector(".save-changes").disabled = true;
    document.querySelector(".editor-connection").textContent = "EDIT MODE · LOCAL DRAFT";
    status.textContent = "Disconnected. Your token has been cleared from this tab.";
    return;
  }

  const token = document.querySelector("#github-token").value.trim();
  if (!token) {
    status.textContent = "Paste a fine-grained GitHub token to connect.";
    return;
  }

  button.disabled = true;
  button.textContent = "CONNECTING…";
  status.textContent = "Checking your token and repository access…";
  try {
    const remote = await readGithubContent(token);
    const draftContent = Object.fromEntries([...dirtyContent].map((key) => [key, siteContent.content[key]]));
    const draftImages = Object.fromEntries([...dirtyImages].map((key) => [key, siteContent.images[key]]));
    const draftImageAlts = Object.fromEntries([...dirtyImageAlts].map((key) => [key, siteContent.imageAlts[key]]));
    const storiesById = new Map(remote.content.stories.map((story) => [String(story.id), story]));
    for (const story of pendingStories.values()) storiesById.set(String(story.id), story);

    siteContent = remote.content;
    Object.assign(siteContent.content, draftContent);
    Object.assign(siteContent.images, draftImages);
    Object.assign(siteContent.imageAlts, draftImageAlts);
    siteContent.stories = [...storiesById.values()];
    baseContent = { ...remote.content.content };
    baseImages = { ...remote.content.images };
    baseImageAlts = { ...remote.content.imageAlts };
    githubToken = token;
    for (const [key, value] of Object.entries(draftContent)) {
      if (value !== baseContent[key]) dirtyContent.add(key);
    }
    for (const [key, value] of Object.entries(draftImages)) {
      if (value !== baseImages[key]) dirtyImages.add(key);
    }
    for (const [key, value] of Object.entries(draftImageAlts)) {
      if (value !== baseImageAlts[key]) dirtyImageAlts.add(key);
    }
    document.querySelector("#github-token").value = "";
    document.querySelector("#github-token").hidden = true;
    button.textContent = "DISCONNECT";
    document.querySelector(".save-changes").disabled = false;
    document.querySelector(".editor-connection").textContent = "CONNECTED · GITHUB";
    status.textContent = "Connected to avazumerchik-design/blog · main.";
    renderCurrentContent();
  } catch (error) {
    console.error("Could not connect to GitHub.", error);
    button.textContent = "CONNECT";
    status.textContent = error instanceof TypeError
      ? "Could not reach GitHub. Check your connection and try again."
      : error.message;
  } finally {
    button.disabled = false;
  }
}

async function saveToGithub() {
  const button = document.querySelector(".save-changes");
  const status = document.querySelector(".github-save-status");
  if (!githubToken) {
    status.textContent = "Connect GitHub before publishing changes.";
    return;
  }

  savePageContent();
  if (!dirtyContent.size && !dirtyImages.size && !dirtyImageAlts.size && !pendingStories.size) {
    status.textContent = "There are no unsaved changes.";
    return;
  }

  button.disabled = true;
  status.textContent = "Saving changes to the repository…";
  try {
    const remote = await readGithubContent(githubToken);
    const updatedContent = remote.content;
    for (const key of dirtyContent) updatedContent.content[key] = siteContent.content[key];
    for (const key of dirtyImages) updatedContent.images[key] = siteContent.images[key];
    for (const key of dirtyImageAlts) updatedContent.imageAlts[key] = siteContent.imageAlts[key];

    const storiesById = new Map(updatedContent.stories.map((story) => [String(story.id), story]));
    for (const [id, story] of pendingStories) storiesById.set(id, story);
    updatedContent.stories = [...storiesById.values()];

    const response = await fetch(`${API_FILE_URL}?ref=${BRANCH}`, {
      method: "PUT",
      headers: { ...githubHeaders(githubToken), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Update site content from the visual editor",
        content: encodeBase64(`${JSON.stringify(updatedContent, null, 2)}\n`),
        ...(remote.sha ? { sha: remote.sha } : {}),
        branch: BRANCH,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(githubErrorMessage(response, result));

    siteContent = updatedContent;
    baseContent = { ...updatedContent.content };
    baseImages = { ...updatedContent.images };
    baseImageAlts = { ...updatedContent.imageAlts };
    dirtyContent.clear();
    dirtyImages.clear();
    dirtyImageAlts.clear();
    pendingStories.clear();
    status.textContent = "Saved to GitHub. GitHub Pages is publishing the update now.";
    button.textContent = "SAVED";
  } catch (error) {
    console.error("Could not save site changes to GitHub.", error);
    button.textContent = "SAVE TO GITHUB";
    status.textContent = error instanceof TypeError
      ? "Could not reach GitHub. Your unsaved edits are still in this tab."
      : `${error.message} Your unsaved edits are still in this tab.`;
  } finally {
    button.disabled = false;
  }
}

function setEditing(isEditing) {
  body.classList.toggle("is-editing", isEditing);
  editToggle.setAttribute("aria-pressed", String(isEditing));
  editorToolbar.hidden = !isEditing;
  makePageTextEditable();

  if (!isEditing) savePageContent();
}

function createStoryCard(story) {
  if ([...storyGrid.querySelectorAll("[data-story-card]")].some((card) => card.dataset.storyId === String(story.id))) {
    return;
  }
  const article = document.createElement("article");
  article.className = "story-card";
  article.dataset.storyCard = "";
  article.dataset.storyId = String(story.id);
  article.dataset.category = story.category;

  const imageLink = document.createElement("a");
  imageLink.className = "story-image";
  imageLink.href = `#story-${story.id}`;
  imageLink.dataset.openStory = "";
  const image = document.createElement("img");
  image.src = story.image || DEFAULT_STORY_IMAGE;
  image.dataset.imageKey = `story-${story.id}-image`;
  image.alt = story.title;
  image.loading = "lazy";
  useImageFallback(image);
  imageLink.append(image);

  const category = document.createElement("p");
  category.className = "story-category";
  category.dataset.editable = `story-${story.id}-category`;
  category.textContent = story.category === "HOME" ? "HOME & LIVING" : story.category;

  const title = document.createElement("h3");
  const titleLink = document.createElement("a");
  titleLink.href = `#story-${story.id}`;
  titleLink.dataset.openStory = "";
  titleLink.dataset.editable = `story-${story.id}-title`;
  titleLink.textContent = story.title;
  title.append(titleLink);

  const excerpt = document.createElement("p");
  excerpt.className = "story-excerpt";
  excerpt.dataset.editable = `story-${story.id}-excerpt`;
  excerpt.textContent = story.excerpt;

  const readLink = document.createElement("a");
  readLink.className = "story-read";
  readLink.href = `#story-${story.id}`;
  readLink.dataset.openStory = "";
  readLink.append(document.createTextNode("READ THE STORY "));
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  readLink.append(arrow);

  article.append(imageLink, category, title, excerpt, readLink);
  storyGrid.append(article);
}

function openStory(card, storyLink) {
  const storyId = storyLink.dataset.storyId
    || card?.querySelector("h3 [data-editable]")?.dataset.editable.replace("story-", "").replace("-title", "");
  const isLeadStory = Boolean(storyLink.closest(".lead-story"));
  const title = isLeadStory
    ? document.querySelector('[data-editable="lead-title"]').textContent.trim()
    : card?.querySelector("h3")?.textContent.trim();
  const category = isLeadStory
    ? document.querySelector('[data-editable="lead-category"]').textContent.trim()
    : card?.querySelector(".story-category")?.textContent.trim();
  const excerpt = isLeadStory
    ? document.querySelector('[data-editable="lead-excerpt"]').textContent.trim()
    : card?.querySelector(".story-excerpt")?.textContent.trim();
  const image = isLeadStory ? storyLink.closest(".lead-story").querySelector(".lead-image img") : card?.querySelector(".story-image img");
  if (!title || !image) return;
  let storyBody = FEATURED_STORY_BODIES[isLeadStory ? "story-lead" : `story-${storyId}`];
  const savedStory = siteContent.stories.find((story) => String(story.id) === storyId);
  if (savedStory?.body) storyBody = savedStory.body.split(/\n{2,}/).filter(Boolean);

  const articleView = document.querySelector(".article-view");
  articleView.replaceChildren();
  const categoryLabel = document.createElement("p");
  categoryLabel.className = "eyebrow";
  categoryLabel.dataset.editable = isLeadStory ? "lead-category" : `story-${storyId}-category`;
  categoryLabel.textContent = category;
  const heading = document.createElement("h1");
  heading.id = "article-title";
  heading.dataset.editable = isLeadStory ? "lead-title" : `story-${storyId}-title`;
  heading.textContent = title;
  const meta = document.createElement("p");
  meta.className = "article-meta";
  meta.textContent = "THE DAILY EDIT EDITORS  ·  5 MIN READ";
  const articleImage = document.createElement("img");
  articleImage.className = "article-image";
  articleImage.dataset.imageKey = `story-${storyId}-image`;
  articleImage.src = image.src;
  articleImage.alt = image.alt;
  useImageFallback(articleImage);
  loadSavedImages();
  const lead = document.createElement("p");
  lead.className = "article-lead";
  lead.dataset.editable = isLeadStory ? "lead-excerpt" : `story-${storyId}-excerpt`;
  lead.textContent = excerpt;

  articleView.append(categoryLabel, heading, meta, articleImage, lead);
  const completeStory = storyBody || [
    excerpt,
    "The best ideas leave room to make them your own. Start with what works for your day and adjust from there.",
    "Keep it simple, make it personal, and come back to the things that make everyday life feel a little brighter.",
  ];
  for (const [index, paragraphText] of completeStory.entries()) {
    const paragraph = document.createElement("p");
    paragraph.className = "article-paragraph";
    paragraph.dataset.editable = `article-${isLeadStory ? "lead" : storyId}-${index}`;
    paragraph.textContent = paragraphText;
    articleView.append(paragraph);
  }
  document.querySelector(".article-dialog").showModal();
  if (body.classList.contains("is-editing")) makePageTextEditable();
  loadSavedContent();
}

function loadSavedStories() {
  for (const story of siteContent.stories) createStoryCard(story);
}

function saveNewStory(story) {
  siteContent.stories.push(story);
  pendingStories.set(String(story.id), story);
  document.querySelector(".save-changes").textContent = "SAVE TO GITHUB";
}

function filterStories(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  let visibleCount = 0;

  for (const card of document.querySelectorAll("#story-grid [data-story-card], #category-grid [data-story-card]")) {
    if (!elementIsVisible(card) && !card.closest("#category-grid")) continue;
    const matchesQuery = !normalizedQuery || card.textContent.toLowerCase().includes(normalizedQuery);
    card.hidden = !matchesQuery;
    if (matchesQuery && elementIsVisible(card)) visibleCount += 1;
  }

  emptyState.hidden = visibleCount > 0;
}

const CATEGORY_DETAILS = {
  STYLE: { slug: "style", title: "Style", description: "Wear what feels like you. Fresh finds, personal style, and outfits for every version of your day." },
  CAREER: { slug: "career", title: "Career & Finance", description: "Real talk and practical inspiration for making work and money work for you." },
  HOME: { slug: "home", title: "Home & Living", description: "Thoughtful spaces, everyday rituals, and little ways to make a home your own." },
  WELLNESS: { slug: "wellness", title: "Wellness", description: "A kinder, more personal approach to feeling good in your everyday life." },
  FOOD: { slug: "food", title: "Food", description: "Recipes and ideas worth gathering around, from weeknight dinners to little treats." },
  CULTURE: { slug: "culture", title: "Culture", description: "Stories, conversations, and good things to watch, read, and talk about." },
};

function routePage() {
  const categoryPage = document.querySelector("#category-page");
  const homePage = document.querySelector("#home-page");
  const pageSections = document.querySelectorAll(".editorial-lead, .story-ticker, .seasonal-section, .quote-band, .newsletter");
  const categorySlug = window.location.hash.match(/^#category\/([a-z-]+)$/)?.[1];
  const category = Object.entries(CATEGORY_DETAILS).find(([, details]) => details.slug === categorySlug);

  document.querySelectorAll("[data-category-link]").forEach((link) => {
    link.toggleAttribute("aria-current", link.dataset.categoryLink === (category?.[0] || "all"));
  });

  if (!category) {
    document.body.removeAttribute("data-page");
    categoryPage.hidden = true;
    homePage.hidden = false;
    for (const section of pageSections) section.hidden = false;
    if (body.classList.contains("is-editing")) makePageTextEditable();
    loadSavedContent();
    filterStories(searchInput.value);
    document.title = "The Daily Edit — A little inspiration for every day";
    return;
  }

  const [categoryKey, details] = category;
  const title = document.querySelector("#category-title");
  title.textContent = details.title;
  title.dataset.editable = `category-title-${details.slug}`;
  const intro = document.querySelector(".category-intro");
  intro.dataset.editable = `category-intro-${details.slug}`;
  intro.textContent = details.description;
  document.querySelector("#category-grid").replaceChildren(
    ...[...storyGrid.querySelectorAll("[data-story-card]")]
      .filter((card) => card.dataset.category === categoryKey)
      .map((card) => card.cloneNode(true)),
  );
  document.querySelector(".category-empty").hidden = document.querySelectorAll("#category-grid [data-story-card]").length > 0;
  document.querySelectorAll("#category-grid img").forEach(useImageFallback);
  loadSavedImages();
  categoryPage.hidden = false;
  homePage.hidden = true;
  for (const section of pageSections) section.hidden = true;
  document.body.dataset.page = "category";
  makePageTextEditable();
  loadSavedContent();
  document.title = `${details.title} — The Daily Edit`;
  filterStories(searchInput.value);
  window.scrollTo({ top: 0, behavior: "auto" });
}

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-editable]")) {
    savePageContent();
    if (event.target.matches(".category-page h1")) {
      const category = Object.values(CATEGORY_DETAILS).find((item) => item.slug === window.location.hash.split("/")[1]);
      if (category) {
        document.title = `${event.target.textContent.trim()} — The Daily Edit`;
      }
    }
  }
});

editToggle.addEventListener("click", () => {
  setEditing(editToggle.getAttribute("aria-pressed") !== "true");
});

document.querySelector(".save-changes").addEventListener("click", saveToGithub);
document.querySelector(".github-connect").addEventListener("click", connectGithub);

document.querySelector(".add-story").addEventListener("click", () => storyDialog.showModal());
document.querySelector(".dialog-close").addEventListener("click", () => storyDialog.close());

storyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(storyForm);
  const imageUrl = String(formData.get("image")).trim();
  if (imageUrl) {
    try {
      if (new URL(imageUrl).protocol !== "https:") throw new TypeError("Use a secure https image URL.");
    } catch {
      storyForm.elements.image.setCustomValidity("Enter a valid secure https image URL.");
      storyForm.elements.image.reportValidity();
      return;
    }
  }
  storyForm.elements.image.setCustomValidity("");

  const story = {
    id: Date.now(),
    title: String(formData.get("title")).trim(),
    category: String(formData.get("category")),
    excerpt: String(formData.get("excerpt")).trim(),
    body: String(formData.get("body")).trim(),
    image: imageUrl,
  };

  try {
    saveNewStory(story);
    createStoryCard(story);
  } catch (error) {
    console.error("Could not save the new story.", error);
    window.alert("Could not save this story. Check your browser storage settings and try again.");
    return;
  }

  if (body.classList.contains("is-editing")) {
    makePageTextEditable();
  }
  storyForm.reset();
  storyDialog.close();
  if (body.dataset.page === "category") routePage();
  filterStories(searchInput.value);
});

document.addEventListener("click", (event) => {
  const clickedImage = event.target.closest("img[data-image-key]");
  if (clickedImage && body.classList.contains("is-editing")) {
    event.preventDefault();
    event.stopPropagation();
    selectedImage?.classList.remove("image-selected");
    selectedImage = clickedImage;
    selectedImage.classList.add("image-selected");
    document.querySelector("#image-url").value = selectedImage.src;
    document.querySelector("#image-alt").value = selectedImage.alt;
    document.querySelector(".image-editor-status").textContent = "Paste an https image URL, then choose Update.";
    document.querySelector("#image-url").focus();
    return;
  }

  const storyLink = event.target.closest("[data-open-story]");
  if (!storyLink) return;
  if (body.classList.contains("is-editing") && event.target.closest("[data-editable]")) {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  const storyId = storyLink.dataset.storyId
    || storyLink.closest("[data-story-card]")?.querySelector("h3 [data-editable]")?.dataset.editable.replace("story-", "").replace("-title", "");
  const card = [...document.querySelectorAll("[data-story-card]")].find((item) =>
    item.querySelector("h3 [data-editable]")?.dataset.editable === `story-${storyId}-title`,
  );
  openStory(card, storyLink);
});

document.addEventListener("keydown", (event) => {
  if ((event.key !== "Enter" && event.key !== " ") || !event.target.matches("[data-story-card]")) return;
  event.preventDefault();
  const storyLink = event.target.querySelector("[data-open-story]");
  if (storyLink) openStory(event.target, storyLink);
});

document.querySelector(".article-close").addEventListener("click", () => {
  document.querySelector(".article-dialog").close();
});

document.querySelector(".article-dialog").addEventListener("close", () => {
  if (body.classList.contains("is-editing")) makePageTextEditable();
  loadSavedContent();
});

const searchToggle = document.querySelector(".search-toggle");
searchToggle.addEventListener("click", () => {
  const opening = searchBar.hidden;
  searchBar.hidden = !opening;
  searchToggle.setAttribute("aria-expanded", String(opening));
  if (opening) searchInput.focus();
});

document.querySelector(".search-close").addEventListener("click", () => {
  searchBar.hidden = true;
  searchToggle.setAttribute("aria-expanded", "false");
  searchInput.value = "";
  filterStories();
});

searchInput.addEventListener("input", () => filterStories(searchInput.value));

document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.dataset.categoryLink === "all") return;
    event.preventDefault();
    window.location.hash = `category/${CATEGORY_DETAILS[link.dataset.categoryLink].slug}`;
  });
});

window.addEventListener("hashchange", routePage);

document.querySelector(".update-image").addEventListener("click", () => {
  const status = document.querySelector(".image-editor-status");
  const imageUrl = document.querySelector("#image-url").value.trim();
  if (!selectedImage) {
    status.textContent = "Click a photo on the page first.";
    return;
  }
  let parsedUrl;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    status.textContent = "Enter a valid image URL.";
    return;
  }
  if (parsedUrl.protocol !== "https:") {
    status.textContent = "Use a secure https image URL.";
    return;
  }

  const testImage = new Image();
  status.textContent = "Checking image…";
  testImage.onload = () => {
    const imageKey = selectedImage.dataset.imageKey;
    siteContent.images[imageKey] = parsedUrl.href;
    if (parsedUrl.href === baseImages[imageKey]) dirtyImages.delete(imageKey);
    else {
      dirtyImages.add(imageKey);
      document.querySelector(".save-changes").textContent = "SAVE TO GITHUB";
    }
    siteContent.imageAlts[imageKey] = document.querySelector("#image-alt").value.trim();
    if (siteContent.imageAlts[imageKey] === baseImageAlts[imageKey]) dirtyImageAlts.delete(imageKey);
    else {
      dirtyImageAlts.add(imageKey);
      document.querySelector(".save-changes").textContent = "SAVE TO GITHUB";
    }
    document.querySelectorAll("img[data-image-key]").forEach((image) => {
      if (image.dataset.imageKey === imageKey) {
        image.src = parsedUrl.href;
        image.alt = siteContent.imageAlts[imageKey];
      }
    });
    status.textContent = "Photo and description updated. Choose Save to publish.";
  };
  testImage.onerror = () => {
    status.textContent = "That image could not be loaded. Check the link and try another.";
  };
  testImage.src = parsedUrl.href;
});

document.querySelector(".save-changes").disabled = true;
loadPublishedContent();

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const emailInput = document.querySelector("#email");
  if (!emailInput.reportValidity()) return;
  document.querySelector(".newsletter-status").textContent = "You're on the list. Look out for a little good in your inbox!";
  emailInput.value = "";
});
