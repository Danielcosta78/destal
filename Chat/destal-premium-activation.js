// destal-premium-enhanced.js
// Enhanced premium system with top-positioned elements
(function() {
  // Configuration
  const config = {
    validKeys: {
      'FREE2023': { 
        features: [],
        message: 'Free version activated'
      },
      'PRO2023': { 
        features: ['themes', 'emojis'],
        message: 'Pro features unlocked!'
      },
      'ULTRA2023': { 
        features: ['themes', 'emojis', 'files', 'colors'],
        message: 'All premium features unlocked!'
      }
    },
    
    features: {
      'themes': {
        name: 'Premium Themes',
        apply: function() {
          // Add premium themes CSS
          $('head').append(`
            <style>
              .premium-theme-matrix {
                --bg-color: #000000;
                --text-color: #00ff00;
                --card-bg: #121212;
                --border-color: #00ff00;
              }
              .premium-theme-ocean {
                --bg-color: #001f3f;
                --text-color: #7FDBFF;
                --card-bg: #003366;
                --border-color: #39CCCC;
              }
              .premium-theme-sunset {
                --bg-color: #FF4136;
                --text-color: #FFDC00;
                --card-bg: #FF851B;
                --border-color: #F012BE;
              }
            </style>
          `);
          
          // Add theme selector to top right
          $('.navbar').append(`
            <div class="premium-theme-container" style="margin-left:auto; margin-right:10px;">
              <select class="premium-theme-selector form-control form-control-sm">
                <option value="">Default Theme</option>
                <option value="premium-theme-matrix">Matrix</option>
                <option value="premium-theme-ocean">Ocean</option>
                <option value="premium-theme-sunset">Sunset</option>
              </select>
            </div>
          `);
          
          $(document).on('change', '.premium-theme-selector', function() {
            $('body').removeClass('premium-theme-matrix premium-theme-ocean premium-theme-sunset');
            if ($(this).val()) {
              $('body').addClass($(this).val());
            }
          });
        }
      },
      'emojis': {
        name: 'Special Emojis',
        apply: function() {
          const emojis = ['😎', '🚀', '🌟', '🎩', '👑', '💎', '⚡', '🔥', '🌈'];
          
          // Add emoji picker button to top bar
          $('.navbar').append(`
            <button class="premium-emoji-btn btn btn-sm btn-light ml-2">
              <i class="far fa-smile"></i>
            </button>
            
            <div class="premium-emoji-panel" 
                 style="display:none; position:absolute; right:10px; top:50px; 
                        background:white; padding:10px; border-radius:5px; 
                        box-shadow:0 2px 10px rgba(0,0,0,0.2); z-index:1000;">
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:5px;">
                ${emojis.map(e => `
                  <span class="premium-emoji" style="font-size:20px; cursor:pointer;">${e}</span>
                `).join('')}
              </div>
            </div>
          `);
          
          // Toggle emoji panel
          $(document).on('click', '.premium-emoji-btn', function(e) {
            e.stopPropagation();
            $('.premium-emoji-panel').toggle();
          });
          
          // Insert emoji on click
          $(document).on('click', '.premium-emoji', function() {
            const currentText = $('#messageText').val();
            $('#messageText').val(currentText + $(this).text());
            $('.premium-emoji-panel').hide();
          });
          
          // Close when clicking elsewhere
          $(document).on('click', function() {
            $('.premium-emoji-panel').hide();
          });
        }
      },
      'files': {
        name: 'Larger Files',
        apply: function() {
          $(document).on('change', '#fileInput', function() {
            const file = this.files[0];
            if (file && file.size > 100000000) { // 100MB
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
                background: linear-gradient(90deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8);
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
    features: []
  };

  // Initialize system
  function init() {
    loadActivation();
    createPremiumButton();
    if (activation.active) {
      applyFeatures();
    }
  }

  function loadActivation() {
    const saved = localStorage.getItem('destal-premium');
    if (saved) {
      activation = JSON.parse(saved);
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
      features: config.validKeys[key].features
    };
    
    saveActivation();
    applyFeatures();
    
    return {
      success: true,
      message: config.validKeys[key].message
    };
  }

  function applyFeatures() {
    activation.features.forEach(feature => {
      if (config.features[feature] && config.features[feature].apply) {
        config.features[feature].apply();
      }
    });
  }

  function createPremiumButton() {
    // Add small premium button to top bar
    $('.navbar').append(`
      <button class="premium-activate-btn btn btn-sm btn-warning ml-2">
        <i class="fas fa-crown"></i>
      </button>
      
      <div class="premium-modal" 
           style="display:none; position:fixed; top:0; left:0; 
                  width:100%; height:100%; background:rgba(0,0,0,0.8); 
                  z-index:2000; display:flex; justify-content:center; 
                  align-items:center;">
        <div style="background:white; padding:20px; border-radius:8px; width:90%; max-width:400px;">
          <h4 style="margin-top:0;"><i class="fas fa-crown"></i> Premium Activation</h4>
          <input type="text" class="form-control premium-key-input" placeholder="Enter activation key">
          <button class="btn btn-primary mt-2 premium-submit-btn">Activate</button>
          <div class="premium-result mt-2"></div>
          
          <div class="mt-3 pt-3 border-top">
            <h6>Available Keys:</h6>
            <ul class="pl-3">
              <li><code>FREE2023</code> - Basic version</li>
              <li><code>PRO2023</code> - Themes + Emojis</li>
              <li><code>ULTRA2023</code> - All features</li>
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
    $(document).on('click', '.premium-activate-btn', function() {
      $('.premium-modal').show();
    });
    
    $(document).on('click', '.premium-modal', function(e) {
      if ($(e.target).hasClass('premium-modal')) {
        $('.premium-modal').hide();
      }
    });
    
    $(document).on('click', '.premium-submit-btn', function() {
      const key = $('.premium-key-input').val();
      const result = activate(key);
      
      $('.premium-result').html(`
        <div class="alert alert-${result.success ? 'success' : 'danger'}">
          ${result.message}
        </div>
      `);
      
      if (result.success) {
        setTimeout(() => {
          $('.premium-modal').hide();
        }, 1500);
      }
    });
  }

  // Initialize when DOM is ready
  $(document).ready(function() {
    // Wait a moment to ensure navbar is loaded
    setTimeout(init, 300);
  });

})();
