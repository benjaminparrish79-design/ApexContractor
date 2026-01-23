import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { recurringInvoices, invoices } from "../../drizzle/schema";

export const recurringInvoicesRouter = router({
  /**
   * Create a recurring invoice
   */
  create: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        name: z.string(),
        frequency: z.enum(["weekly", "biweekly", "monthly", "quarterly", "yearly"]),
        startDate: z.date(),
        endDate: z.date().optional(),
        subtotal: z.string().optional(),
        taxAmount: z.string().optional(),
        total: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const result = await db.insert(recurringInvoices).values({
          userId: ctx.user.id,
          clientId: input.clientId,
          name: input.name,
          frequency: input.frequency,
          startDate: input.startDate,
          endDate: input.endDate,
          subtotal: input.subtotal || "0",
          taxAmount: input.taxAmount || "0",
          total: input.total,
          status: "active",
          nextInvoiceDate: input.startDate,
        });

        return { success: true };
      } catch (error) {
        console.error("[RecurringInvoices] Failed to create:", error);
        throw error;
      }
    }),

  /**
   * List recurring invoices for a user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    try {
      const result = await db
        .select()
        .from(recurringInvoices)
        .where(eq(recurringInvoices.userId, ctx.user.id));

      return result;
    } catch (error) {
      console.error("[RecurringInvoices] Failed to list:", error);
      return [];
    }
  }),

  /**
   * Update a recurring invoice
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        frequency: z.enum(["weekly", "biweekly", "monthly", "quarterly", "yearly"]).optional(),
        status: z.enum(["active", "paused", "cancelled"]).optional(),
        total: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update(recurringInvoices)
          .set({
            name: input.name,
            frequency: input.frequency,
            status: input.status,
            total: input.total,
          })
          .where(
            and(
              eq(recurringInvoices.id, input.id),
              eq(recurringInvoices.userId, ctx.user.id)
            )
          );

        return { success: true };
      } catch (error) {
        console.error("[RecurringInvoices] Failed to update:", error);
        throw error;
      }
    }),

  /**
   * Delete a recurring invoice
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .delete(recurringInvoices)
          .where(
            and(
              eq(recurringInvoices.id, input.id),
              eq(recurringInvoices.userId, ctx.user.id)
            )
          );

        return { success: true };
      } catch (error) {
        console.error("[RecurringInvoices] Failed to delete:", error);
        throw error;
      }
    }),

  /**
   * Generate invoices for due recurring templates
   */
  generateDueInvoices: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      const now = new Date();
      const dueRecurring = await db
        .select()
        .from(recurringInvoices)
        .where(
          and(
            eq(recurringInvoices.userId, ctx.user.id),
            eq(recurringInvoices.status, "active")
          )
        );

      let generatedCount = 0;

      for (const recurring of dueRecurring) {
        if (recurring.nextInvoiceDate && recurring.nextInvoiceDate <= now) {
          // Generate invoice
          const invoiceNumber = `REC-${Date.now()}`;
          await db.insert(invoices).values({
            userId: ctx.user.id,
            clientId: recurring.clientId,
            invoiceNumber,
            total: recurring.total,
            subtotal: recurring.subtotal,
            taxAmount: recurring.taxAmount,
            status: "sent",
            issueDate: now,
            dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          });

          generatedCount++;

          // Calculate next invoice date
          let nextDate = new Date(recurring.nextInvoiceDate);
          switch (recurring.frequency) {
            case "weekly":
              nextDate.setDate(nextDate.getDate() + 7);
              break;
            case "biweekly":
              nextDate.setDate(nextDate.getDate() + 14);
              break;
            case "monthly":
              nextDate.setMonth(nextDate.getMonth() + 1);
              break;
            case "quarterly":
              nextDate.setMonth(nextDate.getMonth() + 3);
              break;
            case "yearly":
              nextDate.setFullYear(nextDate.getFullYear() + 1);
              break;
          }

          // Update next invoice date
          await db
            .update(recurringInvoices)
            .set({ nextInvoiceDate: nextDate })
            .where(eq(recurringInvoices.id, recurring.id));
        }
      }

      return { success: true, generatedCount };
    } catch (error) {
      console.error("[RecurringInvoices] Failed to generate invoices:", error);
      throw error;
    }
  }),
});
