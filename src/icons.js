import {readFileSync} from 'node:fs';
const names=['arrow_forward','north_east','arrow_downward','arrow_upward','expand_more','add','menu','close'];
const symbols=new Map(names.map(name=>[name,readFileSync(new URL(`../public/assets/icons/${name}.svg`,import.meta.url),'utf8')]));
// Official Google Material Symbols Outlined, Apache 2.0. Decorative icons
// inherit currentColor; the containing control supplies its accessible name.
export function icon(name,extra=''){
 if(!symbols.has(name))throw new Error(`Unknown Material Symbol: ${name}`);
 return symbols.get(name).replace('<svg ',`<svg class="material-icon ${extra}" aria-hidden="true" focusable="false" fill="currentColor" `);
}
