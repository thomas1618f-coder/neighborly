/**
 * Neighborly — Main application logic
 * Focus: clarity, agency, subtle delight, immediate feedback
 */
(function () {
  'use strict';

  // ---------- State ----------
  let currentView = 'home';
  let currentFilter = 'all';
  let selectedCategory = 'food';

  // ---------- DOM ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const splash = $('#splash');
  const app = $('#app');
  const main = $('#main');
  const toastEl = $('#toast');
  const postModal = $('#post-modal');
  const detailSheet = $('#detail-sheet');
  const detailContent = $('#detail-content');

  // ---------- Theme ----------
  function initTheme() {
    const saved = localStorage.getItem('neighborly-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('neighborly-theme', next);
    Sounds.click();
  }

  // ---------- Navigation ----------
  function showView(name) {
    if (name === currentView) return;
    currentView = name;

    $$('.view').forEach(v => v.classList.remove('active'));
    const target = $(`#view-${name}`);
    if (target) target.classList.add('active');

    $$('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === name);
    });

    // Scroll main to top
    main.scrollTop = 0;
    Sounds.click();
  }

  // ---------- Render helpers ----------
  function categoryLabel(cat) {
    const map = {
      food: 'Food',
      tools: 'Tools',
      volunteer: 'Volunteer',
      donate: 'Donate',
      skills: 'Skills',
      request: 'Request',
      event: 'Event'
    };
    return map[cat] || cat;
  }

  function renderNearby() {
    const container = $('#nearby-cards');
    if (!container) return;
    const items = LISTINGS.slice(0, 5);
    container.innerHTML = items.map(item => `
      <article class="listing-card" data-id="${item.id}" role="button" tabindex="0">
        <div class="card-img">
          <span>${item.emoji}</span>
          <span class="tag">${categoryLabel(item.category)}</span>
        </div>
        <div class="card-body">
          <h4>${item.title}</h4>
          <div class="meta">
            <span>${item.distance}</span>
            <span>·</span>
            <span>${item.when}</span>
          </div>
        </div>
      </article>
    `).join('');

    container.querySelectorAll('.listing-card').forEach(card => {
      card.addEventListener('click', () => openDetail(+card.dataset.id));
    });
  }

  function renderOpportunities() {
    const container = $('#opportunities');
    if (!container) return;
    const items = LISTINGS.filter(l => l.category === 'volunteer' || l.type === 'event').slice(0, 3);
    container.innerHTML = items.map(item => `
      <article class="list-item" data-id="${item.id}" role="button" tabindex="0">
        <div class="li-icon">${item.emoji}</div>
        <div class="li-body">
          <h4>${item.title}</h4>
          <p>${item.when} · ${item.distance}</p>
        </div>
        <button class="li-action" data-id="${item.id}">Join</button>
      </article>
    `).join('');

    container.querySelectorAll('.list-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('li-action')) {
          e.stopPropagation();
          claimItem(+e.target.dataset.id);
        } else {
          openDetail(+el.dataset.id);
        }
      });
    });
  }

  function renderExplore(filter = 'all', query = '') {
    const container = $('#explore-grid');
    if (!container) return;

    let items = LISTINGS;
    if (filter !== 'all') {
      items = items.filter(i => i.category === filter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.desc.toLowerCase().includes(q) ||
        i.category.includes(q)
      );
    }

    if (items.length === 0) {
      container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--label-tertiary);padding:40px 0;">No matches yet. Be the first to share!</p>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <article class="explore-card" data-id="${item.id}" role="button" tabindex="0">
        <div class="ec-img">${item.emoji}</div>
        <div class="ec-body">
          <h4>${item.title}</h4>
          <div class="ec-meta">${item.distance} · ${categoryLabel(item.category)}</div>
        </div>
      </article>
    `).join('');

    container.querySelectorAll('.explore-card').forEach(card => {
      card.addEventListener('click', () => openDetail(+card.dataset.id));
    });
  }

  function renderHighlights() {
    const container = $('#highlights');
    if (!container) return;
    container.innerHTML = HIGHLIGHTS.map(h => `
      <div class="highlight-item">
        <span class="hi-icon">${h.icon}</span>
        <p>${h.text}</p>
      </div>
    `).join('');
  }

  function renderMyPosts() {
    const container = $('#my-posts');
    if (!container) return;
    container.innerHTML = MY_POSTS.map(p => `
      <article class="list-item">
        <div class="li-icon">${p.emoji}</div>
        <div class="li-body">
          <h4>${p.title}</h4>
          <p>${p.status}</p>
        </div>
      </article>
    `).join('');
  }

  // ---------- Detail Sheet ----------
  function openDetail(id) {
    const item = LISTINGS.find(l => l.id === id);
    if (!item) return;

    detailContent.innerHTML = `
      <div class="detail-img">${item.emoji}</div>
      <h2>${item.title}</h2>
      <div class="detail-meta">${item.user} · ⭐ ${item.rating} · ${item.distance}</div>
      <p class="detail-desc">${item.desc}</p>
      <div class="detail-meta" style="margin-bottom:20px;">
        <strong style="color:var(--label)">${item.when}</strong> · ${categoryLabel(item.category)}
      </div>
      <div class="detail-actions">
        <button class="primary-btn" id="claim-btn">I'm interested</button>
        <button class="secondary-btn" id="message-btn">Message</button>
      </div>
    `;

    detailSheet.classList.remove('hidden');
    Sounds.whoosh();

    $('#claim-btn').addEventListener('click', () => {
      claimItem(id);
      closeDetail();
    });
    $('#message-btn').addEventListener('click', () => {
      showToast('Messaging coming soon — stay tuned!');
      Sounds.click();
    });
  }

  function closeDetail() {
    detailSheet.classList.add('hidden');
    Sounds.click();
  }

  // ---------- Actions ----------
  function claimItem(id) {
    const item = LISTINGS.find(l => l.id === id);
    if (!item) return;
    showToast(`You expressed interest in “${item.title}”. ${item.user} will be notified.`);
    Sounds.success();

    // Light impact bump for demo
    const meals = $('#impact-meals');
    if (item.category === 'food' && meals) {
      meals.textContent = String(+meals.textContent + 1);
    }
  }

  function openPostModal(type = 'food') {
    selectedCategory = type;
    const select = $('#post-category');
    if (select) select.value = type === 'tool' ? 'tools' : type;
    const titles = {
      food: 'Share food',
      tool: 'Lend a tool',
      tools: 'Lend a tool',
      volunteer: 'Offer your time',
      donate: 'Donate items',
      request: 'Request help',
      skills: 'Share a skill'
    };
    $('#modal-title').textContent = titles[type] || 'Share something';
    postModal.classList.remove('hidden');
    Sounds.whoosh();
    setTimeout(() => $('#post-title')?.focus(), 300);
  }

  function closePostModal() {
    postModal.classList.add('hidden');
    $('#post-form')?.reset();
    Sounds.click();
  }

  function handlePostSubmit(e) {
    e.preventDefault();
    const title = $('#post-title').value.trim();
    if (!title) return;

    closePostModal();
    showToast(`Posted “${title}” to your neighborhood. Thank you!`);
    Sounds.success();

    // Demo impact update
    const meals = $('#impact-meals');
    if (meals && selectedCategory === 'food') {
      meals.textContent = String(+meals.textContent + 1);
    }
  }

  // ---------- Toast ----------
  let toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => toastEl.classList.add('hidden'),
