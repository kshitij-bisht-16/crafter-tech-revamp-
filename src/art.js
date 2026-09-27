import {readFileSync} from 'node:fs';
// The hero sculpture uses the exact outlines of the supplied Craftertech mark.
const logoPaths=[...readFileSync(new URL('../public/assets/craftertech-black.svg',import.meta.url),'utf8').matchAll(/<path d="([^"]+)"/g)].map(match=>match[1]);
export function sculpture(){
 const outlines=logoPaths.map(d=>`<path d="${d}"/>`).join('');
 const layers=Array.from({length:36},(_,i)=>{
  const depth=35-i;
  return `<use href="#craftertech-sculpture-face" transform="translate(${-depth*1.25} ${depth*1.55})" stroke="${i<18?'#7da6df':'#3A83F7'}" stroke-width="1.15" opacity="${(.28+i*.014).toFixed(2)}"/>`;
 }).join('');
 const hatching=Array.from({length:70},(_,i)=>`<path d="M-80 ${i*10} 620 ${i*10-150}"/>`).join('');
 return `<svg viewBox="0 0 600 570" fill="none" aria-hidden="true" class="sculpture"><defs><g id="craftertech-sculpture-face">${outlines}</g><clipPath id="craftertech-sculpture-clip">${outlines}</clipPath></defs><g stroke="#9fbee9" stroke-width=".6" opacity=".5"><path d="M38 355 320 515 579 365M78 385V174M534 390V180M300 515V55"/><path d="m38 180 282 160 259-160M38 435 282-160 259 160" stroke-dasharray="3 6"/></g><ellipse class="logo-shadow" cx="300" cy="457" rx="180" ry="31" fill="#1d559e" opacity=".045"/><g class="logo-float"><g transform="translate(134 72) rotate(-8 175 175) scale(.65)">${layers}<use href="#craftertech-sculpture-face" fill="#e4efff" fill-opacity=".88" stroke="#3A83F7" stroke-width="2"/><g class="logo-hatching" clip-path="url(#craftertech-sculpture-clip)" stroke="#3A83F7" stroke-width=".95" opacity=".78">${hatching}</g></g></g><g fill="#2463bf"><circle cx="78" cy="385" r="3"/><circle cx="534" cy="390" r="3"/><circle cx="300" cy="55" r="3"/></g></svg>`;
}
export function network(i=0) {
  let grid='';
  for(let j=0;j<9;j++) {const y=36+j*21;grid+=`<path d="M25 ${y}H455" stroke="currentColor" opacity=".08"/>`;}
  const shapes=[
    '<path d="M85 55 235 35 393 85 353 190 160 208 85 55M85 55 353 190M235 35 160 208M393 85 160 208M85 55 393 85M235 35 353 190"/><circle cx="235" cy="113" r="42"/><path d="M235 35v36m-108 13 70 24m80 5 90-16m-168 83 18-31m78 22-30-32"/>',
    '<rect x="66" y="42" width="155" height="114" rx="5"/><rect x="194" y="91" width="177" height="112" rx="5"/><path d="M66 66h155M194 117h177M221 91h47V66h48M113 156v29h81"/><path d="m239 147-16 15 16 15m86-30 16 15-16 15m-48 9 13-48"/>',
    '<path d="m240 25 154 60-154 60L86 85 240 25Zm-154 94 154 60 154-60M86 153l154 60 154-60M86 85v68m154-8v68m154-128v68"/><path d="m86 119 154-60 154 60" opacity=".4"/>',
    '<path d="M65 191V45m0 146h345M98 162l60-40 45 21 67-64 46 18 67-57"/><circle cx="158" cy="122" r="7"/><circle cx="270" cy="79" r="7"/><circle cx="383" cy="40" r="7"/>',
    '<circle cx="235" cy="120" r="77"/><circle cx="235" cy="120" r="61" opacity=".4"/><path d="m202 118 23 23 45-48M68 120h89m155 0h99M235 16v27m0 154v27"/><rect x="45" y="105" width="29" height="29"/><rect x="401" y="105" width="29" height="29"/>',
    '<path d="M237 24 330 60v64c0 49-56 77-93 96-37-19-93-47-93-96V60l93-36Z"/><path d="m237 43 75 29v51c0 34-39 59-75 78-36-19-75-44-75-78V72l75-29Z" opacity=".4"/><rect x="207" y="105" width="60" height="49" rx="3"/><path d="M219 105V91a18 18 0 0 1 36 0v14m-18 18v15"/>'
  ];
  return `<svg viewBox="0 0 480 240" fill="none" aria-hidden="true">${grid}<g stroke="currentColor" stroke-width="1.4">${shapes[i%6]}</g></svg>`;
}
export function industryArt(i) {
  let lines='';
  for(let j=0;j<23;j++) {const r=26+j*6; lines+=`<rect x="${200-r}" y="${200-r}" width="${r*2}" height="${r*2}" rx="${i%2?12:r}" transform="rotate(${j*(i%2?2:0)} 200 200)"/>`;}
  return `<svg viewBox="0 0 400 400" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width=".8" opacity=".45">${lines}</g><path d="M200 50v300M50 200h300" stroke="currentColor" stroke-dasharray="2 6"/><circle cx="200" cy="200" r="5" fill="currentColor"/></svg>`;
}
