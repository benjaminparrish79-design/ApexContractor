import { useState } from "react";
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
import { Plus, Trash2, AlertCircle, CheckCircle2, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

const complianceDocumentSchema = z.object({
  teamMemberId: z.number(),
  documentType: z.enum(["license", "certification", "insurance", "training", "other"]),
  documentName: z.string().min(1, "Document name is required"),
  fileUrl: z.string().url("Invalid file URL"),
  issueDate: z.date().optional(),
  expiryDate: z.date().optional(),
  notes: z.string().optional(),
});

type ComplianceDocumentFormData = z.infer<typeof complianceDocumentSchema>;

const statusColors: Record<string, string> = {
  valid: "bg-green-100 text-green-800",
  expiring_soon: "bg-yellow-100 text-yellow-800",
  expired: "bg-red-100 text-red-800",
};

const verificationColors: Record<string, string> = {
  verified: "bg-green-100 text-green-800",
  pending: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800",
};

export default function ComplianceHub() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: documents } = trpc.compliance.list.useQuery();
  const { data: teamMembers } = trpc.teamMembers.list.useQuery();
  const { data: expiringDocs } = trpc.compliance.getExpiringDocuments.useQuery();

  const createMutation = trpc.compliance.create.useMutation({
    onSuccess: () => {
      utils.compliance.list.invalidate();
      utils.compliance.getExpiringDocuments.invalidate();
      toast.success("Compliance document added successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add document");
    },
  });

  const deleteMutation = trpc.compliance.delete.useMutation({
    onSuccess: () => {
      utils.compliance.list.invalidate();
      utils.compliance.getExpiringDocuments.invalidate();
      toast.success("Document deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete document");
    },
  });

  const verifyMutation = trpc.aiDocumentVerification.verifyDocument.useMutation({
    onSuccess: (data) => {
      utils.compliance.list.invalidate();
      toast.success(
        data.isValid
          ? "Document verified successfully"
          : "Document verification failed. Please review."
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Verification failed");
    },
  });

  const form = useForm<ComplianceDocumentFormData>({
    resolver: zodResolver(complianceDocumentSchema),
    defaultValues: {
      teamMemberId: 0,
      documentType: "license",
      documentName: "",
      fileUrl: "",
      notes: "",
    },
  });

  const onSubmit = (data: ComplianceDocumentFormData) => {
    if (data.teamMemberId === 0) {
      toast.error("Please select a team member");
      return;
    }
    createMutation.mutate(data);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleVerify = (id: number, fileUrl: string) => {
    verifyMutation.mutate({ documentId: id, fileUrl });
  };

  const expiringCount = expiringDocs?.length || 0;
  const validCount = documents?.filter((d) => d.status === "valid").length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Compliance Hub</h1>
            <p className="text-muted-foreground mt-2">Manage team member licenses, certifications, and insurance</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Compliance Document</DialogTitle>
                <DialogDescription>Upload a new compliance document for a team member</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="teamMemberId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Member</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a team member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teamMembers?.map((member: any) => (
                              <SelectItem key={member.id} value={member.id.toString()}>
                                {member.name}
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
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="license">License</SelectItem>
                            <SelectItem value="certification">Certification</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., General Contractor License" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File URL</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://example.com/document.pdf" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ? field.value.toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ? field.value.toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional notes..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Document"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">All compliance documents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valid Documents</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{validCount}</div>
              <p className="text-xs text-muted-foreground">Current and valid</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiringCount}</div>
              <p className="text-xs text-muted-foreground">Within 30 days</p>
            </CardContent>
          </Card>
        </div>

        {expiringCount > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900">{expiringCount} document(s) expiring soon</p>
                  <p className="text-sm text-yellow-700 mt-1">Please review and renew documents that are expiring within the next 30 days.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">All Documents</h2>
          {documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold">{doc.documentName}</p>
                          <Badge className={statusColors[doc.status] || statusColors["valid"]}>
                            {doc.status.replace("_", " ")}
                          </Badge>
                          <Badge className={verificationColors[doc.verificationStatus] || verificationColors["pending"]}>
                            {doc.verificationStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Type: {doc.documentType} | Expires: {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "N/A"}
                        </p>
                        {doc.notes && <p className="text-sm text-muted-foreground">{doc.notes}</p>}
                      </div>
                      <div className="flex gap-2">
                        {doc.verificationStatus === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerify(doc.id, doc.fileUrl)}
                            disabled={verifyMutation.isPending}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Verify
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No documents yet. Add one to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
