const statsVariant = new URLSearchParams(location.search).get('variant');
document.documentElement.dataset.heroVariant = '1';
document.documentElement.dataset.statsVariant = ['1','2','3','4'].includes(statsVariant) ? statsVariant : '1';
