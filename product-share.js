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

  const setupMerchandising=()=>{
    if(typeof products==='undefined'||typeof state==='undefined'||typeof renderProducts!=='function') return;

    // Remove Classic Low Sneaker from the live storefront and search/cart product pool.
    const classicIndex=products.findIndex(p=>p.id==='classic-low-sneaker'||/classic low sneaker/i.test(p.name||''));
    if(classicIndex>=0){
      const [removed]=products.splice(classicIndex,1);
      const stateIndex=state.products.findIndex(p=>p.id===removed.id);
      if(stateIndex>=0&&state.products!==products)state.products.splice(stateIndex,1);
    }

    // White Chunky Runner: remove only its first displayed photo, keeping the rest of the gallery intact.
    const whiteChunky=products.find(p=>/^white chunky runner$/i.test((p.name||'').trim()))
      || products.find(p=>/white/i.test(p.name||'')&&/chunky/i.test(p.name||'')&&/runner/i.test(p.name||''));
    if(whiteChunky){
      const firstVariant=Object.values(whiteChunky.variants||{}).find(v=>Array.isArray(v)&&v.length>1);
      if(firstVariant)firstVariant.shift();
    }

    renderProducts();

    const pick=(...tests)=>products.find(p=>tests.some(test=>typeof test==='string'?p.id===test:test.test(`${p.id||''} ${p.name||''}`)));
    const topSellers=[
      pick('charm-chunky-sneaker',/charm chunky sneaker/i,/flower/i),
      pick('nb-chunky-runner',/new balance chunky runner/i,/chunky new balance/i),
      pick('chunky-trail-runner',/chunky trail runner/i),
      pick(/samba/i)
    ].filter(Boolean).filter((p,i,a)=>a.findIndex(x=>x.id===p.id)===i);

    if(!topSellers.length||document.getElementById('topSellers')) return;

    const section=document.createElement('section');
    section.id='topSellers';
    section.className='catalog-section top-sellers-section';
    section.innerHTML=`
      <div class="section-head">
        <div><p class="eyebrow">MOST WANTED</p><h2>Top Sellers.</h2></div>
      </div>
      <div class="product-grid top-sellers-grid">
        ${topSellers.map((p,n)=>{
          const variants=usableVariants(p),names=Object.keys(variants),src=firstImage(p);
          if(!src)return'';
          return `<article class="product-card reveal-card top-seller-card" role="button" tabindex="0" data-id="${p.id}">
            <div class="product-image-wrap"><img src="${src}" alt="${safeText(p.name)}" loading="${n===0?'eager':'lazy'}" decoding="async" fetchpriority="${n===0?'high':'low'}"><span class="badge">TOP SELLER</span><span class="photo-count">${names.length} colors</span></div>
            <div class="product-info"><div><h3>${safeText(p.name)}</h3><p>${names.join(' · ')} · Sizes 37–41</p></div><div class="product-price">${money(p.price)}</div></div>
          </article>`;
        }).join('')}
      </div>`;

    const shop=document.getElementById('shop');
    if(shop)shop.parentNode.insertBefore(section,shop);

    section.querySelectorAll('.top-seller-card').forEach(card=>{
      const p=products.find(x=>x.id===card.dataset.id);
      card.addEventListener('click',()=>openProduct(p));
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProduct(p)}});
    });
  };

  const openFromUrl=()=>{
    const id=new URLSearchParams(location.search).get('product');
    if(!id||typeof window.openProduct!=='function') return;
    const card=document.querySelector(`.product-card[data-id="${CSS.escape(id)}"]`);
    if(card){card.click();return;}
    const cards=[...document.querySelectorAll('.product-card')];
    const fallback=id==='nb-530'?cards[0]:id==='nb-aero-runner'?cards[1]:null;
    fallback?.click();
  };

  const boot=()=>{
    setupMerchandising();
    setTimeout(openFromUrl,40);
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
