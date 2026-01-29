(function () {
  const drawer = document.getElementById('drawer');
  const menuBtn = document.getElementById('menuBtn');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const panel = drawer ? drawer.querySelector('[data-drawer-panel]') : null;

  let lastFocused = null;

  function getFocusable(root) {
    if (!root) return [];
    return Array.from(
      root.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;

    drawer.classList.remove('hidden');
    menuBtn?.setAttribute('aria-expanded', 'true');
    panel?.setAttribute('aria-hidden', 'false');

    // Move focus to the first focusable element inside the panel
    const focusables = getFocusable(panel);
    (focusables[0] || closeBtn || panel)?.focus?.();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.add('hidden');
    menuBtn?.setAttribute('aria-expanded', 'false');
    panel?.setAttribute('aria-hidden', 'true');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  if (menuBtn) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.addEventListener('click', openDrawer);
  }
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Focus trap when drawer is open
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (!drawer || drawer.classList.contains('hidden')) return;
    const focusables = getFocusable(panel);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
