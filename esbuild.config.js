const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['server/netlify.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/server/netlify.js',
  alias: {
    '@shared': './shared'
  },
  // Mark these as external to avoid the bundling issue with Irys SDK.
  // Netlify will provide these at runtime from your package.json dependencies.
  external: ['csv-parse', 'csv-stringify'],
}).catch(() => process.exit(1)); 