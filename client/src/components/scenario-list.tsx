import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Calculator, Expand, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Scenario } from "@shared/schema";

interface ScenarioListProps {
  scenarios: Scenario[];
  isLoading: boolean;
  selectedScenario: Scenario | null;
  onScenarioSelect: (scenario: Scenario) => void;
}

export default function ScenarioList({ scenarios, isLoading, selectedScenario, onScenarioSelect }: ScenarioListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loadingFuture, setLoadingFuture] = useState(false);

  const updateScenarioMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Scenario> }) => {
      const response = await apiRequest("PATCH", `/api/scenarios/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
    },
  });

  const calculateFutureMutation = useMutation({
    mutationFn: async (scenarioId: string) => {
      const response = await apiRequest("POST", `/api/scenarios/${scenarioId}/calculate-future`);
      return response.json();
    },
    onSuccess: (scenario: Scenario) => {
      toast({
        title: "Most Likely Future Calculated",
        description: "AI has analyzed your probability assessments and calculated the most likely outcome.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
      onScenarioSelect(scenario);
    },
    onError: (error: Error) => {
      toast({
        title: "Calculation Failed",
        description: error.message || "Failed to calculate most likely future.",
        variant: "destructive",
      });
    },
  });

  const handleProbabilityChange = (scenarioId: string, scenarioIndex: number, probability: number) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario || !scenario.generatedScenarios) return;

    const updatedScenarios = [...scenario.generatedScenarios];
    updatedScenarios[scenarioIndex] = {
      ...updatedScenarios[scenarioIndex],
      probability
    };

    updateScenarioMutation.mutate({
      id: scenarioId,
      updates: { generatedScenarios: updatedScenarios }
    });
  };

  const calculateTotalProbability = (scenario: Scenario) => {
    if (!scenario.generatedScenarios) return 0;
    return scenario.generatedScenarios.reduce((sum, s) => sum + s.probability, 0);
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high impact":
        return "bg-secondary/10 text-secondary";
      case "medium impact":
        return "bg-neutral-400/10 text-neutral-600";
      case "high risk":
        return "bg-red-100 text-red-700";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Loading Scenarios...</h3>
            <p className="text-neutral-600">Fetching your scenario data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (scenarios.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="text-center">
            <Lightbulb className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Scenarios Yet</h3>
            <p className="text-neutral-600">Create your first scenario using the form on the left to get started with AI-powered strategic planning.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {scenarios.map((scenario) => (
        <div key={scenario.id} className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lightbulb className="text-accent mr-2" />
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    {scenario.updatedAt 
                      ? `Updated ${new Date(scenario.updatedAt).toLocaleDateString()}`
                      : `Created ${new Date(scenario.createdAt!).toLocaleDateString()}`
                    }
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {scenario.generatedScenarios && scenario.generatedScenarios.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {scenario.generatedScenarios.map((genScenario, index) => (
                      <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-900 mb-2">{genScenario.title}</h4>
                            <p className="text-sm text-neutral-600 leading-relaxed">{genScenario.description}</p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <Badge className={getImpactColor(genScenario.impact)}>
                              {genScenario.impact}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm font-medium text-neutral-700">Probability:</label>
                              <Slider
                                value={[genScenario.probability]}
                                onValueChange={([value]) => handleProbabilityChange(scenario.id, index, value)}
                                max={100}
                                step={1}
                                className="w-24"
                              />
                              <span className="text-sm font-semibold text-primary w-8">
                                {genScenario.probability}%
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Expand className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <div className="text-sm text-neutral-500">
                      Total probability: 
                      <span className={`font-semibold ml-1 ${
                        calculateTotalProbability(scenario) === 100 ? 'text-neutral-900' : 'text-red-600'
                      }`}>
                        {calculateTotalProbability(scenario)}%
                      </span>
                    </div>
                    <Button 
                      onClick={() => calculateFutureMutation.mutate(scenario.id)}
                      disabled={calculateFutureMutation.isPending || calculateTotalProbability(scenario) !== 100}
                      className="bg-secondary hover:bg-green-600"
                    >
                      {calculateFutureMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="mr-2 h-4 w-4" />
                          Calculate Most Likely Future
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-neutral-600">AI is generating scenarios...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Most Likely Future Result */}
          {scenario.mostLikelyFuture && (
            <Card className="mt-4 bg-gradient-to-r from-primary to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold">Most Likely Near-term Future</h3>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-white leading-relaxed">{scenario.mostLikelyFuture}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm opacity-90">
                    Confidence Level: <span className="font-bold">{scenario.confidenceLevel}%</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => onScenarioSelect(scenario)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    View Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </>
  );
}
