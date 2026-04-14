# Productivity Tracker Setup Guide

This guide explains how to install and run the Chrome extension, dashboard, and optional backend server.

## 1. Chrome Extension Setup

### Requirements
- Google Chrome
- Developer mode enabled in Chrome extensions

### Steps
1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** using the toggle in the top right.
3. Click **Load unpacked**.
4. Select the root folder of this repo.
5. Confirm `Productivity Tracker` appears in the extension list.

## 2. Running the React Dashboard

### Install dependencies

```bash
cd dashboard
npm install
```

### Start the dashboard

```bash
npm run dev
```

### Open the app
- Use the local URL printed by Vite (usually `http://localhost:5173` or `http://localhost:5177`).

## 3. Optional Server Setup

### Install dependencies

```bash
cd server
npm install
```

### Create environment file

Create `server/.env` with:

```text
MONGODB_URI=mongodb://localhost:27017/productivity-tracker
PORT=4000
```

### Start the server

```bash
node server.js
```

### Verify the server
- Visit `http://localhost:4000` or use a tool like Postman.

## 4. MongoDB Setup

### Local MongoDB
- Install MongoDB Community Edition or use Docker.
- Start the MongoDB service.

### MongoDB Atlas
- Create a free cluster.
- Copy the connection string and replace the URI in `server/.env`.

## 5. Common Commands

### Dashboard
```bash
cd dashboard
npm run dev
```

### Server
```bash
cd server
node server.js
```

### Cleaning up
- Remove `node_modules/` if you need to reset dependencies:

```bash
rm -rf node_modules
```

## 6. Notes

- Do not commit `.env` files to Git.
- Do not commit `node_modules/`.
- The dashboard and extension can run independently.
- The backend is optional and only required for MongoDB persistence.
