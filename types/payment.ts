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
