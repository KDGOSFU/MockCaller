# MockCaller - AI Fundraising Call Simulator

An advanced AI-powered platform for sales professionals to practice and improve their fundraising pitch calls through realistic simulations with AI-controlled prospects.

## Features

- **AI-Powered Prospects**: Realistic prospect behavior using GPT models
- **Multiple Scenarios**: Various industries and buyer personas
- **Performance Analytics**: Detailed evaluation of sales techniques
- **Mock Call Recordings**: Full transcript and analysis of each call
- **Personalized Feedback**: AI-generated coaching and improvement areas

## Tech Stack

- **Frontend**: Next.js 16.2 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **AI**: OpenAI GPT API
- **Authentication**: Clerk (planned)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- **Node.js 18+** and npm (or yarn/pnpm)
- **PostgreSQL database** (Supabase recommended for easy setup)
- **OpenAI API key** (for AI-powered mock calls)
- **Clerk** (For Authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MockCaller
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables (Next.js convention):

   ```env
   # Database
   DATABASE_URL="postgresql://[user]:[password]@[host]:6543/database"
   DIRECT_URL="postgresql://[user]:[password]@[host]:5432/database"

   # OpenAI
   OPENAI_API_KEY="sk-..."

   # Supabase (if using Supabase)
   NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="sb_publishable_..."

   #Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   ```

   Create a `.env` file in the root directory with the following variables (For Prisma):

   ```env
   # Database
   DATABASE_URL="postgresql://[user]:[password]@[host]:6543/database"
   DIRECT_URL="postgresql://[user]:[password]@[host]:5432/database"

   # OpenAI
   OPENAI_API_KEY="sk-..."

   See [Environment Variables](#environment-variables) section below for details on obtaining these credentials.

4. **Set up the database**
   ```bash
   npx prisma db push
   ```
   This command creates the necessary tables in the PostgreSQL database based on the Prisma schema.

4. **Load Database**
   ```bash
   npx prisma db seed
   ```
   This command seeds json files and loads the PostgreSQL database.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) and you're ready to go!


### Getting API Credentials

**OpenAI API Key:**
- Go to [OpenAI API Keys](https://platform.openai.com/account/api-keys)
- Create a new secret key
- Add it to your `.env.local` and `.env` as `OPENAI_API_KEY`

**Supabase Setup:**
- Create a free account at [supabase.com](https://supabase.com)
- Create a new project
- Go to Project Settings → API to find your `NEXT_PUBLIC_SUPABASE_URL` and keys
- Copy these values to your `.env.local`

## Project Structure

```
MockCaller/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── api/
│   │   │   └── sessions/             # API route for sessions
│   │   │       └── route.ts
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   ├── components/                   # React components
│   ├── frontend/                     # Frontend utilities
│   │   └── managers_dashboard.ts
│   ├── lib/                          # Utility functions
│   ├── prompts/                      # AI prompt templates
│   ├── utils/                        # Utility modules
│   │   └── supabase/                 # Supabase client utilities
│   │       ├── client.ts
│   │       ├── middleware.ts
│   │       └── server.ts
│   └── proxy.ts                      # Proxy utilities
├── prisma/
│   ├── migrations/                   # Prisma SQL migrations history
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Database seeding script
├── public/                           # Static assets
│   └── data/
│       ├── prospects.json            # Prospect data
│       └── scenarios.json            # Scenario data
├── next-env.d.ts                     # Next.js TypeScript declarations
├── next.config.js                    # Next.js configuration
├── package.json                      # Project dependencies
├── postcss.config.ts                 # PostCSS configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── .env                              # Environment variables (Prisma)
└── .env.local                        # Environment variables (local/Node)
```

## Environment Variables

The `.env` and `.env.local` file contains sensitive credentials needed to run the application. Prisma and OpenAI is default to use `.env` file, while Node uses `.env.local` by convention. **Never commit this file to git** (it's already in `.gitignore`).

### Required Variables (in   `.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:6543/mock_caller` |
| `DIRECT_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/mock_caller` |
| `OPENAI_API_KEY` | OpenAI API key for AI simulations | `sk-proj-xxxxxxxxxxxxx` |


### Required Variables (in `.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:6543/mock_caller` |
| `DIRECT_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/mock_caller` |
| `OPENAI_API_KEY` | OpenAI API key for AI simulations | `sk-proj-xxxxxxxxxxxxx` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Authentication Public Key | `pk_...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://...` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase Public Key | `sb_publishable_...` |


## Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma db push      # Push schema changes to database
npx prisma db pull      # Pull schema from database
npx prisma studio       # Open Prisma Studio (visual DB browser)
npx prisma db seed      # Seed the database rows and columns

# Code Quality
npm run lint            # Run ESLint
```

## Dependencies

See [DEPENDENCIES.md](DEPENDENCIES.md) for a complete list of all runtime and development dependencies, including:

- **React** (19.2.4) - UI framework
- **Next.js** (16.2.2) - React framework with SSR
- **Prisma** (6.19.3) - Database ORM & Migration tool
- **Supabase** (2.101.1) - PostgreSQL database & auth
- **Tailwind CSS** (4.2.2) - CSS framework
- **TypeScript** (6.0.2) - Type safety
- **OpenAI SDK** (6.35.0) - AI API client for GPT models

Run `npm install` to install all dependencies listed in `package.json`.

## Database Schema

### Models

- **User**: Registered users (sales reps, coaches)
- **Scenario**: Sales call scenarios with buyer personas
- **ProspectProfile**: AI-controlled prospect with personality
- **Objection**: Common objections for each prospect
- **MockSession**: Individual practice call session
- **TranscriptTurn**: Each exchange in a call transcript
- **EvaluationReport**: AI-generated performance feedback

See `prisma/schema.prisma` for detailed schema.
