import { build } from 'esbuild'
// Bundle the current sanitizer and its ESM parser together. Vercel's runtime
// require hook cannot load htmlparser2 v12 from sanitize-html's CommonJS entry.
// Keep the latest security fixes instead of downgrading the HTML parser.
await build({
  stdin:{contents:"import sanitize from 'sanitize-html'; export default sanitize",resolveDir:process.cwd(),sourcefile:'blog-sanitizer-entry.js'},
  bundle:true,platform:'node',format:'esm',target:'node24',
  outfile:'server/sanitizer.generated.mjs',
  banner:{js:"import { createRequire as createNodeRequire } from 'node:module'; const require = createNodeRequire(import.meta.url);"},
  legalComments:'inline'
})
console.log('Blog sanitizer bundled for the Vercel Node runtime.')
