# Deliverability checklist

What the template controls: clean, valid HTML; a balanced text-to-code ratio; no tracking pixels; no URL shorteners; link text that matches link destination; a matching plain-text part; no spam-trigger phrasing; a physical address and working contact routes. Everything else below is outside the HTML and matters more. Nothing on this list guarantees inbox placement: Gmail, Microsoft and Yahoo weigh domain reputation, authentication, complaint rates and recipient engagement, and their filters change without notice.

## DNS and authentication

- [ ] Choose a dedicated transactional subdomain, e.g. `notify.example.com`. Keep marketing on a different subdomain so one stream's reputation does not drag down the other.
- [ ] **SPF**: a single `v=spf1` TXT record on `notify.example.com` including only the provider's mechanism (e.g. `include:amazonses.com`), ending `-all` or `~all`, and staying under 10 DNS lookups. The envelope sender (Return-Path / MAIL FROM) must be on this domain: configure custom MAIL FROM / bounce domain at the provider so SPF aligns with the visible From.
- [ ] **DKIM**: 2048-bit keys, published at the provider's selectors, signing with `d=notify.example.com` (or `d=example.com`) so the DKIM domain aligns with the From domain. Rotate keys at least annually.
- [ ] **DMARC** on the organisational domain `example.com`: start with `v=DMARC1; p=none; rua=mailto:dmarc@example.com; ruf=...; adkim=r; aspf=r;`, review aggregate reports for 2 to 4 weeks, then move to `p=quarantine` and finally `p=reject` with `sp=reject` for subdomains. `p=reject` is what stops attackers sending mail that claims to be from your domain, and it is a prerequisite for BIMI.
- [ ] **BIMI** (optional, recommended once DMARC is at enforcement): publish the SVG Tiny PS logo and obtain a Verified Mark Certificate so Gmail, Yahoo and Apple Mail show your logo next to the message. This is the strongest visual authenticity signal available to recipients.
- [ ] **Reverse DNS / PTR** on sending IPs matches a hostname that resolves back (provider handles this on shared IPs; verify on dedicated IPs).
- [ ] **MTA-STS and TLS-RPT** for inbound mail to your domain (`_mta-sts` and `_smtp._tls` records plus the policy file), so replies and reports to you are also protected.
- [ ] **Outbound TLS**: confirm the provider sends with opportunistic TLS 1.2+ and, where offered, enable "require TLS" or MTA-STS-aware delivery. Check Gmail's padlock indicator on test messages.

## Sender identity

- [ ] From display name is the platform name, stable and recognisable; From address is on the authenticated subdomain; never `noreply@` with no reply handling.
- [ ] Reply-To is the document sender (or support). Replies must land in a monitored place.
- [ ] The same company name, logo, colours and domain appear in the email, on the landing page and on the website, so the recipient's eye confirms continuity.
- [ ] A fixed, documented list of sending addresses is published on your help centre ("Emails from us come from these addresses") so recipients and corporate IT can verify and allowlist.

## Provider configuration

- [ ] Open tracking off; click tracking off for this template.
- [ ] Custom Return-Path / bounce domain configured and verified.
- [ ] Bounce, complaint and delivery webhooks wired to the application (see integration.md) with signature verification.
- [ ] Suppression list enabled and honoured automatically for hard bounces and complaints.
- [ ] Separate provider sub-accounts or message streams for transactional and marketing.
- [ ] Sending limits and warm-up schedule agreed with the provider.
- [ ] Feedback-ID header set so Gmail Postmaster Tools reports per stream.

## Reputation and sending practices

- [ ] Only send to addresses a sender typed deliberately; validate syntax and MX at envelope creation and warn the sender about typos before sending.
- [ ] Complaint rate kept under 0.1% (Gmail/Yahoo enforce at 0.3%), bounce rate under 2%.
- [ ] Reminder cadence is limited (e.g. at most every 3 days, max 5) and user-adjustable; reminders are the main complaint source for e-signature platforms.
- [ ] Abuse controls on the sending side (security-review.md, item 1): verified sender emails, new-account rate limits, content screening of sender messages and titles. Platform abuse by phishers is the fastest way to lose domain reputation.
- [ ] No purchased lists, no marketing content in transactional mail, no "forward to a friend" mechanisms.

## Compliance

- [ ] Transactional notifications about a document addressed to the recipient are generally exempt from marketing consent rules (CAN-SPAM "transactional or relationship" content, PECR/GDPR legitimate interest, CASL implied consent), provided the content stays transactional. Keep any promotional content out of this template.
- [ ] Physical postal address and company legal name in the footer; privacy policy linked; a route to manage reminder preferences.
- [ ] Privacy notice covers processing of recipients' names and emails supplied by senders (they are data subjects who never signed up with you).
- [ ] Data retention for delivery logs and notification copies is defined and matches your audit-trail requirements.
- [ ] Legal review of the "will never ask you for a password, payment details or a verification code by email" statement; it must be true for every email you send.

## Monitoring

- [ ] Google Postmaster Tools (domain and IP reputation, spam rate, authentication rates), Microsoft SNDS and JMRP (Outlook.com complaints), Yahoo Sender Hub.
- [ ] DMARC aggregate reports parsed by a service (Valimail, dmarcian, Postmark DMARC, or a self-hosted parser) with alerts for new unauthorised sources.
- [ ] Blocklist monitoring for sending IPs and domains (Spamhaus, SURBL, URIBL for the link domain).
- [ ] Seed-list placement tests (GlockApps, Litmus Spam Testing, Mail-Tester) before launch and monthly.
- [ ] Alerts on delivery rate, bounce rate, complaint rate and deferral rate per receiving domain, with Gmail, Outlook.com and Yahoo broken out.
- [ ] A quarterly review of DNS records, DKIM key age, and the provider's published IP ranges in your SPF.
