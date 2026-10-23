(() => {
  const root=new URL('../',document.currentScript.src);
  const status=document.querySelector('[data-bank-status]'),search=document.querySelector('#bank-search'),grid=document.querySelector('[data-bank-grid]'),form=document.querySelector('#bank-connection-form');
  let institutions=[],configuration={};
  function render(){
    if(!grid)return;grid.replaceChildren();const query=(search?.value||'').trim().toLocaleLowerCase();const matches=institutions.filter(bank=>bank.name.toLocaleLowerCase().includes(query));
    for(const bank of matches){const a=document.createElement('a');a.className='bank-choice';a.href=new URL('open-banking-transactions.html?institution='+encodeURIComponent(bank.id)+'&bank='+encodeURIComponent(bank.name),root);const image=document.createElement('img');if(bank.logo){image.src=new URL(bank.logo,root);image.alt='';image.onerror=()=>image.remove();a.append(image);}const name=document.createElement('span');name.textContent=bank.name;a.append(name);grid.append(a);}
    document.querySelector('[data-bank-count]').textContent=matches.length+' '+(matches.length===1?'institution':'institutions');document.querySelector('[data-bank-empty]').hidden=matches.length!==0;
  }
  async function init(){
    try{const response=await fetch(new URL('assets/site-services.json',root));configuration=await response.json();}catch{}
    if(grid){
      const response=await fetch(new URL('assets/bank-directory.json',root));institutions=await response.json();
      if(configuration.openBankingInstitutionsUrl){try{const r=await fetch(configuration.openBankingInstitutionsUrl,{credentials:'same-origin'});if(!r.ok)throw Error();const data=await r.json();const list=data.institutions||data;if(!Array.isArray(list))throw Error();institutions=list.map(bank=>({id:bank.id,name:bank.name,logo:bank.logo||bank.icon||''})).filter(bank=>bank.id&&bank.name);status.hidden=true;}catch{status.textContent='Live bank availability is temporarily unavailable. The institutions shown below are from our existing site.';}}
      render();search.addEventListener('input',render);
    }
    if(form){
      const params=new URLSearchParams(location.search);form.elements.institution_id.value=params.get('institution')||'';form.elements.bank_name.value=params.get('bank')||'';
      const type=form.elements.company_type,reg=form.elements.registration_number;
      const updateType=()=>{reg.required=['limited_company','limited_liability_partnership'].includes(type.value);form.querySelector('[data-registration-required]').textContent=reg.required?' *':'';};type.addEventListener('change',updateType);updateType();
      form.querySelector('[type=submit]').disabled=!configuration.openBankingConnectionUrl;
      if(configuration.openBankingConnectionUrl)status.hidden=true;
      form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity()||!configuration.openBankingConnectionUrl)return;const button=form.querySelector('[type=submit]');button.disabled=true;status.hidden=false;status.textContent='Preparing your secure bank connection…';try{const response=await fetch(configuration.openBankingConnectionUrl,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});if(!response.ok)throw Error();const data=await response.json();const target=new URL(data.redirect_url||data.authorisation_url||data.authorization_url||'');if(target.protocol!=='https:')throw Error();location.assign(target.href);}catch{status.textContent='We could not start the connection. Please try again or contact our team.';button.disabled=false;}});
    }
  }
  init().catch(()=>{if(status){status.hidden=false;status.textContent='Bank information is temporarily unavailable. Please contact our team.';}});
})();
