// Pixel-edged, two-tone heading wipes. The original text stays in the DOM.
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const headings=[...document.querySelectorAll('main h1, main section h2')]
 .filter(heading=>!heading.closest('dialog, .sr-only, [aria-hidden="true"]'));

if('IntersectionObserver' in window&&HTMLCanvasElement.prototype.getContext){
 const states=new Map();
 const ease=value=>{const x=Math.max(0,Math.min(1,value));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};
 const finish=state=>{
  cancelAnimationFrame(state.frame);state.frame=0;
  state.heading.classList.remove('heading-reveal-pending');
  state.canvas.hidden=true;
 };
 const play=state=>{
  if(motion.matches){finish(state);return;}
  cancelAnimationFrame(state.frame);
  const bounds=state.heading.getBoundingClientRect();
  const range=document.createRange();range.selectNodeContents(state.text);
  const textBounds=range.getBoundingClientRect();
  const width=Math.min(bounds.width,Math.max(1,textBounds.right-bounds.left));
  const height=bounds.height;
  if(!width||!height){finish(state);return;}
  const dpr=Math.min(devicePixelRatio||1,2),ctx=state.context;
  state.canvas.width=Math.ceil(width*dpr);state.canvas.height=Math.ceil(height*dpr);
  state.canvas.style.width=`${width}px`;state.canvas.style.height=`${height}px`;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  state.canvas.hidden=false;
  state.heading.classList.add('heading-reveal-pending');
  const style=getComputedStyle(state.heading);
  const accent=style.getPropertyValue('--primary').trim()||'#3A83F7';
  const ink=style.color,cell=6,fringe=Math.min(45,width*.14);
  // A solid core with a deterministic, shimmering square edge.
  const block=(left,color,seed,elapsed)=>{
   const right=left+width;
   ctx.fillStyle=color;
   const start=Math.max(0,left+fringe),end=Math.min(width,right-fringe);
   if(end>start)ctx.fillRect(start,0,end-start,height);
   for(const [edge,direction] of [[left,1],[right,-1]]){
    const first=Math.max(0,Math.floor((edge-fringe)/cell));
    const last=Math.min(Math.ceil(width/cell),Math.ceil((edge+fringe)/cell));
    for(let x=first;x<last;x++)for(let y=0;y<height/cell;y++){
     const coverage=.5+direction*(x*cell+cell/2-edge)/(fringe*2);
     const noise=(Math.sin(x*127.1+y*311.7+seed+Math.floor(elapsed/65)*.7)*43758.5453)%1;
     if(coverage>Math.abs(noise))ctx.fillRect(x*cell,y*cell,cell+.5,cell+.5);
    }
   }
  };
  const start=performance.now();
  const tick=now=>{
   const elapsed=now-start;
   ctx.clearRect(0,0,width,height);
   if(elapsed>=700)state.heading.classList.remove('heading-reveal-pending');
   const blue=(ease(elapsed/530)-1+ease((elapsed-780)/530))*width;
   const text=(ease((elapsed-100)/530)-1+ease((elapsed-680)/530))*width;
   block(blue,accent,3,elapsed);block(text,ink,19,elapsed);
   if(elapsed<1400)state.frame=requestAnimationFrame(tick);
   else finish(state);
  };
  state.frame=requestAnimationFrame(tick);
 };
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   const state=states.get(entry.target);
   if(entry.isIntersecting&&entry.intersectionRatio>=.2&&!state.entered){
    state.entered=true;play(state);
   }else if(!entry.isIntersecting){
    state.entered=false;finish(state);
    if(!motion.matches)state.heading.classList.add('heading-reveal-pending');
   }
  });
 },{threshold:[0,.2],rootMargin:'0px 0px -6% 0px'});
 headings.forEach(heading=>{
  const canvas=document.createElement('canvas');
  const context=canvas.getContext('2d');
  if(!context)return;
  const text=document.createElement('span');text.className='heading-reveal-text';
  text.append(...heading.childNodes);heading.append(text,canvas);
  canvas.className='heading-reveal-canvas';canvas.setAttribute('aria-hidden','true');canvas.hidden=true;
  heading.classList.add('heading-reveal');
  if(!motion.matches)heading.classList.add('heading-reveal-pending');
  states.set(heading,{heading,text,canvas,context,frame:0,entered:false});observer.observe(heading);
 });
 motion.addEventListener('change',()=>{
  states.forEach(state=>{finish(state);if(!motion.matches&&!state.entered)state.heading.classList.add('heading-reveal-pending');});
 });
 // A resize must never leave text partially covered, particularly on rotation.
 window.addEventListener('resize',()=>states.forEach(finish),{passive:true});
 window.addEventListener('beforeprint',()=>states.forEach(finish));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)states.forEach(finish);});
}
