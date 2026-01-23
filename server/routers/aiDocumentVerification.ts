import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { complianceDocuments } from "../../drizzle/schema";

export const aiDocumentVerificationRouter = router({
  verifyDocument: publicProcedure
    .input(
      z.object({
        documentId: z.number(),
        fileUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const doc = await db
        .select()
        .from(complianceDocuments)
        .where(
          and(
            eq(complianceDocuments.id, input.documentId),
            eq(complianceDocuments.userId, ctx.user.id)
          )
        )
        .then((rows) => rows[0]);

      if (!doc) throw new Error("Document not found");

      try {
        const verificationResult = await verifyDocumentWithAI(input.fileUrl, doc.documentType);

        await db
          .update(complianceDocuments)
          .set({
            verificationStatus: verificationResult.isValid ? "verified" : "failed",
            aiVerificationData: verificationResult,
            updatedAt: new Date(),
          })
          .where(eq(complianceDocuments.id, input.documentId));

        return {
          success: true,
          isValid: verificationResult.isValid,
          extractedData: verificationResult.extractedData,
          confidence: verificationResult.confidence,
          issues: verificationResult.issues,
        };
      } catch (error: any) {
        await db
          .update(complianceDocuments)
          .set({
            verificationStatus: "failed",
            aiVerificationData: {
              error: error.message,
              timestamp: new Date().toISOString(),
            },
            updatedAt: new Date(),
          })
          .where(eq(complianceDocuments.id, input.documentId));

        throw new Error(`Document verification failed: ${error.message}`);
      }
    }),
});

async function verifyDocumentWithAI(
  fileUrl: string,
  documentType: string
): Promise<{
  isValid: boolean;
  confidence: number;
  extractedData: Record<string, any>;
  issues: string[];
}> {
  // Mock implementation
  return {
    isValid: true,
    confidence: 0.95,
    extractedData: {
      documentType,
      issueDate: "2024-01-15",
      expiryDate: "2026-01-15",
      issuer: "State Department",
      licenseNumber: "LIC-123456",
    },
    issues: [],
  };
}
