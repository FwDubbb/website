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

    if (active) {
      document.querySelector('[data-route="dijkstra"]')?.click();
      document.querySelector('[data-guide-view="continuity"]')?.click();
    } else {
      document.querySelector('[data-guide-view="features"]')?.click();
    }
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

  document.querySelectorAll('.guide-dossier').forEach((dossier) => {
    const tabs = [...dossier.querySelectorAll('[data-guide-view]')];
    const panels = [...dossier.querySelectorAll('[data-guide-panel]')];

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.guideView;
        tabs.forEach((item) => {
          const selected = item === tab;
          item.classList.toggle('active', selected);
          item.setAttribute('aria-selected', String(selected));
        });
        panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.guidePanel === view));
      });
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


  const calendarCompareData = {
    lsc: {
      before: {
        image: 'oldlsc.png',
        alt: 'Original LSC weekly calendar view',
        badge: 'ORIGINAL / LSC WEEK',
        title: 'Original LSC week view',
        caption: 'Events were positioned mainly by time. When many bookings overlapped, cards became narrow, titles were clipped, and employees could not quickly see the requester or enough booking context.'
      },
      after: {
        image: 'newlsc.png',
        alt: 'Redesigned LSC weekly bookings view',
        badge: 'REDESIGNED / LSC WEEK',
        title: 'Redesigned LSC week view',
        caption: 'Each day becomes an event-based column. Past, current, future, and open states are immediately visible; the current day is clearly marked; and each card has room for time, location, purpose, and requester context.'
      }
    },
    vehicles: {
      before: {
        image: 'oldveh.png',
        alt: 'Original vehicle weekly calendar view',
        badge: 'ORIGINAL / VEHICLES WEEK',
        title: 'Original vehicle week view',
        caption: 'The time-grid layout technically displayed reservations, but simultaneous bookings produced extremely narrow cards. Vehicle numbers and booking details were difficult to scan, and availability was not obvious.'
      },
      after: {
        image: 'newveh.png',
        alt: 'Redesigned vehicle weekly bookings view',
        badge: 'REDESIGNED / VEHICLES WEEK',
        title: 'Redesigned vehicle week view',
        caption: 'Vehicles are now grouped by day as readable booking records. Color communicates status, requester and purpose details are visible, available vehicles are clearly separated, and a booking action is placed directly in the card.'
      }
    },
    day: {
      after: {
        image: 'newday.png',
        alt: 'New vehicle daily calendar view',
        badge: 'ADDED / VEHICLES DAY VIEW',
        title: 'A dedicated day view that did not exist before',
        caption: 'The new day view summarizes what is happening now, what is coming up, what happened earlier, all-day activity, and currently available vehicles. Current events appear first so the page answers the most urgent question immediately.'
      }
    }
  };

  const calendarCompare = document.getElementById('calendarCompare');
  if (calendarCompare) {
    const areaButtons = [...calendarCompare.querySelectorAll('[data-compare-area]')];
    const versionButtons = [...calendarCompare.querySelectorAll('[data-compare-version]')];
    const compareImage = document.getElementById('calendarCompareImage');
    const compareBadge = document.getElementById('calendarCompareBadge');
    const compareTitle = document.getElementById('calendarCompareTitle');
    const compareCaption = document.getElementById('calendarCompareCaption');
    let selectedArea = 'lsc';
    let selectedVersion = 'before';

    function renderCalendarComparison() {
      const areaData = calendarCompareData[selectedArea];
      if (!areaData[selectedVersion]) selectedVersion = 'after';
      const data = areaData[selectedVersion];

      areaButtons.forEach((button) => button.classList.toggle('active', button.dataset.compareArea === selectedArea));
      versionButtons.forEach((button) => {
        const isBefore = button.dataset.compareVersion === 'before';
        button.disabled = selectedArea === 'day' && isBefore;
        button.classList.toggle('active', button.dataset.compareVersion === selectedVersion);
      });

      if (compareImage) {
        compareImage.style.animation = 'none';
        compareImage.src = data.image;
        compareImage.alt = data.alt;
        requestAnimationFrame(() => { compareImage.style.animation = ''; });
      }
      if (compareBadge) compareBadge.textContent = data.badge;
      if (compareTitle) compareTitle.textContent = data.title;
      if (compareCaption) compareCaption.textContent = data.caption;
    }

    areaButtons.forEach((button) => {
      button.addEventListener('click', () => {
        selectedArea = button.dataset.compareArea;
        if (selectedArea === 'day') selectedVersion = 'after';
        renderCalendarComparison();
      });
    });

    versionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.disabled) return;
        selectedVersion = button.dataset.compareVersion;
        renderCalendarComparison();
      });
    });

    renderCalendarComparison();
  }

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
