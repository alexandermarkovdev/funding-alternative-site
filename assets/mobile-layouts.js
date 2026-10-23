window.MobileLayoutsReady=(async()=>{
  document.body.classList.add('mobile-layouts');
  document.querySelectorAll('.blog-filters').forEach(filters=>{
    const box=document.createElement('div');box.className='mobile-topic-select';const label=document.createElement('label');label.htmlFor='mobile-blog-topic';label.textContent='Topic';const select=document.createElement('select');select.id='mobile-blog-topic';const buttons=[...filters.querySelectorAll('[data-filter]')];buttons.forEach(b=>{const option=document.createElement('option');option.value=b.dataset.filter;option.textContent=b.textContent.trim();select.append(option);b.addEventListener('click',()=>select.value=b.dataset.filter);});select.addEventListener('change',()=>buttons.find(b=>b.dataset.filter===select.value)?.click());document.querySelector('[data-reset]')?.addEventListener('click',()=>select.value='all');box.append(label,select);filters.before(box);
  });
  // Close the mobile menu after selecting a route or an in-page section.
  document.querySelectorAll('.mnav').forEach(menu=>{
    menu.addEventListener('click',event=>{if(event.target.closest('a'))menu.open=false;});
    document.addEventListener('pointerdown',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
  });
})();
