# Environment Variables Setup

## Required Environment Variables

Set these in **Vercel Dashboard → Settings → Environment Variables**:

### Production Environment

```
NEXT_PUBLIC_BASE_URL=https://tool-selector.torqking.com
NEXT_PUBLIC_MAIN_SITE_URL=https://torqking.com
```

### Preview/Development Environment

```
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
NEXT_PUBLIC_MAIN_SITE_URL=https://torqking.com
```

## Optional Environment Variables

### Google Search Console Verification

```
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code-here
```

## Local Development

Create a `.env.local` file in the project root (this file is gitignored):

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_SITE_URL=https://torqking.com
```

## Notes

- All variables starting with `NEXT_PUBLIC_` are exposed to the browser
- After adding/changing environment variables in Vercel, you need to redeploy
- Use different values for Production, Preview, and Development environments
