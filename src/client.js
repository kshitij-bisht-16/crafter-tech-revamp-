// Small, independent enhancements. The complete content is pre-rendered in HTML.
import './outcome-motion.js';
import './heading-reveal.js';

// Self-hosted Lenis; touch keeps native inertia and reduced motion is honored live.
import Lenis from './vendor/lenis.js';
const lenis = new Lenis({autoRaf:true, lerp:0.09, smoothWheel:true, syncTouch:false, respectReducedMotion:true});

// Native modal keeps keyboard focus inside and restores it on dismissal.
const metricsDialog=document.querySelector('#outcome-metrics-dialog');
if(metricsDialog){
 const trigger=document.querySelector('.outcome-orbit-metrics');
 let resumeScroll=false;
 trigger.addEventListener('click',()=>{
  resumeScroll=!lenis.isStopped;
  lenis.stop();
  metricsDialog.showModal();
 });
 metricsDialog.querySelector('.outcome-metrics-close').addEventListener('click',()=>metricsDialog.close());
 metricsDialog.addEventListener('click',event=>{
  if(event.target!==metricsDialog)return;
  const bounds=metricsDialog.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)metricsDialog.close();
 });
 metricsDialog.addEventListener('close',()=>{
  if(resumeScroll)lenis.start();
  trigger.focus({preventScroll:true});
 });
}

// Keep URL history and keyboard focus while Lenis handles in-page navigation.
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const hash=link.getAttribute('href');
  const target=document.getElementById(hash.slice(1));
  if(!target)return;
  event.preventDefault();
  lenis.resize();
  if(location.hash!==hash)history.pushState(null,'',hash);
  lenis.scrollTo(target,{onComplete:()=>{
    if(link.classList.contains('skip-link'))target.focus({preventScroll:true});
  }});
});

document.querySelectorAll('[data-tabs]').forEach(group => {
  if(group.dataset.tabs==='process')return;
  const tablist=group.querySelector('[role="tablist"]');
  const tabs=[...tablist.querySelectorAll('[role="tab"]')];
  const activate=(tab, focus=false, automatic=false)=>{
    tabs.forEach(t=>{
      const selected=t===tab;
      t.setAttribute('aria-selected',String(selected));
      t.tabIndex=selected?0:-1;
      document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;
    });
    if(focus) tab.focus();
    group.dispatchEvent(new CustomEvent('tabchange',{detail:{index:tabs.indexOf(tab),automatic}}));
  };
  group.addEventListener('select-tab',event=>{const tab=tabs[event.detail.index];if(tab)activate(tab,false,true);});
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab));
    tab.addEventListener('keydown',event=>{
      const vertical=tablist.getAttribute('aria-orientation')==='vertical';
      const next=vertical?'ArrowDown':'ArrowRight', prev=vertical?'ArrowUp':'ArrowLeft';
      let target;
      if(event.key===next)target=(index+1)%tabs.length;
      else if(event.key===prev)target=(index-1+tabs.length)%tabs.length;
      else if(event.key==='Home')target=0;
      else if(event.key==='End')target=tabs.length-1;
      if(target!==undefined){event.preventDefault();activate(tabs[target],true);}
    });
  });
});

// Reuse the same process panels: desktop tabs, mobile inline accordion.
const processGroup=document.querySelector('[data-tabs="process"]');
if(processGroup){
 const mobileProcess=matchMedia('(max-width:700px)');
 const nav=processGroup.querySelector('.process-depth-nav');
 const panelHost=processGroup.querySelector('.process-depth-panels');
 const buttons=[...nav.querySelectorAll('button')];
 const panels=buttons.map(button=>document.getElementById(button.getAttribute('aria-controls')));
 let selected=0;
 const paint=()=>{
  buttons.forEach((button,i)=>{
   const active=i===selected;
   button.tabIndex=mobileProcess.matches||active?0:-1;
   button.setAttribute(mobileProcess.matches?'aria-expanded':'aria-selected',String(active));
   panels[i].hidden=!active;
  });
  lenis.resize();
 };
 const layout=()=>{
  if(mobileProcess.matches){
   nav.removeAttribute('role');nav.removeAttribute('aria-orientation');nav.removeAttribute('aria-label');
  }else{
   nav.setAttribute('role','tablist');nav.setAttribute('aria-orientation','vertical');nav.setAttribute('aria-label','AI transformation process');
   if(selected<0)selected=0;
  }
  buttons.forEach((button,i)=>{
   button.removeAttribute(mobileProcess.matches?'aria-selected':'aria-expanded');
   if(mobileProcess.matches){
    button.removeAttribute('role');
    button.after(panels[i]);
    panels[i].setAttribute('role','region');panels[i].removeAttribute('tabindex');
   }else{
    button.setAttribute('role','tab');panelHost.append(panels[i]);
    panels[i].setAttribute('role','tabpanel');panels[i].tabIndex=0;
   }
  });
  paint();
 };
 buttons.forEach((button,i)=>{
  button.addEventListener('click',()=>{selected=mobileProcess.matches&&selected===i?-1:i;paint();});
  button.addEventListener('keydown',event=>{
   let target;
   if(event.key==='ArrowDown')target=(i+1)%buttons.length;
   else if(event.key==='ArrowUp')target=(i+buttons.length-1)%buttons.length;
   else if(event.key==='Home')target=0;
   else if(event.key==='End')target=buttons.length-1;
   if(target===undefined)return;
   event.preventDefault();
   if(!mobileProcess.matches){selected=target;paint();}
   buttons[target].focus();
  });
 });
 mobileProcess.addEventListener('change',layout);layout();
}

const menuButton=document.querySelector('.menu-toggle');
const menu=document.getElementById('mobile-menu');
const closeMenu=(returnFocus=false)=>{
  menu.hidden=true; menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');
  if(returnFocus)menuButton.focus();
};
menuButton.addEventListener('click',()=>{
  const opening=menu.hidden;
  menu.hidden=!opening;
  menuButton.setAttribute('aria-expanded',String(opening));
  menuButton.setAttribute('aria-label',opening?'Close navigation':'Open navigation');
});
menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden)closeMenu(true);});
document.addEventListener('click',event=>{if(!menu.hidden&&!event.target.closest('.site-header'))closeMenu();});
document.addEventListener('focusin',event=>{if(!menu.hidden&&!event.target.closest('.site-header'))closeMenu();});

const mobile=matchMedia('(max-width:700px)');
const stories=[...document.querySelectorAll('.cap-story')];
const capabilityLinks=[...document.querySelectorAll('.cap-index a')];
function applyResponsiveBehavior(){
  document.querySelector('.journey')?.setAttribute('aria-orientation',mobile.matches?'vertical':'horizontal');
  document.querySelector('.intelligence-nav')?.setAttribute('aria-orientation',mobile.matches?'horizontal':'vertical');
  document.querySelector('.industry-nav')?.setAttribute('aria-orientation',mobile.matches?'horizontal':'vertical');
  if(!mobile.matches)closeMenu();
}
applyResponsiveBehavior();
mobile.addEventListener('change',applyResponsiveBehavior);
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting&&!mobile.matches){
        capabilityLinks.forEach(link=>{
          if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','true');
          else link.removeAttribute('aria-current');
        });
      }
    });
  },{rootMargin:'-20% 0px -50% 0px',threshold:0});
  stories.forEach(story=>observer.observe(story));
}
// Native disclosure menus remain usable without JavaScript.
const navGroups=[...document.querySelectorAll('.nav-group')];
navGroups.forEach(group=>group.addEventListener('toggle',()=>{
  if(group.open)navGroups.forEach(other=>{if(other!==group)other.open=false;});
}));
document.addEventListener('click',event=>{if(!event.target.closest('.nav-group'))navGroups.forEach(group=>group.open=false);});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape')navGroups.forEach(group=>{if(group.open){group.open=false;group.querySelector('summary').focus();}});
});
document.addEventListener('focusin',event=>navGroups.forEach(group=>{if(group.open&&!group.contains(event.target))group.open=false;}));

const briefForm=document.getElementById('project-brief');
briefForm?.addEventListener('submit',event=>{
 event.preventDefault();
 const values=new FormData(briefForm);
 const brief=['CRAFTERTECH — PROJECT BRIEF','',...['name','email','service','goals','timeline'].map(key=>key.toUpperCase()+': '+(values.get(key)||'Not specified'))].join('\n\n');
 const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));
 const download=document.createElement('a');download.href=url;download.download='craftertech-project-brief.txt';download.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 document.getElementById('brief-status').textContent='Your brief is ready to download. No information has been sent.';
});

// Five scroll-driven stages share a sticky visual; native scrolling stays intact.
const intelligence=document.querySelector('[data-tabs="intelligence"]');
if(intelligence){
 const section=intelligence.closest('.intelligence-section');
 const tabs=[...intelligence.querySelectorAll('[role="tab"]')];
 const dots=[...intelligence.querySelectorAll('[data-logo-part]')];
 const hint=intelligence.querySelector('.intelligence-scroll-hint');
 let index=0,step=500,stickyTop=80,frame=0;
 section.classList.add('intelligence-scroll-section');
 const sync=()=>{
  frame=0;
  const start=section.getBoundingClientRect().top+scrollY-stickyTop;
  const next=Math.max(0,Math.min(tabs.length-1,Math.round((scrollY-start)/step)));
  if(next!==index)intelligence.dispatchEvent(new CustomEvent('select-tab',{detail:{index:next}}));
 };
 const requestSync=()=>{if(!frame)frame=requestAnimationFrame(sync);};
 const measure=()=>{
  const height=intelligence.offsetHeight;
  stickyTop=Math.min(innerWidth<=700?76:92,innerHeight-height);
  step=Math.max(340,innerHeight*.65);
  section.style.setProperty('--intelligence-sticky-top',stickyTop+'px');
  section.style.height=(height+step*(tabs.length-1))+'px';
  lenis.resize();requestSync();
 };
 intelligence.addEventListener('tabchange',event=>{
  index=event.detail.index;intelligence.dataset.activeIndex=String(index);
  dots.forEach((dot,i)=>{
   const active=Number(dot.dataset.logoPart)===index||(index===4&&i%4===0);
   dot.classList.toggle('is-emphasized',active);dot.setAttribute('r',active?'5.8':'2.7');
  });
  hint.textContent='Scroll to explore · '+String(index+1).padStart(2,'0')+' / 05';
  if(!event.detail.automatic){
   const destination=section.getBoundingClientRect().top+scrollY-stickyTop+index*step;
   lenis.scrollTo(destination,{immediate:true});
  }
 });
 window.addEventListener('scroll',requestSync,{passive:true});
 window.addEventListener('resize',measure,{passive:true});
 new ResizeObserver(measure).observe(intelligence);
 document.fonts.ready.then(measure);
 measure();
}

// Industry cards advance automatically while visible; page scrolling stays independent.
const domain=document.querySelector('.domain-section');
if(domain){
 const cards=[...domain.querySelectorAll('.domain-card')];
 const markers=[...domain.querySelectorAll('[data-domain-index]')];
 const simpleMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,visible=false,timer,animations=[];
 cards.forEach(card=>{card.hidden=false;});
 const paint=(index)=>{
  cards.forEach((card,i)=>{
   const active=i===index;
   card.style.visibility=active?'visible':'hidden';
   card.style.zIndex=active?'2':'1';
   card.inert=!active;card.setAttribute('aria-hidden',String(!active));
  });
  current=index;
  markers.forEach((marker,i)=>{if(i===index)marker.setAttribute('aria-current','true');else marker.removeAttribute('aria-current');});
  domain.querySelector('.domain-current').textContent=markers[index].dataset.name;
  domain.querySelector('.domain-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
 };
 const updatePlayback=()=>{
  clearInterval(timer);
  const playing=!simpleMotion.matches&&visible&&!document.hidden;
  domain.dataset.playing=String(playing);
  if(playing)timer=setInterval(()=>goTo(current+1,true),6000);
 };
 const goTo=(target,automatic=false)=>{
  const index=(target+cards.length)%cards.length;
  if(index!==current){
   animations.forEach(animation=>animation.cancel());
   const outgoing=cards[current],direction=target>current?1:-1;
   paint(index);
   if(!simpleMotion.matches){
    const options={duration:850,easing:'cubic-bezier(.22,.7,.2,1)'};
    animations=[
     outgoing.animate([{visibility:'visible',opacity:1,transform:'translateY(0) rotateX(0) scale(1)'},{visibility:'visible',opacity:0,transform:`translateY(${-direction*55}%) rotateX(${direction*32}deg) scale(.88)`}],options),
     cards[index].animate([{opacity:0,transform:`translateY(${direction*55}%) rotateX(${-direction*32}deg) scale(.88)`},{opacity:1,transform:'translateY(0) rotateX(0) scale(1)'}],options),
    ];
   }
   if(!automatic)domain.querySelector('.domain-status').textContent=`${markers[index].dataset.name}, ${index+1} of ${cards.length}`;
  }
  updatePlayback();
 };
 domain.querySelector('.domain-prev').addEventListener('click',()=>goTo(current-1));
 domain.querySelector('.domain-next').addEventListener('click',()=>goTo(current+1));
 markers.forEach((marker,i)=>marker.addEventListener('click',()=>goTo(i)));
 domain.addEventListener('keydown',event=>{
  if(!event.target.closest('button'))return;
  if(event.key==='ArrowDown'||event.key==='ArrowRight'){event.preventDefault();goTo(current+1);}
  else if(event.key==='ArrowUp'||event.key==='ArrowLeft'){event.preventDefault();goTo(current-1);}
 });
 simpleMotion.addEventListener('change',()=>{animations.forEach(animation=>animation.cancel());updatePlayback();});
 document.addEventListener('visibilitychange',updatePlayback);
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.35;updatePlayback();},{threshold:[0,.35]}).observe(domain);}else{visible=true;}
 paint(0);updatePlayback();
}
