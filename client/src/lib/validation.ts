import { z } from "zod";

/**
 * Comprehensive validation schemas for all forms
 */

// Invoice validation
export const invoiceSchema = z.object({
  clientId: z.number().min(1, "Client is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  status: z.enum(["draft", "sent", "viewed", "paid", "overdue"]),
  subtotal: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  taxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid tax amount"),
  total: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid total"),
  notes: z.string().optional(),
  dueDate: z.date().optional(),
});

// Project validation
export const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
  clientId: z.number().min(1, "Client is required"),
  status: z.enum(["planning", "in_progress", "completed", "on_hold"]),
  startDate: z.date(),
  endDate: z.date().optional(),
  budget: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid budget format").optional(),
});

// Client validation
export const clientSchema = z.object({
  name: z.string().min(2, "Client name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[\d\-\+\(\)\s]+$/, "Invalid phone number").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

// Expense validation
export const expenseSchema = z.object({
  projectId: z.number().min(1, "Project is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  description: z.string().optional(),
  costDate: z.date().optional(),
  receipt: z.string().optional(),
  isTaxDeductible: z.boolean().optional(),
});

// Team member validation
export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().regex(/^[\d\-\+\(\)\s]+$/, "Invalid phone number").optional(),
  role: z.enum(["admin", "manager", "worker"]).optional(),
  hourlyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid hourly rate").optional(),
  specialization: z.string().optional(),
});

// Bid validation
export const bidSchema = z.object({
  projectId: z.number().min(1, "Project is required"),
  clientId: z.number().min(1, "Client is required"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid bid amount"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  validUntil: z.date().optional(),
  status: z.enum(["draft", "sent", "accepted", "rejected"]).optional(),
});

// Payment validation
export const paymentSchema = z.object({
  invoiceId: z.number().min(1, "Invoice is required"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid payment amount"),
  paymentMethod: z.enum(["cash", "check", "credit_card", "bank_transfer", "other"]),
  paymentDate: z.date(),
  notes: z.string().optional(),
  referenceNumber: z.string().optional(),
});

// Time entry validation
export const timeEntrySchema = z.object({
  projectId: z.number().min(1, "Project is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  hours: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid hours format"),
  date: z.date(),
  teamMemberId: z.number().optional(),
});

// Business settings validation
export const businessSettingsSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  taxRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid tax rate"),
  invoicePrefix: z.string().min(1, "Invoice prefix is required"),
  bidPrefix: z.string().min(1, "Bid prefix is required"),
  nextInvoiceNumber: z.number().min(1000, "Invoice number must be at least 1000"),
  nextBidNumber: z.number().min(1000, "Bid number must be at least 1000"),
  currency: z.string().optional(),
  timezone: z.string().optional(),
});

/**
 * Utility function to validate monetary amounts
 */
export function validateAmount(amount: string | number): boolean {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount >= 0;
}

/**
 * Utility function to format currency
 */
export function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numAmount);
}

/**
 * Utility function to calculate total with tax
 */
export function calculateTotal(subtotal: string | number, taxRate: string | number): number {
  const sub = typeof subtotal === "string" ? parseFloat(subtotal) : subtotal;
  const tax = typeof taxRate === "string" ? parseFloat(taxRate) : taxRate;
  const taxAmount = (sub * tax) / 100;
  return sub + taxAmount;
}

/**
 * Utility function to validate date range
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return startDate <= endDate;
}

/**
 * Utility function to check if invoice is overdue
 */
export function isInvoiceOverdue(dueDate: Date): boolean {
  return new Date() > dueDate;
}
