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

function formatTime(ms) {
  if (!ms || ms <= 0) return "0m";
  const totalMinutes = Math.round(ms / 60000);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function getTodayKey() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function classifyDomain(domain) {
  if (PRODUCTIVE_DOMAINS.includes(domain)) return "productive";
  if (UNPRODUCTIVE_DOMAINS.includes(domain)) return "unproductive";
  return "neutral";
}

async function loadStats() {
  const todayKey = getTodayKey();
  const data = await chrome.storage.local.get(["dailyUsage"]);
  const dailyUsage = data.dailyUsage || {};
  const todayData = dailyUsage[todayKey] || {};

  const domains = Object.entries(todayData);
  let productiveMs = 0;
  let unproductiveMs = 0;
  let totalMs = 0;

  domains.forEach(([domain, ms]) => {
    totalMs += ms;
    const classification = classifyDomain(domain);
    if (classification === "productive") productiveMs += ms;
    if (classification === "unproductive") unproductiveMs += ms;
  });

  const topSites = domains.sort((a, b) => b[1] - a[1]).slice(0, 3);

  document.getElementById("total-time").textContent = formatTime(totalMs);
  document.getElementById("productive-time").textContent = `Productive: ${formatTime(productiveMs)}`;
  document.getElementById("unproductive-time").textContent = `Unproductive: ${formatTime(unproductiveMs)}`;

  const topSitesList = document.getElementById("top-sites");
  topSitesList.innerHTML = "";
  if (topSites.length === 0) {
    topSitesList.innerHTML = "<li>No browsing recorded yet.</li>";
  } else {
    topSites.forEach(([domain, ms]) => {
      const li = document.createElement("li");
      li.textContent = `${domain} — ${formatTime(ms)}`;
      topSitesList.appendChild(li);
    });
  }
}

document.getElementById("refresh-btn").addEventListener("click", async () => {
  try {
    await chrome.runtime.sendMessage("refreshData");
  } catch (error) {
    console.error('Error sending refresh message:', error);
  }
  loadStats();
});

loadStats();
