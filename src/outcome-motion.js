import {logoMesh,projectLogoPath} from './outcome-logo.js';
// The supplied Craftertech logo, extruded in SVG with upright travelling labels.
const section=document.querySelector('.outcome-orbit');
if(section){
 const art=section.querySelector('.outcome-orbit-art');
 const svg=section.querySelector('.outcome-orbit-rings');
 const chips=[...section.querySelectorAll('.outcome-orbit-chip')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let visible=false,frame=0,last=0,time=0;
 const labels=chips.map(chip=>({chip,span:chip.querySelector('span'),dot:chip.querySelector('i'),collapsed:38,full:260}));
 const measure=()=>{
  labels.forEach(label=>{
   const style=getComputedStyle(label.chip);
   label.collapsed=parseFloat(style.paddingLeft)*2+label.dot.offsetWidth+2;
   label.full=Math.min(310,label.collapsed+label.span.scrollWidth+parseFloat(style.columnGap));
  });
 };
 const paths=[...svg.querySelectorAll('path')];
 const clamp=x=>Math.max(0,Math.min(1,x));
 const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
 const draw=()=>{
  paths.forEach((path,i)=>path.setAttribute('d',projectLogoPath(logoMesh[i],time)));
  labels.forEach(({chip,span,collapsed,full},i)=>{
   const cycle=(time+i*1.85)%15;
   // Static, fully expanded labels remain available with reduced motion.
   const still=reduced.matches;
   const appear=still?1:ease(cycle/.5)*(1-ease((cycle-6.6)/.5));
   const expand=still?1:ease((cycle-.4)/.7)*(1-ease((cycle-5.8)/.7));
   const travel=still?.45:ease((cycle-1.1)/4.4);
   const angle=(i*2.4)+time*.07+(travel-.5)*1.6;
   const x=450+Math.cos(angle)*225,y=450+Math.sin(angle)*185;
   chip.style.left=`${x/9}%`;chip.style.top=`${y/9}%`;
   chip.style.width=`${collapsed+(full-collapsed)*expand}px`;
   chip.style.opacity=appear;
   chip.style.transform=`translate(-${collapsed/2}px,-50%) scale(${.7+.3*appear})`;
   span.style.opacity=expand;
   span.style.transform=`translateY(${(1-expand)*14}px)`;
  });
 };
 const tick=now=>{
  if(last)time+=Math.min((now-last)/1000,.05);
  last=now;draw();frame=requestAnimationFrame(tick);
 };
 const sync=()=>{
  cancelAnimationFrame(frame);last=0;
  if(visible&&!reduced.matches&&!document.hidden)frame=requestAnimationFrame(tick);
 };
 reduced.addEventListener('change',()=>{draw();sync();});
 document.addEventListener('visibilitychange',sync);
 new ResizeObserver(()=>{measure();draw();}).observe(art);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(section);
 measure();draw();sync();
}
