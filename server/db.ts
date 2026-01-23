import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clients, projects, invoices, bids, payments, timeEntries, businessSettings, notifications, teamMembers, jobCosts } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Ensure business settings exist for new users
export async function ensureBusinessSettings(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const existing = await getBusinessSettingsByUserId(userId);
    if (!existing) {
      await db.insert(businessSettings).values({
        userId,
        companyName: "My Company",
        taxRate: "0",
        invoicePrefix: "INV",
        bidPrefix: "BID",
        nextInvoiceNumber: 1001,
        nextBidNumber: 1001,
      });
    }
  } catch (error) {
    console.warn("[Database] Failed to ensure business settings:", error);
  }
}

// Clients
export async function getClientsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).where(eq(clients.userId, userId));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0];
}

// Projects
export async function getProjectsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.userId, userId));
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

// Invoices
export async function getInvoicesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invoices).where(eq(invoices.userId, userId));
}

export async function getInvoiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  return result[0];
}

// Bids
export async function getBidsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bids).where(eq(bids.userId, userId));
}

export async function getBidById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bids).where(eq(bids.id, id)).limit(1);
  return result[0];
}

// Payments
export async function getPaymentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.userId, userId));
}

export async function getPaymentsByInvoiceId(invoiceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.invoiceId, invoiceId));
}

// Time Entries
export async function getTimeEntriesByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timeEntries).where(eq(timeEntries.projectId, projectId));
}

// Business Settings
export async function getBusinessSettingsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(businessSettings).where(eq(businessSettings.userId, userId)).limit(1);
  return result[0];
}

// Team Members
export async function getTeamMembersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).where(eq(teamMembers.userId, userId));
}

export async function getTeamMemberById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return result[0];
}

// Job Costs
export async function getJobCostsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobCosts).where(eq(jobCosts.userId, userId)).orderBy(desc(jobCosts.costDate));
}

export async function getJobCostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobCosts).where(eq(jobCosts.id, id)).limit(1);
  return result[0];
}

// Notifications
export async function getNotificationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId));
}
