# Scenario Planning Application

An AI-powered scenario planning application that generates multiple futures from uncertainties and adapts predictions based on evolving event probabilities.

## Features

- **AI-Powered Scenario Generation**: Uses Anthropic Claude or OpenAI to generate realistic future scenarios
- **Flexible Time Horizons**: Support for planning scenarios up to 10 years
- **Probability Weighting**: Assign and adjust probabilities for different scenarios
- **Future Calculation**: Calculate the most likely outcome based on probability assessments
- **Event Tracking**: Generate and track specific events to validate predictions over time
- **Professional Dashboard**: Clean interface with analytics and progress tracking

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Anthropic Claude (primary), OpenAI GPT-4o (fallback)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (or use Neon Database)
- Anthropic API key or OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd scenario-planning-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Add your environment variables:
```
DATABASE_URL=your_postgresql_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
# OR
OPENAI_API_KEY=your_openai_api_key
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard

### Option 2: Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway deploy
```

### Option 3: Netlify

1. Build the application:
```bash
npm run build
```

2. Deploy to Netlify using their dashboard or CLI

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes* |
| `OPENAI_API_KEY` | OpenAI API key | Yes* |

*Either Anthropic or OpenAI API key is required

## Usage

1. **Create a Scenario**: Enter your planning context, uncertainties, and time horizon
2. **Review Generated Scenarios**: AI generates 4 realistic future scenarios with probabilities
3. **Adjust Probabilities**: Fine-tune the likelihood of each scenario based on your insights
4. **Calculate Most Likely Future**: Get an integrated prediction with confidence level
5. **Generate Events**: Create trackable events to validate predictions over time
6. **Track Progress**: Update event outcomes as they occur to refine future predictions

## API Endpoints

- `GET /api/scenarios` - Get all scenarios
- `POST /api/scenarios` - Create a new scenario
- `PATCH /api/scenarios/:id` - Update a scenario
- `POST /api/scenarios/:id/calculate-future` - Calculate most likely future
- `POST /api/scenarios/:id/generate-events` - Generate trackable events
- `GET /api/scenarios/:id/events` - Get events for a scenario
- `PATCH /api/events/:id` - Update an event

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details