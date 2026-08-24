(()=>{
  const base530=['assets/products/IMG_0441.jpg','assets/products/IMG_0447.png','assets/products/IMG_0448.png','assets/products/IMG_0450.png','assets/products/IMG_0451.png'];
  const white=Array.isArray(window.WHITE_GALLERY)?window.WHITE_GALLERY:[];
  const aero=window.AIR_GALLERIES&&typeof window.AIR_GALLERIES==='object'?Object.values(window.AIR_GALLERIES).flat():[];
  const all=[...new Set([...base530,...white,...aero].filter(Boolean))];
  const warm=new Set();
  const preload=src=>{
    if(!src||warm.has(src))return;
    warm.add(src);
    const img=new Image();
    img.decoding='async';
    img.fetchPriority='low';
    img.src=src;
  };
  // Warm the first image for each visible product immediately.
  [base530[0],aero[0]].filter(Boolean).forEach(src=>{
    const link=document.createElement('link');
    link.rel='preload';link.as='image';link.href=src;link.fetchPriority='high';document.head.appendChild(link);
  });
  // Cache the remaining gallery images gradually after the page becomes idle.
  const queue=all.filter(src=>!warm.has(src));
  const run=deadline=>{
    let count=0;
    while(queue.length&&count<3&&(!deadline||deadline.timeRemaining()>5)){
      preload(queue.shift());count++;
    }
    if(queue.length){
      if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:1800});
      else setTimeout(()=>run(null),350);
    }
  };
  if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:1200});
  else setTimeout(()=>run(null),700);

  // When the customer shows intent to open a product, warm several images immediately.
  document.addEventListener('pointerover',e=>{
    const card=e.target.closest?.('.product-card');if(!card)return;
    const cards=[...document.querySelectorAll('.product-card')];
    const i=cards.indexOf(card);
    const group=i===0?[...base530,...white]:aero;
    group.slice(0,5).forEach(preload);
  },{passive:true});
  document.addEventListener('touchstart',e=>{
    const card=e.target.closest?.('.product-card');if(!card)return;
    const cards=[...document.querySelectorAll('.product-card')];
    const i=cards.indexOf(card);
    const group=i===0?[...base530,...white]:aero;
    group.slice(0,5).forEach(preload);
  },{passive:true});

  if('serviceWorker'in navigator){
    addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}),{once:true});
  }
})();