(() => {
  const form=document.querySelector('#apply-form');
  if(!form)return;
  const params=new URLSearchParams(location.search),product=params.get('product');
  if(['bca','mca','sif'].includes(product)){
    const radio=form.querySelector('input[name="product"][value="'+product+'"]');
    if(radio)radio.checked=true;
  }
  const campaign=params.get('campaign');
  if(campaign&&/^(bca|mca|sif)-landing-page-google-ads$/.test(campaign)){
    const field=document.createElement('input');field.type='hidden';field.name='campaign';field.value=campaign;form.append(field);
  }
})();
