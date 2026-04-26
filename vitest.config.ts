import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['html'],
      reportsDirectory: './coverage',
      exclude: ['node_modules/', '**/*.spec.ts'],
    },
  },
});
