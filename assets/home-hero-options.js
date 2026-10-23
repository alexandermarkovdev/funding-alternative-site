const homeHeroVariant = new URLSearchParams(location.search).get('hero-variant');
document.documentElement.dataset.homeHero = /^[1-6]$/.test(homeHeroVariant) ? homeHeroVariant : '1';
document.addEventListener('DOMContentLoaded', () => {
  const paths = [
    '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18m-6 5h3M7 6V4h10v2"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    '<circle cx="12" cy="12" r="9"/><path d="m8 8 8 8m0-8-8 8"/>',
    '<path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4"/>'
  ];
  document.querySelectorAll('.hero .proof > div').forEach((fact, i) => {
    fact.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[i]+'</svg>');
  });
  const header = document.querySelector('.top');
  new ResizeObserver(() => document.documentElement.style.setProperty('--home-header-height', header.offsetHeight+'px')).observe(header);
});
