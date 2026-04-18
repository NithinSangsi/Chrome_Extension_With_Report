import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import jsPDF from 'jspdf';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PRODUCTIVE_DOMAINS = ['leetcode.com', 'github.com', 'stackoverflow.com', 'coursera.org', 'udemy.com', 'khanacademy.org', 'codecademy.com', 'freecodecamp.org', 'hackerrank.com', 'gitlab.com', 'bitbucket.org', 'codewars.com', 'repl.it', 'glitch.com', 'edx.org', 'datacamp.com', 'pluralsight.com', 'treehouse.com', 'educative.io', 'scrimba.com', 'developer.mozilla.org', 'docs.microsoft.com', 'python.org', 'javascript.info', 'typescriptlang.org', 'angular.io', 'react.dev', 'vue.js', 'nodejs.org', 'tailwindcss.com', 'medium.com', 'dev.to', 'hashnode.com', 'css-tricks.com', 'smashingmagazine.com', 'arstechnica.com', 'techcrunch.com', 'github.blog', 'jira.com', 'trello.com', 'notion.so', 'asana.com', 'monday.com', 'confluence.atlassian.net', 'miro.com', 'figma.com', 'heroku.com', 'netlify.com', 'vercel.com', 'aws.amazon.com', 'cloud.google.com', 'azure.microsoft.com', 'digitalocean.com', 'docker.com', 'replit.com', 'codepen.io', 'jsfiddle.net', 'github.dev', 'w3schools.com', 'geeksforgeeks.org', 'tutorialspoint.com', 'programiz.com', 'sololearn.com', 'codeforces.com', 'atcoder.jp', 'projecteuler.net', 'kaggle.com'];
const UNPRODUCTIVE_DOMAINS = ['youtube.com', 'instagram.com', 'facebook.com', 'tiktok.com', 'twitter.com', 'netflix.com', 'twitch.tv', 'reddit.com', 'pinterest.com', 'x.com', 'snapchat.com', 'nextdoor.com', 'quora.com', 'hulu.com', 'disneyplus.com', 'primevideo.com', 'dailymotion.com', 'vimeo.com', 'imgur.com', '9gag.com', 'buzzfeed.com', 'tumblr.com', 'ifunny.co', 'memedroid.com', 'funnyjunk.com', 'viralvideo.com', 'steam.com', 'epicgames.com', 'playstation.com', 'xbox.com', 'roblox.com', 'minecraft.net', 'itch.io', 'discord.com', 'amazon.com', 'ebay.com', 'alibaba.com', 'etsy.com', 'aliexpress.com', 'wish.com', 'wayfair.com', 'zappos.com', 'target.com', 'cnn.com', 'bbc.com', 'yahoo.com', 'weather.com', 'espn.com', 'nytimes.com', 'theguardian.com', 'huffpost.com', 'tmz.com', 'variety.com', 'spotify.com', 'music.apple.com', 'soundcloud.com', 'pandora.com', 'podcasts.google.com', 'whatsapp.com', 'telegram.org', 'viber.com', 'hbomax.com', 'crunchyroll.com', 'funimation.com', 'wattpad.com', 'webnovel.com', 'wuxiaworld.com', 'royalroad.com'];

const mockData = {
  dailyUsage: {
    '2026-04-08': { 'leetcode.com': 5400000, 'github.com': 3600000, 'youtube.com': 2700000 },
    '2026-04-09': { 'stackoverflow.com': 4500000, 'instagram.com': 1800000, 'github.com': 2100000 },
    '2026-04-10': { 'youtube.com': 5400000, 'leetcode.com': 3000000 },
    '2026-04-11': { 'github.com': 4200000, 'facebook.com': 1800000, 'leetcode.com': 2100000 },
    '2026-04-12': { 'stackoverflow.com': 3000000, 'instagram.com': 1200000 },
    '2026-04-13': { 'leetcode.com': 6000000, 'youtube.com': 2400000 },
    '2026-04-14': { 'github.com': 4800000, 'stackoverflow.com': 3600000, 'youtube.com': 1500000 }
  }
};

function getLast7Keys() {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

function formatHours(ms) {
  if (!ms || ms <= 0) return '0.0 hours';
  return `${(ms / 3600000).toFixed(1)} hours`;
}

function getClassification(domain) {
  if (PRODUCTIVE_DOMAINS.includes(domain)) return 'productive';
  if (UNPRODUCTIVE_DOMAINS.includes(domain)) return 'unproductive';
  return 'neutral';
}

export default function App() {
  const [usage, setUsage] = useState(mockData.dailyUsage);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  useEffect(() => {
    if (window.chrome && window.chrome.storage && window.chrome.storage.local) {
      window.chrome.storage.local.get(['dailyUsage'], (result) => {
        if (result && result.dailyUsage) {
          setUsage(result.dailyUsage);
          setLoadedFromStorage(true);
        }
      });
    }
  }, []);

  const downloadReport = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toISOString();

    doc.setFontSize(20);
    doc.text('Productivity Tracker Report', 20, 30);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 50);

    doc.text('Summary:', 20, 70);
    doc.text(`Weekly Total: ${formatHours(weeklyTotals.reduce((sum, ms) => sum + ms, 0))}`, 30, 85);
    doc.text(`Productive: ${formatHours(roundData.productive || 0)}`, 30, 95);
    doc.text(`Unproductive: ${formatHours(roundData.unproductive || 0)}`, 30, 105);
    doc.text(`Neutral: ${formatHours(roundData.neutral || 0)}`, 30, 115);

    doc.text('Top Domains:', 20, 135);
    let y = 150;
    topDomains.forEach(([domain, ms], idx) => {
      doc.text(`${idx + 1}. ${domain}: ${formatHours(ms)}`, 30, y);
      y += 10;
    });

    doc.save(`productivity-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const keys = getLast7Keys();
  const weeklyTotals = keys.map((key) => {
    const dayData = usage[key] || {};
    return Object.values(dayData).reduce((sum, value) => sum + value, 0);
  });

  const domainMap = {};
  const roundData = {};
  keys.forEach((dateKey) => {
    const dayData = usage[dateKey] || {};
    Object.entries(dayData).forEach(([domain, ms]) => {
      domainMap[domain] = (domainMap[domain] || 0) + ms;
      const classification = getClassification(domain);
      roundData[classification] = (roundData[classification] || 0) + ms;
    });
  });

  const topDomains = Object.entries(domainMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const pieData = {
    labels: ['Productive', 'Unproductive', 'Neutral'],
    datasets: [
      {
        data: [roundData.productive || 0, roundData.unproductive || 0, roundData.neutral || 0],
        backgroundColor: ['#16a34a', '#dc2626', '#f59e0b'],
        borderColor: ['#166534', '#7f1d1d', '#92400e'],
        borderWidth: 1
      }
    ]
  };

  const barData = {
    labels: topDomains.map(([domain]) => domain),
    datasets: [
      {
        label: 'Time',
        backgroundColor: '#2563eb',
        data: topDomains.map(([, ms]) => parseFloat((ms / 3600000).toFixed(1)))
      }
    ]
  };

  const pieOptions = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${(context.parsed / 3600000).toFixed(1)} hours`
        }
      }
    }
  };

  const barOptions = {
    maintainAspectRatio: true,
    responsive: true,
    indexAxis: 'y',
    scales: { x: { beginAtZero: true } },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed.x} hours`
        }
      }
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📊 Productivity Tracker</h1>
          <p className="header-subtitle">Real-time browsing analytics & insights</p>
          <p className="data-status">{loadedFromStorage ? '✓ Live data from Chrome extension' : '📋 Using mock analytics data'}</p>
        </div>
        <div className="header-actions">
          <button onClick={downloadReport} className="download-btn">📥 Download Report</button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="summary-grid">
          <article className="summary-card">
            <h3>Weekly Total</h3>
            <p className="summary-value">{formatHours(weeklyTotals.reduce((sum, ms) => sum + ms, 0))}</p>
          </article>
          <article className="summary-card productive">
            <h3>Productive</h3>
            <p className="summary-value">{formatHours(roundData.productive || 0)}</p>
          </article>
          <article className="summary-card unproductive">
            <h3>Unproductive</h3>
            <p className="summary-value">{formatHours(roundData.unproductive || 0)}</p>
          </article>
          <article className="summary-card neutral">
            <h3>Neutral</h3>
            <p className="summary-value">{formatHours(roundData.neutral || 0)}</p>
          </article>
        </section>

        <section className="charts-grid">
          <div className="chart-card pie-card">
            <h2>Category Breakdown</h2>
            <div className="chart-wrapper">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          <div className="chart-card bar-card">
            <h2>Top Websites</h2>
            <div className="chart-wrapper">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </section>

        <section className="table-card">
          <h2>Top Domains</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Domain</th>
                  <th>Time</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {topDomains.map(([domain, ms], idx) => (
                  <tr key={domain}>
                    <td>{idx + 1}</td>
                    <td>{domain}</td>
                    <td>{formatHours(ms)}</td>
                    <td><span className={`badge ${getClassification(domain)}`}>{getClassification(domain)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2026 Productivity Tracker | Track your browsing habits and boost productivity</p>
      </footer>
    </div>
  );
}
