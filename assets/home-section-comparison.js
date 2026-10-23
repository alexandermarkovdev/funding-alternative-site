const sectionOptions={flow:[['Connected circles','Bright red numbered roundels, redrawn line icons and clean connections.'],['Stepped journey','A stepped route links the four stages, with larger icons and a looser rhythm.'],['Compact overview','A two-by-two step layout with the application requirements alongside.'],['Vertical timeline','Heading and requirements on the left; a four-step timeline on the right.']],products:[['Clean columns','Straight-edged photographs and clear, aligned product actions.'],['Photo rows','Three wide rows give each product more room and a larger image.'],['Inset panels','Bright photographs with solid white reading panels overlapping their lower edge.'],['Question first','Business questions lead, with supporting photography beneath the product copy.']]};
const sectionParams=new URLSearchParams(location.search);
let section=sectionParams.get('section')==='products'?'products':'flow';
let variant=/^(current|[1-4])$/.test(sectionParams.get('variant'))?sectionParams.get('variant'):'1';
const previewFrame=document.querySelector('iframe'),sectionControls=document.querySelector('.controls');
const offsets={flow:null,products:null};
let readySection=null,requestSerial=0;
const headingSelector=s=>s==='flow'?'#funding-flow-heading':'#products-h';
function rememberPosition(){
  if(!readySection)return;
  const heading=previewFrame.contentDocument?.querySelector(headingSelector(readySection));
  if(heading)offsets[readySection]=-heading.getBoundingClientRect().top;
}
async function positionPreview(serial,requestedSection){
  const doc=previewFrame.contentDocument,win=previewFrame.contentWindow;
  if(!doc?.querySelector(headingSelector(requestedSection)))return;
  const style=doc.createElement('style');
  style.textContent='html{scroll-behavior:auto!important}.top,.top *{transition:none!important}';
  doc.head.append(style);
  await doc.fonts.ready;
  if(serial!==requestSerial)return;
  const place=()=>{
    const heading=doc.querySelector(headingSelector(requestedSection));
    const top=heading.getBoundingClientRect().top+win.scrollY;
    const headerHeight=doc.querySelector('.top')?.getBoundingClientRect().height||60;
    const offset=offsets[requestedSection]??(-headerHeight-24);
    win.scrollTo({top:Math.max(0,top+offset),behavior:'instant'});
  };
  place();
  await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
  if(serial!==requestSerial)return;
  place();
  readySection=requestedSection;
  previewFrame.style.visibility='visible';
  previewFrame.setAttribute('aria-busy','false');
}
function updateSectionPreview(){
  const serial=++requestSerial,requestedSection=section;
  readySection=null;
  const src=variant==='current'?'index.html':'home-'+section+'-option-'+variant+'.html';
  const option=variant==='current'?['Current design','The version currently used on your homepage.']:sectionOptions[section][Number(variant)-1];
  previewFrame.style.visibility='hidden';
  previewFrame.setAttribute('aria-busy','true');
  previewFrame.onload=()=>positionPreview(serial,requestedSection);
  previewFrame.src=src;
  previewFrame.title=(section==='flow'?'Funding steps':'Products')+' — '+option[0];
  document.querySelector('#standalone').href=src+'#'+(section==='flow'?'how-it-works':'products');
  document.querySelectorAll('[data-section]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.section===section)));
  document.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.variant===variant)));
  document.querySelector('#description').textContent=option[0]+':';
  document.querySelector('#detail').textContent=option[1];
  history.replaceState(null,'','?section='+section+'&variant='+variant);
}
sectionControls.addEventListener('click',e=>{
  const button=e.target.closest('button');
  if(!button)return;
  if(button.dataset.section===section||button.dataset.variant===variant)return;
  rememberPosition();
  if(button.dataset.section)section=button.dataset.section;
  if(button.dataset.variant)variant=button.dataset.variant;
  updateSectionPreview();
});
new ResizeObserver(()=>document.documentElement.style.setProperty('--controls-height',sectionControls.offsetHeight+'px')).observe(sectionControls);
updateSectionPreview();
