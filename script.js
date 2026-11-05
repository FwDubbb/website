// A small amount of movement keeps the year selector tactile without
// getting in the way of its links or keyboard navigation.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

document.querySelectorAll('.season').forEach((season) => {
  function resetPosition() {
    season.style.removeProperty('--shift-x');
    season.style.removeProperty('--shift-y');
  }

  season.addEventListener('pointermove', (event) => {
    if (motionPreference.matches || !finePointer.matches) return;
    const bounds = season.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    season.style.setProperty('--shift-x', `${x * 8}px`);
    season.style.setProperty('--shift-y', `${y * 6}px`);
  });

  season.addEventListener('pointerleave', resetPosition);
  season.addEventListener('blur', resetPosition);
  motionPreference.addEventListener('change', resetPosition);
});
