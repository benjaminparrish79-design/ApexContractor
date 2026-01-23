import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AIExpenseCategorizerProps {
  onCategorized?: (category: string, isTaxDeductible: boolean) => void;
}

export function AIExpenseCategorizer({ onCategorized }: AIExpenseCategorizerProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const categorizeMutation = trpc.ai.categorizeExpense.useMutation({
    onSuccess: (data) => {
      setResult(data);
      if (onCategorized) {
        onCategorized(data.category, data.isTaxDeductible);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to categorize expense");
      setLoading(false);
    },
  });

  const handleCategorize = async () => {
    if (!description.trim()) {
      toast.error("Please enter an expense description");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    categorizeMutation.mutate({
      description: description.trim(),
      amount: parseFloat(amount),
    });
  };

  const handleReset = () => {
    setDescription("");
    setAmount("");
    setResult(null);
  };

  const handleClose = () => {
    handleReset();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <Zap className="mr-2 h-4 w-4" />
        AI Categorize
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AI Expense Categorizer</DialogTitle>
            <DialogDescription>
              Let AI automatically categorize your expense and determine tax deductibility
            </DialogDescription>
          </DialogHeader>

          {!result ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Expense Description</label>
                <Input
                  placeholder="e.g., Office supplies and equipment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button onClick={handleCategorize} className="w-full" disabled={loading || categorizeMutation.isPending}>
                {loading || categorizeMutation.isPending ? "Analyzing..." : "Categorize with AI"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">Categorization Complete</p>
                      <p className="text-sm text-green-700 mt-1">{result.reason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-800">{result.category}</Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tax Deductible</p>
                  <div className="flex items-center gap-2 mt-1">
                    {result.isTaxDeductible ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Yes</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-600">No</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Categorize Another
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
