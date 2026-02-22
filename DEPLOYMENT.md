# Deployment Guide

## Hosting Options

### 🎯 Recommended: GitHub Pages + Netlify Functions (Free)
**Best for:** Simple deployment, no server management  
**Cost:** Free (plenty of bandwidth for a farm site)

1. **Static files on GitHub Pages** (HTML/CSS/JS)
2. **API endpoints on Netlify Functions** (serverless, free tier: 125k requests/month)

**Steps:**
- Push to GitHub → auto-deploys
- Netlify detects serverless functions automatically
- Uses cached JSON files, refreshed by GitHub Action

---

### 🚀 Alternative 1: Netlify/Vercel (All-in-One, Free)
**Best for:** Zero-config, magical simplicity  
**Cost:** Free tier (100GB bandwidth/month)

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Connect GitHub repo → auto-deploys on push  
Custom domain setup in dashboard (chjfamilyfarm.com)

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

### 💪 Alternative 2: Your VPS
**Best for:** Full control, already paying for it  
**Cost:** Whatever you're paying now

**Setup:**
1. SSH into VPS
2. Clone repo: `git clone https://github.com/hebrides/chjfamilyfarm.git`
3. Install dependencies: `cd chjfamilyfarm/server && npm install`
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name chjfamilyfarm
   pm2 startup
   pm2 save
   ```
5. Set up Nginx reverse proxy (port 80 → 4000)
6. Add SSL with Let's Encrypt: `certbot --nginx -d chjfamilyfarm.com`

**Auto-deploy:**  
GitHub Action (`.github/workflows/deploy-vps.yml`) handles this - just push to main!

---

### 🏗️ Alternative 3: Cloudflare Pages + Workers (Free)
**Best for:** Speed (global CDN), generous free tier  
**Cost:** Free (100k requests/day)

- Static files on Cloudflare Pages
- API endpoints as Cloudflare Workers
- Fastest option globally

---

## GitHub Secrets Setup

For any hosting option, configure these in GitHub:  
**Settings → Secrets and variables → Actions → New repository secret**

### Required for Airtable Cache:
```
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_CATEGORIES_TABLE_ID=tblXXXXXXXXXXXXXX
AIRTABLE_CROWDFUND_TABLE_ID=tblXXXXXXXXXXXXXX
AIRTABLE_TOKEN=patXXXXXXX...
```

### For VPS Deployment (if using):
```
VPS_HOST=your.vps.ip.address
VPS_USERNAME=youruser
VPS_SSH_KEY=<paste your private SSH key>
VPS_PORT=22
VPS_DEPLOY_PATH=/var/www/chjfamilyfarm
```

---

## Testing Locally

```bash
cd server
npm install
npm start
```

Visit: http://localhost:4000

**Without Airtable credentials:** Site uses cached data from `server/data/*.json`  
**With credentials:** Creates `.env` file (copy from `.env.example`)

---

## Future Admin Panel Options

### Option A: Simple Static Admin
Create `admin.html` with password protection that:
- Edits `tasks.json` and `crowdfund.json` directly
- Commits changes to GitHub (triggers cache refresh)

### Option B: Keep Airtable
- Secretary uses Airtable interface (easier for non-technical)
- GitHub Action syncs every 2 hours
- Instant updates via manual "Refresh Cache" button

### Option C: Lightweight CMS
- [Netlify CMS](https://www.netlifycms.org/) - free, GitHub-based
- [Tina CMS](https://tina.io/) - modern, visual editing
- [Decap CMS](https://decapcms.org/) - fork of Netlify CMS

All integrate with GitHub and are non-technical friendly.

---

## Recommended Path Forward

1. ✅ **Today:** Site works in Codespaces with cached data
2. 🚀 **This week:** Deploy to Netlify (30 seconds, zero config)
3. 📊 **Keep Airtable:** Secretary can edit easily
4. ⚙️ **GitHub Action:** Syncs cache every 2 hours automatically
5. 🎨 **Later:** Add visual CMS if needed

**Fastest to "live and working":** Push to GitHub, connect to Netlify, done! 🎉
