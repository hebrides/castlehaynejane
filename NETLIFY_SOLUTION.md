# Netlify: The All-in-One Solution

## Why Netlify Solves Everything

Netlify can host **both** your static files AND your Express server with ZERO configuration:

```
┌─────────────────────────────────────────────┐
│  Push to GitHub                              │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  GitHub Action (every 2 hours)               │
│  • Fetches from Airtable                     │
│  • Updates server/data/*.json                │
│  • Commits back to repo                      │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  Netlify Auto-Deploy                         │
│  ✅ Serves HTML/CSS/JS                       │
│  ✅ Runs Express server as Functions         │
│  ✅ Uses updated JSON files                  │
│  ✅ Custom domain (castlehaynejane.com)      │
│  ✅ Free SSL                                 │
│  ✅ Free tier (100GB bandwidth/month)        │
└─────────────────────────────────────────────┘
```

## Setup (Literally 5 Minutes)

### 1. Create `netlify.toml` (Already Done!)

The file already exists, but let me update it for your Express server:

### 2. Connect Netlify to GitHub

1. Go to https://netlify.com (sign up with GitHub)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub → Select `hebrides/chjfamilyfarm`
4. Build settings:
   - Build command: `cd server && npm install`
   - Publish directory: `.`
   - Functions directory: `netlify/functions` (optional)
5. Click "Deploy site"

**That's it!** Your site is live in ~60 seconds.

### 3. Add Environment Variables to Netlify

Site settings → Environment variables → Add:
- `AIRTABLE_BASE_ID`
- `AIRTABLE_CATEGORIES_TABLE_ID`
- `AIRTABLE_CROWDFUND_TABLE_ID`
- `AIRTABLE_TOKEN`

(Only needed if you want Netlify to fetch fresh data on deploy, but GitHub Action handles this already)

### 4. Custom Domain

Site settings → Domain management → Add custom domain: `castlehaynejane.com`

Netlify gives you DNS instructions (or use Cloudflare DNS).

## How It Works

### Automatic Deployment Flow

```
You edit Airtable
        ↓
(wait up to 2 hours)
        ↓
GitHub Action runs
        ↓
Updates server/data/*.json in repo
        ↓
Pushes to GitHub
        ↓
Netlify detects change
        ↓
Auto-deploys in ~30 seconds
        ↓
Site has fresh data! ✅
```

### What Netlify Does

**Static Files:**
- Serves all HTML/CSS/JS/images from CDN
- Global distribution (fast everywhere)

**Express Server:**
Netlify runs your Express server as:
- **Option A:** Netlify Functions (serverless)
- **Option B:** Just runs `node server/index.js` (they support this now!)

## Cost Comparison

| Feature | Netlify Free | Your VPS | Cloudflare |
|---------|--------------|----------|------------|
| Static hosting | ✅ Free | ❌ Need to configure | ✅ Free |
| API hosting | ✅ Free | ✅ Paid ($5-20/mo) | ✅ Free |
| SSL | ✅ Free | Need certbot | ✅ Free |
| Auto-deploy | ✅ Free | Need GitHub Action | ✅ Free |
| Custom domain | ✅ Free | ✅ Included | ✅ Free |
| Bandwidth | 100GB/mo | Unlimited | Unlimited |
| Build minutes | 300/mo | N/A | 500/mo |

## Testing Netlify Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Test locally (simulates Netlify environment)
netlify dev

# This will:
# - Serve static files
# - Run your Express server
# - Use your local .env file
# Visit http://localhost:8888
```

## Manual Deploy Test

```bash
# Deploy to a test URL instantly
netlify deploy --prod

# Or just push to GitHub and let auto-deploy handle it
git add .
git commit -m "Deploy to Netlify"
git push
```

## Pros & Cons

### ✅ Pros
- **Zero config:** Just connect GitHub repo
- **Free:** 100GB bandwidth is plenty for a farm site
- **Fast:** Global CDN
- **Auto-deploy:** Push to GitHub = live in 30 seconds
- **No VPS maintenance:** No server to manage/update
- **Built-in CI/CD:** No need to configure GitHub Actions for deployment
- **Easy rollbacks:** Click a button to deploy previous version

### ⚠️ Cons
- **Vendor lock-in:** Tied to Netlify (but easy to switch)
- **Free tier limits:** 300 build minutes/month (plenty for you)
- **Serverless cold starts:** First API request might be 1-2 seconds slower (rare)

## VPS vs Netlify Decision

### Keep VPS if:
- You use it for other things
- Want complete control
- Need unlimited compute/storage
- Plan to add database later

### Use Netlify if:
- ✅ This is the only site on VPS
- ✅ Want to eliminate server maintenance
- ✅ Save $5-20/month
- ✅ Want dead-simple deploys
- ✅ Don't want to configure nginx/SSL/PM2

## Hybrid Approach (Best of Both Worlds)

Use **both** during transition:

1. **Deploy to Netlify first** (5 minutes)
2. Test it for a week
3. If happy → cancel VPS and save money
4. If issues → keep VPS as backup

You can run both simultaneously at different subdomains:
- `castlehaynejane.com` → Netlify (primary)
- `vps.castlehaynejane.com` → Your VPS (backup)

## My Recommendation

**Try Netlify today:**

1. ✅ Push your code to GitHub (already done)
2. ✅ Connect Netlify (5 minutes)
3. ✅ Site is live with cached data
4. ⏰ Add GitHub secrets for Action (when ready)
5. ⏰ Point domain to Netlify

**No downtime, no risk:**
- Keep VPS running as backup
- Test Netlify with their free URL first
- Switch domain when confident

Total time: **10 minutes to live site** 🚀
