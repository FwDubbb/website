(() => {
  const body = document.body;
  const revealControl = document.getElementById('revealControl');
  const inspectionWindow = revealControl?.closest('.inspection-window');
  const layerLabel = document.getElementById('layerLabel');
  const globalInspect = document.getElementById('globalInspect');
  const tracePulse = document.getElementById('tracePulse');
  const railItems = [...document.querySelectorAll('.trace-rail li')];
  const observedSections = [...document.querySelectorAll('[data-observe]')];

  function setReveal(value) {
    if (!inspectionWindow) return;
    const bounded = Math.max(8, Math.min(92, Number(value)));
    inspectionWindow.style.setProperty('--reveal', `${bounded}%`);
    if (layerLabel) {
      layerLabel.textContent = bounded > 64 ? 'Surface layer' : bounded < 36 ? 'System layer' : 'Cross-section';
    }
  }

  revealControl?.addEventListener('input', (event) => setReveal(event.target.value));

  globalInspect?.addEventListener('click', () => {
    const active = body.classList.toggle('system-mode');
    globalInspect.setAttribute('aria-pressed', String(active));
    if (revealControl) {
      revealControl.value = active ? 18 : 58;
      setReveal(revealControl.value);
    }
    document.querySelectorAll('.experience-machine').forEach((machine) => {
      machine.classList.toggle('inspecting', active);
      machine.querySelector('.machine-switch')?.setAttribute('aria-pressed', String(active));
    });
  });

  document.querySelectorAll('.case-inspector').forEach((inspector) => {
    const tabs = [...inspector.querySelectorAll('[data-view]')];
    const panels = [...inspector.querySelectorAll('[data-panel]')];

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.view;
        tabs.forEach((item) => item.classList.toggle('active', item === tab));
        panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === view));
      });
    });
  });

  document.querySelectorAll('.machine-switch').forEach((button) => {
    button.addEventListener('click', () => {
      const machine = button.closest('.experience-machine');
      const active = machine.classList.toggle('inspecting');
      button.setAttribute('aria-pressed', String(active));
    });
  });

  const revealTargets = document.querySelectorAll('.case-record, .principle-statement, .method-grid, .contact-grid');
  revealTargets.forEach((target) => target.classList.add('reveal-on-scroll'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.14 });
  revealTargets.forEach((target) => revealObserver.observe(target));

  function updateRail() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (tracePulse) tracePulse.style.top = `${ratio * 100}%`;

    let current = observedSections[0]?.dataset.observe || 'top';
    const trigger = window.innerHeight * 0.36;
    observedSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= trigger) current = section.dataset.observe;
    });
    railItems.forEach((item) => item.classList.toggle('active', item.dataset.section === current));
  }

  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', updateRail);
  updateRail();
  setReveal(revealControl?.value || 58);
})();
