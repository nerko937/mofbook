# AGENTS.md - Coding Guidelines for mofbook

This document provides essential information for AI coding agents working on this project.

## Project Overview

- **Framework**: Expo (React Native) v54 with TypeScript 5.9
- **Platform Support**: iOS, Android, and Web
- **Routing**: Expo Router v6 (file-based routing)
- **UI**: React 19.1.0 / React Native 0.81.5
- **Package Manager**: npm
- **New Features**: React Compiler (experimental), New RN Architecture

---

## Build, Lint, and Test Commands

### Development
```bash
npm start                # Start Expo dev server
npm run android          # Run on Android emulator
npm run ios              # Run on iOS simulator
npm run web              # Run in web browser
```

### Quality Checks
```bash
npm run lint             # Run ESLint (expo lint)
npm run typecheck        # Run TypeScript type checking
npm test                 # Run all Jest tests
```

### Running a Single Test
```bash
npm test -- __tests__/home-test.tsx                      # Specific file
npm test -- --testNamePattern="shows a welcome message"  # Pattern match
npm test -- --watch                                      # Watch mode
npm test -- --coverage                                   # With coverage
```

### Other Commands
```bash
npm run reset-project    # Reset to blank app structure
```

---

## Code Style Guidelines

### Imports
- **Order**: External libraries first, then internal modules
- **Quotes**: Double quotes for React Native imports, single quotes preferred for others
- **Path Aliases**: Use `@/*` to reference from root (configured in tsconfig.json)
- **Semicolons**: Always use semicolons (ESLint enforced with `semi: always`)

### Formatting
- **Line Length**: Maximum 88 characters (ESLint enforced)
- **Indentation**: 2 spaces (not tabs)
- **Object Spacing**: Always use spacing inside curly braces: `{ foo }` not `{foo}`
- **JSX Spacing**: 
  - Space before self-closing tags: `<Component />` not `<Component/>`
  - Curly spacing: `{ props.content }` not `{props.content}`
  - No multi-spaces in props

### TypeScript
- **Strict Mode**: Enabled - all strict checks are enforced
- **Types**: Use explicit types for props, avoid `any`
- **Interfaces vs Types**: Use `type` for component props (observed pattern)
- **Exports**: Use default exports for components

### Naming Conventions
- **Components**: PascalCase (e.g., `Home`, `Todo`)
- **Files**: 
  - Components: `todo.tsx` or `Todo.tsx`
  - Tests: `home-test.tsx` (lowercase with hyphens)
- **Props Types**: `{ComponentName}Props` (e.g., `TodoProps`)
- **Functions**: camelCase
- **Constants**: camelCase for local, UPPER_SNAKE_CASE for global

### File Structure
```
src/
├── app/              # Expo Router pages (file-based routing)
│   ├── _layout.tsx   # Root layout with navigation
│   └── index.tsx     # Home screen
├── components/       # Reusable UI components
└── navigation/       # Navigation-related components/screens

__tests__/            # Jest tests (mirror src structure)
```

### Component Patterns
- **Functional Components**: Use arrow functions
- **Default Exports**: All components use default exports
- **Props**: Destructure when helpful, use `props.x` when clearer

### Error Handling
- Use TypeScript's strict mode to catch errors at compile time
- Add proper error boundaries for React components when needed
- Handle async operations with try-catch blocks

---

## Testing Guidelines

- **Framework**: Jest with `jest-expo` preset
- **Testing Library**: `@testing-library/react-native`
- **Test Location**: `__tests__/` directory at root
- **Test Files**: `{component-name}-test.tsx`
- **Pattern**: Use `describe()` and `it()` blocks, import from `src/` with relative paths

---

## VSCode Integration

The project includes VSCode settings that:
- Auto-fix ESLint errors on save
- Organize imports on save
- Sort members on save

These settings are in `.vscode/settings.json` and should be respected.

---

## Important Notes for Agents

1. **No Prettier**: This project uses `@stylistic/eslint-plugin` for formatting, not Prettier
2. **Expo Router**: File-based routing - files in `src/app/` become routes automatically
3. **React 19**: Be aware of React 19 features and breaking changes
4. **New Architecture**: React Native's New Architecture is enabled
5. **Typed Routes**: Expo Router's typed routes are enabled for type-safe navigation
6. **Path Alias**: `@/*` resolves to project root, so `@/src/components/todo` works

---

## Common Patterns

### Creating a New Screen
1. Add file to `src/app/` (e.g., `src/app/about.tsx`)
2. Export default functional component
3. Navigation handled automatically by Expo Router

### Creating a Component
1. Add file to `src/components/` (e.g., `todo.tsx`)
2. Define props type as `{Name}Props`
3. Use functional component with arrow function
4. Export as default

### Adding Tests
1. Create `__tests__/{name}-test.tsx`
2. Import from `src/` using relative paths
3. Use `@testing-library/react-native` utilities
4. Follow describe/it pattern
