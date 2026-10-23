document.querySelectorAll('.top a[href="blog.html"],.top a[href="../blog.html"]').forEach(a=>a.setAttribute('aria-current','page'));
const blogNav=document.querySelector('.top .nav'),blogInk=blogNav?.querySelector('.nav__ink');
if(blogNav&&blogInk){
  const move=el=>{const n=blogNav.getBoundingClientRect(),r=el.getBoundingClientRect();blogInk.style.width=r.width+'px';blogInk.style.transform='translateX('+(r.left-n.left)+'px)';blogInk.style.opacity=1;};
  blogNav.querySelectorAll(':scope > a,.nav__drop > button').forEach(el=>{el.addEventListener('mouseenter',()=>move(el));el.addEventListener('focus',()=>move(el));});
  blogNav.addEventListener('mouseleave',()=>{if(!blogNav.contains(document.activeElement))blogInk.style.opacity=0;});
  blogNav.addEventListener('focusout',e=>{if(!blogNav.contains(e.relatedTarget))blogInk.style.opacity=0;});
}
const blogHeader=document.querySelector('.top');
if(blogHeader){const onScroll=()=>{const on=blogHeader.classList.contains('is-scrolled');blogHeader.classList.toggle('is-scrolled',on?scrollY>20:scrollY>80);};addEventListener('scroll',onScroll,{passive:true});onScroll();}
if(matchMedia('(max-width:800px)').matches){const contents=document.querySelector('.article-toc details');if(contents)contents.open=false;}
const articleSearch=document.querySelector('#article-search');
if(articleSearch){
  let activeCategory='all';const articles=[...document.querySelectorAll('[data-article]')];
  const normal=s=>s.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
  function filter(){const query=normal(articleSearch.value.trim());let count=0;articles.forEach(article=>{const matchesTopic=activeCategory==='all'||article.dataset.categories.split('|').includes(activeCategory);const matchesSearch=normal(article.dataset.search).includes(query);article.hidden=!(matchesTopic&&matchesSearch);if(!article.hidden)count++;});document.querySelector('#blog-result-count').textContent=count+' '+(count===1?'article':'articles');document.querySelector('.blog-empty').hidden=count!==0;}
  articleSearch.addEventListener('input',filter);
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter();}));
  document.querySelector('[data-reset]').addEventListener('click',()=>{articleSearch.value='';activeCategory='all';document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));filter();articleSearch.focus({preventScroll:true});});
}
