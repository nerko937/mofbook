# AGENTS.md

Compact guidance for AI agents working on this Expo (React Native) project.

## Package manager

**Use pnpm, not npm.** The repo has `pnpm-lock.yaml` and `pnpm-workspace.yaml`.

```bash
pnpm install
pnpm start           # Expo dev server
pnpm android
pnpm ios
pnpm web
```

## Commands

```bash
pnpm lint            # ESLint (note: no "run")
pnpm lint:fix
pnpm ts-check        # TypeScript (not "typecheck")
pnpm test
pnpm prettier:check
pnpm prettier:fix
```

### Single test

```bash
pnpm test -- __tests__/home-test.tsx
pnpm test -- --testNamePattern="pattern"
pnpm test -- --watch
```

## Formatting

**Both Prettier and ESLint are active.** Run both tools.

- **Indentation**: 4 spaces (`.prettierrc` has `tabWidth: 4`)
- **Quotes**: Double quotes (`.prettierrc` has `singleQuote: false`)
- **No trailing commas** (`trailingComma: "none"`)

## TypeScript

- Strict mode enabled
- Path alias: `@/*` resolves to project root (so `@/src/app/index.tsx` works)

## File structure

```
src/
├── app/         # Expo Router - files here become routes
├── components/
├── navigation/  # Navigation screens (actual UI, not routes)
├── i18n.js      # i18next config (must import for tests)
└── theme.ts

__tests__/       # Jest tests at root
```

**Routing quirk**: `src/app/index.tsx` imports `src/navigation/home.tsx` (the real screen). Tests import from `src/navigation/`, not `src/app/`.

## i18n

Project uses `i18next` + `react-i18next`. Tests must import `../src/i18n` or translations fail.

## Testing

- Jest with `jest-expo` preset
- `@testing-library/react-native`
- Test files: `__tests__/{name}-test.tsx`
- SafeAreaProvider wrapper required for screens (see `home-test.tsx`)
