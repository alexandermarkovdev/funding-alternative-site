/* Preview only: the same four directions work across all three products. */
const heroVariant = new URLSearchParams(location.search).get('variant');
document.documentElement.dataset.heroVariant = ['1','2','3','4'].includes(heroVariant) ? heroVariant : '1';
