// Switches a page's layout improvements on and off (classes like fx-01 … fx-30 on <html>).
// The script tag can set data-prefix and data-total (default fx / 30).
// URL: page.html?fx=all | none | 1,2,5  (default: all)
// layout-compare.html drives it with postMessage: {type:'fx', on:[…]} and {type:'goto', selector}.
(() => {
  const me = document.currentScript;
  const PREFIX = (me && me.dataset.prefix) || 'fx', TOTAL = +((me && me.dataset.total) || 30), root = document.documentElement;
  const cls = n => PREFIX + '-' + String(n).padStart(2, '0');
  const apply = on => { for (let n = 1; n <= TOTAL; n++) root.classList.toggle(cls(n), on.includes(n)); };

  const param = new URLSearchParams(location.search).get('fx');
  const all = Array.from({ length: TOTAL }, (_, i) => i + 1);
  apply(!param || param === 'all' ? all : param === 'none' ? [] : param.split(',').map(Number));

  // Keep the same section in view when the layout changes height underneath it
  const anchorSections = () => [...document.querySelectorAll('.hero, .bca-screen-opening, main > section, .calc-slot, .foot')];
  const withAnchor = change => {
    const head = 70, list = anchorSections();
    const sec = list.find(s => s.getBoundingClientRect().bottom > head) || list[0];
    const r = sec.getBoundingClientRect(), ratio = (head - r.top) / r.height;
    change();
    const r2 = sec.getBoundingClientRect();
    root.style.scrollBehavior = 'auto';
    scrollTo(0, scrollY + r2.top - head + ratio * r2.height);
    root.style.scrollBehavior = '';
  };

  let flashTimer;
  addEventListener('message', e => {
    const d = e.data || {};
    if (d.type === 'fx') withAnchor(() => apply(d.on || []));
    if (d.type === 'goto') {
      const el = document.querySelector(d.selector);
      if (!el) return;
      root.style.scrollBehavior = 'auto';
      scrollTo(0, Math.max(0, el.getBoundingClientRect().top + scrollY - 110));
      root.style.scrollBehavior = '';
      document.querySelectorAll('.fx-flash').forEach(x => x.classList.remove('fx-flash'));
      el.classList.add('fx-flash');
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => el.classList.remove('fx-flash'), 1800);
    }
  });
  addEventListener('load', () => parent !== window && parent.postMessage({ type: 'fx-ready' }, '*'));
  // Space flips before/after in the review page even when the preview has focus
  addEventListener('keydown', e => {
    if (parent === window || e.code !== 'Space' || e.target.closest('input, textarea, select, button, a, summary')) return;
    e.preventDefault();
    parent.postMessage({ type: 'fx-flip' }, '*');
  });
})();
