// Security Tools Module
window.Tools = {
  // Generate secure password
  generatePassword: function(length = 16) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = uppercase + lowercase + numbers + symbols;
    
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  },
  
  // Check password strength
  checkStrength: function(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else feedback.push('Use at least 8 characters');
    
    if (/[A-Z]/.test(password)) score += 20;
    else feedback.push('Add uppercase letters');
    
    if (/[a-z]/.test(password)) score += 20;
    else feedback.push('Add lowercase letters');
    
    if (/[0-9]/.test(password)) score += 20;
    else feedback.push('Add numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    else feedback.push('Add special characters');
    
    let strength = 'weak';
    if (score >= 90) strength = 'very-strong';
    else if (score >= 70) strength = 'strong';
    else if (score >= 50) strength = 'medium';
    
    return { score, strength, feedback };
  },
  
  // Check URL safety
  checkURL: function(url) {
    const urlLower = url.toLowerCase();
    let score = 0;
    let threats = [];
    
    // Check for IP address
    if (urlLower.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
      score += 30;
      threats.push('IP address detected instead of domain name');
    }
    
    // Check for suspicious keywords
    const suspicious = ['-secure', '-login', '-verify', '-account', 'security-update'];
    if (suspicious.some(keyword => urlLower.includes(keyword))) {
      score += 25;
      threats.push('Suspicious keywords in URL');
    }
    
    // Check for suspicious TLDs
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.xyz', '.top', '.click', '.download', '.work'];
    if (suspiciousTLDs.some(tld => urlLower.endsWith(tld))) {
      score += 35;
      threats.push('Suspicious TLD detected');
    }
    
    // Check for brand impersonation
    const brands = ['paypal', 'google', 'facebook', 'amazon', 'microsoft', 'apple', 'bank'];
    if (brands.some(brand => urlLower.includes(brand) && !urlLower.includes(brand + '.com'))) {
      score += 40;
      threats.push('Possible brand impersonation');
    }
    
    const isSafe = score < 40;
    const riskLevel = score >= 70 ? 'danger' : score >= 40 ? 'warning' : 'safe';
    
    return {
      url,
      isSafe,
      riskLevel,
      score,
      threats: threats.length > 0 ? threats : ['No threats detected'],
      recommendation: isSafe ? 'This URL appears safe to visit.' : 'Do NOT visit this URL. Report immediately.'
    };
  },
  
  // Load security tips
  loadSecurityTips: function() {
    const tips = [
      '🔐 Use unique passwords for each account',
      '📱 Enable 2FA wherever possible',
      '🔄 Keep software and apps updated',
      '⚠️ Don\'t click suspicious links or attachments',
      '💾 Regularly backup important data',
      '🔒 Use a password manager',
      '🌐 Check URLs before clicking',
      '📧 Verify email senders before responding',
      '🛡️ Install antivirus software',
      '📱 Don\'t share OTPs with anyone'
    ];
    
    const container = document.getElementById('securityTips');
    if (container) {
      container.innerHTML = `
        <ul style="list-style: none;">
          ${tips.map(tip => `<li style="margin-bottom: 0.75rem;"><i class="fas fa-check-circle" style="color: var(--success); margin-right: 0.5rem;"></i> ${tip}</li>`).join('')}
        </ul>
      `;
    }
  }
};

// Global tool functions
window.generateSecurePassword = function() {
  const password = Tools.generatePassword(16);
  const display = document.getElementById('genPassword');
  if (display) {
    display.textContent = password;
    window.showToast('Secure password generated!', 'success');
  }
};

window.copyPassword = function() {
  const pass = document.getElementById('genPassword')?.textContent;
  if (pass && pass !== 'Click Generate') {
    navigator.clipboard.writeText(pass);
    window.showToast('Password copied!', 'success');
  } else {
    window.showToast('Generate a password first', 'warning');
  }
};

window.checkURLSafety = function() {
  const url = document.getElementById('urlCheck')?.value.trim();
  if (!url) {
    window.showToast('Enter a URL', 'warning');
    return;
  }
  
  const result = Tools.checkURL(url);
  const resultDiv = document.getElementById('urlResult');
  
  if (resultDiv) {
    resultDiv.innerHTML = `
      <div class="threat-level ${result.riskLevel}" style="padding: 0.5rem; border-radius: 8px; margin-bottom: 0.5rem; text-align: center; font-weight: 600;">
        ${result.isSafe ? '✅ SAFE' : '⚠️ THREAT DETECTED'}
      </div>
      <div><strong>Risk Score:</strong> ${result.score}/100</div>
      <div><strong>Threats Found:</strong></div>
      <ul>${result.threats.map(t => `<li>${t}</li>`).join('')}</ul>
      <div><strong>Recommendation:</strong> ${result.recommendation}</div>
    `;
    
    if (!result.isSafe) {
      window.showToast('⚠️ Suspicious URL detected!', 'warning');
    } else {
      window.showToast('URL appears safe', 'success');
    }
  }
};