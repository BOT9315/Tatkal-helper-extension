"""
seat_checker.py  —  called by server.js via child_process.spawn
Usage: python seat_checker.py <train> <from> <to> <date>

Checks seat availability and sends a Telegram alert if seats are found.
"""
import sys
import os
import requests
import json

# ── Config (use env vars in production) ──────────────────────────────────────
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", " ENTER YOUR BOT TOKEN")
CHAT_ID   = os.getenv("TELEGRAM_CHAT_ID",   "ENTER YOUR CHAT ID")

# ── Telegram alert ────────────────────────────────────────────────────────────

def send_alert(message: str) -> bool:
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    try:
        resp = requests.post(url, data={"chat_id": CHAT_ID, "text": message}, timeout=10)
        return resp.status_code == 200
    except requests.RequestException as e:
        print(f"Telegram error: {e}", file=sys.stderr)
        return False

# ── Seat check ────────────────────────────────────────────────────────────────

def check_seats(train: str, from_stn: str, to_stn: str, date: str) -> dict:
    """
    Call the IRCTC / RapidAPI train availability endpoint.
    Replace this stub with a real API call once you have credentials.

    Expected return shape:
      { "available": bool, "seats": int, "class": str }
    """
    # --- STUB: replace with real API call ---
    # Example with a public RapidAPI wrapper:
    #
    # url = "https://irctc1.p.rapidapi.com/api/v1/checkSeatAvailability"
    # headers = {
    #     "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
    #     "X-RapidAPI-Host": "irctc1.p.rapidapi.com"
    # }
    # params = {
    #     "classType": "3A",
    #     "fromStationCode": from_stn,
    #     "quota": "TQ",           # TQ = Tatkal quota
    #     "toStationCode": to_stn,
    #     "trainNo": train,
    #     "date": date,
    # }
    # resp = requests.get(url, headers=headers, params=params, timeout=10)
    # data = resp.json()
    # available = data.get("data", {}).get("availability", "N/A")
    # return {"available": "AVAILABLE" in available, "seats": ..., "class": "3A"}
    # ----------------------------------------

    # Stub response — remove once real API is wired in
    return {"available": False, "seats": 0, "class": "3A"}

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 5:
        result = {"error": "Usage: seat_checker.py <train> <from> <to> <date>"}
        print(json.dumps(result))
        sys.exit(1)

    _, train, from_stn, to_stn, date = sys.argv[:5]

    info = check_seats(train, from_stn, to_stn, date)

    if info.get("available"):
        msg = (
            f"🚆 Tatkal Seat Alert!\n"
            f"Train : {train}\n"
            f"Route : {from_stn} → {to_stn}\n"
            f"Date  : {date}\n"
            f"Class : {info['class']}\n"
            f"Seats : {info['seats']}\n\n"
            f"Book NOW on IRCTC!"
        )
        send_alert(msg)
        result = {"status": "seats_available", "seats": info["seats"]}
    else:
        result = {"status": "no_seats", "seats": 0}

    # server.js reads stdout
    print(json.dumps(result))


if __name__ == "__main__":
    main()
