/* RUMI PORTFOLIO — script.js */
'use strict';

/* ── render everything from data object ── */
function renderSite(D){
  renderHero(D.hero);
  renderProjects(D.projects);
  renderServices(D.services);
  renderExperience(D.experience);
  renderAbout(D.about);
  renderContact(D.contact);
  renderFooter(D.contact, D.about);
  initScrollReveal();
}

/* HERO */
function renderHero(h){
  if(!h)return;
  const nameEl=document.getElementById('s-name');
  if(nameEl) nameEl.textContent=h.name||'';
  const subEl=document.getElementById('s-subtitle');
  if(subEl) subEl.innerHTML=(h.subtitle||'').replace(/\n/g,'<br>');
  const bodyEl=document.getElementById('s-body');
  if(bodyEl) bodyEl.innerHTML=h.body||'';
  const tagEl=document.getElementById('s-tagline');
  if(tagEl) tagEl.textContent=h.tagline||'';
  const cta=document.getElementById('s-cta');
  if(cta){ if(h.ctaText)cta.textContent=h.ctaText; if(h.ctaHref)cta.href=h.ctaHref; }
  const logo=document.getElementById('s-logo');
  if(logo) logo.innerHTML=(h.name||'RUMI')+' <span class="nav-logo-dot"></span>';
}

/* PROJECT GRID */
const COVER_SHADES=['#0d1117','#16181d','#111418','#0e1015','#131618','#111315'];
const THUMB_SHADES=['#1a1a1a','#161c22','#181818','#151a1f','#1c1c1c','#141414'];
const FILM=`<svg width="44" height="44" viewBox="0 0 52 52" fill="none"><rect x="4" y="10" width="44" height="32" rx="3" stroke="currentColor" stroke-width="1.5"/><polygon points="20,18 20,34 36,26" fill="currentColor"/><rect x="4" y="6" width="5" height="4" rx="1" fill="currentColor"/><rect x="43" y="6" width="5" height="4" rx="1" fill="currentColor"/><rect x="4" y="42" width="5" height="4" rx="1" fill="currentColor"/><rect x="43" y="42" width="5" height="4" rx="1" fill="currentColor"/></svg>`;
const PLAY=`<svg viewBox="0 0 18 18"><polygon points="4,2 4,16 16,9" fill="currentColor"/></svg>`;

function renderProjects(projects){
  const grid=document.getElementById('projects-grid');
  if(!grid||!projects)return;
  grid.innerHTML='';
  projects.forEach((p,i)=>{
    const card=document.createElement('div');
    card.className='project-card reveal';
    const th=p.cover?`<img src="${p.cover}" alt="${p.title||p.client}" loading="lazy"/>`:`<div class="card-thumb-ph" style="background:${COVER_SHADES[i%COVER_SHADES.length]};color:#333">${FILM}</div>`;
    const vc=(p.videos||[]).length;
    const tags=(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
    card.innerHTML=`
      <div class="card-thumb">
        ${th}
        <div class="card-view-overlay"><span class="card-view-pill">View Project</span></div>
        ${vc>0?`<span style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.7);padding:2px 8px;border-radius:100px;font-size:.6rem;font-weight:600;color:#8a8a8a">${vc} video${vc>1?'s':''}</span>`:''}
      </div>
      <div class="card-meta">
        <div class="card-client">${p.client||''}</div>
        <div style="font-size:.9rem;font-weight:600;color:var(--text);margin-bottom:2px">${p.title||p.client||''}</div>
        <div class="card-role">${p.primaryRole||''}</div>
        <div class="card-tags">${tags}</div>
      </div>`;
    card.addEventListener('click',()=>openProjectPage(p,i));
    grid.appendChild(card);
  });
  initScrollReveal();
}

/* PROJECT DETAIL PAGE */
const projPage=document.getElementById('project-page');
let _prevScroll=0;

function openProjectPage(p,ci){
  const heroImg=document.getElementById('pp-hero-img');
  const heroPh=document.getElementById('pp-hero-ph');
  if(heroImg&&heroPh){
    if(p.cover){heroImg.src=p.cover;heroImg.style.display='block';heroPh.style.display='none';}
    else{heroImg.style.display='none';heroPh.style.display='flex';}
  }
  const setT=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v||'';};
  setT('pp-eyebrow-text',p.client);
  setT('pp-title-text',p.title||p.client);
  setT('pp-bar-right-text',p.client);

  const roles=[...new Set((p.videos||[]).map(v=>v.role).filter(Boolean))];
  const metaEl=document.getElementById('pp-meta');
  if(metaEl) metaEl.innerHTML=[
    {l:'Client',v:p.client||''},
    {l:'My Role',v:roles.join(' · ')||''},
    {l:'Videos',v:(p.videos||[]).length+''},
    {l:'Services',v:(p.tags||[]).join(', ')||''},
  ].map(m=>`<div><div class="pp-meta-label">${m.l}</div><div class="pp-meta-val">${m.v}</div></div>`).join('');

  const vids=p.videos||[];
  const vidLabel=document.getElementById('pp-vid-label');
  if(vidLabel) vidLabel.textContent=vids.length?`${vids.length} Video${vids.length>1?'s':''}`:'' ;

  const vidCon=document.getElementById('pp-vid-container');
  if(vidCon){
    const layout=p.layout||'horizontal';
    let gc='vid-grid-h';
    if(layout==='vertical')gc='vid-grid-v';
    if(layout==='mixed')gc='vid-grid-m';
    if(vids.length===0){
      vidCon.innerHTML=`<div class="${gc}"><div class="vid-empty">No videos yet. Open the editor (pencil button) to add Vimeo IDs and thumbnails.</div></div>`;
    } else {
      vidCon.innerHTML=`<div class="${gc}">${vids.map((v,vi)=>{
        const can=!!v.vimeoId;
        const orient=layout==='mixed'?(v.orientation||'horizontal'):layout;
        const isV=orient==='vertical';
        const tH=v.thumb?`<img src="${v.thumb}" alt="${v.name||''}" loading="lazy"/>`:`<div class="vid-thumb-ph" style="background:${THUMB_SHADES[(ci+vi)%THUMB_SHADES.length]};color:#333">${FILM}</div>`;
        return `<div class="vid-tile${can?' playable':''}"${can?` data-id="${v.vimeoId}" data-orient="${orient}" data-name="${(v.name||'').replace(/"/g,'&quot;')}" data-role="${(v.role||'').replace(/"/g,'&quot;')}"`:''}>
          <div class="vid-thumb ${isV?'r916':'r169'}">${tH}${can?`<div class="vid-play-ov"><div class="vid-play-btn">${PLAY}</div></div>`:''}</div>
          <div class="vid-info"><div class="vid-name">${v.name||''}</div><div class="vid-role">${v.role||''}</div></div>
        </div>`;
      }).join('')}</div>`;
    }
    vidCon.querySelectorAll('.vid-tile.playable').forEach(t=>{
      t.addEventListener('click',()=>openLightbox(t.dataset.id,t.dataset.name,t.dataset.role,t.dataset.orient));
    });
  }

  _prevScroll=window.scrollY;
  document.body.style.overflow='hidden';
  projPage.classList.add('open');
  projPage.scrollTop=0;
}

function closeProjectPage(){
  projPage.classList.remove('open');
  document.body.style.overflow='';
  window.scrollTo(0,_prevScroll);
}
document.getElementById('pp-back-btn')?.addEventListener('click',closeProjectPage);

/* LIGHTBOX */
const modal=document.getElementById('lightbox');
const mFrame=document.getElementById('lb-frame');

function openLightbox(id,name,role,orient){
  const isV=orient==='vertical';
  document.getElementById('lb-wrap').className='lb-wrap'+(isV?' lb-v':'');
  document.getElementById('lb-ratio').className='lb-ratio '+(isV?'r916':'r169');
  mFrame.src=`https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
  const t=document.getElementById('lb-title'); if(t)t.textContent=name||'';
  const r=document.getElementById('lb-role'); if(r)r.textContent=role||'';
  modal.classList.add('open');
}
function closeLightbox(){
  modal.classList.remove('open');
  mFrame.src='';
}
document.getElementById('lb-close-btn')?.addEventListener('click',closeLightbox);
modal?.addEventListener('click',e=>{if(e.target===modal)closeLightbox();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(modal?.classList.contains('open'))closeLightbox();
    else if(projPage?.classList.contains('open'))closeProjectPage();
  }
});

/* SERVICES */
function renderServices(services){
  const g=document.getElementById('services-grid');
  if(!g||!services)return;
  g.innerHTML=services.map(s=>`
    <div class="service-card">
      <div class="service-icon">${s.icon||'◎'}</div>
      <div class="service-name">${s.name||''}</div>
      <p class="service-desc">${s.desc||''}</p>
    </div>`).join('');
}

/* EXPERIENCE */
function renderExperience(exp){
  const l=document.getElementById('exp-list');
  if(!l||!exp)return;
  l.innerHTML=exp.map(e=>`
    <div class="exp-row">
      <div class="exp-logo">
        ${e.logo?`<img src="${e.logo}" alt="${e.company||''}" loading="lazy"/>`:`<div class="exp-logo-ph">${(e.company||'').slice(0,3).toUpperCase()}</div>`}
      </div>
      <div class="exp-body">
        <div class="exp-role">${e.role||''}</div>
        <div class="exp-company">${e.company||''}</div>
      </div>
      <div class="exp-period">${e.period||''}</div>
    </div>`).join('');
}

/* ABOUT */
function renderAbout(a){
  if(!a)return;
  const ph=document.getElementById('about-photo');
  if(ph) ph.innerHTML=a.photo?`<img src="${a.photo}" alt="${a.name||''}" loading="lazy"/>`:'';
  const setT=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v||'';};
  setT('about-name-cap',a.name);
  setT('about-heading',a.heading);
  const bio=document.getElementById('about-bio');
  if(bio) bio.innerHTML=(a.bio||'').split('\n\n').map(p=>`<p>${p}</p>`).join('');
  const sk=document.getElementById('about-skills');
  if(sk&&a.skills) sk.innerHTML=a.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('');
}

/* CONTACT */
function renderContact(c){
  if(!c)return;
  const setT=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v||'';};
  setT('contact-heading',c.heading);
  setT('contact-sub',c.sub);
  const btn=document.getElementById('contact-email-btn');
  if(btn)btn.href=`mailto:${c.email||''}`;
  const links=document.getElementById('contact-links');
  if(!links)return;
  links.innerHTML=[
    {k:'Email',    v:c.email,    h:`mailto:${c.email}`},
    {k:'LinkedIn', v:(c.linkedin||'').replace('https://www.linkedin.com/in/','').replace('/',''), h:c.linkedin},
    {k:'Vimeo',    v:(c.vimeo||'').replace('https://',''),    h:c.vimeo},
    {k:'Behance',  v:(c.behance||'').replace('https://www.',''), h:c.behance},
  ].filter(r=>r.h).map(r=>`
    <a href="${r.h}" target="${r.h.startsWith('mailto')?'_self':'_blank'}" rel="noopener" class="contact-link-row">
      <div><div class="contact-link-key">${r.k}</div><div class="contact-link-val">${r.v}</div></div>
      <span class="contact-link-arrow">&#8594;</span>
    </a>`).join('');
}

/* FOOTER */
function renderFooter(c,a){
  const copy=document.getElementById('footer-copy');
  if(copy)copy.textContent=`© ${new Date().getFullYear()} ${(a&&a.name)||'RUMI'}`;
  const fl=document.getElementById('footer-links');
  if(fl&&c) fl.innerHTML=[
    c.linkedin&&`<a href="${c.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`,
    c.vimeo&&`<a href="${c.vimeo}" target="_blank" rel="noopener">Vimeo</a>`,
    c.behance&&`<a href="${c.behance}" target="_blank" rel="noopener">Behance</a>`,
  ].filter(Boolean).join('');
}

/* NAV */
const burger=document.getElementById('nav-burger');
const navLinks=document.getElementById('nav-links');
if(burger&&navLinks){
  burger.addEventListener('click',()=>{
    const open=navLinks.classList.toggle('open');
    burger.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',String(open));
  });
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    navLinks.classList.remove('open');
    burger.classList.remove('open');
  }));
}
window.addEventListener('scroll',()=>{
  let cur='';
  document.querySelectorAll('section[id]').forEach(s=>{if(window.scrollY>=s.offsetTop-80)cur=s.id;});
  navLinks?.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
},{passive:true});

/* SCROLL REVEAL */
let revIO;
function initScrollReveal(){
  if(revIO)revIO.disconnect();
  revIO=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revIO.unobserve(e.target);}});
  },{threshold:.1});
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>revIO.observe(el));
}
