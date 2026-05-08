// Main Application Entry Point
(function() {
  // Initialize toast container
  function createToastContainer() {
    if (!document.getElementById('toastContainer')) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }
  }
  
  // Global showToast function
  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    if (type === 'success') toast.style.borderLeftColor = '#059669';
    if (type === 'error') toast.style.borderLeftColor = '#dc2626';
    if (type === 'warning') toast.style.borderLeftColor = '#f97316';
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };
  
  // Setup event listeners
  function setupEventListeners() {
    // Auth button
    const authBtn = document.getElementById('authButton');
    if (authBtn) {
      authBtn.onclick = () => document.getElementById('authModal').classList.add('show');
    }
    
    // User info for logout
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      userInfo.onclick = () => {
        if (confirm('Are you sure you want to logout?')) {
          window.logout();
        }
      };
    }
    
    // Complaint form submission
    const complaintForm = document.getElementById('complaintForm');
    if (complaintForm) {
      complaintForm.onsubmit = (e) => {
        e.preventDefault();
        window.submitComplaint();
      };
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      };
    }
    
    // Navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.onclick = (e) => {
        e.preventDefault();
        window.navigateTo(link.dataset.page);
      };
    });
  }
  
  // Load initial data
  function loadInitialData() {
    if (window.Dashboard) {
      window.Dashboard.loadCyberAlerts();
      window.Dashboard.loadCrimeStats();
      if (Auth.isLoggedIn()) {
        window.Dashboard.updateStats();
        window.Dashboard.loadRecentComplaints();
      }
    }
    
    if (window.Tools) {
      window.Tools.loadSecurityTips();
      // Generate initial password
      const initialPass = window.Tools.generatePassword(16);
      const genPassword = document.getElementById('genPassword');
      if (genPassword) genPassword.textContent = initialPass;
    }
    
    if (window.loadCyberCellInfo) {
      window.loadCyberCellInfo();
    }
  }
  
  // Initialize application
  function init() {
    createToastContainer();
    setupEventListeners();
    Auth.updateUI();
    loadInitialData();
    
    // Show welcome message
    setTimeout(() => {
      if (!Auth.isLoggedIn()) {
        window.showToast('Welcome to CyberShield! Please login to file complaints.', 'info');
      } else {
        window.showToast(`Welcome back, ${Auth.getCurrentUser().name}!`, 'success');
      }
    }, 500);
    
    // Hide loading page after content loads
    hideLoadingPage();
  }
  
  // Hide loading page with fade out effect
  function hideLoadingPage() {
    // Simulate loading time for better UX
    setTimeout(() => {
      const loadingPage = document.getElementById('loadingPage');
      if (loadingPage) {
        loadingPage.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
          loadingPage.style.display = 'none';
        }, 500);
      }
    }, 2000);
  }
  
  // Start the application
  init();
})();