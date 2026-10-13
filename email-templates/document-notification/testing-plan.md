# Cross-client testing plan

Status of this template: **code-reviewed and rendered in headless Chromium only** (see `previews/`). It has **not** been tested in any real email client. Chromium is far more forgiving than Outlook or Gmail, so the predictions below must be verified before launch.

## Tooling

1. **Rendering previews**: Litmus or Email on Acid give screenshots across 90+ clients including Outlook 2016/2019/365 on Windows, Gmail web/iOS/Android, Yahoo, Apple Mail and iOS Mail in light and dark mode. One of these is required; there is no substitute for Outlook's Word engine.
2. **Real seed accounts**: create test mailboxes at Gmail (personal and Workspace), Outlook.com, Microsoft 365, Yahoo Mail and iCloud, and send through the production provider and domain, not a local SMTP. This verifies headers, authentication results and the "via" / "?" sender indicators as well as rendering.
3. **Placement and spam scoring**: Mail-Tester, GlockApps or Litmus Spam Testing on the production-rendered message.
4. **Accessibility**: Apple Mail with VoiceOver on macOS and iOS, Outlook with NVDA on Windows. Check reading order, that layout tables are announced as presentation, heading navigation (H1, H2s), link names and the button label.
5. **Local regression**: `node scripts/render.mjs` for every sample, then `node scripts/screenshot.mjs` to catch layout regressions in Chromium before paying for a Litmus run.

## Client matrix and what to check

| Client | Specific checks |
|---|---|
| Gmail web (Google account) | `<style>` block honoured: mobile classes and dark-mode block present. Clipping message absent (under 102 KB). Preheader shows and is not followed by body text in the snippet. The sender shows your display name without "via" (requires aligned DKIM). |
| Gmail app, iOS and Android, Google account | Media queries apply at phone widths; details rows stack; button is full width. |
| Gmail app with a non-Google account (IMAP / Exchange) | `<style>` is stripped: confirm the fluid layout still fits at 375px with the 40px padding and 120px label column, and that nothing overflows horizontally. |
| Outlook 365 / 2019 / 2016 for Windows | Ghost table holds 600px; no rounded corners (expected); button renders with correct height via the `mso-font-width` padding hack and the whole button area is clickable; left border on the message panel shows; details table borders render; preheader hidden (`mso-hide:all`); no unexpected line-height changes; 120% and 150% DPI scaling. |
| New Outlook for Windows, Outlook.com, Outlook iOS/Android | These use the web engine: check `[data-ogsc]` dark-mode rules and that the Outlook app's forced dark mode keeps text legible. |
| Outlook for Mac | Mostly WebKit; check dark mode and the button. |
| Apple Mail (macOS) and iOS Mail | Dark mode via `prefers-color-scheme` and the `color-scheme` meta. Confirm no blue auto-links on dates and addresses (`x-apple-data-detectors` reset). |
| Yahoo Mail web and app | Media queries apply; check the preheader and that `word-break` long references wrap. |
| Samsung Email, Thunderbird | Secondary; check nothing is broken. |

## Scenario tests (run each across the matrix)

1. **Images disabled** (Gmail: Settings, Images, "Ask before displaying"; Outlook: default for unknown senders). Expected: styled alt text shows the company name where the logo was; nothing else in the email depends on images. Use `samples/review-only.json`, which has a logo URL.
2. **Dark mode** (OS-level dark on macOS/iOS, Outlook app toggle, Gmail app toggle). Expected: Apple Mail and Outlook use the dark palette; Gmail iOS/Android partially inverts the light palette, which must remain legible (headline, button text and muted text all above 4.5:1). Check the logo against both backgrounds; supply a transparent PNG that works on light and dark, or keep the white header tile.
3. **Long document title, sender name and reference**: `samples/long-title.json`. Expected: headline and details wrap; reference breaks mid-string; nothing widens the 600px container. In Outlook, confirm an 80-character unbroken reference does not stretch the table (Outlook ignores `word-break`; the backend truncation in variables.md is the real control).
4. **Missing optional fields**: `samples/minimal.json`. Expected: no empty rows, no stray punctuation ("Hello,", no "from" fragment, no blank panel), fallback report link is a `mailto:` with the reference in the subject.
5. **Review-only path**: `samples/review-only.json`. Expected: "View document" button, two-step list, "Available until" label when an expiry exists.
6. **Narrow screens**: 320px (iPhone SE), 375px, 414px, plus a 7-inch tablet in portrait. Expected: 20px gutters, single-column details, full-width button, no horizontal scroll.
7. **Preheader**: in each inbox list, check the snippet reads "{{sender_name}} sent you ..." and stops at the padding characters rather than running into "Signature requested".
8. **Links**: every link resolves over HTTPS to your domain; the button and the fallback URL are byte-identical; `mailto:` opens with the pre-filled subject; links are not rewritten by the provider.
9. **Forwarding**: forward from Gmail and Outlook and confirm the layout survives and the link still requires the identity step (it should not open the document for the forwardee without verification).
10. **Plain text**: send with the HTML part removed and read the `.txt` on a phone; confirm every URL is on its own line and nothing is cut off.
11. **Authentication**: open "Show original" in Gmail and the message headers in Outlook.com: SPF `PASS`, DKIM `PASS` with your domain, DMARC `PASS`, TLS shown as used.
12. **Threading**: send two notifications for different documents with the same subject to one Gmail account and confirm they do not thread (X-Entity-Ref-ID) or that threading is acceptable.
13. **Safe Links**: send to a Microsoft 365 tenant with Defender Safe Links on; confirm the pre-fetch does not mark the envelope as viewed and that the rewritten link still lands on the right page.

Record results per client as "verified", "verified with known limitation", or "failed", and keep the Litmus/Email on Acid screenshots with the release.
