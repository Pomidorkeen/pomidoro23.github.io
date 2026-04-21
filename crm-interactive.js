/* ============================================================
   CallDesk CRM — Interactive Layer
   Підключи до HTML: <script src="crm-interactive.js"></script>
   ============================================================ */

/* ── MODAL ENGINE ────────────────────────────────────────── */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => {
    m.classList.remove('open'); document.body.style.overflow = '';
  });
});

/* ── TOAST NOTIFICATIONS ─────────────────────────────────── */
function showToast(msg, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const colors = { success:'#22c55e', error:'#ef4444', info:'#3b82f6', warn:'#f59e0b' };
  const icons  = { success:'✓', error:'✕', info:'ℹ', warn:'⚠' };
  toast.style.cssText = `background:#13161d;border:1px solid ${colors[type]};color:#e2e8f0;padding:10px 16px;border-radius:10px;font-size:13px;display:flex;align-items:center;gap:10px;min-width:260px;box-shadow:0 4px 24px rgba(0,0,0,.5);animation:slideIn .2s ease;`;
  toast.innerHTML = `<span style="color:${colors[type]};font-weight:700;">${icons[type]}</span>${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = 'all .3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// alias used in HTML onclick attributes
const showSvcToast = showToast;

/* ── PREORDER DETAIL MODAL ───────────────────────────────── */
function openPreorderDetail(id, client, product, type) {
  document.getElementById('pdModalId').textContent = '#' + id;
  document.getElementById('pdModalClient').textContent = client;
  document.getElementById('pdModalProduct').textContent = product;
  document.getElementById('pdModalType').textContent = type === 'notify' ? '🔔 Повідомити про наявність' : '📦 Передзамовлення';
  openModal('preorderDetailModal');
}

/* ── INCIDENT DETAIL MODAL ───────────────────────────────── */
function openIncidentDetail(id, name, severity, status) {
  document.getElementById('incModalId').textContent = '#' + id;
  document.getElementById('incModalName').textContent = name;
  document.getElementById('incModalSev').textContent = severity;
  const statusMap = { critical:'🔴 Критичний', inprogress:'🟡 В роботі', resolved:'🟢 Вирішено', postmortem:'📋 Post-mortem' };
  document.getElementById('incModalStatus').textContent = statusMap[status] || status;
  openModal('incidentDetailModal');
}

/* ── ORDERS TABLE ────────────────────────────────────────── */
function initOrdersTable() {
  document.querySelectorAll('#page-orders .orders-table tbody tr').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      document.querySelectorAll('#page-orders .orders-table tbody tr').forEach(r => r.style.background = '');
      row.style.background = 'var(--accent-glow)';
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) return;
      openModal('orderDetailModal');
      document.getElementById('orderModalId').textContent      = cells[0]?.textContent || '';
      document.getElementById('orderModalClient').textContent  = cells[1]?.textContent || '';
      document.getElementById('orderModalProduct').textContent = cells[2]?.textContent || '';
    });
  });
}

/* ── LOGISTICS TABLE ─────────────────────────────────────── */
function initLogisticsTable() {
  document.querySelectorAll('#page-logistics .orders-table tbody tr').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const ttn = row.querySelectorAll('td')[4]?.textContent.trim();
      if (ttn) {
        navigator.clipboard?.writeText(ttn).catch(() => {});
        showToast(`ТТН ${ttn} скопійовано`, 'info');
      }
    });
  });
}

/* ── RESERVES TABLE ──────────────────────────────────────── */
function initReservesTable() {
  document.querySelectorAll('#page-reserves .orders-table tbody tr, table#reservesTable tbody tr').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const cells = row.querySelectorAll('td');
      if (!cells.length) return;
      openModal('reserveDetailModal');
      document.getElementById('rsvModalId').textContent      = cells[0]?.textContent.trim();
      document.getElementById('rsvModalProduct').textContent = cells[1]?.textContent.trim();
      document.getElementById('rsvModalDistrib').textContent = cells[2]?.textContent.trim();
      document.getElementById('rsvModalEnd').textContent     = cells[7]?.textContent.trim();
    });
  });
}

/* ── COUNTERPARTIES TABLE ────────────────────────────────── */
function initCounterpartiesTable() {
  document.querySelectorAll('#page-counterparties .orders-table tbody tr').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') return;
      const cells = row.querySelectorAll('td');
      openModal('counterpartyModal');
      document.getElementById('ctpModalName').textContent     = cells[0]?.textContent.trim() || '';
      document.getElementById('ctpModalEdrpou').textContent   = cells[1]?.textContent.trim() || '';
      document.getElementById('ctpModalSegment').textContent  = cells[2]?.textContent.trim() || '';
      document.getElementById('ctpModalManager').textContent  = cells[3]?.textContent.trim() || '';
      document.getElementById('ctpModalLimit').textContent    = cells[4]?.textContent.trim() || '';
      document.getElementById('ctpModalPipeline').textContent = cells[6]?.textContent.trim() || '';
    });
  });
}

/* ── KNOWLEDGE BASE ──────────────────────────────────────── */
function initKnowledge() {
  document.querySelectorAll('#page-knowledge .btn-ghost').forEach(btn => {
    if (btn.textContent.includes('Читати')) {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = btn.closest('[style*="border-radius:12px"]') || btn.closest('.section-card');
        const title = card?.querySelector('[style*="font-size:13px;font-weight:600"]')?.textContent || 'Стаття';
        openModal('articleModal');
        document.getElementById('articleModalTitle').textContent = title;
      });
    }
  });
  const featBtn = document.querySelector('#page-knowledge .btn-primary');
  if (featBtn) {
    featBtn.addEventListener('click', () => {
      openModal('articleModal');
      document.getElementById('articleModalTitle').textContent = 'Як оформити резерв Lenovo у дистриб\'ютора';
    });
  }
}

/* ── AI ASSISTANT ────────────────────────────────────────── */
function initAIAssistant() {
  const sendBtn = document.querySelector('#page-ai .btn-primary');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const input = document.getElementById('aiInput');
      if (!input || !input.value.trim()) { showToast('Введіть запит для AI', 'warn'); return; }
      sendBtn.textContent = '⏳ Думаю...';
      sendBtn.disabled = true;
      setTimeout(() => {
        const reply = document.getElementById('aiReply');
        if (reply) reply.style.display = 'block';
        sendBtn.textContent = '⚡ Запитати AI';
        sendBtn.disabled = false;
        showToast('AI відповідь готова', 'success');
      }, 1200);
    });
  }
  document.querySelectorAll('#page-ai .prompt-chip').forEach(chip => {
    chip.style.cursor = 'pointer';
    chip.addEventListener('click', () => {
      const input = document.getElementById('aiInput');
      if (input) { input.value = chip.textContent.trim(); input.focus(); }
      showToast('Промпт додано до поля запиту', 'info');
    });
  });
  document.querySelectorAll('#page-ai .suggest-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const p = card.querySelector('p')?.textContent.trim();
      const input = document.getElementById('aiInput');
      if (input && p) { input.value = p; input.focus(); }
    });
  });
  document.querySelectorAll('#page-ai .btn-ghost').forEach(btn => {
    if (btn.textContent.includes('Скопіювати')) {
      btn.addEventListener('click', () => {
        const text = document.querySelector('#aiReply')?.innerText || '';
        navigator.clipboard?.writeText(text).catch(() => {});
        showToast('Відповідь скопійована', 'success');
      });
    }
    if (btn.textContent.includes('Надіслати')) {
      btn.addEventListener('click', () => showToast('Відповідь надіслано клієнту', 'success'));
    }
    if (btn.textContent.includes('Перегенерувати')) {
      btn.addEventListener('click', () => {
        const reply = document.getElementById('aiReply');
        if (reply) {
          reply.style.display = 'none';
          setTimeout(() => { reply.style.display = 'block'; showToast('Відповідь оновлена', 'info'); }, 800);
        }
      });
    }
  });
}

/* ── BONUSES ─────────────────────────────────────────────── */
function initBonuses() {
  document.querySelectorAll('#page-bonuses .orders-table tbody tr').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      document.querySelectorAll('#page-bonuses .orders-table tbody tr').forEach(r => r.style.background = '');
      row.style.background = 'var(--accent-glow)';
      showToast('Бонуси менеджера переглянуто', 'info');
    });
  });
}

/* ── INCIDENTS FILTER ────────────────────────────────────── */
function initIncidentsFilter() {
  document.querySelectorAll('.inc-filter').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.inc-filter').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      document.querySelectorAll('#incidentsTable tbody tr').forEach(row => {
        row.style.display = (filter === 'all' || row.dataset.incStatus === filter) ? '' : 'none';
      });
    });
  });
}

/* ── PREORDERS FILTER ────────────────────────────────────── */
function initPreordersFilter() {
  document.querySelectorAll('.po-filter').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.po-filter').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      document.querySelectorAll('#preordersTable tbody tr').forEach(row => {
        if (filter === 'all') { row.style.display = ''; return; }
        row.style.display = (row.dataset.poType === filter || row.dataset.poStatus === filter) ? '' : 'none';
      });
    });
  });
}

/* ── SUBMIT NEW PREORDER ─────────────────────────────────── */
function submitPreorder() {
  const client  = document.getElementById('poClient')?.value.trim();
  const product = document.getElementById('poProduct')?.value.trim();
  const type    = document.getElementById('poType')?.value;
  if (!client || !product) { showToast('Заповніть клієнта та товар', 'warn'); return; }
  const tbody = document.querySelector('#preordersTable tbody');
  if (tbody) {
    const typeLabel = type === 'notify'
      ? '<span class="ord-st st-new">🔔 Про наявність</span>'
      : '<span class="ord-st st-proc" style="background:var(--purple-dim);color:var(--purple);">📦 Передзамовлення</span>';
    const today = new Date().toLocaleDateString('uk-UA', {day:'2-digit', month:'2-digit', year:'numeric'});
    const newId = '#PO-' + (1100 + tbody.querySelectorAll('tr').length);
    const tr = document.createElement('tr');
    tr.dataset.poType = type;
    tr.dataset.poStatus = 'active';
    tr.innerHTML = `<td style="font-family:var(--mono);color:var(--accent2);">${newId}</td><td style="color:var(--text);font-weight:500;">${client}</td><td>${product}</td><td>${typeLabel}</td><td style="font-family:var(--mono);font-size:11px;">${today}</td><td><span class="ord-st" style="background:var(--yellow-dim);color:var(--yellow);">Середній</span></td><td>1</td><td><span class="ord-st st-proc">Очікує</span></td><td>Олексій П.</td><td><button class="btn btn-ghost" style="font-size:10px;padding:3px 8px;">Деталі</button></td>`;
    tbody.prepend(tr);
  }
  closeModal('preorderModal');
  showToast('Заявку додано', 'success');
  if (document.getElementById('poClient'))  document.getElementById('poClient').value  = '';
  if (document.getElementById('poProduct')) document.getElementById('poProduct').value = '';
}

/* ── SUBMIT NEW INCIDENT ─────────────────────────────────── */
function submitIncident() {
  const name = document.getElementById('incName')?.value.trim();
  const sev  = document.getElementById('incSev')?.value;
  if (!name) { showToast('Введіть назву інциденту', 'warn'); return; }
  const tbody = document.querySelector('#incidentsTable tbody');
  if (tbody) {
    const newId = '#INC-0' + (90 + tbody.querySelectorAll('tr').length);
    const now = new Date().toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'});
    const tr = document.createElement('tr');
    tr.dataset.incStatus = 'critical';
    tr.innerHTML = `<td style="font-family:var(--mono);color:var(--red);">${newId}</td><td style="color:var(--text);font-weight:500;">${name}</td><td><span class="soft-chip">Manual</span></td><td><span class="ord-st st-cancel">${sev} 🔴</span></td><td style="font-family:var(--mono);font-size:11px;">20.04 ${now}</td><td style="font-family:var(--mono);font-size:11px;color:var(--text3);">—</td><td style="font-family:var(--mono);font-size:11px;color:var(--red);">Відкрито</td><td><span class="ord-st st-cancel">🔴 Критичний</span></td><td>Олексій П.</td><td><button class="btn btn-ghost" style="font-size:10px;padding:3px 8px;">Відкрити</button></td>`;
    tbody.prepend(tr);
  }
  closeModal('incidentModal');
  showToast('Інцидент зафіксовано!', 'error');
}

/* ── ANALYTICS: animate counters ────────────────────────── */
function animateCounters() {
  document.querySelectorAll('#page-analytics .ac-val').forEach(el => {
    const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
    if (!target || el.dataset.animated) return;
    el.dataset.animated = '1';
    const suffix = el.textContent.replace(/[0-9.]/g, '');
    let current = 0;
    const step = target / 30;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
      if (current >= target) clearInterval(interval);
    }, 20);
  });
}

/* ── SEARCH ──────────────────────────────────────────────── */
function initSearch() {
  const input = document.querySelector('.topbar-search input');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim().toLowerCase();
      if (!q) return;
      document.querySelectorAll('.page-view.active .orders-table tbody tr').forEach(row => {
        const match = row.textContent.toLowerCase().includes(q);
        row.style.background = match ? 'rgba(59,130,246,.12)' : '';
        row.style.display = match ? '' : 'none';
      });
      showToast(`Пошук: "${input.value}"`, 'info');
    }
    if (e.key === 'Escape') {
      input.value = '';
      document.querySelectorAll('.orders-table tbody tr').forEach(row => {
        row.style.background = ''; row.style.display = '';
      });
    }
  });
}

/* ── PAGE TITLES PATCH ───────────────────────────────────── */
function patchPageTitles() {
  if (typeof pageTitles !== 'undefined') {
    pageTitles.preorders = '/ передзамовлення';
    pageTitles.incidents = '/ інциденти';
    pageTitles.service   = '/ сервіс';
  }
}

/* ════════════════════════════════════════════════════════════
   SERVICE CENTER
   ════════════════════════════════════════════════════════════ */

const SVC_TYPES = {
  returns:  { label:'↩ Повернення', color:'var(--yellow)'  },
  exchange: { label:'🔄 Обмін',     color:'var(--accent2)' },
  repair:   { label:'🔧 Ремонт',    color:'var(--purple)'  },
  warranty: { label:'🛡️ Гарантія',  color:'var(--green)'   },
  writeoff: { label:'📋 Списання',  color:'var(--red)'     },
};

/* open service detail modal */
function openSvcDetail(id, type, client, product, reason, dateFrom, dateTo, status, owner) {
  const typeInfo = SVC_TYPES[type] || { label: type, color: 'var(--text2)' };

  document.getElementById('svcModalId').textContent       = '#' + id;
  document.getElementById('svcModalType').innerHTML       = `<span style="color:${typeInfo.color};font-weight:600;">${typeInfo.label}</span>`;
  document.getElementById('svcModalClient').textContent   = client;
  document.getElementById('svcModalProduct').textContent  = product;
  document.getElementById('svcModalReason').textContent   = reason;
  document.getElementById('svcModalOwner').textContent    = owner;
  document.getElementById('svcModalDate').textContent     = dateFrom;
  document.getElementById('svcModalDeadline').textContent = dateTo;
  document.getElementById('svcModalTitle').textContent    = typeInfo.label + ' — #' + id;

  // reset + pre-fill checklist based on status
  ['svcCheck1','svcCheck2','svcCheck3','svcCheck4','svcCheck5'].forEach((chkId, i) => {
    const el  = document.getElementById(chkId);
    const dot = el?.querySelector('.check-dot');
    if (!dot) return;
    const filled = (i === 0) ||
                   (status === 'approved' && i <= 2) ||
                   (status === 'done');
    dot.textContent = filled ? '✓' : '';
    dot.style.color = filled ? 'var(--green)' : '';
  });

  const cmEl = document.getElementById('svcModalComment');
  if (cmEl) cmEl.value = '';

  openModal('svcDetailModal');
}

/* approve all checklist items */
function approveSvc() {
  ['svcCheck2','svcCheck3','svcCheck4'].forEach(id => {
    const dot = document.getElementById(id)?.querySelector('.check-dot');
    if (dot) { dot.textContent = '✓'; dot.style.color = 'var(--green)'; }
  });
  showToast('Заявку затверджено ✓', 'success');
  setTimeout(() => closeModal('svcDetailModal'), 1200);
}

/* filter rows */
function svcFilterClick(el, filter) {
  document.querySelectorAll('.svc-filter').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#svcTableBody tr').forEach(row => {
    if (filter === 'all') { row.style.display = ''; return; }
    row.style.display = row.dataset.svctype === filter ? '' : 'none';
  });
  const label = filter === 'all' ? 'Всі заявки' : (SVC_TYPES[filter]?.label || filter);
  showToast(label, 'info');
}

/* KPI cell click → filter */
function filterSvcSection(type) {
  const chip = document.querySelector(`.svc-filter[data-svcfilter="${type}"]`);
  if (chip) svcFilterClick(chip, type);
}

/* right-panel checklist rows */
function initSvcCheckRows() {
  document.querySelectorAll('#page-service .svc-check, #svcDetailModal .svc-check').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const dot = row.querySelector('.check-dot');
      if (!dot) return;
      const isDone = dot.textContent.includes('✓');
      dot.textContent = isDone ? '' : '✓';
      dot.style.color = isDone ? '' : 'var(--green)';
    });
  });
}

/* submit new service request */
function submitNewService() {
  const typeVal = document.getElementById('newSvcType')?.value    || 'returns';
  const client  = document.getElementById('newSvcClient')?.value.trim()  || '';
  const product = document.getElementById('newSvcProduct')?.value.trim() || '';
  const reason  = document.getElementById('newSvcReason')?.value.trim()  || '—';
  const owner   = document.getElementById('newSvcOwner')?.value   || 'Олексій П.';
  const ddlRaw  = document.getElementById('newSvcDeadline')?.value || '';

  if (!client || !product) { showToast('Заповніть клієнта та товар', 'warn'); return; }

  const tbody = document.getElementById('svcTableBody');
  if (tbody) {
    const newId   = 'SVC-00' + (82 + tbody.querySelectorAll('tr').length);
    const today   = new Date().toLocaleDateString('uk-UA', {day:'2-digit', month:'2-digit', year:'numeric'});
    const ddl     = ddlRaw ? new Date(ddlRaw).toLocaleDateString('uk-UA', {day:'2-digit', month:'2-digit', year:'numeric'}) : '—';
    const typeInfo = SVC_TYPES[typeVal] || { label: typeVal, color: 'var(--text2)' };
    const badgeMap = { returns:'svc-return', exchange:'svc-exchange', repair:'svc-repair', writeoff:'svc-writeoff', warranty:'svc-warranty' };
    const badgeCls = badgeMap[typeVal] || 'svc-return';

    const tr = document.createElement('tr');
    tr.dataset.svctype = typeVal;
    tr.style.cursor = 'pointer';
    tr.innerHTML = `
      <td style="font-family:var(--mono);color:var(--accent2);">#${newId}</td>
      <td><span class="svc-type-badge ${badgeCls}">${typeInfo.label}</span></td>
      <td style="color:var(--text);font-weight:500;">${client}</td>
      <td style="color:var(--text);">${product}</td>
      <td style="color:var(--text2);">${reason}</td>
      <td style="font-family:var(--mono);font-size:11px;">${today}</td>
      <td style="font-family:var(--mono);font-size:11px;color:var(--yellow);">${ddl}</td>
      <td><span class="ord-st st-proc">На розгляді</span></td>
      <td style="color:var(--text2);">${owner}</td>
      <td><button class="btn btn-ghost" style="font-size:10px;padding:3px 8px;"
          onclick="event.stopPropagation();openSvcDetail('${newId}','${typeVal}','${client}','${product}','${reason}','${today}','${ddl}','pending','${owner}')">Відкрити</button></td>`;
    tr.addEventListener('click', () =>
      openSvcDetail(newId, typeVal, client, product, reason, today, ddl, 'pending', owner)
    );
    tbody.prepend(tr);
  }

  closeModal('newServiceModal');
  showToast('Сервісну заявку створено', 'success');

  ['newSvcClient','newSvcProduct','newSvcSerial','newSvcReason'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

/* ── INIT ALL ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  patchPageTitles();
  initOrdersTable();
  initLogisticsTable();
  initReservesTable();
  initCounterpartiesTable();
  initKnowledge();
  initAIAssistant();
  initBonuses();
  initIncidentsFilter();
  initPreordersFilter();
  initSearch();
  initSvcCheckRows();

  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      if (item.dataset.page === 'analytics') setTimeout(animateCounters, 100);
    });
  });

  const notifyBtn = document.getElementById('pdNotifyBtn');
  if (notifyBtn) {
    notifyBtn.addEventListener('click', () => {
      showToast('SMS/Email надіслано клієнту', 'success');
      closeModal('preorderDetailModal');
    });
  }

  const incResolveBtn = document.getElementById('incResolveBtn');
  if (incResolveBtn) {
    incResolveBtn.addEventListener('click', () => {
      showToast('Інцидент позначено як вирішений', 'success');
      closeModal('incidentDetailModal');
    });
  }
});
