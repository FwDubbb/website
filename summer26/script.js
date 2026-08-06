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
      document.querySelector('[data-route="cost"]')?.click();
      document.querySelector('[data-guide-view="continuity"]')?.click();
      document.querySelector('[data-flight-view="model"]')?.click();
    } else {
      document.querySelector('[data-guide-view="features"]')?.click();
      document.querySelector('[data-flight-view="queries"]')?.click();
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
    cost: {
      status: 'LOWEST TOTAL FARE',
      method: 'Minimum total cost',
      path: 'BIS → DEN → ORD → JFK',
      priority: 'Fare in dollars',
      result: 'Dijkstra with fare weights',
      pathD: 'M90 210 L245 90 L385 175 L675 205'
    },
    miles: {
      status: 'SHORTEST TOTAL DISTANCE',
      method: 'Minimum total miles',
      path: 'BIS → MSP → ORD → JFK',
      priority: 'Miles traveled',
      result: 'Dijkstra with distance weights',
      pathD: 'M90 210 L245 285 L385 175 L675 205'
    },
    hops: {
      status: 'FEWEST CONNECTIONS',
      method: 'Minimum unit-weight path',
      path: 'BIS → ORD → JFK',
      priority: 'One unit per directed flight',
      result: 'Dijkstra with unit weights',
      pathD: 'M90 210 L385 175 L675 205'
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

  document.querySelectorAll('.flight-dossier').forEach((dossier) => {
    const tabs = [...dossier.querySelectorAll('[data-flight-view]')];
    const panels = [...dossier.querySelectorAll('[data-flight-panel]')];

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.flightView;
        tabs.forEach((item) => {
          const selected = item === tab;
          item.classList.toggle('active', selected);
          item.setAttribute('aria-selected', String(selected));
        });
        panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.flightPanel === view));
      });
    });
  });

  const flightQueryData = {
    airport: { number: '01', title: 'Display airport details', description: 'Resolve an airport code and return the information stored for that airport.', input: 'Airport code', output: 'Airport name, city, state, and other stored details', engine: 'Unordered-map index lookup' },
    state: { number: '02', title: 'List airports in a state', description: 'Find every airport whose record belongs to the selected state and report both the list and total count.', input: 'State name or abbreviation', output: 'Matching airports and number found', engine: 'Airport-record filtering' },
    departures: { number: '03', title: 'Show flights leaving a source', description: 'Retrieve every directed flight whose origin matches the selected airport.', input: 'Source airport code', output: 'All outbound flight options', engine: 'Origin-index adjacency lookup' },
    arrivals: { number: '04', title: 'Show flights arriving at a destination', description: 'Find every directed flight whose destination matches the selected airport.', input: 'Destination airport code', output: 'All inbound flight options', engine: 'Destination scan across directed routes' },
    direct: { number: '05', title: 'Find direct flights between two airports', description: 'Access every stored flight option for one exact origin-to-destination pair.', input: 'Source and destination codes', output: 'Direct flights, if available', engine: '3D vector route lookup' },
    path: { number: '06', title: 'Find a path with stops', description: 'Search the directed graph for a valid sequence of flights even when no direct route exists.', input: 'Source and destination codes', output: 'A valid multi-stop path with flight details', engine: 'Queue-based breadth-first search' },
    mincost: { number: '07', title: 'Find the minimum-cost route', description: 'Compare route totals using fare as the edge weight.', input: 'Source and destination codes', output: 'Cheapest available route and fare', engine: 'Dijkstra with monetary cost weights' },
    minmiles: { number: '08', title: 'Find the minimum-mile route', description: 'Compare route totals using flight distance as the edge weight.', input: 'Source and destination codes', output: 'Shortest-distance route and mileage', engine: 'Dijkstra with distance weights' },
    minhops: { number: '09', title: 'Find the route with the fewest connections', description: 'Treat every directed flight as an edge with weight one and minimize the total number of connections.', input: 'Source and destination codes', output: 'Minimum-hop path and airport sequence', engine: 'Dijkstra with unit edge weights' },
    withinflights: { number: '10', title: 'Find destinations reachable within F flights', description: 'Start from one airport after time T and limit exploration to a maximum number of flight legs.', input: 'Source, time T, and flight limit F', output: 'All destinations meeting the hop limit', engine: 'Queue-based flight-limited reachability' },
    underfare: { number: '11', title: 'Find destinations under a total fare', description: 'Explore destinations that remain reachable without exceeding the customer maximum budget.', input: 'Source, time T, and fare limit M', output: 'Reachable destinations within budget', engine: 'Queue-based fare-constrained reachability' },
    underhours: { number: '12', title: 'Find destinations reachable within H hours', description: 'Limit possible trips using the customer maximum elapsed travel time, including waiting and flight time.', input: 'Source, time T, and hour limit H', output: 'Destinations reachable within the time window', engine: 'Queue-based time-constrained search' },
    earliest: { number: '13', title: 'Find the earliest arrival after time T', description: 'Evaluate flights that depart after the current arrival time and keep the earliest known arrival at each airport.', input: 'Source, destination, and starting time T', output: 'Earliest arrival time and airport path', engine: 'Time-aware earliest-arrival search' },
    viahops: { number: '14', title: 'Travel through M using the fewest flights', description: 'Run the fewest-flight search from the source to M, then continue from M to the destination using the first segment arrival time.', input: 'Source, destination, required stop M, and time T', output: 'Two sequential minimum-flight path results', engine: 'Two-stage search: source → M → destination' },
    viaearly: { number: '15', title: 'Travel through M with the earliest arrival', description: 'Find the earliest source-to-M arrival, then use that arrival time to search from M to the final destination.', input: 'Source, destination, required stop M, and time T', output: 'Two sequential earliest-arrival path results', engine: 'Two-stage time-aware search' },
    viacheap: { number: '16', title: 'Travel through M at the lowest fare', description: 'Run a minimum-cost search from the source to M, then continue from M to the destination using the first segment arrival time.', input: 'Source, destination, required stop M, and time T', output: 'Two sequential minimum-cost path results', engine: 'Two-stage weighted search' }
  };

  const flightQueryButtons = [...document.querySelectorAll('[data-flight-query]')];
  flightQueryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const data = flightQueryData[button.dataset.flightQuery];
      if (!data) return;
      flightQueryButtons.forEach((item) => item.classList.toggle('active', item === button));
      document.getElementById('flightQueryNumber').textContent = data.number;
      document.getElementById('flightQueryTitle').textContent = data.title;
      document.getElementById('flightQueryDescription').textContent = data.description;
      document.getElementById('flightQueryInput').textContent = data.input;
      document.getElementById('flightQueryOutput').textContent = data.output;
      document.getElementById('flightQueryEngine').textContent = data.engine;
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

  function positionRailItems() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;

    observedSections.forEach((section) => {
      const item = railItems.find((railItem) => railItem.dataset.section === section.dataset.observe);
      if (!item) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const activationScroll = sectionTop - (window.innerHeight * 0.36);
      const ratio = Math.max(0, Math.min(1, activationScroll / scrollable));
      item.style.top = `${ratio * 100}%`;
    });
  }

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

  function refreshRail() {
    positionRailItems();
    updateRail();
  }

  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', refreshRail);
  window.addEventListener('load', refreshRail);

  if ('ResizeObserver' in window) {
    const railLayoutObserver = new ResizeObserver(() => positionRailItems());
    railLayoutObserver.observe(document.body);
  }

  refreshRail();
  setReveal(revealControl?.value || 58);
})();
