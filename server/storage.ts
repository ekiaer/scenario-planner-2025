import { type Scenario, type InsertScenario, type UpdateScenario, type Event, type InsertEvent, type UpdateEvent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Scenario operations
  getScenario(id: string): Promise<Scenario | undefined>;
  getAllScenarios(): Promise<Scenario[]>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  updateScenario(id: string, updates: UpdateScenario): Promise<Scenario | undefined>;
  deleteScenario(id: string): Promise<boolean>;

  // Event operations
  getEvent(id: string): Promise<Event | undefined>;
  getEventsByScenario(scenarioId: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: UpdateEvent): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private scenarios: Map<string, Scenario>;
  private events: Map<string, Event>;

  constructor() {
    this.scenarios = new Map();
    this.events = new Map();
  }

  // Scenario operations
  async getScenario(id: string): Promise<Scenario | undefined> {
    return this.scenarios.get(id);
  }

  async getAllScenarios(): Promise<Scenario[]> {
    return Array.from(this.scenarios.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const id = randomUUID();
    const now = new Date();
    const scenario: Scenario = { 
      ...insertScenario, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.scenarios.set(id, scenario);
    return scenario;
  }

  async updateScenario(id: string, updates: UpdateScenario): Promise<Scenario | undefined> {
    const existing = this.scenarios.get(id);
    if (!existing) return undefined;

    const updated: Scenario = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.scenarios.set(id, updated);
    return updated;
  }

  async deleteScenario(id: string): Promise<boolean> {
    // Also delete associated events
    const scenarioEvents = await this.getEventsByScenario(id);
    for (const event of scenarioEvents) {
      this.events.delete(event.id);
    }
    
    return this.scenarios.delete(id);
  }

  // Event operations
  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByScenario(scenarioId: string): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => event.scenarioId === scenarioId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const now = new Date();
    const event: Event = { 
      ...insertEvent, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: UpdateEvent): Promise<Event | undefined> {
    const existing = this.events.get(id);
    if (!existing) return undefined;

    const updated: Event = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }
}

export const storage = new MemStorage();
