# Castle Hayne Jane's Family Farm Online

Website for family farm and event space.

## 🚀 Quick Deploy

**Want to go live in 10 minutes?** See **[QUICKSTART.md](QUICKSTART.md)**

**TL;DR:**
1. Push to GitHub ✅ (you're here!)
2. Connect to Netlify (free)
3. Live site with working data immediately
4. Auto-updates from Airtable every 2 hours (optional)

---

## How It Works

This site uses a **smart caching system** that works anywhere:

```
Airtable (optional)
    ↓
GitHub Action (every 2 hours)
    ↓
Updates server/data/*.json in GitHub repo
    ↓
Host auto-deploys (Netlify/Cloudflare/VPS/etc)
    ↓
Users see fresh data ✅
```

**Key features:**
- ✅ Works without Airtable (uses sample cached data)
- ✅ Works on any hosting (Netlify, Cloudflare, VPS, GitHub Pages)
- ✅ Auto-updates every 2 hours (when configured)
- ✅ Falls back to cache if Airtable is down
- ✅ Can manually edit JSON files
- ✅ Version controlled data (see change history)

---

### GitHub Secrets Setup

For Airtable cache refresh (Settings → Secrets → Actions):
```
AIRTABLE_BASE_ID
AIRTABLE_CATEGORIES_TABLE_ID
AIRTABLE_CROWDFUND_TABLE_ID
AIRTABLE_TOKEN
```

For VPS deployment (optional):
```
VPS_HOST
VPS_USERNAME
VPS_SSH_KEY
VPS_PORT
VPS_DEPLOY_PATH
```

## Project Structure
```
/
├── *.html                  # Static pages
├── css/                    # Stylesheets
├── js/                     # Client-side JavaScript
├── server/                 # Node.js/Express API
│   ├── index.js           # Server with intelligent caching
│   ├── data/              # Cached JSON (works offline!)
│   │   ├── tasks.json
│   │   └── crowdfund.json
│   └── .env.example       # Environment template
└── .github/workflows/      # Automation
    ├── refresh-cache.yml  # Auto-refresh every 2 hours
    └── deploy-vps.yml     # Auto-deploy to VPS
```

## Development Notes

The `.env` file is gitignored to keep your API keys secure.
