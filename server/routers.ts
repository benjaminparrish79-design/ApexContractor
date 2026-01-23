import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { emailRouter } from "./routers/email";
import { clientPortalRouter } from "./routers/clientPortal";
import { recurringInvoicesRouter } from "./routers/recurringInvoices";
import { teamMembersRouter } from "./routers/teamMembers";
import { jobCostsRouter } from "./routers/jobCosts";
import { aiRouter } from "./routers/ai";
import { complianceRouter } from "./routers/compliance";
import { gpsTimeTrackingRouter } from "./routers/gpsTimeTracking";
import { aiDocumentVerificationRouter } from "./routers/aiDocumentVerification";
import { financialIntegrationRouter } from "./routers/financialIntegration";
import { carbonAccountingRouter } from "./routers/carbonAccounting";
import { inventoryRouter } from "./routers/inventory";
import { snowflakeSyncRouter } from "./routers/snowflakeSync";
import { aiReceptionistRouter } from "./routers/aiReceptionist";
import { z } from "zod";
import { 
  getClientsByUserId, getClientById, getProjectsByUserId, getProjectById,
  getInvoicesByUserId, getInvoiceById, getBidsByUserId, getBidById,
  getPaymentsByUserId, getPaymentsByInvoiceId, getTimeEntriesByProjectId,
  getBusinessSettingsByUserId, getNotificationsByUserId, ensureBusinessSettings, getDb
} from "./db";
import { 
  clients, projects, invoices, invoiceItems, bids, bidItems, payments, 
  timeEntries, photos, timeline, recurringInvoices, jobCosts, teamMembers, 
  templates, notifications, businessSettings
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  email: emailRouter,
  clientPortal: clientPortalRouter,
  recurringInvoices: recurringInvoicesRouter,
  teamMembers: teamMembersRouter,
  jobCosts: jobCostsRouter,
  ai: aiRouter,
  compliance: complianceRouter,
  gpsTimeTracking: gpsTimeTrackingRouter,
  aiDocumentVerification: aiDocumentVerificationRouter,
  financialIntegration: financialIntegrationRouter,
  carbonAccounting: carbonAccountingRouter,
  inventory: inventoryRouter,
  snowflakeSync: snowflakeSyncRouter,
  aiReceptionist: aiReceptionistRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Business Settings
  businessSettings: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await getBusinessSettingsByUserId(ctx.user.id);
    }),
    
    update: protectedProcedure
      .input(z.object({
        companyName: z.string().optional(),
        companyEmail: z.string().email().optional(),
        companyPhone: z.string().optional(),
        companyAddress: z.string().optional(),
        taxRate: z.string().optional(),
        paymentTerms: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.update(businessSettings)
          .set(input)
          .where(eq(businessSettings.userId, ctx.user.id));
        
        return await getBusinessSettingsByUserId(ctx.user.id);
      }),
  }),

  // Clients
  clients: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getClientsByUserId(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getClientById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(clients).values({
          userId: ctx.user.id,
          ...input,
        });
        
        return result;
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { id, ...updateData } = input;
        await db.update(clients).set(updateData).where(eq(clients.id, id));
        
        return await getClientById(id);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.delete(clients).where(eq(clients.id, input.id));
        return { success: true };
      }),
  }),

  // Projects
  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getProjectsByUserId(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getProjectById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        status: z.enum(["planning", "in_progress", "on_hold", "completed", "cancelled"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        budget: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(projects).values({
          userId: ctx.user.id,
          ...input,
        });
        
        return result;
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["planning", "in_progress", "on_hold", "completed", "cancelled"]).optional(),
        progress: z.number().optional(),
        budget: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { id, ...updateData } = input;
        await db.update(projects).set(updateData).where(eq(projects.id, id));
        
        return await getProjectById(id);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.delete(projects).where(eq(projects.id, input.id));
        return { success: true };
      }),
  }),

  // Invoices
  invoices: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getInvoicesByUserId(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getInvoiceById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        projectId: z.number().optional(),
        status: z.enum(["draft", "sent", "viewed", "partially_paid", "paid", "overdue", "cancelled"]).optional(),
        dueDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const settings = await getBusinessSettingsByUserId(ctx.user.id);
        const invoiceNumber = `${settings?.invoicePrefix || "INV"}-${settings?.nextInvoiceNumber || 1001}`;
        
        const result = await db.insert(invoices).values({
          userId: ctx.user.id,
          invoiceNumber,
          ...input,
        });
        
        return result;
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["draft", "sent", "viewed", "partially_paid", "paid", "overdue", "cancelled"]).optional(),
        dueDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { id, ...updateData } = input;
        await db.update(invoices).set(updateData).where(eq(invoices.id, id));
        
        return await getInvoiceById(id);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.delete(invoices).where(eq(invoices.id, input.id));
        return { success: true };
      }),
  }),

  // Bids
  bids: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getBidsByUserId(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getBidById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        projectId: z.number().optional(),
        status: z.enum(["draft", "sent", "viewed", "accepted", "rejected", "expired"]).optional(),
        expiryDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const settings = await getBusinessSettingsByUserId(ctx.user.id);
        const bidNumber = `${settings?.bidPrefix || "BID"}-${settings?.nextBidNumber || 1001}`;
        
        const result = await db.insert(bids).values({
          userId: ctx.user.id,
          bidNumber,
          ...input,
        });
        
        return result;
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.delete(bids).where(eq(bids.id, input.id));
        return { success: true };
      }),
  }),

  // Payments
  payments: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getPaymentsByUserId(ctx.user.id);
    }),
    
    byInvoice: protectedProcedure
      .input(z.object({ invoiceId: z.number() }))
      .query(async ({ input }) => {
        return await getPaymentsByInvoiceId(input.invoiceId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        invoiceId: z.number(),
        amount: z.string(),
        paymentMethod: z.enum(["card", "cash", "check", "bank_transfer", "other"]),
        status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
        transactionId: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(payments).values({
          userId: ctx.user.id,
          ...input,
        });
        
        return result;
      }),
  }),

  // Time Entries
  timeEntries: router({
    byProject: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getTimeEntriesByProjectId(input.projectId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        description: z.string().optional(),
        startTime: z.date(),
        endTime: z.date().optional(),
        hourlyRate: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const duration = input.endTime 
          ? Math.round((input.endTime.getTime() - input.startTime.getTime()) / 60000)
          : 0;
        
        const totalCost = input.hourlyRate && duration
          ? (parseFloat(input.hourlyRate) * (duration / 60)).toString()
          : "0";
        
        const result = await db.insert(timeEntries).values({
          userId: ctx.user.id,
          duration,
          totalCost,
          ...input,
        });
        
        return result;
      }),
  }),

  // Photos
  photos: router({
    byProject: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(photos).where(eq(photos.projectId, input.projectId));
      }),
    
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        url: z.string(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(photos).values({
          userId: ctx.user.id,
          ...input,
        });
        
        return result;
      }),
  }),

  // Notifications
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getNotificationsByUserId(ctx.user.id);
    }),
    
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.id, input.id));
        
        return { success: true };
      }),
  }),

  // Dashboard Analytics
  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { 
        totalRevenue: 0, 
        pendingInvoices: 0, 
        activeProjects: 0,
        totalClients: 0,
        avgInvoiceValue: 0,
        bidConversionRate: 0,
        totalExpenses: 0
      };
      
      const userInvoices = await getInvoicesByUserId(ctx.user.id);
      const userProjects = await getProjectsByUserId(ctx.user.id);
      const userClients = await getClientsByUserId(ctx.user.id);
      const userBids = await getBidsByUserId(ctx.user.id);
      const userExpenses = await getJobCostsByUserId(ctx.user.id);
      
      const paidInvoices = userInvoices.filter(inv => inv.status === "paid");
      const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total as any) || 0), 0);
      
      const pendingInvoices = userInvoices.filter(inv => inv.status === "sent" || inv.status === "viewed").length;
      const activeProjects = userProjects.filter(proj => proj.status === "in_progress").length;
      const totalClients = userClients.length;
      
      const avgInvoiceValue = paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0;
      
      const acceptedBids = userBids.filter(bid => bid.status === "accepted").length;
      const bidConversionRate = userBids.length > 0 ? (acceptedBids / userBids.length) * 100 : 0;
      
      const totalExpenses = userExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount as any) || 0), 0);
      
      return {
        totalRevenue,
        pendingInvoices,
        activeProjects,
        totalClients,
        avgInvoiceValue,
        bidConversionRate,
        totalExpenses,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
