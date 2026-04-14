# Productivity Tracker Extension - Deployment & Usage Guide

## Dashboard UI Improvements ✨
- **Responsive Layout**: Fixed side-by-side charts (pie + bar) that fit on one screen
- **Compact Design**: All content visible without scrolling on 1080p+ screens
- **Professional Header**: Gradient blue header with status indicator
- **Clean Footer**: Professional footer with branding
- **Color-Coded Cards**: Productive (green), Unproductive (red), Neutral (amber) badges
- **Improved Table**: Indexed domains with category badges
- **Icons & Emojis**: Easy visual identification of sections

---

## STEP 1: Load the Extension into Chrome

### Option A: Load Unpacked (Recommended for Testing)

1. **Open Chrome Extensions Page**
   - Type in Chrome address bar: `chrome://extensions`
   - Press Enter

2. **Enable Developer Mode**
   - Toggle the `Developer mode` switch in the top-right corner
   - It will turn blue

3. **Load Unpacked**
   - Click the `Load unpacked` button
   - Navigate to: `c:\Users\Nithin Sangsi\Desktop\Chrome_Extension`
   - Select the folder and open

4. **Verify Installation**
   - You should see "Productivity Tracker" extension in the list
   - The extension icon should appear in Chrome toolbar
   - Status: "Loaded unpacked" (blue indicator)

### Option B: Package as .crx (Optional)

If you want to distribute the extension:
1. Right-click on the extension in `chrome://extensions`
2. Click "Pack extension"
3. Select the extension folder
4. A `.crx` file will be generated

---

## STEP 2: Start Using the Extension

### The Popup (Quick Stats)

1. **Click the Extension Icon** in Chrome toolbar (puzzle piece icon)
2. A popup will appear showing:
   - **Total Time Today**: Total browsing time recorded
   - **Productive vs Unproductive**: Time breakdown by category
   - **Top 3 Sites**: Most visited websites today
3. Click **Refresh** to manually update stats

### How It Tracks

The background service worker tracks:
- ✅ Every time you open a new tab
- ✅ Every time you switch between tabs
- ✅ Extracts domain from URL (e.g., `youtube.com`, `github.com`)
- ✅ Calculates time spent on each domain
- ✅ Stores data locally in Chrome storage

**Important**: Time only counts when:
- The tab is **active** (in focus)
- The page is **fully loaded**
- The URL is **valid** (not `chrome://`, `about:`, etc.)

---

## STEP 3: Run the Dashboard

The dashboard displays advanced analytics with charts and reports.

### Prerequisites
- Node.js and npm installed
- Dashboard dependencies installed (already done)

### Start Dashboard

1. **Open Terminal/PowerShell** at dashboard folder
   ```bash
   cd c:\Users\Nithin Sangsi\Desktop\Chrome_Extension\dashboard
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Vite will display: `Local: http://localhost:5173`
   - Click the link or type in browser

4. **View Analytics**
   - **Summary Cards**: Weekly total, productive/unproductive/neutral hours
   - **Pie Chart**: Breakdown by category (productive %, unproductive %, neutral %)
   - **Bar Chart**: Top 5 websites by time (horizontal display)
   - **Domains Table**: All tracked domains with time & category

---

## STEP 4: Track Browsing - Testing Plan

### Test Setup (One Full Day)

Track your browsing across different sites and times:

| Time | Sites to Visit | Expected Category |
|------|----------------|-------------------|
| 9:00-10:00 AM | github.com, stackoverflow.com | Productive ✅ |
| 10:00-11:00 AM | youtube.com, instagram.com | Unproductive ❌ |
| 11:00-12:00 PM | leetcode.com | Productive ✅ |
| 12:00-1:00 PM | netflix.com, facebook.com | Unproductive ❌ |
| 1:00-2:00 PM | github.com, medium.com | Mixed 🟡 |

### How to Test

1. **Verify Tracking**
   - Open different websites in various tabs
   - Keep each tab active for a few minutes
   - Check popup to see real-time updates

2. **Check Categories**
   - Visit these productive sites: github.com, leetcode.com, stackoverflow.com
   - Visit these unproductive sites: youtube.com, instagram.com, facebook.com
   - Visit neutral sites: medium.com, news.com, reddit.com

3. **View Stats**
   - After 1 hour of browsing, open the popup
   - You should see your activity tracked
   - Refresh and see updated totals

4. **Check Dashboard**
   - Open `http://localhost:5173`
   - Dashboard shows the same data in graphical format
   - Charts update as data is stored

---

## STEP 5: Data Storage & Persistence

### Where Data is Stored
- **Location**: Chrome's local storage (per browser profile)
- **Scope**: `chrome.storage.local`
- **Capacity**: 10MB per extension

### Data Structure
```json
{
  "dailyUsage": {
    "2026-04-14": {
      "github.com": 3600000,
      "youtube.com": 1800000,
      "leetcode.com": 2700000
    }
  },
  "domainTotals": {
    "github.com": 123456000,
    "youtube.com": 987654000
  }
}
```

### Data Persistence
- ✅ Data persists between browser sessions
- ✅ Data resets **daily** (by calendar day)
- ✅ Total domain hours accumulated forever
- ✅ Survives Chrome restart
- ✅ **Deleted when extension is uninstalled**

---

## STEP 6: Troubleshooting

### Issue: Extension not tracking anything

**Solution**:
1. Verify extension is enabled in `chrome://extensions`
2. Click extension popup - does it show "Using mock analytics data"?
3. Check if background script is running:
   - Right-click extension → "Manage extension"
   - Scroll down to "Service worker"
   - Should say "RUNNING"
4. Try visiting a website and manually clicking "Refresh" in popup

### Issue: Popup shows only mock data

**Solution**:
1. Check if you're accessing `chrome-extension://` pages
2. Visit regular websites (google.com, github.com, etc.)
3. Wait a few seconds, then click "Refresh"
4. Check Chrome console for errors:
   - Right-click popup → "Inspect"
   - Check for red error messages

### Issue: Dashboard shows no data

**Solution**:
1. Dashboard loads from `chrome.storage.local`
2. Make sure you used the extension first
3. Hard refresh dashboard: `Ctrl+Shift+R`
4. If still blank, dashboard uses mock data as fallback
5. Start npm server with: `npm run dev`

### Issue: Time tracking seems incorrect

**Common reasons**:
1. **Inactive tabs don't count**: Only active (focused) tabs track time
2. **Chrome pages don't count**: `chrome://`, `chrome-extension://` pages are ignored
3. **Loading time doesn't count**: Only counts after page fully loads
4. **Switching causes reset**: When switching tabs, the previous tab time is recorded

---

## STEP 7: Optional Features

### Run Backend Server (Bonus)

For production data storage:

1. **Install dependencies**
   ```bash
   cd c:\Users\Nithin Sangsi\Desktop\Chrome_Extension\server
   npm install
   ```

2. **Create .env file** in server folder
   ```text
   MONGODB_URI=mongodb://localhost:27017/productivity-tracker
   PORT=4000
   ```

3. **Start MongoDB** (if installed locally)
   ```bash
   mongod
   ```

4. **Start Express server**
   ```bash
   node server.js
   ```

5. **API Endpoints**
   - `POST /save-usage` - Save browsing session
   - `GET /analytics` - Retrieve all analytics

---

## STEP 8: Productivity Classification

### Predefined Categories

**Productive Sites** ✅
- `leetcode.com` - Coding practice
- `github.com` - Development
- `stackoverflow.com` - Technical Q&A

**Unproductive Sites** ❌
- `youtube.com` - Video streaming
- `instagram.com` - Social media
- `facebook.com` - Social media

**Neutral Sites** 🟡
- Everything else (automatically classified)

### Customize Categories

To change categories, edit:
- **Extension popup**: `c:\Users\Nithin Sangsi\Desktop\Chrome_Extension\popup.js`
  - Lines 1-4: Modify arrays

- **Background worker**: `c:\Users\Nithin Sangsi\Desktop\Chrome_Extension\background.js`
  - Lines 1-2: Modify arrays

- **Dashboard**: `c:\Users\Nithin Sangsi\Desktop\Chrome_Extension\dashboard\src\App.jsx`
  - Lines 17-18: Modify arrays

---

## Quick Command Reference

```bash
# Load extension: chrome://extensions → Load unpacked

# Start dashboard
cd dashboard
npm install  # Already done
npm run dev

# Start backend server
cd server
npm install
node server.js

# Build dashboard for production
cd dashboard
npm run build
# Output: dashboard/dist/
```

---

## Next Steps

1. ✅ Load extension from `chrome://extensions`
2. ✅ Start the dashboard with `npm run dev`
3. ✅ Browse websites for testing
4. ✅ Check popup for real-time stats
5. ✅ Open dashboard to see analytics
6. ✅ (Optional) Start backend server

**Enjoy tracking your productivity! 🚀**
