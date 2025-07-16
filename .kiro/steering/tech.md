# Technology Stack

## Build System & Package Management
- **Monorepo**: Turborepo for build orchestration and caching
- **Package Manager**: pnpm with workspaces
- **Node.js**: >= 18 (client app requires >= 22)

## Frontend Frameworks
- **Client App**: Solid.js with SolidStart and Vinxi
- **Web App**: Next.js 15 with React 19 and Turbopack

## Styling & UI
- **CSS Framework**: Tailwind CSS v4
- **UI Components**: 
  - Client: Ark UI for Solid
  - Web: Radix UI primitives with shadcn/ui patterns
- **Icons**: Iconify, Lucide React
- **Animations**: Motion (Framer Motion successor)

## Development Tools
- **Code Quality**: Biome for linting and formatting
- **TypeScript**: v5.8+ across all packages
- **Prettier**: For additional formatting (root level)

## Shared Libraries
- **revolt.js**: Custom TypeScript library for Revolt API interactions
- **Markdown**: React Markdown with rehype/remark plugins for rich text
- **Math**: KaTeX for mathematical expressions

## Common Commands

### Development
```bash
pnpm dev              # Start all apps in development
pnpm build            # Build all apps and packages
pnpm lint             # Run linting across workspace
pnpm check-types      # TypeScript type checking
```

### Code Quality
```bash
pnpm biome:check      # Run Biome checks with auto-fix
pnpm biome:format     # Format code with Biome
pnpm format           # Format with Prettier
```

### Package-Specific
```bash
pnpm web:add <pkg>           # Add dependency to web app
pnpm revolt.js:build         # Build revolt.js package
```