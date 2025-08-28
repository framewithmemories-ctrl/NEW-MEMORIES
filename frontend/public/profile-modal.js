// Helper function to generate photo upload button
function getPhotoUploadButton() {
  return `
    <button onclick="
      const profile = JSON.parse(localStorage.getItem('memoriesUserProfile') || '{}');
      if (!profile.profileComplete) {
        alert('❌ Please create your profile first to upload photos');
        switchTab('profile');
        return;
      }
      
      // Create file input for photo upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.onchange = function(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        // Process each file
        files.forEach((file, index) => {
          const reader = new FileReader();
          reader.onload = function(event) {
            const photoData = {
              id: 'photo_' + Date.now() + '_' + index,
              name: file.name,
              url: event.target.result,
              size: (file.size / 1024 / 1024).toFixed(2),
              type: file.type,
              dimensions: { width: 'Unknown', height: 'Unknown' },
              tags: ['uploaded'],
              notes: '',
              favorite: false,
              usageCount: 0,
              savedAt: new Date().toISOString()
            };
            
            // Save to profile photos
            const existingPhotos = JSON.parse(localStorage.getItem('memories_photos_' + profile.id) || '[]');
            existingPhotos.unshift(photoData);
            localStorage.setItem('memories_photos_' + profile.id, JSON.stringify(existingPhotos));
            
            // Update UI and refresh photos tab
            const photosTab = document.getElementById('tab-photos');
            if (photosTab) {
              photosTab.textContent = 'Photos (' + existingPhotos.length + ')';
            }
            
            console.log('✅ Photo uploaded successfully:', photoData);
          };
          reader.readAsDataURL(file);
        });
        
        alert('📸 Photos uploaded successfully to your profile!\\n\\nRefresh the Photos tab to see them.');
        // Auto refresh photos tab
        setTimeout(() => switchTab('photos'), 1000);
      };
      input.click();
    " style="
      background: linear-gradient(135deg, #9c27b0, #e1bee7);
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: 12px;
      font-weight: bold;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(156,39,176,0.3);
    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
      📸 Upload Your First Photo
    </button>
  `;
}

// Helper function to use photo for order
function usePhotoForOrder(photoId) {
  const profile = JSON.parse(localStorage.getItem('memoriesUserProfile') || '{}');
  const userPhotos = JSON.parse(localStorage.getItem(`memories_photos_${profile.id}`) || '[]');
  const photo = userPhotos.find(p => p.id === photoId);
  
  if (photo) {
    // Update usage count
    photo.usageCount = (photo.usageCount || 0) + 1;
    photo.lastUsed = new Date().toISOString();
    
    // Save updated photos
    localStorage.setItem(`memories_photos_${profile.id}`, JSON.stringify(userPhotos));
    
    // Close modal and scroll to customizer
    closeProfileModal();
    setTimeout(() => {
      const customizer = document.getElementById('customizer');
      if (customizer) {
        customizer.scrollIntoView({behavior: 'smooth'});
      }
    }, 300);
    
    alert(`✅ Using "${photo.name}" for your order!\\n\\nThe photo customizer will load with your selected image.`);
  }
}

// Helper function to delete photo
function deletePhoto(photoId) {
  if (!confirm('Are you sure you want to delete this photo from your collection?')) {
    return;
  }
  
  const profile = JSON.parse(localStorage.getItem('memoriesUserProfile') || '{}');
  let userPhotos = JSON.parse(localStorage.getItem(`memories_photos_${profile.id}`) || '[]');
  
  // Remove the photo
  userPhotos = userPhotos.filter(p => p.id !== photoId);
  localStorage.setItem(`memories_photos_${profile.id}`, JSON.stringify(userPhotos));
  
  // Update tab count
  const photosTab = document.getElementById('tab-photos');
  if (photosTab) {
    photosTab.textContent = 'Photos (' + userPhotos.length + ')';
  }
  
  // Refresh photos tab
  switchTab('photos');
  
  alert('📸 Photo deleted from your collection.');
}

function openProfileModal() {
  // Remove any existing modals
  const existing = document.querySelectorAll('.profile-modal-overlay');
  existing.forEach(modal => modal.remove());
  
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'profile-modal-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  `;
  
  // Create modal content
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white;
    border-radius: 16px;
    padding: 32px;
    max-width: 900px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    animation: slideIn 0.3s ease;
  `;
  
  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <h2 style="font-size: 28px; font-weight: bold; color: #1a202c; margin: 0; display: flex; align-items: center;">
        <span style="margin-right: 12px;">👤</span>
        Enhanced User Profile
      </h2>
      <button onclick="closeProfileModal()" style="
        background: #f7fafc;
        border: 2px solid #e2e8f0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #4a5568;
        transition: all 0.2s;
      " onmouseover="this.style.background='#edf2f7'" onmouseout="this.style.background='#f7fafc'">
        ×
      </button>
    </div>
    
    <!-- Tab Navigation -->
    <div style="border-bottom: 2px solid #e2e8f0; margin-bottom: 24px;">
      <div style="display: flex; gap: 24px;">
        <button onclick="switchTab('profile')" id="tab-profile" style="
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 3px solid #e91e63;
          color: #e91e63;
          font-weight: bold;
          font-size: 16px;
          transition: all 0.2s;
        ">Profile</button>
        <button onclick="switchTab('photos')" id="tab-photos" style="
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          color: #718096;
          font-size: 16px;
          transition: all 0.2s;
        ">Photos (0)</button>
        <button onclick="switchTab('wallet')" id="tab-wallet" style="
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          color: #718096;
          font-size: 16px;
          transition: all 0.2s;
        ">Wallet</button>
        <button onclick="switchTab('orders')" id="tab-orders" style="
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          color: #718096;
          font-size: 16px;
          transition: all 0.2s;
        ">Orders</button>
      </div>
    </div>
    
    <!-- Tab Content -->
    <div id="tab-content-area">
      <!-- Profile Content (Default) -->
      <div id="profile-content">
        <div style="
          background: linear-gradient(135deg, #e91e63 0%, #f06292 100%);
          padding: 32px;
          border-radius: 16px;
          margin-bottom: 32px;
          color: white;
          position: relative;
          overflow: hidden;
        ">
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
            <div style="
              width: 80px;
              height: 80px;
              background: rgba(255,255,255,0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
              font-weight: bold;
              backdrop-filter: blur(10px);
            ">U</div>
            <div>
              <h3 style="margin: 0; font-size: 24px; font-weight: bold;">Welcome to Memories!</h3>
              <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 16px;">Create your profile to unlock all premium features</p>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px;">
            <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px; text-align: center; backdrop-filter: blur(10px);">
              <div style="font-size: 24px; margin-bottom: 8px;">📸</div>
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">Photo Storage</div>
              <div style="font-size: 12px; opacity: 0.9;">Save & reuse photos</div>
            </div>
            <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px; text-align: center; backdrop-filter: blur(10px);">
              <div style="font-size: 24px; margin-bottom: 8px;">💰</div>
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">Digital Wallet</div>
              <div style="font-size: 12px; opacity: 0.9;">Secure payments</div>
            </div>
            <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px; text-align: center; backdrop-filter: blur(10px);">
              <div style="font-size: 24px; margin-bottom: 8px;">⭐</div>
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">Rewards</div>
              <div style="font-size: 12px; opacity: 0.9;">Earn points</div>
            </div>
            <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px; text-align: center; backdrop-filter: blur(10px);">
              <div style="font-size: 24px; margin-bottom: 8px;">📦</div>
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">Order History</div>
              <div style="font-size: 12px; opacity: 0.9;">Track orders</div>
            </div>
          </div>
        </div>
        
        <form style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 14px;">Full Name</label>
            <input type="text" placeholder="Enter your full name" style="
              width: 100%;
              padding: 14px 16px;
              border: 2px solid #e2e8f0;
              border-radius: 10px;
              font-size: 16px;
              transition: all 0.2s;
              box-sizing: border-box;
            " onfocus="this.style.borderColor='#e91e63'; this.style.boxShadow='0 0 0 3px rgba(233,30,99,0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 14px;">Email Address</label>
            <input type="email" placeholder="your@email.com" style="
              width: 100%;
              padding: 14px 16px;
              border: 2px solid #e2e8f0;
              border-radius: 10px;
              font-size: 16px;
              transition: all 0.2s;
              box-sizing: border-box;
            " onfocus="this.style.borderColor='#e91e63'; this.style.boxShadow='0 0 0 3px rgba(233,30,99,0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 14px;">Phone Number</label>
            <input type="tel" placeholder="+91 xxxxx xxxxx" style="
              width: 100%;
              padding: 14px 16px;
              border: 2px solid #e2e8f0;
              border-radius: 10px;
              font-size: 16px;
              transition: all 0.2s;
              box-sizing: border-box;
            " onfocus="this.style.borderColor='#e91e63'; this.style.boxShadow='0 0 0 3px rgba(233,30,99,0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 14px;">City</label>
            <input type="text" placeholder="Coimbatore" style="
              width: 100%;
              padding: 14px 16px;
              border: 2px solid #e2e8f0;
              border-radius: 10px;
              font-size: 16px;
              transition: all 0.2s;
              box-sizing: border-box;
            " onfocus="this.style.borderColor='#e91e63'; this.style.boxShadow='0 0 0 3px rgba(233,30,99,0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
          </div>
        </form>
        
        <button onclick="createProfile()" style="
          margin-top: 28px;
          background: linear-gradient(135deg, #e91e63 0%, #f06292 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
          width: 100%;
          box-shadow: 0 4px 15px rgba(233,30,99,0.3);
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(233,30,99,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(233,30,99,0.3)'">
          🎉 Create Profile & Unlock All Features
        </button>
      </div>
    </div>
  `;
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: scale(0.95) translateY(-20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeProfileModal() {
  const overlay = document.querySelector('.profile-modal-overlay');
  if (overlay) {
    overlay.style.animation = 'fadeIn 0.2s ease reverse';
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = 'auto';
    }, 200);
  }
}

function switchTab(tabName) {
  // Reset all tabs
  ['profile', 'photos', 'wallet', 'orders'].forEach(tab => {
    const tabElement = document.getElementById(`tab-${tab}`);
    if (tabElement) {
      tabElement.style.borderBottomColor = 'transparent';
      tabElement.style.color = '#718096';
      tabElement.style.fontWeight = 'normal';
    }
  });
  
  // Activate selected tab
  const activeTab = document.getElementById(`tab-${tabName}`);
  if (activeTab) {
    activeTab.style.borderBottomColor = '#e91e63';
    activeTab.style.color = '#e91e63';
    activeTab.style.fontWeight = 'bold';
  }
  
  const contentArea = document.getElementById('tab-content-area');
  if (!contentArea) {
    console.error('Tab content area not found');
    return;
  }
  
  if (tabName === 'photos') {
    // Check if user has profile and get their photos
    const profile = JSON.parse(localStorage.getItem('memoriesUserProfile') || '{}');
    const userPhotos = profile.id ? JSON.parse(localStorage.getItem(`memories_photos_${profile.id}`) || '[]') : [];
    
    if (userPhotos.length === 0) {
      contentArea.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #9c27b0, #e1bee7); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 32px; font-size: 48px; box-shadow: 0 8px 32px rgba(156,39,176,0.3);">📸</div>
          <h3 style="margin-bottom: 16px; color: #1a202c; font-size: 28px; font-weight: bold;">Photo Storage System</h3>
          <p style="color: #4a5568; margin-bottom: 32px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.7; font-size: 16px;">Save photos to your profile with smart organization. Add tags, mark favorites, and reuse them for future orders with one click.</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #f7fafc, #edf2f7); padding: 24px; border-radius: 16px; border: 2px solid #e2e8f0; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">⚡</div>
              <div style="font-weight: bold; margin-bottom: 8px; color: #2d3748; font-size: 16px;">Smart Upload</div>
              <div style="color: #718096; font-size: 14px; line-height: 1.5;">Drag & drop with instant preview and quality analysis</div>
            </div>
            <div style="background: linear-gradient(135deg, #f7fafc, #edf2f7); padding: 24px; border-radius: 16px; border: 2px solid #e2e8f0; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🏷️</div>
              <div style="font-weight: bold; margin-bottom: 8px; color: #2d3748; font-size: 16px;">Tags & Search</div>
              <div style="color: #718096; font-size: 14px; line-height: 1.5;">Organize with custom tags and powerful search</div>
            </div>
            <div style="background: linear-gradient(135deg, #f7fafc, #edf2f7); padding: 24px; border-radius: 16px; border: 2px solid #e2e8f0; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">❤️</div>
              <div style="font-weight: bold; margin-bottom: 8px; color: #2d3748; font-size: 16px;">Favorites</div>
              <div style="color: #718096; font-size: 14px; line-height: 1.5;">Mark favorites for quick access and reuse</div>
            </div>
          </div>
          
          ${getPhotoUploadButton()}
        </div>
      `;
    } else {
      // Show photo gallery
      const photoGrid = userPhotos.map(photo => `
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <img src="${photo.url}" alt="${photo.name}" style="width: 100%; height: 200px; object-fit: cover;">
          <div style="padding: 16px;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #1a202c; font-size: 14px;">${photo.name}</div>
            <div style="color: #718096; font-size: 12px; margin-bottom: 8px;">Size: ${photo.size}MB • ${new Date(photo.savedAt).toLocaleDateString()}</div>
            <div style="display: flex; gap: 8px;">
              <button onclick="usePhotoForOrder('${photo.id}')" style="flex: 1; background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">Use</button>
              <button onclick="deletePhoto('${photo.id}')" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">Delete</button>
            </div>
          </div>
        </div>
      `).join('');
      
      contentArea.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h3 style="color: #1a202c; font-size: 24px; font-weight: bold; margin: 0;">Your Photo Collection (${userPhotos.length})</h3>
            ${getPhotoUploadButton().replace('Upload Your First Photo', 'Add More Photos')}
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
            ${photoGrid}
          </div>
        </div>
      `;
    }
  } else if (tabName === 'wallet') {
    contentArea.innerHTML = `
      <div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-bottom: 40px;">
          <div style="background: linear-gradient(135deg, #4caf50, #81c784); padding: 28px; border-radius: 20px; text-align: center; color: white; box-shadow: 0 8px 32px rgba(76,175,80,0.3); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -20px; right: -20px; font-size: 60px; opacity: 0.2;">💰</div>
            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px; position: relative;">₹0.00</div>
            <div style="opacity: 0.95; font-size: 16px; font-weight: 500; position: relative;">Wallet Balance</div>
          </div>
          <div style="background: linear-gradient(135deg, #ff9800, #ffb74d); padding: 28px; border-radius: 20px; text-align: center; color: white; box-shadow: 0 8px 32px rgba(255,152,0,0.3); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -20px; right: -20px; font-size: 60px; opacity: 0.2;">⭐</div>
            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px; position: relative;">0</div>
            <div style="opacity: 0.95; font-size: 16px; font-weight: 500; position: relative;">Reward Points</div>
          </div>
          <div style="background: linear-gradient(135deg, #9c27b0, #ba68c8); padding: 28px; border-radius: 20px; text-align: center; color: white; box-shadow: 0 8px 32px rgba(156,39,176,0.3); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -20px; right: -20px; font-size: 60px; opacity: 0.2;">🎁</div>
            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px; position: relative;">₹0.00</div>
            <div style="opacity: 0.95; font-size: 16px; font-weight: 500; position: relative;">Store Credits</div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
          <button onclick="alert('💳 Add Money: Securely add money to your wallet via UPI, cards, or net banking')" style="
            background: linear-gradient(135deg, #4caf50, #66bb6a);
            color: white;
            border: none;
            padding: 18px;
            border-radius: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(76,175,80,0.3);
          " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(76,175,80,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(76,175,80,0.3)'">
            💳 Add Money
          </button>
          <button onclick="alert('⭐ Convert Points: 100 points = ₹10 store credit. Earn points with every purchase!')" style="
            background: linear-gradient(135deg, #ff9800, #ffb74d);
            color: white;
            border: none;
            padding: 18px;
            border-radius: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(255,152,0,0.3);
          " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(255,152,0,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(255,152,0,0.3)'">
            ⭐ Convert Points
          </button>
          <button onclick="alert('📊 Transaction History: View all your wallet activities, payments, and refunds')" style="
            background: linear-gradient(135deg, #2196f3, #42a5f5);
            color: white;
            border: none;
            padding: 18px;
            border-radius: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(33,150,243,0.3);
          " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(33,150,243,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(33,150,243,0.3)'">
            📊 View History
          </button>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 32px; border-radius: 20px; text-align: center; border: 2px solid #e2e8f0;">
          <div style="font-size: 48px; margin-bottom: 16px;">💎</div>
          <h4 style="margin: 0 0 16px 0; color: #1a202c; font-size: 22px; font-weight: bold;">Premium Digital Wallet</h4>
          <p style="color: #4a5568; margin: 0; line-height: 1.6; font-size: 16px; max-width: 500px; margin: 0 auto;">
            Secure payments • Reward system • Transaction history • Auto-refunds • Tier benefits • 24/7 support
          </p>
        </div>
      </div>
    `;
  } else if (tabName === 'orders') {
    contentArea.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #e91e63, #f48fb1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 32px; font-size: 48px; box-shadow: 0 8px 32px rgba(233,30,99,0.3);">📦</div>
        <h3 style="margin-bottom: 16px; color: #1a202c; font-size: 28px; font-weight: bold;">Order History & Tracking</h3>
        <p style="color: #4a5568; margin-bottom: 40px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.7; font-size: 16px;">Track your orders, reorder favorites, and manage delivery preferences all in one place.</p>
        
        <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 40px; border-radius: 20px; margin-bottom: 32px; border: 2px dashed #e91e63;">
          <div style="font-size: 64px; margin-bottom: 20px;">🛍️</div>
          <div style="font-weight: bold; color: #1a202c; margin-bottom: 12px; font-size: 20px;">Ready to Start Your First Order?</div>
          <div style="color: #4a5568; margin-bottom: 24px; line-height: 1.6;">Create beautiful memories with our premium custom photo frames and personalized gifts</div>
          <button onclick="closeProfileModal(); setTimeout(() => document.getElementById('customizer')?.scrollIntoView({behavior: 'smooth'}), 300);" style="
            background: linear-gradient(135deg, #e91e63, #f48fb1);
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 18px;
            box-shadow: 0 4px 15px rgba(233,30,99,0.3);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(233,30,99,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(233,30,99,0.3)'">
            🎨 Start Creating Now
          </button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
          <div style="background: white; padding: 20px; border-radius: 16px; border: 2px solid #e2e8f0; text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">🚚</div>
            <div style="font-weight: bold; color: #1a202c; margin-bottom: 4px;">Order Tracking</div>
            <div style="color: #718096; font-size: 14px;">Real-time updates</div>
          </div>
          <div style="background: white; padding: 20px; border-radius: 16px; border: 2px solid #e2e8f0; text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">🔄</div>
            <div style="font-weight: bold; color: #1a202c; margin-bottom: 4px;">Quick Reorder</div>
            <div style="color: #718096; font-size: 14px;">One-click repeat</div>
          </div>
          <div style="background: white; padding: 20px; border-radius: 16px; border: 2px solid #e2e8f0; text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">📋</div>
            <div style="font-weight: bold; color: #1a202c; margin-bottom: 4px;">Order History</div>
            <div style="color: #718096; font-size: 14px;">Complete records</div>
          </div>
        </div>
      </div>
    `;
  } else {
    // Default to profile content - safely get the profile content
    const profileContent = document.getElementById('profile-content');
    if (profileContent && contentArea) {
      contentArea.innerHTML = profileContent.innerHTML;
    } else {
      // Fallback profile content
      contentArea.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <h3 style="color: #1a202c; margin-bottom: 16px;">👤 Profile Tab</h3>
          <p style="color: #4a5568;">Create your profile to access all features</p>
        </div>
      `;
    }
  }
}

function createProfile() {
  // Get form values
  const inputs = document.querySelectorAll('#profile-content input');
  const name = inputs[0]?.value || '';
  const email = inputs[1]?.value || '';
  const phone = inputs[2]?.value || '';
  const city = inputs[3]?.value || '';
  
  // Validate required fields
  if (!name.trim()) {
    alert('❌ Please enter your name');
    return;
  }
  
  if (!email.trim() || !email.includes('@')) {
    alert('❌ Please enter a valid email address');
    return;
  }
  
  // Create user profile object
  const userProfile = {
    id: 'user_' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    city: city.trim(),
    createdAt: new Date().toISOString(),
    profileComplete: true
  };
  
  // Save to localStorage
  try {
    localStorage.setItem('memoriesUserProfile', JSON.stringify(userProfile));
    localStorage.setItem('memoriesUser', JSON.stringify(userProfile));
    
    // Also initialize empty photo storage and wallet
    localStorage.setItem(`memories_photos_${userProfile.id}`, JSON.stringify([]));
    localStorage.setItem(`memories_wallet_${userProfile.id}`, JSON.stringify({
      balance: 0,
      rewardPoints: 0,
      storeCredits: 0,
      tier: 'Silver',
      totalSpent: 0,
      createdAt: new Date().toISOString()
    }));
    localStorage.setItem(`memories_transactions_${userProfile.id}`, JSON.stringify([]));
    
    // Update the modal to show success
    const contentArea = document.getElementById('tab-content-area');
    if (contentArea) {
      contentArea.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #4caf50, #81c784); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 48px; animation: pulse 2s infinite;">🎉</div>
          <h3 style="color: #1a202c; font-size: 28px; font-weight: bold; margin-bottom: 16px;">Profile Created Successfully!</h3>
          <p style="color: #4a5568; margin-bottom: 24px; line-height: 1.6;">Welcome to Memories, <strong>${name}</strong>!<br/>All premium features are now unlocked.</p>
          
          <div style="background: linear-gradient(135deg, #e8f5e8, #f1f8e9); padding: 24px; border-radius: 16px; margin-bottom: 24px; border: 2px solid #4caf50;">
            <h4 style="color: #2e7d32; margin: 0 0 12px 0; font-weight: bold;">✅ Features Now Available:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; text-align: left;">
              <div>📸 Photo Storage & Organization</div>
              <div>💰 Digital Wallet & Payments</div>
              <div>⭐ Reward Points System</div>
              <div>📦 Order History & Tracking</div>
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <button onclick="switchTab('photos')" style="
              background: linear-gradient(135deg, #9c27b0, #ba68c8);
              color: white;
              border: none;
              padding: 14px 24px;
              border-radius: 10px;
              font-weight: bold;
              cursor: pointer;
              font-size: 16px;
              transition: all 0.2s;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
              📸 Go to Photo Storage
            </button>
            <button onclick="closeProfileModal(); setTimeout(() => { const customizer = document.getElementById('customizer'); if (customizer) customizer.scrollIntoView({behavior: 'smooth'}); }, 300);" style="
              background: linear-gradient(135deg, #e91e63, #f48fb1);
              color: white;
              border: none;
              padding: 14px 24px;
              border-radius: 10px;
              font-weight: bold;
              cursor: pointer;
              font-size: 16px;
              transition: all 0.2s;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
              🎨 Start Creating Frames
            </button>
          </div>
        </div>
      `;
      
      // Add pulse animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Update tabs to show photo count (now that profile exists)
    const photosTab = document.getElementById('tab-photos');
    if (photosTab) {
      photosTab.textContent = 'Photos (0)';
    }
    
    console.log('✅ Profile created successfully:', userProfile);
    
  } catch (error) {
    console.error('Error creating profile:', error);
    alert('❌ Error creating profile. Please try again.');
  }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeProfileModal();
  }
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('profile-modal-overlay')) {
    closeProfileModal();
  }
});