import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb, getJobCostsByUserId, getJobCostById } from "../db";
import { jobCosts } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const jobCostInput = z.object({
  projectId: z.number(),
  category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"), // Using string for decimal consistency
  description: z.string().optional(),
  costDate: z.date().optional(),
});

export const jobCostsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await getJobCostsByUserId(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getJobCostById(input.id);
    }),

  create: protectedProcedure
    .input(jobCostInput)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(jobCosts).values({
        userId: ctx.user.id,
        ...input,
        amount: input.amount,
      });

      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(jobCosts).where(eq(jobCosts.id, input.id));
      return { success: true };
    }),
});
