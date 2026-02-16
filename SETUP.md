# Re-Evolution Landing Page - Setup Guide

## Quick Start

```bash
npm install
npm run dev        # Development at http://localhost:3000
npm run build      # Production build
npm start          # Production server
```

---

## 1. Photos & Images

### Where to place images

All images go in `/public/images/`. No code changes needed - the site auto-detects them.

### What images are needed

| File name | Size / Format | Purpose |
|---|---|---|
| `logo.png` | ~200x60px, transparent PNG | Brand logo (Header, Footer, Hero, CTA, legal pages) |
| `portfolio-restaurant-a.*` | See below | Portfolio - Restaurant A |
| `portfolio-restaurant-b.*` | See below | Portfolio - Restaurant B |
| `portfolio-lawyer.*` | See below | Portfolio - Lawyer site |
| `og-image.jpg` | 1200x630px | Social media share image |
| `favicon.ico` | 32x32px (place in `/public/`, not `/public/images/`) | Browser tab icon |

### Portfolio images - Zero code changes needed!

Just drop files into `/public/images/` with the correct name. The site auto-detects the format.

**Priority order** (first match wins): `.mp4` > `.gif` > `.webp` > `.jpg` > `.png`

| Option | File to create | Result |
|---|---|---|
| Scroll animation (best) | `portfolio-restaurant-a.mp4` | Auto-playing looped video of site scrolling |
| Animated GIF | `portfolio-restaurant-a.gif` | Animated GIF of site scrolling |
| Static screenshot | `portfolio-restaurant-a.jpg` | Shows top of site; scrolls to bottom on hover |

### How to create scroll animation videos (recommended)

This is the best way to show your portfolio sites - a smooth scrolling video that plays automatically.

**Method 1: Screen recording (easiest)**

1. Open the portfolio site in Chrome
2. Set browser window to ~1280x720 pixels
3. Use a screen recorder:
   - **Windows**: Xbox Game Bar (Win+G) or OBS Studio (free)
   - **Mac**: QuickTime Player > File > New Screen Recording
   - **Chrome extension**: "Screen Recorder" or "Loom"
4. Scroll slowly from top to bottom of the site
5. Export as MP4
6. Trim the video to ~8-15 seconds
7. Rename to `portfolio-restaurant-a.mp4`
8. Drop into `/public/images/`

**Method 2: Full-page screenshot + auto-scroll (simpler)**

1. Open the site in Chrome
2. Press F12 (DevTools) > Ctrl+Shift+P > type "screenshot" > "Capture full size screenshot"
3. This saves a tall PNG of the entire page
4. Rename to `portfolio-restaurant-a.png`
5. Drop into `/public/images/`
6. The site will auto-scroll the image on hover (CSS animation from top to bottom)

**Method 3: Use a free tool to make a GIF**

1. Use https://gifcap.dev or https://www.screentogif.com (Windows)
2. Record the browser scrolling through the site
3. Export as GIF (~800px wide, max 5MB for performance)
4. Rename to `portfolio-restaurant-a.gif`
5. Drop into `/public/images/`

**Recommended specs for video files:**

| Setting | Value |
|---|---|
| Resolution | 800x450px (16:9) or similar |
| Duration | 8-15 seconds |
| Format | MP4 (H.264) |
| File size | Under 3MB per video |
| Frame rate | 24-30fps |

### Logo

The logo (`/public/images/logo.png`) appears automatically in:
- Header (next to brand name)
- Footer (next to brand name)
- Hero section (above the headline)
- CTA / Diagnostic form section
- Legal pages (Privacy Policy, Terms of Service)

If no `logo.png` exists, a styled "RE" fallback icon is shown.

### Hero illustration

The Hero section uses an inline SVG illustration. To replace with a custom image:
1. Place the image in `/public/images/hero-illustration.png`
2. Edit `components/sections/Hero.tsx` and replace the SVG with an `<img>` tag

---

## 2. Google Analytics

### Setup

1. Create a GA4 property at https://analytics.google.com
2. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
3. Edit `app/[locale]/layout.tsx`
4. Replace `G-XXXXXXXXXX` with your real Measurement ID on lines 97 and 105

```tsx
// Line 97 - replace:
src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
// Line 105 - replace:
gtag('config', 'G-XXXXXXXXXX', {
```

### Consent Mode

Cookie consent is pre-configured with Google Consent Mode v2. The `CookieBanner` component handles:
- Default: all tracking denied
- On "Accept": enables `analytics_storage`
- On "Reject": keeps everything denied
- Persists choice in `localStorage`

---

## 3. Form Webhook (Diagnostic Form)

The diagnostic form currently simulates a submission. To connect it to a real webhook:

### Option A: Make.com (Recommended)

1. Go to https://make.com and create a new scenario
2. Add a **Webhook** trigger module
3. Copy the webhook URL
4. Edit `components/sections/CTAForm.tsx`, replace the `onSubmit` function:

```tsx
const onSubmit = async (data: FormData) => {
  trackCTA('DiagnosticForm');
  trackFormSubmit(data.budget);

  try {
    await fetch('https://hook.eu2.make.com/YOUR_WEBHOOK_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        locale,
        timestamp: new Date().toISOString(),
        source: 'landing-page-diagnostic'
      })
    });

    setSubmittedEmail(data.email);
    setSubmitted(true);
  } catch (error) {
    console.error('Form submission failed:', error);
    // Optionally show error state to user
  }
};
```

5. In Make.com, after the Webhook module, add actions:
   - **Google Sheets** - Log all form submissions to a spreadsheet
   - **Email** - Send notification to geral@re-evolution.pt
   - **Telegram** - Send message to your Telegram bot/channel
   - **Email (2nd)** - Send auto-reply to the client

### Option B: Zapier

Same approach but use a Zapier Webhook (Catch Hook) URL instead.

### Option C: Next.js API Route

Create `app/api/diagnostic/route.ts`:

```tsx
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  // Send to your email service, database, etc.
  // Example with Resend, SendGrid, or Nodemailer

  return NextResponse.json({ success: true });
}
```

Then update the form to POST to `/api/diagnostic`.

---

## 4. Newsletter Webhook

The newsletter form in the Footer (`components/layout/Footer.tsx`) currently does nothing on submit. To connect it:

1. Add state and handler to the Footer component
2. POST to a Make.com/Zapier/Mailchimp webhook
3. Or use a service like Mailchimp, Brevo, or ConvertKit directly

---

## 5. Social Media Links

Update the actual URLs in `components/layout/Footer.tsx`:

```tsx
// Line 33 - Facebook
href="https://facebook.com/YOUR_PAGE"

// Line 42 - LinkedIn
href="https://linkedin.com/company/YOUR_COMPANY"

// Line 51 - Instagram
href="https://instagram.com/YOUR_HANDLE"
```

---

## 6. WhatsApp Number

The WhatsApp button and chatbot CTA use `+351969063633`. To change it, search and replace in:
- `components/widgets/WhatsAppButton.tsx` - floating button
- `components/widgets/Chatbot.tsx` - chatbot WhatsApp action
- `components/sections/Contact.tsx` - contact section

---

## 7. Contact Information

Update the company address, phone, and email in:

| Data | File | What to change |
|---|---|---|
| Business address | `app/[locale]/layout.tsx` (JSON-LD schema, line 64-69) | Street, city, postal code |
| Phone | `app/[locale]/layout.tsx` (line 72) | telephone field |
| Email | `app/[locale]/layout.tsx` (line 73) | email field |
| Map location | `components/sections/Contact.tsx` | Google Maps embed URL |
| Contact details | `messages/pt.json` and `messages/en.json` | `contact` section values |

---

## 8. Deployment (Vercel)

### First deploy

```bash
npm install -g vercel
vercel
```

### Connect domain

1. In Vercel dashboard, go to Settings > Domains
2. Add `re-evolution.pt`
3. Configure DNS at your registrar:
   - A record: `76.76.21.21`
   - CNAME for www: `cname.vercel-dns.com`

### Environment variables (if needed)

Set in Vercel dashboard > Settings > Environment Variables:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional, currently hardcoded) |
| `WEBHOOK_URL` | Form webhook URL (if using API route) |

---

## 9. Translations

All text content is in:
- `/messages/pt.json` - Portuguese
- `/messages/en.json` - English

To edit any text on the site, find the relevant section key and update both files.

---

## 10. Pricing

To update prices, edit both translation files under the `pricing` section:
- `messages/pt.json` lines ~130-210
- `messages/en.json` lines ~130-210

---

## Checklist Before Launch

- [ ] Replace `G-XXXXXXXXXX` with real GA4 Measurement ID
- [ ] Add real portfolio screenshots to `/public/images/`
- [ ] Add `logo.png` and `og-image.jpg` to `/public/images/`
- [ ] Add `favicon.ico` to `/public/`
- [ ] Connect diagnostic form to webhook (Make.com / Zapier)
- [ ] Update social media URLs in Footer
- [ ] Update WhatsApp number if needed
- [ ] Review and adjust all translation text
- [ ] Set up Vercel deployment
- [ ] Configure custom domain
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (target: 90+ Performance, 100 Accessibility)
