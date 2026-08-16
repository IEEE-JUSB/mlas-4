# Payment Integration - Frontend Guide

This guide explains how to integrate the Razorpay payment flow into your frontend application.

## Overview

The payment flow consists of these main steps:

1. **IEEE Verification** - User submits IEEE membership details for admin verification
2. **Admin Verification** - Admin verifies IEEE membership (admin dashboard - separate concern)
3. **Create Order** - Call `/api/razorpay-payment` to create a Razorpay order
4. **Process Payment** - Use Razorpay checkout to complete payment
5. **Verify Payment** - Call `/api/razorpay-payment/verify` to confirm payment
6. **Send Receipt** - Call `/api/send-receipt` to send receipt email

## Important: IEEE Membership Verification

**IEEE members must be verified by admin before they can access IEEE pricing.**

- Users select IEEE membership type in profile form
- Admin verifies IEEE membership via admin dashboard (separate concern)
- Once verified, `is_ieee_member` field is set to `true` in database
- Only verified IEEE members can create orders with IEEE pricing
- Non-verified users attempting IEEE pricing will receive 403 error
- Non-IEEE members can always access Non-IEEE pricing

## Prerequisites

- User must be authenticated (Supabase session)
- Razorpay SDK must be loaded on the frontend
- Environment variables must be configured

## Step 1: Load Razorpay SDK

Add this to your layout or payment page:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Or install via npm:

```bash
npm install razorpay
```

## Step 2: Check IEEE Verification Status

Before allowing IEEE pricing, check if the user has been verified:

```typescript
async function checkIEEEVerification() {
  const supabase = createClient();
  const { data: userData, error } = await supabase.from('users').select('is_ieee_member').single();

  if (error) {
    throw new Error('Failed to check verification status');
  }

  return userData?.is_ieee_member || false;
}
```

## Step 3: Create Payment Order

```typescript
async function createPaymentOrder(membershipType: 'ieee' | 'non_ieee') {
  // For IEEE membership, check verification status first
  if (membershipType === 'ieee') {
    const isVerified = await checkIEEEVerification();
    if (!isVerified) {
      throw new Error('IEEE membership not verified. Please wait for admin verification.');
    }
  }

  const response = await fetch('/api/razorpay-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ membershipType }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create payment order');
  }

  const data = await response.json();
  return data; // { order_id, amount, currency, key }
}
```

## Step 4: Process Payment with Razorpay Checkout

```typescript
function openRazorpayCheckout(orderDetails: any, userData: any) {
  const options = {
    key: orderDetails.key,
    amount: orderDetails.amount,
    currency: orderDetails.currency,
    name: 'MLAS-4 Workshop',
    description: 'Workshop Registration',
    order_id: orderDetails.order_id,
    handler: async function (response: any) {
      // Payment successful - verify on server
      await verifyPayment(response);
    },
    prefill: {
      name: userData.name,
      email: userData.email,
    },
    theme: {
      color: '#0066cc',
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
```

## Step 5: Verify Payment

```typescript
async function verifyPayment(razorpayResponse: any) {
  const response = await fetch('/api/razorpay-payment/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    }),
  });

  if (!response.ok) {
    throw new Error('Payment verification failed');
  }

  const data = await response.json();

  if (data.confirmed) {
    // Payment confirmed - send receipt
    await sendReceipt(razorpayResponse.razorpay_payment_id);
  } else {
    // Payment not confirmed
    console.error('Payment verification failed');
  }
}
```

## Step 6: Send Receipt

```typescript
async function sendReceipt(paymentId: string) {
  const response = await fetch('/api/send-receipt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentId }),
  });

  if (!response.ok) {
    throw new Error('Failed to send receipt');
  }

  const data = await response.json();

  if (data.success) {
    // Receipt sent successfully
    console.log('Receipt sent:', data.message);
  }
}
```

## Complete Example

```typescript
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PaymentForm() {
  const [loading, setLoading] = useState(false);
  const [membershipType, setMembershipType] = useState<'ieee' | 'non_ieee'>('non_ieee');
  const [isIEEEVerified, setIsIEEEVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    checkIEEEVerification();
  }, []);

  const checkIEEEVerification = async () => {
    setCheckingVerification(true);
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('is_ieee_member')
        .single();

      if (!error && userData) {
        setIsIEEEVerified(userData.is_ieee_member || false);
      }
    } catch (error) {
      console.error('Failed to check verification status:', error);
    } finally {
      setCheckingVerification(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Step 1: Create order (includes verification check)
      const orderDetails = await createPaymentOrder(membershipType);

      // Step 2: Open Razorpay checkout
      openRazorpayCheckout(orderDetails, {
        name: 'User Name',
        email: 'user@example.com',
      });

    } catch (error: any) {
      console.error('Payment failed:', error);
      alert(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const createPaymentOrder = async (membershipType: 'ieee' | 'non_ieee') => {
    // For IEEE membership, check verification status first
    if (membershipType === 'ieee' && !isIEEEVerified) {
      throw new Error('IEEE membership not verified. Please wait for admin verification before proceeding with IEEE pricing.');
    }

    const response = await fetch('/api/razorpay-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membershipType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order');
    }

    return await response.json();
  };

  const openRazorpayCheckout = (orderDetails: any, userData: any) => {
    const options = {
      key: orderDetails.key,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: 'MLAS-4 Workshop',
      description: 'Workshop Registration',
      order_id: orderDetails.order_id,
      handler: async (response: any) => {
        await verifyPayment(response);
      },
      prefill: {
        name: userData.name,
        email: userData.email,
      },
      theme: { color: '#0066cc' },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const verifyPayment = async (razorpayResponse: any) => {
    const response = await fetch('/api/razorpay-payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      }),
    });

    if (!response.ok) throw new Error('Verification failed');
    const data = await response.json();

    if (data.confirmed) {
      await sendReceipt(razorpayResponse.razorpay_payment_id);
      alert('Payment successful! Receipt sent.');
    }
  };

  const sendReceipt = async (paymentId: string) => {
    const response = await fetch('/api/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId }),
    });

    if (!response.ok) throw new Error('Failed to send receipt');
    return await response.json();
  };

  return (
    <div>
      <h1>Workshop Registration</h1>

      {checkingVerification ? (
        <p>Checking verification status...</p>
      ) : (
        <>
          <div>
            <label>
              <input
                type="radio"
                value="ieee"
                checked={membershipType === 'ieee'}
                onChange={(e) => setMembershipType(e.target.value as 'ieee' | 'non_ieee')}
                disabled={!isIEEEVerified}
              />
              IEEE Member (₹499 Early Bird / ₹599 Regular)
              {!isIEEEVerified && <span> - Verification pending</span>}
            </label>
          </div>

          <div>
            <label>
              <input
                type="radio"
                value="non_ieee"
                checked={membershipType === 'non_ieee'}
                onChange={(e) => setMembershipType(e.target.value as 'ieee' | 'non_ieee')}
              />
              Non-IEEE Member (₹599 Early Bird / ₹699 Regular)
            </label>
          </div>

          <button onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </>
      )}
    </div>
  );
}
```

## Error Handling

Always handle these error scenarios:

- User not authenticated (401)
- Invalid membership type (400)
- IEEE membership not verified (403) - User must wait for admin verification
- Payment gateway not configured (500)
- Payment verification failed
- Receipt sending failed

## Early Bird Pricing

- Early bird pricing is automatically applied based on cutoff date
- Seat limits are enforced (10 IEEE, 20 Non-IEEE)
- When seats are exhausted, regular pricing is automatically applied
- IEEE seat limits only count verified IEEE members

## Testing

Use Razorpay sandbox test cards for testing:

- Success: `4242 4242 4242 4242`
- Failure: `4000 0000 0000 0002`

See `RAZORPAY_TESTING.md` for detailed testing instructions.
