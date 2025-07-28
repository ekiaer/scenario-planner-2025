import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertScenarioSchema, type InsertScenario, type Scenario } from "@shared/schema";

interface ScenarioFormProps {
  onScenarioCreated: (scenario: Scenario) => void;
}

export default function ScenarioForm({ onScenarioCreated }: ScenarioFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertScenario>({
    resolver: zodResolver(insertScenarioSchema),
    defaultValues: {
      name: "",
      timeHorizon: "1 year",
      uncertainties: "",
      context: "",
      generatedScenarios: [],
    },
  });

  const createScenarioMutation = useMutation({
    mutationFn: async (data: InsertScenario) => {
      const response = await apiRequest("POST", "/api/scenarios", data);
      return response.json();
    },
    onSuccess: (scenario: Scenario) => {
      toast({
        title: "Scenarios Generated",
        description: "AI has successfully generated multiple scenarios based on your inputs.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
      form.reset();
      onScenarioCreated(scenario);
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate scenarios. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertScenario) => {
    createScenarioMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <PlusCircle className="text-primary mr-2" />
          <CardTitle className="text-lg">Create New Scenario</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scenario Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Market Expansion 2024-2027" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeHorizon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Horizon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time horizon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
                      <SelectItem value="2 years">2 years</SelectItem>
                      <SelectItem value="3 years">3 years</SelectItem>
                      <SelectItem value="5 years">5 years</SelectItem>
                      <SelectItem value="7 years">7 years</SelectItem>
                      <SelectItem value="10 years">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uncertainties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Uncertainties</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter key uncertainties that could impact your scenario (e.g., economic conditions, regulatory changes, competitive landscape)..."
                      rows={4}
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context & Background</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide additional context or constraints for scenario generation..."
                      rows={3}
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createScenarioMutation.isPending}
            >
              {createScenarioMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Scenarios with AI
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
