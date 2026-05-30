// =============================================
//  WORKinc — Shared Dashboard JS
//  Used by all 5 dashboard pages
// =============================================

// ── ACTIVE NAV HIGHLIGHT ──
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    if (path.includes(item.dataset.page)) {
      item.classList.add('active');
    }
  });

  // ── TOGGLES ──
  document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
      const key = toggle.dataset.key;
      if (key) {
        const val = toggle.classList.contains('on');
        savePreference(key, val);
      }
    });
  });

  // ── RESTORE TOGGLE PREFS ──
  document.querySelectorAll('.toggle[data-key]').forEach(toggle => {
    const saved = localStorage.getItem(toggle.dataset.key);
    if (saved === 'true') toggle.classList.add('on');
  });
});

// ── FLASH MESSAGE ──
function showFlash(msg, type = 'success') {
  const existing = document.querySelector('.flash');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = `flash flash-${type}`;
  el.textContent = msg;
  const body = document.querySelector('.page-body');
  body.insertBefore(el, body.firstChild);
  setTimeout(() => el.remove(), 4000);
}

// ── SAVE PREFERENCE ──
function savePreference(key, val) {
  localStorage.setItem(key, val);
  fetch('/api/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value: val })
  }).catch(() => {});
}

// ── CONFIRM DIALOG ──
function confirmAction(msg, callback) {
  if (window.confirm(msg)) callback();
}

// ── FORMAT CURRENCY ──
function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// ── API HELPER ──
async function apiCall(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(endpoint, opts);
    return await res.json();
  } catch (err) {
    showFlash('Network error. Please try again.', 'error');
    return null;
  }
}

// ── BILL STATUS PILL HTML ──
function pillHTML(status) {
  const map = {
    'auto-pay':  ['pill-green',  'Auto-pay'],
    'pending':   ['pill-yellow', 'Pending'],
    'overdue':   ['pill-red',    'Overdue'],
    'paused':    ['pill-gray',   'Paused'],
    'scheduled': ['pill-blue',   'Scheduled'],
  };
  const [cls, label] = map[status] || ['pill-gray', status];
  return `<span class="pill ${cls}">${label}</span>`;
}
