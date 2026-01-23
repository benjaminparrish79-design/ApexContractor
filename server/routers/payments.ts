import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  createPaymentIntent,
  createCheckoutSession,
  getPaymentIntent,
  getCheckoutSession,
  confirmPaymentIntent,
  createRefund,
  verifyWebhookSignature,
  handleWebhookEvent,
} from "../services/stripe";
import { getDb } from "../db";
import { payments, invoices } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const paymentsRouter = router({
  /**
   * Create a payment intent for direct payment
   */
  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        invoiceId: z.number(),
        amount: z.number().positive(),
        currency: z.string().default("USD"),
        clientEmail: z.string().email(),
        clientName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify invoice belongs to user
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const invoice = await db
          .select()
          .from(invoices)
          .where(eq(invoices.id, input.invoiceId))
          .limit(1);

        if (!invoice.length) {
          throw new Error("Invoice not found");
        }

        // Create payment intent
        const paymentIntent = await createPaymentIntent({
          amount: Math.round(input.amount * 100), // Convert to cents
          currency: input.currency,
          invoiceId: input.invoiceId,
          clientEmail: input.clientEmail,
          clientName: input.clientName,
          description: `Payment for invoice ${invoice[0].invoiceNumber}`,
        });

        return {
          success: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        };
      } catch (error) {
        console.error("[Payments] Error creating payment intent:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create payment intent",
        };
      }
    }),

  /**
   * Create a checkout session
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        invoiceId: z.number(),
        amount: z.number().positive(),
        currency: z.string().default("USD"),
        clientEmail: z.string().email(),
        clientName: z.string(),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const invoice = await db
          .select()
          .from(invoices)
          .where(eq(invoices.id, input.invoiceId))
          .limit(1);

        if (!invoice.length) {
          throw new Error("Invoice not found");
        }

        const session = await createCheckoutSession({
          invoiceId: input.invoiceId,
          clientEmail: input.clientEmail,
          clientName: input.clientName,
          amount: Math.round(input.amount * 100),
          currency: input.currency,
          invoiceNumber: invoice[0].invoiceNumber || "INV-001",
          successUrl: input.successUrl,
          cancelUrl: input.cancelUrl,
        });

        return {
          success: true,
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("[Payments] Error creating checkout session:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create checkout session",
        };
      }
    }),

  /**
   * Get payment intent status
   */
  getPaymentIntentStatus: protectedProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .query(async ({ input }) => {
      try {
        const paymentIntent = await getPaymentIntent(input.paymentIntentId);
        return {
          success: true,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
        };
      } catch (error) {
        console.error("[Payments] Error getting payment intent:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to get payment intent",
        };
      }
    }),

  /**
   * Get checkout session status
   */
  getCheckoutSessionStatus: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const session = await getCheckoutSession(input.sessionId);
        return {
          success: true,
          status: session.payment_status,
          paymentIntentId: session.payment_intent as string,
        };
      } catch (error) {
        console.error("[Payments] Error getting checkout session:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to get checkout session",
        };
      }
    }),

  /**
   * Record payment in database
   */
  recordPayment: protectedProcedure
    .input(
      z.object({
        invoiceId: z.number(),
        amount: z.number().positive(),
        paymentMethod: z.string(),
        stripePaymentIntentId: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Verify invoice exists
        const invoice = await db
          .select()
          .from(invoices)
          .where(eq(invoices.id, input.invoiceId))
          .limit(1);

        if (!invoice.length) {
          throw new Error("Invoice not found");
        }

        // Record payment
        const paymentRecord = {
          userId: ctx.user.id,
          invoiceId: input.invoiceId,
          amount: input.amount.toString(),
          paymentMethod: (input.paymentMethod || "card") as "card" | "cash" | "check" | "bank_transfer" | "other",
          paymentDate: new Date(),
          notes: input.notes,
          transactionId: input.stripePaymentIntentId,
        };
        const result = await db.insert(payments).values(paymentRecord);

        // Update invoice status to paid
        await db
          .update(invoices)
          .set({ status: "paid" })
          .where(eq(invoices.id, input.invoiceId));

        return {
          success: true,
          message: "Payment recorded successfully",
        };
      } catch (error) {
        console.error("[Payments] Error recording payment:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to record payment",
        };
      }
    }),

  /**
   * Create a refund
   */
  createRefund: protectedProcedure
    .input(
      z.object({
        paymentIntentId: z.string(),
        amount: z.number().optional(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const refund = await createRefund(
          input.paymentIntentId,
          input.amount ? Math.round(input.amount * 100) : undefined
        );

        return {
          success: true,
          refundId: refund.id,
          amount: refund.amount / 100,
        };
      } catch (error) {
        console.error("[Payments] Error creating refund:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create refund",
        };
      }
    }),
});
