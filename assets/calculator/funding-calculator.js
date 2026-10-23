(() => {
  const money = new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP',maximumFractionDigits:0});
  const weeklyMoney = new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP',minimumFractionDigits:2,maximumFractionDigits:2});
  const finite = (value,fallback) => value === null || value === '' || value === undefined || !Number.isFinite(Number(value)) ? fallback : Number(value);
  document.querySelectorAll('.funding-calculator').forEach((calculator,index) => {
    const settings = {...window.FUNDING_CALCULATOR_SETTINGS,...JSON.parse(calculator.dataset.settings || '{}')};
    const months = Math.max(1,finite(settings.mca_months,6));
    const advanceRate = Math.min(100,Math.max(1,finite(settings.sif_advance,80)));
    const feeRate = Math.max(0,finite(settings.sif_fee,4));
    const cap = Math.max(15000,finite(settings.mca_cap,250000));
    const minimum = Math.max(0,finite(settings.min_lend,15000));
    const tabs = [...calculator.querySelectorAll('[data-tab]')];
    const panels = [...calculator.querySelectorAll('[data-product]')];
    const uid = 'funding-calc-'+index+'-'+Math.random().toString(36).slice(2,8);
    const apply = calculator.querySelector('.apply');
    apply.setAttribute('href', settings.apply_url || '/apply-now/');
    function update(panel, interacted=false) {
      const get = name => panel.querySelector(`[name="${name}"]`);
      const product = panel.dataset.product;
      let result,secondary,hint;
      if (product === 'mca') {
        const receipts = get('receipts'),pct = get('pct'),before = [receipts.value,pct.value];
        const needPct = Math.ceil(minimum*100/(Number(receipts.value)*months));
        if (needPct <= Number(pct.max)) {
          if (Number(pct.value) < needPct) pct.value=needPct;
        } else {
          pct.value=pct.max;
          const needReceipts=Math.ceil(minimum*100/(Number(pct.max)*months)/Number(receipts.step))*Number(receipts.step);
          if(Number(receipts.value)<needReceipts)receipts.value=Math.min(Number(receipts.max),needReceipts);
        }
        const percentage=Number(pct.value),keep=100-percentage;
        result=money.format(Math.min(cap,Math.round(Number(receipts.value)*percentage/100*months/500)*500));
        secondary=`£${keep} yours`;
        hint=`Of every £100 card sale, £${keep} stays with you and £${percentage} repays your advance.`;
        panel.querySelector('[data-keep-bar]').style.width=keep+'%';
        if(interacted)panel.querySelector('[data-adjustment]').textContent=before[0]!==receipts.value || before[1]!==pct.value ? `Adjusted to keep your estimated advance at or above ${money.format(minimum)}.` : '';
      } else if (product === 'bca') {
        const amount=Number(get('amount').value),term=Number(get('term').value);
        const multiple=finite(settings.bca_multiples?.[term],({3:1.30,4:1.35,5:1.40,6:1.45})[term] || 1.45);
        const weeks=Math.round(term*52/12),total=amount*multiple;
        result=weeklyMoney.format(total/weeks);secondary=money.format(total);
        hint=calculator.dataset.compact ? `Over ${weeks} weeks.` : `Total repayment ${money.format(total)} over ${weeks} weeks.`;
      } else {
        const invoice=Number(get('invoice').value),advance=invoice*advanceRate/100;
        result=money.format(advance);secondary=money.format(Math.max(0,invoice-advance-invoice*feeRate/100));hint='';
        panel.querySelector('[data-advance-hint]').textContent=`${advanceRate}% up front, the rest when your customer pays.`;
      }
      panel.querySelector('[data-result]').textContent=result;
      panel.querySelector('[data-secondary]').textContent=secondary;
      panel.querySelector('[data-result-hint]').textContent=hint;
      panel.querySelectorAll('input[type="range"]').forEach(input => {
        const value=Number(input.value),name=input.name;
        panel.querySelector(`[data-value="${name}"]`).textContent=name==='pct'?`${value}%`:name==='term'?`${value} months`:money.format(value);
        input.style.setProperty('--fill',((value-Number(input.min))/(Number(input.max)-Number(input.min))*100)+'%');
        input.setAttribute('aria-valuetext',name==='pct'?`${value}%`:name==='term'?`${value} months`:money.format(value));
      });
    }
    function select(key,focus=false) {
      tabs.forEach(tab=>{const selected=tab.dataset.tab===key;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus();});
      panels.forEach(panel=>{panel.hidden=panel.dataset.product!==key;panel.inert=panel.hidden;});
    }
    tabs.forEach((tab,i)=>{
      tab.id=uid+'-tab-'+tab.dataset.tab;tab.setAttribute('aria-controls',uid+'-panel-'+tab.dataset.tab);
      tab.addEventListener('click',()=>select(tab.dataset.tab));
      tab.addEventListener('keydown',event=>{let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(i+1)%tabs.length;if(['ArrowLeft','ArrowUp'].includes(event.key))next=(i+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();select(tabs[next].dataset.tab,true);}});
    });
    panels.forEach(panel=>{panel.id=uid+'-panel-'+panel.dataset.product;if(tabs.length)panel.setAttribute('aria-labelledby',uid+'-tab-'+panel.dataset.product);else panel.removeAttribute('role');panel.addEventListener('input',()=>update(panel,true));update(panel);});
    select(productsHas(settings.default_tab)?settings.default_tab:'mca');
    function productsHas(value){return ['mca','bca','sif'].includes(value);}
    const tablist=calculator.querySelector('[role="tablist"]');
    if(!tablist)return;
    const orientation=()=>tablist.setAttribute('aria-orientation',document.body.classList.contains('navigator')&&innerWidth>760?'vertical':'horizontal');
    orientation();window.addEventListener('resize',orientation);
  });
})();
