/**
 * Neighborly - Short reliable version
 */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  let currentView = 'home';

  function showView(name) {
    currentView = name;
    $$('.view').forEach(v => v.classList.remove('active'));
    const target = $('#view-' + name);
    if (target) target.classList.add('active');

    $$('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === name);
    });
  }

  function openPostModal(type) {
    const modal = $('#post-modal');
    const title = $('#modal-title');
    if (title) {
      const names = {
        food: 'Share food',
        tool: 'Lend a tool',
        volunteer: 'Offer your time',
        donate: 'Donate items',
        request: 'Request help'
      };
      title.textContent = names[type] || 'Share something';
    }
    if (modal) modal.classList.remove('hidden');
  }

  function closeModals() {
    const postModal = $('#post-modal');
    const detailSheet = $('#detail-sheet');
    if (postModal) postModal.classList.add('hidden');
    if (detailSheet) detailSheet.classList.add('hidden');
  }

  function showToast(msg) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2500);
  }

  function bindEvents() {
    // Tabs
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        showView(tab.dataset.view);
      });
    });

    // Quick action buttons
    $$('.qa-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openPostModal(btn.dataset.action);
      });
    });

    // Share options
    $$('.share-option').forEach(btn => {
      btn.addEventListener('click', () => {
        openPostModal(btn.dataset.type);
      });
    });

    // Close modals
    $$('.close-modal, .modal-backdrop').forEach(el => {
      el.addEventListener('click', closeModals);
    });

    // Post form
    const form = $('#post-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = ($('#post-title') || {}).value || '';
        closeModals();
        showToast(title ? 'Posted “' + title + '” — thank you!' : 'Posted!');
      });
    }

    // Theme toggle
    const themeBtn = $('#theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
      });
    }

    // See all
    $$('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => showView(btn.dataset.nav));
    });
  }

  function boot() {
    // Hide splash, show app
    const splash = $('#splash');
    const app = $('#app');
    if (splash) splash.classList.add('hide');
    if (app) app.classList.remove('hidden');

    bindEvents();
    showView('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
