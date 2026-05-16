import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoName = process.env.VITE_REPO_NAME || 'PFA-4eme';
const onGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: onGitHubPages ? `/${repoName}/` : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@datasets': path.resolve(__dirname, '../datasets'),
    },
  },
  server: {
    host: true,
    port: 5173,
    fs: { allow: ['..'] },
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
