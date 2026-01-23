import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { invoices, clientPortalAccess, projects, clients } from "../../drizzle/schema";
import crypto from "crypto";

export const clientPortalRouter = router({
  /**
   * Create a secure portal link for client access
   */
  createPortalAccess: publicProcedure
    .input(
      z.object({
        clientId: z.number(),
        projectId: z.number(),
        accessLevel: z.enum(["view_only", "approve_changes", "make_payments"]),
        expiryDays: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const accessToken = crypto.randomBytes(32).toString("hex");
      const portalUrl = `https://portal.contractorpro.app/${accessToken}`;
      const expiryDate = input.expiryDays
        ? new Date(Date.now() + input.expiryDays * 24 * 60 * 60 * 1000)
        : null;

      await db.insert(clientPortalAccess).values({
        userId: ctx.user.id,
        clientId: input.clientId,
        projectId: input.projectId,
        portalUrl,
        accessToken,
        accessLevel: input.accessLevel,
        isActive: true,
        expiryDate,
      });

      return {
        success: true,
        portalUrl,
        accessToken,
        message: "Portal access created successfully",
      };
    }),

  /**
   * Get portal data with access token (client-side access)
   */
  getPortalData: publicProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const access = await db
        .select()
        .from(clientPortalAccess)
        .where(eq(clientPortalAccess.accessToken, input.accessToken))
        .then((rows) => rows[0]);

      if (!access || !access.isActive) {
        throw new Error("Invalid or expired portal access");
      }

      if (access.expiryDate && new Date(access.expiryDate) < new Date()) {
        throw new Error("Portal access has expired");
      }

      // Update last accessed time
      await db
        .update(clientPortalAccess)
        .set({ lastAccessedAt: new Date() })
        .where(eq(clientPortalAccess.id, access.id));

      // Fetch project details
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, access.projectId))
        .then((rows) => rows[0]);

      // Fetch invoices for this project
      const projectInvoices = await db
        .select()
        .from(invoices)
        .where(eq(invoices.projectId, access.projectId));

      return {
        project,
        invoices: projectInvoices,
        accessLevel: access.accessLevel,
        canViewOnly: access.accessLevel === "view_only",
        canApproveChanges: access.accessLevel === "approve_changes",
        canMakePayments: access.accessLevel === "make_payments",
      };
    }),

  /**
   * List all client portal accesses for the contractor
   */
  listClientAccess: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return db
      .select()
      .from(clientPortalAccess)
      .where(eq(clientPortalAccess.userId, ctx.user.id));
  }),

  /**
   * Revoke client portal access
   */
  revokeAccess: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(clientPortalAccess)
        .set({ isActive: false })
        .where(
          and(
            eq(clientPortalAccess.id, input.id),
            eq(clientPortalAccess.userId, ctx.user.id)
          )
        );

      return { success: true, message: "Portal access revoked" };
    }),

  /**
   * Update access level for a portal
   */
  updateAccessLevel: publicProcedure
    .input(
      z.object({
        id: z.number(),
        accessLevel: z.enum(["view_only", "approve_changes", "make_payments"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(clientPortalAccess)
        .set({ accessLevel: input.accessLevel })
        .where(
          and(
            eq(clientPortalAccess.id, input.id),
            eq(clientPortalAccess.userId, ctx.user.id)
          )
        );

      return { success: true, message: "Access level updated" };
    }),

  /**
   * Get invoices for a specific client (legacy support)
   */
  listByClient: publicProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(invoices)
          .where(eq(invoices.clientId, input.clientId));

        return result;
      } catch (error) {
        console.error("[ClientPortal] Failed to fetch invoices:", error);
        return [];
      }
    }),

  /**
   * Get invoice details for public viewing (legacy support)
   */
  getInvoiceDetails: publicProcedure
    .input(z.object({ invoiceId: z.number(), clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const result = await db
          .select()
          .from(invoices)
          .where(
            and(
              eq(invoices.id, input.invoiceId),
              eq(invoices.clientId, input.clientId)
            )
          )
          .limit(1);

        return result.length > 0 ? result[0] : null;
      } catch (error) {
        console.error("[ClientPortal] Failed to fetch invoice details:", error);
        return null;
      }
    }),

  /**
   * Get payment history for a client (legacy support)
   */
  getPaymentHistory: publicProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        return [];
      } catch (error) {
        console.error("[ClientPortal] Failed to fetch payment history:", error);
        return [];
      }
    }),
});
