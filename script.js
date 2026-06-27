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

// ---- Intent-aware search ----
// Each entry carries synonyms/intent words in `k` so meaning-based queries match,
// not just literal page text.
const SEARCH_INDEX=[
  {t:"AI agents that cut support cost", p:"impact.html", s:"Autonomous AI agents analyze new & existing support tickets in bulk to proactively fix doc gaps.",
   k:"ai agents support tickets reduce lower cost costs deflection l1 front line proactive reactive automation gaps help desk self-heal how do you reduce support"},
  {t:"Docs tooling that scales without headcount", p:"impact.html", s:"A docs CLI lets engineers author docs — 79% of API doc PRs now come from non-docs engineers.",
   k:"docs as code cli openapi engineers contributors 79 percent bottleneck tooling self serve scale without headcount automation scaffolding pipeline velocity"},
  {t:"AI skills that speed up publishing", p:"impact.html", s:"AI skills draft and update feature docs from any source (Notion, Google Docs, PDF, Jira) — publishing time cut >50%.",
   k:"ai skills gpts drafting updating feature docs notion google docs pdf jira publishing speed faster productivity collaboration output multiply"},
  {t:"Video that speeds onboarding", p:"impact.html", s:"30+ how-to & concept videos every month speed feature onboarding and prospect evaluation.",
   k:"video videos how to concept onboarding adoption training tutorials monthly trainn camtasia evaluation prospects self serve learning"},
  {t:"Knowledge-base migration & self-serve", p:"impact.html", s:"Migrated 1,800+ articles; engagement +12%, page views 2×, copy-fix requests −45%.",
   k:"knowledge base kb migration self serve findability engagement page views support load articles audit standardize"},
  {t:"Release-notes automation", p:"impact.html", s:"Cut release-notes effort ~8 hrs → ~15 min with API docs as the single source of truth.",
   k:"release notes changelog automation single source of truth broken links accuracy engineering time efficiency"},
  {t:"Leadership & influence", p:"leadership.html", s:"Lead people and initiatives alike — visibility, ownership, coaching, and growth paths.",
   k:"leadership manager management team lead people delegate coach mentor grow reports influence steering communicate up"},
  {t:"Hands-on — I write what I lead", p:"leadership.html", s:"A player-coach who personally owns features as the writer, not just a people manager.",
   k:"hands on player coach walk the talk write features owner individual contributor ic not just manager craft builder do the work"},
  {t:"Data-driven decisions", p:"leadership.html", s:"Track performance monthly and compare month-over-month and quarter-over-quarter to decide next actions.",
   k:"data driven decisions metrics analytics monthly quarterly track performance action items numbers evidence measure prove"},
  {t:"Vision — where docs is heading", p:"vision.html", s:"Docs as the backbone of AI, signal-driven proactive docs, and docs that prove their ROI.",
   k:"vision future roadmap ai backbone llm mcp proactive self healing roi growth bets where headed forward thinking anticipate tomorrow"},
  {t:"Strategy & governance", p:"approach.html", s:"Roadmap, site structure, ISO standards, document control, and a 95%-compliant style guide.",
   k:"strategy governance information architecture site structure iso standards document control accessibility style guide editorial"},
  {t:"Docs-as-code platform", p:"approach.html", s:"Markdown/MDX in Git with PR review, CI checks, and previews — run like software.",
   k:"docs as code git markdown mdx ci cd pull request review preview versioned platform workflow"},
  {t:"Analytics & how AI reads docs", p:"approach.html", s:"GA4, Pendo, FullStory, Looker Studio, Splunk — plus analysis of how AI bots and LLMs read docs.",
   k:"analytics ga4 pendo fullstory looker studio splunk dashboard data measure llm crawl bots how ai reads"},
  {t:"Documentation tied to revenue", p:"approach.html", s:"In-app banners move users to demos and sign-ups; docs connected to the sales pipeline.",
   k:"revenue pipeline adoption sales self serve banners crm growth business outcomes demos sign ups conversion"},
  {t:"Cross-functional collaboration", p:"approach.html", s:"Partner with Product, Go-to-Market, Marketing, Support, Engineering, Design, and Developer Experience.",
   k:"cross functional collaboration product gtm go to market marketing support engineering design developer experience stakeholders partner teams leadership"},
  {t:"Continuous content audits", p:"approach.html", s:"Review older docs for accuracy so people, LLMs, and MCP-based AI tools stay precise during onboarding.",
   k:"audit audits review historical legacy accuracy freshness correctness llm mcp agents onboarding precision trust quality"},
  {t:"Career & experience", p:"experience.html", s:"From technical writer to documentation leader across Chargebee, Capillary, Netradyne and more.",
   k:"experience career history timeline jobs roles chargebee capillary netradyne alternative minds freebalance work background years progression"},
  {t:"Education", p:"experience.html", s:"MCA and BCA in Information Technology, West Bengal University of Technology.",
   k:"education degree mca bca university qualification study computer applications information technology"},
  {t:"Tools & stack", p:"skills.html", s:"Docs-as-code, AI & automation, analytics, visual/process tools, and code.",
   k:"skills tools stack technologies openapi postman html css javascript typescript json xml mermaid figma camtasia snagit"},
  {t:"AI-ready / LLM-friendly content", p:"vision.html", s:"Content structured so one source serves people, search, and in-product AI assistants.",
   k:"ai ready llm friendly content structure retrieval search copilots in product assistants mcp agents"},
  {t:"Who is Sabuj — values & what I look for", p:"index.html#top", s:"A problem-solver and builder, flexible across lead-IC and leadership roles, drawn to hard problems and learning.",
   k:"who is sabuj about problem solver builder values philosophy what i look for role flexible challenge learning not only work passion approach mindset goals motivation hire fit"},
  {t:"Contact", p:"index.html#contact", s:"Reach out by email or LinkedIn.",
   k:"contact email linkedin hire reach connect get in touch message"}
];

(function setupSearch(){
  const navRight=document.querySelector('.nav-right');
  if(!navRight) return;
  // trigger button
  const sBtn=document.createElement('button');
  sBtn.className='toggle'; sBtn.id='searchBtn'; sBtn.setAttribute('aria-label','Search'); sBtn.textContent='🔍';
  navRight.insertBefore(sBtn, navRight.firstChild);
  // overlay
  const ov=document.createElement('div');
  ov.className='search-overlay'; ov.id='searchOverlay';
  ov.innerHTML=
    '<div class="search-modal" role="dialog" aria-label="Search">'
    +'<div class="search-top"><span class="si">🔍</span>'
    +'<input class="search-input" id="searchInput" type="text" placeholder="Search by topic or question — e.g. “how do you cut support cost?”" autocomplete="off">'
    +'<span class="search-esc">Esc</span></div>'
    +'<div class="search-results" id="searchResults"></div>'
    +'<div class="search-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span><span><kbd>↵</kbd> to open</span><span>Tip: ask in plain words</span></div>'
    +'</div>';
  document.body.appendChild(ov);
  const input=ov.querySelector('#searchInput'), results=ov.querySelector('#searchResults');
  let sel=-1, current=[];

  const open=()=>{ ov.classList.add('open'); input.value=''; render(''); input.focus(); };
  const close=()=>{ ov.classList.remove('open'); sel=-1; };
  sBtn.addEventListener('click',open);
  ov.addEventListener('click',e=>{ if(e.target===ov) close(); });

  function score(entry, terms, q){
    let sc=0; const t=entry.t.toLowerCase(), k=entry.k.toLowerCase(), s=entry.s.toLowerCase();
    if(q.length>2 && (t.includes(q)||k.includes(q)||s.includes(q))) sc+=4;
    terms.forEach(term=>{
      if(!term) return;
      if(t.includes(term)) sc+=3;
      if(k.includes(term)) sc+=2;
      if(s.includes(term)) sc+=1;
    });
    return sc;
  }
  function render(q){
    q=q.trim().toLowerCase();
    const terms=q.split(/\s+/).filter(w=>w.length>1);
    let list;
    if(!q){ list=SEARCH_INDEX.slice(0,8); }
    else{
      list=SEARCH_INDEX.map(e=>({e,sc:score(e,terms,q)})).filter(x=>x.sc>0)
        .sort((a,b)=>b.sc-a.sc).slice(0,8).map(x=>x.e);
    }
    current=list; sel=-1;
    if(!list.length){ results.innerHTML='<div class="search-empty">No matches. Try a topic like “AI”, “leadership”, “metrics”, or “support cost”.</div>'; return; }
    results.innerHTML=list.map((e,i)=>
      '<a class="search-result" data-i="'+i+'" href="'+e.p+'">'
      +'<div class="r-page">'+e.p.replace('.html','').replace('index#','').replace('#',' › ')+'</div>'
      +'<div class="r-title">'+e.t+'</div><div class="r-snip">'+e.s+'</div></a>').join('');
  }
  function move(d){
    if(!current.length) return;
    sel=(sel+d+current.length)%current.length;
    results.querySelectorAll('.search-result').forEach((el,i)=>el.classList.toggle('sel',i===sel));
    const cur=results.querySelector('.sel'); if(cur) cur.scrollIntoView({block:'nearest'});
  }
  input.addEventListener('input',()=>render(input.value));
  input.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'){ e.preventDefault(); move(1); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); move(-1); }
    else if(e.key==='Enter'){ const target=current[sel<0?0:sel]; if(target) window.location.href=target.p; }
    else if(e.key==='Escape'){ close(); }
  });
  document.addEventListener('keydown',e=>{
    if((e.key==='/'|| (e.key.toLowerCase()==='k'&&(e.metaKey||e.ctrlKey))) && !ov.classList.contains('open')){
      const tag=(document.activeElement&&document.activeElement.tagName)||'';
      if(tag==='INPUT'||tag==='TEXTAREA') return;
      e.preventDefault(); open();
    } else if(e.key==='Escape'){ close(); }
  });
})();

// active-section highlighting (index page only)
if(navLinks){
  const linkMap={};
  navLinks.querySelectorAll('a[href^="#"]').forEach(a=>linkMap[a.getAttribute('href').slice(1)]=a);
  if(Object.keys(linkMap).length){
    const secObs=new IntersectionObserver((es)=>es.forEach(e=>{
      const a=linkMap[e.target.id]; if(!a) return;
      if(e.isIntersecting){ Object.values(linkMap).forEach(x=>x.classList.remove('active')); a.classList.add('active'); }
    }),{rootMargin:'-45% 0px -50% 0px'});
    ['impact','work-approach','work-samples','vision','leadership','journey','skills','contact'].forEach(id=>{
      const el=document.getElementById(id); if(el) secObs.observe(el);
    });
  }
}
