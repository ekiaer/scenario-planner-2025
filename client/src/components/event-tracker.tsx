import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, MoreVertical, Save, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Scenario, Event } from "@shared/schema";

interface EventTrackerProps {
  scenario: Scenario;
}

export default function EventTracker({ scenario }: EventTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/scenarios', scenario.id, 'events'],
    enabled: !!scenario.id,
  });

  const generateEventsMutation = useMutation({
    mutationFn: async (scenarioId: string) => {
      const response = await apiRequest("POST", `/api/scenarios/${scenarioId}/generate-events`);
      return response.json();
    },
    onSuccess: (newEvents: Event[]) => {
      toast({
        title: "Events Generated",
        description: `${newEvents.length} potential events have been generated for tracking.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios', scenario.id, 'events'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate events.",
        variant: "destructive",
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Event> }) => {
      const response = await apiRequest("PATCH", `/api/events/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios', scenario.id, 'events'] });
    },
  });

  const handleProbabilityChange = (eventId: string, probability: number) => {
    updateEventMutation.mutate({
      id: eventId,
      updates: { probability }
    });
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "bg-red-500";
    if (probability >= 65) return "bg-accent";
    if (probability >= 40) return "bg-secondary";
    return "bg-neutral-400";
  };

  if (!scenario.mostLikelyFuture) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Calculate Future First</h3>
            <p className="text-neutral-600">Generate a most likely future scenario to start tracking potential events.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="text-accent mr-2" />
            <CardTitle className="text-lg">Potential Events to Track</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {events.length === 0 && (
              <Button 
                onClick={() => generateEventsMutation.mutate(scenario.id)}
                disabled={generateEventsMutation.isPending}
                size="sm"
              >
                {generateEventsMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-1 h-4 w-4" />
                    Generate Events
                  </>
                )}
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Custom Event
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Events Yet</h3>
            <p className="text-neutral-600">Generate potential events to track for this scenario.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${getProbabilityColor(event.probability)}`}></div>
                      <span className="font-medium text-neutral-900">{event.title}</span>
                    </div>
                    <div className="ml-6 text-sm text-neutral-500">Expected: {event.timeframe}</div>
                    {event.description && (
                      <div className="ml-6 text-sm text-neutral-600 mt-1">{event.description}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-neutral-600">Probability:</span>
                      <Slider
                        value={[event.probability]}
                        onValueChange={([value]) => handleProbabilityChange(event.id, value)}
                        max={100}
                        step={1}
                        className="w-20"
                      />
                      <span className="text-sm font-semibold text-accent w-8">
                        {event.probability}%
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                  <Button variant="outline" size="sm">
                    <History className="mr-2 h-4 w-4" />
                    View History
                  </Button>
                </div>
                <div className="text-sm text-neutral-500">
                  Auto-save: <span className="text-secondary">Enabled</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
