(() => {
  const wrap=document.querySelector('.journey-wrap'),line=wrap.querySelector('.journey-line'),stages=[...wrap.querySelectorAll('.funding-stage')],ns='http://www.w3.org/2000/svg';
  function svg(tag,attrs){const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;}
  const mobile=svg('svg',{'class':'journey-mobile-route','aria-hidden':'true'}),mp=svg('path',{fill:'none',stroke:'currentColor','stroke-width':1,'stroke-dasharray':'3 6'});mobile.append(mp);wrap.append(mobile);
  const track=svg('svg',{'class':'abstract-track','aria-hidden':'true'}),trail=svg('path',{'class':'travel-path'}),signal=svg('path',{'class':'signal-path'});track.append(trail,signal);wrap.append(track);
  const marker=document.createElement('div');marker.className='abstract-marker';marker.setAttribute('aria-hidden','true');marker.innerHTML='<svg viewBox="0 0 42 42"><g class="ball-mark"><g class="ball-orbit"><circle cx="21" cy="21" r="18" fill="none" stroke="#404040" stroke-width="1" stroke-dasharray="19 94"/></g><g class="ball-core"><circle cx="21" cy="21" r="11" fill="#ea4628"/><path d="M20 14a7 7 0 0 1 7 7" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/></g></g><g class="cross-mark"><path d="M17 6h8v11h11v8H25v11h-8V25H6v-8h11Z" fill="#ea4628"/><path d="M17 6h8v11h11" fill="none" stroke="#bf351d" stroke-width="1.2"/></g><g class="signal-mark"><circle cx="21" cy="21" r="6" fill="#fff" stroke="#ea4628" stroke-width="2"/></g></svg>';wrap.append(marker);
  const beads=Array.from({length:6},()=>{const e=document.createElement('div');e.className='route-bead';e.setAttribute('aria-hidden','true');wrap.append(e);return e;});
  const nodes=stages.map(()=>{const e=document.createElement('span');e.className='route-node';e.setAttribute('aria-hidden','true');wrap.append(e);return e;});
  const ring=document.createElement('span');ring.className='route-ring';ring.setAttribute('aria-hidden','true');wrap.append(ring);
  stages.forEach(s=>{const e=document.createElement('span');e.className='stage-progress';e.setAttribute('aria-hidden','true');s.querySelector('.phase-art').append(e);});
  const outcome=document.createElement('span');outcome.className='motion-outcome';outcome.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/></svg> Your next chapter starts here';wrap.append(outcome);
  const descriptions=['A rolling dot with a crisp orbit and a measured landing at each step.','The brand cross turns through the bends and settles at each milestone.','A single pulse passes through the route, sending a ripple from each step.','An elastic string of dots stretches through the bends and gathers at the finish.'];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),narrow=matchMedia('(max-width:800px)'),stops=[0,.27,.55,.82,1],duration=16000;
  let geometry,option=1,elapsed=0,last=0,paused=reduce.matches,visible=true,finished=false;
  function measure(){const w=wrap.getBoundingClientRect();if(narrow.matches){const ys=stages.map(s=>s.offsetTop+42);mp.setAttribute('d',`M20 ${ys[0]}V${ys[3]}`);geometry={mobile:true,ys};track.setAttribute('viewBox',`0 0 40 ${w.height}`);track.style.cssText=`left:0;top:0;width:40px;height:${w.height}px`;trail.setAttribute('d',mp.getAttribute('d'));}else{const r=line.getBoundingClientRect();geometry={mobile:false,x:r.left-w.left,y:r.top-w.top,sx:r.width/1200,sy:r.height/150,path:line.querySelector('path')};track.setAttribute('viewBox','0 0 1200 150');track.setAttribute('preserveAspectRatio','none');track.style.cssText=`left:${geometry.x}px;top:${geometry.y}px;width:${r.width}px;height:${r.height}px`;trail.setAttribute('d',geometry.path.getAttribute('d'));}signal.setAttribute('d',trail.getAttribute('d'));geometry.length=trail.getTotalLength();trail.style.strokeDasharray=geometry.length;render();}
  function point(progress){const g=geometry,q=Math.max(0,Math.min(1,progress));if(g.mobile)return{x:20,y:g.ys[0]+q*(g.ys[3]-g.ys[0])};const p=g.path.getPointAtLength(q*g.path.getTotalLength());return{x:g.x+p.x*g.sx,y:g.y+p.y*g.sy};}
  function put(el,p,size){el.style.transform=`translate(${p.x-size/2}px,${p.y-size/2}px)`;}
  function journey(time){const t=Math.min(time/duration,1),phase=t*4,i=Math.min(Math.floor(phase),3),part=phase-i,hold=option===3?.12:.23,u=Math.max(0,(part-hold)/(1-hold)),ease=u*u*(3-2*u);return{progress:stops[i]+(stops[i+1]-stops[i])*ease,index:i,part,u,velocity:6*u*(1-u)};}
  function render(){if(!geometry)return;const j=journey(elapsed),p=point(j.progress),size=marker.offsetWidth,quiet=reduce.matches||paused||finished||!visible||document.hidden;put(marker,p,size);
    const angle=j.progress*1080,velocity=quiet?0:j.velocity,stretch=1+velocity*.12;
    marker.querySelector('.ball-core').setAttribute('transform',`translate(21 21) scale(${stretch} ${1/stretch}) rotate(${angle}) translate(-21 -21)`);
    marker.querySelector('.ball-orbit').setAttribute('transform',`rotate(${-angle*.45} 21 21)`);
    const crossAngle=(j.index+j.u*j.u*(3-2*j.u))*90;marker.querySelector('.cross-mark').setAttribute('transform',`translate(21 21) rotate(${crossAngle}) scale(${1+velocity*.06} ${1-velocity*.06}) translate(-21 -21)`);
    trail.style.strokeDashoffset=geometry.length*(1-j.progress);const pulseLength=geometry.length*.075;signal.style.strokeDasharray=`${pulseLength} ${geometry.length+1}`;signal.style.strokeDashoffset=-Math.max(0,geometry.length*j.progress-pulseLength);
    nodes.forEach((el,i)=>{put(el,point(stops[i]),6);el.classList.toggle('reached',i<=j.index);});
    const ripple=Math.min(1,j.part/.25);put(ring,point(stops[j.index]),36);ring.style.opacity=reduce.matches?0:(1-ripple)*.65;ring.style.transform+=` scale(${.3+ripple*1.5})`;
    stages.forEach((s,i)=>{s.classList.toggle('is-active',i===j.index);s.classList.toggle('is-complete',i<j.index||finished);});
    beads.forEach((e,i)=>{const delay=i*115,tail=journey(Math.max(0,elapsed-delay)),q=finished?1:tail.progress,diameter=(narrow.matches?10:12)*(1-i*.075);e.style.width=diameter+'px';e.style.height=diameter+'px';e.style.opacity=1-i*.12;put(e,point(q),diameter);});
    outcome.classList.toggle('is-visible',finished);
  }
  function controls(){const b=document.querySelector('#motion-pause');b.textContent=reduce.matches?'Next step':paused?'Play':'Pause';b.setAttribute('aria-pressed',String(paused));}
  function choose(n){option=n;elapsed=0;finished=false;document.body.dataset.motion=n;document.querySelectorAll('[data-option]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.option===n)));document.querySelector('#motion-description').textContent=descriptions[n-1];history.replaceState(null,'','?variant='+n);render();}
  document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>choose(+b.dataset.option));
  document.querySelector('#motion-pause').onclick=()=>{if(reduce.matches){elapsed=Math.min(duration,elapsed+4000);finished=elapsed===duration;}else{paused=!paused;if(finished){elapsed=0;finished=false;}}controls();render();};
  document.querySelector('#motion-replay').onclick=()=>{elapsed=0;finished=false;paused=reduce.matches;controls();render();};
  new ResizeObserver(measure).observe(wrap);new IntersectionObserver(([e])=>{visible=e.isIntersecting;}).observe(wrap);reduce.addEventListener('change',()=>{paused=reduce.matches;controls();render();});
  function tick(now){const delta=last?Math.min(now-last,60):0;last=now;if(!paused&&visible&&!document.hidden&&!finished){elapsed+=delta;finished=elapsed>=duration;render();}requestAnimationFrame(tick);}
  choose(Math.max(1,Math.min(4,Number(new URLSearchParams(location.search).get('variant'))||1)));controls();measure();requestAnimationFrame(tick);
})();
