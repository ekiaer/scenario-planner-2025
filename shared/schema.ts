import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scenarios = pgTable("scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  timeHorizon: text("time_horizon").notNull(),
  uncertainties: text("uncertainties").notNull(),
  context: text("context"),
  generatedScenarios: jsonb("generated_scenarios").$type<{
    title: string;
    description: string;
    impact: string;
    probability: number;
  }[]>().default([]),
  mostLikelyFuture: text("most_likely_future"),
  confidenceLevel: integer("confidence_level").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scenarioId: varchar("scenario_id").notNull().references(() => scenarios.id),
  title: text("title").notNull(),
  description: text("description"),
  timeframe: text("timeframe").notNull(),
  probability: integer("probability").notNull().default(50),
  occurred: text("occurred").default("pending"), // "pending" | "yes" | "no"
  impact: text("impact"), // actual impact if occurred
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertScenarioSchema = createInsertSchema(scenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateScenarioSchema = insertScenarioSchema.partial();

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateEventSchema = insertEventSchema.partial();

export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type UpdateScenario = z.infer<typeof updateScenarioSchema>;
export type Scenario = typeof scenarios.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
export type Event = typeof events.$inferSelect;
