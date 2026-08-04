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
    const bounded = Math.max(0, Math.min(100, Number(value)));
    inspectionWindow.style.setProperty('--reveal', `${bounded}%`);
    if (layerLabel) {
      layerLabel.textContent = bounded > 64 ? 'Personal side' : bounded < 36 ? 'Professional side' : 'Both in view';
    }
  }

  revealControl?.addEventListener('input', (event) => setReveal(event.target.value));

  function setAllLayers(active) {
    document.querySelectorAll('.experience-machine').forEach((machine) => {
      machine.classList.toggle('inspecting', active);
      machine.querySelector('.machine-switch')?.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('.case-inspector').forEach((inspector) => {
      const target = active ? inspector.querySelector('[data-view="architecture"]') : inspector.querySelector('[data-view="purpose"]');
      target?.click();
    });

    if (active) document.querySelector('[data-route="dijkstra"]')?.click();
  }

  globalInspect?.addEventListener('click', () => {
    const active = body.classList.toggle('system-mode');
    globalInspect.setAttribute('aria-pressed', String(active));
    setAllLayers(active);
  });

  document.querySelectorAll('.case-inspector').forEach((inspector) => {
    const tabs = [...inspector.querySelectorAll('[data-view]')];
    const panels = [...inspector.querySelectorAll('[data-panel]')];

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.view;
        tabs.forEach((item) => {
          const selected = item === tab;
          item.classList.toggle('active', selected);
          item.setAttribute('aria-selected', String(selected));
        });
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

  const routeData = {
    bfs: {
      status: 'FEWEST CONNECTIONS',
      method: 'Breadth-first search',
      path: 'BIS → ORD → JFK',
      priority: 'Fewest edges first',
      result: '2 legs · cost not weighted',
      pathD: 'M90 210 L385 175 L675 205'
    },
    dfs: {
      status: 'DEPTH EXPLORATION',
      method: 'Depth-first search',
      path: 'BIS → MSP → DFW → ATL → JFK',
      priority: 'Follow one branch deeply',
      result: '4 legs · first valid route',
      pathD: 'M90 210 L245 285 L530 300 L555 80 L675 205'
    },
    dijkstra: {
      status: 'CHEAPEST PATH',
      method: 'Dijkstra',
      path: 'BIS → DEN → ORD → JFK',
      priority: 'Lowest total cost',
      result: '$428 · 3 legs',
      pathD: 'M90 210 L245 90 L385 175 L675 205'
    }
  };

  const routeButtons = [...document.querySelectorAll('[data-route]')];
  const routePath = document.querySelector('#routeHighlight path');
  routeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const data = routeData[button.dataset.route];
      if (!data) return;
      routeButtons.forEach((item) => item.classList.toggle('active', item === button));
      document.getElementById('routeStatus').textContent = data.status;
      document.getElementById('routeMethod').textContent = data.method;
      document.getElementById('routePath').textContent = data.path;
      document.getElementById('routePriority').textContent = data.priority;
      document.getElementById('routeResult').textContent = data.result;
      if (routePath) {
        routePath.style.animation = 'none';
        routePath.setAttribute('d', data.pathD);
        requestAnimationFrame(() => {
          routePath.style.animation = '';
        });
      }
    });
  });

  const designButtons = [...document.querySelectorAll('[data-design]')];
  const designPanels = [...document.querySelectorAll('[data-design-panel]')];
  designButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.design;
      designButtons.forEach((item) => item.classList.toggle('active', item === button));
      designPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.designPanel === target));
    });
  });

  const revealTargets = document.querySelectorAll('.case-record, .principle-statement, .history-heading, .history-ledger, .method-grid, .contact-grid');
  revealTargets.forEach((target) => target.classList.add('reveal-on-scroll'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
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
