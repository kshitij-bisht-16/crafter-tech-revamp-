import {layers} from './content.js';
// Sample the four polygons from the supplied Craftertech mark on a regular grid.
const logoPolygons=[
 [[545.5,0],[545.5,182],[364.5,181],[182,0]],
 [[181.5,0],[181.5,362.5],[0,362.5],[0,181]],
 [[182,362],[361,542.5],[182,542.5],[0.5,362]],
 [[364,362.5],[545.5,544.5],[545.5,362.5],[364,182]],
];
function insidePolygon(x,y,polygon){
 let inside=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const [xi,yi]=polygon[i], [xj,yj]=polygon[j];
  if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
 }
 return inside;
}
function dotField(){
 let points='';
 for(let y=11;y<545;y+=22){
  for(let x=11;x<546;x+=22){
   const part=logoPolygons.findIndex(polygon=>insidePolygon(x,y,polygon));
   if(part<0)continue;
   points+=`<circle cx="${(60+x*480/546).toFixed(2)}" cy="${(60+y*480/545).toFixed(2)}" r="${part===0?5.8:2.7}" data-logo-part="${part}" style="--dot-delay:${(-(x+y)/1091*4).toFixed(2)}s" class="${part===0?'is-emphasized':''}"/>`;
  }
 }
 return `<svg class="intelligence-dots" viewBox="0 0 600 600" aria-hidden="true"><g>${points}</g></svg>`;
}
export function intelligenceSection(){return `<section id="ai-engineering" class="intelligence-section" aria-labelledby="intelligence-heading"><h2 id="intelligence-heading" class="sr-only">Intelligence is powerful. Connected intelligence, more so.</h2><div class="intelligence-stage" data-tabs="intelligence" data-active-index="0"><span class="intelligence-corner corner-start" aria-hidden="true">C</span><span class="intelligence-corner corner-end" aria-hidden="true">T</span><p class="intelligence-endpoint endpoint-start">From enterprise knowledge</p><div class="intelligence-layout"><div class="intelligence-visual">${dotField()}</div><div class="intelligence-copy">${layers.map((layer,i)=>`<div role="region" id="intelligence-panel-${i}" aria-labelledby="intelligence-title-${i}" tabindex="0" ${i?'hidden':''}><h2 class="intelligence-stage-title" id="intelligence-title-${i}">${layer.name}</h2><h3>${layer.title}</h3><p>${layer.text}</p></div>`).join('')}</div><div class="intelligence-nav" hidden role="tablist" aria-label="Connected intelligence" aria-orientation="vertical">${layers.map((layer,i)=>`<button role="tab" id="intelligence-tab-${i}" aria-controls="intelligence-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}"><span class="stage-dot" aria-hidden="true"></span>${layer.name}</button>`).join('')}</div></div><p class="intelligence-endpoint endpoint-end">To business impact</p><p class="intelligence-scroll-hint">Scroll to explore · 01 / 05</p></div></section>`}
