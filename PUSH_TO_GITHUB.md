# Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `torqking-tool-selector`
3. Description: "Industrial Torque Tool Selector Application"
4. Choose: Private or Public
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

## Step 2: Copy Your Repository URL

After creating, GitHub will show you a URL like:
- `https://github.com/YOUR_USERNAME/torqking-tool-selector.git`

## Step 3: Run These Commands

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
cd torqking-tool-selector
git remote add origin https://github.com/YOUR_USERNAME/torqking-tool-selector.git
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/torqking-tool-selector.git
git push -u origin main
```

## Troubleshooting

**If you get "repository not found":**
- Check the repository URL is correct
- Make sure the repository exists on GitHub
- Verify you have access to the repository

**If you get authentication errors:**
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**If you need to change the remote URL:**
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/torqking-tool-selector.git
```
