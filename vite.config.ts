import githubBlocks from '@covbot/vite-plugin-github-block';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		react(),
		githubBlocks({
			previewUrl: 'https://blocks.githubnext.com/covbot/jest-coverage-block/blob/main/README.md',
		}),
	],
});
