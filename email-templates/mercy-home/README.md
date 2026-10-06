# Mercy Home: secure message notification email

`secure-message-notification.html` is the branded email clients get when Mercy Home sends
them an agreement through the secure messaging portal. It is built for Outlook: table layout,
inline styles and a VML button so it also renders in Outlook desktop's Word engine.

## Placeholders to fill in

| Placeholder | Example |
|---|---|
| `{{LogoUrl}}` | Public **https** URL of the logo (PNG, about 360px wide for retina). Don't embed it as base64; Outlook strips it. |
| `{{RecipientName}}` | Jane Doe |
| `{{SenderName}}` / `{{SenderTitle}}` / `{{SenderEmail}}` | Staff member sending it |
| `{{DocumentName}}` | Client Service Agreement |
| `{{DueDate}}` / `{{ExpirationDate}}` | October 20, 2026 |
| `{{SecureMessageLink}}` | The portal link (appears 3 times: VML button, HTML button, plain-text fallback) |
| `{{OfficePhone}}` / `{{OfficePhoneDigits}}` | (555) 123-4567 / +15551234567 |
| `{{OfficeAddress}}` | Street, City, NY ZIP |

Brand colors: navy `#1F4E79` (header and links), green `#2E7D5B` (button). Find and replace
them to match the real brand.

## Sending from Microsoft 365

**Option A: send it as a normal Outlook email with the link (simplest)**
1. Fill in the placeholders and open the file in a browser.
2. Select all (Ctrl+A), copy, and paste into a new Outlook message. Outlook keeps the formatting.
3. Or save it as a template: in classic Outlook, paste it into a message, then
   **File > Save As > Outlook Template (.oft)**.

**Option B: brand Microsoft's own encrypted-message wrapper (Purview Message Encryption)**
When Outlook's **Encrypt** option is used, Microsoft generates the outer "You've received an
encrypted message" email. You can't replace that HTML, but an admin can brand it with the logo,
colors, intro text, disclaimer and portal text by running this in Exchange Online PowerShell:

```powershell
Set-OMEConfiguration -Identity "OME Configuration" `
  -Image ([System.IO.File]::ReadAllBytes("C:\mercyhome-logo.png")) `
  -BackgroundColor "#1F4E79" `
  -IntroductionText "has sent you a secure message from Mercy Home." `
  -ReadButtonText "Read Secure Message" `
  -EmailText "Mercy Home uses encrypted email to protect your information." `
  -DisclaimerText "This message is confidential and intended only for the named recipient." `
  -PortalText "Mercy Home Secure Messaging"
```

(Advanced Message Encryption, which needs Microsoft 365 E5 or the add-on, lets you create
several branded templates with `New-OMEConfiguration` and apply them with mail-flow rules.)

Don't put this template's own **Read Secure Message** button inside an encrypted email: the
recipient would have to open Microsoft's wrapper before they saw it. Use Option A *or* Option B
for each message.

## Deliverability and anti-phishing tips
"Click here to read your secure message" is a common phishing pattern, so:
- Send only from the real `@mercyhomeny.org` mailbox. Make sure SPF, DKIM and DMARC are set up
  for the domain (Microsoft 365 admin center > Settings > Domains, and Defender > Email
  authentication).
- Keep the link pointing to the real Microsoft or Mercy Home portal domain, without URL shorteners.
- Tell clients ahead of time (in person or by phone) that agreements will arrive this way.
- Send a test to Outlook desktop, Outlook.com, Gmail and an iPhone before rolling it out.
