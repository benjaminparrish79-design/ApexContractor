import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb, getTeamMemberById, getTeamMembersByUserId } from "../db";
import { teamMembers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const teamMemberInput = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  role: z.enum(["admin", "manager", "worker"]).optional(),
  hourlyRate: z.string().optional(), // Using string for decimal consistency
});

export const teamMembersRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await getTeamMembersByUserId(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getTeamMemberById(input.id);
    }),

  create: protectedProcedure
    .input(teamMemberInput)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(teamMembers).values({
        userId: ctx.user.id,
        ...input,
        hourlyRate: input.hourlyRate ? input.hourlyRate : "0.00",
      });

      return result;
    }),

  update: protectedProcedure
    .input(teamMemberInput.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updateData } = input;
      await db.update(teamMembers).set(updateData).where(eq(teamMembers.id, id));

      return await getTeamMemberById(id);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(teamMembers).where(eq(teamMembers.id, input.id));
      return { success: true };
    }),
});
