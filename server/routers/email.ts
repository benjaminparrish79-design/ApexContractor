import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  sendInvoiceEmail,
  sendPaymentConfirmationEmail,
  sendPaymentReminderEmail,
  sendWelcomeEmail,
  InvoiceEmailData,
  PaymentConfirmationEmailData,
  PaymentReminderEmailData,
} from "../services/email";

export const emailRouter = router({
  /**
   * Send invoice email to client
   * Protected: Only authenticated users can send emails
   */
  sendInvoice: protectedProcedure
    .input(
      z.object({
        clientName: z.string(),
        clientEmail: z.string().email(),
        invoiceNumber: z.string(),
        invoiceDate: z.string(),
        dueDate: z.string(),
        amount: z.number().positive(),
        currency: z.string().default("USD"),
        invoiceUrl: z.string().url(),
        companyName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const data: InvoiceEmailData = {
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        invoiceNumber: input.invoiceNumber,
        invoiceDate: input.invoiceDate,
        dueDate: input.dueDate,
        amount: input.amount,
        currency: input.currency,
        invoiceUrl: input.invoiceUrl,
        companyName: input.companyName,
      };

      const success = await sendInvoiceEmail(data);
      return { success, message: success ? "Email sent successfully" : "Failed to send email" };
    }),

  /**
   * Send payment confirmation email
   */
  sendPaymentConfirmation: protectedProcedure
    .input(
      z.object({
        clientName: z.string(),
        clientEmail: z.string().email(),
        invoiceNumber: z.string(),
        amount: z.number().positive(),
        currency: z.string().default("USD"),
        paymentDate: z.string(),
        paymentMethod: z.string(),
        companyName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const data: PaymentConfirmationEmailData = {
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        invoiceNumber: input.invoiceNumber,
        amount: input.amount,
        currency: input.currency,
        paymentDate: input.paymentDate,
        paymentMethod: input.paymentMethod,
        companyName: input.companyName,
      };

      const success = await sendPaymentConfirmationEmail(data);
      return { success, message: success ? "Email sent successfully" : "Failed to send email" };
    }),

  /**
   * Send payment reminder email
   */
  sendPaymentReminder: protectedProcedure
    .input(
      z.object({
        clientName: z.string(),
        clientEmail: z.string().email(),
        invoiceNumber: z.string(),
        amount: z.number().positive(),
        currency: z.string().default("USD"),
        dueDate: z.string(),
        daysOverdue: z.number().nonnegative(),
        companyName: z.string(),
        invoiceUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const data: PaymentReminderEmailData = {
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        invoiceNumber: input.invoiceNumber,
        amount: input.amount,
        currency: input.currency,
        dueDate: input.dueDate,
        daysOverdue: input.daysOverdue,
        companyName: input.companyName,
        invoiceUrl: input.invoiceUrl,
      };

      const success = await sendPaymentReminderEmail(data);
      return { success, message: success ? "Email sent successfully" : "Failed to send email" };
    }),

  /**
   * Send welcome email to new client
   */
  sendWelcome: protectedProcedure
    .input(
      z.object({
        clientName: z.string(),
        clientEmail: z.string().email(),
        companyName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const success = await sendWelcomeEmail(input.clientName, input.clientEmail, input.companyName);
      return { success, message: success ? "Email sent successfully" : "Failed to send email" };
    }),

  /**
   * Test email sending (for development)
   */
  sendTest: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const { sendEmail } = await import("../services/email");
      const success = await sendEmail({
        to: input.email,
        subject: "Test Email from ContractorPro",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Test Email</h1>
            <p>This is a test email from ContractorPro.</p>
            <p>If you received this email, SendGrid integration is working correctly!</p>
          </div>
        `,
        text: "This is a test email from ContractorPro.",
      });
      return { success, message: success ? "Test email sent successfully" : "Failed to send test email" };
    }),
});
