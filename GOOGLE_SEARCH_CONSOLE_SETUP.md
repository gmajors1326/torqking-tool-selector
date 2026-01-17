# Google Search Console Setup Guide

## Issue: "URL not in property" Error

When you see the error "URL not in property" in Google Search Console, it means the URL `https://torqking-tool-selector.vercel.app/` hasn't been added as a property in your Google Search Console account.

## Steps to Fix

### 1. Add the Vercel URL as a Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"** (or use the property dropdown)
3. Select **"URL prefix"** (not "Domain")
4. Enter: `https://torqking-tool-selector.vercel.app`
5. Click **"Continue"**

### 2. Verify Ownership

**⚠️ IMPORTANT: Use HTML Meta Tag method (NOT HTML file)**

The HTML file method often fails with Next.js/Vercel deployments. Use the meta tag method instead:

#### Step-by-Step: HTML Meta Tag Verification

1. **In Google Search Console**, when prompted to verify:
   - Click **"Alternate methods"** or **"HTML tag"** (not HTML file)
   - Google will show you a meta tag like:
     ```html
     <meta name="google-site-verification" content="abc123xyz789..." />
     ```
   - Copy ONLY the content value (the part after `content="` and before `"`)

2. **Add to Vercel Environment Variables**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project: **torqking-tool-selector**
   - Go to **Settings → Environment Variables**
   - Click **"Add New"**
   - **Key**: `NEXT_PUBLIC_GOOGLE_VERIFICATION`
   - **Value**: Paste the verification code (just the code, not the full meta tag)
   - **Environment**: Select **Production** (and optionally Preview/Development)
   - Click **"Save"**

3. **Redeploy**:
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"** (or wait for automatic deployment on next push)

4. **Verify in Google Search Console**:
   - Wait 2-3 minutes after deployment completes
   - Go back to Google Search Console
   - Click **"Verify"** button
   - ✅ Should show "Ownership verified"

#### Option B: HTML File Upload

1. Download the HTML verification file from Google Search Console
2. Upload it to the `public/` folder in your project
3. Commit and push to GitHub
4. Wait for Vercel to deploy
5. Verify in Google Search Console

#### Option C: DNS Verification

If you have a custom domain, you can verify via DNS TXT record.

### 3. Request Indexing

Once verified:

1. In Google Search Console, go to **"URL Inspection"** tool
2. Enter: `https://torqking-tool-selector.vercel.app/`
3. Click **"Request Indexing"**
4. Google will crawl and index your homepage

### 4. Submit Sitemap

1. In Google Search Console, go to **"Sitemaps"** (under Indexing)
2. Enter: `sitemap.xml`
3. Click **"Submit"**

Your sitemap is available at: `https://torqking-tool-selector.vercel.app/sitemap.xml`

## Current Configuration

✅ **robots.txt**: Allows indexing of homepage, blocks `/results` pages  
✅ **Sitemap**: Includes homepage only (dynamic pages excluded)  
✅ **Meta Tags**: Properly configured for SEO  
✅ **Canonical URLs**: Set correctly  

## Environment Variables in Vercel

Make sure these are set in **Vercel → Settings → Environment Variables**:

```
NEXT_PUBLIC_BASE_URL=https://torqking-tool-selector.vercel.app
NEXT_PUBLIC_MAIN_SITE_URL=https://www.thetorqking.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code-here (after you get it from Google)
```

## Notes

- The `/results` pages are intentionally **no-indexed** (they're dynamic and shouldn't be indexed)
- Only the homepage (`/`) is included in the sitemap
- After adding environment variables, Vercel will automatically redeploy
- It may take a few days for Google to fully index your site

## Troubleshooting

**Still getting "URL not in property"?**
- Make sure you're logged into the correct Google account
- Check that you've added the exact URL (including `https://`)
- Try switching properties using the dropdown in Google Search Console

**Verification failed?**
- Make sure the meta tag is in the `<head>` section (it should be automatically added)
- Check that the environment variable is set for the **Production** environment
- Wait a few minutes after deployment before verifying
