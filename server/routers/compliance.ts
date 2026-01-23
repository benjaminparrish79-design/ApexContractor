import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { complianceDocuments, teamMembers } from "../../drizzle/schema";

export const complianceRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return db
      .select()
      .from(complianceDocuments)
      .where(eq(complianceDocuments.userId, ctx.user.id))
      .orderBy(desc(complianceDocuments.createdAt));
  }),

  getExpiringDocuments: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return db
      .select()
      .from(complianceDocuments)
      .where(
        and(
          eq(complianceDocuments.userId, ctx.user.id),
          sql`${complianceDocuments.expiryDate} <= ${thirtyDaysFromNow.toISOString()}`,
          eq(complianceDocuments.status, "valid")
        )
      );
  }),

  create: publicProcedure
    .input(
      z.object({
        teamMemberId: z.number(),
        documentType: z.enum(["license", "certification", "insurance", "training", "other"]),
        documentName: z.string(),
        fileUrl: z.string().url(),
        issueDate: z.date().optional(),
        expiryDate: z.date().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db.insert(complianceDocuments).values({
        userId: ctx.user.id,
        ...input,
        status: "valid",
        verificationStatus: "pending",
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .delete(complianceDocuments)
        .where(
          and(
            eq(complianceDocuments.id, input.id),
            eq(complianceDocuments.userId, ctx.user.id)
          )
        );
    }),
});
