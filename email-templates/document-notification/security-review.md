# Security and trust review

Scope: the notification email, the data that flows into it, and the link it carries. Items are ordered by how much damage they do if ignored.

## 1. Your platform used as a phishing relay (highest risk)

**Issue.** The most damaging attacks against e-signature platforms are not spoofed emails; they are genuine emails sent through the platform by a criminal who registered an account. The notification passes SPF, DKIM and DMARC, carries your brand, and contains a "document" that is itself the lure (fake invoice, "verify your account" PDF). DocuSign and others have been abused this way at scale.

**Mitigations in the template.** The sender's verified email address is shown in two places; the sender's name is never used as the From display name; the recipient is told to verify through a channel they already have; the report route is one click away; the body states nothing is attached.

**Mitigations required in the product.**
- Verify sender email ownership before the first envelope; verify a payment method or identity for free accounts above a small envelope quota.
- Rate-limit envelopes and distinct recipients for new accounts; step up to manual review when a new account sends to many unrelated domains.
- Screen `sender_message` and `document_title` for URLs, phone numbers, urgency phrases, brand names of banks and payment providers, and homoglyph tricks. Do not render URLs in `sender_message` as clickable links (the template renders it as text only).
- Scan uploaded documents for embedded links, QR codes and known-bad hashes; block executable attachments entirely.
- Make the recipient-side "Report a suspicious document" route feed a queue that can suspend the sending account and revoke live links within minutes.
- Publish a trust page describing your sending addresses, link domain and how to report abuse.

## 2. Display-name and domain spoofing of your brand

**Issue.** Attackers send from unrelated domains with the From display name set to your platform, or register lookalike domains (`acme-sign-docs.com`).

**Mitigations.** DMARC at `p=reject` on your domain and `sp=reject` for subdomains; BIMI with a VMC so the logo appears only on authenticated mail; the email states the exact domain genuine links use; register common lookalike domains and the IDN variants of your main domain; monitor certificate transparency logs for certificates issued to lookalikes.

## 3. Link integrity

**Issue.** Link text that differs from the destination, redirects through third-party domains, URL shorteners and tracking wrappers are all phishing indicators, and provider click-tracking creates exactly that pattern.

**Mitigations.** Both the button and the visible fallback use the same `document_action_url` on `app_domain`; the template contains no redirects or shorteners; click tracking is disabled for this stream; the backend asserts the URL starts with `https://{{app_domain}}/` before rendering.

## 4. Token exposure through the URL

**Issue.** Any secret in a URL can leak via browser history, server and proxy logs, Referer headers, shared screenshots and forwarded emails.

**Mitigations.** The link carries an opaque, high-entropy, single-purpose identifier in the path and never a session token, user ID or document ID; the server stores only its hash; the identifier expires with the envelope and is rotated on every resend; opening it requires an identity step before any content is shown; the resulting session lives in a cookie, not the URL; signing pages send `Referrer-Policy: no-referrer`; logs redact the path segment. Residual risk: a forwarded email plus a compromised recipient mailbox still lets an attacker complete the identity step if that step is "code sent to the same mailbox"; for high-value documents require an access code or stronger verification.

## 5. Pre-fetch and link scanners

**Issue.** Corporate security products open links before the recipient does. If GET has side effects, documents are marked viewed, single-use links are burned, and audit trails record false events.

**Mitigation.** The landing route is idempotent; all state changes require a POST from a human interaction.

## 6. Injection through sender-controlled fields

**Issue.** `sender_name`, `sender_organization`, `document_title`, `document_reference`, `sender_message` and `recipient_name` are typed by customers. Unescaped, they allow HTML injection (fake buttons, hidden text, tracking images) inside your trusted email.

**Mitigations.** Handlebars escapes `& < > " ' =` on every variable; the template never uses raw output; `nl2br` escapes before inserting `<br>`; the render script rejects any unsupported expression so a stray raw tag cannot ship; backend caps lengths and strips control characters. `samples/long-title.json` includes `<Fees>` and quotes to prove escaping in previews. Attribute contexts (`alt`, `href`, `mailto:` subject) are also escaped; `notification_id` in the `mailto:` subject should be restricted to `[A-Z0-9-]`.

## 7. Information disclosure in subject, preview and body

**Issue.** Subjects and preheaders show in notification banners, lock screens and shared inboxes.

**Mitigations.** No document content, amounts or counterparties beyond the title appear anywhere in the email; `confidential_title` replaces the title with "a document" in subject and preheader; the body states the document is not attached; the recipient's own address in the footer is the only personal data about them. Do not add page thumbnails or document previews to this email.

## 8. Deceptive urgency and false security claims

**Issue.** "URGENT", countdown language, "your account will be suspended" and claims like "256-bit military-grade encrypted" are both unethical and spam signals.

**Mitigations.** The copy states the deadline as a fact, once, with the word "Sign by"; the security panel makes only two verifiable statements (links open on your domain; you never ask for passwords, payment details or codes by email). Both must be enforced by policy. Do not add a "secure" padlock icon or "verified" badge to the design; those are what phishers copy.

## 9. Reply handling

**Issue.** A `noreply@` From with no reply path trains recipients to ignore the email's own instructions and leaves questions unanswered, which drives complaints.

**Mitigations.** Reply-To is the document sender; the footer gives support email and a reference number; the fallback report link is a `mailto:` with the reference pre-filled. Ensure the From mailbox at least accepts mail and auto-replies with support routes if someone replies to it directly.

## 10. Accessibility as a trust signal

A recipient using a screen reader hears "Document from Daniel Reyes via [Platform name]" as the article label, an H1 stating who sent what, labelled table rows, and a button named "Review and sign document". Layout tables are `role="presentation"`. Text contrast: body 10.9:1, muted 5.6:1, button 10.8:1, eyebrow 10.8:1, all above WCAG AA; dark-mode values are above 7:1. Font sizes are 15 to 16px for content and 12 to 13px for footer and labels only.

## 11. Signing page hardening (outside the email, but part of the same trust chain)

HTTPS with HSTS preload; TLS 1.2+; strict CSP with no inline scripts; no third-party scripts on the signing page; the landing page shows sender name, sender email, document title and your logo before the identity step so the recipient can cross-check against the email; device/IP, timestamp and verification method recorded in the tamper-evident audit trail; completed documents sealed with a digital certificate; signing sessions expire after 30 minutes idle; rate limiting on code entry; the envelope is locked once completed so late link use shows a read-only copy.

## 12. Operational hygiene

Rotate DKIM keys annually; restrict who can change DNS; keep the sending provider API key in a secrets manager scoped to send-only; log every send with `notification_id`, recipient hash and provider message ID (not the link); alert on anomalous send volume per account; have a documented "revoke all links for account X" runbook for abuse response.
