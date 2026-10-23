(() => {
  const root = new URL('../', document.currentScript.src);
  const key = 'fa_cookie_consent_v1', lifetime = 180 * 24 * 60 * 60 * 1000;
  const optional = ['preferences','statistics','marketing'];
  let saved = null;
  try { const state = JSON.parse(localStorage.getItem(key)); if (state && state.version === 1 && Date.now()-state.savedAt < lifetime) saved = state; } catch {}
  const categories = () => ({necessary:true,preferences:!!saved?.categories?.preferences,statistics:!!saved?.categories?.statistics,marketing:!!saved?.categories?.marketing});
  const activate = () => {
    document.querySelectorAll('script[type="text/plain"][data-consent-category]').forEach(source => {
      if (!categories()[source.dataset.consentCategory] || source.dataset.consentActivated) return;
      const script = document.createElement('script');
      for (const {name,value} of source.attributes) if (!['type','data-consent-category','data-consent-activated'].includes(name)) script.setAttribute(name,value);
      script.textContent=source.textContent; source.dataset.consentActivated='true'; source.after(script);
    });
  };
  const banner = document.createElement('section');
  banner.className='consent-banner'; banner.setAttribute('aria-label','Cookie choices');
  banner.innerHTML='<div><h2>Your cookie choices</h2><p>We use necessary storage to remember your privacy choices. Optional preferences, statistics and marketing stay off unless you allow them. <a href="'+new URL('cookie-policy.html',root)+'">Read our cookie policy</a>.</p></div><div class="consent-actions"><button type="button" data-consent-all>Accept all</button><button type="button" data-consent-reject>Reject optional</button><button type="button" data-consent-settings>Choose cookies</button></div>';
  const dialog=document.createElement('dialog'); dialog.className='consent-dialog'; dialog.setAttribute('aria-labelledby','consent-title');
  dialog.innerHTML='<form method="dialog"><div class="consent-dialog-head"><h2 id="consent-title">Cookie settings</h2><button type="button" data-consent-close aria-label="Close cookie settings">Close</button></div><p>Choose what you allow. You can change your choices at any time using “Cookie settings” in the footer.</p><label class="consent-choice"><span><strong>Necessary</strong><small>Remembers your choices and supports essential site functions.</small></span><input type="checkbox" checked disabled aria-label="Necessary storage is always on"></label>'+optional.map((name,i)=>'<label class="consent-choice"><span><strong>'+name[0].toUpperCase()+name.slice(1)+'</strong><small>'+['Remember optional display preferences.','Allow optional measurement of how the site is used.','Allow optional advertising and marketing tools.'][i]+'</small></span><input type="checkbox" name="'+name+'"></label>').join('')+'<p class="consent-detail">No optional analytics or advertising tools are currently installed in this HTML preview.</p><div class="consent-actions"><button type="button" data-consent-save>Save choices</button><button type="button" data-consent-reject>Reject optional</button><button type="button" data-consent-all>Accept all</button></div></form>';
  document.body.append(banner,dialog); banner.hidden=!!saved;
  function announce(){window.dispatchEvent(new CustomEvent('funding:consentchange',{detail:categories()}));activate();}
  function save(choice){saved={version:1,savedAt:Date.now(),categories:{necessary:true,...choice}};try{localStorage.setItem(key,JSON.stringify(saved));}catch{}banner.hidden=true;dialog.close();announce();}
  function open(){for(const name of optional)dialog.querySelector('[name="'+name+'"]').checked=categories()[name];dialog.showModal();}
  document.addEventListener('click',event=>{const el=event.target.closest('button');if(!el)return;if(el.matches('[data-consent-settings]'))open();else if(el.matches('[data-consent-close]'))dialog.close();else if(el.matches('[data-consent-all]'))save({preferences:true,statistics:true,marketing:true});else if(el.matches('[data-consent-reject]'))save({preferences:false,statistics:false,marketing:false});else if(el.matches('[data-consent-save]')){const choice={};optional.forEach(name=>choice[name]=dialog.querySelector('[name="'+name+'"]').checked);save(choice);}});
  window.FundingConsent={get:categories,open,allows:category=>!!categories()[category]}; announce();
})();
