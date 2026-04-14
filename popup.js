const PRODUCTIVE_DOMAINS = ["leetcode.com", "github.com", "stackoverflow.com", "coursera.org", "udemy.com", "khanacademy.org", "codecademy.com", "freecodecamp.org", "hackerrank.com"];
const UNPRODUCTIVE_DOMAINS = ["youtube.com", "instagram.com", "facebook.com", "tiktok.com", "twitter.com", "netflix.com", "twitch.tv", "reddit.com", "pinterest.com"];

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
