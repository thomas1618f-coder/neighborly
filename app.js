/**
 * Neighborly — Community mutual-aid app
 */
(function () {
  'use strict';

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  let currentView = 'home';
  let currentFilter = 'all';

  // ---------- View switching ----------
  function showView(name) {
    currentView = name;
    $$('.view').forEach(v => v.classList.remove('active'));
    const target = $('#view-' + name);
    if (target) target.classList.add('active');

    $$('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === name);
    });

    // Soft scroll to top
    const main = $('#main');
    if (main) main.scrollTop = 0;

    if (typeof Sounds !== 'undefined' && Sounds.click) Sounds.click();
  }

  // ---------- Modal ----------
  function openPostModal(type) {
    const modal = $('#post-modal');
    const titleEl = $('#modal-title');
    const catSelect = $('#post-category');

    const names = {
      food: 'Share food',
      tool: 'Lend a tool',
      volunteer: 'Offer your time',
      donate: 'Donate items',
      request: 'Request help'
    };

    if (titleEl) titleEl.textContent = names[type] || 'Share something';

    // Pre-select category when possible
    if (catSelect) {
      const map = { tool: 'tools', food: 'food', volunteer: 'volunteer', donate: 'donate', request: 'request' };
      catSelect.value = map[type] || 'food';
    }

    if (modal) {
      modal.classList.remove('hidden');
      // Focus first input after animation
      setTimeout(() => {
        const input = $('#post-title');
        if (input) input.focus();
      }, 350);
    }

    if (typeof Sounds !== 'undefined' && Sounds.whoosh) Sounds.whoosh();
  }

  function closeModals() {
    const postModal = $('#post-modal');
    const detailSheet = $('#detail-sheet');
    if (postModal) postModal.classList.add('hidden');
    if (detailSheet) detailSheet.classList.add('hidden');
  }

  // ---------- Toast ----------
  function showToast(msg) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    // Force reflow then show
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2600);
  }

  // ---------- Render helpers ----------
  function categoryLabel(cat) {
    const map = {
      food: 'Food',
      tools: 'Tools',
      volunteer: 'Help',
      donate: 'Donate',
      skills: 'Skills',
      request: 'Request'
    };
    return map[cat] || cat;
  }

  function renderNearby() {
    const container = $('#nearby-cards');
    if (!container || typeof LISTINGS === 'undefined') return;

    const nearby = LISTINGS.slice(0, 5);
    container.innerHTML = nearby.map(item => `
      <article class="listing-card" data-id="${item.id}">
        <div class="card-img">
          <span class="tag">${categoryLabel(item.category)}</span>
          ${item.emoji}
        </div>
        <div class="card-body">
          <h4>${item.title}</h4>
          <div class="meta">${item.distance} · ${item.when}</div>
        </div>
      </article>
    `).join('');

    // Click to open detail
    $$('.listing-card', container).forEach(card => {
      card.addEventListener('click', () => openDetail(+card.dataset.id));
    });
  }

  function renderOpportunities() {
    const container = $('#opportunities');
    if (!container || typeof LISTINGS === 'undefined') return;

    const items = LISTINGS.slice(0, 4);
    container.innerHTML = items.map(item => `
      <div class="list-item" data-id="${item.id}">
        <div class="li-icon">${item.emoji}</div>
        <div class="li-body">
          <h4>${item.title}</h4>
          <p>${item.user} · ${item.distance}</p>
        </div>
        <button class="li-action" data-id="${item.id}">View</button>
      </div>
    `).join('');

    $$('.list-item, .li-action', container).forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetail(+el.dataset.id || +el.closest('[data-id]').dataset.id);
      });
    });
  }

  function renderExplore(filter = 'all') {
    const grid = $('#explore-grid');
    if (!grid || typeof LISTINGS === 'undefined') return;

    const filtered = filter === 'all'
      ? LISTINGS
      : LISTINGS.filter(l => l.category === filter || (filter === 'tools' && l.category === 'tools'));

    grid.innerHTML = filtered.map(item => `
      <article class="explore-card" data-id="${item.id}">
        <div class="ec-img">${item.emoji}</div>
        <div class="ec-body">
          <h4>${item.title}</h4>
          <div class="ec-meta">${item.distance} · ${categoryLabel(item.category)}</div>
        </div>
      </article>
    `).join('');

    $$('.explore-card', grid).forEach(card => {
      card.addEventListener('click', () => openDetail(+card.dataset.id));
    });
  }

  function openDetail(id) {
    const item = (typeof LISTINGS !== 'undefined' ? LISTINGS : []).find(l => l.id === id);
    if (!item) return;

    const content = $('#detail-content');
    if (!content) return;

    content.innerHTML = `
      <div class="detail-header">
        <div class="detail-emoji">${item.emoji}</div>
        <div>
          <h3>${item.title}</h3>
          <div class="detail-meta">${item.user} · ⭐ ${item.rating} · ${item.distance}</div>
        </div>
      </div>
      <p class="detail-desc">${item.desc}</p>
      <div class="detail-meta" style="margin-bottom:16px">${item.when} · ${categoryLabel(item.category)}</div>
      <div class="detail-actions">
        <button class="primary-btn" id="claim-btn">I'm interested</button>
        <button class="secondary-btn close-modal" style="flex:0 0 auto;width:auto;padding:12px 16px">Close</button>
      </div>
    `;

    const sheet = $('#detail-sheet');
    if (sheet) sheet.classList.remove('hidden');

    const claim = $('#claim-btn');
    if (claim) {
      claim.addEventListener('click', () => {
        closeModals();
        showToast(`Interest sent to ${item.user}!`);
        if (typeof Sounds !== 'undefined' && Sounds.success) Sounds.success();
      });
    }

    // Re-bind close
    $$('.close-modal', sheet).forEach(el => {
      el.addEventListener('click', closeModals);
    });

    if (typeof Sounds !== 'undefined' && Sounds.whoosh) Sounds.whoosh();
  }

  // ---------- Events ----------
  function bindEvents() {
    // Tabs
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.dataset.view) showView(tab.dataset.view);
      });
    });

    // Quick action buttons
    $$('.qa-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openPostModal(btn.dataset.action);
      });
    });

    // Share options (on Share view)
    $$('.share-option').forEach(btn => {
      btn.addEventListener('click', () => {
        openPostModal(btn.dataset.type);
      });
    });

    // Close modals (backdrop + close buttons)
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop') || e.target.closest('.close-modal')) {
        closeModals();
      }
    });

    // Post form
    const form = $('#post-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = ($('#post-title') || {}).value?.trim() || '';
        closeModals();
        showToast(title ? `Posted “${title}” — thank you!` : 'Posted to your neighborhood!');
        form.reset();
        if (typeof Sounds !== 'undefined' && Sounds.success) Sounds.success();
      });
    }

    // Theme toggle
    const themeBtn = $('#theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('neighborly-theme', next);
      });
    }

    // See all → Explore
    $$('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => showView(btn.dataset.nav));
    });

    // Filter chips
    $$('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        $$('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;
        renderExplore(currentFilter);
      });
    });

    // Search (simple filter on explore)
    const search = $('#search-input');
    if (search) {
      search.addEventListener('input', () => {
        const q = search.value.toLowerCase().trim();
        if (!q) {
          renderExplore(currentFilter);
          return;
        }
        const grid = $('#explore-grid');
        if (!grid || typeof LISTINGS === 'undefined') return;
        const filtered = LISTINGS.filter(l =>
          l.title.toLowerCase().includes(q) ||
          l.desc.toLowerCase().includes(q) ||
          l.category.includes(q)
        );
        grid.innerHTML = filtered.map(item => `
          <article class="explore-card" data-id="${item.id}">
            <div class="ec-img">${item.emoji}</div>
            <div class="ec-body">
              <h4>${item.title}</h4>
              <div class="ec-meta">${item.distance} · ${categoryLabel(item.category)}</div>
            </div>
          </article>
        `).join('');
        $$('.explore-card', grid).forEach(card => {
          card.addEventListener('click', () => openDetail(+card.dataset.id));
        });
      });
    }

    // Photo upload placeholder
    const photo = $('#photo-upload');
    if (photo) {
      photo.addEventListener('click', () => {
        showToast('Photo upload coming soon');
      });
    }

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModals();
    });
  }

  // ---------- Boot ----------
  function boot() {
    // Restore theme
    const saved = localStorage.getItem('neighborly-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    // Hide splash, show app
    const splash = $('#splash');
    if (splash) {
      setTimeout(() => splash.classList.add('hide'), 400);
    }

    bindEvents();
    renderNearby();
    renderOpportunities();
    renderExplore('all');
    showView('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
