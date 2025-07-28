import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Bell, TrendingUp, Calendar, Target, History, Settings, Share2, Download, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScenarioForm from "@/components/scenario-form";
import ScenarioList from "@/components/scenario-list";
import EventTracker from "@/components/event-tracker";
import type { Scenario } from "@shared/schema";

export default function Dashboard() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const { data: scenarios = [], isLoading } = useQuery<Scenario[]>({
    queryKey: ['/api/scenarios'],
  });

  const activeScenarios = scenarios.length;
  const totalEvents = scenarios.reduce((acc, scenario) => acc + (scenario.generatedScenarios?.length || 0), 0);
  const daysActive = scenarios.length > 0 ? Math.floor((Date.now() - new Date(scenarios[scenarios.length - 1].createdAt!).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-neutral-900">Scenario Generator</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-primary font-medium border-b-2 border-primary pb-4">Dashboard</a>
              <a href="#" className="text-neutral-600 hover:text-neutral-900 pb-4">Scenarios</a>
              <a href="#" className="text-neutral-600 hover:text-neutral-900 pb-4">History</a>
              <a href="#" className="text-neutral-600 hover:text-neutral-900 pb-4">Settings</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="text-neutral-400 hover:text-neutral-600" />
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Strategic Scenario Planning</h2>
                <p className="text-neutral-600 max-w-2xl">
                  Generate multiple plausible futures based on key uncertainties, assign probabilities, and track how events shape your long-term projections.
                </p>
              </div>
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{activeScenarios}</div>
                  <div className="text-sm text-neutral-500">Active Scenarios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{totalEvents}</div>
                  <div className="text-sm text-neutral-500">Generated Scenarios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{daysActive}</div>
                  <div className="text-sm text-neutral-500">Days Active</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <ScenarioForm onScenarioCreated={(scenario) => setSelectedScenario(scenario)} />

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <History className="mr-3 h-4 w-4 text-neutral-400" />
                  Load Previous Scenario
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Download className="mr-3 h-4 w-4 text-neutral-400" />
                  Import Scenario Template
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Share2 className="mr-3 h-4 w-4 text-neutral-400" />
                  Share Current Analysis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Scenarios Panel */}
          <div className="lg:col-span-2">
            <ScenarioList 
              scenarios={scenarios} 
              isLoading={isLoading}
              selectedScenario={selectedScenario}
              onScenarioSelect={setSelectedScenario}
            />

            {selectedScenario && (
              <EventTracker scenario={selectedScenario} />
            )}
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="text-primary mr-2" />
                  <CardTitle className="text-lg">Scenario Evolution Dashboard</CardTitle>
                </div>
                <div className="flex items-center space-x-3">
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last 6 months</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-primary to-blue-600 text-white rounded-lg">
                  <div className="text-2xl font-bold mb-2">73%</div>
                  <div className="text-sm opacity-90">Prediction Accuracy</div>
                  <div className="text-xs opacity-75 mt-1">+5% vs last period</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-secondary to-green-600 text-white rounded-lg">
                  <div className="text-2xl font-bold mb-2">{totalEvents}</div>
                  <div className="text-sm opacity-90">Scenarios Generated</div>
                  <div className="text-xs opacity-75 mt-1">{Math.floor(totalEvents * 0.4)} tracked actively</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-accent to-orange-600 text-white rounded-lg">
                  <div className="text-2xl font-bold mb-2">15</div>
                  <div className="text-sm opacity-90">Probability Adjustments</div>
                  <div className="text-xs opacity-75 mt-1">Last update: 2 days ago</div>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-neutral-900 mb-4">Probability Changes Over Time</h4>
                <div className="h-64 bg-white rounded border border-neutral-200 flex items-center justify-center">
                  <div className="text-center text-neutral-500">
                    <BarChart3 className="text-4xl mb-4 opacity-50 mx-auto" />
                    <p>Interactive chart showing scenario probability evolution</p>
                    <p className="text-sm mt-1">Chart visualization will be displayed here</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-secondary rounded-full mr-3"></div>
                        <div>
                          <div className="font-medium text-neutral-900">New Scenario Created</div>
                          <div className="text-sm text-neutral-500">2 hours ago</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-secondary font-medium">+3 scenarios</div>
                        <div className="text-xs text-neutral-500">Market analysis</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-accent rounded-full mr-3"></div>
                        <div>
                          <div className="font-medium text-neutral-900">Probabilities Updated</div>
                          <div className="text-sm text-neutral-500">1 day ago</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-accent font-medium">Confidence +5%</div>
                        <div className="text-xs text-neutral-500">Growth scenario</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-4">Upcoming Actions</h4>
                  <div className="space-y-3">
                    <div className="p-3 border border-neutral-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-neutral-900">Review Scenarios</div>
                        <span className="text-sm text-neutral-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          In 5 days
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">Update probability assessments based on recent market data</p>
                    </div>
                    
                    <div className="p-3 border border-neutral-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-neutral-900">Generate New Events</div>
                        <span className="text-sm text-neutral-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          In 2 weeks
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">Create tracking events for Q2 scenarios</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
