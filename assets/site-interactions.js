(() => {
  document.documentElement.classList.add('motion-enhanced');
  const enabled=()=>true;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const animate=(el,frames,options={})=>{if(!reduced.matches)el.animate(frames,{duration:180,easing:'ease-out',...options});};
  // Field state is visual feedback only; original validation and submissions remain in charge.
  if(enabled(16)||enabled(17))document.querySelectorAll('input:not([type=range]):not([type=radio]):not([type=checkbox]),textarea').forEach(el=>{
    const update=()=>el.classList.toggle('has-value',!!el.value);update();el.addEventListener('input',update);el.addEventListener('blur',()=>el.classList.add('was-edited'));
  });
  if(enabled(20))document.querySelectorAll('textarea').forEach(el=>{const fit=()=>{if(!el.offsetParent)return;el.style.height='auto';el.style.height=Math.min(320,Math.max(110,el.scrollHeight+2))+'px';};el.addEventListener('input',fit);fit();});
  if(enabled(21))document.querySelectorAll('input[type=range]').forEach(el=>{const update=()=>el.style.setProperty('--range-fill',`${100*(+el.value-(+el.min||0))/((+el.max||100)-(+el.min||0))}%`);el.addEventListener('input',update);update();});
  if(enabled(23))document.querySelectorAll('[data-result]').forEach(el=>{let previous=el.textContent;new MutationObserver(()=>{if(el.textContent===previous)return;previous=el.textContent;el.getAnimations().forEach(a=>a.cancel());animate(el,[{color:'#a4311d'},{color:getComputedStyle(el).color}],{duration:300});}).observe(el,{childList:true,subtree:true,characterData:true});});
  if(enabled(24))document.querySelectorAll('[role=tabpanel]').forEach(el=>new MutationObserver(()=>{if(!el.hidden)animate(el,[{opacity:.55},{opacity:1}]);}).observe(el,{attributes:true,attributeFilter:['hidden']}));
  // Animate the whole disclosure so closing feels as deliberate as opening.
  if(enabled(25))document.querySelectorAll('details:not(.mnav):not(.article-toc details)').forEach(el=>{
    const summary=el.querySelector(':scope>summary');if(!summary)return;let animation,target=el.open;
    summary.addEventListener('click',event=>{if(reduced.matches||event.target.closest('a'))return;event.preventDefault();const start=el.getBoundingClientRect().height;animation?.cancel();target=!target;el.open=true;el.style.height='auto';const end=target?el.getBoundingClientRect().height:summary.getBoundingClientRect().height;el.style.overflow='hidden';animation=el.animate([{height:start+'px'},{height:end+'px'}],{duration:230,easing:'cubic-bezier(.16,1,.3,1)'});animation.onfinish=()=>{el.open=target;el.style.removeProperty('height');el.style.removeProperty('overflow');animation=null;};});
  });
  const article=document.querySelector('.article-body,.resource-content'),top=document.querySelector('.top');let progress;
  if(enabled(26)&&article&&article.scrollHeight>600){progress=document.createElement('div');progress.className='motion-reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);}
  const up=document.createElement('button');up.type='button';up.className='motion-top';up.textContent='↑ Top';up.setAttribute('aria-label','Back to top');up.tabIndex=-1;if(enabled(28))document.body.append(up);up.onclick=()=>{window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});const heading=document.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}};
  const links=enabled(27)?[...document.querySelectorAll('.article-toc a[href^="#"]')]:[],headings=links.map(a=>document.getElementById(decodeURIComponent(a.hash.slice(1))));let pending=false;
  function scrollFeedback(){pending=false;const header=top?.getBoundingClientRect().height||0;document.documentElement.style.setProperty('--motion-header-height',header+'px');const show=scrollY>900;up.classList.toggle('is-visible',show);up.tabIndex=show?0:-1;
    if(progress){const r=article.getBoundingClientRect(),value=Math.max(0,Math.min(1,(header-r.top)/Math.max(1,r.height-innerHeight+header)));progress.style.transform=`scaleX(${value})`;}
    let current=-1;headings.forEach((h,i)=>{if(h&&h.getBoundingClientRect().top<header+100)current=i;});links.forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(scrollFeedback);}},{passive:true});addEventListener('resize',scrollFeedback);scrollFeedback();
  // Search/filter changes retain focus and let the returned items settle in place.
  if(enabled(29))document.querySelectorAll('.blog-grid,.bank-grid').forEach(grid=>new MutationObserver(records=>{records.forEach(r=>{if(r.target instanceof HTMLElement&&!r.target.hidden&&r.target.matches('.blog-card,.bank-choice'))animate(r.target,[{opacity:.55},{opacity:1}]);});}).observe(grid,{subtree:true,attributes:true,attributeFilter:['hidden']}));
})();
