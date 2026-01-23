import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { AIExpenseCategorizer } from "@/components/AIExpenseCategorizer";

const expenseSchema = z.object({
  projectId: z.number(),
  category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
  costDate: z.date().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const categories = [
  "Materials",
  "Labor",
  "Equipment",
  "Transportation",
  "Permits",
  "Subcontractors",
  "Tools",
  "Other",
];

const categoryColors: Record<string, string> = {
  "Materials": "bg-blue-100 text-blue-800",
  "Labor": "bg-green-100 text-green-800",
  "Equipment": "bg-yellow-100 text-yellow-800",
  "Transportation": "bg-purple-100 text-purple-800",
  "Permits": "bg-red-100 text-red-800",
  "Subcontractors": "bg-indigo-100 text-indigo-800",
  "Tools": "bg-orange-100 text-orange-800",
  "Other": "bg-gray-100 text-gray-800",
};

export default function Expenses() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: projects } = trpc.projects.list.useQuery();
  const { data: expenses, isLoading } = trpc.jobCosts.list.useQuery();

  const createMutation = trpc.jobCosts.create.useMutation({
    onSuccess: () => {
      utils.jobCosts.list.invalidate();
      toast.success("Expense recorded successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to record expense");
    },
  });

  const deleteMutation = trpc.jobCosts.delete.useMutation({
    onSuccess: () => {
      utils.jobCosts.list.invalidate();
      toast.success("Expense deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete expense");
    },
  });

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      projectId: 0,
      category: "Materials",
      amount: "",
      description: "",
      costDate: new Date(),
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    if (data.projectId === 0) {
      toast.error("Please select a project");
      return;
    }
    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    createMutation.mutate({
      projectId: data.projectId,
      category: data.category,
      amount: data.amount,
      description: data.description,
      costDate: data.costDate,
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
  };

  // Calculate totals by category
  const expensesByCategory = useMemo(() => {
    if (!expenses) return {};
    const result: Record<string, number> = {};
    expenses.forEach((exp: any) => {
      const category = exp.category || "Other";
      const amount = parseFloat(exp.amount as any) || 0;
      result[category] = (result[category] || 0) + amount;
    });
    return result;
  }, [expenses]);

  const totalExpenses = expenses?.reduce((sum: number, exp: any) => sum + (parseFloat(exp.amount as any) || 0), 0) || 0;
  const avgExpense = expenses && expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : "0.00";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">Loading expenses...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground mt-2">Track and manage project expenses</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Expense
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Expense</DialogTitle>
                <DialogDescription>Add a new project expense</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projects?.map((project: any) => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="250.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Expense details..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Recording..." : "Record Expense"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
            </Dialog>
            <AIExpenseCategorizer />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All recorded expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Expense</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgExpense}</div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenses?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total recorded</p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
          {expenses && expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.slice(0, 10).map((expense: any) => (
                <Card key={expense.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{expense.category}</p>
                          <Badge className={categoryColors[expense.category] || categoryColors["Other"]}>
                            {expense.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{expense.description || "No description"}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-lg font-bold">${parseFloat(expense.amount as any).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {expense.costDate ? new Date(expense.costDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No expenses recorded yet.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Breakdown of spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((cat) => {
                const amount = expensesByCategory[cat] || 0;
                const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : "0";
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={categoryColors[cat]}>{cat}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
