document.addEventListener('DOMContentLoaded', () => {
  const split = document.querySelector('.calc-live-split');
  if (!split) return;
  const percentage = document.querySelector('.calc-concept input[name="pct"]');
  const update = () => {
    const repay = Number(percentage.value);
    split.querySelector('.calc-split-bar').style.setProperty('--keep', (100-repay)+'%');
    split.querySelector('[data-intro-keep]').textContent='£'+(100-repay);
    split.querySelector('[data-intro-repay]').textContent='£'+repay;
    split.querySelector('[data-intro-percent]').textContent=repay+'%';
  };
  percentage.addEventListener('input',update);
  percentage.addEventListener('change',update);
  update();
});
