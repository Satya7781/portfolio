# Formspree Email Configuration Guide

## Issue: Not Receiving Emails

You mentioned that submissions are visible on the Formspree site but you're not receiving emails. Here's how to fix this:

### Step 1: Verify Your Email in Formspree

1. **Log in to Formspree**: Go to [https://formspree.io](https://formspree.io) and sign in
2. **Check Email Verification**: 
   - Go to your account settings
   - Make sure your email address is **verified**
   - If not verified, click the verification link sent to your email
   - Check your spam/junk folder for the verification email

### Step 2: Configure Form Settings

1. **Go to Your Form Dashboard**: Navigate to your form `mkogladz`
2. **Check Email Settings**:
   - Click on "Settings" or "Email" tab
   - Verify the **notification email** is set to: `satya07781@gmail.com`
   - Make sure email notifications are **enabled**

### Step 3: Check Spam/Junk Folder

- Formspree emails often end up in spam initially
- Check your Gmail spam folder
- If you find emails there, mark them as "Not Spam"
- Add `noreply@formspree.io` to your contacts

### Step 4: Email Whitelist (Important!)

Add these email addresses to your Gmail contacts or whitelist:
- `noreply@formspree.io`
- `team@formspree.io`

### Step 5: Formspree Plan Check

- **Free Plan**: Limited to 50 submissions per month
- **Email Delivery**: Sometimes delayed on free plan
- Check if you've exceeded your monthly limit

### Step 6: Verify the submission payload

The website submits the visitor's email in the `email` field and the message
subject in Formspree's `_subject` field. Do not hard-code your own address as
`_replyto`: that would prevent you from replying directly to the visitor.

### Step 7: Test the Form

1. Open your website
2. Fill out the contact form
3. Submit it
4. You should see the thank you modal (stays on same page)
5. Check Formspree dashboard to confirm submission
6. Wait 1-2 minutes and check your email (including spam)

### Common Issues & Solutions

**Problem**: Emails going to spam
- **Solution**: Whitelist Formspree emails, mark as "Not Spam"

**Problem**: Email not verified
- **Solution**: Check verification email in spam folder

**Problem**: Wrong email configured
- **Solution**: Update notification email in Formspree settings

**Problem**: Monthly limit exceeded
- **Solution**: Upgrade plan or wait for next month

### What Changed in Your Website

✅ **Form submits via AJAX** - No page redirect
✅ **Custom thank-you modal** - Shows on the same page after a successful response
✅ **User stays on the site** - The form does not open a new tab
✅ **Formspree-compatible fields** - Visitor email and subject are sent correctly
✅ **Visible error handling** - Failed submissions show an explanation below the form

### Testing Checklist

- [ ] Email verified in Formspree
- [ ] Notification email configured correctly
- [ ] Checked spam/junk folder
- [ ] Whitelisted Formspree emails
- [ ] Tested form submission
- [ ] Confirmed submission in Formspree dashboard
- [ ] Received email notification

### Need More Help?

Contact Formspree support: support@formspree.io

## Email deliverability for satya07781@gmail.com

To improve delivery when sending from the custom domain:

1. If you later send from a custom domain, add your mailbox provider's SPF record to that domain's DNS TXT record. Keep one combined SPF record only; do not create multiple SPF TXT records.
2. If you later send from a custom domain, enable DKIM in the mailbox provider and publish the exact selector TXT or CNAME record it gives you.
3. If you later send from a custom domain, add a DMARC TXT record at `_dmarc.yourdomain.com`, starting with a monitoring policy such as `v=DMARC1; p=none; rua=mailto:satya07781@gmail.com`, then tighten it after reviewing reports.
4. Configure Formspree's notification and reply-to settings from the Formspree dashboard. Do not put SMTP credentials or API keys in the frontend.

## Turnstile note

The form contains an optional Cloudflare Turnstile mount point. Add the public site key in
`content.js` to render it. Formspree can validate the submitted Turnstile token server-side
when configured in its dashboard. If you need independent verification, route submissions
through a Cloudflare Worker and keep the Turnstile secret key and email provider credentials
in Worker secrets; never add them to `content.js` or `script.js`.

## Cookie-free analytics

The site has event hooks for `book_call_click`, `form_submit_*`, and `case_study_open`.
Configure Plausible or Umami by adding their provider script and site ID; do not add a
third-party analytics script that uses advertising cookies without updating the privacy policy
and consent flow.
