# Scenario Generator Application

## Overview

This is a full-stack scenario planning application built with React, Express.js, and TypeScript. The application allows users to create scenario planning exercises, generate AI-powered future scenarios, and track events to validate predictions. It uses a modern tech stack with shadcn/ui components, Drizzle ORM, and OpenAI integration for intelligent scenario generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with proper HTTP status codes
- **Validation**: Zod schemas for request/response validation
- **AI Integration**: OpenAI GPT-4o for scenario generation
- **Development**: Hot reload with Vite middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations
- **Development Storage**: In-memory storage class for rapid prototyping
- **Session Storage**: PostgreSQL-based sessions with connect-pg-simple

## Key Components

### Database Schema
- **Scenarios Table**: Core scenario planning data with AI-generated scenarios stored as JSONB
- **Events Table**: Trackable events linked to scenarios for validation
- **Shared Schema**: TypeScript types generated from Drizzle schema for type safety

### Frontend Components
- **Dashboard**: Main application interface with metrics and scenario management
- **ScenarioForm**: Form for creating new scenario planning exercises
- **ScenarioList**: Display and management of existing scenarios
- **EventTracker**: Event creation and tracking interface
- **UI Components**: Complete shadcn/ui component library

### Backend Services
- **OpenAI Service**: AI-powered scenario generation and analysis
- **Storage Abstraction**: Interface-based storage system supporting multiple backends
- **Route Handlers**: Express middleware for API endpoints

## Data Flow

1. **Scenario Creation**: User submits scenario details → AI generates multiple future scenarios → Stored in database
2. **Event Generation**: AI analyzes scenarios → Generates trackable events → User can modify probabilities
3. **Future Calculation**: AI processes probability assessments → Calculates most likely outcome
4. **Event Tracking**: Users update event outcomes → System tracks prediction accuracy

## External Dependencies

### Core Dependencies
- **Anthropic Claude**: Claude-4 Sonnet integration for scenario generation and analysis (primary)
- **OpenAI**: GPT-4o integration for scenario generation and analysis (fallback)
- **Neon Database**: Serverless PostgreSQL hosting
- **Radix UI**: Headless UI components for accessibility
- **Drizzle ORM**: Type-safe database operations

### Development Tools
- **Replit Integration**: Vite plugin for Replit-specific features
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Vite middleware integration for seamless development
- **Environment Variables**: DATABASE_URL and ANTHROPIC_API_KEY (or OPENAI_API_KEY) required
- **Time Horizons**: Now supports scenario planning up to 10 years

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built frontend in production mode

### Database Setup
- **Schema Push**: `npm run db:push` applies schema changes
- **Migrations**: Drizzle generates migrations in `./migrations` directory
- **Connection**: Uses DATABASE_URL environment variable for connection

The application is designed for scalability with a clean separation between frontend and backend, type-safe data handling, and AI-powered intelligence for strategic planning scenarios.