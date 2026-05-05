/* ============================================================
   app.js — Portfolio Alice Sindayigaya
   Remplace 15 fichiers JS + GSAP + SplitType + Vanilla-tilt
   Dépendances conservées : i18n-bundle.js, apiConfig.js, data.js
============================================================ */
'use strict';

// ─── Thème ───────────────────────────────────────────────────
const THEME_KEY = 'portfolio-theme';
const themeBtn  = document.getElementById('themeToggle');

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

let currentTheme = getInitialTheme();

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  if (themeBtn) {
    const icon = themeBtn.querySelector('i');
    if (icon) icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

applyTheme(currentTheme);
themeBtn?.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));

// ─── Langue ──────────────────────────────────────────────────
const LANG_KEY  = 'portfolio-lang';
const langBtn   = document.getElementById('langToggle');
let currentLang = localStorage.getItem(LANG_KEY) || 'fr';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  if (langBtn) langBtn.textContent = lang.toUpperCase();
  document.documentElement.setAttribute('lang', lang);
  if (window.i18n?.switchLanguage) {
    window.i18n.switchLanguage(lang);
  }
  if (allProjects.length) {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const filtered = activeFilter === 'all' ? allProjects : allProjects.filter(p => (p.category || '').toLowerCase() === activeFilter);
    renderProjects(filtered);
  }
  if (filteredPosts.length) renderBlog(filteredPosts);
}

langBtn?.addEventListener('click', () => applyLang(currentLang === 'fr' ? 'en' : 'fr'));

// ─── Header scroll ───────────────────────────────────────────
const header    = document.getElementById('header');
const backToTop = document.getElementById('backToTop');
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Fond nav
  header?.classList.toggle('scrolled', y > 50);

  // Bouton retour en haut
  backToTop?.classList.toggle('visible', y > 400);

  // Lien actif
  let current = '';
  sections.forEach(s => {
    if (y >= s.offsetTop - 90) current = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
}, { passive: true });

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── Menu mobile ─────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const nav       = document.getElementById('nav');

navToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(!!open));
});

nav?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ─── Scroll reveal (Intersection Observer) ───────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Description hero rotative ───────────────────────────────
const heroDesc = document.getElementById('heroDesc');
if (heroDesc) {
  const phrases = {
    fr: [
      'DevOps Architect · SRE · Platform Engineering',
      'Kubernetes & OpenSearch PaaS | Cegedim.cloud',
      'GitOps · Terraform · Ansible · DevSecOps',
      'Créatrice de contenus — alice-in-prodland',
    ],
    en: [
      'DevOps Architect · SRE · Platform Engineering',
      'Kubernetes & OpenSearch PaaS | Cegedim.cloud',
      'GitOps · Terraform · Ansible · DevSecOps',
      'Content Creator — alice-in-prodland',
    ],
  };
  let idx = 0;
  setInterval(() => {
    heroDesc.style.opacity = '0';
    heroDesc.style.transform = 'translateY(8px)';
    setTimeout(() => {
      const list = phrases[currentLang] || phrases.fr;
      idx = (idx + 1) % list.length;
      heroDesc.textContent = list[idx];
      heroDesc.style.opacity = '1';
      heroDesc.style.transform = 'translateY(0)';
    }, 280);
  }, 3800);
}

// ─── Projets ─────────────────────────────────────────────────
const projectsGrid  = document.getElementById('projectsGrid');
let allProjects     = [];

async function loadProjects() {
  if (!projectsGrid) return;
  const local = (typeof portfolioData !== 'undefined' && portfolioData.projects) || [];
  allProjects = local;
  if (local.length) renderProjects(local);
  try {
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res   = await fetch(`${API_BASE_URL}/portfolio/projects`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return;
    const json = await res.json();
    const remote = json.data || [];
    if (remote.length) { allProjects = remote; renderProjects(remote); }
  } catch { /* données locales déjà affichées */ }
}

function renderProjects(list) {
  if (!projectsGrid) return;
  if (!list.length) {
    projectsGrid.innerHTML = `<div class="no-results"><p>${currentLang === 'en' ? 'No projects available.' : 'Aucun projet disponible.'}</p></div>`;
    return;
  }
  projectsGrid.innerHTML = list.map(p => {
    const title = (currentLang === 'en' && p.title_en) ? p.title_en : p.title;
    const desc  = (currentLang === 'en' && p.description_en) ? p.description_en : (p.description || '');
    const tags  = (p.tags || p.tech_stack || p.technologies || []).slice(0, 4).map(t => `<span class="skill-tag">${t}</span>`).join('');
    const img   = p.image
      ? `<img src="${p.image}" alt="${title}" loading="lazy">`
      : `<div class="project-image-placeholder"><i class="fas fa-code"></i></div>`;
    return `
      <div class="project-card reveal" data-category="${(p.category || '').toLowerCase()}">
        <div class="project-image">${img}</div>
        <div class="project-body">
          <div class="project-meta">
            <span class="project-category">${p.category || 'Projet'}</span>
            ${p.year ? `<span class="project-year">${p.year}</span>` : ''}
          </div>
          <h3 class="project-title">${title}</h3>
          <p class="project-description">${desc}</p>
          <div class="project-footer">
            <div class="project-tags">${tags}</div>
            <i class="fas fa-arrow-right project-arrow"></i>
          </div>
        </div>
      </div>`;
  }).join('');

  projectsGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    renderProjects(f === 'all' ? allProjects : allProjects.filter(p => (p.category || '').toLowerCase() === f));
  });
});

// ─── Blog ─────────────────────────────────────────────────────
const blogGrid   = document.getElementById('blogGrid');
const blogSearch = document.getElementById('blogSearch');
let allPosts     = [];
let filteredPosts = [];
let currentIdx   = 0;

async function loadBlog() {
  if (!blogGrid) return;
  const local = (typeof portfolioData !== 'undefined' && portfolioData.blog) || [];
  allPosts      = local;
  filteredPosts = local;
  if (local.length) renderBlog(local);
  try {
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res   = await fetch(`${API_BASE_URL}/blog/posts?limit=20&locale=${currentLang}`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return;
    const json   = await res.json();
    const remote = json.data?.posts || json.data || [];
    if (remote.length) { allPosts = remote; filteredPosts = remote; renderBlog(remote); }
  } catch { /* données locales déjà affichées */ }
}

function renderBlog(list) {
  if (!blogGrid) return;
  if (!list.length) {
    blogGrid.innerHTML = '<div class="no-results" style="grid-column:1/-1"><p>Aucun article disponible.</p></div>';
    return;
  }
  const readMore = currentLang === 'en' ? 'Read article' : "Lire l'article";
  blogGrid.innerHTML = list.map((post, i) => {
    const title   = (currentLang === 'en' && post.title_en)   ? post.title_en   : post.title;
    const excerpt = (currentLang === 'en' && post.excerpt_en) ? post.excerpt_en : (post.excerpt || post.description || '');
    const img = post.cover_image
      ? `<img src="${post.cover_image}" alt="${title}" loading="lazy">`
      : `<div class="project-image-placeholder"><i class="fas fa-file-alt"></i></div>`;
    return `
      <div class="blog-card reveal" data-index="${i}">
        <div class="blog-card-image">${img}</div>
        <div class="blog-card-body">
          <div class="blog-meta">
            <span class="blog-category-badge">${post.category || 'DevOps'}</span>
            <span class="blog-date"><i class="fas fa-calendar-alt"></i> ${fmtDate(post.published_at || post.created_at)}</span>
            <span class="blog-read-time"><i class="fas fa-clock"></i> ${post.read_time || 5} min</span>
          </div>
          <h3 class="blog-card-title">${title}</h3>
          <p class="blog-card-excerpt">${excerpt}</p>
          <span class="blog-read-more">${readMore} <i class="fas fa-arrow-right"></i></span>
        </div>
      </div>`;
  }).join('');

  blogGrid.querySelectorAll('.blog-card').forEach(card => {
    revealObserver.observe(card);
    card.addEventListener('click', () => openModal(parseInt(card.dataset.index)));
  });

  const ctaText = document.querySelector('.blog-cta-text');
  if (ctaText) ctaText.textContent = currentLang === 'en'
    ? 'More DevOps & Cloud content on LinkedIn'
    : 'Retrouvez plus de contenu DevOps & Cloud sur LinkedIn';
}

function fmtDate(str) {
  if (!str) return '';
  try {
    return new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return str; }
}

blogSearch?.addEventListener('input', debounce(e => {
  const q   = e.target.value.toLowerCase().trim();
  const cat = document.querySelector('.category-btn.active')?.dataset.category || 'all';
  applyBlogFilter(q, cat);
}, 300));

document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const q = blogSearch?.value.toLowerCase().trim() || '';
    applyBlogFilter(q, btn.dataset.category);
  });
});

function applyBlogFilter(query, category) {
  let list = allPosts;
  if (category !== 'all') list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  if (query)              list = list.filter(p => p.title.toLowerCase().includes(query) || (p.excerpt || '').toLowerCase().includes(query));
  filteredPosts = list;
  renderBlog(list);
}

// ─── Modal blog ───────────────────────────────────────────────
const blogModal   = document.getElementById('blogModal');
const modalClose  = document.getElementById('modalClose');
const modalOverlay= document.getElementById('modalOverlay');

function openModal(idx) {
  const post = filteredPosts[idx];
  if (!post || !blogModal) return;
  currentIdx = idx;

  blogModal.querySelector('.category-badge').textContent    = post.category || '';
  blogModal.querySelector('.read-time-value').textContent   = post.read_time || 5;
  blogModal.querySelector('.views-value').textContent       = post.views || 0;
  blogModal.querySelector('.date-value').textContent        = fmtDate(post.published_at || post.created_at);
  blogModal.querySelector('.tutorial-title').textContent    = post.title;
  blogModal.querySelector('.tutorial-excerpt').textContent  = post.excerpt || '';
  blogModal.querySelector('.tutorial-tags').innerHTML       = (post.tags || []).map(t => `<span class="skill-tag">${t}</span>`).join('');

  const body = blogModal.querySelector('.tutorial-body');
  if (window.marked && post.content) {
    body.innerHTML = window.marked.parse(post.content);
    window.Prism?.highlightAllUnder(body);
  } else {
    body.innerHTML = post.content
      ? `<p>${post.content}</p>`
      : '<p>Contenu non disponible.</p>';
  }

  blogModal.querySelector('.btn-prev').disabled = idx === 0;
  blogModal.querySelector('.btn-next').disabled = idx === filteredPosts.length - 1;

  blogModal.classList.add('open');
  blogModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  blogModal.querySelector('.modal-content')?.scrollTo(0, 0);
}

function closeModal() {
  blogModal?.classList.remove('open');
  blogModal?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

blogModal?.querySelector('.btn-prev')?.addEventListener('click', () => { if (currentIdx > 0) openModal(currentIdx - 1); });
blogModal?.querySelector('.btn-next')?.addEventListener('click', () => { if (currentIdx < filteredPosts.length - 1) openModal(currentIdx + 1); });

// ─── Utilitaires ─────────────────────────────────────────────
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ─── Service Worker ──────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/portofolio/sw.js').catch(() => {});
  });
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyLang(currentLang);
  loadProjects();
  loadBlog();
});
