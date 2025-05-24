// destal-premium-final-en.js
(function() {
  const config = {
    validKeys: {
      'FREE2023': { features: [], message: 'Free version activated' },
      'PRO2023': { features: ['themes', 'emojis'], message: 'Pro features unlocked!' },
      'ULTRA2023': { features: ['themes', 'emojis', 'files', 'colors'], message: 'All premium features unlocked!' }
    },
    features: {
      themes: {
        apply: function() {
          $('#premium-theme-styles').remove();
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
              .theme-sunset-glow {
                --bg-color: #fff5e6;
                --text-color: #b35c00;
                --card-bg: #ffdca6;
                --border-color: #f2994a;
              }
              .theme-ocean-breeze {
                --bg-color: #e0f7fa;
                --text-color: #006064;
                --card-bg: #b2ebf2;
                --border-color: #00acc1;
              }
              .theme-forest-mist {
                --bg-color: #e8f5e9;
                --text-color: #2e7d32;
                --card-bg: #c8e6c9;
                --border-color: #66bb6a;
              }
              .theme-lavender-dream {
                --bg-color: #f3e5f5;
                --text-color: #6a1b9a;
                --card-bg: #e1bee7;
                --border-color: #ab47bc;
              }
            </style>
          `);
          $('.premium-themes-container').show();
        },
        remove: function() {
          $('body').removeClass('theme-matrix theme-deep-blue theme-dark-red theme-nature-green theme-sunset-glow theme-ocean-breeze theme-forest-mist theme-lavender-dream');
          $('.premium-themes-container').hide();
          $('#premium-theme-styles').remove();
        }
      },
      emojis: {
        apply: function() {
          if ($('.premium-emojis-toggle').length === 0) {
            $('#sidebar .sidebar-content').prepend(`
              <div class="sidebar-section premium-emojis-toggle" style="margin-bottom:10px;">
                <button class="btn btn-sm btn-secondary btn-block" style="white-space: nowrap;">
                  Show Premium Emojis
                </button>
              </div>
            `);
            $('#sidebar .sidebar-content').prepend(`
              <div class="sidebar-section premium-emojis-container" style="display:none;">
                <h5 class="sidebar-title"><i class="fas fa-smile"></i> Premium Emojis</h5>
                <div class="emoji-grid" style="
                  display:grid; 
                  grid-template-columns:repeat(3,1fr); 
                  gap:18px; 
                  padding:10px;
                  font-size: 28px;
                  cursor: pointer;
                  user-select: none;
                  justify-items: center;
                  align-items: center;
                ">
                  <span>🦄</span>
                  <span>🧙‍♂️</span>
                  <span>🛸</span>
                  <span>🐉</span>
                  <span>🍀</span>
                  <span>🦜</span>
                  <span>🎭</span>
                  <span>🌌</span>
                  <span>🪐</span>
                </div>
              </div>
            `);
            $(document).on('click', '.emoji-grid span', function() {
              const emoji = $(this).text();
              const input = $('#messageText');
              if (input.length) {
                input.val(input.val() + emoji).focus();
              }
            });
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
          $(document).off('click', '.emoji-grid span');
          $(document).off('click', '.premium-emojis-toggle button');
        }
      },
      files: {
        apply: function() { /* nada aqui por enquanto */ },
        remove: function() {}
      },
      colors: {
        apply: function() {
          if ($('#premium-name-style').length === 0) {
            $('head').append(`
              <style id="premium-name-style">
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
        },
        remove: function() {
          $('.message-author').removeClass('premium-name');
          $('#premium-name-style').remove();
        }
      }
    }
  };

  let activation = { active: false, key: null, features: [] };

  function init() {
    loadActivation();
    addPremiumSection();
    if (activation.active) applyFeatures();
  }

  function loadActivation() {
    const saved = localStorage.getItem('destal-premium');
    if (saved) activation = JSON.parse(saved);
  }

  function saveActivation() {
    localStorage.setItem('destal-premium', JSON.stringify(activation));
  }

  function activateKey(key) {
    key = key.trim().toUpperCase();
    if (!config.validKeys[key]) return { success: false, message: 'Invalid activation key' };
    if (activation.active) removeFeatures();
    activation = {
      active: true,
      key: key,
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
    $('.activation-result').html(`<div class="alert alert-success">Premium removed successfully</div>`);
    setTimeout(() => location.reload(), 800);
  }

  function applyFeatures() {
    activation.features.forEach(f => {
      if (config.features[f] && config.features[f].apply) config.features[f].apply();
    });
  }

  function removeFeatures() {
    activation.features.forEach(f => {
      if (config.features[f] && config.features[f].remove) config.features[f].remove();
    });
  }

  function addPremiumSection() {
    $('.sidebar-section.premium-section').remove();

    $('#sidebar .sidebar-content').prepend(`
      <div class="sidebar-section premium-section" style="margin-bottom: 15px;">
        <h5 class="sidebar-title"><i class="fas fa-crown"></i> Premium</h5>
        <input type="text" class="form-control premium-key-input mb-2" placeholder="Enter activation key" style="width: 100%; box-sizing: border-box;">
        <button class="btn btn-primary btn-sm btn-block activate-btn">Activate</button>
        ${activation.active ? `<button class="btn btn-danger btn-sm btn-block mt-2 remove-premium-btn">Remove Premium</button>` : ''}
        <div class="activation-result mt-2"></div>
      </div>
      <div class="sidebar-section premium-themes-container" style="display:none; margin-top: 10px;">
        <h5 class="sidebar-title"><i class="fas fa-palette"></i> Premium Themes</h5>
        <select class="form-control form-control-sm theme-selector" style="margin-top: 6px;">
          <option value="">Default Theme</option>
          <option value="theme-matrix">Matrix</option>
          <option value="theme-deep-blue">Deep Blue</option>
          <option value="theme-dark-red">Dark Red</option>
          <option value="theme-nature-green">Nature Green</option>
          <option value="theme-sunset-glow">Sunset Glow</option>
          <option value="theme-ocean-breeze">Ocean Breeze</option>
          <option value="theme-forest-mist">Forest Mist</option>
          <option value="theme-lavender-dream">Lavender Dream</option>
        </select>
      </div>
    `);

    if (activation.active) {
      $('.premium-themes-container').show();
    }

    $(document).off('click', '.activate-btn').on('click', '.activate-btn', () => {
      const key = $('.premium-key-input').val();
      const res = activateKey(key);
      $('.activation-result').html(res.success 
        ? `<div class="alert alert-success">${res.message}</div>`
        : `<div class="alert alert-danger">${res.message}</div>`);
      if (res.success) {
        $('.premium-section').find('.remove-premium-btn').remove();
        $('.premium-section .activate-btn').after(`<button class="btn btn-danger btn-sm btn-block mt-2 remove-premium-btn">Remove Premium</button>`);
        $('.premium-themes-container').show();
      }
    });

    $(document).off('click', '.remove-premium-btn').on('click', '.remove-premium-btn', () => {
      removePremium();
    });

    $('.theme-selector').on('change', function() {
      const theme = $(this).val();
      $('body').removeClass('theme-matrix theme-deep-blue theme-dark-red theme-nature-green theme-sunset-glow theme-ocean-breeze theme-forest-mist theme-lavender-dream');
      if (theme) $('body').addClass(theme);
    });
  }

  $(document).ready(() => {
    init();
  });
})();
