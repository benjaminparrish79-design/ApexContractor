import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { executeSnowflakeQuery } from "../snowflake/config";
import { getDb } from "../db";
import { invoices, projects, jobCosts, teamMembers, gpsTimeEntries } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const snowflakeSyncRouter = router({
  /**
   * Initialize Snowflake tables for ApexContractor
   */
  initializeTables: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");

    try {
      // Create schema if not exists
      await executeSnowflakeQuery(`CREATE SCHEMA IF NOT EXISTS APEXCONTRACTOR_DB.PUBLIC`);

      // Create invoices table
      await executeSnowflakeQuery(`
        CREATE TABLE IF NOT EXISTS INVOICES (
          ID INT,
          USER_ID INT,
          CLIENT_ID INT,
          PROJECT_ID INT,
          INVOICE_NUMBER VARCHAR(50),
          STATUS VARCHAR(50),
          SUBTOTAL DECIMAL(12, 2),
          TAX_AMOUNT DECIMAL(12, 2),
          TOTAL DECIMAL(12, 2),
          DUE_DATE TIMESTAMP,
          CREATED_AT TIMESTAMP,
          UPDATED_AT TIMESTAMP
        )
      `);

      // Create projects table
      await executeSnowflakeQuery(`
        CREATE TABLE IF NOT EXISTS PROJECTS (
          ID INT,
          USER_ID INT,
          CLIENT_ID INT,
          NAME VARCHAR(255),
          DESCRIPTION TEXT,
          STATUS VARCHAR(50),
          PROGRESS INT,
          BUDGET DECIMAL(12, 2),
          START_DATE TIMESTAMP,
          END_DATE TIMESTAMP,
          CREATED_AT TIMESTAMP,
          UPDATED_AT TIMESTAMP
        )
      `);

      // Create expenses table
      await executeSnowflakeQuery(`
        CREATE TABLE IF NOT EXISTS EXPENSES (
          ID INT,
          USER_ID INT,
          PROJECT_ID INT,
          CATEGORY VARCHAR(100),
          AMOUNT DECIMAL(12, 2),
          COST_DATE TIMESTAMP,
          CREATED_AT TIMESTAMP
        )
      `);

      // Create team members table
      await executeSnowflakeQuery(`
        CREATE TABLE IF NOT EXISTS TEAM_MEMBERS (
          ID INT,
          USER_ID INT,
          NAME VARCHAR(255),
          EMAIL VARCHAR(320),
          ROLE VARCHAR(100),
          HOURLY_RATE DECIMAL(10, 2),
          CREATED_AT TIMESTAMP
        )
      `);

      // Create GPS time entries table
      await executeSnowflakeQuery(`
        CREATE TABLE IF NOT EXISTS GPS_TIME_ENTRIES (
          ID INT,
          USER_ID INT,
          TEAM_MEMBER_ID INT,
          PROJECT_ID INT,
          CLOCK_IN_TIME TIMESTAMP,
          CLOCK_OUT_TIME TIMESTAMP,
          CLOCK_IN_LATITUDE DECIMAL(10, 8),
          CLOCK_IN_LONGITUDE DECIMAL(11, 8),
          DURATION_MINUTES INT,
          TOTAL_COST DECIMAL(12, 2),
          CREATED_AT TIMESTAMP
        )
      `);

      return { success: true, message: "Snowflake tables initialized successfully" };
    } catch (error) {
      console.error("[SnowflakeSync] Initialization failed:", error);
      throw error;
    }
  }),

  /**
   * Sync invoices from MySQL to Snowflake
   */
  syncInvoices: publicProcedure
    .input(z.object({ projectId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");

      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        let query = db.select().from(invoices).where(eq(invoices.userId, ctx.user.id));
        if (input.projectId) {
          query = query.where(eq(invoices.projectId, input.projectId));
        }

        const invoiceData = await query;

        // Insert into Snowflake
        for (const invoice of invoiceData) {
          await executeSnowflakeQuery(
            `INSERT INTO INVOICES VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              invoice.id,
              invoice.userId,
              invoice.clientId,
              invoice.projectId,
              invoice.invoiceNumber,
              invoice.status,
              invoice.subtotal,
              invoice.taxAmount,
              invoice.total,
              invoice.dueDate,
              invoice.createdAt,
              invoice.updatedAt,
            ]
          );
        }

        return { success: true, recordsSynced: invoiceData.length };
      } catch (error) {
        console.error("[SnowflakeSync] Invoice sync failed:", error);
        throw error;
      }
    }),

  /**
   * Get advanced analytics from Snowflake
   */
  getAdvancedAnalytics: publicProcedure
    .input(z.object({ projectId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");

      try {
        // Revenue by month
        const revenueByMonth = await executeSnowflakeQuery(`
          SELECT 
            DATE_TRUNC('month', DUE_DATE) as month,
            SUM(TOTAL) as revenue
          FROM INVOICES
          WHERE USER_ID = ? AND STATUS = 'paid'
          GROUP BY DATE_TRUNC('month', DUE_DATE)
          ORDER BY month DESC
          LIMIT 12
        `, [ctx.user.id]);

        // Project profitability
        const projectProfitability = await executeSnowflakeQuery(`
          SELECT 
            p.NAME,
            SUM(i.TOTAL) as revenue,
            SUM(e.AMOUNT) as expenses,
            (SUM(i.TOTAL) - SUM(e.AMOUNT)) as profit
          FROM PROJECTS p
          LEFT JOIN INVOICES i ON p.ID = i.PROJECT_ID
          LEFT JOIN EXPENSES e ON p.ID = e.PROJECT_ID
          WHERE p.USER_ID = ?
          GROUP BY p.ID, p.NAME
        `, [ctx.user.id]);

        // Team productivity
        const teamProductivity = await executeSnowflakeQuery(`
          SELECT 
            tm.NAME,
            COUNT(gte.ID) as total_hours,
            SUM(gte.DURATION_MINUTES) / 60 as hours_worked,
            SUM(gte.TOTAL_COST) as total_earned
          FROM TEAM_MEMBERS tm
          LEFT JOIN GPS_TIME_ENTRIES gte ON tm.ID = gte.TEAM_MEMBER_ID
          WHERE tm.USER_ID = ?
          GROUP BY tm.ID, tm.NAME
        `, [ctx.user.id]);

        return {
          revenueByMonth,
          projectProfitability,
          teamProductivity,
        };
      } catch (error) {
        console.error("[SnowflakeSync] Analytics query failed:", error);
        throw error;
      }
    }),

  /**
   * Get predictive insights from Snowflake
   */
  getPredictiveInsights: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");

    try {
      // Revenue forecast (based on historical data)
      const revenueForecast = await executeSnowflakeQuery(`
        SELECT 
          DATE_TRUNC('month', DUE_DATE) as month,
          AVG(TOTAL) as avg_invoice_value,
          COUNT(*) as invoice_count
        FROM INVOICES
        WHERE USER_ID = ?
        GROUP BY DATE_TRUNC('month', DUE_DATE)
        ORDER BY month DESC
        LIMIT 6
      `, [ctx.user.id]);

      // Cash flow risk analysis
      const cashFlowRisk = await executeSnowflakeQuery(`
        SELECT 
          STATUS,
          COUNT(*) as count,
          SUM(TOTAL) as amount
        FROM INVOICES
        WHERE USER_ID = ? AND STATUS IN ('draft', 'sent', 'viewed', 'overdue')
        GROUP BY STATUS
      `, [ctx.user.id]);

      return {
        revenueForecast,
        cashFlowRisk,
      };
    } catch (error) {
      console.error("[SnowflakeSync] Predictive insights failed:", error);
      throw error;
    }
  }),
});
