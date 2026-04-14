# STEP-BY-STEP CHROME EXTENSION DEPLOYMENT

## 🎯 GOAL
Deploy the "Productivity Tracker" extension to track your browsing time for one day across different websites.

---

## 📋 PREREQUISITES
- ✅ Google Chrome installed
- ✅ Extension files in: `C:\Users\Nithin Sangsi\Desktop\Chrome_Extension`
- ✅ Dashboard running at: `http://localhost:5175`

---

## 🚀 STEP 1: LOAD EXTENSION INTO CHROME (2 minutes)

### Action 1.1: Open Extensions Page
```
OPEN GOOGLE CHROME
  ↓
Type in address bar: chrome://extensions
  ↓
Press ENTER
```

**You should see**: List of installed extensions with "Developer mode" toggle in top-right

---

### Action 1.2: Enable Developer Mode
```
LOOK AT TOP-RIGHT CORNER
  ↓
CLICK the "Developer mode" toggle switch
  ↓
IT TURNS BLUE when enabled ✓
```

**Expected**: Toggle becomes blue, new buttons appear

---

### Action 1.3: Load Unpacked Extension
```
CLICK "Load unpacked" button
  ↓
NAVIGATE TO:
C:\Users\Nithin Sangsi\Desktop\Chrome_Extension
  ↓
CLICK "Select Folder"
```

**What happens**: Extension loads, appears in list with blue indicator

---

### Action 1.4: Verify Installation
You should now see:

```
✓ Extension name: "Productivity Tracker"
✓ Status: Enabled (blue toggle)
✓ Folder path: C:\Users\Nithin Sangsi\Desktop\Chrome_Extension
✓ Icon appears in toolbar (puzzle piece button)
```

---

## 🎨 STEP 2: VIEW DASHBOARD (Already Running!)

### Action 2.1: Open Dashboard
```
OPEN BROWSER TAB
  ↓
PASTE: http://localhost:5175
  ↓
PRESS ENTER

OR

CLICK LINK: http://localhost:5175
```

**You should see**:
```
┌─────────────────────────────────────────┐
│ 📊 Productivity Tracker Dashboard        │
│ Real-time browsing analytics & insights │
│ ✓ Using mock analytics data             │
├─────────────────────────────────────────┤
│ [Weekly Total: 0.0h]  [Productive: 0h]  │
│ [Unproductive: 0h]    [Neutral: 0h]     │
├─────────────────────────────────────────┤
│ Category Breakdown    │   Top Websites   │
│    [PIE CHART]        │    [BAR CHART]   │
│                       │                  │
│ (fits on single page) │ (no scrolling)   │
├─────────────────────────────────────────┤
│              Top Domains Table          │
│ # | Domain     | Hours | Category      │
│─────────────────────────────────────────│
│ 1 | github.com | 0.0h  | productive    │
│ 2 | ...        | 0.0h  | ...           │
└─────────────────────────────────────────┘
```

**Key Features**:
- All content visible without scrolling ✓
- Compact charts (260px height) ✓
- Professional gradient header ✓
- Color-coded badges ✓

---

## 📱 STEP 3: START TRACKING (Open Tabs & Browse)

### Action 3.1: Click Extension Icon
```
LOOK AT CHROME TOOLBAR (top-right)
  ↓
CLICK the puzzle piece icon
  ↓
POPUP APPEARS with current stats
```

**Popup shows**:
```
┌─────────────────────┐
│ Productivity Tracker│
├─────────────────────┤
│ Total Time Today    │
│ 0m                  │
├─────────────────────┤
│ Productive: 0m      │
│ Unproductive: 0m    │
├─────────────────────┤
│ Top 3 Sites         │
│ (none yet)          │
├─────────────────────┤
│   [Refresh Button]  │
└─────────────────────┘
```

---

### Action 3.2: Browse Websites

**Open these tabs in Chrome and keep each active for time tracking**:

| Time | Website | Category | Duration |
|------|---------|----------|----------|
| **9:00 AM** | `github.com` | Productive ✅ | 30 mins |
| **9:30 AM** | `youtube.com` | Unproductive ❌ | 30 mins |
| **10:00 AM** | `leetcode.com` | Productive ✅ | 30 mins |
| **10:30 AM** | `stackoverflow.com` | Productive ✅ | 30 mins |
| **11:00 AM** | `facebook.com` | Unproductive ❌ | 30 mins |

### How Tracking Works:
```
CLICK ON A WEBSITE TAB
  ↓
TAB IS "ACTIVE" (in focus)
  ↓
TIMER STARTS COUNTING
  ↓
LEAVE TAB ACTIVE FOR FEW MINUTES
  ↓
TIME IS RECORDED IN chrome.storage.local
  ↓
CLICK ANOTHER TAB
  ↓
FIRST TAB TIME IS SAVED
  ↓
SECOND TAB TIME STARTS COUNTING
```

⚠️ **Important**: 
- Only **active tabs** are tracked (in focus)
- Backgrounded tabs DON'T count
- Page must be **fully loaded**
- `chrome://` pages are **ignored**

---

## 🔄 STEP 4: CHECK REAL-TIME STATS (Every 30 mins)

### Action 4.1: Check Popup Stats
```
CLICK EXTENSION ICON
  ↓
READ POPUP STATS
  ↓
CLICK "Refresh" BUTTON
```

**You will see progress like**:
```
Time 9:00-9:30 AM
  Popup shows: 30m total
  github.com: 30m (productive)

Time 9:30-10:00 AM
  Popup shows: 60m total
  youtube.com: 30m (unproductive)
  github.com: 30m (productive)

And so on...
```

---

### Action 4.2: Check Dashboard
```
SWITCH TO DASHBOARD TAB
  ↓
HARD REFRESH: Ctrl+Shift+R
  ↓
LOOK AT UPDATED CHARTS
```

**Dashboard updates show**:
- ✓ Summary cards update in real-time
- ✓ Pie chart shows category %
- ✓ Bar chart shows top sites
- ✓ Table shows all domains

---

## 📊 FULL DAY TRACKING EXAMPLE

### 9:00 AM Session
```
Browse: github.com (productive)
Time: 60 minutes

Extension Storage:
{
  "2026-04-14": {
    "github.com": 3600000  // milliseconds
  }
}

Popup shows:
- Total Time: 1h
- Productive: 1h
- Unproductive: 0m
- Top Sites: github.com
```

### 10:00 AM Session (add youtube)
```
Browse: github.com (30 min) + youtube.com (30 min)
Total browsing: 60 minutes

Extension Storage:
{
  "2026-04-14": {
    "github.com": 5400000,    // 1.5 hours
    "youtube.com": 1800000    // 0.5 hours
  }
}

Popup shows:
- Total Time: 2h
- Productive: 1.5h
- Unproductive: 0.5h
- Top Sites: github.com, youtube.com
```

### End of Day Summary
```
Total tracked: 8 hours across multiple sites

Dashboard shows:
- Pie: Productive 50%, Unproductive 30%, Neutral 20%
- Bar: Top 5 sites by time spent
- Table: All 8+ tracked domains
```

---

## 🔄 DATA PERSISTENCE

### What Happens to Your Data?

```
AS YOU BROWSE:
  ↓ Every tab switch saves time
  ↓ Stored in chrome.storage.local
  ↓ Dashboard reads from storage
  ↓ Stats update in real-time

AFTER CLOSING CHROME:
  ✓ Data persists
  ✓ Reopen Chrome next day
  ✓ Data still there
  ✓ New day: Data resets (new storage key)

IF YOU UNINSTALL EXTENSION:
  ✗ All data is deleted
  ✗ Cannot recover
```

---

## ✅ VERIFICATION CHECKLIST

After 1 full day of browsing, verify:

- [ ] Extension icon shows in toolbar
- [ ] Popup updates on tab switches
- [ ] Total time increases as you browse
- [ ] Productive sites are categorized correctly
- [ ] Unproductive sites show in red
- [ ] Top 3 sites match your browsing
- [ ] Dashboard charts update
- [ ] Pie chart shows correct %
- [ ] Bar chart shows top sites
- [ ] Table shows all visited domains
- [ ] Time values are reasonable (not 0)
- [ ] Data persists after Chrome restart

---

## 🆘 QUICK TROUBLESHOOTING

### Popup shows "0m" after 1 hour of browsing
**Solution**:
1. Make sure extension is **enabled** in `chrome://extensions`
2. Check if tabs are **active** (in focus)
3. Avoid `chrome://` pages
4. Click "Refresh" in popup

### Dashboard shows "Using mock analytics data"
**Solution**:
1. Visit at least 2-3 websites with extension active
2. Hard refresh dashboard: `Ctrl+Shift+R`
3. Wait 5 seconds for data to load
4. Check if extension is installed

### Time seems incorrect
**Reasons**:
- Only active tabs count (not background tabs)
- Page must be fully loaded
- Switching tabs saves the time
- Extension must be enabled

### Dashboard won't load
**Solution**:
```bash
cd C:\Users\Nithin Sangsi\Desktop\Chrome_Extension\dashboard
npm run dev
```
Then open: `http://localhost:5175`

---

## 📈 WHAT TO EXPECT

### After 1 hour of browsing:
- Popup: 1h total, breakdown by site
- Dashboard: One entry in all charts

### After 4 hours of browsing:
- Popup: 4h total, top 3 sites visible
- Dashboard: Multiple bars in chart, pie shows categories

### After 8 hours of browsing (full day):
- Popup: 8h total, full breakdown
- Dashboard: Complete analytics, clear trends, multiple domains

---

## 🎯 FINAL CHECKLIST

Before starting your tracking day:

**Extension Setup** ✓
- [ ] Loaded into Chrome from `chrome://extensions`
- [ ] Showing "Productivity Tracker" in extension list
- [ ] Icon visible in toolbar
- [ ] Status: Enabled (blue toggle)

**Dashboard Ready** ✓
- [ ] Running at `http://localhost:5175`
- [ ] All UI visible without scrolling
- [ ] Charts display correctly

**Tracking Configured** ✓
- [ ] Productivity sites defined: linkedin.com, github.com, stackoverflow.com
- [ ] Unproductive sites defined: youtube.com, instagram.com, facebook.com
- [ ] Dashboard pulls from `chrome.storage.local`

**Ready to Browse** ✓
- [ ] Chrome open
- [ ] Extension installed
- [ ] Dashboard tab open
- [ ] First website opened
- [ ] **START TRACKING!** 🚀

---

## 🎉 YOU'RE READY!

**The extension is properly deployed and ready to track your productivity for one full day.**

1. Browse naturally with different websites
2. Check popup stats every 30 minutes
3. Open dashboard to see full analytics
4. At end of day, review your productivity breakdown

**Enjoy your productivity insights!** 📊
