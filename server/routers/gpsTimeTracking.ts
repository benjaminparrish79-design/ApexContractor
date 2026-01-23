import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { eq, and, desc, between } from "drizzle-orm";
import { getDb } from "../db";
import { gpsTimeEntries, teamMembers, projects } from "../../drizzle/schema";

export const gpsTimeTrackingRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return db
      .select()
      .from(gpsTimeEntries)
      .where(eq(gpsTimeEntries.userId, ctx.user.id))
      .orderBy(desc(gpsTimeEntries.clockInTime));
  }),

  clockIn: publicProcedure
    .input(
      z.object({
        teamMemberId: z.number(),
        projectId: z.number(),
        clockInLatitude: z.number(),
        clockInLongitude: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if already clocked in
      const activeEntry = await db
        .select()
        .from(gpsTimeEntries)
        .where(
          and(
            eq(gpsTimeEntries.userId, ctx.user.id),
            eq(gpsTimeEntries.teamMemberId, input.teamMemberId)
          )
        )
        .orderBy(desc(gpsTimeEntries.clockInTime))
        .limit(1)
        .then(rows => rows[0]);

      if (activeEntry && !activeEntry.clockOutTime) {
        throw new Error("Already clocked in");
      }

      await db.insert(gpsTimeEntries).values({
        userId: ctx.user.id,
        ...input,
        clockInTime: new Date(),
        approvalStatus: "pending",
      });

      return { success: true, message: "Clocked in successfully" };
    }),

  clockOut: publicProcedure
    .input(
      z.object({
        id: z.number(),
        clockOutLatitude: z.number(),
        clockOutLongitude: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const entry = await db
        .select()
        .from(gpsTimeEntries)
        .where(
          and(
            eq(gpsTimeEntries.id, input.id),
            eq(gpsTimeEntries.userId, ctx.user.id)
          )
        )
        .then(rows => rows[0]);

      if (!entry) throw new Error("Entry not found");
      if (entry.clockOutTime) throw new Error("Already clocked out");

      const clockOutTime = new Date();
      const durationMinutes = Math.round(
        (clockOutTime.getTime() - new Date(entry.clockInTime).getTime()) / (1000 * 60)
      );

      // Get team member rate
      const member = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.id, entry.teamMemberId))
        .then(rows => rows[0]);

      const rate = member?.hourlyRate ? parseFloat(member.hourlyRate as any) : 0;
      const totalCost = ((durationMinutes / 60) * rate).toFixed(2);

      await db
        .update(gpsTimeEntries)
        .set({
          clockOutTime,
          clockOutLatitude: input.clockOutLatitude,
          clockOutLongitude: input.clockOutLongitude,
          durationMinutes,
          totalCost,
          notes: input.notes || entry.notes,
        })
        .where(eq(gpsTimeEntries.id, input.id));

      return { success: true, message: "Clocked out successfully" };
    }),

  approve: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .update(gpsTimeEntries)
        .set({ approvalStatus: "approved" })
        .where(
          and(
            eq(gpsTimeEntries.id, input.id),
            eq(gpsTimeEntries.userId, ctx.user.id)
          )
        );
    }),

  getSummary: publicProcedure
    .input(z.object({ 
      startDate: z.date().optional(),
      endDate: z.date().optional()
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const entries = await db
        .select()
        .from(gpsTimeEntries)
        .where(eq(gpsTimeEntries.userId, ctx.user.id));

      const totalDurationMinutes = entries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
      const totalCost = entries.reduce((sum, e) => sum + (parseFloat(e.totalCost as any) || 0), 0);

      return {
        totalDurationHours: (totalDurationMinutes / 60).toFixed(1),
        totalCost: totalCost.toFixed(2),
        approvedEntries: entries.filter(e => e.approvalStatus === "approved").length,
        pendingEntries: entries.filter(e => e.approvalStatus === "pending").length,
      };
    }),
});
