# Workstation Assignment Dashboard

A modern web dashboard for workstation assignment and management at a global creative studio. This application centralizes data from multiple internal tools and provides real-time interaction for the Scheduling & Resourcing team and Help Desk.

## Technology Stack

- **Frontend**: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: Zustand, SWR for data fetching and caching
- **Mocking**: Mock API handlers for development

## Features

- **Split-screen Dashboard** - Users and workstations lists with filtering
- **Real-time Status Indicators** - Monitor workstation availability and Parsec connections
- **Policy Compliance Checking** - Enforce security and location policies
- **Assignment Workflow** - Assign and release workstations with proper validation
- **Reporting** - Utilization, location distribution, and assignment reports with CSV export

## Data Integration

The application integrates with the following systems via the BUCK API:

- **Okta**: User details (department, location, status, role, clearance)
- **Active Directory**: OU membership for policy application
- **Lansweeper/JAMF**: Workstation hardware/software specs
- **Parsec**: Real-time connection + current user info
- **Deltek**: Freelance assignment and project dates

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Project Structure

```
app/
├── components/       # UI components
│   ├── ui/           # Base UI components (shadcn)
│   ├── users/        # User-related components
│   ├── workstations/ # Workstation-related components
│   └── assignment/   # Assignment workflow components
├── lib/             
│   ├── api/          # API client and service modules
│   ├── hooks/        # Custom React hooks
│   ├── store/        # Zustand state management
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── api/              # API routes (Next.js)
└── reports/          # Reports and analytics page
```

## Development

During development, the application uses mock data and API handlers to simulate the real BUCK API. This allows for rapid development and testing without connecting to the actual backend services.

## Deployment

The application is designed to be deployed on Vercel and connect to the production BUCK API for live data.

## License

This project is proprietary and confidential.