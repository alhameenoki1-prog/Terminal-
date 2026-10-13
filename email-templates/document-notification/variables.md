# Template variables

Syntax: Handlebars. The renderer must HTML-escape every `{{variable}}` (Handlebars does this by default). The template never uses raw output, and the only helper is `nl2br`, which escapes first and then turns line breaks into `<br>`. Register it as:

```js
Handlebars.registerHelper('nl2br', (s) =>
  new Handlebars.SafeString(Handlebars.escapeExpression(s ?? '').replace(/\r?\n/g, '<br>')));
```

Booleans drive the `{{#if}}` blocks. Any optional string that is absent, `null` or `""` is treated as "not provided" and its block is omitted, so the backend can simply leave the key out.

## Platform values (same for every email, set once in configuration)

| Variable | Required | Meaning | If missing |
|---|---|---|---|
| `company_name` | Yes | Trading name of the platform as recipients know it, e.g. "Acme Sign". Used in the title, header wordmark, body copy and footer. | Build fails; never send without it. |
| `company_legal_name` | Yes | Registered legal entity for the copyright line, e.g. "Acme Sign Ltd". | Build fails. |
| `company_address` | Optional | Registered or postal address, one line. Recommended; required for commercial email in some jurisdictions and expected by most spam filters. | Address omitted from the copyright line. |
| `app_domain` | Yes | Bare hostname the signing pages live on, e.g. `app.acmesign.com`. Shown in the body and the "genuine links open on" statement. Must match the host of `document_action_url`. | Build fails. |
| `website_url` | Yes | Absolute HTTPS URL for the logo link and footer. | Build fails. |
| `logo_url` | Optional | Absolute HTTPS URL to a hosted PNG logo (2x resolution, transparent or white background). | Text wordmark (`company_name`) rendered instead. |
| `logo_width` | Required when `logo_url` is set | Display width in CSS pixels, e.g. `140` for a 280px-wide image. | Image renders at natural size in most clients, oversized in Outlook; always set it with `logo_url`. |
| `support_email` | Yes | Monitored support mailbox, also the fallback abuse-report route. | Build fails. |
| `help_url` | Optional | Help centre URL. | "or visit the help centre" omitted. |
| `report_url` | Optional | Abuse / suspicious-document report form. | Report link falls back to a `mailto:` to `support_email` with the notification reference in the subject. |
| `privacy_url` | Yes | Privacy policy URL. | Build fails. |
| `terms_url` | Yes | Terms of service URL. | Build fails. |
| `esign_disclosure_url` | Optional | Electronic record and signature disclosure (ESIGN / eIDAS consent text). | Footer link omitted. |
| `preferences_url` | Optional | Notification preferences page (reminder frequency, etc.). Transactional signature requests themselves cannot be opted out of; the page should say so. | Sentence omitted. |
| `current_year` | Yes | Four-digit year for the copyright line. Set by the backend at render time. | Build fails. |

## Per-notification values

| Variable | Required | Meaning | If missing |
|---|---|---|---|
| `notification_id` | Yes | Short, human-readable, non-secret identifier for this specific email (e.g. `NTF-7Q4K2M-9H`). Shown in the footer so support can locate the message; also used in the fallback report `mailto:` subject. Store it with the provider message ID. | Build fails. |
| `recipient_email` | Yes | The address this notification was sent to. Shown in the footer ("addressed a document to ...") so recipients understand why they received it. | Build fails. |
| `recipient_name` | Optional | Recipient's name as entered by the sender. | Greeting becomes "Hello,". |
| `sender_name` | Yes | Full name of the person who sent the document, from their verified account profile. Never free text typed per envelope. | Build fails. |
| `sender_email` | Yes | The sender's verified account email. Shown in the details table and the security notice so the recipient can check it against what they already know. | Build fails. |
| `sender_organization` | Optional | The sender's organisation from their account or workspace. | "from {org}" and ", {org}" fragments omitted. |
| `sender_message` | Optional | Personal note written by the sender. Plain text only; cap at 1,000 characters; see security-review.md for content screening. Line breaks preserved. | Message panel omitted entirely. |
| `document_title` | Yes | Document or envelope title as the sender named it. Truncate to 150 characters with an ellipsis before rendering; long titles wrap correctly but should not run for lines. | Build fails. |
| `document_reference` | Optional | Internal or customer-facing reference number. Long unbroken strings wrap with `word-break: break-all`. | Row omitted. |
| `sent_date` | Yes | Human-readable date (and ideally time with zone) the envelope was sent, e.g. `13 October 2026` or `13 Oct 2026, 14:05 BST`. Format in the recipient's locale and timezone if known, otherwise the sender's, and say which. | Build fails. |
| `expiration_date` | Optional | Date (and time with zone) after which the link stops working. Label reads "Sign by" when `requires_signature` is true, otherwise "Available until". Also appears in the preheader and under the button. | Expiry rows and sentences omitted; the copy then says only that the recipient can return later. |
| `requires_signature` | Yes (boolean) | `true` when the recipient must sign; `false` when they only need to view or review. Switches the eyebrow, headline, body wording, button label and the "what happens next" steps. | Treat absent as `false` (review only). Prefer sending it explicitly. |
| `has_access_code` | Optional (boolean) | `true` when the sender set an access code the recipient must enter. Adds an "Access code" row explaining the code arrives separately. | Row omitted. |
| `confidential_title` | Optional (boolean) | `true` to replace the document title with "a document" in the preheader (and, by the same rule, in the subject line). Use when the sender marks the envelope confidential or the title would reveal sensitive context. | Title shown in preheader. |
| `document_action_url` | Yes | Absolute HTTPS URL on `app_domain` that opens the document for this recipient. Generated by the backend; see integration.md. The same URL is used for the button and the visible fallback link. | Build fails. |

## Validation the backend should enforce before rendering

- Every URL variable starts with `https://`. `document_action_url` additionally starts with `https://{{app_domain}}/`. Reject anything else; this is defence in depth against a `javascript:` or third-party URL ever reaching the `href`.
- `sender_email` and `recipient_email` are syntactically valid addresses.
- Strings are NFC-normalised, control characters removed, and length-capped (`document_title` 150, `sender_name` 100, `sender_organization` 120, `sender_message` 1000, `document_reference` 80).
- `logo_width` is an integer between 60 and 240 when `logo_url` is set.
- Dates are pre-formatted strings; the template never formats dates.
