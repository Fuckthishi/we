(()=>{
  const root=document.getElementById('modalContent');
  if(!root)return;
  const reorder=()=>{
    const details=root.querySelector('.modal-details');
    if(!details)return;
    const blocks=[...details.querySelectorAll(':scope > .size-block')];
    const color=blocks.find(b=>(b.querySelector('.size-label .eyebrow')?.textContent||'').trim().toUpperCase()==='SELECT COLOR');
    const size=blocks.find(b=>(b.querySelector('.size-label .eyebrow')?.textContent||'').trim().toUpperCase()==='SELECT SIZE');
    const brand=[...details.children].find(el=>el.matches('.eyebrow'));
    const title=details.querySelector(':scope > h2');
    if(color){color.classList.add('color-section');details.insertBefore(color,details.firstElementChild)}
    if(size){size.classList.add('size-section');details.insertBefore(size,brand||title||color?.nextSibling||null)}
    if(color&&size&&color.nextElementSibling!==size)details.insertBefore(size,color.nextElementSibling);
  };
  const observer=new MutationObserver(()=>queueMicrotask(reorder));
  observer.observe(root,{childList:true,subtree:true});
  reorder();
})();