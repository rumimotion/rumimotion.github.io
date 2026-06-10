/* ============================================================
   RUMI PORTFOLIO — script.js
   ============================================================ */
'use strict';

/* ── Wait for DOM ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);

function init() {
  loadSiteData();
  initNav();
  initScrollReveal();
  initLightbox();
}

/* ============================================================
   LOAD SITE DATA FROM _data/site.json
   Falls back to inline defaults if fetch fails (local file://)
   ============================================================ */
async function loadSiteData() {
  let data;
  try {
    const res = await fetch('_data/site.json');
    if (!res.ok) throw new Error('no json');
    data = await res.json();
  } catch {
    // fallback: read from inline script tag (for local preview)
    const el = document.getElementById('site-data-fallback');
    data = el ? JSON.parse(el.textContent) : null;
  }
  if (data) renderAll(data);
}

/* ============================================================
   RENDER EVERYTHING FROM DATA
   ============================================================ */
function renderAll(d) {
  renderHero(d.hero);
  renderProjects(d.projects);
  renderServices(d.services);
  renderExperience(d.experience);
  renderAbout(d.about);
  renderContact(d.contact);
  renderFooter(d.contact);
  initScrollReveal(); // re-run after DOM changes
}

/* ── HERO ─────────────────────────────────────────────────── */
function renderHero(h) {
  if (!h) return;
  setText('hero-name', h.name);
  setText('hero-title-text', h.title);
  setHTML('hero-body', h.body);
  if (h.cta1Text && h.cta1Href) {
    const b = document.getElementById('hero-cta1');
    if (b) { b.textContent = h.cta1Text; b.href = h.cta1Href; }
  }
  if (h.cta2Text && h.cta2Href) {
    const b = document.getElementById('hero-cta2');
    if (b) { b.textContent = h.cta2Text; b.href = h.cta2Href; }
  }
}

/* ── PROJECTS ─────────────────────────────────────────────── */
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid || !projects) return;
  grid.innerHTML = '';

  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${p.title}`);

    const thumbContent = p.cover
      ? `<img src="${p.cover}" alt="${p.title}" loading="lazy"/>`
      : `<div class="card-thumb-ph">${FILM_ICON(44)}</div>`;

    const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

    card.innerHTML = `
      <div class="card-thumb">
        ${thumbContent}
        <div class="card-view-overlay">
          <span class="card-view-pill">View Project</span>
        </div>
      </div>
      <div class="card-meta">
        <div class="card-client">${p.client || ''}</div>
        <div class="card-title">${p.title || ''}</div>
        <div class="card-role">${p.primaryRole || ''}</div>
        <div class="card-tags">${tags}</div>
      </div>`;

    card.addEventListener('click', () => openProjectPage(p));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openProjectPage(p); });
    grid.appendChild(card);
  });

  initScrollReveal();
}

/* ── SERVICES ─────────────────────────────────────────────── */
function renderServices(services) {
  const grid = document.getElementById('services-grid');
  if (!grid || !services) return;
  grid.innerHTML = services.map(s => `
    <div class="service-card reveal">
      <div class="service-icon">${s.icon || '◎'}</div>
      <div class="service-name">${s.name}</div>
      <p class="service-desc">${s.desc}</p>
    </div>`).join('');
  initScrollReveal();
}

/* ── EXPERIENCE ───────────────────────────────────────────── */
function renderExperience(exp) {
  const list = document.getElementById('exp-list');
  if (!list || !exp) return;
  list.innerHTML = exp.map(e => `
    <div class="exp-row">
      <div class="exp-logo">
        ${e.logo
          ? `<img src="${e.logo}" alt="${e.company}" loading="lazy"/>`
          : `<div class="exp-logo-ph">${e.company.slice(0,3).toUpperCase()}</div>`}
      </div>
      <div class="exp-body">
        <div class="exp-role">${e.role}</div>
        <div class="exp-company">${e.company}</div>
      </div>
      <div class="exp-period">${e.period}</div>
    </div>`).join('');
}

/* ── ABOUT ────────────────────────────────────────────────── */
function renderAbout(a) {
  if (!a) return;
  const photo = document.getElementById('about-photo');
  if (photo) {
    if (a.photo) {
      photo.innerHTML = `<img src="${a.photo}" alt="${a.name || 'Rumi'}" loading="lazy"/>`;
    }
  }
  setText('about-name-cap', a.name);
  setText('about-heading', a.heading);
  const bioEl = document.getElementById('about-bio');
  if (bioEl) {
    bioEl.innerHTML = (a.bio || '').split('\n\n').map(p => `<p>${p}</p>`).join('');
  }
  const skillsEl = document.getElementById('about-skills');
  if (skillsEl && a.skills) {
    skillsEl.innerHTML = a.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
  }
}

/* ── CONTACT ──────────────────────────────────────────────── */
function renderContact(c) {
  if (!c) return;
  setText('contact-heading', c.heading);
  setText('contact-sub', c.sub);
  const emailBtn = document.getElementById('contact-email-btn');
  if (emailBtn && c.email) emailBtn.href = `mailto:${c.email}`;

  const links = document.getElementById('contact-links');
  if (!links) return;
  const rows = [
    { key: 'Email', val: c.email, href: `mailto:${c.email}` },
    { key: 'LinkedIn', val: c.linkedin ? c.linkedin.replace('https://www.linkedin.com/in/','').replace('/','') : '', href: c.linkedin },
    { key: 'Vimeo', val: c.vimeo ? c.vimeo.replace('https://','') : '', href: c.vimeo },
    { key: 'Behance', val: c.behance ? c.behance.replace('https://www.','') : '', href: c.behance },
  ].filter(r => r.href);
  links.innerHTML = rows.map(r => `
    <a href="${r.href}" target="${r.href.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener" class="contact-link-row">
      <div>
        <div class="contact-link-key">${r.key}</div>
        <div class="contact-link-val">${r.val}</div>
      </div>
      <span class="contact-link-arrow">→</span>
    </a>`).join('');
}

/* ── FOOTER ───────────────────────────────────────────────── */
function renderFooter(c) {
  if (!c) return;
  const copy = document.getElementById('footer-copy');
  if (copy) copy.textContent = `© ${new Date().getFullYear()} Malkhaz "RUMI" Tchubabria`;
  const fl = document.getElementById('footer-links');
  if (fl && c) {
    fl.innerHTML = [
      c.linkedin && `<a href="${c.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`,
      c.vimeo    && `<a href="${c.vimeo}"    target="_blank" rel="noopener">Vimeo</a>`,
      c.behance  && `<a href="${c.behance}"  target="_blank" rel="noopener">Behance</a>`,
    ].filter(Boolean).join('');
  }
}

/* ============================================================
   PROJECT DETAIL PAGE
   ============================================================ */
const projPage = document.getElementById('project-page');
let _prevScroll = 0;

function openProjectPage(p) {
  // hero
  const heroImg = document.getElementById('pp-hero-img');
  const heroPh  = document.getElementById('pp-hero-ph');
  if (heroImg && heroPh) {
    if (p.cover) {
      heroImg.src = p.cover; heroImg.alt = p.title || '';
      heroImg.style.display = 'block'; heroPh.style.display = 'none';
    } else {
      heroImg.style.display = 'none'; heroPh.style.display = 'flex';
    }
  }
  setText('pp-eyebrow-text', p.client || '');
  setText('pp-title-text', p.title || '');
  setText('pp-bar-right-text', p.client || '');

  // meta
  const roles = [...new Set((p.videos || []).map(v => v.role).filter(Boolean))];
  const metaEl = document.getElementById('pp-meta');
  if (metaEl) {
    metaEl.innerHTML = [
      { label: 'Client',   val: p.client || '—' },
      { label: 'My Role',  val: roles.join(' · ') || '—' },
      { label: 'Videos',   val: (p.videos || []).length.toString() },
      { label: 'Services', val: (p.tags || []).join(', ') || '—' },
    ].map(m => `<div class="pp-meta-item"><div class="pp-meta-label">${m.label}</div><div class="pp-meta-val">${m.val}</div></div>`).join('');
  }

  // video gallery
  const vidLabel = document.getElementById('pp-vid-label');
  const vidContainer = document.getElementById('pp-vid-container');
  const vids = p.videos || [];
  const layout = p.layout || 'horizontal';

  if (vidLabel) vidLabel.textContent = vids.length > 0 ? `${vids.length} Video${vids.length > 1 ? 's' : ''}` : '';

  if (vidContainer) {
    let gridClass = 'vid-grid-h';
    if (layout === 'vertical') gridClass = 'vid-grid-v';
    if (layout === 'mixed')    gridClass = 'vid-grid-m';

    if (vids.length === 0) {
      vidContainer.innerHTML = `<div class="${gridClass}"><div class="vid-empty">No videos added yet.<br/>Open the Admin panel to add Vimeo IDs and thumbnails.</div></div>`;
    } else {
      const tilesHTML = vids.map((v, vi) => {
        const can = !!v.vimeoId;
        const orient = layout === 'mixed' ? (v.orientation || 'horizontal') : layout;
        const isVert = orient === 'vertical';
        const ratioClass = isVert ? 'r916' : 'r169';
        const thumbHTML = v.thumb
          ? `<img src="${v.thumb}" alt="${v.name}" loading="lazy"/>`
          : `<div class="vid-thumb-ph">${FILM_ICON(32)}</div>`;
        return `
          <div class="vid-tile${can ? ' playable' : ''}"
               ${can ? `data-id="${v.vimeoId}" data-orient="${orient}" data-name="${esc(v.name)}" data-role="${esc(v.role)}"` : ''}>
            <div class="vid-thumb ${ratioClass}">
              ${thumbHTML}
              ${can ? `<div class="vid-play-ov"><div class="vid-play-btn">${PLAY_ICON()}</div></div>` : ''}
            </div>
            <div class="vid-info">
              <div class="vid-name">${v.name || ''}</div>
              <div class="vid-role">${v.role || ''}</div>
            </div>
          </div>`;
      }).join('');
      vidContainer.innerHTML = `<div class="${gridClass}">${tilesHTML}</div>`;
    }

    vidContainer.querySelectorAll('.vid-tile.playable').forEach(tile => {
      tile.addEventListener('click', () =>
        openLightbox(tile.dataset.id, tile.dataset.name, tile.dataset.role, tile.dataset.orient));
    });
  }

  _prevScroll = window.scrollY;
  document.body.style.overflow = 'hidden';
  projPage.classList.add('open');
  projPage.scrollTop = 0;
}

function closeProjectPage() {
  projPage.classList.remove('open');
  document.body.style.overflow = '';
  window.scrollTo(0, _prevScroll);
}

document.getElementById('pp-back-btn')?.addEventListener('click', closeProjectPage);

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  document.getElementById('lb-close-btn')?.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
}

function openLightbox(id, name, role, orient) {
  const lb = document.getElementById('lightbox');
  const wrap = document.getElementById('lb-wrap');
  const ratio = document.getElementById('lb-ratio');
  const frame = document.getElementById('lb-frame');
  if (!lb || !frame) return;

  const isVert = orient === 'vertical';
  wrap.className = 'lb-wrap' + (isVert ? ' lb-v' : '');
  ratio.className = 'lb-ratio ' + (isVert ? 'r916' : 'r169');
  frame.src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
  setText('lb-title', name || '');
  setText('lb-role', role || '');
  lb.classList.add('open');
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const frame = document.getElementById('lb-frame');
  if (lb) lb.classList.remove('open');
  if (frame) frame.src = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('lightbox')?.classList.contains('open')) closeLightbox();
    else if (document.getElementById('project-page')?.classList.contains('open')) closeProjectPage();
  }
});

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const burger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // active nav on scroll
  window.addEventListener('scroll', () => {
    let cur = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 80) cur = s.id;
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }, { passive: true });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
let revealObserver;
function initScrollReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

/* ============================================================
   HELPERS
   ============================================================ */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || '';
}
function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html || '';
}
function esc(s) { return (s || '').replace(/"/g, '&quot;'); }
function FILM_ICON(size = 48) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 52 52" fill="none">
    <rect x="4" y="10" width="44" height="32" rx="3" stroke="currentColor" stroke-width="1.5"/>
    <polygon points="20,18 20,34 36,26" fill="currentColor"/>
    <rect x="4"  y="6"  width="5" height="4" rx="1" fill="currentColor"/>
    <rect x="43" y="6"  width="5" height="4" rx="1" fill="currentColor"/>
    <rect x="4"  y="42" width="5" height="4" rx="1" fill="currentColor"/>
    <rect x="43" y="42" width="5" height="4" rx="1" fill="currentColor"/>
  </svg>`;
}
function PLAY_ICON() {
  return `<svg viewBox="0 0 18 18"><polygon points="4,2 4,16 16,9"/></svg>`;
}
