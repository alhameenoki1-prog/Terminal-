# Mercy Home: secure message notification email

The email clients get when Mercy Home sends them an agreement through the secure messaging
portal. It is styled after Microsoft 365 notifications (Segoe UI, Microsoft blue `#0078D4`,
Fluent grays) so it feels at home next to the Microsoft portal the link opens, while keeping
Mercy Home's name and logo as the sender.

```
secure-message-notification.html        Preview / master copy, with {{Placeholders}}
power-automate/1-compose-values.json    Paste into the "Values" Compose action
power-automate/2-compose-email-html.html Paste into the "EmailHtml" Compose action
```

Everything is inline-styled and table-based, so it renders in Outlook desktop (Windows),
Outlook on the web, Gmail and Apple Mail. The button is a padded table cell rather than a
VML shape, so it doesn't need any Outlook-only markup.

## Building the Power Automate flow

The flow is four steps. The two Compose actions keep the HTML out of the email editor,
which otherwise rewrites and strips the markup.

### 1. Trigger

Any trigger works (a SharePoint list item, a Form response, "For a selected file", a
button). To test quickly, use **Manually trigger a flow** with four text inputs:
`Client name`, `Client email`, `Document name`, `Secure link`.

### 2. Compose action named `Values`

- Add a **Compose** action (Data Operation) and rename it to exactly **`Values`**.
  The name matters: the HTML refers to it as `outputs('Values')`.
- Paste the contents of `power-automate/1-compose-values.json` into **Inputs**.
- Replace the four `REPLACE with dynamic content` strings with the matching dynamic
  content from your trigger (delete the placeholder text, then pick the token).
- Fill in the sender, phone, address and logo values once. They stay the same for every
  run, so they only live here.

The two dates are expressions: `DueDate` is 7 days from now and `ExpirationDate` is 30
days. Change the `addDays(utcNow(), 7)` numbers to match how the portal link is set up.

### 3. Compose action named `EmailHtml`

- Add a second **Compose** and rename it to exactly **`EmailHtml`**.
- Paste the whole of `power-automate/2-compose-email-html.html` into **Inputs**.
  The designer turns every `@{outputs('Values')?['...']}` into a purple expression
  token as you paste.

### 4. Send an email (V2)

| Field | Value |
|---|---|
| To | `outputs('Values')?['RecipientEmail']` (as an expression) |
| Subject | `Secure message from Mercy Home: ` then expression `outputs('Values')?['DocumentName']` |
| Body | Click the **`</>`** code-view toggle in the top right of the Body box first, then insert the expression `outputs('EmailHtml')` |
| Importance | Normal |

Code view is the important part: in the normal rich-text view Outlook's editor escapes
the HTML and the client sees raw tags.

To send from a shared mailbox (for example `agreements@mercyhomeny.org`) use **Send an
email from a shared mailbox (V2)** instead; the fields are the same.

### Test it

Run the flow to your own address and open it in Outlook desktop, Outlook on the web and
a phone. Check that:

- The logo loads (it needs a public `https://` URL; images stored in SharePoint or
  OneDrive need a sign-in and will show as broken for clients).
- The button, the fallback link and the email signature all point where you expect.
- The dates read naturally (`October 13, 2026`).

### If something goes wrong

- **"The template language expression ... property 'RecipientName' doesn't exist"**:
  the `Values` Compose was stored as text rather than JSON. Change the HTML expressions
  from `outputs('Values')?['X']` to `json(outputs('Values'))?['X']`, or check the JSON
  pasted without a stray character.
- **Expressions show as literal `@{...}` text in the email**: the HTML was pasted into
  the email Body instead of a Compose. Move it to the `EmailHtml` Compose.
- **Action name has underscores** (`outputs('Email_Html')`): the action was renamed with a
  space. Rename it to `EmailHtml` with no space, or update the expression in step 4.

## Editing the look

- **Colors**: Microsoft blue `#0078D4` (accent bar, button, links), text `#323130`,
  secondary text `#605E5C`, dividers `#EDEBE9`, page background `#F3F2F1`. These are the
  Fluent neutral palette; swap `#0078D4` for a Mercy Home brand color if preferred.
- **Logo**: 150px wide in the email; upload a PNG about 300px wide so it stays sharp on
  phones. Keep the `alt="Mercy Home"` text so the header still reads if images are off.
- Edit `secure-message-notification.html` first, then regenerate the Power Automate copy:

  ```bash
  sed -E "s/\{\{([A-Za-z]+)\}\}/@{outputs('Values')?['\1']}/g" \
    secure-message-notification.html > power-automate/2-compose-email-html.html
  ```

## Deliverability

"Click here to read your secure message" is a common phishing pattern, so protect the
real thing:

- Send only from an `@mercyhomeny.org` mailbox, and make sure SPF, DKIM and DMARC are
  configured for the domain (Microsoft 365 admin center > Settings > Domains, and
  Microsoft Defender > Email authentication settings).
- Keep the link on the real Microsoft or Mercy Home portal domain, with no URL shorteners.
- Tell clients ahead of time, in person or by phone, that agreements arrive this way.
- Leave the "Is this really from us?" box in: it gives clients a way to verify by calling
  the number on the public website.
