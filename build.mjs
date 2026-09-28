import { mkdir, writeFile, copyFile, cp } from 'node:fs/promises';
import { render } from './src/render.js';
import { pages } from './src/pages.js';
const allPages=new Map([['/',render()],...pages()]);
await mkdir('dist', {recursive:true});
await cp('public', 'dist', {recursive:true});
for(const asset of ['styles.css','typography.css','pages.css','intelligence.css','domain.css','outcomes.css','outcome-motion.js','outcome-logo.js','heading-reveal.js','client.js'])await copyFile(`src/${asset}`,`dist/${asset}`);
await mkdir('dist/vendor', {recursive:true});
await copyFile('node_modules/lenis/dist/lenis.mjs','dist/vendor/lenis.js');
await copyFile('node_modules/lenis/dist/lenis.css','dist/vendor/lenis.css');
await copyFile('node_modules/lenis/LICENSE','dist/vendor/LENIS-LICENSE.txt');
const pageIds=new Map();
for(const [route,html] of allPages){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)throw new Error(`Duplicate IDs in ${route}`);
 if(/seasiainfotech\.com/i.test(html))throw new Error(`External source redirect in ${route}`);
 pageIds.set(route,new Set(ids));
 await writeFile('dist/'+(route==='/'?'index.html':route.slice(1)),html);
}
let links=0;
for(const [route,html] of allPages){
 for(const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
  const url=new URL(match[1],'https://craftertech.local'+route);
  if(url.origin!=='https://craftertech.local')throw new Error(`Unexpected outbound link: ${url}`);
  if(!allPages.has(url.pathname))throw new Error(`Missing page from ${route}: ${url.pathname}`);
  if(url.hash&&!pageIds.get(url.pathname).has(url.hash.slice(1)))throw new Error(`Missing anchor from ${route}: ${url}`);
  links++;
 }
}
console.log(`Built ${allPages.size} pages. Validated ${links} internal links and all page anchors.`);
