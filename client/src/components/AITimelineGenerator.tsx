import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Zap, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface AITimelineGeneratorProps {
  onTimelineGenerated?: (timeline: any) => void;
}

export function AITimelineGenerator({ onTimelineGenerated }: AITimelineGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateTimelineMutation = trpc.ai.generateTimeline.useMutation({
    onSuccess: (data) => {
      try {
        const parsed = typeof data.timeline === "string" ? JSON.parse(data.timeline) : data.timeline;
        setTimeline(parsed);
        if (onTimelineGenerated) {
          onTimelineGenerated(parsed);
        }
      } catch (error) {
        toast.error("Failed to parse timeline data");
      }
      setLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate timeline");
      setLoading(false);
    },
  });

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please enter a project description");
      return;
    }

    setLoading(true);
    generateTimelineMutation.mutate({
      projectDescription: description.trim(),
    });
  };

  const handleReset = () => {
    setDescription("");
    setTimeline(null);
  };

  const handleClose = () => {
    handleReset();
    setOpen(false);
  };

  const milestones = timeline?.milestones || [];

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <Clock className="mr-2 h-4 w-4" />
        Generate Timeline
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Project Timeline Generator</DialogTitle>
            <DialogDescription>
              Let AI create a realistic project timeline with milestones based on your project description
            </DialogDescription>
          </DialogHeader>

          {!timeline ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Description</label>
                <Textarea
                  placeholder="Describe your project in detail. Include scope, requirements, and any special considerations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-32"
                />
              </div>

              <Button onClick={handleGenerate} className="w-full" disabled={loading || generateTimelineMutation.isPending}>
                {loading || generateTimelineMutation.isPending ? "Generating..." : "Generate Timeline"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">Timeline Generated</p>
                      <p className="text-sm text-green-700 mt-1">{milestones.length} milestones created</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {milestones.map((milestone: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Badge variant="outline">{milestone.daysFromStart}d</Badge>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{milestone.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Generate Another
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
