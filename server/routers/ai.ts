import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { getDb, getBusinessSettingsByUserId } from "../db";
import { invoices, invoiceItems } from "../../drizzle/schema";

export const aiRouter = router({
  /**
   * Generate invoice from project description using AI and persist to database
   */
  generateInvoice: protectedProcedure
    .input(
      z.object({
        description: z.string().min(10, "Please provide a detailed project description"),
        clientId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Use LLM to analyze project and generate invoice structure
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert contractor invoice generator. Analyze the project description and generate a structured invoice with line items, pricing, and tax calculation. Return ONLY valid JSON with no markdown formatting.`,
            },
            {
              role: "user",
              content: `Generate an invoice for this project: ${input.description}
              
              Return JSON with this exact structure:
              {
                "lineItems": [
                  {"description": "item description", "quantity": 1, "unitPrice": 0, "amount": 0}
                ],
                "subtotal": 0,
                "taxRate": 10,
                "taxAmount": 0,
                "total": 0,
                "notes": "Payment terms: Net 30"
              }`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "invoice_structure",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  lineItems: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        description: { type: "string" },
                        quantity: { type: "number" },
                        unitPrice: { type: "number" },
                        amount: { type: "number" },
                      },
                      required: ["description", "quantity", "unitPrice", "amount"],
                    },
                  },
                  subtotal: { type: "number" },
                  taxRate: { type: "number" },
                  taxAmount: { type: "number" },
                  total: { type: "number" },
                  notes: { type: "string" },
                },
                required: ["lineItems", "subtotal", "taxRate", "taxAmount", "total"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== "string") throw new Error("No response from LLM");

        const invoiceData = JSON.parse(content);

        // Persist the invoice to the database
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const settings = await getBusinessSettingsByUserId(ctx.user.id);
        const invoiceNumber = `${settings?.invoicePrefix || "INV"}-${settings?.nextInvoiceNumber || 1001}`;

        const invoiceResult = await db.insert(invoices).values({
          userId: ctx.user.id,
          clientId: input.clientId || 1,
          invoiceNumber,
          status: "draft",
          subtotal: invoiceData.subtotal || 0,
          taxAmount: invoiceData.taxAmount || 0,
          total: invoiceData.total || 0,
          notes: invoiceData.notes || "",
        });

        // Insert line items
        if (invoiceData.lineItems && Array.isArray(invoiceData.lineItems)) {
          for (const item of invoiceData.lineItems) {
            await db.insert(invoiceItems).values({
              invoiceId: invoiceResult.insertId as number,
              description: item.description,
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice || 0,
              total: item.amount || 0,
            });
          }
        }

        return {
          success: true,
          invoiceId: invoiceResult.insertId,
          invoiceNumber,
          message: `Invoice ${invoiceNumber} created successfully`,
        };
      } catch (error) {
        console.error("Error generating invoice:", error);
        throw new Error("Failed to generate invoice");
      }
    }),

  /**
   * Generate proposal from project description
   */
  generateProposal: protectedProcedure
    .input(
      z.object({
        description: z.string().min(10),
        clientName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert proposal writer for contractors. Generate a professional project proposal based on the description provided.`,
            },
            {
              role: "user",
              content: `Generate a professional proposal for: ${input.description}`,
            },
          ],
        });

        const proposal = response.choices[0]?.message?.content;

        return {
          success: true,
          proposal,
        };
      } catch (error) {
        console.error("Error generating proposal:", error);
        throw new Error("Failed to generate proposal");
      }
    }),

  /**
   * Categorize expense using AI
   */
  categorizeExpense: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert accountant. Categorize the following expense and suggest if it's tax-deductible. Return ONLY valid JSON with no markdown.`,
            },
            {
              role: "user",
              content: `Categorize this expense: ${input.description} ($${input.amount})
              
              Return JSON: {"category": "category name", "isTaxDeductible": true/false, "reason": "explanation"}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "expense_category",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  isTaxDeductible: { type: "boolean" },
                  reason: { type: "string" },
                },
                required: ["category", "isTaxDeductible", "reason"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== "string") throw new Error("No response from LLM");

        const categorization = JSON.parse(content);

        return {
          success: true,
          ...categorization,
        };
      } catch (error) {
        console.error("Error categorizing expense:", error);
        throw new Error("Failed to categorize expense");
      }
    }),

  /**
   * Generate project timeline from description
   */
  generateTimeline: protectedProcedure
    .input(
      z.object({
        projectDescription: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a project manager. Generate a realistic project timeline with milestones based on the project description. Return ONLY valid JSON.`,
            },
            {
              role: "user",
              content: `Generate a project timeline for: ${input.projectDescription}
              
              Return JSON: {"milestones": [{"name": "milestone", "daysFromStart": 0, "description": "details"}]}`,
            },
          ],
        });

        const timeline = response.choices[0]?.message?.content;

        return {
          success: true,
          timeline,
        };
      } catch (error) {
        console.error("Error generating timeline:", error);
        throw new Error("Failed to generate timeline");
      }
    }),
});
