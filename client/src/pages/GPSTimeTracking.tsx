import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, MapPin, CheckCircle2, AlertCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";

const clockInSchema = z.object({
  teamMemberId: z.number(),
  projectId: z.number(),
  clockInLatitude: z.number().min(-90).max(90),
  clockInLongitude: z.number().min(-180).max(180),
  notes: z.string().optional(),
});

const clockOutSchema = z.object({
  id: z.number(),
  clockOutLatitude: z.number().min(-90).max(90),
  clockOutLongitude: z.number().min(-180).max(180),
  notes: z.string().optional(),
});

type ClockInFormData = z.infer<typeof clockInSchema>;
type ClockOutFormData = z.infer<typeof clockOutSchema>;

const approvalStatusColors: Record<string, string> = {
  pending: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function GPSTimeTracking() {
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [isClockingOut, setIsClockingOut] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const utils = trpc.useUtils();

  const { data: entries } = trpc.gpsTimeTracking.list.useQuery();
  const { data: teamMembers } = trpc.teamMembers.list.useQuery();
  const { data: projects } = trpc.projects.list.useQuery();
  const { data: summary } = trpc.gpsTimeTracking.getSummary.useQuery({});

  const clockInMutation = trpc.gpsTimeTracking.clockIn.useMutation({
    onSuccess: (data) => {
      utils.gpsTimeTracking.list.invalidate();
      utils.gpsTimeTracking.getSummary.invalidate();
      toast.success(data.message);
      setIsClockingIn(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to clock in");
    },
  });

  const clockOutMutation = trpc.gpsTimeTracking.clockOut.useMutation({
    onSuccess: (data) => {
      utils.gpsTimeTracking.list.invalidate();
      utils.gpsTimeTracking.getSummary.invalidate();
      toast.success(data.message);
      setIsClockingOut(false);
      formOut.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to clock out");
    },
  });

  const approveMutation = trpc.gpsTimeTracking.approve.useMutation({
    onSuccess: () => {
      utils.gpsTimeTracking.list.invalidate();
      toast.success("Time entry approved");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve");
    },
  });

  const form = useForm<ClockInFormData>({
    resolver: zodResolver(clockInSchema),
    defaultValues: {
      teamMemberId: 0,
      projectId: 0,
      clockInLatitude: 0,
      clockInLongitude: 0,
      notes: "",
    },
  });

  const formOut = useForm<ClockOutFormData>({
    resolver: zodResolver(clockOutSchema),
    defaultValues: {
      id: 0,
      clockOutLatitude: 0,
      clockOutLongitude: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to get your location. Please enable GPS.");
        }
      );
    }
  }, []);

  const handleClockIn = (data: ClockInFormData) => {
    if (data.teamMemberId === 0 || data.projectId === 0) {
      toast.error("Please select team member and project");
      return;
    }

    if (!userLocation) {
      toast.error("Unable to get your GPS location");
      return;
    }

    clockInMutation.mutate({
      ...data,
      clockInLatitude: userLocation.lat,
      clockInLongitude: userLocation.lon,
    });
  };

  const handleClockOut = (data: ClockOutFormData) => {
    if (!userLocation) {
      toast.error("Unable to get your GPS location");
      return;
    }

    clockOutMutation.mutate({
      ...data,
      clockOutLatitude: userLocation.lat,
      clockOutLongitude: userLocation.lon,
    });
  };

  const activeEntry = entries?.find((e) => !e.clockOutTime);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">GPS Time Tracking</h1>
            <p className="text-muted-foreground mt-2">Track work hours with GPS verification</p>
          </div>
        </div>

        {activeEntry && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">Currently clocked in</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Started at {new Date(activeEntry.clockInTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setIsClockingOut(true);
                    formOut.setValue("id", activeEntry.id);
                  }}
                  variant="destructive"
                >
                  Clock Out
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalDurationHours || 0}h</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary?.totalCost || "0.00"}</div>
              <p className="text-xs text-muted-foreground">Labor cost</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.approvedEntries || 0}</div>
              <p className="text-xs text-muted-foreground">Time entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.pendingEntries || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {!activeEntry && (
          <Button
            onClick={() => setIsClockingIn(true)}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Clock className="mr-2 h-5 w-5" />
            Clock In
          </Button>
        )}

        <Dialog open={isClockingIn} onOpenChange={setIsClockingIn}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Clock In</DialogTitle>
              <DialogDescription>Start tracking your work time with GPS verification</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleClockIn)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="teamMemberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select yourself" />
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
                {userLocation && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-900">
                        GPS: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={clockInMutation.isPending}>
                  {clockInMutation.isPending ? "Clocking In..." : "Clock In"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isClockingOut} onOpenChange={setIsClockingOut}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Clock Out</DialogTitle>
              <DialogDescription>End your work session</DialogDescription>
            </DialogHeader>
            <Form {...formOut}>
              <form onSubmit={formOut.handleSubmit(handleClockOut)} className="space-y-4">
                {userLocation && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-900">
                        GPS: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )}
                <FormField
                  control={formOut.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={clockOutMutation.isPending}>
                  {clockOutMutation.isPending ? "Clocking Out..." : "Clock Out"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Time Entries</h2>
          {entries && entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold">
                            {new Date(entry.clockInTime).toLocaleDateString()} -{" "}
                            {new Date(entry.clockInTime).toLocaleTimeString()}
                          </p>
                          <Badge className={approvalStatusColors[entry.approvalStatus] || approvalStatusColors["pending"]}>
                            {entry.approvalStatus}
                          </Badge>
                          {entry.isGeofenced && (
                            <Badge variant="outline" className="bg-green-50">
                              <MapPin className="h-3 w-3 mr-1" />
                              On-site
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Duration: {entry.durationMinutes ? `${Math.floor(entry.durationMinutes / 60)}h ${entry.durationMinutes % 60}m` : "Active"} | Cost: ${entry.totalCost || "0.00"}
                        </p>
                      </div>
                      {entry.approvalStatus === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveMutation.mutate({ id: entry.id })}
                          disabled={approveMutation.isPending}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No time entries yet. Clock in to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
