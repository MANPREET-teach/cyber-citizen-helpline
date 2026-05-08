// Database Management Module
window.DataBase = {
  // Storage keys
  keys: {
    USERS: 'cyberUsers',
    COMPLAINTS: 'cyberComplaints',
    CURRENT_USER: 'currentUser',
    COMPLAINT_COUNTER: 'complaintIdCounter'
  },

  // Initialize database
  init: function() {
    if (!localStorage.getItem(this.keys.USERS)) {
      localStorage.setItem(this.keys.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.keys.COMPLAINTS)) {
      localStorage.setItem(this.keys.COMPLAINTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.keys.COMPLAINT_COUNTER)) {
      localStorage.setItem(this.keys.COMPLAINT_COUNTER, '1000');
    }
  },

  // User methods
  getUsers: function() {
    return JSON.parse(localStorage.getItem(this.keys.USERS) || '[]');
  },

  saveUser: function(user) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.keys.USERS, JSON.stringify(users));
  },

  findUser: function(email, password) {
    const users = this.getUsers();
    return users.find(u => u.email === email && u.password === password);
  },

  findUserByEmail: function(email) {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  },

  // Complaint methods
  getComplaints: function() {
    return JSON.parse(localStorage.getItem(this.keys.COMPLAINTS) || '[]');
  },

  saveComplaint: function(complaint) {
    const complaints = this.getComplaints();
    complaints.unshift(complaint);
    localStorage.setItem(this.keys.COMPLAINTS, JSON.stringify(complaints));
  },

  updateComplaint: function(complaintId, updates) {
    const complaints = this.getComplaints();
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
      complaints[index] = { ...complaints[index], ...updates };
      localStorage.setItem(this.keys.COMPLAINTS, JSON.stringify(complaints));
      return complaints[index];
    }
    return null;
  },

  findComplaintById: function(id) {
    const complaints = this.getComplaints();
    return complaints.find(c => c.id === id);
  },

  getUserComplaints: function(email) {
    const complaints = this.getComplaints();
    return complaints.filter(c => c.email === email);
  },

  // Counter methods
  getNextComplaintId: function() {
    let counter = parseInt(localStorage.getItem(this.keys.COMPLAINT_COUNTER) || '1000');
    counter++;
    localStorage.setItem(this.keys.COMPLAINT_COUNTER, counter);
    return `CYT-${new Date().getFullYear()}-${counter}`;
  },

  // Session methods
  getCurrentUser: function() {
    return JSON.parse(localStorage.getItem(this.keys.CURRENT_USER) || 'null');
  },

  setCurrentUser: function(user) {
    localStorage.setItem(this.keys.CURRENT_USER, JSON.stringify(user));
  },

  clearCurrentUser: function() {
    localStorage.removeItem(this.keys.CURRENT_USER);
  },

  // Statistics
  getStats: function(email) {
    const userComplaints = this.getUserComplaints(email);
    return {
      total: userComplaints.length,
      active: userComplaints.filter(c => c.status === 'pending' || c.status === 'investigating').length,
      resolved: userComplaints.filter(c => c.status === 'resolved').length
    };
  }
};

// Initialize database
DataBase.init();