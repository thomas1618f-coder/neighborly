/**
 * Neighborly — Main application logic
 */
(function () {
  'use strict';

  let currentView = 'home';
  let currentFilter = 'all';
  let selectedCategory = 'food';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const splash = $('#splash');
  const app = $('#app');
  const main = $('#main');
  const toastEl = $('#toast');
  const postModal = $('#post-modal');
  const detailSheet = $('#detail-sheet');
  const detailContent = $('#detail-content');

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

  function showView(name) {
    if (name === currentView) return;
    currentView = name;

    $$('.view').forEach(v => v.classList.remove('active'));
    const target = $(`#view-${name}`);
    if (target) target.classList.add('active');

    $$('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === name);
    });

    main.scrollTop = 0;
    Sounds.click();
  }

  function categoryLabel(cat) {
    const map = {
      food: 'Food', tools: 'Tools', volunteer: 'Volunteer',
      donate: 'Donate', skills: 'Skills', request: 'Request', event: 'Event'
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

    container.querySelectorAll('.explore-card').forEach(card
