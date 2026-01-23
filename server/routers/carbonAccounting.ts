import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { eq, and, desc, sum } from "drizzle-orm";
import { getDb } from "../db";
import { carbonAccounting, projects } from "../../drizzle/schema";

export const carbonAccountingRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return db
      .select()
      .from(carbonAccounting)
      .where(eq(carbonAccounting.userId, ctx.user.id))
      .orderBy(desc(carbonAccounting.createdAt));
  }),

  getByProject: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .select()
        .from(carbonAccounting)
        .where(
          and(
            eq(carbonAccounting.userId, ctx.user.id),
            eq(carbonAccounting.projectId, input.projectId)
          )
        )
        .orderBy(desc(carbonAccounting.createdAt));
    }),

  create: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
        materialName: z.string().min(1),
        quantity: z.number().positive(),
        unit: z.string(),
        carbonEmissionsPerUnit: z.number().nonnegative(),
        category: z.string(),
        supplier: z.string().optional(),
        certificationLevel: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const totalCarbonEmissions = input.quantity * input.carbonEmissionsPerUnit;

      return db.insert(carbonAccounting).values({
        userId: ctx.user.id,
        ...input,
        totalCarbonEmissions,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .delete(carbonAccounting)
        .where(
          and(
            eq(carbonAccounting.id, input.id),
            eq(carbonAccounting.userId, ctx.user.id)
          )
        );
    }),

  getProjectCarbonSummary: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const records = await db
        .select()
        .from(carbonAccounting)
        .where(
          and(
            eq(carbonAccounting.userId, ctx.user.id),
            eq(carbonAccounting.projectId, input.projectId)
          )
        );

      const totalEmissions = records.reduce(
        (sum, record) => sum + (parseFloat(record.totalCarbonEmissions as any) || 0),
        0
      );

      const byCategory: Record<string, number> = {};
      records.forEach((record) => {
        const category = record.category;
        byCategory[category] = (byCategory[category] || 0) + parseFloat(record.totalCarbonEmissions as any);
      });

      return {
        totalEmissions: totalEmissions.toFixed(2),
        recordCount: records.length,
        byCategory,
        records,
      };
    }),

  getComplianceReport: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const records = await db
        .select()
        .from(carbonAccounting)
        .where(
          and(
            eq(carbonAccounting.userId, ctx.user.id),
            eq(carbonAccounting.projectId, input.projectId)
          )
        );

      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .then((rows) => rows[0]);

      const totalEmissions = records.reduce(
        (sum, record) => sum + (parseFloat(record.totalCarbonEmissions as any) || 0),
        0
      );

      const certifiedMaterials = records.filter((r) => r.certificationLevel).length;
      const complianceScore = certifiedMaterials > 0 ? (certifiedMaterials / records.length) * 100 : 0;

      return {
        projectName: project?.name || "Unknown",
        totalMaterials: records.length,
        totalCarbonEmissions: totalEmissions.toFixed(2),
        certifiedMaterials,
        complianceScore: complianceScore.toFixed(1),
        recommendations: generateRecommendations(complianceScore, totalEmissions),
      };
    }),
});

function generateRecommendations(complianceScore: number, totalEmissions: number): string[] {
  const recommendations: string[] = [];

  if (complianceScore < 50) {
    recommendations.push("Consider sourcing more certified sustainable materials to improve ESG compliance.");
  }

  if (totalEmissions > 100) {
    recommendations.push("Your project's carbon footprint is significant. Explore carbon offset options.");
  }

  if (complianceScore >= 80) {
    recommendations.push("Excellent ESG compliance! Your project qualifies for premium sustainable certifications.");
  }

  return recommendations;
}
