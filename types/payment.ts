export type MembershipType = 'ieee' | 'non_ieee';

export interface CreateOrderRequest {
  membershipType: MembershipType;
}

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  confirmed: boolean;
  redirect?: string;
}

export interface PricingConfig {
  amount: number;
  currency: string;
  isEarlyBird: boolean;
}

// BE3 Types
export interface SendReceiptRequest {
  paymentId: string;
}

export interface SendReceiptResponse {
  success: boolean;
  message?: string;
}

export interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        created_at?: number;
        method?: string;
        bank?: string;
        wallet?: string;
        notes: {
          userId?: string;
          membershipType?: string;
          pricingTier?: 'early_bird' | 'regular';
        };
      };
    };
  };
}
