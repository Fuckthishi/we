const WHATSAPP='96171546495';
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];

const variants={
  'Black / White':['assets/products/IMG_0441.jpg','assets/products/IMG_0447.png','assets/products/IMG_0448.png','assets/products/IMG_0450.png','assets/products/IMG_0451.png'],
  'White':(window.WHITE_GALLERY?.length?window.WHITE_GALLERY:['assets/products/IMG_0452.png','assets/products/IMG_0453.png'])
};
const product={id:'nb-530',name:'New Balance 530',brand:'New Balance',category:'Sneakers',price:0,new_drop:true,sold_out:false,sizes:['37','38','39','40','41'],description:'Chunky everyday sneaker with a breathable upper. Choose your color and size.',variants};

function readCart(){try{const v=JSON.parse(localStorage.getItem('sharif-cart')||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
const state={products:[product],cart:readCart(),filter:'all'};
function safeText(v=''){return String(v).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}
function money(v){return Number(v)>0?`$${Number(v).toFixed(2)}`:'Price on WhatsApp'}
function waLink(text){return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`}
function lock(){document.body.classList.toggle('no-scroll',$('#cartDrawer').classList.contains('open')||$('#productModal').open||$('#searchModal').open)}

function renderProducts(){
  const list=state.filter==='sale'?[]:state.products;
  $('#products').innerHTML=list.map(p=>`<article class="product-card reveal-card" role="button" tabindex="0"><div class="product-image-wrap"><img src="${p.variants['Black / White'][0]}" alt="${safeText(p.name)}"><span class="badge">NEW DROP</span><span class="photo-count">2 colors</span></div><div class="product-info"><div><h3>${safeText(p.name)}</h3><p>Black / White · White · Sizes 37–41</p></div><div class="product-price">${money(p.price)}</div></div></article>`).join('')||'<div class="empty">Nothing in this section right now.</div>';
  $$('.product-card').forEach(el=>{el.onclick=openProduct;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProduct()}}});
}

function animateClose(modal){if(!modal?.open)return;modal.classList.add('closing');setTimeout(()=>{if(modal.open)modal.close();modal.classList.remove('closing');lock()},190)}

function openProduct(){
  const p=product;let color='Black / White',imgs=p.variants[color],index=0,selectedSize='';const modal=$('#productModal');
  $('#modalContent').innerHTML=`<div class="modal-layout product-stage"><div class="gallery"><div class="mobile-dismiss-hint">Swipe photos · pull down to close</div><div class="main-photo" id="mainPhotoArea"><button class="gallery-arrow prev" id="galleryPrev" aria-label="Previous photo">‹</button><img id="modalMainImage" src="${imgs[0]}" alt="${p.name}"><button class="gallery-arrow next" id="galleryNext" aria-label="Next photo">›</button><span class="gallery-counter" id="galleryCounter">1 / ${imgs.length}</span></div><div class="thumbs" id="galleryThumbs"></div></div><div class="modal-details"><p class="eyebrow">NEW BALANCE</p><h2>${p.name}</h2><div class="product-price modal-price">${money(p.price)}</div><p class="desc">${p.description}</p><div class="size-block"><div class="size-label"><p class="eyebrow">SELECT COLOR</p><span id="colorHint">${color}</span></div><div class="size-grid">${Object.keys(p.variants).map((v,i)=>`<button class="size-btn color-btn ${i===0?'active':''}" data-color="${v}">${v}</button>`).join('')}</div></div><div class="size-block"><div class="size-label"><p class="eyebrow">SELECT SIZE</p><span id="sizeHint">37–41 available</span></div><div class="size-grid">${p.sizes.map(s=>`<button class="size-btn size-choice" data-size="${s}">${s}</button>`).join('')}</div></div><div class="modal-actions"><button id="addToBag" class="primary-btn full magnetic-btn">Add to bag <span>+</span></button><button id="directWhatsApp" class="secondary-btn full">Ask on WhatsApp <span>↗</span></button></div></div></div>`;

  const mainImg=$('#modalMainImage'),area=$('#mainPhotoArea'),counter=$('#galleryCounter'),thumbs=$('#galleryThumbs');
  const renderGallery=(direction=0)=>{
    mainImg.classList.remove('slide-left','slide-right','image-pop');void mainImg.offsetWidth;
    mainImg.src=imgs[index];mainImg.classList.add(direction>0?'slide-left':direction<0?'slide-right':'image-pop');
    counter.textContent=`${index+1} / ${imgs.length}`;
    thumbs.innerHTML=imgs.map((src,n)=>`<button class="thumb ${n===index?'active':''}" data-index="${n}" aria-label="View photo ${n+1}"><img src="${src}" alt="${p.name} ${color} photo ${n+1}"></button>`).join('');
    $$('.thumb').forEach(t=>t.onclick=()=>{const old=index;index=Number(t.dataset.index);renderGallery(index>old?1:-1)});
    $$('.thumb')[index]?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  };
  const move=delta=>{const old=index;index=(index+delta+imgs.length)%imgs.length;renderGallery(delta>0?1:-1)};
  renderGallery();
  $('#galleryPrev').onclick=e=>{e.stopPropagation();move(-1)};$('#galleryNext').onclick=e=>{e.stopPropagation();move(1)};

  // Mobile: touch events only. This avoids PointerEvent/touch conflicts on iOS/Android.
  let tx=0,ty=0;
  area.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
  area.addEventListener('touchend',e=>{
    if(!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=ty=0;
    if(Math.abs(dx)>=34&&Math.abs(dx)>Math.abs(dy)*1.15){move(dx<0?1:-1);return}
    if(window.innerWidth<=800&&dy>125&&Math.abs(dy)>Math.abs(dx)*1.35)animateClose(modal);
  },{passive:true});
  // Desktop/laptop mouse drag.
  let mx=0,my=0,mouseDown=false;
  area.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.target.closest('.gallery-arrow'))return;mouseDown=true;mx=e.clientX;my=e.clientY});
  area.addEventListener('pointerup',e=>{if(!mouseDown||e.pointerType!=='mouse')return;mouseDown=false;const dx=e.clientX-mx,dy=e.clientY-my;if(Math.abs(dx)>=38&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1)});

  $$('.color-btn').forEach(b=>b.onclick=()=>{
    color=b.dataset.color;imgs=p.variants[color];index=0;$$('.color-btn').forEach(x=>x.classList.toggle('active',x===b));$('#colorHint').textContent=color;renderGallery();area.classList.add('variant-flash');setTimeout(()=>area.classList.remove('variant-flash'),420);
  });
  $$('.size-choice').forEach(b=>b.onclick=()=>{selectedSize=b.dataset.size;$$('.size-choice').forEach(x=>x.classList.toggle('active',x===b));$('#sizeHint').textContent=`Size ${selectedSize} selected`;$('#sizeHint').classList.remove('error-text');b.classList.add('selected-bounce');setTimeout(()=>b.classList.remove('selected-bounce'),300)});
  $('#addToBag').onclick=()=>{if(!selectedSize){$('#sizeHint').textContent='Choose a size first';$('#sizeHint').classList.add('error-text');return}const ex=state.cart.find(x=>x.id===p.id&&x.size===selectedSize&&x.color===color);if(ex)ex.qty=Math.min(9,(ex.qty||1)+1);else state.cart.push({id:p.id,size:selectedSize,color,qty:1});saveCart();animateClose(modal);setTimeout(openCart,210)};
  $('#directWhatsApp').onclick=()=>window.open(waLink(`Hi Sharif Store, I want to ask about ${p.name} — ${color}${selectedSize?` — size ${selectedSize}`:''}.`),'_blank','noopener');
  modal.showModal();modal.classList.remove('closing');modal.classList.add('opening');setTimeout(()=>modal.classList.remove('opening'),300);lock();
}

function saveCart(){localStorage.setItem('sharif-cart',JSON.stringify(state.cart));renderCart()}
function renderCart(){
  $('#cartCount').textContent=state.cart.reduce((a,x)=>a+(x.qty||1),0);
  $('#cartItems').innerHTML=state.cart.length?state.cart.map((x,n)=>`<div class="cart-row"><img src="${product.variants[x.color||'Black / White'][0]}" alt="${product.name}"><div class="cart-copy"><h4>${product.name}</h4><p>${x.color||'Black / White'} · Size ${x.size}</p><strong>${money(product.price)}</strong><div class="qty-control"><button data-index="${n}" data-delta="-1">−</button><span>${x.qty||1}</span><button data-index="${n}" data-delta="1">+</button></div></div><button class="remove-btn" data-index="${n}">×</button></div>`).join(''):'<div class="empty bag-empty"><b>Your bag is empty.</b><span>Pick a color and choose your size.</span></div>';
  $$('.qty-control button').forEach(b=>b.onclick=()=>{const i=+b.dataset.index,d=+b.dataset.delta;state.cart[i].qty=Math.max(0,Math.min(9,(state.cart[i].qty||1)+d));if(!state.cart[i].qty)state.cart.splice(i,1);saveCart()});
  $$('.remove-btn').forEach(b=>b.onclick=()=>{state.cart.splice(+b.dataset.index,1);saveCart()});$('#checkoutBtn').disabled=!state.cart.length;
}
function openCart(){renderCart();$('#cartDrawer').classList.add('open');$('#backdrop').classList.add('show');lock()}
function closeCart(){$('#cartDrawer').classList.remove('open');$('#backdrop').classList.remove('show');lock()}
$('#checkoutBtn').onclick=()=>{if(!state.cart.length)return;const lines=['SHARIF STORE — ORDER REQUEST',''];state.cart.forEach(x=>lines.push(`${product.name} — ${x.color||'Black / White'} — Size ${x.size} — Qty ${x.qty||1}`));lines.push('','Please confirm availability and delivery price.');window.open(waLink(lines.join('\n')),'_blank','noopener')};
$('#cartBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#backdrop').onclick=closeCart;
$('#modalClose').onclick=()=>animateClose($('#productModal'));$('#productModal').addEventListener('click',e=>{if(e.target===$('#productModal'))animateClose($('#productModal'))});$('#productModal').addEventListener('cancel',e=>{e.preventDefault();animateClose($('#productModal'))});$('#productModal').addEventListener('close',lock);
$('#searchBtn').onclick=()=>{$('#searchModal').showModal();lock();setTimeout(()=>$('#searchInput').focus(),30)};$('#searchClose').onclick=()=>$('#searchModal').close();$('#searchModal').addEventListener('close',lock);$('#searchInput').oninput=e=>{$('#searchResults').innerHTML=e.target.value.trim()?`<button class="search-result"><span>${product.name}</span><b>${money(product.price)}</b></button>`:'';$('.search-result')?.addEventListener('click',()=>{$('#searchModal').close();openProduct()})};
$$('.filter').forEach(b=>b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.filter=b.dataset.filter;renderProducts()});
$('#footerWhatsApp').href=waLink('Hi Sharif Store, I have a question.');$('#heroImage').src=product.variants['Black / White'][0];$('#heroImage').classList.add('ready');renderProducts();renderCart();