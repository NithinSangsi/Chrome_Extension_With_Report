# Productivity Tracker Architecture

This document describes how the extension, dashboard, and optional backend work together.

## System Overview

- **Chrome Extension**: Tracks active browsing time, classifies domains, and stores analytics in Chrome storage.
- **Popup UI**: Shows daily summary and top domains from Chrome storage.
- **React Dashboard**: Displays charts and tables using the same stored analytics.
- **Optional Backend**: Receives analytics data and persists it in MongoDB.

## Chrome Extension Flow

1. `manifest.json` registers the service worker and popup.
2. `background.js` starts when the extension activates.
3. The service worker listens for:
   - active tab changes
   - window focus changes
   - tab updates
4. When a tab is active, the extension extracts the domain and begins tracking time.
5. The extension classifies each domain as:
   - `productive`
   - `unproductive`
   - `neutral`
6. The extension stores data in `chrome.storage.local`.

### Data Stored in Chrome

- `dailyUsage` stores daily timings keyed by date.
- `domainTotals` stores accumulated duration per domain.

## Popup UI Flow

- `popup.js` reads the stored analytics.
- It computes:
  - total daily browsing time
  - productive/unproductive/neutral totals
  - top domains by active duration
- It renders a simple quick-view summary.

## Dashboard Flow

- The dashboard reads data from Chrome storage when the browser environment is available.
- It falls back to mock analytics when Chrome storage is not accessible.
- Data is displayed as:
  - summary cards
  - a pie chart for category breakdown
  - a bar chart for top domains
  - a sortable domain table
- The dashboard also supports PDF report export.

## Backend & MongoDB Flow

The backend is optional and supports persistent storage:

1. The backend server is implemented in `server/server.js`.
2. The server connects to MongoDB using `MONGODB_URI`.
3. The Express API provides endpoints for saving and reading analytics.
4. If enabled, the extension or dashboard can POST usage details to the server.
5. MongoDB stores records in a collection for later reporting.

## Data Schema Example

```json
{
  "dailyUsage": {
    "2026-04-15": {
      "github.com": 3600000,
      "youtube.com": 1800000
    }
  },
  "domainTotals": {
    "github.com": 12300000,
    "youtube.com": 5400000
  }
}
```

## Technical Notes

- The extension uses Chrome Manifest V3, which requires a service worker instead of a persistent background page.
- `chrome.storage.local` is used for local persistence.
- The React dashboard is built with Vite and Chart.js.
- The backend is a lightweight Express server that can be extended in the future.
