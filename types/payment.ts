export type MembershipType = 'ieee' | 'non_ieee';

export interface CreatePaymentLinkResponse {
  paymentLinkUrl: string;
}

export interface PricingConfig {
  amount: number;
  currency: string;
  isEarlyBird: boolean;
}

export interface RazorpayWebhookPayload {
  event: 'payment_link.paid';
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
    payment_link: {
      entity: {
        id: string;
        notes: {
          userId?: string;
          membershipType?: string;
          pricingTier?: 'early_bird' | 'regular';
        };
      };
    };
  };
}
