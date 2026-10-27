(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  document.querySelectorAll('[data-auto-cycle]').forEach(root => {
    const viewport = root.querySelector('.ts-cycle-viewport');
    const track = root.querySelector('.ts-cycle-track');
    const items = [...track.children];
    const status = root.querySelector('.ts-cycle-status');
    const interval = Number(root.dataset.interval);
    let index = 0, timer, busy = false, inView = false, pendingDirection = 0;
    let keyboardFocused = false, pointerStart = null;
    items.forEach((item, i) => item.dataset.cycleIndex = i);
    const visibleCount = () => mobile.matches ? 1 : Number(root.dataset.visible);
    const allowed = () => !reducedMotion.matches && !keyboardFocused && inView && !document.hidden && !busy;

    function schedule() {
      clearTimeout(timer);
      root.dataset.playback = reducedMotion.matches ? 'reduced-motion' : document.hidden ? 'hidden' : !inView ? 'offscreen' : keyboardFocused ? 'keyboard-focus' : 'playing';
      if (allowed()) timer = setTimeout(() => move(1, false), interval);
    }

    function update(manual = false) {
      const visible = visibleCount();
      [...track.children].forEach((item, position) => {
        item.inert = position >= visible;
        item.setAttribute('aria-hidden', String(position >= visible));
      });
      status.setAttribute('aria-live', manual ? 'polite' : 'off');
      status.textContent = `${items[index].dataset.cycleName}, ${index + 1} of ${items.length}`;
      root.dataset.current = String(index);
    }

    async function move(delta, manual = true) {
      if (!delta) return;
      if (busy) {
        if (manual) pendingDirection = delta;
        return;
      }
      clearTimeout(timer);
      busy = true;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const step = track.firstElementChild.getBoundingClientRect().width + gap;
      if (delta < 0) {
        for (let i = 0; i < -delta; i++) track.prepend(track.lastElementChild);
      }
      // Incoming items may be visible during the transition, but cannot receive focus yet.
      let animation;
      try {
        if (!reducedMotion.matches) {
          const from = delta > 0 ? 0 : delta * step;
          const to = delta > 0 ? -delta * step : 0;
          animation = track.animate(
            [{transform: `translateX(${from}px)`}, {transform: `translateX(${to}px)`}],
            {duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards'}
          );
          await animation.finished;
        }
      } finally {
        if (delta > 0) {
          for (let i = 0; i < delta; i++) track.append(track.firstElementChild);
        }
        index = (index + delta + items.length) % items.length;
        animation?.cancel();
        busy = false;
        update(manual);
        if (pendingDirection) {
          const direction = pendingDirection;
          pendingDirection = 0;
          move(direction);
        } else schedule();
      }
    }

    root.querySelector('.ts-prev').addEventListener('click', () => move(-1));
    root.querySelector('.ts-next').addEventListener('click', () => move(1));
    viewport.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    });
    viewport.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' || event.target.closest('a,button')) return;
      pointerStart = {x: event.clientX, y: event.clientY};
      clearTimeout(timer);
    });
    viewport.addEventListener('pointerup', event => {
      if (!pointerStart) return;
      const x = event.clientX - pointerStart.x, y = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1);
      else schedule();
    });
    viewport.addEventListener('pointercancel', () => { pointerStart = null; schedule(); });
    // A mouse resting over a card or clicking an arrow must not stop autoplay.
    // Keyboard users can still focus the carousel to read and navigate it.
    root.addEventListener('focusin', event => {
      keyboardFocused = event.target.matches(':focus-visible');
      schedule();
    });
    root.addEventListener('focusout', () => queueMicrotask(() => {
      keyboardFocused = root.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
      schedule();
    }));
    root.addEventListener('pointerdown', () => {
      if (keyboardFocused) { keyboardFocused = false; schedule(); }
    });
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', () => {
      update(); schedule();
    });
    mobile.addEventListener('change', () => { update(); schedule(); });
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .2;
      schedule();
    }, {threshold: [0, .2]}).observe(viewport);
    root.classList.add('is-ready');
    update();
  });
})();
