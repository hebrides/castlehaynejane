# Quick Start: Deploy CHJ Family Farm

## TL;DR - The Simplest Path

**Use Netlify + GitHub Actions** for a completely free, zero-maintenance setup:

1. ✅ GitHub Actions updates data from Airtable → commits to repo
2. ✅ Netlify auto-deploys when repo updates
3. ✅ No server management needed
4. ✅ Free hosting forever (100GB bandwidth/month)

Total setup time: **10 minutes**

---

## How It All Works Together

### The Data Flow

```
Secretary edits Airtable
        ↓
Every 2 hours: GitHub Action fetches fresh data
        ↓
Updates server/data/*.json in GitHub repo
        ↓
Commits & pushes to GitHub
        ↓
Triggers Netlify to redeploy
        ↓
Live site has fresh data ✅
```

### Why This Works

**Key insight:** JSON files are stored **in the GitHub repo** (version controlled)
- ✅ GitHub Action can write them
- ✅ Any static host can read them
- ✅ No file-writing needed on hosting platform
- ✅ You can manually edit them if needed

---

## Setup (10 Minutes)

### Step 1: Add GitHub Secrets (Optional but Recommended)

If you want auto-updates from Airtable:

1. Go to https://github.com/hebrides/chjfamilyfarm/settings/secrets/actions
2. Click "New repository secret"
3. Add these 4 secrets (see [GITHUB_SECRETS.md](GITHUB_SECRETS.md) for values):
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_CATEGORIES_TABLE_ID`
   - `AIRTABLE_CROWDFUND_TABLE_ID`
   - `AIRTABLE_TOKEN`

**Skip this?** Site works fine with sample data already in `server/data/*.json`

### Step 2: Deploy to Netlify

1. Go to https://netlify.com (sign up with GitHub)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub → Select `hebrides/chjfamilyfarm`
4. Settings (use defaults):
   - Build command: `cd server && npm install`
   - Publish directory: `.`
5. Click "Deploy site"

**Done!** Your site is live at `random-name-123.netlify.app`

### Step 3: Add Custom Domain

1. In Netlify: Site settings → Domain management
2. Click "Add custom domain"
3. Enter: `castlehaynejane.com`
4. Follow DNS instructions (use Cloudflare DNS if domain is there)

**DNS Settings in Cloudflare:**
- Add CNAME: `castlehaynejane.com` → `your-site.netlify.app`
- Set Proxy to "DNS only" (orange cloud OFF) initially
- After SSL is working, can enable proxy

---

## Testing Locally

### Test Without Airtable (Uses Cached Data)

```bash
cd server
npm install
npm start
```

Visit: http://localhost:4000

### Test With Airtable (Live Data)

```bash
# 1. Set up environment
cp server/.env.example server/.env
nano server/.env  # Add your Airtable credentials

# 2. Manually update cache
npm run update-cache

# 3. Start server
npm start
```

### Test Like Netlify Would

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run in Netlify environment
netlify dev

# Visit http://localhost:8888
```

---

## Manual Cache Update (Without GitHub Action)

If you want to update data NOW without waiting for the Action:

```bash
# Option 1: Use the script
npm run update-cache

# Option 2: Hit the API endpoint
curl -X POST http://localhost:4000/api/refresh-cache

# Then commit the updated files
git add server/data/*.json
git commit -m "Update Airtable cache"
git push
```

---

## GitHub Actions Explained

### What Runs Automatically

**.github/workflows/refresh-cache.yml**
- **When:** Every 2 hours (or click "Run workflow" in GitHub Actions tab)
- **What:** Fetches from Airtable → updates JSON → commits to repo
- **Triggers:** Netlify auto-deploy

**.github/workflows/deploy-vps.yml** (optional)
- **When:** Every push to main branch
- **What:** Deploys to your VPS
- **Requires:** VPS secrets configured

### Trigger Manual Refresh

1. Go to https://github.com/hebrides/chjfamilyfarm/actions
2. Click "Refresh Airtable Cache"
3. Click "Run workflow" → "Run workflow"
4. Wait ~30 seconds
5. Check the commit history for new cache files

---

## Cost Summary

| Service | Cost | Purpose |
|---------|------|---------|
| GitHub | Free | Code hosting + Actions (2000 min/month) |
| Netlify | Free | Hosting + SSL + Deploy (100GB bandwidth) |
| Cloudflare | Free | Domain DNS (you already have this) |
| Airtable | Free* | Data management (*or your current plan) |
| **Total** | **$0** | 🎉 |

**Your VPS** = Optional backup, can cancel to save $5-20/month

---

## Architecture Comparison

### Option A: Netlify Only (Recommended)
```
Airtable → GitHub Action → GitHub repo → Netlify → Users
```
**Pros:** Simple, free, zero maintenance  
**Cons:** Cache updates every 2 hours max

### Option B: Netlify + VPS Backup
```
Airtable → GitHub Action → GitHub repo → Netlify/VPS → Users
```
**Pros:** Redundancy, can switch between hosts  
**Cons:** Paying for VPS you might not need

### Option C: Your VPS Only
```
Airtable → VPS (writes files) → GitHub → Netlify → Users
```
**Pros:** Full control  
**Cons:** Server maintenance, paying for VPS

---

## Next Steps (Choose Your Path)

### Path 1: Quick Win (Recommended)
1. ✅ Push code to GitHub
2. ✅ Deploy to Netlify (5 min)
3. ✅ Test with sample data
4. ⏰ Add GitHub secrets later for live data

### Path 2: Full Production Setup
1. ✅ Add GitHub secrets
2. ✅ Run cache refresh action
3. ✅ Deploy to Netlify
4. ✅ Point domain
5. ✅ Tell secretary to update Airtable

### Path 3: Keep VPS + Add Automation
1. ✅ Add GitHub secrets  
2. ✅ Add VPS secrets
3. ✅ Push to GitHub (auto-deploys to VPS)
4. ✅ Point domain to VPS
5. ⏰ Migrate to Netlify later

---

## Troubleshooting

**Volunteer page shows "Unable to fetch data"?**
- Add GitHub secrets and run cache refresh Action
- OR manually update `server/data/tasks.json` with real data

**Site not updating after Airtable changes?**
- Check if GitHub Action ran (Actions tab)
- Check if files were committed (last commit in repo)
- Manually trigger Action to force update

**Want to test GitHub Action locally?**
```bash
npm run update-cache
```

**Netlify deploy failing?**
- Check build logs in Netlify dashboard
- Verify `server/package.json` exists
- Try deploying manually: `netlify deploy --prod`

---

## Support & Documentation

- [NETLIFY_SOLUTION.md](NETLIFY_SOLUTION.md) - Detailed Netlify guide
- [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) - Cloudflare Pages alternative
- [DEPLOYMENT.md](DEPLOYMENT.md) - All hosting options compared
- [GITHUB_SECRETS.md](GITHUB_SECRETS.md) - How to set up secrets
- [README.md](README.md) - Project overview

---

## Questions?

**"Do I need Airtable?"**  
No! You can edit `server/data/*.json` files directly. Airtable just makes it easier for non-technical people.

**"Do I need a VPS?"**  
No! Netlify can host everything for free.

**"Can I switch hosts later?"**  
Yes! This setup works with Netlify, Vercel, Cloudflare Pages, your VPS, etc.

**"What if GitHub Actions stop working?"**  
Site keeps working with last cached data. You can manually update JSON files.

**"Is this production-ready?"**  
Yes! Many businesses run on this exact stack. GitHub Actions + Netlify is rock solid.
