# Backend and email integration guidance

This describes how to populate, render and send `document-notification.html` and `document-notification.txt` through a transactional email provider (Amazon SES, Postmark, SendGrid, Mailgun, Resend or similar). The examples are Node.js but the flow is provider- and language-neutral.

## 1. Trigger and view model

Send one notification per recipient when an envelope moves to the "sent" state for that recipient (sequential signing: send only when it is their turn). Build an explicit view model rather than passing database rows to the template:

```js
import Handlebars from 'handlebars';
import { readFileSync } from 'node:fs';

Handlebars.registerHelper('nl2br', (s) =>
  new Handlebars.SafeString(Handlebars.escapeExpression(s ?? '').replace(/\r?\n/g, '<br>')));

const html = Handlebars.compile(readFileSync('document-notification.html', 'utf8'), { strict: false });
const text = Handlebars.compile(readFileSync('document-notification.txt', 'utf8'), { strict: false, noEscape: true });

export function buildViewModel({ envelope, recipient, sender, link, platform, locale }) {
  const vm = {
    ...platform,                                    // company_name, app_domain, urls ... from config
    current_year: String(new Date().getUTCFullYear()),
    notification_id: recipient.notificationId,      // e.g. NTF-7Q4K2M-9H, generated per email
    recipient_email: recipient.email,
    recipient_name: clean(recipient.name, 100),
    sender_name: clean(sender.displayName, 100),    // from the verified account, never per-envelope free text
    sender_email: sender.email,
    sender_organization: clean(sender.organizationName, 120),
    sender_message: clean(envelope.message, 1000),
    document_title: clean(envelope.title, 150),
    document_reference: clean(envelope.reference, 80),
    sent_date: formatDate(envelope.sentAt, locale),
    expiration_date: envelope.expiresAt ? formatDate(envelope.expiresAt, locale) : '',
    requires_signature: recipient.role === 'signer',
    has_access_code: Boolean(recipient.accessCodeHash),
    confidential_title: Boolean(envelope.confidential),
    document_action_url: link,                      // see section 2
  };
  assertHttps(vm, ['website_url', 'privacy_url', 'terms_url', 'help_url', 'report_url', 'preferences_url', 'esign_disclosure_url', 'logo_url']);
  if (!vm.document_action_url.startsWith(`https://${vm.app_domain}/`)) throw new Error('action URL must be on app_domain');
  return vm;
}
```

`clean()` should NFC-normalise, strip control characters, collapse whitespace and truncate with an ellipsis. Keep the plain-text compile with `noEscape: true`; it is a `text/plain` part, so HTML entities would be wrong there.

Dates: format in the recipient's locale and timezone when the recipient has an account; otherwise use the sender's timezone and include the zone abbreviation (`14:05 BST`). Always include a time for `expiration_date`, since a bare date is ambiguous across zones.

## 2. The document-action link

Design goals: the link must work for recipients with no account, must not be guessable, must not act as a long-lived bearer credential if it leaks, and must not leak through referrers, logs or forwarded emails.

Recommended shape: `https://app.example.com/d/{link_id}`

- `link_id`: 128 bits or more of randomness (UUIDv4 or 22-character base64url), unique per recipient per envelope. Store only a hash of it server-side, like a password reset token.
- It is a short path segment, not a query string, so proxies and analytics that log query strings do not capture it, and the visible fallback URL in the email stays short.
- Scope: one envelope, one recipient, one role. It must never resolve to a user session for the recipient's whole account.
- Expiry: set `expiration_date` to the envelope deadline, or to a sane default (30 days) if there is none. Re-issue a fresh `link_id` whenever a reminder or resend is sent and expire the old one, so a forwarded or leaked older email stops working.
- Identity step on landing: for recipients with an account, require sign-in; for guests, the landing page shows the sender, document title and platform name, then requires at least one of: an email one-time code, the sender-provided access code, SMS code, or SSO, before any document content is shown. After that step, issue a short-lived, HttpOnly, SameSite cookie bound to the envelope; do not keep the `link_id` in subsequent URLs.
- GET must be side-effect free. Microsoft Defender Safe Links, Google link scanning, Mimecast and Proofpoint fetch links before the human clicks. Never mark "viewed", "opened" or "declined" and never consume a single-use token on GET; require a user action (POST) for state changes.
- Signing pages send `Referrer-Policy: no-referrer`, `Strict-Transport-Security`, a strict `Content-Security-Policy`, and `X-Frame-Options: DENY`. Strip `link_id` from server logs, APM traces and error reports.
- Never route the link through a tracking redirect or your provider's click-tracking domain (section 4). The link in the email must be the final destination on your domain.

## 3. Message construction

| Field | Value |
|---|---|
| From | `"{{company_name}}" <documents@notify.example.com>` (fixed display name, fixed domain; never put the document sender's name in the From display name, which is the single most common phishing pattern) |
| Reply-To | The document sender's address, so questions go to the person who can answer them. Optionally add `support_email` as a second Reply-To. |
| To | `"{{recipient_name}}" <{{recipient_email}}>` |
| Subject | One of the options in README.md; `confidential_title` swaps the title for "a document". |
| Body | `multipart/alternative` with `text/plain` first, then `text/html`, both UTF-8. |
| Message-ID | Unique, on your domain: `<ntf-7q4k2m-9h@notify.example.com>`. Store it. |
| Date | Set at send time, in UTC with offset. |
| List-Unsubscribe | Not required for a transactional signature request. Add it (with `List-Unsubscribe-Post: List-Unsubscribe=One-Click`) only on reminder emails that users can disable, and honour it within 48 hours. |
| Feedback-ID | `{{notification_type}}:{{tenant}}:{{campaign}}:{{sender_id}}` style identifier so Gmail Postmaster Tools can break out spam rates per stream. |
| X-Entity-Ref-ID | The envelope id. Gmail uses it to avoid threading unrelated notifications that happen to share a subject. |
| Auto-Submitted | `auto-generated` so autoresponders do not reply to the notification. |
| Precedence | Do not set `bulk`; this is transactional. |

Disable open tracking (pixels) and click tracking at the provider level for this template. Click tracking rewrites `document_action_url` to the provider's domain, which breaks the "genuine links open on {{app_domain}}" promise and triggers link-mismatch heuristics. Idempotency: pass `notification_id` as the provider idempotency key or deduplicate on it yourself, so retries never send twice.

## 4. Provider setup

- Dedicated transactional subdomain (`notify.example.com`) with its own SPF, DKIM selector(s) and DMARC-aligned From. Marketing goes through a different subdomain (`news.example.com`). See deliverability-checklist.md.
- A dedicated IP is only worth it above roughly 100k messages per month with steady volume; otherwise shared provider pools with good hygiene perform better for new senders.
- Warm up gradually: start with existing, engaged customers and scale daily volume over 2 to 4 weeks.
- Configure the provider's bounce and complaint webhooks before the first production send.

## 5. Error handling and retries

| Situation | Action |
|---|---|
| Provider API 5xx or timeout | Retry with exponential backoff and jitter (1s, 4s, 16s, 64s, up to 1 hour), same idempotency key. After the final failure, mark the notification `failed` and alert on-call; show the sender an in-app warning. |
| Provider 4xx validation error | Do not retry. Log, mark `failed`, alert; this is a bug in the view model or address validation. |
| Hard bounce (5.x.x, mailbox does not exist) | Mark the recipient `undeliverable`, suppress the address, notify the document sender in-app and by email so they can correct it. |
| Soft bounce / deferred | Provider retries automatically for up to 72 hours; surface "delivery pending" to the sender if it exceeds 1 hour. |
| Spam complaint (FBL) | Suppress the address for future notifications, notify the sender that the recipient flagged the email, and review the sender account if complaints cluster. |
| Address on suppression list | Block the send, tell the sender why, offer an alternative delivery route (sender shares the link directly after the recipient verifies identity). |

## 6. Delivery event monitoring

Consume webhook events (`accepted`, `delivered`, `deferred`, `bounced`, `complained`, `rejected`) and store them against `notification_id`. This gives:

- A per-recipient delivery timeline in the sender's envelope view ("Email delivered 14:06", "Bounced: mailbox not found").
- Dashboards and alerts: delivery rate below 97%, bounce rate above 2%, complaint rate above 0.1% (Gmail's threshold is 0.3%, and 0.1% is the safe operating level), or deferral spikes per receiving domain, each per 1-hour window.
- Evidence for the audit trail: when and where the notification was delivered is part of the legal record for an electronic signature.

Keep a pre-send validation step in CI: render the four samples in `samples/`, check that the output contains no `{{`, that every `href` is HTTPS, that the action link appears exactly three times with identical values (button href, fallback href, fallback visible text), and that the HTML is under 100 KB (Gmail clips at 102 KB).
