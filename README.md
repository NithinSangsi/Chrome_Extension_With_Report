# Productivity Tracker Chrome Extension

A complete Chrome extension ecosystem for tracking browsing productivity, displaying charts and analytics, and optionally persisting usage data to MongoDB.

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Repository Structure](#repository-structure)
- [Install & Run](#install--run)
- [Data Flow](#data-flow)
- [Backend & MongoDB](#backend--mongodb)
- [What Is Tracked](#what-is-tracked)
- [Troubleshooting](#troubleshooting)
- [Additional Documentation](#additional-documentation)

## Overview

This repository contains:

- A Chrome extension using Manifest V3 that tracks active browsing time by domain.
- A popup UI for quick daily stats.
- A React dashboard for deeper analytics and reports.
- An optional Node.js + Express backend to store usage data in MongoDB.

## How It Works

1. The extension loads via `manifest.json` and runs a background service worker from `background.js`.
2. The service worker listens for tab and window activity and records active browsing time in `chrome.storage.local`.
3. Domains are classified as productive, unproductive, or neutral using built-in site lists.
4. The popup reads the stored analytics and shows today’s summary.
5. The React dashboard reads the same storage data or falls back to mock analytics for local preview.
6. Optionally, the extension can send usage data to the Express backend, which stores it in MongoDB.

## Repository Structure

- `manifest.json` - Chrome extension configuration for Manifest V3.
- `background.js` - Service worker that tracks tab activity, computes time per site, and saves usage.
- `popup.html` / `popup.js` / `styles.css` - Popup UI for quick daily viewing inside the browser.
- `icons/` - Extension icons used by Chrome.
- `dashboard/` - React dashboard app with charts, tables, and PDF report export.
- `server/` - Node.js + Express backend API for optional persistence.
- `.env` - Optional environment configuration for the server.

## Install & Run

### 1. Load the Chrome Extension

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Choose the root folder of this repo.
5. Confirm that **Productivity Tracker** appears in the extension list.

### 2. Run the Dashboard

1. Open a terminal in `dashboard/`.
2. Install dependencies:

```bash
npm install
```

3. Start the dashboard:

```bash
npm run dev
```

4. Open the local URL shown by Vite.

### 3. Optional Backend Server

1. Open a terminal in `server/`.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following values:

```text
MONGODB_URI=mongodb://localhost:27017/productivity-tracker
PORT=4000
```

4. Start the server:

```bash
node server.js
```

## Data Flow

### From Extension to Storage

- The extension captures active tab events and tracks the current domain.
- It stores daily usage and aggregated domain totals in `chrome.storage.local`.
- Each domain entry is recorded in milliseconds.

### Popup Analytics

- `popup.js` reads the current day’s usage from Chrome storage.
- It computes and displays:
  - Total browsing time today
  - Time on productive, unproductive, and neutral sites
  - Top visited domains

### Dashboard Analytics

- The React dashboard loads stored usage from Chrome storage when available.
- If Chrome storage is not accessible, it uses fallback mock analytics.
- It displays:
  - Weekly totals
  - Category breakdown pie chart
  - Top websites bar chart
  - Domain table with classification badges

## Backend & MongoDB

The backend is optional and adds a server storage layer:

- The Node.js Express server listens for POST requests at `/save-usage`.
- The server saves analytics data to MongoDB using the `MONGODB_URI` value.
- This enables persistent storage beyond Chrome local storage and supports future reporting.

### Recommended MongoDB Flow

1. Start MongoDB locally or use a hosted MongoDB Atlas cluster.
2. Point `MONGODB_URI` to the database.
3. Start the Express server.
4. The extension or dashboard can submit usage data to the backend.

## What Is Tracked

The extension tracks:

- Active browser tab duration
- Domain names extracted from active tab URLs
- Productive / unproductive / neutral classification
- Daily usage per domain
- Aggregate domain totals over time

### Example Data

```json
{
  "dailyUsage": {
    "2026-04-15": {
      "leetcode.com": 5400000,
      "github.com": 3600000,
      "youtube.com": 1800000
    }
  },
  "domainTotals": {
    "leetcode.com": 12300000,
    "github.com": 8200000,
    "youtube.com": 5400000
  }
}
```

## Troubleshooting

- If the dashboard shows mock data, make sure the extension is installed and running.
- If the extension fails to load, verify `manifest.json` and enable Developer mode.
- If server storage is not working, confirm MongoDB is running and `.env` is configured correctly.

## Additional Documentation

- `ARCHITECTURE.md` — detailed flow diagram and technical architecture.
- `SETUP.md` — step-by-step setup instructions for extension, dashboard, and server.

## Notes

- Keep `node_modules/` excluded from source control.
- Keep `.env` files out of GitHub.
- Use the dashboard for visual analytics and the popup for quick daily summaries.
