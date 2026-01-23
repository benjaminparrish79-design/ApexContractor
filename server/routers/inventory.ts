import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db";
import { inventory, inventoryTransactions } from "../../drizzle/schema";

export const inventoryRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return db
      .select()
      .from(inventory)
      .where(eq(inventory.userId, ctx.user.id))
      .orderBy(desc(inventory.createdAt));
  }),

  getByProject: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .select()
        .from(inventory)
        .where(
          and(
            eq(inventory.userId, ctx.user.id),
            eq(inventory.projectId, input.projectId)
          )
        );
    }),

  create: publicProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        itemName: z.string().min(1),
        category: z.string(),
        quantity: z.number().positive().int(),
        unit: z.string(),
        unitCost: z.number().nonnegative(),
        qrCode: z.string().optional(),
        rfidTag: z.string().optional(),
        currentLocation: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const totalValue = input.quantity * input.unitCost;

      const result = await db.insert(inventory).values({
        userId: ctx.user.id,
        ...input,
        totalValue,
        status: "available",
      });

      // Log the transaction
      await db.insert(inventoryTransactions).values({
        userId: ctx.user.id,
        inventoryId: result.insertId as number,
        transactionType: "add",
        quantityChanged: input.quantity,
        toLocation: input.currentLocation,
        notes: "Initial inventory addition",
      });

      return { success: true, inventoryId: result.insertId };
    }),

  transfer: publicProcedure
    .input(
      z.object({
        inventoryId: z.number(),
        quantity: z.number().positive().int(),
        toLocation: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const item = await db
        .select()
        .from(inventory)
        .where(
          and(
            eq(inventory.id, input.inventoryId),
            eq(inventory.userId, ctx.user.id)
          )
        )
        .then((rows) => rows[0]);

      if (!item) throw new Error("Inventory item not found");
      if (item.quantity < input.quantity) throw new Error("Insufficient quantity");

      // Log the transaction
      await db.insert(inventoryTransactions).values({
        userId: ctx.user.id,
        inventoryId: input.inventoryId,
        transactionType: "transfer",
        quantityChanged: input.quantity,
        fromLocation: item.currentLocation || "Unknown",
        toLocation: input.toLocation,
        notes: input.notes,
      });

      // Update inventory location
      await db
        .update(inventory)
        .set({
          currentLocation: input.toLocation,
          lastLocationUpdate: new Date(),
        })
        .where(eq(inventory.id, input.inventoryId));

      return { success: true, message: "Inventory transferred successfully" };
    }),

  updateStatus: publicProcedure
    .input(
      z.object({
        inventoryId: z.number(),
        status: z.enum(["available", "in_use", "maintenance", "retired"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(inventory)
        .set({ status: input.status })
        .where(
          and(
            eq(inventory.id, input.inventoryId),
            eq(inventory.userId, ctx.user.id)
          )
        );

      return { success: true, message: "Status updated successfully" };
    }),

  getTransactionHistory: publicProcedure
    .input(z.object({ inventoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .select()
        .from(inventoryTransactions)
        .where(
          and(
            eq(inventoryTransactions.userId, ctx.user.id),
            eq(inventoryTransactions.inventoryId, input.inventoryId)
          )
        )
        .orderBy(desc(inventoryTransactions.createdAt));
    }),

  getSummary: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const items = await db
      .select()
      .from(inventory)
      .where(eq(inventory.userId, ctx.user.id));

    const totalValue = items.reduce(
      (sum, item) => sum + (parseFloat(item.totalValue as any) || 0),
      0
    );

    const byStatus: Record<string, number> = {
      available: 0,
      in_use: 0,
      maintenance: 0,
      retired: 0,
    };

    items.forEach((item) => {
      byStatus[item.status]++;
    });

    const byCategory: Record<string, number> = {};
    items.forEach((item) => {
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    });

    return {
      totalItems: items.length,
      totalValue: totalValue.toFixed(2),
      byStatus,
      byCategory,
    };
  }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(inventory)
        .where(
          and(
            eq(inventory.id, input.id),
            eq(inventory.userId, ctx.user.id)
          )
        );

      return { success: true, message: "Inventory item deleted" };
    }),
});
