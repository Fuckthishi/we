(()=>{
  let gesture=null;
  const areaFor=e=>e.target.closest?.('#mainPhotoArea');
  document.addEventListener('pointerdown',e=>{
    const area=areaFor(e);
    if(!area||e.target.closest('.gallery-arrow'))return;
    gesture={area,id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,axis:null};
    area.style.touchAction='none';
    try{area.setPointerCapture(e.pointerId)}catch{}
    e.stopImmediatePropagation();
  },true);
  document.addEventListener('pointermove',e=>{
    if(!gesture||e.pointerId!==gesture.id)return;
    const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
    gesture.lastX=e.clientX;gesture.lastY=e.clientY;
    if(!gesture.axis&&Math.hypot(dx,dy)>10)gesture.axis=Math.abs(dx)>Math.abs(dy)*1.15?'x':'y';
    const stage=document.querySelector('.product-stage');
    const modal=document.querySelector('#productModal');
    if(gesture.axis==='y'&&dy>0&&window.innerWidth<=800&&stage){
      const d=Math.min(dy,150);
      stage.style.transform=`translateY(${d}px) scale(${1-d/2500})`;
      modal?.style.setProperty('--drag-opacity',String(Math.max(.15,1-dy/350)));
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  },true);
  const finish=e=>{
    if(!gesture||e.pointerId!==gesture.id)return;
    const dx=(e.clientX??gesture.lastX)-gesture.x,dy=(e.clientY??gesture.lastY)-gesture.y;
    const axis=gesture.axis;
    const stage=document.querySelector('.product-stage');
    const modal=document.querySelector('#productModal');
    if(stage)stage.style.transform='';
    modal?.style.removeProperty('--drag-opacity');
    gesture.area.style.touchAction='none';
    try{gesture.area.releasePointerCapture(e.pointerId)}catch{}
    gesture=null;
    e.preventDefault();e.stopImmediatePropagation();
    if(axis==='x'&&Math.abs(dx)>38){
      document.querySelector(dx<0?'#galleryNext':'#galleryPrev')?.click();
      return;
    }
    if(axis==='y'&&dy>125&&Math.abs(dy)>Math.abs(dx)*1.2&&window.innerWidth<=800){
      if(typeof animateClose==='function')animateClose(modal);else modal?.close();
    }
  };
  document.addEventListener('pointerup',finish,true);
  document.addEventListener('pointercancel',e=>{
    if(!gesture||e.pointerId!==gesture.id)return;
    const stage=document.querySelector('.product-stage');if(stage)stage.style.transform='';
    document.querySelector('#productModal')?.style.removeProperty('--drag-opacity');
    gesture=null;
  },true);
})();