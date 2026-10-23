(() => {
  const wrap=document.querySelector('.journey-wrap'), line=wrap.querySelector('.journey-line'), stages=[...wrap.querySelectorAll('.funding-stage')];
  const traveller=document.createElement('div');traveller.className='journey-traveller';traveller.setAttribute('aria-hidden','true');
  traveller.innerHTML='<div class="traveller-shadow"></div><div class="premium-sprite"></div><div class="premium-token" aria-hidden="true">£</div><div class="guide-caption"></div>';
  wrap.append(traveller);
  const ns='http://www.w3.org/2000/svg', mobile=document.createElementNS(ns,'svg'), mobilePath=document.createElementNS(ns,'path');mobile.classList.add('journey-mobile-route');mobile.setAttribute('aria-hidden','true');mobilePath.setAttribute('fill','none');mobilePath.setAttribute('stroke','currentColor');mobilePath.setAttribute('stroke-width','1');mobilePath.setAttribute('stroke-dasharray','3 6');mobile.append(mobilePath);wrap.append(mobile);
  const track=document.createElementNS(ns,'svg');track.classList.add('premium-track');track.setAttribute('aria-hidden','true');const trail=document.createElementNS(ns,'path');track.append(trail);wrap.append(track);
  const done=document.createElement('span');done.className='journey-completion';done.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/></svg> From your first step to your next opportunity';wrap.append(done);
  stages.forEach(s=>{const signal=document.createElement('span');signal.className='step-signal';signal.setAttribute('aria-hidden','true');s.querySelector('.phase-art').append(signal);});
  const captions=['Let’s get started.','A real conversation.','Your offer, explained.','On to your next chapter.'];
  const descriptions=['A custom 3D character with a full walk cycle and a route that draws behind them.','A dimensional funding token, with changing light and a measured arrival at each milestone.','Your 3D guide pauses to introduce each step, then walks you through the journey.'];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'), narrow=matchMedia('(max-width:800px)');let option=1,elapsed=0,last=0,paused=reduce.matches,visible=true,finished=false,geometry;
  const duration=24000,stops=[0,.27,.55,.82,1],sprite=traveller.querySelector('.premium-sprite'),caption=traveller.querySelector('.guide-caption');
  function measure(){const w=wrap.getBoundingClientRect();if(narrow.matches){const ys=stages.map(s=>s.offsetTop+42);mobilePath.setAttribute('d',`M20 ${ys[0]}V${ys[3]}`);geometry={mobile:true,ys,height:w.height};track.setAttribute('viewBox',`0 0 40 ${w.height}`);track.style.cssText=`left:0;top:0;width:40px;height:${w.height}px`;trail.setAttribute('d',mobilePath.getAttribute('d'));}else{const r=line.getBoundingClientRect();geometry={mobile:false,x:r.left-w.left,y:r.top-w.top,sx:r.width/1200,sy:r.height/150,path:line.querySelector('path')};track.setAttribute('viewBox','0 0 1200 150');track.setAttribute('preserveAspectRatio','none');track.style.cssText=`left:${geometry.x}px;top:${geometry.y}px;width:${r.width}px;height:${r.height}px`;trail.setAttribute('d',geometry.path.getAttribute('d'));}trail.style.strokeDasharray=trail.getTotalLength();render();}
  function position(progress){const g=geometry;if(g.mobile){return {x:20,y:g.ys[0]+progress*(g.ys[3]-g.ys[0])};}const p=g.path.getPointAtLength(progress*g.path.getTotalLength());return {x:g.x+p.x*g.sx,y:g.y+p.y*g.sy};}
  function render(){if(!geometry)return;const t=Math.min(elapsed/duration,1),phase=t*4,index=Math.min(Math.floor(phase),3),part=phase-index;let progress,still;
    const hold=option===3?.5:.22;still=part<hold;const travel=Math.max(0,(part-hold)/(1-hold)),ease=travel*travel*(3-2*travel);progress=stops[index]+(stops[index+1]-stops[index])*ease;
    const moving=!still&&!paused&&!finished&&visible&&!document.hidden&&!reduce.matches;
    stages.forEach((s,i)=>{s.classList.toggle('is-current',i===index);s.classList.toggle('is-past',i<index);});
    const p=position(progress),h=traveller.offsetHeight,w=traveller.offsetWidth,bob=moving?Math.sin(elapsed/95)*1.2:0;traveller.style.transform=`translate(${p.x-w/2}px,${p.y-h*.94+bob}px)`;
    let frame=moving?Math.floor(elapsed/90)%8:1;sprite.style.backgroundPosition=`${(frame%4)/3*100}% ${Math.floor(frame/4)*100}%`;
    traveller.style.setProperty('--coin-turn',`${moving?Math.sin(elapsed/650)*42:12}deg`);traveller.style.setProperty('--coin-glint',moving?Math.max(0,Math.sin(elapsed/650))*.7:.1);traveller.style.setProperty('--shadow-scale',1-bob*.07);
    caption.textContent=captions[index];caption.classList.toggle('is-visible',option===3&&still&&!finished);traveller.classList.toggle('at-end',progress>.72);traveller.classList.toggle('is-still',!moving);trail.style.strokeDashoffset=trail.getTotalLength()*(1-progress);done.classList.toggle('is-visible',finished);
  }
  function controls(){const button=document.querySelector('#motion-pause');button.textContent=reduce.matches?'Next step':paused?'Play':'Pause';button.setAttribute('aria-pressed',String(paused));}
  function choose(n){option=n;document.body.dataset.motion=n;elapsed=0;finished=false;document.querySelectorAll('[data-option]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.option===n)));document.querySelector('#motion-description').textContent=descriptions[n-1]+(reduce.matches?' Reduced motion: use Next step.':'');history.replaceState(null,'','?variant='+n);render();}
  document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>choose(+b.dataset.option));
  document.querySelector('#motion-pause').onclick=()=>{if(reduce.matches){elapsed=Math.min(elapsed+6000,24000);render();return;}paused=!paused;if(finished){elapsed=0;finished=false;}controls();render();};
  document.querySelector('#motion-replay').onclick=()=>{if(reduce.matches){elapsed=0;render();return;}elapsed=0;finished=false;paused=false;controls();render();};
  new ResizeObserver(measure).observe(wrap);new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;render();}).observe(wrap);document.addEventListener('visibilitychange',render);
  reduce.addEventListener('change',()=>{paused=reduce.matches;controls();render();});
  function tick(now){const delta=last?Math.min(now-last,60):0;last=now;if(!paused&&visible&&!document.hidden&&!finished){elapsed+=delta;finished=elapsed>=duration;render();}requestAnimationFrame(tick);}
  choose(Math.max(1,Math.min(3,Number(new URLSearchParams(location.search).get('variant'))||1)));controls();measure();requestAnimationFrame(tick);
})();
