import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db";
import { aiLeads } from "../../drizzle/schema";

export const aiReceptionistRouter = router({
  /**
   * List all leads captured by the AI Receptionist
   */
  listLeads: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return db
      .select()
      .from(aiLeads)
      .where(eq(aiLeads.userId, ctx.user.id))
      .orderBy(desc(aiLeads.createdAt));
  }),

  /**
   * Get details for a specific lead
   */
  getLead: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .select()
        .from(aiLeads)
        .where(
          and(
            eq(aiLeads.id, input.id),
            eq(aiLeads.userId, ctx.user.id)
          )
        )
        .then((rows) => rows[0]);
    }),

  /**
   * Create a new lead (called by AI Voice/Chat webhook)
   */
  createLead: publicProcedure
    .input(
      z.object({
        customerName: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().email().optional(),
        serviceType: z.string().optional(),
        projectDescription: z.string().optional(),
        urgency: z.enum(["routine", "urgent", "emergency"]).optional(),
        callTranscript: z.string().optional(),
        aiSummary: z.string().optional(),
        appointmentDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In a real webhook, we'd verify the source. For now, we use ctx.user.id if available
      const userId = ctx.user?.id || 1; // Fallback for demo/webhook
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(aiLeads).values({
        userId,
        ...input,
        status: "new",
      });

      return { success: true, leadId: result.insertId };
    }),

  /**
   * Update lead status
   */
  updateLeadStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(aiLeads)
        .set({ status: input.status })
        .where(
          and(
            eq(aiLeads.id, input.id),
            eq(aiLeads.userId, ctx.user.id)
          )
        );

      return { success: true, message: "Lead status updated" };
    }),

  /**
   * Get AI Receptionist Performance Stats
   */
  getStats: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const leads = await db
      .select()
      .from(aiLeads)
      .where(eq(aiLeads.userId, ctx.user.id));

    const totalLeads = leads.length;
    const urgentLeads = leads.filter((l) => l.urgency === "emergency" || l.urgency === "urgent").length;
    const convertedLeads = leads.filter((l) => l.status === "converted").length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    return {
      totalLeads,
      urgentLeads,
      convertedLeads,
      conversionRate: conversionRate.toFixed(1),
      recentLeads: leads.slice(0, 5),
    };
  }),
});
