import Stripe from "stripe";
import { ENV } from "../_core/env";

// Initialize Stripe
let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient && ENV.stripeSecretKey) {
    stripeClient = new Stripe(ENV.stripeSecretKey);
  }
  if (!stripeClient) {
    throw new Error("Stripe API key not configured");
  }
  return stripeClient;
}

export interface CreatePaymentIntentInput {
  amount: number; // Amount in cents
  currency: string;
  invoiceId: number;
  clientEmail: string;
  clientName: string;
  description: string;
}

export interface CreateCheckoutSessionInput {
  invoiceId: number;
  clientEmail: string;
  clientName: string;
  amount: number; // Amount in cents
  currency: string;
  invoiceNumber: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create a payment intent for direct payment
 */
export async function createPaymentIntent(
  input: CreatePaymentIntentInput
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: input.amount,
    currency: input.currency.toLowerCase(),
    description: input.description,
    metadata: {
      invoiceId: input.invoiceId.toString(),
      clientEmail: input.clientEmail,
      clientName: input.clientName,
    },
    receipt_email: input.clientEmail,
  });

  return paymentIntent;
}

/**
 * Create a Stripe checkout session for invoice payment
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: input.currency.toLowerCase(),
          product_data: {
            name: `Invoice #${input.invoiceNumber}`,
            description: `Payment for invoice ${input.invoiceNumber}`,
          },
          unit_amount: input.amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    customer_email: input.clientEmail,
    metadata: {
      invoiceId: input.invoiceId.toString(),
      invoiceNumber: input.invoiceNumber,
    },
  });

  return session;
}

/**
 * Retrieve a payment intent
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Retrieve a checkout session
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();
  return await stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Confirm a payment intent
 */
export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();

  return await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
  });
}

/**
 * Create a refund
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> {
  const stripe = getStripeClient();

  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount,
  });
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event | null {
  if (!ENV.stripeWebhookSecret) {
    console.warn("[Stripe] Webhook secret not configured");
    return null;
  }

  try {
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(body, signature, ENV.stripeWebhookSecret);
    return event;
  } catch (error) {
    console.error("[Stripe] Webhook verification failed:", error);
    return null;
  }
}

/**
 * Handle webhook events
 */
export async function handleWebhookEvent(
  event: Stripe.Event
): Promise<{ success: boolean; message: string }> {
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe] Payment succeeded: ${paymentIntent.id}`);
        return {
          success: true,
          message: `Payment ${paymentIntent.id} succeeded`,
        };
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe] Payment failed: ${paymentIntent.id}`);
        return {
          success: true,
          message: `Payment ${paymentIntent.id} failed`,
        };
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[Stripe] Checkout completed: ${session.id}`);
        return {
          success: true,
          message: `Checkout session ${session.id} completed`,
        };
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`[Stripe] Charge refunded: ${charge.id}`);
        return {
          success: true,
          message: `Charge ${charge.id} refunded`,
        };
      }

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
        return {
          success: true,
          message: `Event ${event.type} received`,
        };
    }
  } catch (error) {
    console.error("[Stripe] Error handling webhook:", error);
    return {
      success: false,
      message: "Error handling webhook event",
    };
  }
}

/**
 * Get publishable key for frontend
 */
export function getPublishableKey(): string {
  // Extract publishable key from secret key format
  // In production, this should be stored separately
  return process.env.STRIPE_PUBLISHABLE_KEY || "";
}
