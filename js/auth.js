// Authentication Module
window.Auth = {
  // Register new user
  register: function(name, email, phone, password, confirmPassword) {
    // Validation
    if (!name || !email || !phone || !password) {
      window.showToast('Please fill all fields', 'warning');
      return false;
    }
    
    if (password !== confirmPassword) {
      window.showToast('Passwords do not match', 'error');
      return false;
    }
    
    if (password.length < 8) {
      window.showToast('Password must be at least 8 characters', 'warning');
      return false;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      window.showToast('Invalid email format', 'error');
      return false;
    }
    
    if (!phone.match(/^[0-9]{10}$/)) {
      window.showToast('Please enter valid 10-digit mobile number', 'error');
      return false;
    }
    
    // Check if user already exists
    if (DataBase.findUserByEmail(email)) {
      window.showToast('Email already registered!', 'error');
      return false;
    }
    
    // Create new user
    const newUser = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: 'citizen',
      createdAt: new Date().toISOString(),
      verified: true
    };
    
    DataBase.saveUser(newUser);
    window.showToast('Registration successful! Please login.', 'success');
    return true;
  },
  
  // Login user
  login: function(email, password) {
    if (!email || !password) {
      window.showToast('Please enter email and password', 'warning');
      return false;
    }
    
    const user = DataBase.findUser(email, password);
    if (user) {
      DataBase.setCurrentUser(user);
      window.showToast(`Welcome back, ${user.name}!`, 'success');
      return true;
    } else {
      window.showToast('Invalid credentials! Please try again.', 'error');
      return false;
    }
  },
  
  // Logout user
  logout: function() {
    DataBase.clearCurrentUser();
    window.showToast('Logged out successfully', 'success');
    window.location.reload();
  },
  
  // Get current user
  getCurrentUser: function() {
    return DataBase.getCurrentUser();
  },
  
  // Check if user is logged in
  isLoggedIn: function() {
    return DataBase.getCurrentUser() !== null;
  },
  
  // Update UI based on auth state
  updateUI: function() {
    const currentUser = this.getCurrentUser();
    const authButton = document.getElementById('authButton');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
      if (authButton) authButton.style.display = 'none';
      if (userInfo) userInfo.style.display = 'flex';
      if (userName) userName.textContent = currentUser.name.split(' ')[0];
    } else {
      if (authButton) authButton.style.display = 'inline-block';
      if (userInfo) userInfo.style.display = 'none';
    }
  }
};

// Global auth functions for HTML onclick
window.loginUser = function() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (Auth.login(email, password)) {
    document.getElementById('authModal').classList.remove('show');
    Auth.updateUI();
    window.Dashboard.updateStats();
    window.navigateTo('dashboard');
  }
};

window.registerUser = function() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const phone = document.getElementById('regPhone').value;
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  
  if (Auth.register(name, email, phone, password, confirm)) {
    window.showLogin();
  }
};

window.showRegister = function() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('authTitle').textContent = 'Register on CyberShield';
};

window.showLogin = function() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('authTitle').textContent = 'Login to CyberShield';
};

window.logout = function() {
  Auth.logout();
};