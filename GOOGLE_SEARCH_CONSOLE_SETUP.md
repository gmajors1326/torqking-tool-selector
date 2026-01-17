# Google Search Console Setup Guide

## Issue: "URL not in property" Error

When you see the error "URL not in property" in Google Search Console, it means the URL `https://torqking-tool-selector.vercel.app/` hasn't been added as a property in your Google Search Console account.

## Steps to Fix

### 1. Add the Vercel URL as a Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"** (or use the property dropdown)
3. You'll see two options:
   - **"Domain"** - ❌ Don't select this
   - **"URL prefix"** - ✅ Select this one
4. Enter: `https://torqking-tool-selector.vercel.app`
5. Click **"Continue"**

### 2. Verify Ownership

After clicking "Continue", Google will show you the verification screen. You'll see:

- **"HTML file"** is shown as the recommended/default method (at the top)
- **"Other verification methods"** section below (collapsed)

**⚠️ IMPORTANT: Use "HTML tag" method (NOT HTML file)**

- ❌ **"HTML file"** - Often fails with Next.js/Vercel deployments (don't use this)
- ❌ **"Domain name provider" (DNS)** - Won't work for `vercel.app` subdomains
- ✅ **"HTML tag"** - Best option for Vercel deployments (use this!)

#### Step-by-Step: HTML Meta Tag Verification

**Step 1: Expand "HTML tag" Method**
- Scroll down to the **"Other verification methods"** section
- Click on **"HTML tag"** to expand it
- It will show: "Add a meta tag to your site's home page"
- Google will display a meta tag like:
  ```html
  <meta name="google-site-verification" content="abc123xyz789..." />
  ```

**Step 2: Copy the Verification Code**
- Copy ONLY the content value (the code between the quotes)
- Example: If the tag shows `content="abc123xyz789"`, copy: `abc123xyz789`
- Don't copy the entire meta tag, just the code inside the quotes
- You'll see something like: `google621a7f5d3cfad65a` (your code will be different)

**Step 3: Add to Vercel Environment Variables**
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Select your project: **torqking-tool-selector**
- Go to **Settings → Environment Variables**
- Click **"Add New"**
- **Key**: `NEXT_PUBLIC_GOOGLE_VERIFICATION`
- **Value**: Paste the verification code (just the code, not the full meta tag)
- **Environment**: Select **Production** (and optionally Preview/Development)
- Click **"Save"**

**Step 4: Redeploy**
- Go to **Deployments** tab
- Click the **"..."** menu on the latest deployment
- Click **"Redeploy"** (or wait for automatic deployment on next push)
- Wait for deployment to complete (usually 1-2 minutes)

**Step 5: Verify in Google Search Console**
- Wait 2-3 minutes after deployment completes
- Go back to Google Search Console (you should still be on the verification page)
- Click **"Verify"** button
- ✅ Should show "Ownership verified"

## If You Already Selected DNS Verification

If you already selected "Domain name provider" (DNS) and it failed:

1. On the verification page, look for a link that says **"Alternate methods"** or **"Try a different method"**
2. Click it to see other verification options
3. Select **"HTML tag"** from the list
4. Follow Steps 2-5 above

## Why DNS Verification Doesn't Work for Vercel Subdomains

When you use `torqking-tool-selector.vercel.app`, Vercel controls the DNS for the `vercel.app` domain. You cannot add DNS TXT records for Vercel subdomains - only Vercel can do that.

**Solution**: Use the HTML meta tag method instead (see above).

## If You Have a Custom Domain

If you later connect a custom domain (e.g., `tool-selector.torqking.com`), you can:
- Use DNS verification (you control your domain's DNS)
- Continue using HTML meta tag (works for any domain)

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

**"Ownership verification failed" - "Your meta tag is not formatted correctly"?**

This error usually means one of these issues:

1. **Environment variable not set or incorrect:**
   - Go to Vercel → Settings → Environment Variables
   - Check that `NEXT_PUBLIC_GOOGLE_VERIFICATION` exists
   - Make sure the **value** is ONLY the verification code (no quotes, no spaces, no `<meta>` tag)
   - Example: If Google shows `content="abc123xyz789"`, your Vercel value should be: `abc123xyz789`
   - ❌ Wrong: `<meta name="google-site-verification" content="abc123xyz789" />`
   - ❌ Wrong: `"abc123xyz789"` (with quotes)
   - ✅ Correct: `abc123xyz789` (just the code)

2. **Environment variable not applied to Production:**
   - In Vercel, when adding the variable, make sure **Production** is selected
   - If you only selected Preview/Development, it won't work for production

3. **Deployment hasn't happened yet:**
   - After adding/changing environment variables, you MUST redeploy
   - Go to Deployments → Click "..." → "Redeploy"
   - Wait for deployment to complete (check the status)

4. **Verify the meta tag is in the HTML:**
   - After deployment, visit: `https://torqking-tool-selector.vercel.app/`
   - Right-click → "View Page Source" (or Ctrl+U)
   - Search for "google-site-verification"
   - You should see: `<meta name="google-site-verification" content="your-code-here" />`
   - If it's missing, the environment variable isn't set correctly

5. **Wait before verifying:**
   - After deployment completes, wait 2-3 minutes
   - Google needs time to crawl the updated page
   - Then try verifying again in Google Search Console

**Still not working?**
- Double-check you copied ONLY the code from Google (not the full meta tag)
- Make sure there are no extra spaces before/after the code in Vercel
- Try removing and re-adding the environment variable
- Redeploy after making changes
