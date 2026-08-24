const SUPABASE_URL='https://uogsmczhjbcseysvosom.supabase.co';
const SUPABASE_KEY='sb_publishable_57YHVi_GpOtu6mOeZqXQXA_6hqSzERa';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const WHATSAPP='96171546495';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function readCart(){try{const v=JSON.parse(localStorage.getItem('sharif-cart')||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
const state={products:[],cart:readCart(),filter:'all',loading:true};
const embedded=[...(window.SHARIF_IMAGE_PART1||[]),...(window.SHARIF_IMAGE_PART2||[]),...(window.SHARIF_IMAGE_PART3||[]),...(window.SHARIF_IMAGE_PART4||[])];

function asset(u){if(!u)return'';if(/^(https?:|data:|blob:)/i.test(u))return u;return new URL(u,document.baseURI).href}
function money(v){return Number(v)>0?`$${Number(v).toFixed(Number(v)%1?2:0)}`:'Price on WhatsApp'}
function galleryFor(p){
  if(p.id==='nb-navy-white'&&embedded.length>=13)return embedded.slice(0,13);
  if(p.id==='nb-black-silver'&&embedded.length>=28)return embedded.slice(13,28);
  const db=(p.product_images||[]).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)).map(i=>i.image_url||i.public_url).filter(Boolean);
  return db.length?db:[p.image_url].filter(Boolean);
}
function safeText(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function setScrollLock(){document.body.classList.toggle('no-scroll',$('#cartDrawer').classList.contains('open')||$('#productModal').open||$('#searchModal').open)}

async function loadProducts(){
  state.loading=true;renderProducts();
  const {data,error}=await sb.from('products').select('*,product_images(*)').order('position');
  state.loading=false;
  if(error){console.error(error);$('#products').innerHTML=`<div class="load-state"><b>Couldn't load the drop.</b><span>Check your connection and try again.</span><button id="retryLoad" class="secondary-btn">Try again</button></div>`;$('#retryLoad').onclick=loadProducts;return}
  state.products=(data||[]).map(p=>({...p,sizes:(p.sizes||['37','38','39','40','41']).map(String),gallery:galleryFor(p)}));
  renderProducts();renderCart();
  const first=state.products[0];if(first?.gallery?.[0]){$('#heroImage').src=asset(first.gallery[0]);$('#heroImage').classList.add('ready')}
}

function visibleProducts(){let list=state.products;if(state.filter==='new')list=list.filter(x=>x.new_drop||x.is_new_drop);if(state.filter==='sale')list=list.filter(x=>x.on_sale||Number(x.sale_price)>0);return list}
function renderProducts(){
  if(state.loading){$('#products').innerHTML=Array.from({length:2},()=>'<div class="product-card skeleton-card"><div class="product-image-wrap skeleton"></div><div class="skeleton-lines"><i></i><i></i></div></div>').join('');return}
  const list=visibleProducts();
  $('#products').innerHTML=list.map(card).join('')||'<div class="empty">Nothing in this section right now.</div>';
  $$('.product-card[data-id]').forEach(el=>{el.onclick=()=>openProduct(el.dataset.id);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProduct(el.dataset.id)}}});
}
function card(p){const img=asset(p.gallery?.[0]);return `<article class="product-card" role="button" tabindex="0" data-id="${safeText(p.id)}"><div class="product-image-wrap"><img loading="lazy" decoding="async" src="${img}" alt="${safeText(p.name)}">${p.sold_out?'<span class="badge sold-badge">SOLD OUT</span>':(p.new_drop||p.is_new_drop)?'<span class="badge">NEW DROP</span>':''}<span class="photo-count">${p.gallery?.length||1} photos</span></div><div class="product-info"><div><h3>${safeText(p.name)}</h3><p>${safeText(p.brand||'New Balance')} · ${safeText(p.category||'Sneakers')}</p></div><div class="product-price">${money(p.price)}</div></div></article>`}

function openProduct(id){
  const p=state.products.find(x=>x.id===id);if(!p)return;
  const imgs=p.gallery?.length?p.gallery:galleryFor(p);let index=0;let selectedSize='';
  const modal=$('#productModal');
  $('#modalContent').innerHTML=`<div class="modal-layout"><div class="gallery"><div class="main-photo" id="mainPhotoArea"><button class="gallery-arrow prev" id="galleryPrev" aria-label="Previous photo">‹</button><img id="modalMainImage" src="${asset(imgs[0]||'')}" alt="${safeText(p.name)}"><button class="gallery-arrow next" id="galleryNext" aria-label="Next photo">›</button><span class="gallery-counter" id="galleryCounter">1 / ${imgs.length}</span></div><div class="thumbs">${imgs.map((src,n)=>`<button class="thumb ${n===0?'active':''}" data-index="${n}" aria-label="View photo ${n+1}"><img loading="lazy" src="${asset(src)}" alt="${safeText(p.name)} photo ${n+1}"></button>`).join('')}</div></div><div class="modal-details"><p class="eyebrow">${safeText(p.brand||'NEW BALANCE')}</p><h2>${safeText(p.name)}</h2><div class="product-price modal-price">${money(p.price)}</div><p class="desc">${safeText(p.description||'A clean everyday sneaker selected by Sharif Store for comfort, shape and easy styling.')}</p><div class="size-block"><div class="size-label"><p class="eyebrow">SELECT SIZE</p><span id="sizeHint">37–41 available</span></div><div class="size-grid">${(p.sizes||['37','38','39','40','41']).map(s=>`<button class="size-btn" data-size="${safeText(s)}">${safeText(s)}</button>`).join('')}</div></div><div class="modal-actions"><button id="addToBag" class="primary-btn full" ${p.sold_out?'disabled':''}>${p.sold_out?'Sold out':'Add to bag'} <span>+</span></button><button id="directWhatsApp" class="secondary-btn full">Ask on WhatsApp <span>↗</span></button></div></div></div>`;
  const setImage=n=>{if(!imgs.length)return;index=(n+imgs.length)%imgs.length;$('#modalMainImage').src=asset(imgs[index]);$('#galleryCounter').textContent=`${index+1} / ${imgs.length}`;$$('.thumb').forEach((t,i)=>t.classList.toggle('active',i===index));const active=$$('.thumb')[index];active?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})};
  $('#galleryPrev').onclick=e=>{e.stopPropagation();setImage(index-1)};$('#galleryNext').onclick=e=>{e.stopPropagation();setImage(index+1)};$$('.thumb').forEach(t=>t.onclick=()=>setImage(Number(t.dataset.index)));
  if(imgs.length<2){$('#galleryPrev').hidden=true;$('#galleryNext').hidden=true;$('#galleryCounter').hidden=true}
  let startX=0;const area=$('#mainPhotoArea');area.addEventListener('pointerdown',e=>{startX=e.clientX});area.addEventListener('pointerup',e=>{const d=e.clientX-startX;if(Math.abs(d)>45)setImage(index+(d<0?1:-1))});
  $$('.size-btn').forEach(b=>b.onclick=()=>{selectedSize=b.dataset.size;$$('.size-btn').forEach(x=>x.classList.toggle('active',x===b));$('#sizeHint').textContent=`Size ${selectedSize} selected`;$('#sizeHint').classList.remove('error-text')});
  const add=$('#addToBag');if(add&&!p.sold_out)add.onclick=()=>{if(!selectedSize){$('#sizeHint').textContent='Choose a size first';$('#sizeHint').classList.add('error-text');$('.size-grid').classList.add('attention');setTimeout(()=>$('.size-grid')?.classList.remove('attention'),500);return}addCartItem(p.id,selectedSize);modal.close();openCart()};
  $('#directWhatsApp').onclick=()=>window.open(waLink(`Hi Sharif Store, I want to ask about ${p.name}${selectedSize?` in size ${selectedSize}`:''}.`),'_blank','noopener');
  modal.showModal();setScrollLock();modal._galleryKey=e=>{if(e.key==='ArrowLeft')setImage(index-1);if(e.key==='ArrowRight')setImage(index+1)};document.addEventListener('keydown',modal._galleryKey);
}
function closeProduct(){const m=$('#productModal');if(m._galleryKey){document.removeEventListener('keydown',m._galleryKey);m._galleryKey=null}if(m.open)m.close();setScrollLock()}

function addCartItem(id,size){const existing=state.cart.find(x=>x.id===id&&x.size===size);if(existing)existing.qty=Math.min(9,(existing.qty||1)+1);else state.cart.push({id,size,qty:1});saveCart()}
function saveCart(){localStorage.setItem('sharif-cart',JSON.stringify(state.cart));renderCart()}
function changeQty(i,d){const item=state.cart[i];if(!item)return;item.qty=Math.max(0,Math.min(9,(item.qty||1)+d));if(item.qty===0)state.cart.splice(i,1);saveCart()}
function renderCart(){
  $('#cartCount').textContent=state.cart.reduce((a,x)=>a+(x.qty||1),0);
  $('#cartItems').innerHTML=state.cart.length?state.cart.map((x,n)=>{const p=state.products.find(z=>z.id===x.id);if(!p)return'';return `<div class="cart-row"><img src="${asset(p.gallery?.[0]||'')}" alt="${safeText(p.name)}"><div class="cart-copy"><h4>${safeText(p.name)}</h4><p>Size ${safeText(x.size)}</p><strong>${money(p.price)}</strong><div class="qty-control"><button data-index="${n}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${x.qty||1}</span><button data-index="${n}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-btn" data-index="${n}" aria-label="Remove ${safeText(p.name)}">×</button></div>`}).join(''):'<div class="empty bag-empty"><b>Your bag is empty.</b><span>Pick a pair and choose your size.</span></div>';
  $$('.qty-control button').forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.index),Number(b.dataset.delta)));$$('.remove-btn').forEach(b=>b.onclick=()=>{state.cart.splice(Number(b.dataset.index),1);saveCart()});
  $('#checkoutBtn').disabled=!state.cart.length;
}
function openCart(){renderCart();$('#cartDrawer').classList.add('open');$('#backdrop').classList.add('show');$('#cartDrawer').setAttribute('aria-hidden','false');setScrollLock()}
function closeCart(){$('#cartDrawer').classList.remove('open');$('#backdrop').classList.remove('show');$('#cartDrawer').setAttribute('aria-hidden','true');setScrollLock()}
function waLink(text){return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`}

$('#checkoutBtn').onclick=()=>{if(!state.cart.length)return;const lines=['SHARIF STORE — ORDER REQUEST',''];state.cart.forEach(x=>{const p=state.products.find(z=>z.id===x.id);if(p)lines.push(`${p.name} — Size ${x.size} — Qty ${x.qty||1}`)});lines.push('','Please confirm availability and delivery price.');window.open(waLink(lines.join('\n')),'_blank','noopener')};
$('#cartBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#backdrop').onclick=closeCart;
$('#modalClose').onclick=closeProduct;$('#productModal').addEventListener('close',()=>{const m=$('#productModal');if(m._galleryKey){document.removeEventListener('keydown',m._galleryKey);m._galleryKey=null}setScrollLock()});
$('#searchBtn').onclick=()=>{$('#searchModal').showModal();setScrollLock();setTimeout(()=>$('#searchInput').focus(),30)};$('#searchClose').onclick=()=>$('#searchModal').close();$('#searchModal').addEventListener('close',setScrollLock);
$('#searchInput').oninput=e=>{const q=e.target.value.toLowerCase().trim();const r=q?state.products.filter(p=>`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)):[];$('#searchResults').innerHTML=!q?'':r.length?r.map(p=>`<button class="search-result" data-id="${safeText(p.id)}"><span>${safeText(p.name)}</span><b>${money(p.price)}</b></button>`).join(''):'<div class="empty compact">No matching pairs.</div>';$$('.search-result').forEach(x=>x.onclick=()=>{$('#searchModal').close();openProduct(x.dataset.id)})};
$$('.filter').forEach(b=>b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.filter=b.dataset.filter;renderProducts()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#cartDrawer').classList.contains('open'))closeCart()});
$('#footerWhatsApp').href=waLink('Hi Sharif Store, I have a question.');renderCart();loadProducts();