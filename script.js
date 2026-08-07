const root = document.documentElement;
const longHand = document.querySelector('.hand-long');
const shortHand = document.querySelector('.hand-short');
const seasons = document.querySelectorAll('.season');

let restingLong = 18;
let restingShort = 298;
let returnTimer;

function pointHands(angle) {
  longHand.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  shortHand.style.transform = `translateX(-50%) rotate(${angle - 74}deg)`;
}

function restHands() {
  longHand.style.transform = `translateX(-50%) rotate(${restingLong}deg)`;
  shortHand.style.transform = `translateX(-50%) rotate(${restingShort}deg)`;
}

seasons.forEach((season) => {
  const angle = Number(season.dataset.angle);

  season.addEventListener('mouseenter', () => {
    clearTimeout(returnTimer);
    pointHands(angle);
  });

  season.addEventListener('focus', () => {
    clearTimeout(returnTimer);
    pointHands(angle);
  });

  season.addEventListener('mouseleave', () => {
    returnTimer = setTimeout(restHands, 110);
  });

  season.addEventListener('blur', () => {
    returnTimer = setTimeout(restHands, 110);
  });
});

// A barely-there mechanical drift so the face never feels completely static.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let t = 0;
  setInterval(() => {
    t += 1;
    restingLong = 18 + Math.sin(t / 6) * 1.2;
    restingShort = 298 + Math.cos(t / 8) * 0.7;

    if (![...seasons].some((item) => item.matches(':hover, :focus'))) {
      restHands();
    }
  }, 900);
}
