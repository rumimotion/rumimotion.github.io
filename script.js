/* RUMI PORTFOLIO  script.js */
'use strict';

function renderSite(D){ window._D=D;
  renderHero(D.hero);
  renderProjects(D.projects);
  renderServices(D.services);
  renderExperience(D.experience);
  renderAbout(D.about);
  renderContact(D.contact);
  renderFooter(D.contact, D.about);
  initScrollReveal();
}

/* ── HERO ─────────────────────────────────────────────────── */
function renderHero(h){
  if(!h)return;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v||'';};
  const html=(id,v)=>{const e=document.getElementById(id);if(e)e.innerHTML=v||'';};
  set('s-name', h.name);
  html('s-subtitle', (h.subtitle||'').replace(/\n/g,'<br>'));
  html('s-body', h.body||'');
  set('s-tagline', h.tagline||'');
  const cta=document.getElementById('s-cta');
  if(cta){ if(h.ctaText)cta.textContent=h.ctaText; if(h.ctaHref)cta.href=h.ctaHref; }
  const logo=document.getElementById('s-logo');
  if(logo) logo.innerHTML=(h.name||'RUMI')+' <span class="nav-logo-dot"></span>';
  renderHeroReel(h);
}

function renderHeroReel(h){
  const frame=document.getElementById('hero-reel'); if(!frame)return;
  const ph=document.getElementById('hero-reel-ph');
  const vid=h.reelVimeoId||''; const yt=h.reelYoutubeId||''; const thumb=h.reelThumb||'';
  if(!vid&&!yt){ if(ph)ph.style.display='flex'; return; }
  if(ph)ph.style.display='none';
  const autoThumb=(!thumb&&yt)?'https://img.youtube.com/vi/'+yt+'/maxresdefault.jpg':thumb;
  const tHTML=autoThumb?`<img src="${autoThumb}" alt="Showreel" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0"/>`:'';
  frame.innerHTML=tHTML+`<div class="hero-reel-play-btn" onclick="openHeroReel()"><div class="hero-reel-play-circle"><svg viewBox="0 0 18 18"><polygon points="4,2 4,16 16,9" fill="currentColor"/></svg></div></div>`;
  if(vid&&!thumb&&!yt){
    fetchVimeoThumb(vid,null).then(url=>{
      if(url){
        const img=document.createElement('img');
        img.src=url; img.alt='Showreel';
        img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0';
        frame.insertBefore(img,frame.firstChild);
      }
    });
  }
}
window.openHeroReel=function(){
  const h=window._D&&window._D.hero?window._D.hero:null; if(!h)return;
  const id=h.reelVimeoId||h.reelYoutubeId;
  if(id)openLightbox(id,'Showreel','Motion Designer & Video Editor','horizontal',h.reelVimeoId?'vimeo':'youtube');
};

/* ── VIMEO THUMBNAIL (auto, high-res) ──────────────────────── */
async function fetchVimeoThumb(id, elemId){
  try{
    const res=await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1920`);
    const data=await res.json();
    if(!data.thumbnail_url) return null;
    // Try to get highest resolution by replacing the size suffix
    const hiRes=data.thumbnail_url.replace(/_\d+$/, '_1920');
    if(elemId){
      const img=document.getElementById(elemId);
      const ph=document.getElementById(elemId+'-ph');
      if(img){
        const show=()=>{ img.removeAttribute('style'); img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top'; if(ph)ph.style.display='none'; };
        img.onload=show;
        img.onerror=()=>{ img.onerror=show; img.src=data.thumbnail_url; };
        img.src=hiRes;
      }
    }
    return hiRes;
  }catch(e){ return null; }
}

/* ── TIKTOK THUMBNAIL (auto via oEmbed) ────────────────────── */
async function fetchTikTokThumb(id, elemId){
  try{
    // TikTok oEmbed — returns thumbnail_url
    const res=await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/video/${id}`);
    const data=await res.json();
    if(!data.thumbnail_url) return null;
    if(elemId){
      const img=document.getElementById(elemId);
      const ph=document.getElementById(elemId+'-ph');
      if(img){
        const show=()=>{ img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top'; if(ph)ph.style.display='none'; };
        img.onload=show;
        img.onerror=show;
        img.src=data.thumbnail_url;
      }
    }
    return data.thumbnail_url;
  }catch(e){ return null; }
}

/* ── PROJECT GRID ──────────────────────────────────────────── */
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
    const th=p.cover
      ?`<img src="${p.cover}" alt="${p.client}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>`
      :`<div class="card-thumb-ph" style="background:${COVER_SHADES[i%COVER_SHADES.length]};color:#333;position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${FILM}</div>`;
    const tags=(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
    card.innerHTML=`
      <div class="card-thumb">
        ${th}
        <div class="card-view-overlay"><span class="card-view-pill">View Project</span></div>
      </div>
      <div class="card-meta">
        <div class="card-title">${p.client||''}</div>
        <div class="card-role">${p.primaryRole||''}</div>
        <div class="card-tags">${tags}</div>
      </div>`;
    card.addEventListener('click',()=>openProjectPage(p,i));
    grid.appendChild(card);
  });
  initScrollReveal();
}

/* ── PROJECT DETAIL PAGE ───────────────────────────────────── */
const projPage=document.getElementById('project-page');
let _prevScroll=0;

function openProjectPage(p,ci){
  const heroImg=document.getElementById('pp-hero-img');
  const heroPh=document.getElementById('pp-hero-ph');
  if(heroImg&&heroPh){
    if(p.cover){heroImg.src=p.cover;heroImg.style.display='block';heroPh.style.display='none';}
    else{heroImg.style.display='none';heroPh.style.display='flex';}
  }
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v||'';};
  set('pp-eyebrow-text',p.client);
  set('pp-title-text',p.title||p.client);
  set('pp-bar-right-text',p.client);

  const roles=[...new Set((p.videos||[]).map(v=>v.role).filter(Boolean))];
  const metaEl=document.getElementById('pp-meta');
  if(metaEl) metaEl.innerHTML=[
    {l:'Client',  v:p.client||''},
    {l:'My Role', v:p.primaryRole||roles[0]||''},
    {l:'Services',v:(p.tags||[]).join(', ')||''},
  ].filter(m=>m.v).map(m=>`<div><div class="pp-meta-label">${m.l}</div><div class="pp-meta-val">${m.v}</div></div>`).join('');

  const descEl=document.getElementById('pp-description');
  if(descEl){ if(p.description){descEl.style.display='block';descEl.innerHTML=p.description;}else{descEl.style.display='none';} }

  const vids=p.videos||[];
  const vidLabel=document.getElementById('pp-vid-label');
  if(vidLabel) vidLabel.textContent='';

  const vidCon=document.getElementById('pp-vid-container');
  if(vidCon){
    const layout=p.layout||'horizontal';
    const hasV=(p.videos||[]).some(v=>v.orientation==='vertical');
    const hasH=(p.videos||[]).some(v=>!v.orientation||v.orientation==='horizontal');
    let gc;
    if(layout==='vertical'||(!hasH&&hasV)) gc='vid-grid-v';
    else if(layout==='mixed'||hasV) gc='vid-grid-m';
    else gc='vid-grid-h';

    if(vids.length===0){
      vidCon.innerHTML=`<div class="${gc}"><div class="vid-empty">No videos yet — add Vimeo IDs via the editor.</div></div>`;
    } else {
      vidCon.innerHTML=`<div class="${gc}">${vids.map((v,vi)=>{
        const can=!!(v.vimeoId||v.youtubeId||v.tiktokId||v.imageUrl);
        const platform=v.vimeoId?'vimeo':v.tiktokId?'tiktok':v.imageUrl?'image':'youtube';
        const playId=v.vimeoId||v.tiktokId||v.youtubeId||v.imageUrl||'';
        const orient=v.orientation||'horizontal';
        const isV=orient==='vertical';
        const ratio=isV?'r916':'r169';
        const ytThumb=(!v.thumb&&v.youtubeId)?`https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`:'';
        const imgThumb=(!v.thumb&&v.imageUrl)?v.imageUrl:'';
        const tid=`vt-${ci}-${vi}`;
        const thumbSrc=v.thumb||ytThumb||imgThumb;
        const imgStyle=`position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center ${isV?'top':'center'}`;
        let tH;
        if(thumbSrc){
          tH=`<img src="${thumbSrc}" alt="${v.name||''}" loading="lazy" style="${imgStyle}" onerror="if(this.src.includes('maxresdefault')){this.src=this.src.replace('maxresdefault','hqdefault')}else{this.style.display='none'}"/>`;
        } else if(v.vimeoId){
          tH=`<div class="vid-ph" id="${tid}-ph" style="position:absolute;inset:0;background:${THUMB_SHADES[(ci+vi)%THUMB_SHADES.length]};color:#333;display:flex;align-items:center;justify-content:center">${FILM}</div><img id="${tid}" src="" alt="" style="${imgStyle};display:none"/>`;
        } else if(v.tiktokId){
          tH=`<div class="vid-ph" id="${tid}-ph" style="position:absolute;inset:0;background:${THUMB_SHADES[(ci+vi)%THUMB_SHADES.length]};color:#333;display:flex;align-items:center;justify-content:center">${FILM}</div><img id="${tid}" src="" alt="" style="${imgStyle};display:none"/>`;
        } else if(v.imageUrl){
          tH=`<img src="${v.imageUrl}" alt="${v.name||''}" loading="lazy" style="${imgStyle}"/>`;
        } else {
          tH=`<div class="vid-ph" style="position:absolute;inset:0;background:${THUMB_SHADES[(ci+vi)%THUMB_SHADES.length]};color:#333;display:flex;align-items:center;justify-content:center">${FILM}</div>`;
        }
        return `<div class="vid-tile${can?' playable':''}"${can?` data-id="${playId}" data-platform="${platform}" data-orient="${orient}" data-name="${(v.name||'').replace(/"/g,'&quot;')}" data-role="${(v.role||'').replace(/"/g,'&quot;')}"`:''}>
          <div class="vid-thumb ${ratio}">${tH}${can&&platform!=='image'?`<div class="vid-play-ov"><div class="vid-play-btn">${PLAY}</div></div>`:can?`<div class="vid-play-ov"><div class="vid-play-btn" style="background:rgba(10,10,10,.7)"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" style="width:15px;height:15px;color:var(--green)"><rect x="2" y="2" width="14" height="14" rx="2"/><path d="M6 6h6M6 9h6M6 12h4"/></svg></div></div>`:''}</div>
          <div class="vid-info"><div class="vid-name">${v.name||''}</div><div class="vid-role">${v.role||''}</div></div>
        </div>`;
      }).join('')}</div>`;
    }

    vidCon.querySelectorAll('.vid-tile.playable').forEach(t=>{
      t.addEventListener('click',()=>openLightbox(t.dataset.id,t.dataset.name,t.dataset.role,t.dataset.orient,t.dataset.platform));
    });

    // Auto-fetch thumbnails for tiles without a manual thumb
    vids.forEach((v,vi)=>{
      if(v.vimeoId&&!v.thumb&&!v.youtubeId&&!v.tiktokId){
        fetchVimeoThumb(v.vimeoId, `vt-${ci}-${vi}`);
      } else if(v.tiktokId&&!v.thumb){
        fetchTikTokThumb(v.tiktokId, `vt-${ci}-${vi}`);
      }
    });
  }

  const ppHero=document.getElementById('pp-hero');
  if(ppHero) ppHero.style.display='none';
  _prevScroll=window.scrollY;
  document.body.style.overflow='hidden';
  projPage.classList.add('open');
  projPage.scrollTop=0;
  const slug=p.client.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  history.pushState({project:ci},'',`#project/${slug}`);
}

function closeProjectPage(){
  projPage.classList.remove('open');
  document.body.style.overflow='';
  history.pushState({},'',window.location.pathname);
  window.scrollTo(0,_prevScroll);
}
document.getElementById('pp-back-btn')?.addEventListener('click',closeProjectPage);

/* ── LIGHTBOX ──────────────────────────────────────────────── */
const modal=document.getElementById('lightbox');
const mFrame=document.getElementById('lb-frame');

function openLightbox(id,name,role,orient,platform){
  const isV=orient==='vertical';
  const lbRatio=document.getElementById('lb-ratio');
  const lbTiktok=document.getElementById('lb-tiktok');
  const lbImage=document.getElementById('lb-image');
  const lbImageImg=document.getElementById('lb-image-img');
  const t=document.getElementById('lb-title'); if(t)t.textContent=name||'';
  const r=document.getElementById('lb-role'); if(r)r.textContent=role||'';

  // Hide all panels first — null-safe
  if(lbRatio) lbRatio.style.display='none';
  if(lbTiktok) lbTiktok.style.display='none';
  if(lbImage) lbImage.style.display='none';
  if(mFrame) mFrame.src='';

  const lbWrap=document.getElementById('lb-wrap');
  if(lbWrap) lbWrap.className='lb-wrap'+(isV?' lb-v':'');

  if(platform==='image'){
    // Show image fullscreen in lightbox
    lbImageImg.src=id;
    lbImage.style.display='block';
    document.getElementById('lb-wrap').className='lb-wrap lb-img';

  } else if(platform==='tiktok'){
    // TikTok official embed — no login needed
    lbTiktok.style.display='block';
    lbTiktok.innerHTML=`<blockquote class="tiktok-embed" cite="https://www.tiktok.com/video/${id}" data-video-id="${id}" style="max-width:605px;min-width:325px"><section></section></blockquote>`;
    // Load TikTok embed script if not already loaded
    if(!document.getElementById('tiktok-embed-script')){
      const s=document.createElement('script');
      s.id='tiktok-embed-script';
      s.src='https://www.tiktok.com/embed.js';
      s.async=true;
      document.body.appendChild(s);
    } else if(window.tiktok){
      window.tiktok.reload();
    }

  } else {
    // Vimeo or YouTube iframe
    if(lbRatio){ lbRatio.style.display=''; lbRatio.className='lb-ratio '+(isV?'r916':'r169'); }
    if(mFrame) mFrame.src=platform==='youtube'
      ?`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
      :`https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
  }

  if(modal) modal.classList.add('open');
}
function closeLightbox(){
  if(modal) modal.classList.remove('open');
  if(mFrame) mFrame.src='';
  const lbTiktok=document.getElementById('lb-tiktok');
  if(lbTiktok) lbTiktok.innerHTML='';
  // Restore ratio display for next open
  const lbRatio=document.getElementById('lb-ratio');
  if(lbRatio) lbRatio.style.display='';
}
document.getElementById('lb-close-btn')?.addEventListener('click',closeLightbox);
modal?.addEventListener('click',e=>{if(e.target===modal)closeLightbox();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(modal?.classList.contains('open'))closeLightbox();
    else if(projPage?.classList.contains('open'))closeProjectPage();
  }
});

/* ── SERVICES ──────────────────────────────────────────────── */
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

/* ── EXPERIENCE ────────────────────────────────────────────── */
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

/* ── ABOUT ─────────────────────────────────────────────────── */
function renderAbout(a){
  if(!a)return;
  const ph=document.getElementById('about-photo');
  if(ph) ph.innerHTML=a.photo?`<img src="${a.photo}" alt="${a.name||''}" loading="lazy"/>`:'';
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v||'';};
  set('about-name-cap',a.name);
  set('about-heading',a.heading);
  const bio=document.getElementById('about-bio');
  if(bio) bio.innerHTML=(a.bio||'').split('\n\n').map(p=>`<p>${p}</p>`).join('');
  const sk=document.getElementById('about-skills');
  if(sk&&a.skills) sk.innerHTML=a.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('');
}

/* ── CONTACT ───────────────────────────────────────────────── */
function renderContact(c){
  if(!c)return;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v||'';};
  set('contact-heading',c.heading);
  set('contact-sub',c.sub);
  const btn=document.getElementById('contact-email-btn');
  if(btn)btn.href=`mailto:${c.email||''}`;
  const links=document.getElementById('contact-links');
  if(!links)return;
  links.innerHTML=[
    {k:'Email',   v:c.email, h:`mailto:${c.email}`},
    {k:'LinkedIn',v:(c.linkedin||'').replace('https://www.linkedin.com/in/','').replace('/',''), h:c.linkedin},
    {k:'Vimeo',   v:(c.vimeo||'').replace('https://',''), h:c.vimeo},
    {k:'Behance', v:(c.behance||'').replace('https://www.',''), h:c.behance},
  ].filter(r=>r.h).map(r=>`
    <a href="${r.h}" target="${r.h.startsWith('mailto')?'_self':'_blank'}" rel="noopener" class="contact-link-row">
      <div><div class="contact-link-key">${r.k}</div><div class="contact-link-val">${r.v}</div></div>
      <span class="contact-link-arrow">&#8594;</span>
    </a>`).join('');
}

/* ── FOOTER ────────────────────────────────────────────────── */
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

/* ── NAV ───────────────────────────────────────────────────── */
const burger=document.getElementById('nav-burger');
const navLinks=document.getElementById('nav-links');
if(burger&&navLinks){
  burger.addEventListener('click',()=>{
    const open=navLinks.classList.toggle('open');
    burger.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',String(open));
  });
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    navLinks.classList.remove('open'); burger.classList.remove('open');
  }));
}
window.addEventListener('scroll',()=>{
  let cur='';
  document.querySelectorAll('section[id]').forEach(s=>{if(window.scrollY>=s.offsetTop-80)cur=s.id;});
  navLinks?.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
},{passive:true});

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
let revIO;
function initScrollReveal(){
  if(revIO)revIO.disconnect();
  revIO=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revIO.unobserve(e.target);}});
  },{threshold:.1});
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>revIO.observe(el));
}

window.addEventListener('popstate',()=>{
  if(document.getElementById('project-page').classList.contains('open')) closeProjectPage();
});
window.addEventListener('load',()=>{
  const hash=window.location.hash;
  if(hash.startsWith('#project/')){
    const slug=hash.replace('#project/','');
    try{
      const D=JSON.parse(document.getElementById('D').textContent);
      const idx=(D.projects||[]).findIndex(p=>p.client.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')===slug);
      if(idx>=0) setTimeout(()=>openProjectPage(D.projects[idx],idx),400);
    }catch(e){}
  }
});
