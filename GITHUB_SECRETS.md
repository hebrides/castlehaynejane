# GitHub Secrets Setup Guide

## Why You Need This

GitHub Actions can automatically refresh your Airtable cache every 2 hours and deploy your site. But it needs your Airtable credentials stored securely.

## Step-by-Step Instructions

### 1. Get Your Airtable Credentials

**Base ID & Table IDs:**
1. Go to https://airtable.com/
2. Open your base (the database for CHJ Family Farm)
3. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - The part starting with `app` is your **AIRTABLE_BASE_ID**
4. Click on any table, then "..." menu → "Copy table URL"
5. The URL contains your table ID: `https://airtable.com/appXXX/tblYYYYYYYY/...`
   - The part starting with `tbl` is your **table ID**
6. Repeat for both:
   - Categories/Tasks table → **AIRTABLE_CATEGORIES_TABLE_ID**
   - Crowdfund table → **AIRTABLE_CROWDFUND_TABLE_ID**

**API Token:**
1. Go to https://airtable.com/create/tokens
2. Click "Create new token"
3. Name it: "CHJ Family Farm Website"
4. Add these scopes:
   - `data.records:read`
5. Add access to your base
6. Click "Create token"
7. Copy the token (starts with `pat`) → **AIRTABLE_TOKEN**

### 2. Add Secrets to GitHub

1. Go to your repository: https://github.com/hebrides/castlehaynejane
2. Click **Settings** (top right)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

Add each of these (one at a time):

| Name | Value | Example |
|------|-------|---------|
| `AIRTABLE_BASE_ID` | Your base ID | `appfGDM5L86lPcXys` |
| `AIRTABLE_CATEGORIES_TABLE_ID` | Your tasks table ID | `tblAbCdEfGhIjKlMn` |
| `AIRTABLE_CROWDFUND_TABLE_ID` | Your crowdfund table ID | `tblXyZ123456789` |
| `AIRTABLE_TOKEN` | Your personal access token | `patAbC123...` (very long) |

### 3. Test the Cache Refresh

1. Go to **Actions** tab in GitHub
2. Click "Refresh Airtable Cache" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait ~30 seconds
5. Check if `server/data/tasks.json` and `crowdfund.json` were updated

### 4. Optional: VPS Deployment Secrets

If you want to deploy to your VPS automatically:

| Name | Value | Notes |
|------|-------|-------|
| `VPS_HOST` | `123.45.67.89` | Your server IP or domain |
| `VPS_USERNAME` | `youruser` | SSH username |
| `VPS_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Your **private** SSH key |
| `VPS_PORT` | `22` | Usually 22 |
| `VPS_DEPLOY_PATH` | `/var/www/chjfamilyfarm` | Where to deploy |

**To get your SSH key:**
```bash
cat ~/.ssh/id_rsa
```
Copy the entire output including `-----BEGIN` and `-----END` lines.

## Security Notes

✅ **Safe:**
- GitHub encrypts all secrets
- They're never shown in logs
- Only available to your workflows

❌ **Never:**
- Share these in Slack/email
- Commit them to your code
- Post them in issues/PRs

## Testing Without Secrets

The site works fine without secrets! It uses cached data from `server/data/*.json`. Perfect for:
- Local development
- GitHub Codespaces
- Testing deployments

## Troubleshooting

**Cache refresh fails?**
- Check your token hasn't expired
- Verify base/table IDs are correct
- Make sure token has `data.records:read` scope

**Don't want to use GitHub Actions?**
- Just edit `server/data/*.json` directly
- Or use Netlify/Vercel with their secret management
- Or manually refresh: `curl -X POST http://localhost:4000/api/refresh-cache`

## Next Steps

Once secrets are configured:
1. Cache auto-refreshes every 2 hours ✅
2. Site always has recent data ✅
3. Works even if Airtable is down ✅
4. Non-technical staff can edit in Airtable ✅
