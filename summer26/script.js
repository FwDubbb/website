const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
const mobileLayout = window.matchMedia('(max-width: 760px)');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  menuButton.querySelector('span').textContent = open ? '\u2212' : '+';
  navigation.hidden = mobileLayout.matches && !open;
}

// Navigation stays visible if JavaScript is unavailable.
menuButton.hidden = false;
setMenu(false);
menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
mobileLayout.addEventListener('change', () => setMenu(false));
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && mobileLayout.matches) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

// Keep navigation in step with the section the visitor is reading.
if ('IntersectionObserver' in window) {
  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const visibleSections = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visibleSections.set(entry.target.id, entry.isIntersecting));
    const current = links.find(link => visibleSections.get(link.hash.slice(1)));
    links.forEach(link => {
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin: '-15% 0px -45% 0px'});
  links.forEach(link => {
    const section = document.getElementById(link.hash.slice(1));
    if (section) observer.observe(section);
  });
}
