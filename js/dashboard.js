// Dashboard Module
window.Dashboard = {
  // Update statistics
  updateStats: function() {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) return;
    
    const stats = DataBase.getStats(currentUser.email);
    
    const totalEl = document.getElementById('totalComplaints');
    const activeEl = document.getElementById('activeInvestigations');
    const resolvedEl = document.getElementById('resolvedCases');
    
    if (totalEl) totalEl.textContent = stats.total;
    if (activeEl) activeEl.textContent = stats.active;
    if (resolvedEl) resolvedEl.textContent = stats.resolved;
  },
  
  // Load cyber alerts
  loadCyberAlerts: function() {
    const alerts = [
      { icon: 'exclamation-triangle', color: 'warning', title: 'Phishing Alert', text: 'Fake IRCTC refund emails circulating' },
      { icon: 'skull', color: 'danger', title: 'Ransomware Warning', text: 'New variant targeting Indian banks' },
      { icon: 'shield-alt', color: 'success', title: 'Advisory', text: 'Update your UPI apps to latest version' },
      { icon: 'bug', color: 'info', title: 'Security Update', text: 'Critical Windows patch released' }
    ];
    
    const container = document.getElementById('cyberAlerts');
    if (container) {
      container.innerHTML = alerts.map(alert => `
        <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-light);">
          <i class="fas fa-${alert.icon}" style="color: var(--${alert.color}); margin-right: 0.5rem;"></i>
          <strong>${alert.title}:</strong> ${alert.text}
        </div>
      `).join('');
    }
  },
  
  // Load crime statistics
  loadCrimeStats: function() {
    const stats = [
      { name: 'Financial Fraud', percentage: 42, color: 'danger' },
      { name: 'Identity Theft', percentage: 23, color: 'warning' },
      { name: 'Cyber Stalking', percentage: 18, color: 'info' },
      { name: 'Hacking', percentage: 12, color: 'primary' },
      { name: 'Others', percentage: 5, color: 'accent' }
    ];
    
    const container = document.getElementById('crimeStats');
    if (container) {
      container.innerHTML = stats.map(stat => `
        <div style="margin-bottom: 1rem;">
          <div>${stat.name}: <span style="float: right;">${stat.percentage}%</span></div>
          <div style="background: #e2e8f0; height: 8px; border-radius: 4px; margin-top: 5px;">
            <div style="background: var(--${stat.color}); width: ${stat.percentage}%; height: 8px; border-radius: 4px;"></div>
          </div>
        </div>
      `).join('');
    }
  },
  
  // Load recent complaints
  loadRecentComplaints: function() {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) return;
    
    const complaints = DataBase.getUserComplaints(currentUser.email).slice(0, 5);
    const container = document.getElementById('recentComplaints');
    
    if (container) {
      if (complaints.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem;">No complaints filed yet</div>';
        return;
      }
      
      container.innerHTML = complaints.map(c => `
        <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-light); cursor: pointer;" onclick="window.trackComplaintById('${c.id}')">
          <div style="display: flex; justify-content: space-between;">
            <strong>${c.id}</strong>
            <span class="complaint-status status-${c.status}">${c.status}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-light);">${c.crimeType} • ${new Date(c.createdAt).toLocaleDateString()}</div>
        </div>
      `).join('');
    }
  }
};

// Global navigation
window.navigateTo = function(page) {
  const pages = {
    dashboard: 'dashboardContent',
    complaint: 'complaintContent',
    'cyber-cell': 'cyberCellContent',
    tools: 'toolsContent',
    track: 'trackContent'
  };
  
  // Hide all pages
  Object.values(pages).forEach(pageId => {
    const el = document.getElementById(pageId);
    if (el) el.style.display = 'none';
  });
  
  // Show selected page
  const selectedPage = pages[page];
  if (selectedPage) {
    document.getElementById(selectedPage).style.display = 'block';
  }
  
  // Update active nav link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === page) {
      link.classList.add('active');
    }
  });
  
  // Update dashboard stats if on dashboard
  if (page === 'dashboard') {
    Dashboard.updateStats();
    Dashboard.loadRecentComplaints();
  }
};

window.navigateToComplaint = function() {
  if (!Auth.isLoggedIn()) {
    window.showToast('Please login to file a complaint', 'warning');
    document.getElementById('authModal').classList.add('show');
    return;
  }
  window.navigateTo('complaint');
};

window.trackComplaintById = function(id) {
  window.navigateTo('track');
  document.getElementById('trackId').value = id;
  window.trackComplaint();
};

// Load cyber cell info
window.loadCyberCellInfo = function() {
  const container = document.getElementById('cyberCellInfo');
  if (container) {
    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h4><i class="fas fa-map-marker-alt"></i> National Cyber Crime Cell</h4>
        <p>Ministry of Home Affairs, New Delhi</p>
        <p>Helpline: 1930 | Email: report@cybercell.gov.in</p>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <h4><i class="fas fa-laptop-code"></i> Indian Cyber Crime Coordination Centre (I4C)</h4>
        <p>7th Floor, NDCC-II Building, New Delhi</p>
        <p>Email: i4c@mha.gov.in</p>
      </div>
      <div>
        <h4><i class="fas fa-phone-alt"></i> State Cyber Cells (24x7)</h4>
        <p>Maharashtra: 022-2200 3500 | Delhi: 011-2349 0500</p>
        <p>Karnataka: 080-2294 3000 | Tamil Nadu: 044-2844 8000</p>
        <p>Uttar Pradesh: 0522-262 5000 | West Bengal: 033-2212 0000</p>
      </div>
    `;
  }
};