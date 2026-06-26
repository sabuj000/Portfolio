// theme
const root=document.documentElement, btn=document.getElementById('themeBtn');
const saved=localStorage.getItem('theme'); if(saved) root.setAttribute('data-theme',saved);
const setIcon=()=>{ if(btn) btn.textContent = root.getAttribute('data-theme')==='dark'?'🌙':'☀️'; };
setIcon();
if(btn) btn.addEventListener('click',()=>{
  const t=root.getAttribute('data-theme')==='dark'?'light':'dark';
  root.setAttribute('data-theme',t); localStorage.setItem('theme',t); setIcon();
});

// year
const yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

// mobile menu
const menuBtn=document.getElementById('menuBtn'), navLinks=document.getElementById('navLinks');
if(menuBtn && navLinks){
  const closeMenu=()=>{ navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); menuBtn.textContent='☰'; };
  menuBtn.addEventListener('click',()=>{
    const open=navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',open); menuBtn.textContent=open?'✕':'☰';
  });
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
}

// scroll progress bar
const bar=document.getElementById('progress');
if(bar){
  const onScroll=()=>{ const h=document.documentElement;
    const sc=(h.scrollTop)/(h.scrollHeight-h.clientHeight); bar.style.width=(sc*100)+'%'; };
  document.addEventListener('scroll',onScroll,{passive:true}); onScroll();
}

// reveal on scroll
const io=new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// count-up
const animate=(el)=>{
  const end=parseFloat(el.dataset.count), pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
  const dur=1100, t0=performance.now();
  const step=(t)=>{ const p=Math.min((t-t0)/dur,1); const e=1-Math.pow(1-p,3);
    el.textContent=pre+Math.round(end*e)+suf; if(p<1)requestAnimationFrame(step); };
  requestAnimationFrame(step);
};
const cio=new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ animate(e.target); cio.unobserve(e.target);} }),{threshold:.6});
document.querySelectorAll('.num[data-count]').forEach(el=>cio.observe(el));

// active-section highlighting (index page only)
if(navLinks){
  const linkMap={};
  navLinks.querySelectorAll('a[href^="#"]').forEach(a=>linkMap[a.getAttribute('href').slice(1)]=a);
  if(Object.keys(linkMap).length){
    const secObs=new IntersectionObserver((es)=>es.forEach(e=>{
      const a=linkMap[e.target.id]; if(!a) return;
      if(e.isIntersecting){ Object.values(linkMap).forEach(x=>x.classList.remove('active')); a.classList.add('active'); }
    }),{rootMargin:'-45% 0px -50% 0px'});
    ['impact','work-approach','vision','leadership','journey','skills','contact'].forEach(id=>{
      const el=document.getElementById(id); if(el) secObs.observe(el);
    });
  }
}
