// destal-premium-fixed.js
// Premium system with fixed button and working keys
(function() {
  // Configuration
  const config = {
    validKeys: {
      'FREE2023': { 
        name: 'Free Tier', 
        features: [],
        message: 'Free version activated'
      },
      'PRO2023': { 
        name: 'Pro Version', 
        features: ['themes', 'emojis'],
        message: 'Pro features unlocked!'
      },
      'ULTRA2023': { 
        name: 'Ultra Version', 
        features: ['themes', 'emojis', 'files', 'history', 'colors'],
        message: 'All premium features unlocked!'
      },
      'TEST2023': { 
        name: 'Test Mode', 
        features: ['themes', 'emojis', 'files', 'history', 'colors'],
        message: 'Developer test mode activated'
      }
    },
    
    features: {
      'themes': {
        name: 'Premium Themes',
        apply: function() {
          $('head').append(`
            <style>
              .premium-theme-matrix {
                --bg-color: #000000;
                --text-color: #00ff00;
                --card-bg: #121212;
                --border-color: #00ff00;
              }
              .premium-theme-ice {
                --bg-color: #f0f8ff;
                --text-color: #005588;
                --card-bg: #ffffff;
                --border-color: #005588;
              }
            </style>
          `);
          
          $('body').append(`
            <select class="premium-theme-selector" 
                    style="position:fixed; bottom:80px; right:20px; 
                           z-index:1000; padding:5px; border-radius:5px;">
              <option value="">Default Theme</option>
              <option value="premium-theme-matrix">Matrix</option>
              <option value="premium-theme-ice">Ice Blue</option>
            </select>
          `);
          
          $(document).on('change', '.premium-theme-selector', function() {
            $('body').removeClass('premium-theme-matrix premium-theme-ice');
            if ($(this).val()) {
              $('body').addClass($(this).val());
            }
          });
        }
      },
      'emojis': {
        name: 'Special Emojis',
        apply: function() {
          const emojis = ['🚀', '🎩', '👑', '💎', '✨', '⚡'];
          
          $('body').append(`
            <div class="premium-emoji-panel" 
                 style="display:none; position:fixed; bottom:130px; right:20px; 
                        background:rgba(255,255,255,0.9); padding:10px; 
                        border-radius:10px; z-index:1000;">
              ${emojis.map(e => `<span class="premium-emoji" 
                                   style="font-size:24px; cursor:pointer; 
                                          margin:5px;">${e}</span>`).join('')}
            </div>
          `);
          
          $(document).on('click', '.premium-emoji', function() {
            $('#messageText').val($('#messageText').val() + $(this).text());
          });
        }
      },
      'files': {
        name: 'Larger Files',
        apply: function() {
          $(document).on('change', '#fileInput', function() {
            const file = this.files[0];
            if (file && file.size > 100000000) {
              alert('File too large (max 100MB)');
              $(this).val('');
            }
          });
        }
      },
      'colors': {
        name: 'Colored Names',
        apply: function() {
          $('head').append(`
            <style>
              .premium-name {
                background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: bold;
              }
            </style>
          `);
          $('.message-author').addClass('premium-name');
        }
      }
    }
  };

  // Current activation status
  let activation = {
    active: false,
    key: null,
    tier: null,
    features: []
  };

  // Initialize system
  function init() {
    loadActivation();
    createUI();
    if (activation.active) applyFeatures();
  }

  function loadActivation() {
    const saved = localStorage.getItem('destal-premium');
    if (saved) {
      activation = JSON.parse(saved);
      console.log('Loaded premium activation:', activation);
    }
  }

  function saveActivation() {
    localStorage.setItem('destal-premium', JSON.stringify(activation));
  }

  function activate(key) {
    key = key.trim().toUpperCase();
    
    if (!config.validKeys[key]) {
      return {
        success: false,
        message: 'Invalid activation key'
      };
    }
    
    activation = {
      active: true,
      key: key,
      tier: config.validKeys[key].name,
      features: config.validKeys[key].features,
      message: config.validKeys[key].message
    };
    
    saveActivation();
    applyFeatures();
    
    return {
      success: true,
      message: activation.message
    };
  }

  function applyFeatures() {
    activation.features.forEach(feature => {
      if (config.features[feature] && config.features[feature].apply) {
        config.features[feature].apply();
      }
    });
    
    // Update button to show active tier
    $('.premium-floating-btn').html(`
      <i class="fas fa-crown"></i> ${activation.tier}
    `).css('background', 'rgba(0,180,0,0.7)');
  }

  function createUI() {
    // Floating button (fixed position)
    $('body').append(`
      <button class="premium-floating-btn" 
              style="position:fixed; bottom:20px; right:20px; 
                     width:60px; height:60px; border-radius:50%; 
                     background:rgba(255,215,0,0.7); border:none; 
                     color:white; font-size:24px; cursor:pointer;
                     z-index:9999; backdrop-filter:blur(2px);
                     box-shadow:0 2px 10px rgba(0,0,0,0.2);">
        <i class="fas fa-crown"></i>
      </button>
    `);
    
    // Activation modal
    $('body').append(`
      <div class="premium-modal" 
           style="display:none; position:fixed; top:0; left:0; 
                  width:100%; height:100%; background:rgba(0,0,0,0.8); 
                  z-index:10000; display:flex; justify-content:center; 
                  align-items:center;">
        <div style="background:#fff; padding:20px; border-radius:10px; 
                    max-width:400px; width:90%;">
          <h3 style="margin-top:0;"><i class="fas fa-crown"></i> Premium Activation</h3>
          <input type="text" class="premium-key-input" 
                 placeholder="Enter activation key" 
                 style="width:100%; padding:10px; margin:10px 0; border:1px solid #ddd;">
          <button class="premium-activate-btn" 
                  style="background:#4361ee; color:#fff; border:none; 
                         padding:10px 20px; border-radius:5px; cursor:pointer;">
            Activate
          </button>
          <div class="premium-activation-result" style="margin-top:10px;"></div>
          
          <div style="margin-top:20px; border-top:1px solid #eee; padding-top:10px;">
            <h4>Test Keys:</h4>
            <ul style="padding-left:20px;">
              <li><strong>FREE2023</strong> - Basic version</li>
              <li><strong>PRO2023</strong> - Pro features</li>
              <li><strong>ULTRA2023</strong> - All premium features</li>
            </ul>
          </div>
        </div>
      </div>
    `);
    
    // Load Font Awesome if needed
    if (!$('i.fas').length) {
      $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">');
    }
    
    // Event handlers
    $(document).on('click', '.premium-floating-btn', function() {
      $('.premium-modal').show();
    });
    
    $(document).on('click', '.premium-modal', function(e) {
      if ($(e.target).hasClass('premium-modal')) {
        $('.premium-modal').hide();
      }
    });
    
    $(document).on('click', '.premium-activate-btn', function() {
      const key = $('.premium-key-input').val();
      const result = activate(key);
      
      $('.premium-activation-result').html(`
        <div style="color:${result.success ? 'green' : 'red'};">
          ${result.message}
        </div>
      `);
      
      if (result.success) {
        setTimeout(() => {
          $('.premium-modal').hide();
          location.reload();
        }, 1500);
      }
    });
  }

  // Initialize when DOM is ready
  $(document).ready(function() {
    setTimeout(init, 500); // Small delay to ensure everything is loaded
  });

})();
