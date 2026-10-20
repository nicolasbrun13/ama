import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
  test: {
    environment: 'node',
    testTimeout: 30_000, // premier import de next/server lent à froid
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**'],
  },
});
