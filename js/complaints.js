// Complaints Module
window.Complaints = {
  // Generate complaint ID
  generateId: function() {
    return DataBase.getNextComplaintId();
  },
  
  // Create new complaint
  create: function(complaintData) {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) {
      window.showToast('Please login to file a complaint', 'warning');
      return false;
    }
    
    const complaint = {
      id: this.generateId(),
      userId: currentUser.email,
      name: complaintData.name,
      email: complaintData.email,
      phone: complaintData.phone,
      aadhaar: complaintData.aadhaar || '',
      crimeType: complaintData.crimeType,
      incidentDate: complaintData.incidentDate,
      amount: complaintData.amount || '0',
      description: complaintData.description,
      evidence: complaintData.evidence || '',
      localPolice: complaintData.localPolice,
      status: 'pending',
      assignedTo: 'Cyber Cell Unit',
      createdAt: new Date().toISOString(),
      updates: [{ 
        message: 'Complaint registered successfully. Awaiting review.', 
        timestamp: new Date().toISOString() 
      }]
    };
    
    DataBase.saveComplaint(complaint);
    window.showToast(`Complaint Filed! ID: ${complaint.id}`, 'success');
    return complaint;
  },
  
  // Get user complaints
  getUserComplaints: function(email) {
    return DataBase.getUserComplaints(email || Auth.getCurrentUser()?.email);
  },
  
  // Get complaint by ID
  getById: function(id) {
    return DataBase.findComplaintById(id);
  },
  
  // Update complaint status
  updateStatus: function(id, status, assignedTo, message) {
    const updates = {
      status: status,
      assignedTo: assignedTo,
      updatedAt: new Date().toISOString()
    };
    
    const complaint = DataBase.updateComplaint(id, updates);
    if (complaint && message) {
      complaint.updates.push({
        message: message,
        timestamp: new Date().toISOString()
      });
      DataBase.updateComplaint(id, { updates: complaint.updates });
    }
    
    return complaint;
  },
  
  // Add update to complaint
  addUpdate: function(id, message) {
    const complaint = this.getById(id);
    if (complaint) {
      complaint.updates.push({
        message: message,
        timestamp: new Date().toISOString()
      });
      DataBase.updateComplaint(id, { updates: complaint.updates });
      return true;
    }
    return false;
  },
  
  // Escalate to expert
  escalateToExpert: function(complaintId, expertName, message) {
    const complaint = this.getById(complaintId);
    if (!complaint) {
      window.showToast('Complaint ID not found', 'error');
      return false;
    }
    
    this.updateStatus(complaintId, 'cyber-cell', expertName, 
      `Escalated to Cyber Expert (${expertName}): ${message}`);
    window.showToast('Escalated to Cyber Expert successfully!', 'success');
    return true;
  },
  
  // Track complaint
  track: function(complaintId) {
    const complaint = this.getById(complaintId);
    if (!complaint) {
      return { found: false };
    }
    
    const statusText = {
      'pending': 'Pending Review',
      'investigating': 'Under Investigation',
      'resolved': 'Resolved',
      'cyber-cell': 'Cyber Cell Assigned'
    }[complaint.status] || 'Pending';
    
    const statusClass = {
      'pending': 'status-pending',
      'investigating': 'status-investigating',
      'resolved': 'status-resolved',
      'cyber-cell': 'status-cyber-cell'
    }[complaint.status] || 'status-pending';
    
    return {
      found: true,
      complaint: complaint,
      statusText: statusText,
      statusClass: statusClass
    };
  }
};

// Global complaint functions
window.submitComplaint = function() {
  const complaintData = {
    name: document.getElementById('compName').value,
    email: document.getElementById('compEmail').value,
    phone: document.getElementById('compPhone').value,
    aadhaar: document.getElementById('compAadhaar').value,
    crimeType: document.getElementById('compType').value,
    incidentDate: document.getElementById('compDate').value,
    amount: document.getElementById('compAmount').value,
    description: document.getElementById('compDescription').value,
    evidence: document.getElementById('compEvidence').value,
    localPolice: document.getElementById('compLocalPolice').value
  };
  
  // Validation
  if (!complaintData.name || !complaintData.email || !complaintData.phone || 
      !complaintData.crimeType || !complaintData.incidentDate || !complaintData.description) {
    window.showToast('Please fill all required fields', 'warning');
    return false;
  }
  
  const complaint = Complaints.create(complaintData);
  if (complaint) {
    document.getElementById('complaintForm').reset();
    window.navigateTo('track');
    document.getElementById('trackId').value = complaint.id;
    window.trackComplaint();
  }
};

window.trackComplaint = function() {
  const id = document.getElementById('trackId').value.trim();
  if (!id) {
    window.showToast('Please enter complaint ID', 'warning');
    return;
  }
  
  const result = Complaints.track(id);
  const trackResult = document.getElementById('trackResult');
  
  if (!result.found) {
    trackResult.innerHTML = '<div class="card" style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 12px;">Complaint not found. Please check the ID.</div>';
    return;
  }
  
  const complaint = result.complaint;
  trackResult.innerHTML = `
    <div class="card">
      <h4>Complaint ID: ${complaint.id}</h4>
      <p><strong>Status:</strong> <span class="complaint-status ${result.statusClass}">${result.statusText}</span></p>
      <p><strong>Crime Type:</strong> ${complaint.crimeType}</p>
      <p><strong>Filed On:</strong> ${new Date(complaint.createdAt).toLocaleString()}</p>
      <p><strong>Assigned To:</strong> ${complaint.assignedTo}</p>
      <p><strong>Description:</strong> ${complaint.description.substring(0, 200)}${complaint.description.length > 200 ? '...' : ''}</p>
      <div style="margin-top: 1rem;">
        <strong>Updates:</strong>
        ${complaint.updates.map(u => `<div style="font-size: 0.85rem; margin-top: 0.5rem; padding: 0.5rem; background: #f1f5f9; border-radius: 8px;">📌 ${u.message} - ${new Date(u.timestamp).toLocaleString()}</div>`).join('')}
      </div>
      ${complaint.amount && complaint.amount !== '0' ? `<p><strong>Amount Lost:</strong> ₹${parseInt(complaint.amount).toLocaleString()}</p>` : ''}
    </div>
  `;
};

window.escalateToExpert = function() {
  const refId = document.getElementById('expertRef').value;
  const message = document.getElementById('expertMessage').value;
  const expert = document.getElementById('cyberExpert').value;
  
  if (!refId || !message) {
    window.showToast('Please enter complaint ID and message', 'warning');
    return;
  }
  
  Complaints.escalateToExpert(refId, expert, message);
  document.getElementById('expertRef').value = '';
  document.getElementById('expertMessage').value = '';
};

window.emergencyResponse = function() {
  window.showToast('🚨 Emergency Alert Sent to CERT-In! Help is on the way.', 'warning');
  
  const currentUser = Auth.getCurrentUser();
  if (currentUser) {
    const emergencyComplaint = {
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      crimeType: 'emergency',
      incidentDate: new Date().toISOString().split('T')[0],
      description: 'EMERGENCY REPORT - Immediate attention required',
      evidence: '',
      localPolice: 'no'
    };
    
    const complaint = Complaints.create(emergencyComplaint);
    Complaints.updateStatus(complaint.id, 'investigating', 'CERT-In Emergency Team', 
      'EMERGENCY - CERT-In team has been notified. Immediate action initiated.');
  }
};