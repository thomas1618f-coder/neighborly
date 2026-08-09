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
