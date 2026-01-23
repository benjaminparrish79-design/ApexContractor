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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Mail, Phone, Clock } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AITimelineGenerator } from "@/components/AITimelineGenerator";

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  role: z.enum(["admin", "manager", "worker"]).optional(),
  hourlyRate: z.string().optional(),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  manager: "bg-blue-100 text-blue-800",
  worker: "bg-green-100 text-green-800",
};

export default function TeamMembers() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: teamMembers, isLoading } = trpc.teamMembers.list.useQuery();

  const createMutation = trpc.teamMembers.create.useMutation({
    onSuccess: () => {
      utils.teamMembers.list.invalidate();
      toast.success("Team member added successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add team member");
    },
  });

  const deleteMutation = trpc.teamMembers.delete.useMutation({
    onSuccess: () => {
      utils.teamMembers.list.invalidate();
      toast.success("Team member removed");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete team member");
    },
  });

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "worker",
      hourlyRate: "50",
    },
  });

  const onSubmit = (data: TeamMemberFormData) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const totalMembers = teamMembers?.length || 0;
  const avgHourlyRate = teamMembers && teamMembers.length > 0
    ? (teamMembers.reduce((sum, m) => sum + (parseFloat(m.hourlyRate as any) || 0), 0) / teamMembers.length).toFixed(2)
    : "0.00";
  const totalPayroll = teamMembers
    ? (teamMembers.reduce((sum, m) => sum + (parseFloat(m.hourlyRate as any) || 0) * 160, 0)).toFixed(2)
    : "0.00";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">Loading team members...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="text-muted-foreground mt-2">Manage your team and contractors</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>Add a new team member or contractor</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="worker">Worker</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="50.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Member"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
            </Dialog>
            <AITimelineGenerator />
          </div>
        </div>

        {/* Team Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">Active team members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Hourly Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgHourlyRate}</div>
              <p className="text-xs text-muted-foreground">Per hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPayroll}</div>
              <p className="text-xs text-muted-foreground">Monthly estimate</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers && teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{member.name}</CardTitle>
                    <Badge className={`${roleColors[member.role || "worker"]} mt-2`}>
                      {member.role || "worker"}
                    </Badge>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                      {member.phone}
                    </a>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p className="text-sm font-semibold">${member.hourlyRate}/hour</p>
                  <p className="text-xs text-muted-foreground">
                    Est. ${(parseFloat(member.hourlyRate as any) * 160).toFixed(2)}/month
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!teamMembers || teamMembers.length === 0) && (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No team members yet. Add one to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
