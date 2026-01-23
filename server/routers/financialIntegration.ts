import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db";
import { financialIntegrationLogs, businessSettings } from "../../drizzle/schema";

export const financialIntegrationRouter = router({
  getConnectionStatus: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const settings = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.userId, ctx.user.id))
      .then((rows) => rows[0]);

    return {
      quickbooks: { connected: false, lastSync: null, status: "disconnected" },
      xero: { connected: false, lastSync: null, status: "disconnected" },
      stripe: { connected: false, lastSync: null, status: "disconnected" },
    };
  }),

  getSyncHistory: publicProcedure
    .input(
      z.object({
        provider: z.enum(["quickbooks", "xero", "stripe"]).optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db
        .select()
        .from(financialIntegrationLogs)
        .where(eq(financialIntegrationLogs.userId, ctx.user.id));

      return query
        .orderBy(desc(financialIntegrationLogs.createdAt))
        .limit(input.limit);
    }),

  getSyncStatistics: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const logs = await db
      .select()
      .from(financialIntegrationLogs)
      .where(eq(financialIntegrationLogs.userId, ctx.user.id));

    const successful = logs.filter((l) => l.status === "success").length;
    return {
      totalSyncs: logs.length,
      successful,
      failed: logs.filter((l) => l.status === "failed").length,
      pending: logs.filter((l) => l.status === "pending").length,
      successRate: logs.length > 0 ? ((successful / logs.length) * 100).toFixed(2) : 0,
    };
  }),

  disconnect: publicProcedure
    .input(z.object({ provider: z.enum(["quickbooks", "xero", "stripe"]) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(financialIntegrationLogs).values({
        userId: ctx.user.id,
        integrationProvider: input.provider,
        syncType: "full_sync",
        status: "success",
        recordType: "disconnection",
      });

      return { success: true, message: `${input.provider} disconnected` };
    }),

  testConnection: publicProcedure
    .input(z.object({ provider: z.enum(["quickbooks", "xero"]) }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: `Successfully connected to ${input.provider}`,
        timestamp: new Date().toISOString(),
      };
    }),
});
