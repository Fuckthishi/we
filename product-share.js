(()=>{
  const buildProductUrl=id=>{
    const url=new URL(window.location.href);
    url.search='';
    url.hash='';
    url.searchParams.set('product',id);
    return url.toString();
  };

  const productIdFromTitle=()=>{
    const title=document.querySelector('#productModal .product-title')?.textContent?.trim();
    if(title==='New Balance 530') return 'nb-530';
    if(title==='New Balance Aero Runner') return 'nb-aero-runner';
    return null;
  };

  const injectShareButton=()=>{
    const actions=document.querySelector('#productModal .modal-actions');
    if(!actions||actions.querySelector('#shareProduct')) return;
    const id=productIdFromTitle();
    if(!id) return;
    const btn=document.createElement('button');
    btn.id='shareProduct';
    btn.className='secondary-btn full share-product-btn';
    btn.innerHTML='Share product <span>↗</span>';
    btn.addEventListener('click',async()=>{
      const title=document.querySelector('#productModal .product-title')?.textContent?.trim()||'Sharif Store product';
      const url=buildProductUrl(id);
      try{
        if(navigator.share){
          await navigator.share({title,text:`Check out ${title} at Sharif Store`,url});
          return;
        }
        await navigator.clipboard.writeText(url);
        const old=btn.innerHTML;
        btn.innerHTML='Link copied <span>✓</span>';
        setTimeout(()=>btn.innerHTML=old,1600);
      }catch(err){
        if(err?.name!=='AbortError'){
          const ta=document.createElement('textarea');
          ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
          const old=btn.innerHTML;btn.innerHTML='Link copied <span>✓</span>';setTimeout(()=>btn.innerHTML=old,1600);
        }
      }
    });
    actions.appendChild(btn);
  };

  const modalContent=document.getElementById('modalContent');
  if(modalContent)new MutationObserver(injectShareButton).observe(modalContent,{childList:true,subtree:true});

  const openFromUrl=()=>{
    const id=new URLSearchParams(location.search).get('product');
    if(!id||typeof window.openProduct!=='function') return;
    const card=document.querySelector(`.product-card[data-id="${CSS.escape(id)}"]`);
    if(card){card.click();return;}
    const cards=[...document.querySelectorAll('.product-card')];
    const fallback=id==='nb-530'?cards[0]:id==='nb-aero-runner'?cards[1]:null;
    fallback?.click();
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(openFromUrl,40),{once:true});
  else setTimeout(openFromUrl,40);
})();
