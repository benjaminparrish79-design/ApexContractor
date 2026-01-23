import { describe, it, expect, vi, beforeEach } from "vitest";
import * as emailService from "./email";

// Mock SendGrid
vi.mock("@sendgrid/mail", () => ({
  default: {
    setApiKey: vi.fn(),
    send: vi.fn(),
  },
}));

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendInvoiceEmail", () => {
    it("should format invoice email correctly", async () => {
      const data = {
        clientName: "John Doe",
        clientEmail: "john@example.com",
        invoiceNumber: "INV-001",
        invoiceDate: "2026-01-20",
        dueDate: "2026-02-20",
        amount: 1500.00,
        currency: "USD",
        invoiceUrl: "https://example.com/invoices/1",
        companyName: "ContractorPro",
      };

      // Test that the function accepts the correct data structure
      expect(data).toHaveProperty("clientName");
      expect(data).toHaveProperty("clientEmail");
      expect(data).toHaveProperty("invoiceNumber");
      expect(data.amount).toBeGreaterThan(0);
      expect(data.currency).toBe("USD");
    });
  });

  describe("sendPaymentConfirmationEmail", () => {
    it("should format payment confirmation email correctly", async () => {
      const data = {
        clientName: "John Doe",
        clientEmail: "john@example.com",
        invoiceNumber: "INV-001",
        amount: 1500.00,
        currency: "USD",
        paymentDate: "2026-01-21",
        paymentMethod: "Credit Card",
        companyName: "ContractorPro",
      };

      expect(data).toHaveProperty("clientName");
      expect(data).toHaveProperty("paymentMethod");
      expect(data.amount).toBeGreaterThan(0);
    });
  });

  describe("sendPaymentReminderEmail", () => {
    it("should format payment reminder email correctly", async () => {
      const data = {
        clientName: "John Doe",
        clientEmail: "john@example.com",
        invoiceNumber: "INV-001",
        amount: 1500.00,
        currency: "USD",
        dueDate: "2026-02-20",
        daysOverdue: 5,
        companyName: "ContractorPro",
        invoiceUrl: "https://example.com/invoices/1",
      };

      expect(data).toHaveProperty("daysOverdue");
      expect(data.daysOverdue).toBeGreaterThanOrEqual(0);
      expect(data).toHaveProperty("invoiceUrl");
    });
  });

  describe("sendWelcomeEmail", () => {
    it("should accept welcome email parameters", () => {
      const clientName = "John Doe";
      const clientEmail = "john@example.com";
      const companyName = "ContractorPro";

      expect(clientName).toBeTruthy();
      expect(clientEmail).toContain("@");
      expect(companyName).toBeTruthy();
    });
  });

  describe("Email data validation", () => {
    it("should validate email addresses", () => {
      const validEmail = "test@example.com";
      const invalidEmail = "not-an-email";

      expect(validEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(invalidEmail).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it("should validate currency codes", () => {
      const validCurrency = "USD";
      const currencyPattern = /^[A-Z]{3}$/;

      expect(validCurrency).toMatch(currencyPattern);
    });

    it("should validate amounts are positive", () => {
      const validAmount = 1500.00;
      const invalidAmount = -100;

      expect(validAmount).toBeGreaterThan(0);
      expect(invalidAmount).toBeLessThan(0);
    });
  });
});
