import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Business Settings
export const businessSettings = mysqlTable("businessSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  companyEmail: varchar("companyEmail", { length: 320 }),
  companyPhone: varchar("companyPhone", { length: 20 }),
  companyAddress: text("companyAddress"),
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).default("0"),
  paymentTerms: varchar("paymentTerms", { length: 100 }),
  invoicePrefix: varchar("invoicePrefix", { length: 10 }).default("INV"),
  bidPrefix: varchar("bidPrefix", { length: 10 }).default("BID"),
  nextInvoiceNumber: int("nextInvoiceNumber").default(1001),
  nextBidNumber: int("nextBidNumber").default(1001),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId").on(table.userId)]);

export type BusinessSettings = typeof businessSettings.$inferSelect;
export type InsertBusinessSettings = typeof businessSettings.$inferInsert;

// Clients
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  country: varchar("country", { length: 100 }),
  taxId: varchar("taxId", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_clients").on(table.userId)]);

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// Projects
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientId: int("clientId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["planning", "in_progress", "on_hold", "completed", "cancelled"]).default("planning"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  progress: int("progress").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_projects").on(table.userId), index("idx_clientId").on(table.clientId)]);

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Invoices
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientId: int("clientId").notNull(),
  projectId: int("projectId"),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "sent", "viewed", "partially_paid", "paid", "overdue", "cancelled"]).default("draft"),
  issueDate: timestamp("issueDate").defaultNow(),
  dueDate: timestamp("dueDate"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0"),
  taxAmount: decimal("taxAmount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_invoices").on(table.userId), index("idx_clientId_invoices").on(table.clientId)]);

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

// Invoice Items
export const invoiceItems = mysqlTable("invoiceItems", {
  id: int("id").autoincrement().primaryKey(),
  invoiceId: int("invoiceId").notNull(),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).default("1"),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_invoiceId").on(table.invoiceId)]);

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InsertInvoiceItem = typeof invoiceItems.$inferInsert;

// Bids/Estimates
export const bids = mysqlTable("bids", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientId: int("clientId").notNull(),
  projectId: int("projectId"),
  bidNumber: varchar("bidNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "sent", "viewed", "accepted", "rejected", "expired"]).default("draft"),
  issueDate: timestamp("issueDate").defaultNow(),
  expiryDate: timestamp("expiryDate"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0"),
  taxAmount: decimal("taxAmount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_bids").on(table.userId), index("idx_clientId_bids").on(table.clientId)]);

export type Bid = typeof bids.$inferSelect;
export type InsertBid = typeof bids.$inferInsert;

// Bid Items
export const bidItems = mysqlTable("bidItems", {
  id: int("id").autoincrement().primaryKey(),
  bidId: int("bidId").notNull(),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).default("1"),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_bidId").on(table.bidId)]);

export type BidItem = typeof bidItems.$inferSelect;
export type InsertBidItem = typeof bidItems.$inferInsert;

// Payments
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  invoiceId: int("invoiceId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["card", "cash", "check", "bank_transfer", "other"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  transactionId: varchar("transactionId", { length: 100 }),
  notes: text("notes"),
  paymentDate: timestamp("paymentDate").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_payments").on(table.userId), index("idx_invoiceId_payments").on(table.invoiceId)]);

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Time Entries
export const timeEntries = mysqlTable("timeEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  description: text("description"),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  duration: int("duration"), // in minutes
  hourlyRate: decimal("hourlyRate", { precision: 10, scale: 2 }),
  totalCost: decimal("totalCost", { precision: 12, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_timeEntries").on(table.userId), index("idx_projectId_timeEntries").on(table.projectId)]);

export type TimeEntry = typeof timeEntries.$inferSelect;
export type InsertTimeEntry = typeof timeEntries.$inferInsert;

// Photos
export const photos = mysqlTable("photos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  url: text("url").notNull(),
  caption: text("caption"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_userId_photos").on(table.userId), index("idx_projectId_photos").on(table.projectId)]);

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

// Timeline Events
export const timeline = mysqlTable("timeline", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  eventType: varchar("eventType", { length: 50 }).notNull(),
  description: text("description"),
  eventDate: timestamp("eventDate").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_userId_timeline").on(table.userId), index("idx_projectId_timeline").on(table.projectId)]);

export type TimelineEvent = typeof timeline.$inferSelect;
export type InsertTimelineEvent = typeof timeline.$inferInsert;

// Recurring Invoices
export const recurringInvoices = mysqlTable("recurringInvoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientId: int("clientId").notNull(),
  projectId: int("projectId"),
  name: varchar("name", { length: 255 }).notNull(),
  frequency: mysqlEnum("frequency", ["weekly", "biweekly", "monthly", "quarterly", "yearly"]).notNull(),
  status: mysqlEnum("status", ["active", "paused", "cancelled"]).default("active"),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0"),
  taxAmount: decimal("taxAmount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).default("0"),
  nextInvoiceDate: timestamp("nextInvoiceDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_recurring").on(table.userId), index("idx_clientId_recurring").on(table.clientId)]);

export type RecurringInvoice = typeof recurringInvoices.$inferSelect;
export type InsertRecurringInvoice = typeof recurringInvoices.$inferInsert;

// Job Costs
export const jobCosts = mysqlTable("jobCosts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  costDate: timestamp("costDate").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_jobCosts").on(table.userId), index("idx_projectId_jobCosts").on(table.projectId)]);

export type JobCost = typeof jobCosts.$inferSelect;
export type InsertJobCost = typeof jobCosts.$inferInsert;

// Team Members
export const teamMembers = mysqlTable("teamMembers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  role: varchar("role", { length: 100 }),
  hourlyRate: decimal("hourlyRate", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_teamMembers").on(table.userId)]);

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

// Templates
export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["invoice", "bid", "proposal"]).notNull(),
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_templates").on(table.userId)]);

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

// Notifications
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  type: varchar("type", { length: 50 }),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_userId_notifications").on(table.userId)]);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Compliance Documents
export const complianceDocuments = mysqlTable("complianceDocuments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teamMemberId: int("teamMemberId").notNull(),
  documentType: mysqlEnum("documentType", ["license", "certification", "insurance", "training", "other"]).notNull(),
  documentName: varchar("documentName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  issueDate: timestamp("issueDate"),
  expiryDate: timestamp("expiryDate"),
  status: mysqlEnum("status", ["valid", "expiring_soon", "expired"]).default("valid"),
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "verified", "failed"]).default("pending"),
  aiVerificationData: json("aiVerificationData"), // Stores AI verification results
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_compliance").on(table.userId), index("idx_teamMemberId_compliance").on(table.teamMemberId)]);

export type ComplianceDocument = typeof complianceDocuments.$inferSelect;
export type InsertComplianceDocument = typeof complianceDocuments.$inferInsert;

// GPS Time Entries (Enhanced Time Tracking)
export const gpsTimeEntries = mysqlTable("gpsTimeEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teamMemberId: int("teamMemberId").notNull(),
  projectId: int("projectId").notNull(),
  clockInTime: timestamp("clockInTime").notNull(),
  clockOutTime: timestamp("clockOutTime"),
  clockInLatitude: decimal("clockInLatitude", { precision: 10, scale: 8 }),
  clockInLongitude: decimal("clockInLongitude", { precision: 11, scale: 8 }),
  clockOutLatitude: decimal("clockOutLatitude", { precision: 10, scale: 8 }),
  clockOutLongitude: decimal("clockOutLongitude", { precision: 11, scale: 8 }),
  isGeofenced: boolean("isGeofenced").default(false),
  durationMinutes: int("durationMinutes"),
  hourlyRate: decimal("hourlyRate", { precision: 10, scale: 2 }),
  totalCost: decimal("totalCost", { precision: 12, scale: 2 }),
  approvalStatus: mysqlEnum("approvalStatus", ["pending", "approved", "rejected"]).default("pending"),
  approvedBy: int("approvedBy"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_gpsTime").on(table.userId), index("idx_teamMemberId_gpsTime").on(table.teamMemberId), index("idx_projectId_gpsTime").on(table.projectId)]);

export type GPSTimeEntry = typeof gpsTimeEntries.$inferSelect;
export type InsertGPSTimeEntry = typeof gpsTimeEntries.$inferInsert;

// Financial Integration Logs
export const financialIntegrationLogs = mysqlTable("financialIntegrationLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  integrationProvider: mysqlEnum("integrationProvider", ["quickbooks", "xero", "stripe"]).notNull(),
  syncType: mysqlEnum("syncType", ["invoice_sync", "expense_sync", "payment_sync", "full_sync"]).notNull(),
  status: mysqlEnum("status", ["pending", "success", "failed", "partial"]).default("pending"),
  recordType: varchar("recordType", { length: 50 }), // e.g., 'invoice', 'expense'
  recordId: int("recordId"),
  externalId: varchar("externalId", { length: 255 }), // ID from external system
  errorMessage: text("errorMessage"),
  syncData: json("syncData"), // Stores sync request/response
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_financial").on(table.userId), index("idx_integrationProvider").on(table.integrationProvider)]);

export type FinancialIntegrationLog = typeof financialIntegrationLogs.$inferSelect;
export type InsertFinancialIntegrationLog = typeof financialIntegrationLogs.$inferInsert;

// AI Receptionist Leads
export const aiLeads = mysqlTable("aiLeads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  customerName: varchar("customerName", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 50 }),
  email: varchar("email", { length: 320 }),
  serviceType: varchar("serviceType", { length: 100 }),
  projectDescription: text("projectDescription"),
  urgency: mysqlEnum("urgency", ["routine", "urgent", "emergency"]).default("routine"),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "lost"]).default("new"),
  callTranscript: text("callTranscript"),
  aiSummary: text("aiSummary"),
  appointmentDate: timestamp("appointmentDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_aiLeads").on(table.userId)]);

export type AILead = typeof aiLeads.$inferSelect;
export type InsertAILead = typeof aiLeads.$inferInsert;

// Carbon Accounting
export const carbonAccounting = mysqlTable("carbonAccounting", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  materialName: varchar("materialName", { length: 255 }).notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(), // kg, ton, m3, etc.
  carbonEmissionsPerUnit: decimal("carbonEmissionsPerUnit", { precision: 10, scale: 4 }).notNull(), // kg CO2e
  totalCarbonEmissions: decimal("totalCarbonEmissions", { precision: 12, scale: 4 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Concrete, Steel, Wood, etc.
  supplier: varchar("supplier", { length: 255 }),
  certificationLevel: varchar("certificationLevel", { length: 50 }), // e.g., "LEED", "Carbon Neutral"
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_carbon").on(table.userId), index("idx_projectId_carbon").on(table.projectId)]);

export type CarbonAccounting = typeof carbonAccounting.$inferSelect;
export type InsertCarbonAccounting = typeof carbonAccounting.$inferInsert;

// Client Portal Access
export const clientPortalAccess = mysqlTable("clientPortalAccess", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientId: int("clientId").notNull(),
  projectId: int("projectId").notNull(),
  portalUrl: varchar("portalUrl", { length: 255 }).unique(),
  accessToken: varchar("accessToken", { length: 255 }).unique(),
  accessLevel: mysqlEnum("accessLevel", ["view_only", "approve_changes", "make_payments"]).default("view_only"),
  isActive: boolean("isActive").default(true),
  expiryDate: timestamp("expiryDate"),
  lastAccessedAt: timestamp("lastAccessedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_portal").on(table.userId), index("idx_clientId_portal").on(table.clientId), index("idx_projectId_portal").on(table.projectId)]);

export type ClientPortalAccess = typeof clientPortalAccess.$inferSelect;
export type InsertClientPortalAccess = typeof clientPortalAccess.$inferInsert;

// Inventory & Assets
export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId"),
  itemName: varchar("itemName", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Tools, Equipment, Materials, etc.
  quantity: int("quantity").notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  unitCost: decimal("unitCost", { precision: 12, scale: 2 }).notNull(),
  totalValue: decimal("totalValue", { precision: 12, scale: 2 }).notNull(),
  qrCode: varchar("qrCode", { length: 255 }), // QR code identifier
  rfidTag: varchar("rfidTag", { length: 255 }), // RFID tag identifier
  currentLocation: varchar("currentLocation", { length: 255 }), // Job site or warehouse
  status: mysqlEnum("status", ["available", "in_use", "maintenance", "retired"]).default("available"),
  lastLocationUpdate: timestamp("lastLocationUpdate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_userId_inventory").on(table.userId), index("idx_projectId_inventory").on(table.projectId)]);

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;

// Inventory Transactions (Track movement and usage)
export const inventoryTransactions = mysqlTable("inventoryTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  inventoryId: int("inventoryId").notNull(),
  transactionType: mysqlEnum("transactionType", ["add", "remove", "transfer", "damage", "maintenance"]).notNull(),
  quantityChanged: int("quantityChanged").notNull(),
  fromLocation: varchar("fromLocation", { length: 255 }),
  toLocation: varchar("toLocation", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_userId_transactions").on(table.userId), index("idx_inventoryId_transactions").on(table.inventoryId)]);

export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type InsertInventoryTransaction = typeof inventoryTransactions.$inferInsert;