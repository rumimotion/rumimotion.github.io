# RUMI Portfolio — Static Site + Decap CMS

A faithful recreation of [rumi.framer.media](https://rumi.framer.media/) built with plain HTML, CSS, and JavaScript. Hosted free on GitHub Pages with a full no-code content editor at `/admin`.

---

## 📁 File Structure

```
rumi-portfolio/
├── index.html          ← Main portfolio page
├── style.css           ← All styles (General Sans font, white/light theme)
├── script.js           ← All JavaScript (data rendering, lightbox, nav)
├── README.md           ← This file
├── _data/
│   └── site.json       ← ALL your content lives here (edit directly or via /admin)
├── admin/
│   ├── index.html      ← Decap CMS panel (go to yoursite.com/admin)
│   └── config.yml      ← CMS field definitions ← EDIT THIS FIRST
└── assets/
    └── uploads/        ← Drop all your images here
        ├── cover-chess.jpg
        ├── thumb-chess-showreel.jpg
        └── ...
```

---

## 🚀 STEP 1 — Upload to GitHub

### Option A: Drag and drop (easiest)
1. Go to [github.com](https://github.com) → Sign up / Log in
2. Click **＋** → **New repository**
3. Name it `YOUR-USERNAME.github.io` (e.g. `rumimotion.github.io`)
4. Set to **Public** → **Create repository**
5. On the empty repo page → click **uploading an existing file**
6. Drag your entire `rumi-portfolio/` folder contents into the upload area
7. Write commit message `"Initial upload"` → **Commit changes**

### Option B: GitHub Desktop (recommended for ongoing updates)
1. Download [GitHub Desktop](https://desktop.github.com)
2. Sign in → File → Clone Repository → choose your repo
3. Copy your files into the cloned folder
4. Commit → Push origin

---

## 🌐 STEP 2 — Enable GitHub Pages

1. In your repo → click **Settings** (top tab)
2. Left sidebar → **Pages**
3. Under **Source**: Branch = `main`, Folder = `/ (root)` → **Save**
4. Wait 1–2 minutes
5. ✅ Site is live at `https://YOUR-USERNAME.github.io`

---

## ✏️ STEP 3 — Set Up the /admin CMS Panel

The admin panel uses [Decap CMS](https://decapcms.org/) — free, open-source, no subscription.

### 3A — Configure OAuth (so GitHub can authenticate you)

**Using Netlify OAuth proxy (simplest):**

1. Go to [netlify.com](https://netlify.com) → Sign up free
2. Add new site → **Import from GitHub** → pick your repo → Deploy
3. Site Settings → **Identity** → Enable Identity
4. Identity → **Registration** → set to **Invite only**
5. Identity → **Git Gateway** → Enable Git Gateway
6. Go to Identity → **Invite users** → invite yourself with your email
7. Check your email → **Accept the invite** → set your password

Then in `admin/config.yml`, change the backend section to:
```yaml
backend:
  name: git-gateway
```

**That's it.** Now go to `yoursite.com/admin` → log in → edit everything visually.

---

### 3B — Update admin/config.yml

Open `admin/config.yml` and change these two lines:

```yaml
repo: YOUR-USERNAME/YOUR-REPO-NAME   # ← e.g. rumimotion/rumimotion.github.io
site_url: https://YOUR-USERNAME.github.io  # ← your live URL
```

---

## 🌍 STEP 4 — Connect Your Custom Domain

### 4A — Add domain in GitHub
1. Repo → **Settings** → **Pages** → **Custom domain**
2. Type your domain (e.g. `rumimotion.com`) → **Save**
3. GitHub creates a `CNAME` file in your repo automatically

### 4B — Update DNS at your domain registrar

Log in to where you bought your domain (GoDaddy, Namecheap, Google Domains, etc.)

Find **DNS Management** and add these records:

| Type  | Name / Host | Value                |
|-------|-------------|----------------------|
| A     | @           | 185.199.108.153      |
| A     | @           | 185.199.109.153      |
| A     | @           | 185.199.110.153      |
| A     | @           | 185.199.111.153      |
| CNAME | www         | rumimotion.github.io |

> ⏱ DNS changes take **15 minutes to 48 hours** to propagate. This is normal.

### 4C — Enable HTTPS
1. Back in GitHub → Settings → Pages
2. Once domain is verified → check **Enforce HTTPS**
3. ✅ Site is live at `https://rumimotion.com`

---

## 🖼 STEP 5 — Add Your Images

Place all images in the `assets/uploads/` folder. Recommended sizes:

| Image type        | Size          | Format |
|-------------------|---------------|--------|
| Project cover     | 1200 × 675 px | JPG    |
| Horizontal video thumb | 800 × 450 px | JPG    |
| Vertical video thumb   | 450 × 800 px | JPG    |
| Company logos     | 200 × 200 px  | JPG/PNG|
| Portrait photo    | 600 × 800 px  | JPG    |

**Free image compressor:** [squoosh.app](https://squoosh.app)

Then update the paths in `_data/site.json`:
```json
"cover": "assets/uploads/cover-chess.jpg",
"thumb": "assets/uploads/thumb-chess-showreel.jpg"
```

Or use the `/admin` panel → it uploads images automatically to `assets/uploads/`.

---

## 📝 STEP 6 — Add Your Vimeo Videos

1. Go to [vimeo.com](https://vimeo.com) and open your video
2. Copy the **number** from the URL: `vimeo.com/`**`1146513897`**
3. Open `_data/site.json` (or `/admin` → Projects → Video → Vimeo ID)
4. Paste the number in the `"vimeoId"` field

**Orientation:**
- `"horizontal"` = 16:9 landscape — 2 columns in the gallery, wide lightbox
- `"vertical"` = 9:16 portrait (Reels/Stories) — 3 columns in the gallery, narrow lightbox
- Set `"layout": "mixed"` on a project to use both orientations together

---

## 🔄 Updating the Site Later

### Via /admin panel (easiest):
1. Go to `yoursite.com/admin`
2. Log in with your Netlify Identity account
3. Edit anything → **Publish** → live in ~30 seconds

### Via direct file edit:
1. Edit `_data/site.json`
2. In GitHub repo → click the file → pencil icon → edit → **Commit changes**

### Via GitHub Desktop:
1. Edit files locally
2. GitHub Desktop → Commit → Push origin

---

## 🔑 Quick Reference — site.json Fields

```json
{
  "hero": {
    "name": "RUMI",                    // Large display name
    "title": "Motion Designer...",     // Subtitle
    "body": "HTML text...",            // Intro paragraph (HTML ok)
    "cta1Text": "View Work",           // Button 1 label
    "cta1Href": "#projects",           // Button 1 link
    "cta2Text": "Vimeo Reel ↗",       // Button 2 label
    "cta2Href": "https://vimeo.com/rumimotion"
  },
  "projects": [
    {
      "client": "Chess.com",           // Client badge on card
      "title": "Chess.com — Video",    // Project headline
      "primaryRole": "Motion Designer",// Role shown on card
      "tags": ["Motion Design"],       // Skill tags on card
      "cover": "assets/uploads/x.jpg", // Card + hero image
      "layout": "horizontal",          // horizontal | vertical | mixed
      "videos": [
        {
          "name": "Showreel",          // Video title
          "role": "Motion Designer",   // Your role
          "orientation": "horizontal", // horizontal | vertical
          "vimeoId": "1146513897",     // Vimeo video number
          "thumb": "assets/uploads/t.jpg" // Video thumbnail
        }
      ]
    }
  ]
}
```

---

## 🎨 Changing Colors / Fonts

Open `style.css` and edit the `:root` variables at the top:

```css
:root {
  --bg:       #ffffff;    /* Page background */
  --text:     #0a0a0a;    /* Primary text */
  --text-mid: #555555;    /* Secondary text */
  --border:   #e8e8e8;    /* Dividers */
  --bg-card:  #f2f2f2;    /* Card backgrounds */
}
```

---

*Built with ♥ for RUMI — Malkhaz Tchubabria*
