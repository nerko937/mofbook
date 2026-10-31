import { renderRouter, type RenderRouterOptions } from 'expo-router/testing-library';
import { userEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import type { ComponentType } from 'react';

export function TestRootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="todos/[id]" />
    </Stack>
  );
}

type RenderAppOptions = Omit<RenderRouterOptions, 'initialUrl'> & {
  routeOverrides?: Record<string, ComponentType>;
};

export async function renderApp(
  initialUrl = '/',
  { routeOverrides, ...options }: RenderAppOptions = {},
) {
  return renderRouter(
    {
      appDir: './src/app',
      overrides: {
        _layout: TestRootLayout,
        ...routeOverrides,
      },
    },
    { initialUrl, ...options },
  );
}

export function setupUser() {
  return userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
}
