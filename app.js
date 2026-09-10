/* ==========================================================================
   EntryMap — dashboard logic
   ========================================================================== */
(function () {
'use strict';

/* ---------------------------------------------------------------- 1. Data */
/* UNIS and PROGRAMS live in universities-data.js and programs-data.js, which
   index.html loads as plain scripts before this file. */
if (typeof UNIS === 'undefined' || typeof PROGRAMS === 'undefined') {
  throw new Error('EntryMap: universities-data.js and programs-data.js must load before app.js');
}


const CURRICULA = {
  kz: ['Kazakhstan National Curriculum','NIS Programme (NIS-Grade 12)','IB Diploma Programme','A-Levels'],
  uz: ['Uzbekistan National Curriculum','IB Diploma Programme','A-Levels'],
  kg: ['Kyrgyzstan National Curriculum','IB Diploma Programme'],
  ru: ['Russian National Curriculum (Attestat)','IB Diploma Programme','A-Levels'],
  tr: ['Turkish National Curriculum (Lise Diploması)','IB Diploma Programme','A-Levels'],
  ae: ['UAE MoE Curriculum','British Curriculum (A-Levels)','American Diploma','IB Diploma Programme'],
  gb: ['A-Levels','BTEC Level 3','IB Diploma Programme','Scottish Highers']
};

const COUNTRY_NAMES = { kz:'Kazakhstan', uz:'Uzbekistan', kg:'Kyrgyzstan', ru:'Russia',
                        tr:'Türkiye', ae:'United Arab Emirates', gb:'United Kingdom' };

const DEFAULT_STATE = {
  profile: { first:'Aigerim', last:'Sultanova', country:'kz',
             curriculum:'Kazakhstan National Curriculum',
             gpa:3.82, ielts:7.5, sat:1480, recs:2, intake:'Fall 2026' },
  saved: ['mit','stanford','oxford','hku','nyuad'],
  compare: ['mit','stanford','oxford'],
  programProgress: {},
  explored: 12,
  tally: { meets:5, partial:2, fails:1 },
  recent: [
    { uni:'mit',      program:'Computer Science',    when:'Yesterday',  status:'meets'   },
    { uni:'stanford', program:'Electrical Eng.',     when:'2 days ago', status:'partial' },
    { uni:'oxford',   program:'Economics',           when:'3 days ago', status:'fails'   },
    { uni:'hku',      program:'Data Science',        when:'5 days ago', status:'meets'   }
  ],
  roadmap: [
    { id:'r1', title:'Profile Completed',   note:'Academic details and test scores added', status:'done' },
    { id:'r2', title:'University Research',  note:'Shortlist 8–10 universities that fit you', status:'active' },
    { id:'r3', title:'Prepare Documents',    note:'Transcripts, essays and reference letters', status:'todo' },
    { id:'r4', title:'Submit Applications',  note:'Send applications before the deadlines', status:'todo' }
  ],
  docs: [
    { id:'d1', title:'Academic Transcript',     note:'Grades 9–11 · certified copy', status:'done' },
    { id:'d2', title:'IELTS / English Test',    note:'Overall band 7.5 · valid to 2028', status:'done' },
    { id:'d3', title:'Recommendation Letters',  note:'2 of 3 letters received', status:'todo' },
    { id:'d4', title:'Personal Statement',      note:'Draft 2 · 640 / 650 words', status:'progress' },
    { id:'d5', title:'Financial Documents',     note:'Bank statement and sponsor letter', status:'todo' }
  ],
  notifications: [
    { id:'n1', tone:'green', icon:'i-check-circle', text:'Your MIT eligibility check is complete — you meet the requirements.', time:'2 hours ago', read:false },
    { id:'n2', tone:'amber', icon:'i-clock',        text:'Oxford application deadline is in 21 days.', time:'Yesterday', read:false },
    { id:'n3', tone:'blue',  icon:'i-upload',       text:'Reminder: upload your third recommendation letter.', time:'3 days ago', read:false }
  ]
};

const RESOURCES = [
  { icon:'i-cap',     tone:'blue',   title:'Application Starter Guide', text:'A step-by-step walkthrough of the whole admissions journey, from shortlisting to acceptance.',
    body:'The starter guide breaks the application year into four phases: research (Jun–Aug), preparation (Sep–Oct), submission (Nov–Jan) and decisions (Feb–Apr). Each phase lists the documents you need, the tests to book and the realistic time each task takes.' },
  { icon:'i-file',    tone:'purple', title:'Writing a Personal Statement', text:'Structure, tone and the three mistakes that sink most first drafts.',
    body:'Open with a concrete moment, not a thesis. Spend the middle two thirds on evidence — what you built, measured, or changed. Close by connecting your work to a specific programme, named courses included. Avoid: quoting dictionaries, listing adjectives about yourself, and repeating your CV.' },
  { icon:'i-globe',   tone:'green',  title:'Country Requirement Matrix', text:'How Kazakhstani qualifications map to US, UK, EU and Asian entry requirements.',
    body:'US universities convert the Attestat to a 4.0 GPA and typically ask for SAT/ACT. UK universities compare against A-Levels and usually require a foundation year unless you hold IB or A-Levels. EU institutions often accept the Attestat with a national entrance exam. Most Asian universities accept it directly with IELTS 6.5+.' },
  { icon:'i-wallet',  tone:'amber',  title:'Scholarships & Funding', text:'Need-based aid, merit awards and government programmes you can still apply to.',
    body:'Track three funding tracks in parallel: university need-based aid (submit CSS Profile by early January), merit scholarships (usually the same deadline as the main application), and national programmes such as Bolashak. Budget for application fees — waivers exist and are rarely advertised.' },
  { icon:'i-target',  tone:'red',    title:'Building a Balanced Shortlist', text:'Why the 3–4–3 rule beats applying to ten reach schools.',
    body:'Aim for three reach universities, four matches and three safeties. A match is one where your GPA and test scores sit at or above the published median. Anything where the median is more than 0.3 GPA above yours is a reach, no matter how much you want it.' },
  { icon:'i-play',    tone:'blue',   title:'Interview Preparation', text:'Common formats, timing, and how to practise for Oxbridge-style interviews.',
    body:'Most interviews last 20–30 minutes and test how you think, not what you know. Practise reasoning out loud on unfamiliar problems. For Oxbridge, expect subject material you have not seen; the interviewer wants to watch you get unstuck, so narrate your attempts rather than staying silent.' }
];


/* --------------------------------------------------------------- 2. State */

const LS_KEY = 'entrymap.state.v1';
const LS_THEME = 'entrymap.theme';

let S = load();

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return Object.assign(structuredClone(DEFAULT_STATE), JSON.parse(raw));
  } catch (e) { /* storage unavailable or corrupt — fall through to defaults */ }
  return structuredClone(DEFAULT_STATE);
}
function save() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
}

/* ----------------------------------------------------------- 3. Utilities */

const $  = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const uni = id => UNIS.find(u => u.id === id);
/* QS does not rank every institution — Nazarbayev University, for one */
const rankLabel = u => (u.rank == null ? 'Unranked' : '#' + u.rank);
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

const icon = (id, cls) => '<svg class="' + (cls || 'ico') + '" aria-hidden="true"><use href="#' + id + '"/></svg>';

/* ---- Logos -------------------------------------------------------------
   logo(entity) renders the organisation's real mark from a public logo API,
   layered over a fallback that is always present underneath. Nothing is ever
   an empty box: the fallback paints first, the remote image covers it once it
   arrives, and a failed request (offline, no logo on file, blocked host) is
   caught by the capturing 'error' listener below, which drops the <img> and
   leaves the fallback showing.
   The fallback is the hand-drawn sprite symbol where we have one, otherwise a
   generated initials tile in the entity's accent colour.                    */

/* Logo sources, tried in order until one loads:
     1. logoUrl  — the official mark on Wikimedia Commons, harvested from the
                   entity's Wikidata logo claim and hand-checked. Only present
                   where that mark is square-ish; a wordmark would be an
                   illegible sliver in a 34px slot.
     2. icon.horse — the organisation's own square brand icon at 180-256px,
                   which is what most institutions use as their compact mark.
     3. DuckDuckGo — second icon service, in case the first is unreachable.
   Clearbit's free logo API, the usual suggestion, was retired and now fails for
   every domain. None of the icon services answer 404 for unknown domains, so in
   practice the initials tile is what you see offline. */
function logoCandidates(el) {
  const out = [];
  if (el.dataset.logoUrl) out.push(el.dataset.logoUrl);
  const d = el.dataset.logoDomain;
  if (d) {
    out.push('https://icon.horse/icon/' + d);
    out.push('https://icons.duckduckgo.com/ip3/' + d + '.ico');
  }
  return out;
}
const firstLogoSrc = e => e.logoUrl || (e.domain ? 'https://icon.horse/icon/' + e.domain : '');

function initials(e) {
  const src = String(e.short || e.name || '?').replace(/^(The|University of|Universit\u00e9) /i, '');
  const words = src.split(/[\s&\-\u2014]+/).filter(Boolean);
  const out = words.length > 1 ? words[0][0] + words[1][0] : src.slice(0, 2);
  return out.toUpperCase();
}

function logoFallbackHTML(e) {
  if (e.logo) return '<span class="logo-fb"><svg aria-hidden="true"><use href="#' + e.logo + '"/></svg></span>';
  return '<span class="logo-fb logo-fb--initials" style="background:' + esc(e.accent || '#4F5FE8') + '">' +
    esc(initials(e)) + '</span>';
}

function logo(e, cls) {
  if (!e) return '';
  const src = firstLogoSrc(e);
  const inner = logoFallbackHTML(e) +
    (src ? '<img class="logo-img" src="' + esc(src) + '"' +
           (e.logoUrl ? ' data-logo-url="' + esc(e.logoUrl) + '"' : '') +
           (e.domain  ? ' data-logo-domain="' + esc(e.domain) + '"' : '') +
           ' data-logo-try="0" alt="" loading="lazy" decoding="async">' : '');
  return '<span class="logo-slot' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + inner + '</span>';
}

const logoBox = e => '<span class="logo-box">' + logo(e) + '</span>';

/* 'error' does not bubble, so listen on the way down. Each failure advances to
   the next source; when the list is exhausted the <img> is dropped and the
   fallback painted behind it is simply uncovered — offline, that happens
   immediately and nothing renders as an empty box. */
function advanceLogo(img) {
  const cands = logoCandidates(img);
  const next = (+img.dataset.logoTry || 0) + 1;
  if (next < cands.length) {
    img.dataset.logoTry = String(next);
    img.src = cands[next];
  } else {
    img.remove();
  }
}

const isLogoImg = t => t && t.classList && t.classList.contains('logo-img');

document.addEventListener('error', e => {
  if (isLogoImg(e.target)) advanceLogo(e.target);
}, true);

/* A site that publishes only a 16px favicon still returns 200, so the request
   succeeds and we would upscale a 16px icon into a 34px slot — visibly mushy,
   and the one thing that reads as fake on an otherwise real logo wall. Treat
   anything under 32px as a miss and try the next source; once the sources run
   out the crisp initials tile is better than a blurred icon. */
document.addEventListener('load', e => {
  const img = e.target;
  if (!isLogoImg(img)) return;
  if (img.naturalWidth && img.naturalWidth < 32) advanceLogo(img);
}, true);

const STATUS = {
  meets:   { label:'Meets',          pill:'pill--green', ring:'result-ring--green', icon:'i-check-circle' },
  partial: { label:'Partial',        pill:'pill--amber', ring:'result-ring--amber', icon:'i-alert' },
  fails:   { label:'Does Not Meet',  pill:'pill--red',   ring:'result-ring--red',   icon:'i-x-circle' }
};
const DOC_STATUS = {
  done:     { label:'Completed',   pill:'pill--green', tone:'green'  },
  progress: { label:'In Progress', pill:'pill--amber', tone:'amber'  },
  todo:     { label:'Pending',     pill:'pill--gray',  tone:'gray'   }
};
const TONE_BG = {
  green:'background:var(--green-soft);color:var(--green-ink)',
  amber:'background:var(--amber-soft);color:var(--amber-ink)',
  red:'background:var(--red-soft);color:var(--red-ink)',
  blue:'background:var(--blue-soft);color:var(--primary-ink)',
  purple:'background:var(--purple-soft);color:#7C3AED',
  gray:'background:var(--surface-3);color:var(--muted)'
};

/* Toasts */
function toast(msg, tone) {
  const wrap = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = '<span style="color:var(--' + (tone === 'red' ? 'red' : tone === 'amber' ? 'amber' : 'green') + ')">' +
    icon(tone === 'red' ? 'i-x-circle' : tone === 'amber' ? 'i-alert' : 'i-check-circle') + '</span><span>' + esc(msg) + '</span>';
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('is-out');
    el.addEventListener('animationend', () => el.remove());
  }, 3200);
}

/* Modal */
let lastFocus = null;
function openModal(html, wide) {
  lastFocus = document.activeElement;
  $('#modalBody').innerHTML = html;
  $('#modal').classList.toggle('modal--wide', !!wide);
  $('#overlay').classList.add('is-open');
  document.body.style.overflow = 'hidden';
  // focus the dialog itself: focusing the close button would paint a focus ring on it
  $('#modal').focus();
}

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
function trapTab(e) {
  if (e.key !== 'Tab' || !$('#overlay').classList.contains('is-open')) return;
  const items = $$(FOCUSABLE, $('#modal')).filter(el => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === $('#modal'))) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
}
document.addEventListener('keydown', trapTab);
function closeModal() {
  $('#overlay').classList.remove('is-open');
  document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
$('#overlay').addEventListener('click', e => { if (e.target.id === 'overlay') closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeAllPops(); $('#sidebar').classList.remove('is-open'); $('#scrim').classList.remove('is-open'); }
});

/* requestAnimationFrame is paused while the document is hidden, so anything that
   only sets its final value inside a rAF would stay stuck at zero on a
   background-tab load. Apply directly in that case. */
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function nextPaint(fn) {
  if (document.hidden || reducedMotion()) { fn(); return; }
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

/* Animated counters */
function countUp(el, to, dur) {
  if (document.hidden || reducedMotion()) { el.textContent = String(to); return; }
  const start = performance.now();
  const from = 0;
  const step = now => {
    const t = Math.min((now - start) / (dur || 900), 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* --------------------------------------------------------------- 4. Theme */

function applyTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  $('#themeIcon').setAttribute('href', mode === 'dark' ? '#i-sun' : '#i-moon');
  $('#themeBtn').setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem(LS_THEME, mode); } catch (e) {}
}
(function initTheme() {
  let mode = null;
  try { mode = localStorage.getItem(LS_THEME); } catch (e) {}
  if (mode !== 'dark' && mode !== 'light') mode = 'light';
  applyTheme(mode);
})();
$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  toast(next === 'dark' ? 'Dark mode on' : 'Light mode on');
});

/* ------------------------------------------------- 5. Popovers & drawer */

function closeAllPops() {
  $$('.pop.is-open, .user-menu.is-open, .combo-list.is-open').forEach(p => p.classList.remove('is-open'));
  $('#userToggle').setAttribute('aria-expanded', 'false');
  $('#fUni').setAttribute('aria-expanded', 'false');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.pop, .user-menu, #bellBtn, #userToggle, #globalSearch, #comboField')) closeAllPops();
});

const sidebar = $('#sidebar'), scrim = $('#scrim');
function openDrawer(open) {
  sidebar.classList.toggle('is-open', open);
  scrim.classList.toggle('is-open', open);
}
$('#burger').addEventListener('click', () => openDrawer(!sidebar.classList.contains('is-open')));
scrim.addEventListener('click', () => openDrawer(false));

/* -------------------------------------------------- 6. Eligibility engine */

function criteria(u, p) {
  return [
    { label:'Grade Point Average', need:u.gpa,   have:p.gpa,   fmt:v => Number(v).toFixed(2) },
    { label:'English (IELTS)',     need:u.ielts, have:p.ielts, fmt:v => Number(v).toFixed(1) },
    { label:'SAT total score',     need:u.sat,   have:p.sat,   fmt:v => String(Math.round(v)) }
  ].map(c => {
    const ratio = c.have / c.need;
    c.state = ratio >= 1 ? 'ok' : ratio >= 0.96 ? 'mid' : 'bad';
    return c;
  });
}

function evaluate(u, p) {
  const rows = criteria(u, p);
  const bad = rows.filter(r => r.state === 'bad').length;
  const mid = rows.filter(r => r.state === 'mid').length;
  const status = bad >= 2 ? 'fails' : (bad === 1 || mid > 0) ? 'partial' : 'meets';
  return { rows, status };
}

function calcStrength(p) {
  const docs = S.docs.reduce((a, d) => a + (d.status === 'done' ? 1 : d.status === 'progress' ? 0.5 : 0), 0) / S.docs.length;
  const score =
      34 * Math.min(p.gpa / 4, 1)
    + 22 * Math.min(p.ielts / 8, 1)
    + 24 * Math.min(p.sat / 1600, 1)
    + 12 * docs
    +  8 * Math.min(p.recs / 3, 1);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function strengthNote(v) {
  if (v >= 85) return 'Great job! Your profile is strong.';
  if (v >= 70) return 'Solid profile — a few gaps left to close.';
  if (v >= 50) return 'Getting there. Add test scores and documents.';
  return 'Complete your profile to get accurate results.';
}

function checkTally() {
  return S.tally;
}

/* ------------------------------------------------ 7. Dashboard rendering */

const R = 60, C = 2 * Math.PI * R;

function renderDonut(animate) {
  const t = checkTally();
  const counts = [t.meets, t.partial, t.fails];
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const segs = $$('#donut .seg');
  const gap = 6;
  let offset = 0;
  segs.forEach((el, i) => {
    const len = (counts[i] / total) * C;
    // a zero-length arc still paints a dot through the round cap — hide it instead
    el.style.display = counts[i] === 0 ? 'none' : '';
    const vis = Math.max(len - gap, 1);
    const from = animate ? '0 ' + C : vis + ' ' + (C - vis);
    el.style.strokeDashoffset = String(-offset);
    el.style.strokeDasharray = from;
    if (animate) nextPaint(() => { el.style.strokeDasharray = vis + ' ' + (C - vis); });
    offset += len;
  });
  const centre = $('#donut .donut-center b');
  if (animate) countUp(centre, total); else centre.textContent = String(total);
  $$('.legend-row').forEach(row => {
    const key = row.dataset.filter;
    row.querySelector('b').textContent = String(t[key]);
  });
  $('#donut').setAttribute('aria-label',
    total + ' eligibility checks: ' + t.meets + ' meet requirements, ' + t.partial + ' partially meet, ' + t.fails + ' do not meet');
}

function renderStrength(animate) {
  const v = calcStrength(S.profile);
  const num = $('#strengthNum');
  if (animate) countUp(num, v, 1100); else num.textContent = String(v);
  nextPaint(() => { $('#strengthBar').style.width = v + '%'; });
  $('#strengthNote').textContent = strengthNote(v);
  return v;
}

function renderStats(animate) {
  const vals = { explored: S.explored, saved: S.saved.length, compare: S.compare.length };
  const map = [[$('.stats .stat-value'), vals.explored], [$('#statSaved'), vals.saved], [$('#statCompare'), vals.compare]];
  map.forEach(([el, v]) => { if (!el) return; if (animate) countUp(el, v); else el.textContent = String(v); });
}

function uniCardHTML(u) {
  const saved = S.saved.includes(u.id);
  return '<article class="uni-card" data-uni="' + u.id + '">' +
    '<button class="save-pin' + (saved ? ' is-saved' : '') + '" data-save="' + u.id + '" ' +
      'aria-label="' + (saved ? 'Remove from saved' : 'Save') + ' ' + esc(u.short) + '" ' +
      'aria-pressed="' + saved + '">' + icon('i-bookmark') + '</button>' +
    logo(u) +
    '<div class="uni-name">' + esc(u.name) + '</div>' +
    '<button class="btn btn--soft" data-explore="' + u.id + '">Explore</button>' +
  '</article>';
}

function renderPopular() {
  const scroller = $('#uniScroller');
  scroller.innerHTML = UNIS.map(uniCardHTML).join('');
  buildDots();
}

function buildDots() {
  const sc = $('#uniScroller'), dots = $('#uniDots');
  const pages = Math.max(1, Math.ceil(sc.scrollWidth / Math.max(sc.clientWidth, 1)));
  dots.innerHTML = Array.from({ length: pages }, (_, i) =>
    '<button aria-label="Go to page ' + (i + 1) + '"' + (i === 0 ? ' class="is-active"' : '') + '></button>').join('');
  dots.hidden = pages < 2;
  $$('button', dots).forEach((b, i) => b.addEventListener('click', () => {
    sc.scrollTo({ left: i * sc.clientWidth, behavior:'smooth' });
  }));
}

function syncDots() {
  const sc = $('#uniScroller');
  const idx = Math.round(sc.scrollLeft / Math.max(sc.clientWidth, 1));
  $$('#uniDots button').forEach((b, i) => b.classList.toggle('is-active', i === idx));
}
$('#uniScroller').addEventListener('scroll', syncDots, { passive:true });
window.addEventListener('resize', () => { buildDots(); syncDots(); });

function renderRecent() {
  $('#recentList').innerHTML = S.recent.map(r => {
    const u = uni(r.uni), st = STATUS[r.status];
    return '<button class="check-row" data-explore="' + u.id + '">' +
      logoBox(u) +
      '<span class="meta"><b>' + esc(u.short) + ' – ' + esc(r.program) + '</b><span>' + esc(r.when) + '</span></span>' +
      '<span class="pill ' + st.pill + '">' + st.label + '</span>' +
    '</button>';
  }).join('');
}

function roadmapRowHTML(s) {
  const cls = s.status === 'done' ? 'is-done' : s.status === 'active' ? 'is-active' : '';
  const pill = s.status === 'done' ? '<span class="pill pill--green">Completed</span>'
             : s.status === 'active' ? '<span class="pill pill--blue">In Progress</span>'
             : '<span class="pill pill--gray">Upcoming</span>';
  return '<div class="step ' + cls + '" data-step="' + s.id + '">' +
    '<span class="step-ic">' + (s.status === 'done' ? icon('i-check') : '<i style="width:7px;height:7px;border-radius:50%;background:currentColor;display:block"></i>') + '</span>' +
    '<button class="step-body" data-toggle-step="' + s.id + '">' +
      '<span><b>' + esc(s.title) + '</b><p>' + esc(s.note) + '</p></span>' + pill +
    '</button></div>';
}

function renderRoadmap() {
  const host = $('#roadmapList');
  if (host) host.innerHTML = S.roadmap.map(roadmapRowHTML).join('');
  const pct = Math.round(100 * S.roadmap.filter(s => s.status === 'done').length / S.roadmap.length);
  const bar = $('#roadBar'), lbl = $('#roadPct');
  if (bar) nextPaint(() => { bar.style.width = pct + '%'; });
  if (lbl) lbl.textContent = pct + '%';
}

function docRowHTML(d) {
  const st = DOC_STATUS[d.status];
  return '<button class="doc-row" data-toggle-doc="' + d.id + '">' +
    '<span class="doc-ic" style="' + TONE_BG[st.tone] + '">' + icon('i-file') + '</span>' +
    '<span class="meta"><b>' + esc(d.title) + '</b><span>' + esc(d.note) + '</span></span>' +
    '<span class="pill ' + st.pill + '">' + st.label + '</span>' +
  '</button>';
}

function renderDocs() {
  const host = $('#docList');
  if (host) host.innerHTML = S.docs.map(docRowHTML).join('');
  const pct = Math.round(100 * S.docs.reduce((a, d) => a + (d.status === 'done' ? 1 : d.status === 'progress' ? 0.5 : 0), 0) / S.docs.length);
  const bar = $('#docBar'), lbl = $('#docPct');
  if (bar) nextPaint(() => { bar.style.width = pct + '%'; });
  if (lbl) lbl.textContent = pct + '%';
}

function renderNotifications() {
  const unread = S.notifications.filter(n => !n.read).length;
  const badge = $('#notifCount');
  badge.textContent = String(unread);
  badge.style.display = unread ? '' : 'none';
  $('#notifList').innerHTML = S.notifications.map(n =>
    '<button class="notif-item" data-notif="' + n.id + '" style="' + (n.read ? 'opacity:.6' : '') + '">' +
      '<span class="notif-ic" style="' + TONE_BG[n.tone] + '">' + icon(n.icon) + '</span>' +
      '<span><p>' + esc(n.text) + '</p><time>' + esc(n.time) + '</time></span>' +
    '</button>').join('');
}

/* ----------------------------------------------------- 8. Saving / compare */

function toggleSave(id, silent) {
  const i = S.saved.indexOf(id);
  if (i >= 0) S.saved.splice(i, 1); else S.saved.push(id);
  save();
  $$('[data-save="' + id + '"]').forEach(btn => {
    const on = S.saved.includes(id);
    btn.classList.toggle('is-saved', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  renderStats(false);
  if (!silent) toast(S.saved.includes(id) ? esc(uni(id).short) + ' saved' : esc(uni(id).short) + ' removed from saved');
  return S.saved.includes(id);
}

function toggleCompare(id) {
  const i = S.compare.indexOf(id);
  if (i >= 0) { S.compare.splice(i, 1); toast(uni(id).short + ' removed from comparison'); }
  else if (S.compare.length >= 4) { toast('You can compare up to 4 universities', 'amber'); return; }
  else { S.compare.push(id); toast(uni(id).short + ' added to comparison'); }
  save();
  renderStats(false);
  if (currentView === 'comparisons' || currentView === 'universities') renderView(currentView);
}

/* ------------------------------------------------------------- 9. Modals */

function openUniModal(id) {
  const u = uni(id);
  const ev = evaluate(u, S.profile);
  const st = STATUS[ev.status];
  const saved = S.saved.includes(id);
  openModal(
    '<button class="modal-close" data-close aria-label="Close">' + icon('i-x') + '</button>' +
    '<div style="display:flex;gap:14px;align-items:flex-start;padding-right:36px">' +
      '<span class="logo-box logo-box--lg">' + logo(u) + '</span>' +
      '<div><h2 id="modalTitle">' + esc(u.name) + '</h2>' +
      '<p class="modal-sub" style="margin-top:4px">' + esc(u.city) + ' · ' + esc(u.country) + '</p></div>' +
    '</div>' +
    '<div class="tile-stats" style="margin-top:18px">' +
      '<div class="tile-stat"><span>QS Rank</span><b>' + rankLabel(u) + '</b></div>' +
      '<div class="tile-stat"><span>Acceptance</span><b>' + esc(u.accept) + '</b></div>' +
      '<div class="tile-stat"><span>Tuition / yr</span><b>' + esc(u.tuition) + '</b></div>' +
    '</div>' +
    '<h3 style="font-size:13px;font-weight:700;margin:20px 0 9px">Popular programs</h3>' +
    '<div style="display:flex;flex-wrap:wrap;gap:7px">' +
      u.programs.map(p => '<span class="pill pill--blue" style="height:26px">' + esc(p) + '</span>').join('') +
    '</div>' +
    '<h3 style="font-size:13px;font-weight:700;margin:20px 0 9px">Your standing <span class="pill ' + st.pill + '" style="margin-left:6px">' + st.label + '</span></h3>' +
    criteriaHTML(ev.rows) +
    '<div class="modal-actions">' +
      '<button class="btn btn--ghost" data-save="' + u.id + '" data-modal-save>' + icon('i-bookmark') + (saved ? 'Saved' : 'Save') + '</button>' +
      '<button class="btn btn--ghost" data-compare="' + u.id + '">' + icon('i-compare') + 'Compare</button>' +
      '<button class="btn btn--primary" data-check="' + u.id + '">Check eligibility</button>' +
    '</div>', true);
}

function criteriaHTML(rows) {
  return '<div class="criteria">' + rows.map(r => {
    const cls = r.state === 'ok' ? 'c-ok' : r.state === 'mid' ? 'c-mid' : 'c-bad';
    const ic  = r.state === 'ok' ? 'i-check-circle' : r.state === 'mid' ? 'i-alert' : 'i-x-circle';
    return '<div class="criteria-row"><span class="' + cls + '">' + icon(ic) + '</span>' +
      '<span class="meta"><b>' + esc(r.label) + '</b><span>Required ' + r.fmt(r.need) + ' · you have ' + r.fmt(r.have) + '</span></span>' +
      '<span class="pill ' + (r.state === 'ok' ? 'pill--green' : r.state === 'mid' ? 'pill--amber' : 'pill--red') + '">' +
        (r.state === 'ok' ? 'Met' : r.state === 'mid' ? 'Close' : 'Below') + '</span></div>';
  }).join('') + '</div>';
}

function openResultModal(u, program, ev) {
  const st = STATUS[ev.status];
  const headline = ev.status === 'meets' ? 'You meet the requirements'
                 : ev.status === 'partial' ? 'You partially meet the requirements'
                 : 'You do not meet the requirements yet';
  const advice = ev.status === 'meets'
      ? 'Your academic profile is at or above ' + u.short + "'s published minimums for " + program + '. Prepare your documents and apply early — the deadline window opens in November.'
      : ev.status === 'partial'
      ? 'You are close. One or more scores sit just under ' + u.short + "'s published minimums, which many admissions offices treat as competitive when the rest of the application is strong."
      : 'Two or more requirements are below ' + u.short + "'s published minimums. Retaking a test or adding a foundation year would meaningfully improve your chances.";

  openModal(
    '<button class="modal-close" data-close aria-label="Close">' + icon('i-x') + '</button>' +
    '<div class="result-hero">' +
      '<div class="result-ring ' + st.ring + '">' + icon(st.icon) + '</div>' +
      '<p class="pill ' + st.pill + '" style="margin-bottom:10px">Eligibility check completed</p>' +
      '<h2 id="modalTitle">' + esc(headline) + '</h2>' +
      '<p class="modal-sub">' + esc(u.name) + ' · ' + esc(program) + '</p>' +
    '</div>' +
    criteriaHTML(ev.rows) +
    '<p class="modal-sub" style="margin-top:16px">' + esc(advice) + '</p>' +
    '<div class="modal-actions">' +
      '<button class="btn btn--ghost" data-close>Close</button>' +
      '<button class="btn btn--primary" data-explore="' + u.id + '">View university</button>' +
    '</div>');
}

/* ------------------------------------------------------- 10. Global search */

function searchUnis(q) {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  const out = [];
  UNIS.forEach(u => {
    if (u.name.toLowerCase().includes(term) || u.short.toLowerCase().includes(term) || u.country.toLowerCase().includes(term)) {
      out.push({ u, sub: u.city + ' · ' + u.country });
    } else {
      const p = u.programs.find(pr => pr.toLowerCase().includes(term));
      if (p) out.push({ u, sub: p + ' · ' + u.short });
    }
  });
  return out.slice(0, 7);
}

const searchInput = $('#globalSearch'), searchPop = $('#searchPop');
searchInput.addEventListener('input', () => {
  const res = searchUnis(searchInput.value);
  const progs = searchPrograms(searchInput.value);
  if (!searchInput.value.trim()) { searchPop.classList.remove('is-open'); return; }
  const uniHTML = res.length
    ? '<div class="pop-head">Universities</div>' + res.map(r =>
        '<button class="pop-item" data-explore="' + r.u.id + '">' + logo(r.u, 'logo-sm') +
        '<span><b>' + esc(r.u.name) + '</b><span>' + esc(r.sub) + '</span></span></button>').join('')
    : '';
  const progHTML = progs.length
    ? '<div class="pop-head">Programs &amp; opportunities</div>' + progs.map(p => {
        const st = programStatus(p);
        return '<button class="pop-item" data-program="' + p.id + '">' + logo(p, 'logo-sm') +
          '<span><b>' + esc(p.name) + '</b><span>' + esc(st.label) + ' \u00b7 ' + esc(p.organizer) + '</span></span></button>';
      }).join('')
    : '';
  searchPop.innerHTML = (uniHTML + progHTML) ||
    '<div class="pop-empty">No matches for “' + esc(searchInput.value) + '”</div>';
  searchPop.classList.add('is-open');
});
searchInput.addEventListener('focus', () => { if (searchInput.value.trim()) searchInput.dispatchEvent(new Event('input')); });
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const q = searchInput.value.trim();
    searchPop.classList.remove('is-open');
    if (!q) return;
    if (!searchUnis(q).length && searchPrograms(q).length) { pageState.progQuery = q; go('programs'); }
    else { pageState.uniQuery = q; go('universities'); }
  }
});

/* ------------------------------------------- 11. Check-eligibility form */

const fCountry = $('#fCountry'), fCurriculum = $('#fCurriculum'), fUni = $('#fUni'), comboList = $('#comboList');
let comboSelection = null;

function fillCurricula() {
  const list = CURRICULA[fCountry.value] || [];
  fCurriculum.innerHTML = list.map(c => '<option>' + esc(c) + '</option>').join('');
  if (list.includes(S.profile.curriculum)) fCurriculum.value = S.profile.curriculum;
}
fCountry.addEventListener('change', () => {
  fillCurricula();
  S.profile.country = fCountry.value;
  S.profile.curriculum = fCurriculum.value;
  save();
  toast('Country set to ' + COUNTRY_NAMES[fCountry.value]);
});
fCurriculum.addEventListener('change', () => { S.profile.curriculum = fCurriculum.value; save(); });

function renderCombo(term) {
  const t = (term || '').trim().toLowerCase();
  const list = UNIS.filter(u => !t || u.name.toLowerCase().includes(t) || u.short.toLowerCase().includes(t) || u.country.toLowerCase().includes(t));
  comboList.innerHTML = list.length
    ? list.map(u => '<button type="button" class="pop-item" data-pick="' + u.id + '" role="option">' + logo(u, 'logo-sm') +
        '<span><b>' + esc(u.short) + '</b><span>' + esc(u.country) + '</span></span></button>').join('')
    : '<div class="pop-empty">No university found</div>';
  comboList.classList.add('is-open');
  fUni.setAttribute('aria-expanded', 'true');
}
fUni.addEventListener('input', () => { comboSelection = null; renderCombo(fUni.value); });
fUni.addEventListener('focus', () => renderCombo(fUni.value));
comboList.addEventListener('click', e => {
  const btn = e.target.closest('[data-pick]');
  if (!btn) return;
  comboSelection = btn.dataset.pick;
  fUni.value = uni(comboSelection).name;
  comboList.classList.remove('is-open');
  fUni.setAttribute('aria-expanded', 'false');
});

$('#eligForm').addEventListener('submit', e => {
  e.preventDefault();
  let id = comboSelection;
  if (!id) {
    const matches = searchUnis(fUni.value);
    id = matches.length ? matches[0].u.id : null;
  }
  if (!id) {
    fUni.focus();
    fUni.style.borderColor = 'var(--red)';
    setTimeout(() => { fUni.style.borderColor = ''; }, 1600);
    toast('Pick a university to check', 'amber');
    return;
  }
  const u = uni(id);
  const program = u.programs[0];
  const ev = evaluate(u, S.profile);

  const existing = S.recent.findIndex(r => r.uni === id);
  if (existing >= 0) {
    S.tally[S.recent[existing].status] = Math.max(0, S.tally[S.recent[existing].status] - 1);
    S.recent.splice(existing, 1);
  }
  S.tally[ev.status]++;
  S.recent.unshift({ uni:id, program, when:'Just now', status:ev.status });
  S.recent = S.recent.slice(0, 5);
  if (!S.compare.includes(id) && S.compare.length < 4) S.compare.push(id);
  save();

  renderRecent(); renderDonut(true); renderStats(false);

  const st = STATUS[ev.status];
  const box = $('#inlineResult');
  box.innerHTML = '<div style="display:flex;align-items:center;gap:10px">' +
    '<span class="pill ' + st.pill + '">' + st.label + '</span>' +
    '<b style="font-size:12.5px">' + esc(u.short) + ' · ' + esc(program) + '</b></div>' +
    '<p style="font-size:11.5px;color:var(--muted);margin-top:7px">Eligibility check completed — added to your recent checks.</p>';
  box.classList.add('is-open');

  openResultModal(u, program, ev);
});

/* --------------------------------------------------------- 12. Views */

let currentView = 'dashboard';
const pageState = { uniQuery:'', uniRegion:'all', progQuery:'', progStatus:'all', progCat:'all' };

function pageHead(title, sub) {
  return '<div class="page-head"><h1>' + esc(title) + '</h1><p>' + esc(sub) + '</p></div>';
}

function viewUniversities() {
  const q = pageState.uniQuery.trim().toLowerCase();
  const regions = [['all','All regions'],['americas','Americas'],['europe','Europe'],['asia','Asia'],
                   ['mena','Middle East'],['oceania','Oceania']];
  const list = UNIS.filter(u => {
    const okRegion = pageState.uniRegion === 'all' || u.region === pageState.uniRegion;
    const okQuery = !q || u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q) ||
                    u.programs.some(p => p.toLowerCase().includes(q));
    return okRegion && okQuery;
  });

  return pageHead('Universities', 'Browse and filter ' + UNIS.length + ' partner universities worldwide.') +
    '<div class="toolbar">' +
      '<div class="search-wrap" style="width:300px">' + icon('i-search') +
        '<input class="search-input" id="uniSearch" type="search" placeholder="Search universities or programs..." value="' + esc(pageState.uniQuery) + '">' +
      '</div>' +
      regions.map(([k, l]) => '<button class="chip' + (pageState.uniRegion === k ? ' is-active' : '') + '" data-region="' + k + '">' + l + '</button>').join('') +
    '</div>' +
    (list.length ? '<div class="cards-grid">' + list.map(uniTileHTML).join('') + '</div>' : emptyHTML('No universities match', 'Try a different search term or region filter.'));
}

function uniTileHTML(u) {
  const saved = S.saved.includes(u.id);
  const inCmp = S.compare.includes(u.id);
  const ev = evaluate(u, S.profile);
  const st = STATUS[ev.status];
  return '<article class="card uni-tile">' +
    '<div class="uni-tile-top">' + logoBox(u) +
      '<div style="flex:1;min-width:0"><h3>' + esc(u.name) + '</h3><p class="loc">' + esc(u.city) + ' · ' + esc(u.country) + '</p></div>' +
      '<span class="pill ' + st.pill + '">' + st.label + '</span>' +
    '</div>' +
    '<div class="tile-stats">' +
      '<div class="tile-stat"><span>QS Rank</span><b>' + rankLabel(u) + '</b></div>' +
      '<div class="tile-stat"><span>Accept</span><b>' + esc(u.accept) + '</b></div>' +
      '<div class="tile-stat"><span>Min GPA</span><b>' + u.gpa.toFixed(2) + '</b></div>' +
    '</div>' +
    '<div class="tile-actions">' +
      '<button class="btn btn--soft" data-explore="' + u.id + '">Explore</button>' +
      '<button class="btn btn--ghost btn--icon" data-save="' + u.id + '" aria-pressed="' + saved + '" aria-label="Save" ' +
        'style="' + (saved ? 'color:var(--primary-ink);border-color:var(--primary)' : '') + '">' + icon('i-bookmark') + '</button>' +
      '<button class="btn btn--ghost btn--icon" data-compare="' + u.id + '" aria-label="Compare" ' +
        'style="' + (inCmp ? 'color:var(--primary-ink);border-color:var(--primary)' : '') + '">' + icon('i-compare') + '</button>' +
    '</div></article>';
}

function emptyHTML(title, text) {
  return '<div class="card empty">' + icon('i-search', '') + '<b>' + esc(title) + '</b><p>' + esc(text) + '</p></div>';
}

function viewSaved() {
  const list = S.saved.map(uni).filter(Boolean);
  return pageHead('Saved Universities', 'Universities you bookmarked while exploring.') +
    (list.length ? '<div class="cards-grid">' + list.map(uniTileHTML).join('') + '</div>'
                 : emptyHTML('Nothing saved yet', 'Tap the bookmark icon on any university to keep it here.'));
}

function viewComparisons() {
  const list = S.compare.map(uni).filter(Boolean);
  if (!list.length) return pageHead('Comparisons', 'Compare requirements side by side.') +
    emptyHTML('No comparisons yet', 'Add up to 4 universities from the Universities page.');

  const rows = [
    ['Country',        u => u.country],
    ['City',           u => u.city],
    ['QS World Rank',  u => rankLabel(u)],
    ['Acceptance rate',u => u.accept],
    ['Tuition / year', u => u.tuition],
    ['Minimum GPA',    u => u.gpa.toFixed(2)],
    ['Minimum IELTS',  u => u.ielts.toFixed(1)],
    ['Typical SAT',    u => String(u.sat)]
  ];

  return pageHead('Comparisons', 'Comparing ' + list.length + ' of your shortlisted universities.') +
    '<div class="card"><div class="table-wrap"><table class="cmp">' +
      '<thead><tr><th style="width:180px">Criteria</th>' + list.map(u =>
        '<th><span class="cmp-head">' + logoBox(u) + '<b>' + esc(u.short) + '</b></span></th>').join('') + '</tr></thead>' +
      '<tbody>' + rows.map(([label, fn]) =>
        '<tr><th>' + label + '</th>' + list.map(u => '<td>' + esc(fn(u)) + '</td>').join('') + '</tr>').join('') +
      '<tr><th>Your eligibility</th>' + list.map(u => {
        const st = STATUS[evaluate(u, S.profile).status];
        return '<td><span class="pill ' + st.pill + '">' + st.label + '</span></td>';
      }).join('') + '</tr>' +
      '<tr><th></th>' + list.map(u =>
        '<td><button class="btn btn--ghost" style="height:32px;font-size:12px" data-compare="' + u.id + '">' +
        icon('i-trash') + 'Remove</button></td>').join('') + '</tr>' +
      '</tbody></table></div></div>';
}

function viewDocuments() {
  const pct = Math.round(100 * S.docs.reduce((a, d) => a + (d.status === 'done' ? 1 : d.status === 'progress' ? 0.5 : 0), 0) / S.docs.length);
  return pageHead('Documents', 'Track every document your applications need. Click a row to change its status.') +
    '<div class="card" style="max-width:760px">' +
      '<div class="card-head"><div><h2 class="card-title">Document Checklist</h2>' +
      '<p class="card-sub">' + S.docs.filter(d => d.status === 'done').length + ' of ' + S.docs.length + ' documents completed</p></div>' +
      '<span class="pill pill--blue">' + pct + '% ready</span></div>' +
      '<div class="doc-list">' + S.docs.map(docRowHTML).join('') + '</div>' +
      '<div class="doc-progress"><div class="bar"><i style="width:' + pct + '%"></i></div><b>' + pct + '%</b></div>' +
    '</div>';
}

function viewRoadmap() {
  const done = S.roadmap.filter(s => s.status === 'done').length;
  return pageHead('Application Roadmap', 'Your personalized plan for the ' + esc(S.profile.intake) + ' intake.') +
    '<div class="card" style="max-width:760px">' +
      '<div class="card-head"><div><h2 class="card-title">Milestones</h2>' +
      '<p class="card-sub">' + done + ' of ' + S.roadmap.length + ' steps completed — click a step to mark it done</p></div></div>' +
      '<div class="steps">' + S.roadmap.map(roadmapRowHTML).join('') + '</div>' +
    '</div>';
}

function viewResources() {
  return pageHead('Resources', 'Guides written by admissions counsellors, updated for the 2026 cycle.') +
    '<div class="cards-grid">' + RESOURCES.map((r, i) =>
      '<button class="card res-card" data-resource="' + i + '">' +
        '<span class="res-ic" style="' + TONE_BG[r.tone] + '">' + icon(r.icon) + '</span>' +
        '<h3>' + esc(r.title) + '</h3><p>' + esc(r.text) + '</p>' +
        '<span class="link-more">Read guide ' + icon('i-arrow-right') + '</span>' +
      '</button>').join('') + '</div>';
}

function viewProfile() {
  const p = S.profile;
  const v = calcStrength(p);
  const opts = (list, sel) => list.map(o => '<option' + (o === sel ? ' selected' : '') + '>' + esc(o) + '</option>').join('');
  return pageHead('Profile', 'Your academic profile drives every eligibility result. Keep it accurate.') +
    '<div class="grid" style="grid-template-columns:minmax(0,1fr) 336px">' +
      '<div class="col"><section class="card">' +
        '<div class="card-head"><div><h2 class="card-title">Academic details</h2>' +
        '<p class="card-sub">Changes apply instantly across your dashboard</p></div></div>' +
        '<div class="form-grid">' +
          field('First name', '<input class="control" id="pFirst" type="text" value="' + esc(p.first) + '">') +
          field('Last name',  '<input class="control" id="pLast" type="text" value="' + esc(p.last) + '">') +
          field('Country of education',
            '<select class="control" id="pCountry">' + Object.keys(COUNTRY_NAMES).map(k =>
              '<option value="' + k + '"' + (k === p.country ? ' selected' : '') + '>' + esc(COUNTRY_NAMES[k]) + '</option>').join('') + '</select>', 'i-chevron-down') +
          field('Curriculum', '<select class="control" id="pCurriculum">' + opts(CURRICULA[p.country] || [], p.curriculum) + '</select>', 'i-chevron-down') +
          field('GPA (out of 4.0)', '<input class="control" id="pGpa" type="number" step="0.01" min="0" max="4" value="' + p.gpa + '">') +
          field('IELTS overall band', '<input class="control" id="pIelts" type="number" step="0.5" min="0" max="9" value="' + p.ielts + '">') +
          field('SAT total score', '<input class="control" id="pSat" type="number" step="10" min="400" max="1600" value="' + p.sat + '">') +
          field('Recommendation letters', '<input class="control" id="pRecs" type="number" step="1" min="0" max="3" value="' + p.recs + '">') +
        '</div>' +
        '<button class="btn btn--primary" id="saveProfile" style="margin-top:8px">' + icon('i-check') + 'Save changes</button>' +
      '</section></div>' +
      '<div class="col"><section class="card">' +
        '<div class="card-head" style="margin-bottom:14px"><div><h2 class="card-title">Profile Strength</h2>' +
        '<p class="card-sub">How competitive your profile looks</p></div></div>' +
        '<div class="strength" style="background:transparent;border:0;padding:0">' +
          '<div class="strength-num" id="pStrengthNum">' + v + '%</div>' +
          '<div class="bar"><i style="width:' + v + '%" id="pStrengthBar"></i></div>' +
          '<p class="strength-note" id="pStrengthNote">' + esc(strengthNote(v)) + '</p>' +
        '</div>' +
        '<div class="criteria" style="margin-top:18px">' +
          miniStat('GPA', p.gpa.toFixed(2) + ' / 4.00') +
          miniStat('IELTS', p.ielts.toFixed(1) + ' / 9.0') +
          miniStat('SAT', p.sat + ' / 1600') +
          miniStat('Target intake', p.intake) +
        '</div>' +
      '</section></div>' +
    '</div>';
}

function field(label, control, ic) {
  return '<div class="field"><label>' + esc(label) + '</label>' + control +
    (ic ? '<svg class="ico field-ic"><use href="#' + ic + '"/></svg>' : '') + '</div>';
}
function miniStat(label, value) {
  return '<div class="criteria-row"><span class="meta"><b>' + esc(label) + '</b></span><b style="font-size:12.5px">' + esc(value) + '</b></div>';
}

/* ---------------------------------------------- 12b. Programs & opportunities */

const PROG_CATS = {
  summer:          { label:'Summer program', tone:'blue',   icon:'i-cap'     },
  research:        { label:'Research',       tone:'purple', icon:'i-sparkle' },
  competition:     { label:'Competition',    tone:'amber',  icon:'i-target'  },
  olympiad:        { label:'Olympiad',       tone:'green',  icon:'i-chart'   },
  internship:      { label:'Internship',     tone:'blue',   icon:'i-bank'    },
  'essay-contest': { label:'Essay contest',  tone:'red',    icon:'i-file'    }
};
const REQ_TYPES = {
  essay:            { label:'Essay',        icon:'i-file'   },
  transcript:       { label:'Transcript',   icon:'i-file'   },
  'parent-consent': { label:'Consent',      icon:'i-user'   },
  recs:             { label:'References',   icon:'i-mail'   },
  cv:               { label:'CV',           icon:'i-file'   },
  portfolio:        { label:'Portfolio',    icon:'i-book'   },
  'language-cert':  { label:'Certificate',  icon:'i-globe'  },
  fee:              { label:'Fee',          icon:'i-wallet' }
};
const FORMATS = { online:'Online', offline:'On campus', hybrid:'Hybrid' };
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const program = id => PROGRAMS.find(p => p.id === id);

function fmtDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}
/* whole days from today until the end of the deadline day */
function daysUntil(iso) {
  const end = new Date(iso + 'T23:59:59');
  return Math.ceil((end - new Date()) / 86400000);
}
function programStatus(p) {
  const days = daysUntil(p.deadline);
  if (days < 0) return { key:'closed', label:'Closed', pill:'pill--gray',
                         note:'Deadline passed ' + fmtDate(p.deadline), days };
  return { key:'open', label:'Open', pill:'pill--green', days,
           note: days === 0 ? 'Closes today' : days === 1 ? 'Closes tomorrow' : 'Closes in ' + days + ' days' };
}

const progMap  = p => S.programProgress[p.id] || {};
const progDone = p => p.requirements.filter(r => progMap(p)[r.id]).length;
const progPct  = p => Math.round(100 * progDone(p) / p.requirements.length);

function searchPrograms(q) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return PROGRAMS.filter(p =>
    p.name.toLowerCase().includes(t) ||
    p.organizer.toLowerCase().includes(t) ||
    PROG_CATS[p.category].label.toLowerCase().includes(t) ||
    p.portfolioImpact.category.toLowerCase().includes(t)
  ).slice(0, 4);
}

function viewPrograms() {
  const q = pageState.progQuery.trim().toLowerCase();
  const list = PROGRAMS.filter(p => {
    const st = programStatus(p);
    const okStatus = pageState.progStatus === 'all' || pageState.progStatus === st.key;
    const okCat = pageState.progCat === 'all' || pageState.progCat === p.category;
    const okQuery = !q || p.name.toLowerCase().includes(q) || p.organizer.toLowerCase().includes(q) ||
                    p.portfolioImpact.category.toLowerCase().includes(q);
    return okStatus && okCat && okQuery;
  });
  const openNow = PROGRAMS.filter(p => programStatus(p).key === 'open').length;
  const statuses = [['all','All'],['open','Open now'],['closed','Deadline passed']];
  const cats = [['all','All types']].concat(
    Object.keys(PROG_CATS).filter(k => PROGRAMS.some(p => p.category === k)).map(k => [k, PROG_CATS[k].label]));

  return pageHead('Programs & Opportunities',
      'Summer schools, olympiads, competitions and internships that strengthen your application — ' +
      openNow + ' of ' + PROGRAMS.length + ' are still open.') +
    '<div class="toolbar">' +
      '<div class="search-wrap" style="width:300px">' + icon('i-search') +
        '<input class="search-input" id="progSearch" type="search" placeholder="Search programs or organizers..." value="' + esc(pageState.progQuery) + '">' +
      '</div>' +
      statuses.map(([k, l]) => '<button class="chip' + (pageState.progStatus === k ? ' is-active' : '') +
        '" data-pstatus="' + k + '">' + l + '</button>').join('') +
    '</div>' +
    '<div class="toolbar">' +
      cats.map(([k, l]) => '<button class="chip' + (pageState.progCat === k ? ' is-active' : '') +
        '" data-pcat="' + k + '">' + esc(l) + '</button>').join('') +
    '</div>' +
    (list.length ? '<div class="cards-grid">' + list.map(progCardHTML).join('') + '</div>'
                 : emptyHTML('No programs match', 'Try another filter — or clear the search to see all ' + PROGRAMS.length + '.'));
}

function progCardHTML(p) {
  const st = programStatus(p);
  const cat = PROG_CATS[p.category];
  const done = progDone(p), pct = progPct(p);
  return '<button class="card prog-card" data-program="' + p.id + '">' +
    '<div class="prog-top">' + logoBox(p) +
      '<span class="pill ' + st.pill + '">' + st.label + '</span>' +
    '</div>' +
    '<h3>' + esc(p.name) + '</h3>' +
    '<p class="prog-org">' + esc(p.organizer) + '</p>' +
    '<div class="prog-meta">' +
      '<span>' + icon('i-clock') + fmtDate(p.deadline) + '</span>' +
      '<span>' + icon('i-globe') + esc(FORMATS[p.format]) + '</span>' +
      '<span>' + icon('i-cap') + esc(cat.label) + '</span>' +
    '</div>' +
    '<div class="prog-impact">' + icon('i-sparkle') +
      '<span>Portfolio: <b>' + esc(p.portfolioImpact.category) + '</b></span></div>' +
    '<div class="prog-foot"><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<b>' + done + '/' + p.requirements.length + '</b></div>' +
  '</button>';
}

function reqRowHTML(p, r) {
  const on = !!progMap(p)[r.id];
  const type = REQ_TYPES[r.type];
  return '<button class="req-row' + (on ? ' is-done' : '') + '" data-req="' + r.id + '" data-prog="' + p.id + '" ' +
      'aria-pressed="' + on + '">' +
    '<span class="req-check">' + (on ? icon('i-check') : icon(type.icon)) + '</span>' +
    '<span class="meta"><b>' + esc(r.label) + '</b><span>' + esc(r.note) + '</span></span>' +
    '<span class="pill ' + (on ? 'pill--green' : 'pill--gray') + '">' + esc(type.label) + '</span>' +
  '</button>';
}

function programModalHTML(p) {
  const st = programStatus(p);
  const cat = PROG_CATS[p.category];
  const pi = p.portfolioImpact;
  const done = progDone(p), pct = progPct(p);
  return '<button class="modal-close" data-close aria-label="Close">' + icon('i-x') + '</button>' +
    '<div style="display:flex;gap:14px;align-items:flex-start;padding-right:36px">' +
      '<span class="logo-box logo-box--lg">' + logo(p) + '</span>' +
      '<div><h2 id="modalTitle">' + esc(p.name) + '</h2>' +
      '<p class="modal-sub" style="margin-top:4px">' + esc(p.organizer) + '</p></div>' +
    '</div>' +
    '<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:14px">' +
      '<span class="pill ' + st.pill + '">' + st.label + ' · ' + esc(st.note) + '</span>' +
      '<span class="pill pill--blue">' + esc(cat.label) + '</span>' +
    '</div>' +
    '<div class="tile-stats" style="margin-top:16px">' +
      '<div class="tile-stat"><span>Deadline</span><b>' + fmtDate(p.deadline) + '</b></div>' +
      '<div class="tile-stat"><span>Format</span><b>' + esc(FORMATS[p.format]) + '</b></div>' +
      '<div class="tile-stat"><span>Cost</span><b>' + esc(p.cost) + '</b></div>' +
    '</div>' +
    '<h3 style="font-size:13px;font-weight:700;margin:20px 0 7px">Who can apply</h3>' +
    '<p class="modal-sub">' + esc(p.eligibility) + '</p>' +
    '<div class="prog-portfolio">' +
      '<h3>' + icon('i-sparkle') + 'How this looks in your portfolio</h3>' +
      '<div class="pp-row"><span>Activity category</span><span class="pill pill--blue">' + esc(pi.category) + '</span></div>' +
      '<p class="pp-line">' + esc(pi.resumeLine) + '</p>' +
      '<p class="pp-signal">' + esc(pi.signal) + '</p>' +
    '</div>' +
    '<h3 style="font-size:13px;font-weight:700;margin:20px 0 9px">What you need to submit ' +
      '<span class="pill ' + (done === p.requirements.length ? 'pill--green' : 'pill--gray') + '" style="margin-left:6px">' +
      done + ' of ' + p.requirements.length + ' ready</span></h3>' +
    '<div class="doc-list">' + p.requirements.map(r => reqRowHTML(p, r)).join('') + '</div>' +
    '<div class="doc-progress"><div class="bar"><i style="width:' + pct + '%"></i></div><b>' + pct + '%</b></div>' +
    '<div class="modal-actions">' +
      '<button class="btn btn--ghost" data-close>Close</button>' +
      '<a class="btn btn--primary" href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer">' +
        icon('i-external') + 'Open application page</a>' +
    '</div>';
}

function openProgramModal(id) {
  const p = program(id);
  if (p) openModal(programModalHTML(p), true);
}

function wireProgSearch() {
  const inp = $('#progSearch');
  if (!inp) return;
  inp.addEventListener('input', () => {
    pageState.progQuery = inp.value;
    const pos = inp.selectionStart;
    renderView('programs');
    const next = $('#progSearch');
    next.focus(); next.setSelectionRange(pos, pos);
  });
}

const VIEWS = {
  universities: viewUniversities, saved: viewSaved, comparisons: viewComparisons,
  programs: viewPrograms, documents: viewDocuments, roadmap: viewRoadmap,
  resources: viewResources, profile: viewProfile
};

function renderView(name) {
  const page = $('#view-page');
  page.innerHTML = VIEWS[name] ? VIEWS[name]() : '';
  if (name === 'profile') wireProfile();
  if (name === 'universities') wireUniSearch();
  if (name === 'programs') wireProgSearch();
}

function go(name) {
  currentView = name;
  $$('.nav-item').forEach(b => b.classList.toggle('is-active', b.dataset.nav === name));
  const dash = $('#view-dashboard'), page = $('#view-page');
  if (name === 'dashboard') {
    page.classList.remove('is-active'); page.innerHTML = '';
    dash.classList.add('is-active');
  } else {
    dash.classList.remove('is-active');
    renderView(name);
    page.classList.add('is-active');
  }
  window.scrollTo({ top:0, behavior:'smooth' });
  openDrawer(false);
  history.replaceState(null, '', '#' + name);
}

function wireUniSearch() {
  const inp = $('#uniSearch');
  if (!inp) return;
  inp.addEventListener('input', () => {
    pageState.uniQuery = inp.value;
    const pos = inp.selectionStart;
    renderView('universities');
    const next = $('#uniSearch');
    next.focus(); next.setSelectionRange(pos, pos);
  });
}

function wireProfile() {
  const read = () => ({
    first: $('#pFirst').value.trim() || 'Aigerim',
    last:  $('#pLast').value.trim()  || 'S.',
    country: $('#pCountry').value,
    curriculum: $('#pCurriculum').value,
    gpa:  clamp(parseFloat($('#pGpa').value)   || 0, 0, 4),
    ielts:clamp(parseFloat($('#pIelts').value) || 0, 0, 9),
    sat:  clamp(parseInt($('#pSat').value, 10)  || 0, 0, 1600),
    recs: clamp(parseInt($('#pRecs').value, 10) || 0, 0, 3),
    intake: S.profile.intake
  });
  const live = () => {
    const p = read();
    const v = calcStrength(p);
    $('#pStrengthNum').textContent = v + '%';
    $('#pStrengthBar').style.width = v + '%';
    $('#pStrengthNote').textContent = strengthNote(v);
  };
  $$('#view-page .control').forEach(el => el.addEventListener('input', live));
  $('#pCountry').addEventListener('change', () => {
    const list = CURRICULA[$('#pCountry').value] || [];
    $('#pCurriculum').innerHTML = list.map(c => '<option>' + esc(c) + '</option>').join('');
    live();
  });
  $('#saveProfile').addEventListener('click', () => {
    S.profile = read();
    save();
    fCountry.value = S.profile.country; fillCurricula();
    renderStrength(false); renderStats(false); renderDonut(false);
    updateUserBlock();
    renderView('profile');
    toast('Profile updated');
  });
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function updateUserBlock() {
  const p = S.profile;
  const initials = (p.first[0] || 'A') + (p.last[0] || 'S');
  $('.user-name').textContent = p.first + ' ' + (p.last[0] || 'S') + '.';
  $('.user-loc').firstChild.textContent = COUNTRY_NAMES[p.country] + ' ';
  $('.avatar').textContent = initials.toUpperCase();
  $('#topAvatar').textContent = initials.toUpperCase();
  const h1 = $('.welcome h1');
  if (h1) h1.innerHTML = 'Good morning, ' + esc(p.first) + '! <span class="wave">👋</span>';
}

/* --------------------------------------------------- 13. Event delegation */

document.addEventListener('click', e => {
  const t = e.target;

  const nav = t.closest('[data-nav]');
  if (nav) { e.preventDefault(); closeAllPops(); go(nav.dataset.nav); return; }

  if (t.closest('[data-close]')) { closeModal(); return; }

  const explore = t.closest('[data-explore]');
  if (explore) { closeAllPops(); closeModal(); setTimeout(() => openUniModal(explore.dataset.explore), 120); return; }

  const saveBtn = t.closest('[data-save]');
  if (saveBtn) {
    e.stopPropagation();
    const on = toggleSave(saveBtn.dataset.save);
    if (saveBtn.hasAttribute('data-modal-save')) saveBtn.lastChild.textContent = on ? 'Saved' : 'Save';
    if (currentView === 'saved' || currentView === 'universities') renderView(currentView);
    return;
  }

  const cmp = t.closest('[data-compare]');
  if (cmp) { toggleCompare(cmp.dataset.compare); return; }

  const chk = t.closest('[data-check]');
  if (chk) {
    const u = uni(chk.dataset.check);
    closeModal();
    setTimeout(() => openResultModal(u, u.programs[0], evaluate(u, S.profile)), 140);
    return;
  }

  const region = t.closest('[data-region]');
  if (region) { pageState.uniRegion = region.dataset.region; renderView('universities'); return; }

  const step = t.closest('[data-toggle-step]');
  if (step) {
    const s = S.roadmap.find(x => x.id === step.dataset.toggleStep);
    s.status = s.status === 'done' ? 'active' : 'done';
    const firstTodo = S.roadmap.find(x => x.status !== 'done');
    S.roadmap.forEach(x => { if (x.status !== 'done') x.status = (x === firstTodo) ? 'active' : 'todo'; });
    save(); renderRoadmap();
    if (currentView === 'roadmap') renderView('roadmap');
    toast(s.title + (s.status === 'done' ? ' marked complete' : ' reopened'));
    return;
  }

  const doc = t.closest('[data-toggle-doc]');
  if (doc) {
    const d = S.docs.find(x => x.id === doc.dataset.toggleDoc);
    d.status = d.status === 'todo' ? 'progress' : d.status === 'progress' ? 'done' : 'todo';
    save(); renderDocs(); renderStrength(false);
    if (currentView === 'documents') renderView('documents');
    toast(d.title + ' → ' + DOC_STATUS[d.status].label);
    return;
  }

  const prog = t.closest('[data-program]');
  if (prog) { closeAllPops(); openProgramModal(prog.dataset.program); return; }

  const req = t.closest('[data-req]');
  if (req) {
    const p = program(req.dataset.prog);
    const map = S.programProgress[p.id] || (S.programProgress[p.id] = {});
    map[req.dataset.req] = !map[req.dataset.req];
    save();
    // rewrite the body in place: re-opening the modal would capture the focus
    // of the row we just replaced and break focus restore on close
    $('#modalBody').innerHTML = programModalHTML(p);
    if (currentView === 'programs') renderView('programs');
    const r = p.requirements.find(x => x.id === req.dataset.req);
    toast(r.label + (map[req.dataset.req] ? ' marked ready' : ' unchecked'));
    return;
  }

  const pstatus = t.closest('[data-pstatus]');
  if (pstatus) { pageState.progStatus = pstatus.dataset.pstatus; renderView('programs'); return; }

  const pcat = t.closest('[data-pcat]');
  if (pcat) { pageState.progCat = pcat.dataset.pcat; renderView('programs'); return; }

  const res = t.closest('[data-resource]');
  if (res) {
    const r = RESOURCES[+res.dataset.resource];
    openModal('<button class="modal-close" data-close aria-label="Close">' + icon('i-x') + '</button>' +
      '<span class="res-ic" style="' + TONE_BG[r.tone] + '">' + icon(r.icon) + '</span>' +
      '<h2 id="modalTitle" style="margin-top:14px">' + esc(r.title) + '</h2>' +
      '<p class="modal-sub">' + esc(r.text) + '</p>' +
      '<p class="modal-sub" style="margin-top:14px">' + esc(r.body) + '</p>' +
      '<div class="modal-actions"><button class="btn btn--primary" data-close>Got it</button></div>');
    return;
  }

  const legend = t.closest('[data-filter]');
  if (legend) {
    const key = legend.dataset.filter;
    const n = S.tally[key];
    toast(n ? n + ' check' + (n > 1 ? 's' : '') + ' — ' + STATUS[key].label : 'No checks with this status', n ? 'green' : 'amber');
    return;
  }

  const notif = t.closest('[data-notif]');
  if (notif) {
    const n = S.notifications.find(x => x.id === notif.dataset.notif);
    n.read = true; save(); renderNotifications();
    return;
  }
});

$('#bellBtn').addEventListener('click', e => {
  e.stopPropagation();
  const pop = $('#notifPop'), was = pop.classList.contains('is-open');
  closeAllPops();
  pop.classList.toggle('is-open', !was);
});
$('#markRead').addEventListener('click', e => {
  e.stopPropagation();
  S.notifications.forEach(n => { n.read = true; });
  save(); renderNotifications(); toast('All notifications marked read');
});
$('#userToggle').addEventListener('click', e => {
  e.stopPropagation();
  const menu = $('#userMenu'), was = menu.classList.contains('is-open');
  closeAllPops();
  menu.classList.toggle('is-open', !was);
  $('#userToggle').setAttribute('aria-expanded', String(!was));
});
$('#menuSettings').addEventListener('click', () => { closeAllPops(); go('profile'); });
$('#topAvatar').addEventListener('click', () => go('profile'));
$('#logoutBtn').addEventListener('click', () => {
  openModal('<button class="modal-close" data-close aria-label="Close">' + icon('i-x') + '</button>' +
    '<h2 id="modalTitle">Log out of EntryMap?</h2>' +
    '<p class="modal-sub">Your saved universities and checks stay on this device.</p>' +
    '<div class="modal-actions"><button class="btn btn--ghost" data-close>Stay signed in</button>' +
    '<button class="btn btn--primary" data-close id="doLogout">Log out</button></div>');
  $('#doLogout').addEventListener('click', () => toast('Signed out (demo)', 'amber'));
});

/* ------------------------------------------------------------ 14. Init */

function init() {
  fCountry.value = S.profile.country;
  fillCurricula();
  updateUserBlock();
  renderPopular();
  renderRecent();
  renderRoadmap();
  renderDocs();
  renderNotifications();
  renderStats(true);
  renderStrength(true);
  renderDonut(true);
  syncDots();

  const hash = (location.hash || '').replace('#', '');
  if (hash && (VIEWS[hash] || hash === 'dashboard')) go(hash);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();
