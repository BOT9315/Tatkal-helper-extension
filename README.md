# 🚆 Tatkal Helper — IRCTC Chrome Extension

> Auto-fill passenger details on IRCTC during Tatkal booking — save every precious second.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-orange.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)
![Node](https://img.shields.io/badge/node-18%2B-green.svg)

---

## 📸 Preview

> Extension popup lets you save multiple passenger profiles and fill IRCTC forms instantly with one click.

---

## ✨ Features

- 💾 **Save multiple passenger profiles** — Name, Age, Gender, Berth preference
- ✍️ **One-click form fill** — Injects saved data directly into IRCTC passenger fields
- 🤖 **AI success predictor** — Estimates your Tatkal booking probability based on seats, day, and train popularity
- 🔔 **Telegram seat alerts** — Get notified the moment Tatkal seats open
- 🌙 **Dark themed UI** — Easy on the eyes during early morning booking rushes

---

## 🗂 Project Structure

```
tatkal-helper-extension/
├── manifest.json          # Chrome Extension manifest (v3)
├── popup.html             # Extension popup UI
├── popup.css              # Popup styles
├── popup.js               # Profile management logic
├── content.js             # Injected into irctc.co.in — fills form fields
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── server/
    ├── server.js          # Express backend (port 3000)
    ├── seat_checker.py    # Seat availability checker + Telegram alerts
    ├── tatkal_ai.py       # Flask AI prediction service (port 5000)
    └── package.json
```

---

## 🚀 Getting Started

### 1. Load the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the root `tatkal-helper-extension/` folder *(the one containing `manifest.json`)*
5. The 🚆 icon will appear in your toolbar — pin it via the 🧩 puzzle icon

---

### 2. Start the Backend Server

```bash
cd server
npm install
npm start
# ✅ Running on http://localhost:3000
```

---

### 3. Start the AI Prediction Service

```bash
pip install flask flask-cors requests
python server/tatkal_ai.py
# ✅ Running on http://localhost:5000
```

---

## ⚙️ Environment Variables

Create a `.env` file inside `server/` or set these in your shell before running `seat_checker.py`:

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token (from @BotFather) |
| `TELEGRAM_CHAT_ID` | Your personal Telegram chat ID |
| `RAPIDAPI_KEY` | RapidAPI key for IRCTC train availability API |

---

## 🔌 API Reference

### `POST /check-seat`
Check seat availability for a train and trigger a Telegram alert if seats are found.

**Request body:**
```json
{
  "train": "12345",
  "from": "NDLS",
  "to": "BCT",
  "date": "2025-05-01"
}
```

**Response:**
```json
{ "status": "seats_available", "seats": 6 }
```

---

### `GET /predict-tatkal`
Get an AI-estimated probability of successfully booking a Tatkal ticket.

**Query params:** `seats`, `day`, `popularity` (1–10)

```
GET http://localhost:3000/predict-tatkal?seats=15&day=Monday&popularity=3
```

**Response:**
```json
{
  "tatkal_probability": 72,
  "prediction": "High Success",
  "inputs": { "seats": 15, "day": "Monday", "train_popularity": 3 }
}
```

---

## 🧠 How the AI Predictor Works

The predictor uses a scoring heuristic based on three factors:

| Factor | Effect |
|---|---|
| Available seats | More seats → higher score |
| Train popularity (1–10) | More popular → lower score |
| Day of travel | Friday / Saturday / Sunday → −15 points |

Score is clamped to **0–100** and mapped to a label:

| Score | Label |
|---|---|
| 70–100 | 🟢 High Success |
| 40–69 | 🟡 Medium Success |
| 0–39 | 🔴 Low Success |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Chrome Extension | Manifest V3, Vanilla JS |
| Backend | Node.js, Express |
| AI Service | Python, Flask |
| Seat Alerts | Python, Telegram Bot API |
| Styling | CSS3 with Google Fonts |

## ⚠️ Disclaimer

This tool is intended to **assist** with form filling and provide booking insights. It does not automate actual ticket purchases. Always comply with IRCTC's terms of service.

---

## 📄 License

ISC © 2025


Auto-fills IRCTC passenger details during Tatkal booking to save precious seconds.

## Project Structure

```
tatkal-helper/
├── manifest.json        # Chrome extension manifest (v3)
├── popup.html           # Extension popup UI
├── popup.css            # Popup styles
├── popup.js             # Profile management logic
├── content.js           # Injected into irctc.co.in — fills the form
├── icons/               # Extension icons (16, 48, 128 px)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── server.js            # Node.js backend (Express)
├── seat_checker.py      # Python: seat availability + Telegram alert
├── tatkal_ai.py         # Python/Flask: Tatkal success predictor
└── package.json
```

---

## Chrome Extension Setup

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** → select this folder
4. The 🚆 icon will appear in your toolbar

> **Icons**: Add `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`  
> You can resize your existing `icon.png` to these sizes.

---

## Backend Setup

### Node server (seat checker + AI proxy)

```bash
npm install
npm start
# Runs on http://localhost:3000
```

### Python dependencies

```bash
pip install requests flask flask-cors
```

### AI prediction service

```bash
python tatkal_ai.py
# Runs on http://localhost:5000
```

### Seat checker (standalone test)

```bash
python seat_checker.py 12345 NDLS BCT 2025-05-01
```

---

## Environment Variables

Set these before running `seat_checker.py`:

| Variable              | Description                        |
|-----------------------|------------------------------------|
| `TELEGRAM_BOT_TOKEN`  | Your Telegram bot token            |
| `TELEGRAM_CHAT_ID`    | Your Telegram chat ID              |
| `RAPIDAPI_KEY`        | RapidAPI key for IRCTC API access  |

---

## API Endpoints

| Method | Endpoint         | Description                         |
|--------|-----------------|-------------------------------------|
| POST   | `/check-seat`   | Check seat availability             |
| GET    | `/predict-tatkal` | Get booking success probability   |

### POST `/check-seat`
```json
{ "train": "12345", "from": "NDLS", "to": "BCT", "date": "2025-05-01" }
```

### GET `/predict-tatkal`
```
?seats=15&day=Monday&popularity=7
```
