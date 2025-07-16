# Project Structure

## Monorepo Organization
```
├── apps/                    # Application packages
│   ├── client/             # Solid.js chat client
│   └── web/                # Next.js chat client
├── packages/               # Shared packages
│   └── revolt.js/          # Revolt API library (git submodule)
└── [config files]          # Root configuration
```

## Application Structure

### Client App (`apps/client/`)
- **Framework**: SolidStart with Vinxi bundler
- **Routing**: File-based routing in `src/routes/`
- **Components**: Shared UI components in `src/components/ui/`
- **Styling**: Tailwind CSS with custom utilities in `src/lib/styling.ts`

### Web App (`apps/web/`)
- **Framework**: Next.js 15 with App Router
- **Structure**: 
  - `src/app/` - App Router pages and layouts
  - `src/components/` - Reusable components including comprehensive UI library
  - `src/lib/` - Utility functions and configurations
  - `src/hooks/` - Custom React hooks

## Shared Package Structure

### revolt.js (`packages/revolt.js/`)
- **Purpose**: TypeScript library for Revolt API interactions
- **Build**: Compiles TypeScript to `lib/` directory
- **Structure**:
  - `src/classes/` - API entity classes (User, Message, Server, etc.)
  - `src/collections/` - Data collection management
  - `src/events/` - WebSocket event handling
  - `src/hydration/` - Data hydration utilities

## Component Organization

### UI Components
- Both apps maintain `components/ui/` directories
- Client uses Ark UI primitives for Solid.js
- Web uses Radix UI primitives with shadcn/ui patterns
- Components follow consistent naming: PascalCase files (e.g., `Button.tsx`)

### Routing Conventions
- **Client**: File-based routing in `src/routes/`
- **Web**: App Router in `src/app/` with nested layouts

## Configuration Files
- **Root**: Turborepo, pnpm workspace, and shared TypeScript config
- **App-level**: Individual package.json, biome.json, and framework configs
- **Biome**: Consistent linting/formatting rules across apps
- **Tailwind**: v4 configuration in each app