# Razorpay Payment Integration - Manual Testing Guide

## Prerequisites

1. **Environment Setup**
   - Set up Razorpay test/sandbox keys in `.env`:
     ```
     NEXT_PUBLIC_RAZORPAY_KEY_ID=your_test_key_id
     RAZORPAY_KEY_SECRET=your_test_key_secret
     ```
   - Get keys from: https://dashboard.razorpay.com/apikeys (Test mode)

2. **Early-Bird Discount Testing** (optional)
   - Set a temporary cutoff date in `.env`:
     ```
     EARLY_BIRD_CUTOFF_DATE=2026-12-31T23:59:59Z
     EARLY_BIRD_DISCOUNT_PERCENT=20
     ```
   - Remove or set to past date to test normal pricing

## Test Scenarios

### 1. Order Creation - IEEE Member

**Request:**

```bash
POST /api/razorpay-payment
Headers:
  Authorization: <session_cookie>
Body:
{
  "membershipType": "ieee"
}
```

**Expected Response (early bird pricing):**

```json
{
  "order_id": "order_xxxxx",
  "amount": 49900,
  "currency": "INR",
  "key": "rzp_test_xxxxx"
}
```

**Expected Response (regular pricing):**

```json
{
  "order_id": "order_xxxxx",
  "amount": 59900,
  "currency": "INR",
  "key": "rzp_test_xxxxx"
}
```

### 2. Order Creation - Non-IEEE Member

**Request:**

```bash
POST /api/razorpay-payment
Headers:
  Authorization: <session_cookie>
Body:
{
  "membershipType": "non_ieee"
}
```

**Expected Response (early bird pricing):**

```json
{
  "order_id": "order_xxxxx",
  "amount": 59900,
  "currency": "INR",
  "key": "rzp_test_xxxxx"
}
```

**Expected Response (regular pricing):**

```json
{
  "order_id": "order_xxxxx",
  "amount": 69900,
  "currency": "INR",
  "key": "rzp_test_xxxxx"
}
```

### 3. Invalid Membership Type

**Request:**

```bash
POST /api/razorpay-payment
Headers:
  Authorization: <session_cookie>
Body:
{
  "membershipType": "invalid"
}
```

**Expected Response:**

```json
{
  "error": "Invalid membership type. Must be \"ieee\" or \"non_ieee\""
}
```

Status: 400

### 4. Early Bird Seat Limit Testing

**Test seat exhaustion:**

1. Set early bird cutoff date to future date
2. Complete 10 IEEE payments (or 20 Non-IEEE payments)
3. On the 11th IEEE payment (or 21st Non-IEEE), should automatically switch to regular pricing
4. Console log: `Early bird seats exhausted for ieee. Used: 10, Limit: 10. Switching to regular pricing.`

### 5. Unauthorized Access

**Request:**

```bash
POST /api/razorpay-payment
Headers:
  (no session cookie)
Body:
{
  "membershipType": "ieee"
}
```

**Expected Response:**

```json
{
  "error": "Unauthorized"
}
```

Status: 401

### 5. Signature Verification - Valid Payment

**Request:**

```bash
POST /api/razorpay-payment/verify
Headers:
  Authorization: Bearer <your_jwt_token>
Body:
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "<valid_signature>"
}
```

**Expected Response:**

```json
{
  "confirmed": true
}
```

**Console Output (stubbed DB):**

```
[STUBBED DB] savePaymentToUser called: {
  userId: "user_xxxxx",
  paymentId: "pay_xxxxx",
  timestamp: "2026-08-13T..."
}
```

### 6. Signature Verification - Invalid Signature

**Request:**

```bash
POST /api/razorpay-payment/verify
Body:
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "invalid_signature"
}
```

**Expected Response:**

```json
{
  "confirmed": false,
  "redirect": "/checkout"
}
```

### 7. Signature Verification - Missing Fields

**Request:**

```bash
POST /api/razorpay-payment/verify
Body:
{
  "razorpay_order_id": "order_xxxxx"
}
```

**Expected Response:**

```json
{
  "confirmed": false,
  "redirect": "/checkout"
}
```

## Razorpay Sandbox Test Cards

Enter any of these on the Razorpay checkout — the outcome is determined by which
button you click on the mock payment page afterward, not by the card number itself.

| Card Type  | Card Number         | Expiry          | CVV          |
| ---------- | ------------------- | --------------- | ------------ |
| Visa       | 4111 1111 1111 1111 | Any future date | Any 3 digits |
| Mastercard | 5267 3181 8797 5449 | Any future date | Any 3 digits |

After entering card details, Razorpay shows a mock bank page — click **Success**
to simulate a successful payment, or **Failure** to simulate a decline.

UPI testing: use `success@razorpay` or `failure@razorpay` as the UPI ID to
trigger the corresponding outcome directly.

## Testing Early-Bird Discount

1. **Test with early-bird active:**
   - Set `EARLY_BIRD_CUTOFF_DATE` to a future date
   - Create order for IEEE member → expect ₹400 (20% off ₹500)
   - Create order for Non-IEEE → expect ₹464 (20% off ₹580)

2. **Test without early-bird:**
   - Set `EARLY_BIRD_CUTOFF_DATE` to a past date
   - Create order for IEEE member → expect ₹500
   - Create order for Non-IEEE → expect ₹580

3. **Test with no cutoff configured:**
   - Set `EARLY_BIRD_CUTOFF_DATE=YYYY-MM-DDTHH:mm:ssZ`
   - Early-bird should be inactive (normal pricing)

## Security Testing

1. **Timing Attack Prevention:**
   - The signature verification uses constant-time comparison
   - Test with signatures of varying lengths to ensure consistent response times

2. **Auth Bypass:**
   - Try accessing endpoints without JWT token → should return 401
   - Try with expired/invalid token → should return 401

3. **Signature Tampering:**
   - Modify a single character in a valid signature → should fail verification
   - Swap order_id and payment_id → should fail verification

## Console Log Verification

After successful payment verification, check console for stubbed DB function output:

```
[STUBBED DB] savePaymentToUser called: {
  userId: "...",
  paymentId: "...",
  timestamp: "..."
}
```

This confirms the integration point is working correctly before SU1 lands.

## Common Issues

1. **Razorpay credentials not configured:**
   - Error: "Razorpay credentials not configured in environment variables"
   - Fix: Add `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env`

2. **Invalid signature:**
   - Error: Payment verification fails even with valid payment
   - Fix: Ensure you're using the correct key secret (test vs live mode)

3. **TypeScript errors:**
   - Razorpay SDK may return `amount` as string or number
   - Fix: The code handles both types with type checking

## BE3 — Receipt & Webhook Testing

### Prerequisites

1. **Additional Environment Variables:**

   ```
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/your_invite_link
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM=your_email@gmail.com
   ```

2. **Webhook Setup:**
   - Generate webhook secret in Razorpay dashboard: https://dashboard.razorpay.com/webhooks
   - Configure webhook URL: `https://your-domain.com/api/webhooks/razorpay`
   - Subscribe to `payment.captured` event

### Testing POST /api/send-receipt

**Request:**

```bash
POST /api/send-receipt
Headers:
  Authorization: <session_cookie>
Body:
{
  "paymentId": "pay_xxxxx"
}
```

**Expected Response (success):**

```json
{
  "success": true,
  "message": "Receipt sent successfully"
}
```

**Expected Response (already sent):**

```json
{
  "success": true,
  "message": "Receipt already sent"
}
```

**Expected Response (payment not confirmed):**

```json
{
  "error": "Payment not confirmed or not found"
}
```

Status: 400

### Testing Webhooks

Since webhooks require a publicly reachable URL, use one of these methods:

#### Method 1: Local Tunnel (ngrok)

1. **Install ngrok:**

   ```bash
   # Download from https://ngrok.com/download
   # Or use: choco install ngrok (Windows)
   ```

2. **Start ngrok:**

   ```bash
   ngrok http 3000
   ```

3. **Configure Razorpay webhook:**
   - Use the ngrok URL: `https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/webhooks/razorpay`
   - Add webhook secret to your `.env`

4. **Trigger webhook:**
   - Complete a test payment using the sandbox
   - Razorpay will automatically send the webhook to your ngrok URL

#### Method 2: Razorpay Webhook Replay

1. **Complete a test payment** in sandbox mode
2. **Go to Razorpay dashboard** → Webhooks → Webhook Events
3. **Find the payment.captured event** for your test payment
4. **Click "Replay"** to resend the webhook
5. **Monitor your server logs** for webhook processing

#### Method 3: Manual Webhook Testing

Use curl to test webhook signature verification:

```bash
curl -X POST https://your-domain.com/api/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: <generated_signature>" \
  -d '{
    "event": "payment.captured",
    "payment": {
      "entity": {
        "id": "pay_test123",
        "amount": 50000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_test123",
        "notes": {
          "userId": "test_user_id",
          "membershipType": "ieee"
        }
      }
    }
  }'
```

**Note:** You'll need to generate the correct HMAC-SHA256 signature using your webhook secret for this to work.

### Webhook Idempotency Testing

1. **First webhook call:**
   - Should save payment to DB
   - Should send receipt email
   - Console: `[DB] Payment saved successfully`

2. **Second webhook call (same payment):**
   - Should detect duplicate payment
   - Should NOT send email again
   - Console: `[DB] Payment already recorded for user`

### Email Delivery Testing

1. **Check email inbox:**
   - Use a real email address for testing
   - Verify receipt contains:
     - Payment ID
     - Amount (in rupees)
     - Membership type
     - WhatsApp group link

2. **Check SMTP logs:**
   - Console will show: `Email sent: <message_id>`
   - Verify no SMTP connection errors

### Retry Logic Testing

1. **Test email failure:**
   - Temporarily set invalid `SMTP_PASS`
   - Call `/api/send-receipt`
   - Should retry up to 5 times with exponential backoff
   - Console should show retry attempts

2. **Test webhook email failure:**
   - Set invalid `SMTP_PASS`
   - Trigger webhook
   - Webhook should still return 200 (to avoid retries)
   - Email sending should fail silently in background
   - Console: `[Webhook] Failed to send receipt email`

### Full Integration Test Flow

1. **Complete test payment** via Razorpay sandbox
2. **Call BE2 verify endpoint** to confirm payment
3. **Call BE3 send-receipt endpoint** to send receipt
4. **Verify email received** with correct details
5. **Test webhook replay** to verify idempotency
6. **Test duplicate calls** to verify no duplicate emails

## Next Steps After Testing

1. SU1 (DB Table Setup) is now implemented with the migration.sql schema:
   - `users` table with proper schema (name, email in auth.users, status enum)
   - Payment integration updated to match SU1 schema
   - Status field uses enum: 'account created', 'registration completed', 'payment completed'

2. Early bird seat limits are now enforced:
   - IEEE: 10 early bird seats (₹499), then regular pricing (₹599)
   - Non-IEEE: 20 early bird seats (₹599), then regular pricing (₹699)
   - Automatic switch to regular pricing when seats exhausted

3. Receipt email uses proper amount-to-words conversion:
   - Uses `number-to-words` library
   - Example: "Five Hundred Rupees Only" instead of "500 Rupees"

4. Frontend integration guide available in `PAYMENT_INTEGRATION.md`
