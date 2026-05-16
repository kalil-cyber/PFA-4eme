import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.VITE_REPO_NAME || 'PFA-4eme';
const onGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: onGitHubPages ? `/${repoName}/` : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
