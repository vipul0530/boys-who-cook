# Boys Who Cook — Deployment Guide

This guide walks through deploying the site to Netlify and syncing with GitHub. **No coding required after initial setup.**

---

## Overview

| What | Technology | Cost |
|------|------------|------|
| Website Framework | Next.js 14 (React) | Free |
| Hosting | Netlify | Free |
| Admin Panel | Decap CMS | Free |
| Admin Login | Netlify Identity | Free (up to 1000 users) |
| Content Storage | GitHub (Git repository) | Free |
| Contact Forms | Netlify Forms | Free (up to 100/month) |

**Shaan's workflow:** Log in at `https://boyswhocook.org/admin` → edit text/photos → click Save → changes go live automatically in ~2 minutes.

---

## Step 1: Create a GitHub Account & Repository

1. Go to **github.com** and create a free account (or use an existing one)
2. Click the **+** icon → **New repository**
3. Name it: `boys-who-cook`
4. Set it to **Public** (required for Netlify's free tier)
5. Click **Create repository**
6. Follow GitHub's instructions to push the project code:

```bash
# In this project folder (C:\Projects\BoysWhoCook), open a terminal and run:
git init
git add .
git commit -m "Initial commit: Boys Who Cook website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/boys-who-cook.git
git push -u origin main
```

> Replace `YOUR-USERNAME` with your actual GitHub username.

---

## Step 2: Deploy to Netlify

1. Go to **app.netlify.com** and sign up for a free account
2. Click **Add new site** → **Import an existing project**
3. Choose **Deploy with GitHub**
4. Authorize Netlify to access your GitHub account
5. Select your **boys-who-cook** repository
6. Netlify will auto-detect the build settings. Verify they match:
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
7. Click **Deploy site**
8. Wait 2–3 minutes for the first build to complete

---

## Step 3: Set Up Custom Domain (boyswhocook.org)

1. In Netlify, go to **Site configuration → Domain management**
2. Click **Add a domain**
3. Enter `boyswhocook.org`
4. Netlify will show you DNS records to add
5. Log into your domain registrar (where you bought boyswhocook.org)
6. Add the DNS records Netlify shows you (usually 2 records)
7. Wait up to 24 hours for DNS to propagate

---

## Step 4: Enable Netlify Identity (for Admin Login)

This is what allows Shaan to log into the admin panel.

1. In Netlify, go to **Site configuration → Identity**
2. Click **Enable Identity**
3. Under **Registration**, select **Invite only** (so only Shaan can log in)
4. Under **External providers**, you can optionally enable Google login
5. Scroll down to **Services → Git Gateway**
6. Click **Enable Git Gateway** — this lets the CMS save changes to GitHub

---

## Step 5: Invite Shaan as Admin

1. Still in **Identity**, click **Invite users**
2. Enter Shaan's email address
3. He will receive an email invitation — click the link to set a password
4. That's it! Shaan can now log in at `https://boyswhocook.org/admin`

---

## Step 6: Confirm Everything Works

1. Visit `https://boyswhocook.org` — the website should load
2. Visit `https://boyswhocook.org/admin` — the admin panel should load
3. Log in with Shaan's credentials
4. Try editing the Home page heading and clicking **Save**
5. After ~2 minutes, refresh the main site to see the change

---

## How Shaan Edits the Website (Daily Use)

1. Go to `https://boyswhocook.org/admin`
2. Log in with email and password
3. Navigate the left sidebar:
   - **⚙️ Site Settings** — Change site name, logo, social links, email
   - **🏠 Home Page** — Edit hero text, mission section, stats, CTA
   - **ℹ️ About Page** — Edit story, mission/vision, core values
   - **📚 Programs** — Add/edit/delete programs (with images)
   - **📅 Events** — Add/edit/delete events
   - **📷 Gallery** — Upload photos
   - **👥 Our Team** — Add/edit team member profiles
   - **💛 Donate Page** — Edit donation info and impact stats
   - **✉️ Contact Page** — Edit contact info
4. Make changes
5. Click **Save** (top right of each page)
6. Changes appear on the live site in ~2 minutes

### Uploading Images
- In any field with an image upload button, click it
- Click **Upload** to upload a new photo from your computer
- Or paste a URL for an image already online
- Click **Choose selected** to confirm

---

## Viewing Contact Form Submissions

When someone fills out the contact form on the website, it goes to Netlify Forms:

1. In Netlify, go to **Forms** in the top menu
2. Click on the **contact** form
3. All submissions are listed there with name, email, and message

You can also set up email notifications:
1. Go to **Site configuration → Forms → Form notifications**
2. Add an email notification to get an email every time someone submits the form

---

## Updating the Website in the Future

The admin panel covers all content changes. But if you ever need to make code-level changes (e.g., add a new page layout):

1. Edit the files in this project folder
2. Open a terminal and run:
```bash
git add .
git commit -m "Description of what changed"
git push
```
3. Netlify automatically rebuilds the site when it detects a new push to GitHub

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Admin panel shows "Login" but won't accept credentials | Make sure Netlify Identity is enabled and the user was invited |
| Changes saved in admin but not showing on site | Wait 2–3 minutes for the automatic rebuild |
| Build failed in Netlify | Check the deploy log in Netlify → Deploys for the error message |
| Images not showing | Ensure the image was uploaded via the admin (not just referenced by a broken URL) |
| Form submissions not arriving | Check Netlify → Forms and verify form notifications are set up |

---

## Project File Structure (for reference)

```
boys-who-cook/
├── content/              ← All website content (edited via Admin)
│   ├── settings.json     ← Site-wide settings (name, logo, social links)
│   ├── pages/            ← Page-specific content
│   ├── programs/         ← Program entries (markdown files)
│   ├── events/           ← Event entries (markdown files)
│   ├── team/             ← Team member profiles (markdown files)
│   └── gallery/          ← Gallery photo entries (markdown files)
├── public/
│   ├── admin/            ← Decap CMS admin panel (DO NOT DELETE)
│   └── images/uploads/   ← Uploaded images go here automatically
├── src/
│   ├── app/              ← All website pages
│   └── components/       ← Reusable UI components
└── netlify.toml          ← Netlify build configuration
```
