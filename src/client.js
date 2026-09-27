// Small, independent enhancements. The complete content is pre-rendered in HTML.

// Self-hosted Lenis; touch keeps native inertia and reduced motion is honored live.
import Lenis from './vendor/lenis.js';
const lenis = new Lenis({autoRaf:true, lerp:0.09, smoothWheel:true, syncTouch:false, respectReducedMotion:true});

// Keep URL history and keyboard focus while Lenis handles in-page navigation.
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const hash=link.getAttribute('href');
  const target=document.getElementById(hash.slice(1));
  if(!target)return;
  event.preventDefault();
  if(target.classList.contains('cap-story'))target.open=true;
  lenis.resize();
  if(location.hash!==hash)history.pushState(null,'',hash);
  lenis.scrollTo(target,{onComplete:()=>{
    if(link.classList.contains('skip-link'))target.focus({preventScroll:true});
  }});
});

document.querySelectorAll('[data-tabs]').forEach(group => {
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
  stories.forEach((story,i)=>{story.open=!mobile.matches||i===0;});
  document.querySelector('.journey')?.setAttribute('aria-orientation',mobile.matches?'vertical':'horizontal');
  document.querySelector('.intelligence-nav')?.setAttribute('aria-orientation',mobile.matches?'horizontal':'vertical');
  document.querySelector('.industry-nav')?.setAttribute('aria-orientation',mobile.matches?'horizontal':'vertical');
  if(!mobile.matches)closeMenu();
}
applyResponsiveBehavior();
mobile.addEventListener('change',applyResponsiveBehavior);
capabilityLinks.forEach(link=>link.addEventListener('click',()=>{document.querySelector(link.getAttribute('href')).open=true;}));
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
// Expand a capability when arriving through an anchor, including browser history.
function openHashTarget(){
  const target=document.getElementById(location.hash.slice(1));
  if(target?.classList.contains('cap-story'))target.open=true;
}
window.addEventListener('hashchange',openHashTarget);openHashTarget();

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

// Animated intelligence stages pause off-screen and after direct user input.
const intelligence=document.querySelector('[data-tabs="intelligence"]');
if(intelligence){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const playback=intelligence.querySelector('.intelligence-playback');
 const tabs=[...intelligence.querySelectorAll('[role="tab"]')];
 const dots=[...intelligence.querySelectorAll('[data-logo-part]')];
 let index=0, paused=reduced.matches, visible=false, timer;
 const update=()=>{
  clearInterval(timer);
  const playing=!paused&&visible&&!document.hidden;
  intelligence.dataset.playing=String(playing);
  playback.setAttribute('aria-pressed',String(paused));
  playback.setAttribute('aria-label',paused?'Play automatic stage changes':'Pause automatic stage changes');
  playback.innerHTML=paused?'Play animation <span aria-hidden="true">▷</span>':'Pause animation <span aria-hidden="true">Ⅱ</span>';
  if(playing)timer=setInterval(()=>intelligence.dispatchEvent(new CustomEvent('select-tab',{detail:{index:(index+1)%tabs.length}})),6000);
 };
 intelligence.addEventListener('tabchange',event=>{
  index=event.detail.index;intelligence.dataset.activeIndex=String(index);
  dots.forEach((dot,i)=>{
   const active=Number(dot.dataset.logoPart)===index||(index===4&&i%4===0);
   dot.classList.toggle('is-emphasized',active);dot.setAttribute('r',active?'5.8':'2.7');
  });
  if(!event.detail.automatic)paused=true;
  update();
 });
 playback.addEventListener('click',()=>{paused=!paused;update();});
 reduced.addEventListener('change',()=>{paused=reduced.matches;update();});
 document.addEventListener('visibilitychange',update);
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.25}).observe(intelligence);}else{visible=true;}
 intelligence.addEventListener('focusin',event=>{if(event.target!==playback){paused=true;update();}});
 update();
}

// Industry cards advance automatically while visible; page scrolling stays independent.
const domain=document.querySelector('.domain-section');
if(domain){
 const cards=[...domain.querySelectorAll('.domain-card')];
 const markers=[...domain.querySelectorAll('[data-domain-index]')];
 const playback=domain.querySelector('.domain-playback');
 const simpleMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,paused=simpleMotion.matches,visible=false,timer,animations=[];
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
  const playing=!paused&&visible&&!document.hidden;
  domain.dataset.playing=String(playing);
  playback.setAttribute('aria-label',paused?'Play industry carousel':'Pause industry carousel');
  playback.innerHTML=paused?'Play animation <span aria-hidden="true">▷</span>':'Pause animation <span aria-hidden="true">Ⅱ</span>';
  if(playing)timer=setInterval(()=>goTo(current+1,true),6000);
 };
 const goTo=(target,automatic=false)=>{
  const index=(target+cards.length)%cards.length;
  if(!automatic)paused=true;
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
 playback.addEventListener('click',()=>{paused=!paused;updatePlayback();});
 domain.addEventListener('focusin',event=>{if(event.target!==playback){paused=true;updatePlayback();}});
 domain.addEventListener('keydown',event=>{
  if(!event.target.closest('button')||event.target===playback)return;
  if(event.key==='ArrowDown'||event.key==='ArrowRight'){event.preventDefault();goTo(current+1);}
  else if(event.key==='ArrowUp'||event.key==='ArrowLeft'){event.preventDefault();goTo(current-1);}
 });
 simpleMotion.addEventListener('change',()=>{animations.forEach(animation=>animation.cancel());paused=simpleMotion.matches;updatePlayback();});
 document.addEventListener('visibilitychange',updatePlayback);
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.35;updatePlayback();},{threshold:[0,.35]}).observe(domain);}else{visible=true;}
 paint(0);updatePlayback();
}
