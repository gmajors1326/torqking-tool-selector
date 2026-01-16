# Vercel Deployment Guide for Torque Tool Selector

This guide walks you through deploying the Torque Tool Selector app on Vercel and integrating it with your main website.

## Prerequisites

- Vercel account (free tier works)
- GitHub/GitLab/Bitbucket account (for automatic deployments)
- Your main website domain (torqking.com)

## Deployment Options

You have two main options for hosting:

### Option 1: Subdomain (Recommended)
**Example:** `tool-selector.torqking.com` or `selector.torqking.com`

**Pros:**
- Clean separation from main site
- Easier to manage independently
- Better for SEO (separate subdomain)
- Simpler DNS configuration

**Cons:**
- Requires DNS configuration

### Option 2: Subdirectory (via Rewrites)
**Example:** `torqking.com/tool-selector`

**Pros:**
- Appears as part of main site
- No DNS changes needed
- Shared domain authority

**Cons:**
- Requires Vercel rewrites configuration
- More complex setup

---

## Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Torque Tool Selector"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Verify Files**
   - Ensure `.gitignore` is present (excludes `.env.local`)
   - Ensure `vercel.json` is present
   - Ensure `package.json` has build scripts

### Step 2: Deploy to Vercel

#### Method A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in or create account

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your Git repository
   - Select the repository containing the tool selector

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `torqking-tool-selector` (if repo root) or leave blank if project is at root
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_BASE_URL=https://your-deployment-url.vercel.app
   NEXT_PUBLIC_MAIN_SITE_URL=https://torqking.com
   ```
   
   **For Production:**
   ```
   NEXT_PUBLIC_BASE_URL=https://tool-selector.torqking.com
   NEXT_PUBLIC_MAIN_SITE_URL=https://torqking.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Method B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd torqking-tool-selector
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? torqking-tool-selector
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

### Step 3: Configure Custom Domain

#### For Subdomain (tool-selector.torqking.com)

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Add domain: `tool-selector.torqking.com`
   - Vercel will show DNS records needed

2. **In Your DNS Provider:**
   - Add a CNAME record:
     ```
     Type: CNAME
     Name: tool-selector (or selector)
     Value: cname.vercel-dns.com
     ```
   - Or add an A record (if CNAME not supported):
     ```
     Type: A
     Name: tool-selector
     Value: 76.76.21.21 (Vercel's IP - check Vercel dashboard for current IP)
     ```

3. **Wait for DNS Propagation**
   - Usually 5-60 minutes
   - Check with: `nslookup tool-selector.torqking.com`

4. **Update Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_BASE_URL` to: `https://tool-selector.torqking.com`
   - Redeploy to apply changes

#### For Subdirectory (torqking.com/tool-selector)

This requires configuring rewrites in your main site's Vercel project:

1. **In Main Site Vercel Project:**
   - Add `vercel.json` with rewrites:
   ```json
   {
     "rewrites": [
       {
         "source": "/tool-selector/:path*",
         "destination": "https://tool-selector-app.vercel.app/:path*"
       }
     ]
   }
   ```

2. **Update Environment Variables:**
   ```
   NEXT_PUBLIC_BASE_URL=https://torqking.com/tool-selector
   ```

---

## Step 4: Link from Your Main Website

### Option A: Simple Link (Recommended)

Add a link on your main website page:

```html
<!-- Example HTML -->
<a href="https://tool-selector.torqking.com" 
   class="button-primary"
   target="_blank"
   rel="noopener noreferrer">
  Use Torque Tool Selector
</a>
```

### Option B: Embedded iframe (If Same Domain)

If using subdirectory approach, you can embed:

```html
<iframe 
  src="https://torqking.com/tool-selector"
  width="100%"
  height="1200px"
  frameborder="0"
  title="Torque Tool Selector">
</iframe>
```

**Note:** Update `X-Frame-Options` in `vercel.json` if you need to allow embedding from your main domain.

### Option C: Button/Link Component

```html
<div class="tool-selector-cta">
  <h2>Need Help Selecting a Torque Tool?</h2>
  <p>Use our interactive tool selector to find the right tool for your application.</p>
  <a href="https://tool-selector.torqking.com" 
     class="btn btn-primary"
     target="_blank">
    Launch Tool Selector →
  </a>
</div>
```

---

## Step 5: Update SEO Settings

After deployment, update these files with your actual URL:

1. **Update `public/robots.txt`:**
   ```
   Sitemap: https://tool-selector.torqking.com/sitemap.xml
   ```

2. **Verify Environment Variables:**
   - Production: `NEXT_PUBLIC_BASE_URL=https://tool-selector.torqking.com`
   - Preview: Can use Vercel's preview URL

3. **Submit Sitemap to Google:**
   - Go to Google Search Console
   - Add property: `tool-selector.torqking.com`
   - Submit sitemap: `https://tool-selector.torqking.com/sitemap.xml`

---

## Step 6: Testing

1. **Test the Deployment:**
   - Visit your deployed URL
   - Test the tool selector form
   - Verify results page works
   - Check dark mode toggle
   - Test on mobile devices

2. **Test Links from Main Site:**
   - Click link from your main website
   - Verify it opens correctly
   - Check that it opens in new tab (if using `target="_blank"`)

3. **Test SEO:**
   - View page source, check meta tags
   - Test structured data: [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Check Open Graph: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Full URL of deployed app | `https://tool-selector.torqking.com` |
| `NEXT_PUBLIC_MAIN_SITE_URL` | Main website URL (for canonical links) | `https://torqking.com` |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Google Search Console code (optional) | `abc123xyz` |

---

## Continuous Deployment

Vercel automatically deploys on every push to your main branch:

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Vercel automatically:**
   - Detects the push
   - Runs build
   - Deploys to production

3. **Preview Deployments:**
   - Every pull request gets a preview URL
   - Test before merging

---

## Troubleshooting

### Build Fails

**Error: Module not found**
- Check `package.json` dependencies
- Run `npm install` locally to verify

**Error: TypeScript errors**
- Run `npm run build` locally first
- Fix TypeScript errors before pushing

### Domain Not Working

**DNS not resolving:**
- Wait 24-48 hours for full propagation
- Check DNS records are correct
- Verify CNAME/A record in DNS provider

**SSL Certificate issues:**
- Vercel automatically provisions SSL
- May take a few minutes after DNS is set

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables
- Check variable names match exactly

### Links Not Working from Main Site

- Verify URL is correct
- Check if CORS is blocking (shouldn't be for simple links)
- Test in incognito mode to rule out caching

---

## Security Considerations

1. **Headers:** Already configured in `vercel.json`
2. **XSS Protection:** Enabled via headers
3. **Content Security:** `X-Content-Type-Options: nosniff`
4. **Frame Options:** Set to `SAMEORIGIN` (update if embedding)

---

## Performance Optimization

Vercel automatically provides:
- ✅ Edge Network (CDN)
- ✅ Automatic HTTPS
- ✅ Image optimization (Next.js Image component)
- ✅ Code splitting
- ✅ Server-side rendering

---

## Next Steps After Deployment

1. ✅ Submit sitemap to Google Search Console
2. ✅ Set up Google Analytics (if desired)
3. ✅ Test on multiple devices/browsers
4. ✅ Monitor Vercel analytics dashboard
5. ✅ Set up error tracking (Sentry, etc.)
6. ✅ Configure custom domain SSL
7. ✅ Test link from main website

---

## Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

**Last Updated:** Current deployment setup
**Status:** Ready for production deployment
