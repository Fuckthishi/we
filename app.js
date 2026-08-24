const WHATSAPP='96171546495';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

const fallback530={
  'Black / White':['assets/products/IMG_0441.jpg','assets/products/IMG_0447.png','assets/products/IMG_0448.png','assets/products/IMG_0450.png','assets/products/IMG_0451.png'],
  'White':Array.isArray(window.WHITE_GALLERY)&&window.WHITE_GALLERY.length?window.WHITE_GALLERY:['assets/products/IMG_0452.png','assets/products/IMG_0453.png']
};
const aero=window.AIR_GALLERIES||{};
const products=[
  {id:'nb-530',name:'New Balance 530',brand:'New Balance',price:0,new_drop:true,sizes:['37','38','39','40','41'],description:'Chunky everyday sneaker with a breathable upper. Choose your color and size.',variants:fallback530},
  {id:'nb-aero-runner',name:'New Balance Aero Runner',brand:'New Balance',price:0,new_drop:true,sizes:['37','38','39','40','41'],description:'A sculpted performance-inspired runner with a cushioned statement sole and layered mesh upper.',variants:{'Black / White':aero['Black / White']||[],'Blue / White':aero['Blue / White']||[],'White / Black':aero['White / Black']||[]}}
];

function usableVariants(p){return Object.fromEntries(Object.entries(p.variants||{}).filter(([,v])=>Array.isArray(v)&&v.length))}
function firstImage(p){return Object.values(usableVariants(p))[0]?.[0]||''}
function safeText(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function money(v){return Number(v)>0?`$${Number(v).toFixed(2)}`:'Price on WhatsApp'}
function waLink(text){return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`}
function readCart(){try{const v=JSON.parse(localStorage.getItem('sharif-cart')||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
const state={products,cart:readCart(),filter:'all'};
const warmed=new Set();
function warmImage(src,priority='low'){if(!src||warmed.has(src))return;warmed.add(src);const img=new Image();img.decoding='async';img.fetchPriority=priority;img.src=src}
function warmNeighbors(imgs,index){if(imgs.length<2)return;warmImage(imgs[(index+1)%imgs.length]);warmImage(imgs[(index-1+imgs.length)%imgs.length])}
function warmProduct(p){Object.values(usableVariants(p)).flat().slice(0,6).forEach((src,i)=>warmImage(src,i<2?'high':'low'))}
function lock(){document.body.classList.toggle('no-scroll',$('#cartDrawer').classList.contains('open')||$('#searchModal').open)}

function renderProducts(){
  const list=state.filter==='sale'?[]:state.products;
  $('#products').innerHTML=list.map((p,n)=>{
    const variants=usableVariants(p),names=Object.keys(variants),src=firstImage(p);if(!src)return'';
    return `<article class="product-card reveal-card" role="button" tabindex="0" data-id="${p.id}"><div class="product-image-wrap"><img src="${src}" alt="${safeText(p.name)}" loading="${n===0?'eager':'lazy'}" decoding="async" fetchpriority="${n===0?'high':'auto'}"><span class="badge">NEW DROP</span><span class="photo-count">${names.length} colors</span></div><div class="product-info"><div><h3>${safeText(p.name)}</h3><p>${names.join(' · ')} · Sizes 37–41</p></div><div class="product-price">${money(p.price)}</div></div></article>`;
  }).join('')||'<div class="empty">Nothing in this section right now.</div>';
  $$('.product-card').forEach(card=>{const p=products.find(x=>x.id===card.dataset.id);card.addEventListener('click',()=>openProduct(p));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProduct(p)}});card.addEventListener('pointerenter',()=>warmProduct(p),{once:true});card.addEventListener('touchstart',()=>warmProduct(p),{once:true,passive:true})});
}

function animateClose(modal){if(!modal?.open)return;modal.classList.add('closing');setTimeout(()=>{if(modal.open)modal.close();modal.classList.remove('closing')},180)}

function openProduct(p){
  if(!p)return;const variants=usableVariants(p),colors=Object.keys(variants);if(!colors.length)return;
  let color=colors[0],imgs=variants[color],index=0,selectedSize='';const modal=$('#productModal');
  $('#modalContent').innerHTML=`<div class="modal-layout product-stage"><div class="gallery"><div class="main-photo" id="mainPhotoArea"><button class="gallery-arrow prev" id="galleryPrev" aria-label="Previous photo">‹</button><img id="modalMainImage" src="${imgs[0]}" alt="${safeText(p.name)}" decoding="async" fetchpriority="high"><button class="gallery-arrow next" id="galleryNext" aria-label="Next photo">›</button><span class="gallery-counter" id="galleryCounter">1 / ${imgs.length}</span></div><div class="thumbs" id="galleryThumbs"></div></div><div class="modal-details"><p class="eyebrow product-brand">${safeText(p.brand.toUpperCase())}</p><h2 class="product-title">${safeText(p.name)}</h2><div class="product-price modal-price">${money(p.price)}</div><p class="desc">${safeText(p.description)}</p><div class="size-block color-section"><div class="size-label"><p class="eyebrow">SELECT COLOR</p><span id="colorHint">${safeText(color)}</span></div><div class="size-grid color-grid">${colors.map((v,i)=>`<button class="size-btn color-btn ${i===0?'active':''}" data-color="${safeText(v)}">${safeText(v)}</button>`).join('')}</div></div><div class="size-block size-section"><div class="size-label"><p class="eyebrow">SELECT SIZE</p><span id="sizeHint">37–41 available</span></div><div class="size-grid">${p.sizes.map(s=>`<button class="size-btn size-choice" data-size="${s}">${s}</button>`).join('')}</div></div><div class="modal-actions"><button id="addToBag" class="primary-btn full">Add to bag <span>+</span></button><button id="directWhatsApp" class="secondary-btn full">Ask on WhatsApp <span>↗</span></button></div></div></div>`;

  const mainImg=$('#modalMainImage'),area=$('#mainPhotoArea'),counter=$('#galleryCounter'),thumbs=$('#galleryThumbs');
  function renderGallery(direction=0){mainImg.classList.remove('slide-left','slide-right','image-pop');void mainImg.offsetWidth;mainImg.src=imgs[index];mainImg.classList.add(direction>0?'slide-left':direction<0?'slide-right':'image-pop');counter.textContent=`${index+1} / ${imgs.length}`;thumbs.innerHTML=imgs.map((src,n)=>`<button class="thumb ${n===index?'active':''}" data-index="${n}" aria-label="View photo ${n+1}"><img src="${src}" alt="${safeText(p.name)} ${safeText(color)} photo ${n+1}" loading="lazy" decoding="async"></button>`).join('');$$('.thumb').forEach(t=>t.addEventListener('click',()=>{const old=index;index=Number(t.dataset.index);renderGallery(index>old?1:-1)}));warmNeighbors(imgs,index)}
  function move(delta){index=(index+delta+imgs.length)%imgs.length;renderGallery(delta>0?1:-1)}
  renderGallery();$('#galleryPrev').addEventListener('click',e=>{e.stopPropagation();move(-1)});$('#galleryNext').addEventListener('click',e=>{e.stopPropagation();move(1)});

  let tx=0,ty=0;area.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});area.addEventListener('touchend',e=>{if(!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>=34&&Math.abs(dx)>Math.abs(dy)*1.15)move(dx<0?1:-1)},{passive:true});
  let mx=0,my=0,mouseDown=false;area.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.target.closest('.gallery-arrow'))return;mouseDown=true;mx=e.clientX;my=e.clientY});area.addEventListener('pointerup',e=>{if(!mouseDown||e.pointerType!=='mouse')return;mouseDown=false;const dx=e.clientX-mx,dy=e.clientY-my;if(Math.abs(dx)>=38&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1)});

  $$('.color-btn').forEach(btn=>btn.addEventListener('click',()=>{color=btn.dataset.color;imgs=variants[color];index=0;$$('.color-btn').forEach(x=>x.classList.toggle('active',x===btn));$('#colorHint').textContent=color;renderGallery();warmProduct(p)}));
  $$('.size-choice').forEach(btn=>btn.addEventListener('click',()=>{selectedSize=btn.dataset.size;$$('.size-choice').forEach(x=>x.classList.toggle('active',x===btn));$('#sizeHint').textContent=`Size ${selectedSize} selected`;$('#sizeHint').classList.remove('error-text')}));
  $('#addToBag').addEventListener('click',()=>{if(!selectedSize){$('#sizeHint').textContent='Choose a size first';$('#sizeHint').classList.add('error-text');return}const existing=state.cart.find(x=>x.id===p.id&&x.size===selectedSize&&x.color===color);if(existing)existing.qty=Math.min(9,(existing.qty||1)+1);else state.cart.push({id:p.id,size:selectedSize,color,qty:1});saveCart();animateClose(modal);setTimeout(openCart,200)});
  $('#directWhatsApp').addEventListener('click',()=>window.open(waLink(`Hi Sharif Store, I want to ask about ${p.name} — ${color}${selectedSize?` — size ${selectedSize}`:''}.`),'_blank','noopener'));
  modal.showModal();modal.classList.remove('closing');warmProduct(p);
}

function saveCart(){localStorage.setItem('sharif-cart',JSON.stringify(state.cart));renderCart()}
function renderCart(){$('#cartCount').textContent=state.cart.reduce((a,x)=>a+(x.qty||1),0);$('#cartItems').innerHTML=state.cart.length?state.cart.map((x,n)=>{const p=products.find(z=>z.id===x.id)||products[0],vars=usableVariants(p),src=(vars[x.color]||Object.values(vars)[0]||[])[0]||'';return `<div class="cart-row"><img src="${src}" alt="${safeText(p.name)}" loading="lazy" decoding="async"><div class="cart-copy"><h4>${safeText(p.name)}</h4><p>${safeText(x.color)} · Size ${safeText(x.size)}</p><strong>${money(p.price)}</strong><div class="qty-control"><button data-index="${n}" data-delta="-1">−</button><span>${x.qty||1}</span><button data-index="${n}" data-delta="1">+</button></div></div><button class="remove-btn" data-index="${n}">×</button></div>`}).join(''):'<div class="empty bag-empty"><b>Your bag is empty.</b><span>Pick a color and choose your size.</span></div>';$$('.qty-control button').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.index),d=Number(b.dataset.delta);state.cart[i].qty=Math.max(0,Math.min(9,(state.cart[i].qty||1)+d));if(!state.cart[i].qty)state.cart.splice(i,1);saveCart()}));$$('.remove-btn').forEach(b=>b.addEventListener('click',()=>{state.cart.splice(Number(b.dataset.index),1);saveCart()}));$('#checkoutBtn').disabled=!state.cart.length}
function openCart(){renderCart();$('#cartDrawer').classList.add('open');$('#backdrop').classList.add('show');lock()}function closeCart(){$('#cartDrawer').classList.remove('open');$('#backdrop').classList.remove('show');lock()}

$('#checkoutBtn').addEventListener('click',()=>{if(!state.cart.length)return;const lines=['SHARIF STORE — ORDER REQUEST',''];state.cart.forEach(x=>{const p=products.find(z=>z.id===x.id)||products[0];lines.push(`${p.name} — ${x.color} — Size ${x.size} — Qty ${x.qty||1}`)});lines.push('','Please confirm availability and delivery price.');window.open(waLink(lines.join('\n')),'_blank','noopener')});
$('#cartBtn').addEventListener('click',openCart);$('#closeCart').addEventListener('click',closeCart);$('#backdrop').addEventListener('click',closeCart);$('#modalClose').addEventListener('click',()=>animateClose($('#productModal')));$('#productModal').addEventListener('click',e=>{if(e.target===$('#productModal'))animateClose($('#productModal'))});$('#productModal').addEventListener('cancel',e=>{e.preventDefault();animateClose($('#productModal'))});
$('#searchBtn').addEventListener('click',()=>{$('#searchModal').showModal();lock();setTimeout(()=>$('#searchInput').focus(),30)});$('#searchClose').addEventListener('click',()=>{$('#searchModal').close();lock()});$('#searchInput').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();$('#searchResults').innerHTML=q?products.filter(p=>p.name.toLowerCase().includes(q)).map(p=>`<button class="search-result" data-id="${p.id}"><span>${safeText(p.name)}</span><b>${money(p.price)}</b></button>`).join(''):'';$$('.search-result').forEach(b=>b.addEventListener('click',()=>{$('#searchModal').close();openProduct(products.find(p=>p.id===b.dataset.id))}))});
$$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.filter=b.dataset.filter;renderProducts()}));$('#footerWhatsApp').href=waLink('Hi Sharif Store, I have a question.');const hero=firstImage(products[0]);if(hero){warmImage(hero,'high');$('#heroImage').src=hero;$('#heroImage').fetchPriority='high';$('#heroImage').decoding='async';$('#heroImage').classList.add('ready')}renderProducts();renderCart();
