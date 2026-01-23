import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, TrendingUp, Award } from "lucide-react";

/**
 * Client Feedback & Rating System - Collect testimonials and ratings
 */
export default function ClientFeedback() {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");

  const feedback = [
    {
      id: 1,
      client: "John Anderson",
      rating: 5,
      text: "Excellent work! The kitchen renovation exceeded our expectations. Professional team, great communication, and finished on time.",
      date: new Date(Date.now() - 86400000 * 7),
      verified: true,
    },
    {
      id: 2,
      client: "Sarah Mitchell",
      rating: 5,
      text: "Highly recommend! They handled our bathroom remodel perfectly. Attention to detail was impressive.",
      date: new Date(Date.now() - 86400000 * 14),
      verified: true,
    },
    {
      id: 3,
      client: "Michael Brown",
      rating: 4,
      text: "Great service overall. Minor delays but the final result was worth the wait.",
      date: new Date(Date.now() - 86400000 * 21),
      verified: true,
    },
  ];

  const stats = [
    { label: "Average Rating", value: "4.8", icon: Star, color: "text-yellow-500" },
    { label: "Total Reviews", value: "24", icon: MessageSquare, color: "text-blue-500" },
    { label: "Verified Reviews", value: "22", icon: Award, color: "text-green-500" },
    { label: "Satisfaction Rate", value: "96%", icon: TrendingUp, color: "text-purple-500" },
  ];

  const handleSubmitFeedback = () => {
    if (selectedRating > 0 && feedbackText.trim()) {
      console.log("Submitting feedback:", { rating: selectedRating, text: feedbackText });
      setSelectedRating(0);
      setFeedbackText("");
      alert("Thank you for your feedback!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Client Feedback & Ratings</h1>
          <p className="text-gray-600">Collect testimonials and build your reputation</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-6 text-center">
                <Icon className={`${stat.color} mx-auto mb-3`} size={32} />
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Feedback Form */}
          <Card className="p-6 lg:col-span-1 h-fit sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Feedback</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= selectedRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                </label>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full h-24"
                />
              </div>

              <Button
                onClick={handleSubmitFeedback}
                disabled={selectedRating === 0 || !feedbackText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Submit Feedback
              </Button>
            </div>
          </Card>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {feedback.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{review.client}</p>
                    <p className="text-xs text-gray-600">
                      {review.date.toLocaleDateString()}
                    </p>
                  </div>
                  {review.verified && (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  )}
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <p className="text-gray-700">{review.text}</p>

                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                  <Button size="sm" variant="outline">
                    Helpful
                  </Button>
                  <Button size="sm" variant="outline">
                    Reply
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
