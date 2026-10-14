// theme.js - two looks for the blog: "dark" (default) and "notebook".
// Loaded in <head> so the page paints in the saved theme (no flash). Buttons with
// data-theme-set="<name>" switch it; the choice is kept in this browser only.
(function () {
  const KEY = 'blog-theme', THEMES = ['dark', 'notebook'];
  const FONTS = 'https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Caveat:wght@500;700&family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap';
  const root = document.documentElement;

  function loadFonts() {   // notebook fonts only when that theme is used
    if (document.getElementById('notebook-fonts')) return;
    const l = document.createElement('link');
    l.id = 'notebook-fonts'; l.rel = 'stylesheet'; l.href = FONTS;
    document.head.appendChild(l);
  }
  function apply(name) {
    const t = THEMES.includes(name) ? name : 'dark';
    root.dataset.theme = t;
    if (t === 'notebook') loadFonts();
    document.querySelectorAll('[data-theme-set]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeSet === t)));
  }

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked: default theme */ }
  apply(saved);

  document.addEventListener('DOMContentLoaded', () => apply(root.dataset.theme));
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-theme-set]');
    if (!b || b.dataset.themeSet === root.dataset.theme) return;
    apply(b.dataset.themeSet);
    try { localStorage.setItem(KEY, root.dataset.theme); } catch (e) { /* not kept */ }
    document.dispatchEvent(new CustomEvent('themechange', { detail: root.dataset.theme }));
  });
})();
