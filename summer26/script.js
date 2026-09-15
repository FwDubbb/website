(() => {
  const body = document.body;
  const revealControl = document.getElementById('revealControl');
  const inspectionWindow = revealControl?.closest('.inspection-window');
  const layerLabel = document.getElementById('layerLabel');
  const globalInspect = document.getElementById('globalInspect');
  const tracePulse = document.getElementById('tracePulse');
  const railItems = [...document.querySelectorAll('.trace-rail li')];
  const observedSections = [...document.querySelectorAll('[data-observe]')];
  const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
  const mobileIndexToggle = document.getElementById('mobileIndexToggle');
  const mobileIndex = document.getElementById('mobileIndex');
  const mobileInspect = document.getElementById('mobileInspect');

  function setReveal(value) {
    if (!inspectionWindow) return;
    const bounded = Math.max(0, Math.min(100, Number(value)));
    inspectionWindow.style.setProperty('--reveal', `${bounded}%`);
    revealControl.value = bounded;
    revealControl.setAttribute('aria-valuetext', bounded === 0 ? 'Professional side' : bounded === 100 ? 'Personal side' : `${bounded}% personal side`);
    inspectionWindow.querySelector('.personal-layer').setAttribute('aria-hidden', String(bounded === 0));
    inspectionWindow.querySelector('.professional-layer').setAttribute('aria-hidden', String(bounded === 100));
    document.querySelectorAll('[data-reveal]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.reveal) === bounded)));
    if (layerLabel) {
      layerLabel.textContent = bounded > 64 ? 'Personal side' : bounded < 36 ? 'Professional side' : 'Both in view';
    }
  }

  revealControl?.addEventListener('input', (event) => setReveal(event.target.value));

  document.querySelectorAll('[data-reveal]').forEach(button => button.addEventListener('click', () => setReveal(button.dataset.reveal)));

  function setMachine(machine, active) {
    machine.classList.toggle('inspecting', active);
    machine.querySelector('.machine-switch').setAttribute('aria-pressed', String(active));
    machine.querySelector('.phone-surface').inert = active;
    machine.querySelector('.machine-underlay').inert = !active;
  }

  function setAllLayers(active) {
    document.querySelectorAll('.project-details').forEach(details => { details.open = active; });
    document.querySelectorAll('.experience-machine').forEach((machine) => {
      setMachine(machine, active);
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

  function syncInspectControls(active) {
    globalInspect?.setAttribute('aria-pressed', String(active));
    if (mobileInspect) {
      mobileInspect.setAttribute('aria-pressed', String(active));
      mobileInspect.textContent = active ? 'Return to project surfaces −' : 'Inspect project systems +';
    }
  }

  globalInspect?.addEventListener('click', () => {
    const active = body.classList.toggle('system-mode');
    syncInspectControls(active);
    setAllLayers(active);
  });

  mobileInspect?.addEventListener('click', () => {
    globalInspect?.click();
    setMobileIndex(false);
  });

  function setMobileIndex(open) {
    if (!mobileIndex || !mobileIndexToggle) return;
    mobileIndex.hidden = !open;
    mobileIndexToggle.setAttribute('aria-expanded', String(open));
    body.classList.toggle('mobile-index-open', open);
    mobileIndexToggle.setAttribute('aria-label', open ? 'Close section menu' : 'Open section menu');
  }

  mobileIndexToggle?.addEventListener('click', () => {
    setMobileIndex(mobileIndexToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileIndex?.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => setMobileIndex(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mobileIndex.hidden) {
      setMobileIndex(false);
      mobileIndexToggle.focus();
    }
  });

  // Shared tab behavior: one selected tab, associated panels, and arrow-key navigation.
  function setupTabs(root, tabAttribute, panelAttribute) {
    const tabs = [...root.querySelectorAll('[' + tabAttribute + ']')];
    const panels = [...root.querySelectorAll('[' + panelAttribute + ']')];
    const prefix = root.closest('[data-case]').id + '-' + tabAttribute;
    function select(tab) {
      tabs.forEach((item, i) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        const panel = panels.find(p => p.getAttribute(panelAttribute) === item.getAttribute(tabAttribute));
        panel.hidden = !active;
        panel.classList.toggle('active', active);
      });
    }
    tabs.forEach((tab, i) => {
      const panel = panels.find(p => p.getAttribute(panelAttribute) === tab.getAttribute(tabAttribute));
      tab.id = prefix + '-tab-' + i;
      panel.id = panel.id || prefix + '-panel-' + i;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', event => {
        let index = i;
        if (event.key === 'ArrowRight') index = (i + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = tabs.length - 1;
        else return;
        event.preventDefault();
        select(tabs[index]);
        tabs[index].focus({ preventScroll: true });
        tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      });
    });
    select(tabs.find(tab => tab.classList.contains('active')) || tabs[0]);
  }
  [['.case-inspector', 'data-view', 'data-panel'], ['.guide-dossier', 'data-guide-view', 'data-guide-panel'], ['.flight-dossier', 'data-flight-view', 'data-flight-panel']].forEach(([selector, tab, panel]) => {
    document.querySelectorAll(selector).forEach(root => setupTabs(root, tab, panel));
  });

  document.querySelectorAll('.experience-machine').forEach(machine => {
    setMachine(machine, false);
    machine.querySelector('.machine-switch').addEventListener('click', () => setMachine(machine, !machine.classList.contains('inspecting')));
  });
  document.getElementById('openGuideChallenge')?.addEventListener('click', () => {
    const tab = document.querySelector('[data-guide-view="challenges"]');
    tab.click();
    tab.focus({ preventScroll: true });
    document.getElementById('guideDossier').scrollIntoView({ block: 'start' });
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
      routeButtons.forEach((item) => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
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
      flightQueryButtons.forEach((item) => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
      document.getElementById('flightQueryNumber').textContent = data.number;
      document.getElementById('flightQueryTitle').textContent = data.title;
      document.getElementById('flightQueryDescription').textContent = data.description;
      document.getElementById('flightQueryInput').textContent = data.input;
      document.getElementById('flightQueryOutput').textContent = data.output;
      document.getElementById('flightQueryEngine').textContent = data.engine;
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

      areaButtons.forEach((button) => { const active = button.dataset.compareArea === selectedArea; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
      versionButtons.forEach((button) => {
        const isBefore = button.dataset.compareVersion === 'before';
        button.disabled = selectedArea === 'day' && isBefore;
        button.classList.toggle('active', button.dataset.compareVersion === selectedVersion);
        button.setAttribute('aria-pressed', String(button.dataset.compareVersion === selectedVersion));
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

  // These controls choose an illustrative state, rather than separate tab panels.
  document.querySelectorAll('.route-controls, .compare-control-group').forEach(group => group.setAttribute('role', 'group'));
  document.querySelectorAll('[data-route], [data-flight-query]').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
  document.querySelector('.route-output')?.setAttribute('aria-live', 'polite');
  document.querySelector('.compare-figure figcaption')?.setAttribute('aria-live', 'polite');
  const imageShell = document.querySelector('.compare-image-shell');
  imageShell.tabIndex = 0;
  imageShell.setAttribute('role', 'region');
  imageShell.setAttribute('aria-label', 'Calendar screenshot; scroll horizontally to explore the full image');

  document.querySelectorAll('.close-record').forEach(button => button.addEventListener('click', () => {
    const details = button.closest('details');
    details.open = false;
    details.querySelector('summary').focus({ preventScroll: true });
    details.closest('.case-record').scrollIntoView({ block: 'start' });
  }));
  function revealTarget(hash, focus = false) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let ancestor = target.closest('details');
    while (ancestor) { ancestor.open = true; ancestor = ancestor.parentElement.closest('details'); }
    if (target.matches('.case-record')) target.querySelector('.project-details').open = true;
    if (target.matches('[role="tabpanel"]')) document.getElementById(target.getAttribute('aria-labelledby'))?.click();
    target.scrollIntoView({ block: 'start' });
    if (focus) { if (!target.hasAttribute('tabindex')) target.tabIndex = -1; target.focus({ preventScroll: true }); }
  }
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const hash = link.getAttribute('href');
    if (!document.getElementById(hash.slice(1))) return;
    event.preventDefault();
    setMobileIndex(false);
    if (location.hash !== hash) history.pushState(null, '', hash);
    revealTarget(hash, true);
  }));
  window.addEventListener('hashchange', () => revealTarget(location.hash));
  window.addEventListener('load', () => { if (location.hash) revealTarget(location.hash); });
  document.addEventListener('click', event => {
    if (!mobileIndex.hidden && !event.target.closest('.site-header')) setMobileIndex(false);
  });
  document.addEventListener('focusin', event => {
    if (!mobileIndex.hidden && !event.target.closest('.site-header')) setMobileIndex(false);
  });

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll('.case-overview, .history-heading, .skills-grid, .contact-grid').forEach(target => {
      target.classList.add('reveal-on-scroll');
      observer.observe(target);
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
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = 'contact';
    function markCurrent(link, active) {
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    railItems.forEach(item => { item.classList.toggle('active', item.dataset.section === current); markCurrent(item.querySelector('a'), item.dataset.section === current); });
    sectionLinks.forEach(link => markCurrent(link, link.dataset.sectionLink === current));
    document.getElementById('mobileSectionLabel').textContent = { top: 'About', work: 'Projects', history: 'Experience', skills: 'Skills', contact: 'Contact' }[current];
  }

  let railFrame = 0;
  function scheduleRail() {
    if (railFrame) return;
    railFrame = requestAnimationFrame(() => { updateRail(); railFrame = 0; });
  }
  window.addEventListener('scroll', scheduleRail, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) setMobileIndex(false);
    scheduleRail();
  });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleRail).observe(document.body);
  updateRail();
  syncInspectControls(body.classList.contains('system-mode'));
  setReveal(revealControl?.value || 0);
})();
