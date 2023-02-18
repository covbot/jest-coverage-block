import { createEntrypoint } from '@covbot/vite-plugin-github-block/client';

export default createEntrypoint(import.meta.glob(['./src/blocks/*.tsx', './src/blocks/*/index.tsx']));
