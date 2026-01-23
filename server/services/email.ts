import sgMail from "@sendgrid/mail";
import { ENV } from "../_core/env";

// Initialize SendGrid
if (ENV.sendgridApiKey) {
  sgMail.setApiKey(ENV.sendgridApiKey);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface InvoiceEmailData {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  invoiceUrl: string;
  companyName: string;
}

export interface PaymentConfirmationEmailData {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  companyName: string;
}

export interface PaymentReminderEmailData {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  companyName: string;
  invoiceUrl: string;
}

/**
 * Send a generic email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!ENV.sendgridApiKey) {
      console.warn("[Email] SendGrid API key not configured");
      return false;
    }

    const msg = {
      to: options.to,
      from: options.from || ENV.sendgridFromEmail || "noreply@contractorpro.com",
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await sgMail.send(msg);
    console.log(`[Email] Sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

/**
 * Send invoice email to client
 */
export async function sendInvoiceEmail(
  data: InvoiceEmailData
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #333; margin: 0;">Invoice #${data.invoiceNumber}</h1>
        <p style="color: #666; margin: 5px 0;">From ${data.companyName}</p>
      </div>

      <p>Hi ${data.clientName},</p>
      <p>Thank you for your business! Your invoice is ready.</p>

      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #666;">Invoice Date:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold;">${data.invoiceDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;">Due Date:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold;">${data.dueDate}</td>
          </tr>
          <tr style="border-top: 2px solid #ddd;">
            <td style="padding: 10px 0; color: #666;">Amount Due:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 18px;">
              ${data.currency} ${data.amount.toFixed(2)}
            </td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.invoiceUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Invoice
        </a>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        If you have any questions about this invoice, please don't hesitate to reach out.
      </p>

      <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Invoice #${data.invoiceNumber} from ${data.companyName}`,
    html,
    text: `Invoice #${data.invoiceNumber} for ${data.currency} ${data.amount.toFixed(2)} is due on ${data.dueDate}. View: ${data.invoiceUrl}`,
  });
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  data: PaymentConfirmationEmailData
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
        <h1 style="color: #155724; margin: 0;">Payment Received ✓</h1>
        <p style="color: #155724; margin: 5px 0;">Thank you for your payment</p>
      </div>

      <p>Hi ${data.clientName},</p>
      <p>We have received your payment. Here are the details:</p>

      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #666;">Invoice Number:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold;">#${data.invoiceNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;">Amount Paid:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold;">${data.currency} ${data.amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;">Payment Date:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold;">${data.paymentDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;">Payment Method:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold;">${data.paymentMethod}</td>
          </tr>
        </table>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Thank you for your prompt payment. If you have any questions, please contact us.
      </p>

      <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Payment Confirmation for Invoice #${data.invoiceNumber}`,
    html,
    text: `Payment of ${data.currency} ${data.amount.toFixed(2)} received for invoice #${data.invoiceNumber} on ${data.paymentDate}.`,
  });
}

/**
 * Send payment reminder email
 */
export async function sendPaymentReminderEmail(
  data: PaymentReminderEmailData
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
        <h1 style="color: #856404; margin: 0;">Payment Reminder</h1>
        <p style="color: #856404; margin: 5px 0;">Invoice #${data.invoiceNumber} is ${data.daysOverdue} days overdue</p>
      </div>

      <p>Hi ${data.clientName},</p>
      <p>This is a friendly reminder that your invoice is now overdue.</p>

      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #666;">Invoice Number:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold;">#${data.invoiceNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;">Amount Due:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 16px;">
              ${data.currency} ${data.amount.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;">Original Due Date:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold;">${data.dueDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;">Days Overdue:</td>
            <td style="padding: 10px 0; color: #d9534f; font-weight: bold;">${data.daysOverdue} days</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.invoiceUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Pay Now
        </a>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Please arrange payment at your earliest convenience. If payment has already been made, please disregard this notice.
      </p>

      <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Payment Reminder: Invoice #${data.invoiceNumber} is Overdue`,
    html,
    text: `Invoice #${data.invoiceNumber} for ${data.currency} ${data.amount.toFixed(2)} is ${data.daysOverdue} days overdue. Please pay at: ${data.invoiceUrl}`,
  });
}

/**
 * Send welcome email to new client
 */
export async function sendWelcomeEmail(
  clientName: string,
  clientEmail: string,
  companyName: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #004085; margin: 0;">Welcome to ${companyName}!</h1>
      </div>

      <p>Hi ${clientName},</p>
      <p>Thank you for choosing to work with us. We're excited to get started!</p>

      <p>You can now:</p>
      <ul style="color: #666;">
        <li>View your invoices and project details</li>
        <li>Track payment status</li>
        <li>Communicate with our team</li>
      </ul>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        If you have any questions, please don't hesitate to reach out.
      </p>

      <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Welcome to ${companyName}!`,
    html,
    text: `Welcome ${clientName}! Thank you for choosing ${companyName}.`,
  });
}
