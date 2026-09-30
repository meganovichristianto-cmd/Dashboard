/**
 * RUNA Wellness Centre - Project Management Dashboard Logic
 * Engine for Granular Sub-Tasks, Manual Deadlines, Overdue Tracking & Bottleneck Logs
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  let products = loadProductsData();
  const stages = INITIAL_STAGES;
  const waves = INITIAL_WAVES;
  const pics = INITIAL_PICS;

  let currentTab = 'helicopter';
  let modalActiveTab = 'subtasks';
  let currentEditingProductId = null;

  let filters = {
    search: '',
    wave: 'all',
    pic: 'all',
    risk: 'all'
  };

  // Initialize App
  init();

  function init() {
    setupEventListeners();
    updateDashboardViews();
  }

  /* ==========================================================================
     DATA PERSISTENCE & AUTO-CALCULATORS
     ========================================================================== */
  function loadProductsData() {
    const saved = localStorage.getItem('pt_runa_dashboard_products_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored data:', e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  }

  function saveProductsData() {
    localStorage.setItem('pt_runa_dashboard_products_v2', JSON.stringify(products));
  }

  function calculateAutoProgress(prod) {
    if (prod.tasks && prod.tasks.length > 0) {
      const completedCount = prod.tasks.filter(t => t.completed).length;
      return Math.round((completedCount / prod.tasks.length) * 100);
    }
    return prod.progress || 10;
  }

  function getDeadlineStatus(deadlineStr, isCompleted = false) {
    if (isCompleted) {
      return { class: 'completed', text: '✓ Selesai', days: 0 };
    }
    if (!deadlineStr) {
      return { class: 'on-track', text: '🟢 On Track', days: 0 };
    }

    const today = new Date('2026-09-30');
    const target = new Date(deadlineStr);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { class: 'overdue', text: `🔴 Overdue ${Math.abs(diffDays)} Hr`, days: diffDays };
    } else if (diffDays <= 14) {
      return { class: 'due-soon', text: `🟡 Sisa ${diffDays} Hr`, days: diffDays };
    } else {
      return { class: 'on-track', text: `🟢 On Track`, days: diffDays };
    }
  }

  function getPicInfo(picId) {
    return pics.find(p => p.id === picId) || { name: picId, badgeClass: 'badge-agro' };
  }

  function getStageInfo(stageId) {
    return stages.find(s => s.id === stageId) || { name: stageId, color: '#847C78' };
  }

  /* ==========================================================================
     EVENT LISTENERS & NAVIGATION
     ========================================================================== */
  function setupEventListeners() {
    // Main Tab Switching
    document.querySelectorAll('.tabs-header .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        if (tabTarget) {
          document.querySelectorAll('.tabs-header .tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
          
          btn.classList.add('active');
          document.getElementById(`tab-${tabTarget}`).classList.add('active');
          currentTab = tabTarget;
          updateDashboardViews();
        }
      });
    });

    // Modal Inner Tab Switching
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPane = btn.getAttribute('data-pane');
        if (targetPane) {
          document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.modal-pane').forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          document.getElementById(`modal-pane-${targetPane}`).classList.add('active');
          modalActiveTab = targetPane;
        }
      });
    });

    // Search and Filters
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      filters.search = e.target.value.toLowerCase();
      updateDashboardViews();
    });

    document.getElementById('filterWave')?.addEventListener('change', (e) => {
      filters.wave = e.target.value;
      updateDashboardViews();
    });

    document.getElementById('filterPic')?.addEventListener('change', (e) => {
      filters.pic = e.target.value;
      updateDashboardViews();
    });

    document.getElementById('filterRisk')?.addEventListener('change', (e) => {
      filters.risk = e.target.value;
      updateDashboardViews();
    });

    // Actions
    document.getElementById('btnAddProduct')?.addEventListener('click', () => openProductModal());
    document.getElementById('btnExportData')?.addEventListener('click', exportDataJSON);
    document.getElementById('btnImportData')?.addEventListener('click', () => document.getElementById('fileImportInput').click());
    document.getElementById('fileImportInput')?.addEventListener('change', importDataJSON);
    document.getElementById('btnResetData')?.addEventListener('click', resetDefaultData);

    // Modal Close
    document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // Product Form Submit
    document.getElementById('productForm')?.addEventListener('submit', handleFormSubmit);

    // Add New Custom Subtask Handler
    document.getElementById('btnAddSubtask')?.addEventListener('click', handleAddSubtask);
  }

  function getFilteredProducts() {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(filters.search) || 
                          p.code.toLowerCase().includes(filters.search) ||
                          (p.bottleneck && p.bottleneck.toLowerCase().includes(filters.search));
      
      const matchWave = filters.wave === 'all' || p.wave === filters.wave;
      const matchPic = filters.pic === 'all' || p.pic === filters.pic;
      const matchRisk = filters.risk === 'all' || p.riskLevel === filters.risk;

      return matchSearch && matchWave && matchPic && matchRisk;
    });
  }

  /* ==========================================================================
     RENDER DASHBOARD VIEWS
     ========================================================================== */
  function updateDashboardViews() {
    const filtered = getFilteredProducts();
    
    renderKPIs();
    renderDecisionBanner();

    if (currentTab === 'helicopter') {
      renderHelicopterView(filtered);
    } else if (currentTab === 'kanban') {
      renderKanbanView(filtered);
    } else if (currentTab === 'gantt') {
      renderGanttView(filtered);
    } else if (currentTab === 'risk') {
      renderRiskView(filtered);
    }
  }

  function renderKPIs() {
    const totalCount = products.length;
    const wave1Count = products.filter(p => p.wave === 'wave1').length;
    const highRiskCount = products.filter(p => p.riskLevel === 'high').length;
    
    const avgProgress = Math.round(products.reduce((acc, p) => acc + calculateAutoProgress(p), 0) / (totalCount || 1));

    document.getElementById('kpiTotalProducts').textContent = totalCount;
    document.getElementById('kpiWave1Count').textContent = wave1Count;
    document.getElementById('kpiHighRiskCount').textContent = highRiskCount;
    document.getElementById('kpiAvgProgress').textContent = `${avgProgress}%`;
  }

  function renderDecisionBanner() {
    const rebrandingNeeds = products.filter(p => p.stage === 'rebranding' || (p.bottleneck && p.bottleneck.toLowerCase().includes('nama')));
    const tagsContainer = document.getElementById('decisionTagsContainer');
    if (!tagsContainer) return;

    tagsContainer.innerHTML = rebrandingNeeds.map(p => `
      <span class="badge-decision">
        <i class="fas fa-exclamation-circle"></i> ${p.name}
      </span>
    `).join('');
  }

  /* --- TAB 1: HELICOPTER VIEW --- */
  function renderHelicopterView(productList) {
    const tbody = document.getElementById('helicopterTableBody');
    if (!tbody) return;

    if (productList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#847C78;">Tidak ada produk yang cocok dengan filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = productList.map(p => {
      const picInfo = getPicInfo(p.pic);
      const stageInfo = getStageInfo(p.stage);
      const calculatedProgress = calculateAutoProgress(p);
      const totalTasks = p.tasks ? p.tasks.length : 0;
      const completedTasks = p.tasks ? p.tasks.filter(t => t.completed).length : 0;

      return `
        <tr>
          <td>
            <div class="product-name-cell">
              <span class="product-name-title">${p.name}</span>
              <span class="product-code">${p.code} • ${p.rawMaterialStatus}</span>
              <span class="subtask-summary-tag"><i class="fas fa-tasks"></i> ${completedTasks}/${totalTasks} Sub-Task Selesai</span>
            </div>
          </td>
          <td>
            <span class="badge-wave ${p.wave}">
              ${p.wave === 'wave1' ? 'Wave 1 (Quick Win)' : p.wave === 'wave2' ? 'Wave 2 (Mid-Term)' : 'Wave 3 (Long-Term)'}
            </span>
          </td>
          <td>
            <span class="badge-pic ${picInfo.badgeClass}">
              ${picInfo.name}
            </span>
          </td>
          <td>
            <span style="font-weight:700; color:${stageInfo.color}; font-size:12.5px; display:inline-flex; align-items:center; gap:6px;">
              <i class="fas ${stageInfo.icon}"></i> ${stageInfo.name}
            </span>
          </td>
          <td>
            <div class="progress-container">
              <div class="progress-track">
                <div class="progress-fill ${calculatedProgress > 50 ? '' : 'pink'}" style="width: ${calculatedProgress}%;"></div>
              </div>
              <span class="progress-text">${calculatedProgress}%</span>
            </div>
          </td>
          <td>
            <span class="badge-risk ${p.riskLevel}">
              <i class="fas fa-circle" style="font-size:6px;"></i> ${p.riskLevel.toUpperCase()}
            </span>
          </td>
          <td>
            <button class="btn btn-outline-runa btn-sm btn-edit-prod" data-id="${p.id}">
              <i class="fas fa-edit"></i> Checklist & Deadline
            </button>
          </td>
        </tr>
      `;
    }).join('');

    document.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openProductModal(id);
      });
    });
  }

  /* --- TAB 2: KANBAN VIEW --- */
  function renderKanbanView(productList) {
    const kanbanBoard = document.getElementById('kanbanBoard');
    if (!kanbanBoard) return;

    kanbanBoard.innerHTML = stages.map(stage => {
      const stageProducts = productList.filter(p => p.stage === stage.id);
      
      return `
        <div class="kanban-column">
          <div class="kanban-column-header">
            <div class="column-title">
              <i class="fas ${stage.icon}" style="color:${stage.color};"></i>
              ${stage.name}
            </div>
            <span class="column-count">${stageProducts.length}</span>
          </div>
          <div class="kanban-cards-wrapper">
            ${stageProducts.map(p => {
              const picInfo = getPicInfo(p.pic);
              const calculatedProgress = calculateAutoProgress(p);
              const totalTasks = p.tasks ? p.tasks.length : 0;
              const completedTasks = p.tasks ? p.tasks.filter(t => t.completed).length : 0;

              return `
                <div class="kanban-card" data-id="${p.id}">
                  <div class="card-top">
                    <span class="badge-pic ${picInfo.badgeClass}">${picInfo.name}</span>
                    <span class="badge-risk ${p.riskLevel}">${p.riskLevel}</span>
                  </div>
                  <div class="card-title">${p.name}</div>
                  <div class="card-focus"><i class="fas fa-search"></i> ${p.researchFocus}</div>
                  
                  <div class="progress-container" style="margin-top:10px;">
                    <div class="progress-track">
                      <div class="progress-fill" style="width: ${calculatedProgress}%;"></div>
                    </div>
                    <span class="progress-text">${calculatedProgress}%</span>
                  </div>
                  <div style="font-size:11px; color:var(--runa-muted); margin-top:4px;">
                    <i class="fas fa-check-square"></i> ${completedTasks}/${totalTasks} Sub-Tasks Selesai
                  </div>

                  <div class="card-meta">
                    <span class="card-dates">
                      <i class="far fa-calendar-alt"></i> Target: ${p.estCompletionDate ? p.estCompletionDate.substring(0, 7) : '2027-06'}
                    </span>
                    <span class="badge-wave ${p.wave}" style="font-size:10px; padding:2px 6px;">${p.wave.toUpperCase()}</span>
                  </div>
                </div>
              `;
            }).join('')}
            ${stageProducts.length === 0 ? `<div style="text-align:center; padding:20px; font-size:12px; color:#847C78;">Kosong</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        openProductModal(id);
      });
    });
  }

  /* --- TAB 3: GANTT TIMELINE VIEW --- */
  function renderGanttView(productList) {
    const container = document.getElementById('ganttTimelineContainer');
    if (!container) return;

    const months = ['Okt 26', 'Nov 26', 'Des 26', 'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'Mei 27', 'Jun 27', 'Jul 27', 'Agu 27', 'Sep 27'];

    let html = `
      <div class="gantt-wrapper">
        <div class="gantt-header">
          <div class="gantt-header-cell">Produk & Timeline Sub-Task</div>
          ${months.map(m => `<div class="gantt-header-cell">${m}</div>`).join('')}
        </div>
    `;

    productList.forEach(p => {
      const startMonthIdx = getMonthIndex(p.startDate || '2026-10-01');
      const endMonthIdx = getMonthIndex(p.estCompletionDate || '2027-06-30');
      const colSpan = Math.max(endMonthIdx - startMonthIdx + 1, 2);

      const leftPercent = (startMonthIdx / 12) * 100;
      const widthPercent = (colSpan / 12) * 100;
      const picInfo = getPicInfo(p.pic);

      const barColorClass = p.wave === 'wave1' ? '' : p.wave === 'wave2' ? 'pink-bar' : 'amber-bar';
      const calculatedProgress = calculateAutoProgress(p);

      html += `
        <div class="gantt-row">
          <div class="gantt-product-info">
            <span class="gantt-product-name">${p.name}</span>
            <span class="badge-pic ${picInfo.badgeClass}" style="width:fit-content; font-size:10px; padding:2px 6px;">${picInfo.name}</span>
          </div>
          <div class="gantt-timeline-area">
            <div class="gantt-bar ${barColorClass}" style="left: ${leftPercent}%; width: ${widthPercent}%;" title="${p.name} (${p.startDate} - ${p.estCompletionDate})">
              <span><i class="fas fa-clock"></i> ${p.stage.toUpperCase()} (${calculatedProgress}%)</span>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        <div class="gantt-legend">
          <div class="legend-item"><div class="legend-box" style="background:#A57E6B;"></div> Wave 1 (Quick Wins)</div>
          <div class="legend-item"><div class="legend-box" style="background:#D4A396;"></div> Wave 2 (Mid-Term)</div>
          <div class="legend-item"><div class="legend-box" style="background:#D98A41;"></div> Wave 3 (Long-Term R&D)</div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  function getMonthIndex(dateStr) {
    if (!dateStr) return 0;
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);

    if (year === 2026) {
      return Math.max(month - 10, 0);
    } else if (year === 2027) {
      return Math.min(month + 2, 11);
    }
    return 0;
  }

  /* --- TAB 4: RISK & BOTTLENECK MATRIX --- */
  function renderRiskView(productList) {
    const container = document.getElementById('riskMatrixContainer');
    if (!container) return;

    const riskProducts = productList.filter(p => p.bottleneck || p.riskLevel === 'high' || p.riskLevel === 'medium');

    if (riskProducts.length === 0) {
      container.innerHTML = `<div class="section-card"><p style="text-align:center; color:#847C78;">Tidak ada isu atau kendala yang terdeteksi.</p></div>`;
      return;
    }

    container.innerHTML = riskProducts.map(p => {
      const picInfo = getPicInfo(p.pic);
      const bLog = p.bottleneckLog || {};

      return `
        <div class="risk-card">
          <div class="risk-card-top">
            <div>
              <h4><i class="fas fa-exclamation-triangle" style="color:${p.riskLevel === 'high' ? '#C95A5A' : '#D98A41'};"></i> ${p.name}</h4>
              <span class="badge-pic ${picInfo.badgeClass}">PIC Utama: ${picInfo.name}</span>
            </div>
            <div>
              <span class="badge-risk ${p.riskLevel}">RISK: ${p.riskLevel.toUpperCase()}</span>
              <button class="btn btn-outline-runa btn-sm btn-edit-prod" data-id="${p.id}" style="margin-left:8px;">
                <i class="fas fa-wrench"></i> Kelola Log Remidiasi
              </button>
            </div>
          </div>

          <div class="risk-log-box">
            <p style="margin-bottom:4px;"><strong>Ringkasan Kendala:</strong> ${p.bottleneck || 'Risiko riset & bahan baku'}</p>
            ${bLog.rootCause ? `<p style="margin-bottom:4px;"><strong>Akar Masalah (Root Cause):</strong> ${bLog.rootCause}</p>` : ''}
            ${bLog.actionPlan ? `<p style="margin-bottom:4px;"><strong>Rencana Tindakan (Action Plan):</strong> ${bLog.actionPlan}</p>` : ''}
            <p style="font-size:11.5px; color:var(--runa-muted); margin-top:6px;">
              <i class="fas fa-clock"></i> Target Penyelesaian: <strong>${bLog.targetResolveDate || '2026-10-30'}</strong> • Status: <strong>${(bLog.status || 'in_progress').toUpperCase()}</strong>
            </p>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openProductModal(id);
      });
    });
  }

  /* ==========================================================================
     MODAL DRAWER & SUB-TASK MANAGEMENT
     ========================================================================== */
  function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    if (!modal || !form) return;

    form.reset();
    currentEditingProductId = productId;

    if (productId) {
      const prod = products.find(p => p.id === productId);
      if (prod) {
        document.getElementById('modalTitle').textContent = `Detail & Checklist: ${prod.name}`;
        document.getElementById('prodId').value = prod.id;
        document.getElementById('prodName').value = prod.name;
        document.getElementById('prodCode').value = prod.code;
        document.getElementById('prodWave').value = prod.wave;
        document.getElementById('prodStage').value = prod.stage;
        document.getElementById('prodPic').value = prod.pic;
        document.getElementById('prodRawMaterial').value = prod.rawMaterialStatus;
        document.getElementById('prodResearchFocus').value = prod.researchFocus;
        document.getElementById('prodRiskLevel').value = prod.riskLevel;
        document.getElementById('prodBottleneck').value = prod.bottleneck;
        document.getElementById('prodNotes').value = prod.notes || '';

        const bLog = prod.bottleneckLog || {};
        document.getElementById('logRootCause').value = bLog.rootCause || '';
        document.getElementById('logActionPlan').value = bLog.actionPlan || '';
        document.getElementById('logTargetDate').value = bLog.targetResolveDate || '2026-10-30';
        document.getElementById('logStatus').value = bLog.status || 'in_progress';

        renderSubtasksInModal(prod);
      }
    } else {
      document.getElementById('modalTitle').textContent = 'Tambah Produk Maklon Baru';
      document.getElementById('prodId').value = '';
      renderSubtasksInModal({ tasks: [] });
    }

    modal.classList.add('active');
  }

  function renderSubtasksInModal(product) {
    const container = document.getElementById('subtaskListContainer');
    if (!container) return;

    const tasks = product.tasks || [];
    
    if (tasks.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:16px; color:var(--runa-muted); font-size:13px;">Belum ada sub-task. Tambahkan sub-task di bawah.</div>`;
      return;
    }

    container.innerHTML = tasks.map((task, index) => {
      const deadlineInfo = getDeadlineStatus(task.deadline, task.completed);
      const picInfo = getPicInfo(task.pic || 'pt_agro');

      return `
        <div class="subtask-item ${task.completed ? 'completed' : ''}" data-index="${index}">
          <div class="subtask-left">
            <input type="checkbox" class="subtask-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
            <div>
              <div class="subtask-title">${task.title}</div>
              <span class="badge-pic ${picInfo.badgeClass}" style="font-size:10px; padding:1px 6px;">${picInfo.name}</span>
            </div>
          </div>

          <div class="subtask-controls">
            <input type="date" class="subtask-date-picker" value="${task.deadline || '2026-10-15'}" data-index="${index}">
            <span class="badge-deadline ${deadlineInfo.class}">${deadlineInfo.text}</span>
            <button type="button" class="btn-remove-task" data-index="${index}" title="Hapus Sub-Task">&times;</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.subtask-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const idx = parseInt(cb.getAttribute('data-index'), 10);
        if (currentEditingProductId) {
          const prod = products.find(p => p.id === currentEditingProductId);
          if (prod && prod.tasks[idx]) {
            prod.tasks[idx].completed = cb.checked;
            prod.progress = calculateAutoProgress(prod);
            saveProductsData();
            renderSubtasksInModal(prod);
            updateDashboardViews();
          }
        }
      });
    });

    container.querySelectorAll('.subtask-date-picker').forEach(dp => {
      dp.addEventListener('change', () => {
        const idx = parseInt(dp.getAttribute('data-index'), 10);
        if (currentEditingProductId) {
          const prod = products.find(p => p.id === currentEditingProductId);
          if (prod && prod.tasks[idx]) {
            prod.tasks[idx].deadline = dp.value;
            saveProductsData();
            renderSubtasksInModal(prod);
            updateDashboardViews();
          }
        }
      });
    });

    container.querySelectorAll('.btn-remove-task').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (currentEditingProductId) {
          const prod = products.find(p => p.id === currentEditingProductId);
          if (prod && prod.tasks) {
            prod.tasks.splice(idx, 1);
            prod.progress = calculateAutoProgress(prod);
            saveProductsData();
            renderSubtasksInModal(prod);
            updateDashboardViews();
          }
        }
      });
    });
  }

  function handleAddSubtask() {
    const titleInput = document.getElementById('newSubtaskTitle');
    const dateInput = document.getElementById('newSubtaskDate');
    const picSelect = document.getElementById('newSubtaskPic');

    if (!titleInput || !titleInput.value.trim()) {
      alert('Masukkan nama sub-task terlebih dahulu.');
      return;
    }

    const newTask = {
      id: `t-custom-${Date.now()}`,
      title: titleInput.value.trim(),
      category: 'riset',
      completed: false,
      deadline: dateInput.value || '2026-10-20',
      pic: picSelect.value || 'pt_agro'
    };

    if (currentEditingProductId) {
      const prod = products.find(p => p.id === currentEditingProductId);
      if (prod) {
        if (!prod.tasks) prod.tasks = [];
        prod.tasks.push(newTask);
        prod.progress = calculateAutoProgress(prod);
        saveProductsData();
        renderSubtasksInModal(prod);
        updateDashboardViews();
        titleInput.value = '';
        showToast('Sub-task baru ditambahkan!', 'success');
      }
    }
  }

  function closeModal() {
    document.getElementById('productModal')?.classList.remove('active');
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('prodId').value;
    const isEdit = !!id;

    const prodData = {
      id: id || `prod-${Date.now()}`,
      name: document.getElementById('prodName').value,
      code: document.getElementById('prodCode').value || `RN-${Math.floor(100+Math.random()*900)}`,
      wave: document.getElementById('prodWave').value,
      stage: document.getElementById('prodStage').value,
      pic: document.getElementById('prodPic').value,
      rawMaterialStatus: document.getElementById('prodRawMaterial').value,
      researchFocus: document.getElementById('prodResearchFocus').value,
      riskLevel: document.getElementById('prodRiskLevel').value,
      bottleneck: document.getElementById('prodBottleneck').value,
      notes: document.getElementById('prodNotes').value,
      startDate: '2026-10-01',
      estCompletionDate: '2027-06-30',
      bottleneckLog: {
        rootCause: document.getElementById('logRootCause').value,
        actionPlan: document.getElementById('logActionPlan').value,
        targetResolveDate: document.getElementById('logTargetDate').value,
        status: document.getElementById('logStatus').value
      }
    };

    if (isEdit) {
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        prodData.tasks = products[index].tasks || [];
        prodData.progress = calculateAutoProgress(prodData);
        products[index] = { ...products[index], ...prodData };
      }
    } else {
      prodData.tasks = [
        { id: `t-${Date.now()}-1`, title: 'Verifikasi Formulasi & Bahan Baku', category: 'riset', completed: false, deadline: '2026-10-15', pic: prodData.pic },
        { id: `t-${Date.now()}-2`, title: 'Uji Laboratorium Eksternal', category: 'uji_lab', completed: false, deadline: '2026-11-15', pic: prodData.pic },
        { id: `t-${Date.now()}-3`, title: 'Pengurusan Pendaftaran BPOM TR', category: 'bpom_halal', completed: false, deadline: '2027-02-15', pic: prodData.pic }
      ];
      prodData.progress = calculateAutoProgress(prodData);
      products.push(prodData);
    }

    saveProductsData();
    updateDashboardViews();
    closeModal();
    showToast(isEdit ? 'Produk & checklist berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!', 'success');
  }

  /* ==========================================================================
     JSON EXPORT & IMPORT ENGINE
     ========================================================================== */
  function exportDataJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `RUNA_Wellness_Project_Data_${new Date().toISOString().substring(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data berhasil di-export ke JSON!', 'info');
  }

  function importDataJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          products = imported;
          saveProductsData();
          updateDashboardViews();
          showToast('Data produk & sub-task berhasil di-import!', 'success');
        } else {
          alert('Format JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal mengolah file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function resetDefaultData() {
    if (confirm('Apakah Anda yakin ingin mengembalikan data ke kondisi awal (default)?')) {
      products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
      saveProductsData();
      updateDashboardViews();
      showToast('Data berhasil di-reset ke kondisi awal!', 'info');
    }
  }

  function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = `toast ${type} active`;
    toast.querySelector('.toast-message').textContent = message;

    setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  }
});
