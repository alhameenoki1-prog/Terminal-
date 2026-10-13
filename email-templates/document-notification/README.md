# Document notification email

A production-ready transactional email that tells a recipient that someone has sent them a document to review or sign through your platform. Built for Gmail, Google Workspace, Outlook for Microsoft 365 (Windows, Mac, web, mobile), Outlook.com, Yahoo Mail and Apple Mail, with a plain-text alternative, documented variables, and integration, deliverability, testing and security guidance.

Brand inputs (company name, domain, logo, colours, provider) were not supplied, so the template uses clearly labelled placeholders such as `[Platform name]` and `app.example.com`. Nothing brand-specific has been invented.

## Files

| File | Deliverable |
|---|---|
| `README.md` (this file) | A. Design rationale, D. Subject lines and preheaders, compatibility trade-offs |
| `document-notification.html` | B. Complete HTML email (Handlebars syntax) |
| `document-notification.txt` | C. Plain-text alternative |
| `variables.md` | E. Dynamic variable documentation and validation rules |
| `integration.md` | F. Backend and email integration guidance |
| `deliverability-checklist.md` | G. Deliverability checklist |
| `testing-plan.md` | H. Cross-client testing plan |
| `security-review.md` | I. Security and trust review |
| `production-readiness.md` | J. Production-readiness assessment |
| `samples/*.json` | Four data sets: full, minimal (every optional field absent), long-title (hostile input), review-only |
| `scripts/render.mjs` | Dependency-free renderer for the Handlebars subset used here, for previews and CI checks |
| `scripts/screenshot.mjs` | Chromium screenshots of the previews at desktop, phone and dark mode (needs Playwright) |
| `previews/` | Rendered HTML and text for each sample, plus representative screenshots |

Verification status: the HTML has been code-reviewed against known client behaviour and rendered in headless Chromium at 720px and 375px in light and dark mode (`previews/*.png`). It has not been rendered in any real email client yet; `testing-plan.md` describes that work.

## Quick start

```bash
# Render a sample (HTML and text)
node scripts/render.mjs document-notification.html samples/full.json > previews/full.html
node scripts/render.mjs document-notification.txt  samples/full.json --text > previews/full.txt

# Screenshot all previews in Chromium (npm i -D playwright, or point at a global install)
PLAYWRIGHT_PATH=/path/to/node_modules/playwright node scripts/screenshot.mjs
```

In production use the real Handlebars library with escaping on and the `nl2br` helper from `variables.md`.

## A. Design rationale

**Visual direction.** The email is deliberately quiet: a light grey canvas, one white card with a 1px border and a 5px brand-coloured rule, a single deep-blue action colour, and a system font stack (Segoe UI, Roboto, Helvetica, Arial). There are no hero images, icons, badges or gradients. Recipients associate this restraint with institutions that handle contracts; decoration is what phishing kits add. The one accent colour appears only where it carries meaning: the brand rule, the eyebrow label, the message panel edge, the step numbers and the button, so the eye lands on the button. All colours are listed as tokens in the file header for re-theming.

**Information hierarchy.** The order answers the recipient's questions in the order they ask them:

1. *Who is this email from?* The platform wordmark, alone, above the card. The platform is the notifier; it is never conflated with the person who sent the document.
2. *What is it?* An eyebrow ("Signature requested" or "Document shared for review") and an H1 naming the sender and the action.
3. *Why am I getting it?* One paragraph: sender, their organisation, the platform, the document title, the required action, where the document lives, and that nothing is attached.
4. *What did they say?* The sender's optional note, visually quoted and labelled so it reads as the sender's words, not the platform's.
5. *What exactly am I being asked to sign?* A details table: document, reference, sender with verified email, sent date, deadline, and whether an access code applies.
6. *What do I do?* One button. The label states the real action ("Review and sign document" or "View document"). Below it, the deadline as a plain fact and the raw URL for clients that break buttons.
7. *What happens after I click?* Three short steps that set expectations (no account needed, you can decline, everyone gets a copy). First-time signers hesitate most here.
8. *Is this safe?* A "Not expecting this document?" panel with a verification method the recipient already controls, the exact domain genuine links use, two policy promises, and a report route.
9. *Who is responsible?* A footer that explains why the recipient received the email, gives support and a reference number, legal links, and the legal entity and address.

**Wording.** Second person, plain verbs, no exclamation marks, no capitals for emphasis, no "urgent" or "immediately". The deadline is stated once as "Sign by". The sender's identity appears as name plus organisation plus verified email, because an email address is the one thing a recipient can compare with their own records. "Nothing is attached to this email" and "Genuine links always open on https://app.example.com" are the two sentences that most reduce phishing success, and both are written so they stay true.

**Trust decisions.** The platform name is the From display name and the header; the sender's name is in the subject and H1, never in the From. Button and fallback link are the same URL on the platform's own domain. No tracking pixel, no link rewriting, no shorteners, no external fonts, no third-party resources except the optional hosted logo. The security panel uses a neutral panel style, not a warning colour, so it reads as standard practice rather than alarm. The report route works even when the product has no dedicated form (falls back to a `mailto:` with the reference pre-filled).

**Accessibility.** `lang="en"`, `role="article"` with a descriptive label, layout tables marked presentational, a real H1 and H2s, alt text on the logo, 15–16px body text, 4.5:1 or better contrast in both colour schemes, link text that says where it goes, and a button whose label is the action.

## D. Subject lines and preview text

Rules: no urgency words, no capitals, no emoji, no "RE:/FW:", no sensitive content, the sender named, the action named, and ideally under 60 characters so phones do not truncate. Truncate `document_title` at 50 characters with an ellipsis for subjects. When `confidential_title` is true, use option 5 (or replace the title with "a document" in any option). For review-only notifications, replace "sign" with "review" and "signature" with "review".

| # | Subject | Preheader |
|---|---|---|
| 1 | `{{sender_name}} sent you a document to sign: {{document_title}}` | Review and sign it on {{app_domain}}. Sign by {{expiration_date}}. |
| 2 | `Signature requested by {{sender_name}}, {{sender_organization}}` | "{{document_title}}" is ready for your review and signature via {{company_name}}. |
| 3 | `Please review and sign: {{document_title}}` | Sent by {{sender_name}} using {{company_name}}. Available until {{expiration_date}}. |
| 4 | `{{company_name}}: document from {{sender_name}} awaiting your signature` | "{{document_title}}", reference {{document_reference}}. Nothing is attached; it opens on {{app_domain}}. |
| 5 | `{{sender_name}} has sent you a document to sign via {{company_name}}` | Open it on {{app_domain}} to see the details. Sign by {{expiration_date}}. (Use when the title is confidential.) |

Recommended default: option 1, which names the person, the action and the document in the first 40 characters. The template's built-in preheader matches it; if you choose another option, edit the preheader `<div>` to match so the inbox snippet and the subject agree. Omit the expiry sentence when `expiration_date` is absent.

## Compatibility trade-offs

- **Gmail vs Outlook on layout.** Gmail (Google accounts) honours the `<style>` block, so phones get 20px gutters, stacked detail rows and a full-width button. Outlook for Windows uses Word's engine: it ignores `max-width`, `border-radius`, `word-break` and padding on links. The template therefore wraps the layout in a conditional 600px "ghost" table for Outlook, puts every colour and font inline, declares `PixelsPerInch` so Outlook scales correctly at 125%/150% DPI, and builds the button with the `mso-font-width`/`mso-text-raise` technique so the full button is clickable in Outlook while other clients get normal padding.
- **Gmail with non-Google accounts** strips `<style>` entirely, so the mobile and dark-mode rules vanish. The base layout is fluid (`width:100%; max-width:600px`) with a 120px label column so it still fits a 375px screen with the desktop padding. This is the only configuration that falls back to the denser layout.
- **Dark mode.** Apple Mail and iOS Mail honour `prefers-color-scheme` only when the `color-scheme` meta tags are present (they are). Outlook.com and the Outlook apps ignore the media query but apply `[data-ogsc]` rules, which are duplicated. Gmail ignores both and may partially invert the light palette on Android/iOS; the light palette has enough contrast to survive that. The dark rules live in a second `<style>` block so a client that rejects attribute selectors still keeps the mobile rules.
- **Fonts.** No web fonts: Gmail and Outlook do not load them reliably and Outlook can fall back to Times New Roman when a `@font-face` is present. The stack resolves to Segoe UI on Windows, Roboto on Android, Helvetica on Apple, Arial elsewhere; an MSO-only style forces Arial in Outlook for consistency.
- **Preheader.** Hidden with `display:none`, `max-height:0`, `mso-hide:all` and padded with zero-width characters so inbox snippets stop after it. Some clients ignore the padding and show the eyebrow text after it; this is cosmetic.
- **Rounded corners, border-left accent and the brand rule** render in every modern client and simply appear square in Outlook for Windows, which is accepted rather than worked around with VML (VML adds fragility for a purely decorative gain).
- **Long strings.** `word-break` handles them in every client except Outlook for Windows; backend truncation (variables.md) is the real control, and the template is one layer of defence.
- **Size and clipping.** 26 KB rendered, under Gmail's 102 KB clipping threshold even with a long sender message.
