# 📡 Vinyl Radar — Personal Vinyl Library

> Scan. Grade. Value. Your record collection, finally organized.

Vinyl Radar is a progressive web app for vinyl collectors. Scan a barcode, get full album metadata from Discogs and MusicBrainz, grade your copy using the Goldmine standard, and watch your collection's estimated value update in real time. No account required. Runs in the browser. Works offline.

---

## Features

**📦 Barcode Scanning**
Uses the browser-native `BarcodeDetector` API — point at a sleeve barcode and Vinyl Radar looks up the release automatically. Manual entry fallback for every browser.

**🎵 Rich Metadata**
Pulls from Discogs and MusicBrainz: cover art, tracklist, label, catalog number, country, year, and pressing details.

**💰 Valuation Engine**
Built on the Goldmine grading scale. Grade your vinyl and sleeve separately — Vinyl Radar blends them (70% vinyl / 30% sleeve) against live Discogs market data to give you a realistic low–high estimate. See what you paid vs. what it's worth today.

**📊 Stats Dashboard**
Total collection value, genre breakdown, decade distribution, and your most valuable records at a glance.

**❤️ Wishlist**
Flag records you're hunting. Keep the want list in the same place as the have list.

**📤 Export / Import**
Full CSV and JSON export. JSON restore to migrate between devices or back up your library.

---

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/yourusername/vinyl-radar.git
   cd vinyl-radar
   npm install
   npm run dev
   ```

2. Get a free Discogs personal access token at [discogs.com/settings/developers](https://www.discogs.com/settings/developers) and paste it into **Settings** inside the app. Without it, market prices and full tracklists won't load.

3. Start scanning.

---

## Discogs Token

Vinyl Radar uses the Discogs API for release lookup and market pricing. The free personal access token unlocks:
- Full tracklist and pressing details
- Live market price suggestions (low / median / high)
- Condition-adjusted valuations

No token = basic info only, no pricing.

---

## Roadmap

- [ ] Google Drive sync (OAuth flow — requires a deployed origin)
- [ ] PWA install + offline service worker (ready to wire up on deploy)
- [ ] Discogs collection import (bulk sync existing Discogs library)
- [ ] Listening history / play log
- [ ] "For sale" mode with condition-adjusted price suggestions

---

## License

MIT
