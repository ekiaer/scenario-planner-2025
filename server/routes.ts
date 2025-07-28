import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScenarioSchema, updateScenarioSchema, insertEventSchema, updateEventSchema } from "@shared/schema";
import { generateScenarios, calculateMostLikelyFuture, generateEvents } from "./services/openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all scenarios
  app.get("/api/scenarios", async (req, res) => {
    try {
      const scenarios = await storage.getAllScenarios();
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scenarios" });
    }
  });

  // Get single scenario
  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const scenario = await storage.getScenario(req.params.id);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scenario" });
    }
  });

  // Create scenario and generate AI scenarios
  app.post("/api/scenarios", async (req, res) => {
    try {
      const validatedData = insertScenarioSchema.parse(req.body);
      
      // Generate scenarios using AI
      const generatedScenarios = await generateScenarios(
        validatedData.name,
        validatedData.timeHorizon,
        validatedData.uncertainties,
        validatedData.context || undefined
      );

      // Create scenario with generated data
      const scenario = await storage.createScenario({
        ...validatedData,
        generatedScenarios
      });

      res.json(scenario);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error('Scenario creation error:', error);
      res.status(500).json({ message: "Failed to create scenario: " + (error as Error).message });
    }
  });

  // Update scenario probabilities and calculate most likely future
  app.patch("/api/scenarios/:id", async (req, res) => {
    try {
      const validatedData = updateScenarioSchema.parse(req.body);
      const scenario = await storage.updateScenario(req.params.id, validatedData);
      
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }

      res.json(scenario);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update scenario" });
    }
  });

  // Calculate most likely future
  app.post("/api/scenarios/:id/calculate-future", async (req, res) => {
    try {
      const scenario = await storage.getScenario(req.params.id);
      if (!scenario || !scenario.generatedScenarios) {
        return res.status(404).json({ message: "Scenario not found or has no generated scenarios" });
      }

      const result = await calculateMostLikelyFuture(scenario.generatedScenarios);
      
      // Update the scenario with the calculated future
      const updatedScenario = await storage.updateScenario(req.params.id, {
        mostLikelyFuture: result.description,
        confidenceLevel: result.confidenceLevel
      });

      res.json(updatedScenario);
    } catch (error) {
      console.error('Calculate future error:', error);
      res.status(500).json({ message: "Failed to calculate most likely future: " + (error as Error).message });
    }
  });

  // Generate events for scenario
  app.post("/api/scenarios/:id/generate-events", async (req, res) => {
    try {
      const scenario = await storage.getScenario(req.params.id);
      if (!scenario || !scenario.mostLikelyFuture) {
        return res.status(404).json({ message: "Scenario not found or has no calculated future" });
      }

      const generatedEvents = await generateEvents(
        scenario.mostLikelyFuture,
        scenario.timeHorizon,
        scenario.uncertainties
      );

      // Create events in storage
      const createdEvents = [];
      for (const eventData of generatedEvents) {
        const event = await storage.createEvent({
          scenarioId: scenario.id,
          title: eventData.title,
          description: eventData.description,
          timeframe: eventData.timeframe,
          probability: eventData.probability
        });
        createdEvents.push(event);
      }

      res.json(createdEvents);
    } catch (error) {
      console.error('Generate events error:', error);
      res.status(500).json({ message: "Failed to generate events: " + (error as Error).message });
    }
  });

  // Get events for scenario
  app.get("/api/scenarios/:id/events", async (req, res) => {
    try {
      const events = await storage.getEventsByScenario(req.params.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Update event
  app.patch("/api/events/:id", async (req, res) => {
    try {
      const validatedData = updateEventSchema.parse(req.body);
      const event = await storage.updateEvent(req.params.id, validatedData);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  // Delete scenario
  app.delete("/api/scenarios/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteScenario(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      res.json({ message: "Scenario deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete scenario" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
