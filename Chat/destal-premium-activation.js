// destal-premium-final-en.js
// Complete Premium System (English)
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
          // Add theme CSS
          if (!$('#premium-theme-styles').length) {
            $('head').append(`
              <style id="premium-theme-styles">
                .theme-matrix {
                  --bg-color: #000;
                  --text-color: #0f0;
                  --card-bg: #121212;
                  --border-color: #0f0;
                }
                .theme-deep-blue {
                  --bg-color: #001a33;
                  --text-color: #cce6ff;
                  --card-bg: #003366;
                  --border-color: #4da6ff;
                }
                .theme-dark-red {
                  --bg-color: #1a0000;
                  --text-color: #ff9999;
                  --card-bg: #330000;
                  --border-color: #ff4d4d;
                }
                .theme-nature-green {
                  --bg-color: #001a00;
                  --text-color: #99ff99;
                  --card-bg: #003300;
                  --border-color: #4dff4d;
                }
              </style>
            `);
          }
          // Show theme selector container
          $('.premium-themes-container').show();
        },
        remove: function() {
          $('body').removeClass('theme-matrix theme-deep-blue theme-dark-red theme-nature-green');
          $('.premium-themes-container').hide();
        }
      },
      'emojis': {
        name: 'Emoji Pack',
        apply: function() {
          if ($('.premium-emojis-toggle').length === 0) {
            // Add a toggle button at the top of sidebar to show/hide emojis panel
            $('#sidebar .sidebar-content').prepend(`
              <div class="sidebar-section premium-emojis-toggle" style="margin-bottom:10px;">
                <button class="btn btn-sm btn-secondary btn-block" style="white-space: nowrap;">
                  Show Premium Emojis
                </button>
              </div>
            `);
            
            // Add emojis container hidden initially
            $('#sidebar .sidebar-content').prepend(`
              <div class="sidebar-section premium-emojis-container" style="display:none;">
                <h5 class="sidebar-title"><i class="fas fa-smile"></i> Premium Emojis</h5>
                <div class="emoji-grid" style="display:grid; grid-template-columns:repeat(3,1fr); gap:5px; padding:5px;">
                  😎 🚀 🌟 🎩 👑 💎 ⚡ 🔥 🌈
                </div>
              </div>
              <style>
                .emoji-grid span, .emoji-grid {
                  font-size: 24px;
                  cursor: pointer;
                  text-align: center;
                  user-select: none;
                }
                .emoji-grid span:hover {
                  transform: scale(1.2);
                }
              </style>
            `);
            
            // Make emojis clickable (delegation)
            $(document).on('click', '.emoji-grid span', function() {
              const emoji = $(this).text();
              const input = $('#messageText');
              if (input.length) {
                input.val(input.val() + emoji).focus();
              }
            });
            
            // Toggle button handler
            $(document).on('click', '.premium-emojis-toggle button', function() {
              const panel = $('.premium-emojis-container');
              if (panel.is(':visible')) {
                panel.slideUp();
                $(this).text('Show Premium Emojis');
              } else {
                panel.slideDown();
                $(this).text('Hide Premium Emojis');
              }
            });
          }
        },
        remove: function() {
          $('.premium-emojis-toggle').remove();
          $('.premium-emojis-container').remove();
        }
      },
      'files': {
        name: 'Larger Files',
        apply: function() {
          // Example: Increase max file size (implementation depends on app)
          window.MAX_FILE_SIZE = 1024 * 1024 * 100; // 100 MB
        },
        remove: function() {
          // Reset to default
          window.MAX_FILE_SIZE = 1024 * 1024 * 10; // 10 MB default
        }
      },
      'colors': {
        name: 'Colored Names',
        apply: function() {
          if (!$('#premium-colors-style').length) {
            $('head').append(`
              <style id="premium-colors-style">
                .premium-name {
                  background: linear-gradient(90deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  font-weight: bold;
                }
              </style>
            `);
          }
          $('.message-author').addClass('premium-name');
        },
        remove: function() {
          $('.message-author').removeClass('premium-name');
          $('#premium-colors-style').remove();
        }
      }
    }
  };

  // Activation state, loaded from localStorage
  let activation = { active: false, key: null, features: [] };

  function loadActivation() {
    const saved = localStorage.getItem('destal-premium');
    if (saved) {
      try {
        activation = JSON.parse(saved);
      } catch {
        activation = { active: false, key: null, features: [] };
      }
    }
  }

  function saveActivation() {
    localStorage.setItem('destal-premium', JSON.stringify(activation));
  }

  function activateKey(key) {
    key = key.trim().toUpperCase();
    if (!config.validKeys[key]) {
      return { success: false, message: 'Invalid activation key' };
    }
    // Remove old features
    if (activation.active) removeFeatures();

    activation = {
      active: true,
      key,
      features: config.validKeys[key].features
    };
    saveActivation();
    applyFeatures();
    return { success: true, message: config.validKeys[key].message };
  }

  function removePremium() {
    removeFeatures();
    activation = { active: false, key: null, features: [] };
    saveActivation();
    $('.activation-result').html(`
      <div class="alert alert-success">Premium features removed successfully</div>
    `);
    setTimeout(() => location.reload(), 1000);
  }

  function applyFeatures() {
    activation.features.forEach(f => {
      if (config.features[f] && config.features[f].apply) {
        config.features[f].apply();
      }
    });
  }

  function removeFeatures() {
    activation.features.forEach(f => {
      if (config.features[f] && config.features[f].remove) {
        config.features[f].remove();
      }
    });
  }

  // Insert Premium UI at TOP of sidebar
  function addPremiumSection() {
    if ($('#sidebar .sidebar-content').length === 0) {
      // Retry if sidebar not ready
      setTimeout(addPremiumSection, 200);
      return;
    }

    // Only add once
    if ($('.premium-main-section').length) return;

    $('#sidebar .sidebar-content').prepend(`
      <div class="sidebar-section premium-main-section">
        <h5 class="sidebar-title"><i class="fas fa-crown"></i> Premium</h5>
        <div class="form-group">
          <input type="text" class="form-control mb-2 premium-key-input" placeholder="Enter activation key">
          <button class="btn btn-primary btn-sm btn-block activate-btn">Activate</button>
          ${activation.active ? `
            <button class="btn btn-danger btn-sm btn-block mt-2 remove-premium-btn">
              Remove Premium
            </button>
          ` : ''}
        </div>
        <div class="activation-result mt-2"></div>
      </div>
      <div class="sidebar-section premium-themes-container" style="display: none;">
        <h5 class="sidebar-title"><i class="fas fa-palette"></i> Premium Themes</h5>
        <select class="form-control form-control-sm theme-selector">
          <option value="">Default Theme</option>
          <option value="theme-matrix">Matrix</option>
          <option value="theme-deep-blue">Deep Blue</option>
          <option value="theme-dark-red">Dark Red</option>
          <option value="theme-nature-green">Nature Green</option>
        </select>
      </div>
      <p style="margin: 0; padding: 0; height: 20px;"></p>
      <p style="margin: 0; padding: 0; height: 20px;"></p>
      <p style="margin: 0; padding: 0; height: 20px;"></p>
    `);

    bindUIEvents();

    // Show theme container if activated
    if (activation.active && activation.features.includes('themes')) {
      $('.premium-themes-container').show();
    }
  }

  function bindUIEvents() {
    // Activate button
    $(document).on('click', '.activate-btn', () => {
      const key = $('.premium-key-input').val();
      const result = activateKey(key);
      $('.activation-result').html(`
        <div class="alert alert-${result.success ? 'success' : 'danger'}">
          ${result.message}
        </div>
      `);
      if (result.success) setTimeout(() => location.reload(), 1000);
    });

    // Remove premium button
    $(document).on('click', '.remove-premium-btn', removePremium);

    // Theme selector change
    $(document).on('change', '.theme-selector', function() {
      $('body').removeClass('theme-matrix theme-deep-blue theme-dark-red theme-nature-green');
      if ($(this).val()) {
        $('body').addClass($(this).val());
      }
    });
  }

  // Init
  function init() {
    loadActivation();
    addPremiumSection();
    if (activation.active) {
      applyFeatures();
    }
  }

  $(document).ready(() => setTimeout(init, 300));
})();
