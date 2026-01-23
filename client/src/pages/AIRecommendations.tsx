import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, DollarSign, Target, CheckCircle } from "lucide-react";

/**
 * AI-Powered Recommendations - Smart pricing, project suggestions, optimization
 */
export default function AIRecommendations() {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>("pricing");

  const recommendations = [
    {
      id: "pricing",
      title: "Smart Pricing Recommendations",
      icon: DollarSign,
      items: [
        {
          name: "Electrical Work",
          currentRate: "$45/hr",
          recommendedRate: "$52/hr",
          increase: "+15%",
          reason: "Market rate for your area increased 12% YoY",
          confidence: 94,
        },
        {
          name: "Carpentry",
          currentRate: "$40/hr",
          recommendedRate: "$43/hr",
          increase: "+7%",
          reason: "Your project completion rate is 15% above average",
          confidence: 87,
        },
        {
          name: "Plumbing",
          currentRate: "$50/hr",
          recommendedRate: "$48/hr",
          increase: "-4%",
          reason: "High competition in your area, consider bundled services",
          confidence: 79,
        },
      ],
    },
    {
      id: "projects",
      title: "Project Suggestions",
      icon: Target,
      items: [
        {
          name: "Kitchen Remodeling",
          reason: "Similar to 3 projects you completed successfully",
          potentialValue: "$8,500",
          matchScore: 92,
        },
        {
          name: "Bathroom Renovation",
          reason: "High demand in your service area",
          potentialValue: "$5,200",
          matchScore: 88,
        },
        {
          name: "Deck Installation",
          reason: "Seasonal opportunity, 40% higher rates in Q2",
          potentialValue: "$6,800",
          matchScore: 85,
        },
      ],
    },
    {
      id: "optimization",
      title: "Business Optimization",
      icon: TrendingUp,
      items: [
        {
          name: "Team Utilization",
          current: "72%",
          recommended: "85%",
          action: "Hire 1 additional team member to increase capacity",
          impact: "+$45K annual revenue",
        },
        {
          name: "Project Margins",
          current: "28%",
          recommended: "35%",
          action: "Negotiate better material supplier rates",
          impact: "+$12K annual profit",
        },
        {
          name: "Invoice Timing",
          current: "18 days avg",
          recommended: "10 days avg",
          action: "Implement automatic payment reminders",
          impact: "+$8K cash flow improvement",
        },
      ],
    },
  ];

  const currentTab = recommendations.find((r) => r.id === selectedRecommendation);
  const IconComponent = currentTab?.icon || Lightbulb;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Lightbulb size={36} />
            AI-Powered Recommendations
          </h1>
          <p className="text-gray-600">Smart pricing, project suggestions, and business optimization</p>
        </div>

        {/* Tab Navigation */}
        <Card className="p-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <Button
                  key={rec.id}
                  size="sm"
                  variant={selectedRecommendation === rec.id ? "default" : "outline"}
                  onClick={() => setSelectedRecommendation(rec.id)}
                  className="flex items-center gap-2"
                >
                  <Icon size={16} />
                  {rec.title.split(" ")[0]}
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Recommendations Content */}
        {currentTab && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <IconComponent className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">{currentTab.title}</h2>
            </div>

            {selectedRecommendation === "pricing" && (
              <div className="space-y-4">
                {(currentTab.items as any[]).map((item, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {item.confidence}% confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Current Rate</p>
                        <p className="text-lg font-bold text-gray-900">{item.currentRate}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600">Recommended</p>
                        <p className="text-lg font-bold text-blue-600">{item.recommendedRate}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600">Increase</p>
                        <p className="text-lg font-bold text-green-600">{item.increase}</p>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Apply Recommendation
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {selectedRecommendation === "projects" && (
              <div className="space-y-4">
                {(currentTab.items as any[]).map((item, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {item.matchScore}% match
                      </Badge>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg mb-4">
                      <p className="text-sm text-gray-600">Potential Value</p>
                      <p className="text-2xl font-bold text-green-600">{item.potentialValue}</p>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Create Project Bid
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {selectedRecommendation === "optimization" && (
              <div className="space-y-4">
                {(currentTab.items as any[]).map((item, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <Badge className="bg-purple-100 text-purple-800">{item.impact}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Current</p>
                        <p className="text-lg font-bold text-gray-900">{item.current}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600">Recommended</p>
                        <p className="text-lg font-bold text-blue-600">{item.recommended}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">{item.action}</p>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Implement Change
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Insights */}
        <Card className="p-6 mt-8 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-4">
            <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">AI Insights</h3>
              <p className="text-sm text-blue-800">
                Based on analysis of your 127 completed projects, market data, and industry trends,
                these recommendations could increase your annual revenue by $65K-$85K while improving
                profitability and team efficiency. Implement recommendations gradually to test market
                response.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
