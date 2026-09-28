import {outcomes} from './content.js';
import {icon} from './icons.js';
import {logoMesh,projectLogoPath} from './outcome-logo.js';

export function outcomesSection(){
 const chips=outcomes.flatMap(o=>[`${o.metric}% ${o.label}`,o.tech]);
 return `<section id="outcomes" class="outcome-orbit" aria-labelledby="outcome-heading">
 <div class="outcome-orbit-art" aria-hidden="true">
  <svg class="outcome-orbit-rings" viewBox="0 0 900 900" fill="none">${logoMesh.map(shape=>`<path d="${projectLogoPath(shape)}"${shape.face?' class="outcome-logo-face"':''}/>`).join('')}</svg>
  <div class="outcome-orbit-chips">${chips.map((text,i)=>`<div class="outcome-orbit-chip" style="--chip-x:${20+i%3*22}%;--chip-y:${25+Math.floor(i/3)*20}%"><i></i><span>${text}</span></div>`).join('')}</div>
 </div>
 <div class="wrap outcome-orbit-content">
  <div class="section-label"><span class="tiny-mark" aria-hidden="true"></span><span>REFERENCE OUTCOMES</span></div>
  <h2 id="outcome-heading">The impact is what matters.</h2>
  <div class="outcome-orbit-copy">
   <div><h3>Engineering that moves business forward.</h3><p>Connect AI to the work that makes a difference. From helping customers complete a purchase to accelerating data and claims processing, these published examples show what focused engineering can make possible.</p></div>
   <div><h3>Progress you can measure.</h3><p>Start with the outcome, then connect the right software, data and intelligence. Use clear measures to evaluate what improves, learn from the results and decide what to build next.</p></div>
   <p class="outcome-orbit-note">Third-party reference outcomes, not Craftertech project claims.</p>
  </div>
  <button class="outcome-orbit-metrics" type="button" aria-haspopup="dialog" aria-controls="outcome-metrics-dialog">View reference metrics <span>${icon('arrow_forward')}</span></button>
 </div>
 <dialog id="outcome-metrics-dialog" class="outcome-metrics-dialog" aria-labelledby="outcome-metrics-title" aria-describedby="outcome-metrics-note" data-lenis-prevent>
  <div class="outcome-metrics-header"><div><span class="eyebrow">REFERENCE OUTCOMES</span><h2 id="outcome-metrics-title">The impact in numbers.</h2></div><button class="outcome-metrics-close" type="button" aria-label="Close reference metrics" autofocus>${icon('close')}</button></div>
  <p id="outcome-metrics-note">Third-party reference outcomes, not Craftertech project claims.</p>
  <div class="outcome-orbit-metric-grid">${outcomes.map(o=>`<article><span class="eyebrow">${o.sector}</span><strong>${o.metric}<small>%</small></strong><h3>${o.label}</h3><p>${o.text}</p><span class="outcome-orbit-tech">${o.tech}</span></article>`).join('')}</div>
 </dialog>
 </section>`;
}
