"""
Seed the Knowledge Base with popular help desk topics, Q&A, and guides.
Run via:  flask --app run seed-kb
"""

KB_ARTICLES = [

    # ── PASSWORD & LOGIN ───────────────────────────────────────────────────────

    {
        "title": "How do I reset my password?",
        "category": "Password & Login",
        "tags": "password,reset,login,account recovery",
        "content": """Forgetting your password is one of the most common account issues — and it's easy to fix.

**Step-by-step password reset:**

1. Go to the login page and click **"Forgot password?"** below the sign-in button.
2. Enter the email address associated with your account.
3. Check your inbox for a reset email (also check your spam/junk folder — it can end up there).
4. Click the link in the email within **15 minutes** — reset links expire for security reasons.
5. Choose a new password that is at least 8 characters and includes a mix of letters, numbers, and symbols.
6. Log in with your new password.

**Didn't receive the reset email?**
- Make sure you're using the exact email address you registered with.
- Check your spam or promotions folder.
- Add noreply@aihelpddesk.com to your contacts to prevent future emails going to spam.
- Wait 5 minutes — email delivery can occasionally be delayed.
- If you still haven't received it, contact support and we'll verify your identity and reset it manually.

**Tips for a strong password:**
- Use at least 12 characters.
- Mix uppercase, lowercase, numbers, and symbols (e.g. ! @ # $).
- Avoid using your name, birthday, or common words like "password123".
- Use a unique password for each account — a password manager like Bitwarden or 1Password can help.

**Why do reset links expire?**
Reset links are single-use and expire after 15 minutes to prevent anyone from using an old intercepted link to take over your account. If your link has expired, simply request a new one from the login page.""",
    },

    {
        "title": "Why can't I log in to my account?",
        "category": "Password & Login",
        "tags": "login,account,locked,password,troubleshooting",
        "content": """If you're having trouble logging in, here are the most common causes and how to fix each one.

**1. Wrong password**
This is the most frequent login issue. Try typing your password slowly — passwords are case-sensitive. If you've forgotten it, use the "Forgot password?" link on the login page.

**2. Wrong email address**
Double-check you're using the email you registered with. Try any alternative emails you may have used (work email, old personal email, etc.).

**3. Account locked after too many failed attempts**
After 5 failed login attempts, accounts are temporarily locked for 15 minutes as a security measure. Wait 15 minutes and try again, or use the password reset option.

**4. Caps Lock is on**
Passwords are case-sensitive. Check that Caps Lock is off before typing your password.

**5. Browser auto-fill is using an old password**
Your browser may be filling in a password you've since changed. Clear the saved password in your browser settings and type it manually.

**6. Account not yet verified**
If you just registered, check your email for a verification link. You must verify your email before you can log in.

**7. Account suspended**
In rare cases, an account may be suspended due to a policy violation or suspicious activity. If you believe this is an error, contact our support team with your account email.

**Still can't log in?**
Open a support ticket and include:
- The email address on your account
- What error message you see (if any)
- The device and browser you're using

We typically respond within 2 hours.""",
    },

    {
        "title": "How do I create a strong, secure password?",
        "category": "Password & Login",
        "tags": "password,security,best practices,strong password",
        "content": """A strong password is your first line of defence against unauthorized access. Here's what makes a password truly secure and how to create one.

**What makes a password strong?**

| Feature | Weak | Strong |
|---|---|---|
| Length | 6–7 characters | 12+ characters |
| Characters | Letters only | Letters + numbers + symbols |
| Predictability | "password", "123456", your name | Random phrase or generator |
| Reuse | Same on every site | Unique per account |

**The best method: use a passphrase**
String 4–5 random words together: `correct-horse-battery-staple`. This is long, memorable, and very hard to crack. Add a number or symbol for extra strength: `correct-Horse-battery-staple7!`

**Use a password manager**
You only need to remember ONE strong master password. The manager stores and auto-fills everything else. Recommended options:
- **Bitwarden** (free, open source)
- **1Password** (excellent family/team plans)
- **Dashlane** (great breach monitoring)
- **Apple Keychain** / **Google Password Manager** (built-in, convenient)

**Passwords to avoid:**
- Your name, birthday, or pet's name
- Sequential numbers: 123456, 111111
- Common words: password, qwerty, letmein
- Keyboard patterns: qwerty, asdfgh
- Anything under 8 characters

**Check if your password has been breached:**
Visit [haveibeenpwned.com](https://haveibeenpwned.com) — enter your email to see if it has appeared in known data breaches. If it has, change that password everywhere you've used it immediately.

**Change passwords regularly:**
For high-value accounts (email, banking, work systems), changing your password every 3–6 months is a good habit. Always change it immediately if you suspect any unauthorized access.""",
    },

    {
        "title": "My account says it's locked — what do I do?",
        "category": "Password & Login",
        "tags": "locked,account,security,login,failed attempts",
        "content": """Account lockouts are a built-in security feature that protects you from brute-force attacks — where someone (or a bot) tries thousands of passwords to break into your account.

**Why accounts get locked:**
Your account is automatically locked after **5 consecutive failed login attempts**. This prevents automated attacks from guessing your password.

**How to unlock your account:**

**Option 1 — Wait it out (fastest)**
Accounts unlock automatically after **15 minutes**. If you're just having a momentary password issue, this is the easiest fix.

**Option 2 — Reset your password**
Click "Forgot password?" on the login page. Resetting your password also clears the lockout immediately — you won't have to wait.

**Option 3 — Contact support**
If neither option above works, open a ticket with:
- Your account email address
- The approximate time you were locked out
- Your current location/IP (optional but helpful)

Our team can manually unlock your account after verifying your identity.

**Security tip — if you didn't trigger the lockout:**
If you received a lockout notification but weren't trying to log in, this means someone else may be trying to access your account. You should:
1. Reset your password immediately using a strong, new password.
2. Enable two-factor authentication (2FA) to prevent future unauthorized access.
3. Check your account's recent activity (if available) and contact support if anything looks suspicious.""",
    },

    {
        "title": "How do I change my email address or username?",
        "category": "Password & Login",
        "tags": "email,username,account,change,update",
        "content": """You can update your account email address or display name at any time through your account settings.

**To change your display name:**
1. Log in to your account.
2. Click your profile avatar or name in the top navigation.
3. Select **Account Settings** or **Profile**.
4. Update your display name and click **Save Changes**.

**To change your email address:**
1. Go to **Account Settings → Email**.
2. Enter your new email address.
3. Enter your current password to confirm the change.
4. A verification link will be sent to your **new** email address.
5. Click the link in that email to confirm the change.

Your old email will remain active until you confirm the new one, so you won't lose access during the process.

**Important notes:**
- Your email address is also your login username, so after the change you'll log in with the new address.
- If you don't receive the verification email, check your spam folder or request a new one.
- If you no longer have access to your old email and need to update it, contact support — we'll verify your identity through an alternative method.

**Why do we require verification?**
Changing an email without verification would let anyone who briefly accesses your device hijack your account by switching the email. The verification step ensures only the true owner can make this change.""",
    },

    # ── SECURITY & TWO-FACTOR AUTHENTICATION ──────────────────────────────────

    {
        "title": "What is two-factor authentication (2FA) and should I use it?",
        "category": "Security",
        "tags": "2FA,two-factor authentication,MFA,security,account protection",
        "content": """Two-factor authentication (2FA) — also called multi-factor authentication (MFA) — adds a second layer of security to your account beyond just your password. Even if someone steals your password, they still can't get in without the second factor.

**How it works:**
When 2FA is enabled, logging in requires:
1. **Something you know** — your password
2. **Something you have** — a code from your phone, an authenticator app, or a hardware key

**Why it matters:**
According to Microsoft, accounts with MFA enabled are **99.9% less likely to be compromised**. It's the single most effective step you can take to protect your account.

**Types of 2FA (from most to least secure):**

| Method | How it works | Security level |
|---|---|---|
| Hardware key (e.g. YubiKey) | Physical USB/NFC key | Highest |
| Authenticator app (e.g. Google Authenticator, Authy) | 30-second time-based code | High |
| Push notification | Approve on your phone | High |
| SMS text message | Code sent via text | Medium |
| Email code | Code sent to your email | Lower |

**Recommended: use an authenticator app**
Apps like **Google Authenticator**, **Microsoft Authenticator**, or **Authy** generate a new 6-digit code every 30 seconds. They work offline and can't be intercepted like SMS messages can.

**How to enable 2FA on your account:**
1. Go to **Account Settings → Security**.
2. Toggle on **Two-Factor Authentication**.
3. Scan the QR code with your authenticator app.
4. Enter the 6-digit code to confirm setup.
5. Save your **backup codes** in a safe place — these let you in if you lose your phone.

The small extra step at login is absolutely worth it for the protection it provides.""",
    },

    {
        "title": "How do I recognize a phishing email or scam?",
        "category": "Security",
        "tags": "phishing,scam,email,security,fraud",
        "content": """Phishing is one of the most common ways accounts get compromised. Attackers send fake emails that look like they're from a legitimate service to trick you into handing over your password or personal information.

**Red flags that an email might be phishing:**

**1. Urgency and threats**
"Your account will be suspended in 24 hours!" or "Immediate action required!" — legitimate companies rarely create panic. Urgency is a manipulation tactic.

**2. Suspicious sender address**
The display name might say "Support Team" but the actual email address is something like support@ahd-security-alert.xyz. Always check the full sender email, not just the name.

**3. Generic greetings**
"Dear Customer" or "Dear User" instead of your actual name. Legitimate services know your name.

**4. Links that don't match**
Hover over any link (don't click) and check the URL shown at the bottom of your screen. If it doesn't match the company's real domain, it's a phishing link.

**5. Unexpected attachments**
Legitimate companies rarely send unsolicited attachments. Never open .zip, .exe, .doc, or .pdf files from unexpected emails.

**6. Requests for passwords or card numbers**
No legitimate company will ever ask for your password via email. Ever.

**What to do if you receive a suspicious email:**
- Do NOT click any links or download attachments.
- Do NOT reply with any personal information.
- Forward it to our abuse team at security@aihelpdesk.com.
- Delete the email.

**If you already clicked a link:**
1. Change your password immediately.
2. Enable 2FA if you haven't already.
3. Check your account for any unauthorized activity.
4. Contact support so we can flag and protect your account.""",
    },

    {
        "title": "How do I keep my account secure?",
        "category": "Security",
        "tags": "security,account protection,best practices,safety",
        "content": """Account security is a shared responsibility. Here's a practical checklist to keep your account — and your data — safe.

**Essential security checklist:**

✅ **Use a strong, unique password**
Every account should have its own password. Use a password manager to keep track of them without reusing.

✅ **Enable two-factor authentication (2FA)**
This single step blocks 99.9% of automated account attacks. Go to Account Settings → Security to enable it.

✅ **Keep your email account secure**
Your email is the master key to all your other accounts (password resets go there). Protect it with a strong password and 2FA.

✅ **Log out on shared or public devices**
If you log in from a library computer, school lab, or a friend's device, always log out when done.

✅ **Don't save passwords in public or shared browsers**
Never let a shared browser save your password. Use a private/incognito window instead.

✅ **Watch for suspicious account activity**
If you get an unexpected login notification or see activity you don't recognize, change your password immediately and contact support.

✅ **Keep your devices updated**
Software updates patch security vulnerabilities. Enable automatic updates on your phone and computer.

✅ **Use secure networks**
Avoid accessing sensitive accounts over public Wi-Fi. If you must, use a VPN.

**Warning signs your account may be compromised:**
- Emails you didn't send appearing in your Sent folder
- Password reset emails you didn't request
- Login notifications from unfamiliar locations
- Changes to your account settings you didn't make

If you notice any of these, immediately change your password and contact our security team.""",
    },

    {
        "title": "What should I do if I think my account has been hacked?",
        "category": "Security",
        "tags": "hacked,compromised,security,account,breach",
        "content": """If you suspect your account has been accessed without your permission, act quickly. The faster you respond, the less damage can be done.

**Immediate steps to take:**

**Step 1 — Change your password immediately**
Go to Account Settings → Security → Change Password. Choose a completely new password you haven't used anywhere before.

**Step 2 — Revoke all active sessions**
In Security Settings, look for "Active Sessions" or "Logged-in Devices" and click "Log out all other sessions." This kicks out anyone currently using your account.

**Step 3 — Enable 2FA if it isn't already on**
Even if the attacker has your password, 2FA will block them from getting back in.

**Step 4 — Check for unauthorized changes**
Review your:
- Email address (did someone change it?)
- Profile name and information
- Any connected apps or integrations
- Sent messages or submitted tickets

**Step 5 — Contact our support team**
Open a ticket immediately. Tell us:
- When you first noticed suspicious activity
- What changes you observed
- The email on your account

We can review server-side logs, flag the account, and help you recover any content.

**Step 6 — Check your email account**
If your email was also compromised, the attacker may have used it to access multiple accounts via password resets. Secure your email first — it's the most important account you have.

**After the immediate response:**
- Change passwords on any other accounts where you used the same password.
- Run an antivirus/malware scan on your device.
- Check haveibeenpwned.com to see if your email appeared in a data breach.

We take account security seriously and our team is available to assist you 24/7.""",
    },

    {
        "title": "Is my personal data safe? How do you protect it?",
        "category": "Security",
        "tags": "privacy,data security,encryption,personal data,GDPR",
        "content": """We take the security of your personal data extremely seriously. Here's a transparent breakdown of how we protect your information.

**Data encryption:**
- All data transmitted between your browser and our servers is encrypted using **TLS 1.3** (the padlock in your browser address bar confirms this).
- Passwords are never stored in plain text — they are hashed using **bcrypt**, a one-way algorithm. Even our team cannot see your password.
- Sensitive database fields are encrypted at rest.

**Infrastructure security:**
- Our servers are hosted on Hugging Face Spaces, which uses enterprise-grade infrastructure with physical security and access controls.
- We use a dedicated PostgreSQL database (Neon) with restricted access.
- Regular automated backups are performed.

**Access controls:**
- Only authorized staff (agents and admins) can view support tickets.
- All admin actions are logged for audit purposes.
- We operate on a principle of least privilege — team members only access what they need.

**What data we collect:**
- Your email address and display name (used to identify your account)
- Support tickets and messages you submit
- Basic usage analytics (anonymized — we hash IP addresses)
- No payment card data is stored on our servers

**Your rights under privacy law (GDPR / CCPA):**
- **Right to access** — request a copy of all data we hold about you
- **Right to deletion** — request that we delete your account and associated data
- **Right to correction** — update any incorrect personal information
- **Right to portability** — export your data in a machine-readable format

To exercise any of these rights, contact our support team with your account email. We respond to all data requests within 30 days.""",
    },

    # ── ACCOUNT MANAGEMENT ────────────────────────────────────────────────────

    {
        "title": "How do I update my profile information?",
        "category": "Account",
        "tags": "profile,account,settings,update,name",
        "content": """Keeping your profile up to date ensures you receive the right support and communications from our team.

**What you can update:**
- Display name
- Email address (requires email verification)
- Password
- Notification preferences
- Profile avatar/photo (if supported)

**How to update your profile:**
1. Log in to your account.
2. Click your name or avatar in the top-right corner of the navigation bar.
3. Select **Profile Settings** or **Account Settings**.
4. Make your changes in the relevant fields.
5. Click **Save Changes** to apply.

**Updating your email address:**
Email changes require an extra verification step to protect your account. After you enter a new email address, a verification link is sent to the NEW address. Click that link to confirm the change. Your old email stays active until you confirm.

**Updating your password:**
Go to **Account Settings → Security → Change Password**. You'll need to enter your current password first. Choose a new password that is at least 8 characters long and hasn't been used on your account before.

**Notification preferences:**
You can control what emails you receive:
- Ticket status updates
- New message notifications
- Security alerts (we strongly recommend keeping these on)
- Promotional or newsletter emails

**Changes not taking effect?**
Try clearing your browser cache and reloading the page. If problems persist, open a support ticket and we'll investigate.""",
    },

    {
        "title": "How do I delete my account?",
        "category": "Account",
        "tags": "delete,account,deactivate,close account,privacy",
        "content": """We're sorry to see you go. You have the right to delete your account and all associated data at any time.

**Before you delete — things to know:**
- Account deletion is **permanent and irreversible**. We cannot recover your account after deletion.
- All your tickets, messages, and data will be permanently removed from our systems within 30 days.
- If you have an active subscription, cancel it first to avoid being charged again.
- Consider whether you just need to update your preferences or take a break instead.

**How to delete your account:**
1. Log in to your account.
2. Go to **Account Settings** (click your avatar in the navbar).
3. Scroll to the bottom and click **Delete My Account**.
4. Enter your current password to confirm.
5. Click **Confirm Deletion**.

You'll receive a confirmation email. Your account will be immediately deactivated and scheduled for permanent deletion within 30 days.

**If you can't access your account:**
Contact our support team and request account deletion. We'll verify your identity and process the deletion on your behalf. We will complete your request within 30 days in accordance with GDPR requirements.

**What gets deleted:**
- Your name and email address
- Your support tickets and message history
- Any saved preferences or settings
- Profile information

**What we may retain:**
We may retain anonymized, aggregated data (e.g., "a support ticket was created on this date") that cannot be traced back to you. This helps us improve our service. Billing records may also be retained for the legally required period (typically 7 years for tax purposes).""",
    },

    {
        "title": "How do I contact support and what are your response times?",
        "category": "Account",
        "tags": "support,contact,response time,help,ticket",
        "content": """Our support team is here to help. Here's how to reach us and what to expect.

**Ways to get help:**

**1. Ask AI (Fastest — available 24/7)**
Use the "Ask AI" button in the navigation. Our AI assistant draws from this knowledge base and can answer most common questions instantly without waiting for a human agent.

**2. Submit a Support Ticket**
For issues the AI can't resolve, click "New Question" to submit a ticket. A human agent will review and respond.

**3. Email**
You can reach us directly at support@aihelpdesk.com for urgent or sensitive matters.

**Response time targets:**

| Priority | Description | Target response |
|---|---|---|
| Critical | Account locked, security breach, data issue | < 1 hour |
| High | Can't access key features, billing error | < 4 hours |
| Normal | General questions, how-to requests | < 24 hours |
| Low | Feature requests, suggestions | < 72 hours |

**Support hours:**
Our team is available Monday–Friday, 9am–6pm (GMT). AI support is available 24/7.

**Tips for faster resolution:**
- Be as specific as possible in your ticket title and description.
- Include any error messages you're seeing (copy the exact text or take a screenshot).
- Mention what you've already tried — this helps us skip steps you've already done.
- Include your account email so we can find your account quickly.

**Track your ticket:**
After submitting a ticket, you can see its status (Open, Pending, Resolved) from the My Questions page. You'll also receive email notifications when an agent replies.""",
    },

    {
        "title": "How do I manage notification settings?",
        "category": "Account",
        "tags": "notifications,email,settings,alerts,preferences",
        "content": """You can control exactly which notifications you receive so you only get the messages that matter to you.

**Types of notifications:**

**Security alerts** (Recommended: ON)
- Login from a new device or location
- Password changes
- Failed login attempts
- Account changes

These are critical for account security. We strongly recommend keeping them enabled.

**Support ticket updates** (Recommended: ON)
- When an agent replies to your ticket
- When your ticket status changes (e.g., moved to Pending or Resolved)
- When your ticket is closed

**AI response notifications**
- When the AI has responded to your question
- Summary of AI answers sent to your inbox

**General announcements** (Optional)
- Platform updates and new features
- Maintenance notifications
- Tips and how-to guides

**How to change notification settings:**
1. Log in and click your profile avatar.
2. Select **Account Settings → Notifications**.
3. Toggle each notification type on or off.
4. Click **Save Preferences**.

**Not receiving notifications you expect?**
- Check your spam/junk folder and mark our emails as "Not Spam".
- Add noreply@aihelpdesk.com to your contacts.
- Make sure the correct email is on your account.
- Some email clients (especially corporate ones) may filter automated emails — check with your IT team if this is a work account.""",
    },

    # ── BILLING & SUBSCRIPTIONS ───────────────────────────────────────────────

    {
        "title": "How does billing work and what plans are available?",
        "category": "Billing",
        "tags": "billing,pricing,plans,subscription,payment",
        "content": """Here's everything you need to know about how billing works on AI Help Desk.

**Available plans:**

**Free Plan**
- Access to AI-powered answers
- Submit up to 5 support tickets per month
- Knowledge base access
- Standard response times
- Perfect for individuals with occasional support needs

**Pro Plan ($9.99/month)**
- Unlimited support tickets
- Priority response times (< 4 hours)
- Advanced AI features
- Email notifications
- Ideal for regular users who need faster support

**Business Plan ($29.99/month or $299/year)**
- Everything in Pro
- Dedicated support agent
- SLA guarantees
- Team management tools (up to 10 users)
- Custom integrations
- Priority phone support

**How billing works:**
- Subscriptions are billed monthly or annually (annual plans save ~17%).
- Billing occurs automatically on the same day each month (your billing anniversary).
- You'll receive an email receipt after every payment.
- Payment is processed securely via Stripe — we never store your full card number.

**Accepted payment methods:**
- Visa, Mastercard, American Express
- PayPal
- Bank transfer (Business plans only)

**Changing your plan:**
You can upgrade or downgrade at any time from **Account Settings → Billing**. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period.""",
    },

    {
        "title": "How do I cancel my subscription?",
        "category": "Billing",
        "tags": "cancel,subscription,billing,refund,downgrade",
        "content": """You can cancel your subscription at any time — there are no long-term contracts or cancellation fees.

**How to cancel:**
1. Log in to your account.
2. Go to **Account Settings → Billing**.
3. Click **Cancel Subscription**.
4. Select a reason (optional — it helps us improve).
5. Confirm the cancellation.

**What happens after you cancel:**
- You keep full access to your paid plan features until the **end of your current billing period**.
- After that, your account automatically moves to the Free plan.
- You are NOT charged again.
- Your account and all your data remain active — you're not locked out.

**Example:**
If you cancel on June 5th and your billing renews on June 20th, you'll have Pro access through June 20th and then move to Free.

**Requesting a refund:**
- If you cancel within **7 days** of a charge and haven't used the service significantly, you may be eligible for a refund. Contact support to request one.
- We handle refunds on a case-by-case basis and aim to be fair.
- Annual plan refunds: if you cancel an annual plan within the first 30 days, we'll refund the remaining months as a pro-rata amount.

**What if I was charged after I cancelled?**
This can happen if the cancellation didn't complete properly. Contact support with:
- Your account email
- The amount and date of the charge
- Proof of cancellation if available (screenshot/email)

We'll investigate and issue a refund if a billing error occurred.""",
    },

    {
        "title": "Why was I charged an unexpected amount?",
        "category": "Billing",
        "tags": "billing,charge,unexpected,refund,payment issue",
        "content": """Seeing an unexpected charge is concerning. Here are the most common reasons and how to resolve each.

**Common reasons for unexpected charges:**

**1. Annual plan renewal**
If you're on an annual plan, you may have forgotten it was coming up. We send a renewal reminder email 14 days before the charge date. Check your inbox (and spam folder) for this notification.

**2. Plan upgrade**
If you recently upgraded your plan, the new price would have been charged immediately (minus a pro-rated credit for the remaining days on your old plan).

**3. Tax added to your invoice**
Depending on your location, local taxes (VAT, GST, sales tax) may apply and can make the total higher than the base plan price.

**4. Trial period ended**
If you started a free trial, it automatically converts to a paid plan when the trial expires. We send a reminder before this happens.

**5. Failed payment retry**
If a previous payment failed (e.g., expired card), our system retries. If the retry succeeds on a different date, the charge may appear unexpected.

**What to do:**

1. **Check your billing history**: Account Settings → Billing → Invoice History shows every charge with a description.

2. **Check for a receipt email**: Every charge triggers a receipt to your email address. Search your inbox for "AI Help Desk receipt" or "Stripe receipt."

3. **Contact support**: If you still can't explain the charge, open a ticket with:
   - The amount charged
   - The date of the charge
   - The last 4 digits of the card charged

We'll look up your billing records and explain or refund the charge within 24 hours.""",
    },

    {
        "title": "How do I update my payment method?",
        "category": "Billing",
        "tags": "payment,billing,card,update,credit card",
        "content": """Keeping your payment method up to date prevents service interruptions when your subscription renews.

**How to update your card:**
1. Log in to your account.
2. Go to **Account Settings → Billing → Payment Methods**.
3. Click **Add Payment Method** or **Update Card**.
4. Enter your new card details.
5. Click **Save** — the new card becomes your default.

**You can also:**
- Add multiple payment methods and choose which is default.
- Remove an old card once a new one is saved.
- View the last 4 digits and expiry date of your saved cards (we never show full card numbers).

**Payment security:**
We use Stripe for all payment processing. Your full card number never touches our servers — Stripe processes and stores it in a PCI-DSS Level 1 compliant environment, the highest standard of card security.

**What happens if my payment fails?**
If a payment fails (expired card, insufficient funds, etc.):
1. We'll send you an email notification immediately.
2. We retry the payment after 3 days, then again after 5 days.
3. If payment still fails after multiple retries, your account is moved to the Free plan until you update your payment method.
4. Your data and tickets are preserved — you just lose Pro features temporarily.

**Preferred payment not available?**
We currently support major credit/debit cards and PayPal. If you need to pay by bank transfer (for Business plans) or require an invoice, contact our billing team at billing@aihelpdesk.com.""",
    },

    # ── TECHNICAL ISSUES ──────────────────────────────────────────────────────

    {
        "title": "The site is slow or not loading — how do I fix it?",
        "category": "Technical",
        "tags": "slow,loading,performance,browser,troubleshooting",
        "content": """If the site feels slow or pages aren't loading correctly, there are several things you can try before contacting support — most issues are quick to fix.

**Step 1 — Check your internet connection**
Try opening another website (like google.com). If that also fails, the issue is your internet, not our platform.
- Restart your router (unplug for 30 seconds, plug back in).
- Try switching from Wi-Fi to a wired connection or vice versa.

**Step 2 — Clear your browser cache**
A corrupted cache is one of the most common causes of site loading issues.
- **Chrome**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac) → Clear browsing data → Cached images and files → Clear data.
- **Firefox**: Ctrl+Shift+Delete → Cache → Clear.
- **Safari**: Cmd+Option+E to clear cache, then reload.
- **Edge**: Ctrl+Shift+Delete → Cached images and files → Clear now.

**Step 3 — Try a different browser**
If the site loads fine in another browser (e.g., try Chrome if you're using Firefox), the issue is browser-specific. Try reinstalling or updating your primary browser.

**Step 4 — Disable browser extensions**
Ad blockers, VPN extensions, or security plugins can sometimes interfere with site functionality. Try opening the site in a private/incognito window (these disable most extensions by default).

**Step 5 — Check our status page**
We may have an active incident or maintenance window. Check our status at status.aihelpdesk.com or follow @AIHelpDeskStatus on Twitter.

**Step 6 — Try a different device or network**
If you have access to another phone or computer, test there. If it works, the issue is device-specific.

**Still having issues?**
Open a support ticket and include:
- Your browser and version (Help → About in Chrome/Firefox)
- Your operating system (Windows 11, macOS 14, etc.)
- What specifically isn't loading or loading slowly
- Any error messages you see""",
    },

    {
        "title": "Why isn't my file upload working?",
        "category": "Technical",
        "tags": "upload,file,error,PDF,DOCX,technical",
        "content": """File upload issues are usually caused by file size, format, or browser limitations. Here's how to diagnose and fix them.

**Supported file types:**
Our platform supports the following file types for knowledge base and ticket attachments:
- **PDF** (.pdf)
- **Word documents** (.docx, .doc)
- **Plain text** (.txt)

**Maximum file size:** 10 MB per file.

**Common upload issues and fixes:**

**"File type not supported"**
The file extension must be .pdf, .docx, .doc, or .txt. Files saved with the wrong extension (e.g., a PDF renamed to .doc) will fail. Re-save or export the file in a supported format.

**"File too large"**
Files over 10 MB are rejected. Try:
- Compressing your PDF (use Adobe Acrobat's "Reduce File Size" or free tools like smallpdf.com).
- Removing images from a Word document.
- Splitting a large document into smaller sections.

**Upload seems stuck / progress bar doesn't complete**
- Check your internet connection speed (a slow upload takes longer for large files).
- Try a different browser — Chrome or Firefox work best.
- Disable VPN temporarily, as some VPNs interfere with file transfers.
- Clear your browser cache and try again.

**"Error processing file"**
This usually means the file is corrupted or password-protected:
- Open the file on your computer to confirm it works.
- Remove any password protection before uploading.
- Re-export or re-save the file to fix potential corruption.

**Still stuck?**
Try copying the text content into a plain .txt file and uploading that. You can then paste it into the content field directly. If none of these work, send the file to our support team at support@aihelpdesk.com and we'll help.""",
    },

    {
        "title": "Why is the AI giving me wrong or unhelpful answers?",
        "category": "Technical",
        "tags": "AI,answers,accuracy,Ask AI,knowledge base",
        "content": """Our AI assistant is designed to give you fast, accurate answers based on our knowledge base. If you're getting responses that aren't helpful, here's why it happens and what to do.

**Why AI answers may be inaccurate:**

**1. The question is outside the knowledge base**
The AI answers based on articles in our knowledge base. If no article covers your specific issue, the AI may give a general or uncertain answer. This is when you should escalate to a human agent.

**2. Vague or ambiguous questions**
The more specific your question, the better the answer. Compare:
- Vague: "It's not working" → AI doesn't know what "it" refers to
- Specific: "I'm getting a 'file too large' error when uploading a PDF on Chrome" → AI can give a precise answer

**3. The question is very new**
If your issue is related to a recent platform change or known bug, the knowledge base may not yet be updated. Human agents have access to real-time information.

**Tips for better AI answers:**

- **Be specific**: Include the exact error message, the feature you're using, and what you expected vs. what happened.
- **Provide context**: "I'm a free plan user trying to upload a file" gives the AI more to work with.
- **Ask one question at a time**: Multi-part questions can confuse the AI — break them up.
- **Rephrase and retry**: Sometimes asking the same thing in different words gets a better answer.

**When to escalate to a human agent:**
- The AI says "I'm not sure" or gives a very generic response
- Your issue involves billing, account security, or personal data
- The AI's suggestion doesn't fix your problem after 2–3 attempts
- You need a decision or exception made (e.g., a refund, an account override)

Click "Submit Ticket" after any AI conversation to escalate to a human agent — we'll have the context from your AI conversation to help us respond faster.""",
    },

    {
        "title": "How do I fix common browser issues with the site?",
        "category": "Technical",
        "tags": "browser,chrome,firefox,safari,compatibility,technical",
        "content": """Most website display or functionality issues can be traced back to your browser. Here are the most effective fixes.

**Quick fixes to try first:**

**Hard refresh**
Forces the browser to reload everything fresh (bypasses cache):
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

**Open in a private/incognito window**
This disables extensions and uses a clean cache state. If the site works in private mode, the issue is with an extension or your cache.
- Chrome: Ctrl+Shift+N (Cmd+Shift+N on Mac)
- Firefox: Ctrl+Shift+P
- Safari: Cmd+Shift+N

**Disable extensions one by one**
Go to your browser's extension/add-on manager and disable extensions one at a time, testing the site after each. Common culprits include:
- Ad blockers (uBlock Origin, AdBlock Plus)
- VPN extensions
- Privacy Badger
- Cookie managers

**Clear all site data**
Sometimes clearing just the cache isn't enough — old cookies or local storage can cause issues.
- Chrome: Open DevTools (F12) → Application → Storage → Clear site data.

**Update your browser**
Running an outdated browser can cause compatibility issues. Update to the latest version:
- Chrome: Three dots menu → Help → About Google Chrome
- Firefox: Three dots menu → Help → About Firefox
- Edge: Three dots menu → Help and feedback → About Microsoft Edge

**Supported browsers:**
We officially support the latest two versions of:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Apple Safari

If you're using an older browser or an uncommon one (like Internet Explorer or older Opera), upgrading to a modern browser will likely fix your issue.""",
    },

    {
        "title": "How do I use the AI Help Desk effectively?",
        "category": "Getting Started",
        "tags": "getting started,how to,AI,tickets,tips,guide",
        "content": """Welcome to AI Help Desk! Here's everything you need to know to get the most out of the platform.

**What AI Help Desk does:**
AI Help Desk is a smart support platform that combines AI-powered instant answers with human expert support. Most questions get answered in seconds by AI — and for anything more complex, our support agents step in.

**The support flow:**

1. **Ask AI first** — Click "Ask AI" in the navigation and type your question. The AI searches the knowledge base and gives you an answer instantly, 24/7, no waiting.

2. **Browse the knowledge base** — The Help Center contains detailed guides, how-to articles, and troubleshooting steps for common issues.

3. **Submit a ticket for human support** — If the AI can't resolve your issue, click "New Question" to open a ticket. A human agent reviews it and responds within our SLA timeframe.

4. **Track your questions** — The "My Questions" page shows all your tickets and their current status (Open, Pending, Resolved).

**Tips for getting faster answers:**

- **Be specific in your question title** — "PDF upload fails with 'file too large' error" gets resolved faster than "upload not working".
- **Include error messages** — Copy the exact error text or attach a screenshot.
- **Set the right priority** — Mark as Critical/High only for genuine emergencies so agents can triage accurately.
- **Check the knowledge base first** — Search for your issue using the search bar in the Help Center. Many questions are answered there instantly.

**Roles on the platform:**
- **User** — Submit tickets, chat with AI, browse the knowledge base.
- **Agent** — Respond to and manage support tickets, add knowledge base articles.
- **Admin** — Full platform access including user management and analytics.

**Need to reach a human quickly?**
If your issue is urgent (e.g., billing error, account security), mention "URGENT" in your ticket title. Our team monitors for priority tickets and responds faster.""",
    },

    # ── PRIVACY & DATA ────────────────────────────────────────────────────────

    {
        "title": "What personal data do you collect and why?",
        "category": "Privacy",
        "tags": "privacy,data,GDPR,personal information,collection",
        "content": """We believe in being fully transparent about the data we collect. Here's exactly what we collect, why, and how we use it.

**Data we collect:**

**Account information**
- Email address — used for login, notifications, and account recovery
- Display name — shown in the interface and on tickets
- Password — stored as a secure one-way hash (we cannot read your password)
- Account creation date and role

**Support activity**
- Tickets and messages you submit — needed to provide support
- AI conversation history — used to give contextual answers
- Ticket status and agent responses

**Technical/usage data**
- IP address (hashed/anonymized) — used only for analytics and fraud prevention
- Browser type and operating system — helps us fix compatibility issues
- Pages visited and time spent — used to improve the platform

**What we do NOT collect:**
- Payment card numbers (handled by Stripe, never touches our servers)
- Social media profiles
- Location data beyond what your IP address suggests
- Device contacts or microphone/camera access

**Why we collect this data:**
- To provide and improve the support service
- To keep your account secure
- To comply with legal obligations
- To communicate with you about your support requests

**How long we keep your data:**
- Active account data: kept as long as your account is active
- Deleted account data: removed within 30 days of deletion request
- Anonymized analytics: retained indefinitely as it cannot identify you
- Billing records: retained for 7 years (legal requirement)

**Third parties with access to your data:**
- **Stripe** — payment processing (PCI-DSS compliant)
- **Neon / PostgreSQL** — database hosting
- **Hugging Face** — infrastructure hosting
- **OpenAI / Anthropic** — AI response generation (ticket content may be processed)

We do not sell your personal data to third parties. Ever.""",
    },

    {
        "title": "How do I request my data or have it deleted?",
        "category": "Privacy",
        "tags": "GDPR,data deletion,right to erasure,data export,privacy rights",
        "content": """Under privacy laws (GDPR in Europe, CCPA in California, and similar laws elsewhere), you have rights over your personal data. We respect and support these rights.

**Your rights:**

**Right to Access (Data Subject Access Request — DSAR)**
You can request a copy of all personal data we hold about you. We'll provide it in a machine-readable format (JSON or CSV) within 30 days.

**Right to Deletion (Right to be Forgotten)**
You can request that we permanently delete all personal data we hold about you. Under GDPR Article 17, we must comply within 30 days.

**Right to Correction**
If any data we hold is inaccurate, you can request we correct it. Most data you can update yourself in Account Settings.

**Right to Portability**
You can request your data in a structured, portable format so you can transfer it to another provider.

**Right to Restrict Processing**
You can ask us to stop processing your data while we handle a dispute or correction request.

**How to submit a request:**
1. Email privacy@aihelpdesk.com with the subject line: "Data Request — [Your Request Type]"
2. Include your full name and the email address on your account.
3. We may ask you to verify your identity to protect against unauthorized requests.

Or open a support ticket and select "Privacy / Data Request" as the category.

**Response times:**
- We acknowledge all requests within 72 hours.
- We complete requests within 30 days (up to 90 days for complex cases — we'll notify you if this applies).

**What happens when you request deletion:**
- Your account is deactivated immediately.
- Personal data is permanently erased within 30 days.
- Anonymized, aggregated records (which can't be linked to you) may be retained for analytics.
- Billing records are retained for the legally required period (7 years) as required by financial regulations.""",
    },

    # ── GETTING STARTED ───────────────────────────────────────────────────────

    {
        "title": "How do I create an account?",
        "category": "Getting Started",
        "tags": "register,sign up,create account,new user",
        "content": """Getting started with AI Help Desk takes less than 2 minutes. Here's how to create your account.

**Steps to register:**
1. Click the **"Sign up"** button in the top-right corner of the navigation bar.
2. Enter your full name, email address, and a password.
3. Read and agree to our Terms of Service and Privacy Policy.
4. Click **"Create Account"**.
5. Check your email inbox for a verification email and click the link inside.
6. You're in! You can now ask questions and submit support tickets.

**Requirements:**
- A valid email address you have access to.
- A password that is at least 8 characters long.
- You must be 13 years or older.

**Didn't receive the verification email?**
- Check your spam/junk folder.
- Add noreply@aihelpdesk.com to your contacts.
- Wait up to 5 minutes — email delivery can occasionally be delayed.
- On the login page, click "Resend verification email" if available.

**Already have an account?**
Click "Sign in" instead of "Sign up" on the homepage.

**Signing up as a team / business?**
If you're setting up support for a team, register with your work email address and then contact us to upgrade to a Business plan, which includes multi-user access and a dedicated support agent.""",
    },

    {
        "title": "What can the AI assistant help me with?",
        "category": "Getting Started",
        "tags": "AI,Ask AI,capabilities,help,features",
        "content": """Our AI assistant is your first point of contact — available 24/7 with no wait times. Here's what it can and can't do.

**What the AI is great at:**

✅ Answering questions in the knowledge base instantly
✅ Troubleshooting common technical issues (slow loading, login errors, upload problems)
✅ Explaining how features work step by step
✅ Guiding you through account tasks (password reset, profile update, notification settings)
✅ Summarizing our policies (billing, privacy, cancellation)
✅ Suggesting next steps when something isn't working

**What the AI cannot do:**

❌ Access your personal account details or ticket history
❌ Process refunds or make billing changes
❌ Override account suspensions
❌ Provide real-time system status (check status.aihelpdesk.com for that)
❌ Make exceptions to policies
❌ Guarantee answers to questions not in the knowledge base

**How the AI works:**
Our AI uses Retrieval-Augmented Generation (RAG) — it searches the knowledge base for relevant articles and uses them as context to generate accurate, grounded answers. It won't hallucinate information that isn't in our knowledge base.

**How to get the best results from the AI:**
- Ask complete questions: "How do I reset my password if I don't have access to my email?"
- Include relevant context: "I'm on a Free plan and I'm seeing a 'limit reached' error"
- If the AI gives a partial answer, ask a follow-up: "Can you explain step 3 in more detail?"

**When to switch to a human agent:**
If the AI responds with "I'm not certain" or "I'd recommend contacting support," escalate by clicking **Submit Ticket**. The AI conversation context is saved so the agent can pick up right where the AI left off.""",
    },

    {
        "title": "What are the differences between Free and Pro plans?",
        "category": "Getting Started",
        "tags": "free plan,pro plan,pricing,features,comparison",
        "content": """Choosing the right plan depends on how often you need support and how quickly you need responses.

**Feature comparison:**

| Feature | Free | Pro | Business |
|---|---|---|---|
| AI-powered answers | Unlimited | Unlimited | Unlimited |
| Support tickets per month | 5 | Unlimited | Unlimited |
| Knowledge base access | Full | Full | Full |
| Response time | 24–72 hours | < 4 hours | < 1 hour |
| Priority queue | No | Yes | Yes |
| Dedicated agent | No | No | Yes |
| SLA guarantee | No | No | Yes |
| Team members | 1 | 1 | Up to 10 |
| Email notifications | Basic | Full | Full |
| Price | Free forever | $9.99/month | $29.99/month |

**Who should use Free?**
The Free plan is ideal if you:
- Have occasional, non-urgent support needs
- Are comfortable waiting up to 24–72 hours for responses
- Only need standard questions answered

**Who should upgrade to Pro?**
Upgrade to Pro if you:
- Need faster responses (under 4 hours)
- Submit more than 5 tickets per month
- Need to escalate issues quickly

**Who needs Business?**
Business is designed for teams that:
- Need SLA guarantees and a dedicated agent
- Have multiple team members who need support access
- Require enterprise-level security and compliance

**How to upgrade:**
Go to **Account Settings → Billing → Upgrade Plan** and choose your plan. You can upgrade or downgrade at any time — changes take effect on your next billing cycle (downgrades) or immediately (upgrades).""",
    },

]


def run_seed(db, KnowledgeBase):
    """Insert KB articles, skipping any whose title already exists."""
    existing_titles = {a.title for a in KnowledgeBase.query.all()}
    added = 0
    for item in KB_ARTICLES:
        if item["title"] in existing_titles:
            continue
        article = KnowledgeBase(
            title=item["title"],
            content=item["content"],
            category=item.get("category", ""),
            tags=item.get("tags", ""),
        )
        db.session.add(article)
        added += 1
    db.session.commit()
    return added
