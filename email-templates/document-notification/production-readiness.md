# Production-readiness assessment

## Verdict

The template is production-grade in structure, copy and security posture, and can be integrated as-is once the brand placeholders are filled. It is **not yet releasable** because rendering has only been verified in headless Chromium, which is not an email client, and because several items below depend on your product and legal decisions.

## What meets professional SaaS standards

| Area | Status | Evidence |
|---|---|---|
| Layout engineering | Meets | Table-based, 600px hybrid/fluid layout with MSO ghost table, inline styles for every rule, progressive-enhancement media queries, Outlook button padding hack, DPI meta, preheader hidden with `mso-hide`. |
| Clients without `<style>` | Meets | All colours, fonts and spacing are inline; the layout degrades to a fixed-padding fluid column at phone width. |
| Dark mode | Meets with caveats | `color-scheme` meta, `prefers-color-scheme` and `[data-ogsc]` rules in a separate block; light palette has high enough contrast to survive Gmail's partial inversion. Logo behaviour needs a real asset to confirm. |
| Accessibility | Meets | `lang`, `role="article"`, presentational tables, H1/H2 structure, alt text, 4.5:1+ contrast everywhere, 15–16px body text, descriptive link and button names. |
| Content and hierarchy | Meets | Platform identity, then who/what/why, then details, then the single action, then process, then safety, then legal. No promotional content. |
| Trust and anti-phishing | Meets at template level | Sender email shown, platform and sender clearly separated, matching button and visible link, domain statement, report route, "nothing attached", no urgency language. Platform-side abuse controls are required (security-review.md, item 1). |
| Escaping and injection safety | Meets | Handlebars escaping on all fields; renderer rejects unsupported syntax; previews prove escaping with hostile input. |
| Fallbacks | Meets | Every optional field verified absent in `samples/minimal.json`; no orphaned punctuation or empty rows. |
| Plain-text part | Meets | Full parallel content, URLs on their own lines, same conditionals. |
| Size | Meets | 26 KB HTML, far below Gmail's 102 KB clip. |
| Tracking | Meets | No pixels, no click-tracking, no third-party resources besides the optional hosted logo. |

## Must be completed before deployment

1. **Brand inputs** (currently placeholders): company name, legal name, address, app domain, website, support email, help/report/preferences/disclosure URLs, logo PNG at 2x with width, and the real colour palette (replace the eight hex tokens listed in the template header).
2. **Real client testing** per testing-plan.md: at minimum Outlook 2016/365 on Windows, Gmail web and apps (Google and non-Google account), Outlook.com, Yahoo, Apple Mail and iOS Mail, each in light and dark mode and with images off. Fix anything the Litmus/Email on Acid run shows, then record results.
3. **Email authentication**: SPF, DKIM and DMARC on the sending subdomain, with DMARC moved to enforcement before public launch (deliverability-checklist.md).
4. **Link design implemented** as in integration.md section 2, including the identity step, idempotent GET and link rotation on resend. The email's promise that links open on `app_domain` must be true, so click tracking stays off.
5. **Copy alignment with the product**: the "What happens next" steps assert that no account is needed, that signers can decline with a reason, that reviewers can download a copy, and that everyone receives a completed copy. Edit any step your product does not do.
6. **Policy statements reviewed by legal**: "will never ask you for a password, payment details or a verification code by email"; the notification-preferences wording; whether an e-signature disclosure link belongs in the email or only in the signing flow in your jurisdictions.
7. **Abuse controls** on the sending side (security-review.md, item 1) and a staffed abuse-report queue, because the template points recipients to it.
8. **Delivery event pipeline** (bounces, complaints, suppression) connected before the first production send.

## Known limitations

- **Outlook for Windows**: no rounded corners; `word-break` is ignored, so backend truncation is the only control for very long unbroken strings; the clickable area of the button is correct only because of the `mso-font-width` hack, which must be verified at 100%, 125% and 150% DPI.
- **Gmail app with non-Google accounts**: no media queries, so phone rendering keeps 40px side padding and the two-column details table; functional but denser.
- **Gmail dark mode**: not controllable by CSS; Gmail may invert the palette. Verify legibility rather than expecting the designed dark palette.
- **Logo in dark mode**: a single logo must work on both light and dark header backgrounds, or the header can be kept white with the `dm-keep-light` class (unused by default).
- **Localisation**: English only. Every string is in the template; for other languages, duplicate the template per locale rather than passing translated fragments as variables, so the sentence structure stays natural and escaping stays simple. Dates are pre-formatted by the backend.
- **Right-to-left languages** are not handled; an RTL variant needs `dir="rtl"` and mirrored paddings.
- **Only one notification type** is provided. A complete product needs: reminder, completed (with the signed copy or a link to it), declined, voided/cancelled, expiring soon, and carbon-copy variants. They should share this skeleton so the family looks consistent.
- **Preheader** relies on hidden text and padding characters; some clients ignore the padding and show the eyebrow after the preheader. Harmless but worth checking in the inbox list.

## Recommended next steps, in order

1. Fill brand values, generate the logo assets, re-render previews.
2. Set up DNS and provider streams; send authenticated test messages to seed accounts.
3. Run a Litmus/Email on Acid pass and fix findings.
4. Implement the link and identity flow and the delivery webhook consumer.
5. Launch to a small cohort, watch Postmaster Tools and complaint rates for two weeks, then scale.
