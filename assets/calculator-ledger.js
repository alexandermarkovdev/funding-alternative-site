(() => {
  const short={mca:'Merchant advance',bca:'Business advance',sif:'Invoice finance'};
  document.querySelectorAll('.ledger-calculator-section').forEach(section=>{
    const calculator=section.querySelector('.funding-calculator');if(!calculator)return;
    calculator.querySelectorAll('[data-tab]').forEach(button=>{const label=button.querySelector('.tab-short');if(label)label.textContent=short[button.dataset.tab];});
    const title=calculator.querySelector('.calculator-header>h2');if(title)title.textContent=calculator.querySelector('[data-tab]')?'Funding options':'Your funding estimate';
    calculator.querySelectorAll('input[type=range]').forEach(input=>{
      if(input.nextElementSibling?.classList.contains('studio-range-limits'))return;
      const limits=document.createElement('span');limits.className='studio-range-limits';limits.setAttribute('aria-hidden','true');
      const format=value=>input.name==='pct'?value+'%':input.name==='term'?value+' months':new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(+value);
      const min=document.createElement('span'),max=document.createElement('span');min.textContent=format(input.min);max.textContent=format(input.max);limits.append(min,max);input.after(limits);
    });
    if(!calculator.querySelector('[data-tab]')){
      calculator.classList.add('ledger-single-product');
      const panel=calculator.querySelector('.product-panel:not([hidden])')||calculator.querySelector('.product-panel'),product=panel?.dataset.product,heading=panel?.querySelector('.panel-heading h2')?.textContent||panel?.getAttribute('aria-label')||'Funding estimate';
      const icons={mca:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8v5H8zM8 16h2m4 0h2"/>',bca:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 13h18"/>',sif:'<path d="M5 2h9l5 5v15H5zM14 2v6h5M8 12h7m-7 4h4"/>'};
      const summary=document.createElement('div');summary.className='ledger-product-summary';const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.5');svg.setAttribute('aria-hidden','true');svg.innerHTML=icons[product]||icons.bca;const name=document.createElement('strong');name.textContent=heading;summary.append(svg,name);
      const instruction=document.createElement('p');instruction.className='ledger-product-instruction';instruction.textContent='Move the sliders to update your estimate.';calculator.querySelector('.calculator-header').append(summary,instruction);
    }
  });
})();
