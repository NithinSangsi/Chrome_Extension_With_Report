const PRODUCTIVE_DOMAINS = ["leetcode.com", "github.com", "stackoverflow.com", "coursera.org", "udemy.com", "khanacademy.org", "codecademy.com", "freecodecamp.org", "hackerrank.com"];
const UNPRODUCTIVE_DOMAINS = ["youtube.com", "instagram.com", "facebook.com", "tiktok.com", "twitter.com", "netflix.com", "twitch.tv", "reddit.com", "pinterest.com"];

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
