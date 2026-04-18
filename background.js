const PRODUCTIVE_DOMAINS = [
  // Coding & Development
  "github.com", "gitlab.com", "bitbucket.org", "stackoverflow.com", "leetcode.com", "hackerrank.com", "codewars.com", "repl.it", "glitch.com",
  // Learning Platforms
  "coursera.org", "udemy.com", "khanacademy.org", "codecademy.com", "freecodecamp.org", "edx.org", "datacamp.com", "pluralsight.com", "treehouse.com", "educative.io", "scrimba.com",
  // Documentation & References
  "developer.mozilla.org", "docs.microsoft.com", "python.org", "javascript.info", "typescriptlang.org", "angular.io", "react.dev", "vue.js", "nodejs.org", "tailwindcss.com",
  // Tech Communities & Blogs
  "medium.com", "dev.to", "hashnode.com", "css-tricks.com", "smashingmagazine.com", "arstechnica.com", "techcrunch.com", "github.blog",
  // Project Management & Collaboration
  "jira.com", "trello.com", "notion.so", "asana.com", "monday.com", "confluence.atlassian.net", "miro.com", "figma.com",
  // Cloud & DevOps
  "heroku.com", "netlify.com", "vercel.com", "aws.amazon.com", "cloud.google.com", "azure.microsoft.com", "digitalocean.com", "docker.com",
  // IDEs & Code Editors
  "replit.com", "codepen.io", "jsfiddle.net", "github.dev",
  // Additional Educational & Technical
  "w3schools.com", "geeksforgeeks.org", "tutorialspoint.com", "programiz.com", "sololearn.com", "codeforces.com", "atcoder.jp", "projecteuler.net", "kaggle.com"
];

const UNPRODUCTIVE_DOMAINS = [
  // Social Media
  "facebook.com", "instagram.com", "twitter.com", "x.com", "tiktok.com", "snapchat.com", "pinterest.com", "reddit.com", "nextdoor.com", "quora.com",
  // Video Streaming
  "youtube.com", "netflix.com", "hulu.com", "disneyplus.com", "primevideo.com", "twitch.tv", "dailymotion.com", "vimeo.com",
  // Entertainment & Memes
  "imgur.com", "9gag.com", "buzzfeed.com", "tumblr.com", "ifunny.co", "memedroid.com", "funnyjunk.com", "viralvideo.com",
  // Gaming
  "steam.com", "epicgames.com", "playstation.com", "xbox.com", "roblox.com", "minecraft.net", "itch.io", "discord.com", "twitch.tv",
  // Shopping & Marketplaces
  "amazon.com", "ebay.com", "alibaba.com", "etsy.com", "aliexpress.com", "wish.com", "wayfair.com", "zappos.com", "target.com",
  // News & Entertainment
  "cnn.com", "bbc.com", "yahoo.com", "weather.com", "espn.com", "nytimes.com", "theguardian.com", "huffpost.com", "tmz.com", "variety.com",
  // Streaming Music & Podcasts
  "spotify.com", "music.apple.com", "soundcloud.com", "pandora.com", "podcasts.google.com",
  // Chat & Messaging (if not work-related)
  "whatsapp.com", "telegram.org", "viber.com",
  // Additional Entertainment
  "hbomax.com", "crunchyroll.com", "funimation.com", "wattpad.com", "webnovel.com", "wuxiaworld.com", "royalroad.com"
];

let trackingState = {
  activeTabId: null,
  activeWindowId: null,
  activeDomain: null,
  lastActiveTime: null
};
let trackingStateLoaded = false;

function getDomainFromUrl(url) {
  try {
    if (!url || url.startsWith("chrome://") || url.startsWith("chrome-extension://") || url.startsWith("view-source:")) {
      return null;
    }
    const hostname = new URL(url).hostname;
    // Get the main domain (e.g., youtube.com from www.youtube.com or m.youtube.com)
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  } catch (error) {
    return null;
  }
}

function getTodayKey() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function classifyDomain(domain) {
  if (!domain) return "neutral";
  if (PRODUCTIVE_DOMAINS.includes(domain)) return "productive";
  if (UNPRODUCTIVE_DOMAINS.includes(domain)) return "unproductive";
  return "neutral";
}

async function persistTrackingState() {
  await chrome.storage.local.set({ trackingState });
}

async function restoreTrackingState() {
  if (trackingStateLoaded) return;
  trackingStateLoaded = true;
  const stored = await chrome.storage.local.get(["trackingState"]);
  if (stored.trackingState) {
    trackingState = stored.trackingState;
  }
}

async function saveUsage(domain, durationMs) {
  if (!domain || durationMs <= 0) return;

  const todayKey = getTodayKey();
  const storageData = await chrome.storage.local.get(["dailyUsage", "domainTotals"]);
  const dailyUsage = storageData.dailyUsage || {};
  const domainTotals = storageData.domainTotals || {};

  if (!dailyUsage[todayKey]) {
    dailyUsage[todayKey] = {};
  }
  dailyUsage[todayKey][domain] = (dailyUsage[todayKey][domain] || 0) + durationMs;
  domainTotals[domain] = (domainTotals[domain] || 0) + durationMs;

  await chrome.storage.local.set({ dailyUsage, domainTotals });

  // Send to server for MongoDB storage
  try {
    await fetch('http://localhost:4000/save-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: todayKey,
        domain: domain,
        ms: durationMs
      })
    });
  } catch (error) {
    console.error('Failed to send data to server:', error);
  }
}

async function updateActiveTabUsage() {
  if (!trackingState.activeDomain || !trackingState.lastActiveTime) {
    return;
  }

  const durationMs = Date.now() - trackingState.lastActiveTime;
  if (durationMs <= 0) return;

  await saveUsage(trackingState.activeDomain, durationMs);
  trackingState.lastActiveTime = Date.now();
  await persistTrackingState();
}

async function refreshActiveTabInfo() {
  try {
    await restoreTrackingState();
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      trackingState = { activeTabId: null, activeWindowId: null, activeDomain: null, lastActiveTime: null };
      await persistTrackingState();
      return;
    }

    const domain = getDomainFromUrl(tab.url);
    if (!domain) {
      trackingState = { activeTabId: null, activeWindowId: null, activeDomain: null, lastActiveTime: null };
      await persistTrackingState();
      return;
    }

    if (trackingState.activeTabId === tab.id && trackingState.activeWindowId === tab.windowId && trackingState.activeDomain === domain) {
      // Same active tab still open: save elapsed time and continue tracking.
      await updateActiveTabUsage();
      trackingState.lastActiveTime = Date.now();
      await persistTrackingState();
      return;
    }

    await updateActiveTabUsage();
    trackingState.activeTabId = tab.id;
    trackingState.activeWindowId = tab.windowId;
    trackingState.activeDomain = domain;
    trackingState.lastActiveTime = Date.now();
    await persistTrackingState();
  } catch (error) {
    console.error('Error refreshing active tab info:', error);
  }
}

chrome.tabs.onActivated.addListener(async () => {
  await refreshActiveTabInfo();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    await refreshActiveTabInfo();
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (tabId === trackingState.activeTabId) {
    await updateActiveTabUsage();
    trackingState = { activeTabId: null, activeWindowId: null, activeDomain: null, lastActiveTime: null };
    await persistTrackingState();
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await updateActiveTabUsage();
    trackingState = { activeTabId: null, activeWindowId: null, activeDomain: null, lastActiveTime: null };
    await persistTrackingState();
    return;
  }
  await refreshActiveTabInfo();
});

chrome.alarms.create("dailyReset", { periodInMinutes: 30 });
chrome.alarms.create("activeTabUpdate", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "dailyReset") {
    const todayKey = getTodayKey();
    const storageData = await chrome.storage.local.get(["dailyUsage"]);
    const dailyUsage = storageData.dailyUsage || {};
    if (!dailyUsage[todayKey]) {
      await chrome.storage.local.set({ dailyUsage });
    }
    return;
  }

  if (alarm.name === "activeTabUpdate") {
    await refreshActiveTabInfo();
    return;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "refreshData") {
    refreshActiveTabInfo().then(() => sendResponse({ success: true }));
    return true;
  }
});
