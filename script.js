/* ==========================================================
   PAKISTAN MONSOON OUTLOOK 2026 — script.js
   Mudasir Jameel · mudasirjameel828@gmail.com
   ========================================================== */

/* ---- THEME TOGGLE ---- */
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('mj-theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

themeBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', currentTheme);
  localStorage.setItem('mj-theme', currentTheme);
  reinitChart();
});

/* ---- NAV SCROLL EFFECT ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 60
    ? currentTheme === 'dark'
      ? 'rgba(6,13,26,0.97)'
      : 'rgba(244,247,251,0.97)'
    : '';
}, { passive: true });

/* ---- HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger.addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

/* ---- ACTIVE NAV LINK ---- */
const navLinks = navMenu.querySelectorAll('a');
const allSections = document.querySelectorAll('section[id]');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        if(a.getAttribute('href') === '#' + e.target.id) {
          a.classList.add('active');
        } else if (a.getAttribute('href').startsWith('#')) {
          a.classList.remove('active');
        }
      });
    }
  });
}, { rootMargin: `-${65}px 0px -60% 0px` });
allSections.forEach(s => io.observe(s));

/* ---- SCROLL REVEAL ---- */
const revEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const d = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('in'), d);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
revEls.forEach(el => revObs.observe(el));

setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}, 2500);

/* ---- DYNAMIC WINDY MAP LOADER ---- */
const mapObs = new IntersectionObserver(entries => {
  if(entries[0].isIntersecting) {
    const iframe = document.getElementById('windy-iframe');
    const loader = document.getElementById('map-loader');
    if(iframe && !iframe.src) {
      iframe.src = iframe.getAttribute('data-src');
      iframe.onload = () => {
        if(loader) loader.style.display = 'none';
        iframe.style.display = 'block';
      };
    }
    mapObs.disconnect(); 
  }
}, {rootMargin: '200px'});

const mapContainer = document.getElementById('map-container');
if(mapContainer) mapObs.observe(mapContainer);

/* ---- LIVE CLOCK ---- */
function tick() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const pk = new Date(utcMs + 5 * 3600000);
  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const pad = n => String(n).padStart(2, '0');
  const te = document.getElementById('live-time');
  const de = document.getElementById('live-date');
  if (te) te.textContent = `${pad(pk.getHours())}:${pad(pk.getMinutes())}:${pad(pk.getSeconds())}`;
  if (de) de.textContent = `${DAYS[pk.getDay()]}, ${pk.getDate()} ${MONTHS[pk.getMonth()]} ${pk.getFullYear()}`;
}
tick();
setInterval(tick, 1000);

/* ---- TYPED TEXT ---- */
const phrases = [
  'Analyzing Monsoon 2026 Dynamics',
  'Tracking El Niño Pacific Signals',
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
    setTimeout(typeLoop, 38);
  } else {
    typedEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
    setTimeout(typeLoop, 62);
  }
}
typeLoop();

/* ==========================================================
   LIVE WEATHER (WeatherAPI Integrated)
   ========================================================== */

const WEATHER_API_KEY = '0be733d8b3e840809ca201739261403'; 
const CITIES = ['Karachi', 'Islamabad', 'Lahore', 'Quetta', 'Peshawar'];

function buildWeatherCard(cityName, data) {
  const c = data.current;
  const card = document.createElement('div');
  card.className = 'w-card glass reveal';
  
  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
      <div>
        <div class="wc-city">${cityName}</div>
        <div class="wc-cond">${c.condition.text}</div>
      </div>
      <img src="https:${c.condition.icon}" alt="${c.condition.text}" style="width: 55px; height: 55px; object-fit: contain; margin-top: -10px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"/>
    </div>
    <div class="wc-temp">${c.temp_c.toFixed(1)}°C</div>
    <div class="wc-stats">
      <div class="wc-row"><span class="wc-row-label">💧 Humidity</span><span class="wc-row-val">${c.humidity}%</span></div>
      <div class="wc-row"><span class="wc-row-label">🌬 Wind</span><span class="wc-row-val">${c.wind_kph.toFixed(1)} km/h</span></div>
      <div class="wc-row"><span class="wc-row-label">⏱ Pressure</span><span class="wc-row-val">${c.pressure_mb} mb</span></div>
      <div class="wc-row"><span class="wc-row-label">🌡 Feels Like</span><span class="wc-row-val">${c.feelslike_c.toFixed(1)}°C</span></div>
    </div>`;
  return card;
}

function buildErrorCard(cityName) {
  const card = document.createElement('div');
  card.className = 'w-card glass reveal';
  card.innerHTML = `<div class="wc-city">${cityName}</div><div class="wc-temp">—</div><div class="wc-err">Data unavailable</div>`;
  return card;
}

async function loadWeather() {
  const grid = document.getElementById('weather-grid');
  if(!grid) return;

  try {
    const results = await Promise.all(CITIES.map(city =>
      fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=no`)
        .then(r => {
          if (!r.ok) throw new Error('API Error');
          return r.json();
        }).catch(() => null)
    ));
    
    grid.innerHTML = '';
    results.forEach((data, i) => {
      const card = (data && data.current) ? buildWeatherCard(CITIES[i], data) : buildErrorCard(CITIES[i]);
      grid.appendChild(card);
      setTimeout(() => card.classList.add('in'), i * 90 + 150);
    });
  } catch {
    grid.innerHTML = '<div class="w-loading" style="color:var(--below)">Unable to load weather data. Check your internet connection.</div>';
  }
}
loadWeather();

/* ---- PROBABILITY BAR CHART ---- */
let chartInst = null;
function buildChart() {
  const ctx = document.getElementById('probChart');
  if (!ctx) return;
  
  if (typeof Chart === 'undefined') {
    setTimeout(buildChart, 500);
    return;
  }

  if (chartInst) { chartInst.destroy(); chartInst = null; }
  const isDark = html.getAttribute('data-theme') === 'dark';
  const textColor  = isDark ? '#8aabcf' : '#1e3a5a';
  const gridColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(14,100,150,0.08)';
  const labels = ['Sindh', 'S. Balochistan', 'Punjab', 'KPK', 'Northern Areas'];
  chartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Below Normal %', data: [55,50,25,20,25],
          backgroundColor: isDark ? 'rgba(248,113,113,0.5)' : 'rgba(220,38,38,0.45)',
          borderColor: isDark ? '#f87171' : '#dc2626', borderWidth: 2, borderRadius: 6 },
        { label: 'Near Normal %',  data: [30,35,50,50,45],
          backgroundColor: isDark ? 'rgba(96,165,250,0.5)' : 'rgba(37,99,235,0.45)',
          borderColor: isDark ? '#60a5fa' : '#2563eb', borderWidth: 2, borderRadius: 6 },
        { label: 'Above Normal %', data: [15,15,25,30,30],
          backgroundColor: isDark ? 'rgba(74,222,128,0.5)' : 'rgba(22,163,74,0.45)',
          borderColor: isDark ? '#4ade80' : '#16a34a', borderWidth: 2, borderRadius: 6 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: {
        legend: { labels: { color: textColor, font: { family: "'DM Sans'", size: 12 }, padding: 20 } },
        tooltip: {
          backgroundColor: isDark ? 'rgba(11,22,37,0.96)' : 'rgba(255,255,255,0.97)',
          titleColor: isDark ? '#e8f0fa' : '#0d1a2a',
          bodyColor: textColor,
          borderColor: isDark ? 'rgba(56,189,248,0.3)' : 'rgba(3,105,161,0.25)',
          borderWidth: 1, padding: 12, cornerRadius: 8,
          callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.y}%` }
        }
      },
      scales: {
        x: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor }, border: { display: false } },
        y: { ticks: { color: textColor, callback: v => v + '%' }, grid: { color: gridColor }, border: { display: false }, max: 100 }
      }
    }
  });
}

const chartEl = document.getElementById('probChart');
if (chartEl) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { buildChart(); }
  }, { threshold: 0.2 }).observe(chartEl.parentElement);
}
function reinitChart() { if (chartInst) buildChart(); }

/* ---- DRIVER TABS ---- */
document.querySelectorAll('.dtab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dtab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.driver-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('panel-' + btn.dataset.panel);
    if (panel) {
      panel.classList.add('active');
      panel.querySelectorAll('.dpi-fill, .conf-fill, .dep-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = w; }));
      });
    }
  });
});

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 66, behavior: 'smooth' });
      }
    }
  });
});

/* ============================================================
   RAIN CANVAS
   ============================================================ */
(function initRain() {
  const canvas = document.getElementById('rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, drops = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function Drop() {
    this.reset = function () {
      this.x = Math.random() * W;
      this.y = Math.random() * H * -1;
      this.len = Math.random() * 16 + 8;
      this.spd = Math.random() * 6 + 4;
      this.alpha = Math.random() * 0.15 + 0.04;
      this.w = Math.random() * 0.7 + 0.2;
    };
    this.reset();
    this.update = function () { this.y += this.spd; this.x += this.spd * 0.13; if (this.y > H + this.len) this.reset(); };
    this.draw = function () {
      ctx.save(); ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = currentTheme === 'dark' ? 'rgba(147,210,255,1)' : 'rgba(3,105,161,0.8)';
      ctx.lineWidth = this.w;
      ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x + this.len * 0.13, this.y + this.len);
      ctx.stroke(); ctx.restore();
    };
  }
  for (let i = 0; i < 100; i++) { const d = new Drop(); d.y = Math.random() * H; drops.push(d); }

  function loop() { ctx.clearRect(0, 0, W, H); drops.forEach(d => { d.update(); d.draw(); }); requestAnimationFrame(loop); }
  loop();
})();

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, parts = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function Particle() {
    this.reset = function () {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = Math.random() * 1.4 + 0.3;
      this.alpha = Math.random() * 0.35 + 0.07;
      this.spd = Math.random() * 0.25 + 0.04;
    };
    this.reset();
    this.update = function () { this.y -= this.spd; if (this.y < 0) { this.y = H; this.x = Math.random() * W; } };
    this.draw = function () {
      const c = currentTheme === 'dark' ? `rgba(56,189,248,${this.alpha})` : `rgba(3,105,161,${this.alpha * 0.7})`;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = c; ctx.fill();
    };
  }
  for (let i = 0; i < 50; i++) parts.push(new Particle());

  function loop() { ctx.clearRect(0, 0, W, H); parts.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(loop); }
  loop();
})();

/* ==========================================================
   ATMOSPHERIC HEAT STRESS ANALYZER
   ========================================================== */
function calculateHI() {
  const tempInput = document.getElementById('hi-temp').value;
  const humInput = document.getElementById('hi-hum').value;
  
  if (tempInput === '' || humInput === '') return;

  const T = parseFloat(tempInput);
  const R = parseFloat(humInput);

  if (isNaN(T) || isNaN(R)) return;

  const resBox = document.getElementById('hi-result-box');
  const resVal = document.getElementById('hi-result');
  const resRisk = document.getElementById('hi-risk');

  const Tf = (T * 9/5) + 32;
  let hiF = 0.5 * (Tf + 61.0 + ((Tf - 68.0) * 1.2) + (R * 0.094));

  if (hiF >= 80) {
    hiF = -42.379 + 2.04901523*Tf + 10.14333127*R - 0.22475541*Tf*R - 0.00683783*Tf*Tf - 0.05481717*R*R + 0.00122874*Tf*Tf*R + 0.00085282*Tf*R*R - 0.00000199*Tf*Tf*R*R;
  }
  
  const hiC = (hiF - 32) * 5/9;

  resBox.style.display = 'block';
  resVal.textContent = Math.round(hiC) + '°C';

  if (hiC < 32) {
    resRisk.textContent = 'Standard Condition';
    resRisk.className = 'qb qb-neutral';
    resRisk.style.background = 'var(--neutral-bg)';
    resRisk.style.color = 'var(--neutral)';
  } else if (hiC < 41) {
    resRisk.textContent = 'Elevated Thermal Stress';
    resRisk.className = 'qb';
    resRisk.style.background = 'var(--warn-bg)';
    resRisk.style.color = 'var(--warn)';
  } else if (hiC < 54) {
    resRisk.textContent = 'DANGER: High Heat Risk';
    resRisk.className = 'qb qb-below';
    resRisk.style.background = 'var(--below-bg)';
    resRisk.style.color = 'var(--below)';
  } else {
    resRisk.textContent = 'EXTREME DANGER: Heatstroke Imminent';
    resRisk.className = 'qb qb-below';
    resRisk.style.background = 'var(--below)';
    resRisk.style.color = 'var(--bg)';
  }
}

function updateDynamics() {
  const steering = ["Strong Westerly Flow", "Monsoon Trough Active", "High Pressure Ridge", "Neutral / Transitional", "Easterly Wave"];
  const el = document.getElementById('dyn-steering');
  if (el) el.textContent = steering[Math.floor(Math.random() * steering.length)];
  
  const moistureFill = document.querySelector('#moisture-bar .conf-fill');
  if (moistureFill) {
    const randomPct = Math.floor(Math.random() * 60) + 40;
    moistureFill.style.width = randomPct + '%';
  }
}

if (document.getElementById('dyn-steering')) {
  setInterval(updateDynamics, 10000);
  setTimeout(updateDynamics, 1000);
}

function updateLiveDrivers() {
  const ensoVal = document.getElementById('live-enso-val');
  const iodVal = document.getElementById('live-iod-val');
  const sstVal = document.getElementById('live-sst-val');

  if(ensoVal && iodVal && sstVal) {
    const baseEnso = 0.60;
    const baseIod = 0.15;
    const baseSst = 0.55;

    const fluctuate = (base) => (base + (Math.random() * 0.04 - 0.02)).toFixed(2);

    ensoVal.textContent = `+${fluctuate(baseEnso)}°C`;
    iodVal.textContent = `+${fluctuate(baseIod)}°C`;
    sstVal.textContent = `+${fluctuate(baseSst)}°C`;
  }
}

if (document.getElementById('live-enso-val')) {
  setInterval(updateLiveDrivers, 4000);
}

console.log('%c⛈  Pakistan Monsoon Outlook 2026 · Mudasir Jameel', 'color:#38bdf8;font-size:13px;font-family:monospace');