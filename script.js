/* ==========================================================
   PAK CLIMATE INSIGHT 2026 — script.js
   Mudasir Jameel
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  let currentTheme = localStorage.getItem('mj-theme') || 'dark';
  html.setAttribute('data-theme', currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', currentTheme);
      localStorage.setItem('mj-theme', currentTheme);
      if (typeof window.reinitChart === 'function') window.reinitChart();
    });
  }

  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  const dropBtns = document.querySelectorAll('.dropbtn');
  dropBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); 
      const dropdownContent = btn.nextElementSibling;
      if (dropdownContent.classList.contains('show-drop-mobile')) {
        dropdownContent.classList.remove('show-drop-mobile');
      } else {
        dropdownContent.classList.add('show-drop-mobile');
      }
    });
  });

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => navMenu.classList.toggle('open'));
    navMenu.querySelectorAll('a:not(.dropbtn)').forEach(a => {
      a.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  if (navMenu) {
    const navLinks = navMenu.querySelectorAll('a:not(.dropbtn)');
    const allSections = document.querySelectorAll('section[id]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => {
            if (a.getAttribute('href') && (a.getAttribute('href').startsWith('#') || a.getAttribute('href').startsWith('index.html#'))) {
               a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id || a.getAttribute('href') === 'index.html#' + e.target.id);
            }
          });
        }
      });
    }, { rootMargin: `-120px 0px -60% 0px` });
    allSections.forEach(s => io.observe(s));
  }

  const revEls = document.querySelectorAll('.reveal');
  if (revEls.length > 0) {
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const d = parseInt(e.target.dataset.delay || 0);
          setTimeout(() => e.target.classList.add('in'), d);
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    revEls.forEach(el => revObs.observe(el));
  }

  setTimeout(() => { document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')); }, 2500);

  const mapContainer = document.getElementById('map-container');
  if(mapContainer) {
    const mapObs = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) {
        const iframe = document.getElementById('windy-iframe');
        const loader = document.getElementById('map-loader');
        if(iframe && !iframe.src) {
          iframe.src = iframe.getAttribute('data-src');
          iframe.onload = () => { if(loader) loader.style.display = 'none'; iframe.style.display = 'block'; };
        }
        mapObs.disconnect(); 
      }
    }, {rootMargin: '200px'});
    mapObs.observe(mapContainer);
  }

  function tick() {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const pk = new Date(utcMs + 5 * 3600000); 
    const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const pad = n => String(n).padStart(2, '0');
    
    const te = document.getElementById('live-time');
    const de = document.getElementById('live-date');
    if (te) te.textContent = `${pad(pk.getHours())}:${pad(pk.getMinutes())}:${pad(pk.getSeconds())} PKT`;
    if (de) de.textContent = `${DAYS[pk.getDay()]}, ${pk.getDate()} ${MONTHS[pk.getMonth()]} ${pk.getFullYear()}`;
  }
  tick();
  setInterval(tick, 1000);

  const phrases = [
    'Analyzing Monsoon 2026 Dynamics',
    'Tracking Strong El Niño SST Plumes',
    'Tracking Shawwal Crescent Sighting',
    'Decoding Arabian Sea SST Anomalies',
    'Forecasting Pakistan Rainfall Patterns',
  ];
  let pi = 0, ci = 0, deleting = false;
  const typedEl = document.getElementById('typed-out');
  function typeLoop() {
    if (!typedEl) return;
    const phrase = phrases[pi];
    if (deleting) {
      typedEl.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
      setTimeout(typeLoop, 35);
    } else {
      typedEl.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 2500); return; }
      setTimeout(typeLoop, 60);
    }
  }
  typeLoop();

  const CITIES = [
    { name: 'Karachi',   lat: 24.8608, lon: 67.0104 },
    { name: 'Khuzdar',   lat: 27.8123, lon: 66.6127 },
    { name: 'Quetta',    lat: 30.1798, lon: 66.9750 },
    { name: 'Islamabad', lat: 33.7294, lon: 73.0931 },
    { name: 'Lahore',    lat: 31.5204, lon: 74.3587 },
    { name: 'Peshawar',  lat: 34.0150, lon: 71.5249 },
  ];
  const WMO = {
    0:'Clear Sky', 1:'Mainly Clear', 2:'Partly Cloudy', 3:'Overcast',
    45:'Foggy', 48:'Icy Fog', 51:'Light Drizzle', 53:'Drizzle', 55:'Dense Drizzle',
    61:'Slight Rain', 63:'Moderate Rain', 65:'Heavy Rain',
    71:'Slight Snow', 73:'Moderate Snow', 75:'Heavy Snow',
    80:'Showers', 81:'Heavy Showers', 82:'Violent Showers',
    95:'Thunderstorm', 96:'Thunder + Hail', 99:'Heavy Thunder + Hail',
  };

  function buildWeatherCard(city, data) {
    const c = data.current;
    const card = document.createElement('div');
    card.className = 'glass-card w-card reveal in';
    let aqiBadge = city.name === 'Lahore' ? '<span class="wc-badge" style="background:var(--warn); color:#000;">AQI Mod</span>' : '<span class="wc-badge" style="background:var(--above); color:#000;">AQI Good</span>';
    card.innerHTML = `<div class="wc-top"><div class="wc-city">${city.name}</div>${aqiBadge}</div><div class="wc-cond">${WMO[c.weather_code] || 'VARIABLE'}</div><div class="wc-temp">${c.temperature_2m != null ? c.temperature_2m.toFixed(1) + '°C' : '—'}</div><div class="wc-stats"><div class="wc-stat"><span class="wc-stat-icon">💧</span> Humidity: <span class="wc-row-val">${c.relative_humidity_2m}%</span></div><div class="wc-stat"><span class="wc-stat-icon">🌬</span> Wind: <span class="wc-row-val">${c.wind_speed_10m.toFixed(1)} km/h</span></div></div>`;
    return card;
  }

  async function loadWeather() {
    const grid = document.getElementById('weather-grid');
    if(!grid) return;
    try {
      const results = await Promise.all(CITIES.map(city =>
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=Asia%2FKarachi`)
          .then(r => r.json()).catch(() => null)
      ));
      grid.innerHTML = '';
      results.forEach((data, i) => { if(data && data.current) { const card = buildWeatherCard(CITIES[i], data); grid.appendChild(card); } });
    } catch { grid.innerHTML = '<div class="w-loading" style="color:var(--below)">Unable to load weather data. Check your internet connection.</div>'; }
  }
  loadWeather();

  /* ---- PROBABILITY BAR CHART (MOBILE FIX) ---- */
  let chartInst = null;
  function buildChart() {
    const ctx = document.getElementById('probChart');
    if (!ctx) return;
    if (typeof Chart === 'undefined') { setTimeout(buildChart, 500); return; }
    if (chartInst) { chartInst.destroy(); chartInst = null; }
    
    const isDark = html.getAttribute('data-theme') === 'dark';
    const textColor  = isDark ? '#94a3b8' : '#334155';
    const gridColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)';
    const labels = ['Sindh', 'S. Balochistan', 'Punjab', 'KPK', 'Northern Areas'];
    
    chartInst = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Below Normal %', data: [65, 60, 15, 10, 15], backgroundColor: 'rgba(239,68,68,0.7)', borderColor: '#ef4444', borderWidth: 1, borderRadius: 4 },
          { label: 'Near Normal %',  data: [25, 30, 30, 35, 30], backgroundColor: 'rgba(56,189,248,0.7)', borderColor: '#38bdf8', borderWidth: 1, borderRadius: 4 },
          { label: 'Above Normal %', data: [10, 10, 55, 55, 55], backgroundColor: 'rgba(16,185,129,0.7)', borderColor: '#10b981', borderWidth: 1, borderRadius: 4 },
        ]
      },
      options: {
        responsive: true, 
        maintainAspectRatio: false, /* THIS FIXES MOBILE HEIGHT */
        plugins: {
          legend: { labels: { color: textColor, font: { family: "'Inter'", size: window.innerWidth < 768 ? 10 : 12 }, boxWidth: 12, padding: 15 } },
          tooltip: {
            backgroundColor: isDark ? '#0f172a' : '#ffffff', titleColor: isDark ? '#f8fafc' : '#0f172a', bodyColor: textColor,
            borderColor: isDark ? '#1e293b' : '#e2e8f0', borderWidth: 1, padding: 12, cornerRadius: 6,
            callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.y}%` }
          }
        },
        scales: {
          x: { ticks: { color: textColor, font: { size: 11 } }, grid: { display: false } },
          y: { ticks: { color: textColor, font: { size: 11 }, callback: v => v + '%' }, grid: { color: gridColor }, border: { display: false }, max: 100 }
        }
      }
    });
  }

  const chartEl = document.getElementById('probChart');
  if (chartEl) { new IntersectionObserver(entries => { if (entries[0].isIntersecting) { buildChart(); } }, { threshold: 0.2 }).observe(chartEl.parentElement); }
  window.reinitChart = function() { if (chartInst) buildChart(); };

  document.querySelectorAll('.dtab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dtab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.driver-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panel-' + btn.dataset.panel);
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.dpi-fill, .conf-fill, .dep-fill').forEach(bar => {
          const w = bar.style.width; bar.style.width = '0%';
          requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = w; }));
        });
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' }); }
      }
    });
  });

  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) { scrollTopBtn.style.display = "block"; } else { scrollTopBtn.style.display = "none"; }
    });
    scrollTopBtn.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

});

window.calcFeelsLike = function() {
  const tC = parseFloat(document.getElementById('hi-temp').value); const h = parseFloat(document.getElementById('hi-hum').value); const res = document.getElementById('hi-result');
  if (isNaN(tC) || isNaN(h)) { res.innerHTML = "Please enter valid numbers."; res.classList.add('active'); return; }
  let tF = (tC * 9/5) + 32; let hiF = 0;
  if (tF < 80) { hiF = tF; } else {
    let simpleHI = 0.5 * (tF + 61.0 + ((tF - 68.0) * 1.2) + (h * 0.094));
    if (simpleHI < 80) { hiF = simpleHI; } else {
      hiF = -42.379 + 2.04901523*tF + 10.14333127*h - 0.22475541*tF*h - 0.00683783*tF*tF - 0.05481717*h*h + 0.00122874*tF*tF*h + 0.00085282*tF*h*h - 0.00000199*tF*tF*h*h;
      if (h < 13 && tF >= 80 && tF <= 112) { hiF -= ((13 - h) / 4) * Math.sqrt((17 - Math.abs(tF - 95)) / 17); }
      else if (h > 85 && tF >= 80 && tF <= 87) { hiF += ((h - 85) / 10) * ((87 - tF) / 5); }
    }
  }
  let hiC = (hiF - 32) * 5/9; res.innerHTML = `Heat Index: <span style="color:var(--accent); font-family:var(--font-head); font-size:1.8rem; display:block; margin-top:0.5rem;">${hiC.toFixed(1)} °C</span>`; res.classList.add('active');
};

window.calcAvgTemp = function() {
  const maxStr = document.getElementById('avg-max').value; const minStr = document.getElementById('avg-min').value; const res = document.getElementById('temp-result'); const parseArr = (str) => str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)); const maxArr = parseArr(maxStr); const minArr = parseArr(minStr);
  if (maxArr.length === 0 && minArr.length === 0) { res.innerHTML = "Please enter temperature values."; res.classList.add('active'); return; }
  let html = "";
  if (maxArr.length > 0) { const avgMax = maxArr.reduce((a, b) => a + b) / maxArr.length; html += `Avg Max: <span style="color:var(--below)">${avgMax.toFixed(1)} °C</span><br>`; }
  if (minArr.length > 0) { const avgMin = minArr.reduce((a, b) => a + b) / minArr.length; html += `Avg Min: <span style="color:var(--accent)">${avgMin.toFixed(1)} °C</span>`; }
  res.innerHTML = html; res.classList.add('active');
};

window.calcAvgRain = function() {
  const rainStr = document.getElementById('avg-rain').value; const res = document.getElementById('rain-result'); const rainArr = rainStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (rainArr.length === 0) { res.innerHTML = "Please enter rainfall values."; res.classList.add('active'); return; }
  const total = rainArr.reduce((a, b) => a + b); const avg = total / rainArr.length;
  res.innerHTML = `Total: <span style="color:var(--accent)">${total.toFixed(1)} mm</span><br>Avg: <span style="color:var(--above)">${avg.toFixed(1)} mm</span>/event`; res.classList.add('active');
};