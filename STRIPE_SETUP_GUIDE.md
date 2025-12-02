# Stripe Payment Setup Guide

## Overview
This guide explains how to configure Stripe payment integration for Studiply, including both test and live modes.

## Current Configuration

### Live Mode Keys (Production)
- **Publishable Key**: `pk_live_your_publishable_key_here`
- **Secret Key**: `sk_live_your_secret_key_here`

⚠️ **IMPORTANT**: These are LIVE MODE keys. Real payments will be processed and real money will be charged.

## Environment Variables Setup

### Local Development (backend/.env)

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_MODE=live
```

### Production (Vercel/Railway)

Set these environment variables in your hosting platform:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_MODE` (optional, defaults based on key prefix)

## Webhook Setup

### 1. Create Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL:
   - **Production**: `https://your-backend-url.com/api/payment/stripe/webhook`
   - **Local Testing**: Use Stripe CLI (see below)
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded` (optional)
5. Copy the "Signing secret" (starts with `whsec_`)
6. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### 2. Local Webhook Testing (Stripe CLI)

For local development, use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Or download from: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3003/api/payment/stripe/webhook
```

This will give you a webhook signing secret starting with `whsec_` for local testing.

## Test Mode (Recommended for Development)

### Getting Test Mode Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Toggle to "Test mode" (top right)
3. Copy test keys:
   - Test Publishable Key: `pk_test_...`
   - Test Secret Key: `sk_test_...`

### Test Card Numbers

Use these test card numbers in test mode:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment (for testing errors):**
- Card: `4000 0000 0000 0002`

### Switching to Test Mode

Update your `.env` file:
```bash
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
STRIPE_MODE=test
```

## Payment Flow

1. **User clicks "Get Started"** on Purchase page
2. **Frontend calls** `/api/payment/stripe/create-checkout-session`
3. **Backend creates** Stripe Checkout Session
4. **User redirected** to Stripe Checkout page
5. **User completes payment** on Stripe
6. **Stripe redirects** back to `/purchase?success=true&session_id=...`
7. **Frontend verifies** payment via `/api/payment/stripe/verify-payment`
8. **Stripe sends webhook** to `/api/payment/stripe/webhook`
9. **Backend updates** user subscription in Firestore

## Funds and Payouts

### Where Money Goes

1. **Payment processed** → Funds go to your Stripe account
2. **Stripe holds funds** (typically 2-7 days for new accounts)
3. **Automatic payouts** → Funds transferred to your bank account

### Setting Up Payouts

1. Go to [Stripe Dashboard → Settings → Bank accounts](https://dashboard.stripe.com/settings/banking)
2. Add your bank account
3. Complete account verification
4. Configure payout schedule:
   - Daily (default)
   - Weekly
   - Monthly

### Account Verification

Before receiving payouts, you may need to:
- Verify business information
- Provide tax information
- Complete identity verification
- Add bank account details

## Security Best Practices

1. **Never commit keys to Git**
   - `.env` files are in `.gitignore`
   - Use environment variables in production

2. **Rotate keys regularly**
   - If keys are compromised, rotate immediately
   - Update environment variables in all environments

3. **Use different keys for test/live**
   - Never use live keys in development
   - Test thoroughly in test mode first

4. **Monitor webhook events**
   - Check Stripe Dashboard for webhook delivery status
   - Set up alerts for failed webhooks

## Troubleshooting

### Payment Not Processing

1. Check `STRIPE_SECRET_KEY` is set correctly
2. Verify key matches mode (test vs live)
3. Check Stripe Dashboard for error logs
4. Ensure webhook is configured correctly

### Webhook Not Working

1. Verify `STRIPE_WEBHOOK_SECRET` is set
2. Check webhook endpoint URL is correct
3. Use Stripe CLI for local testing
4. Check webhook delivery logs in Stripe Dashboard

### Subscription Not Updating

1. Check webhook is receiving events
2. Verify Firestore update logic in `backend/routes/payment.js`
3. Check user document exists in Firestore
4. Review server logs for errors

## Support

For Stripe-related issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Dashboard](https://dashboard.stripe.com)

For Studiply-specific issues:
- Contact: contact@studiply.it

