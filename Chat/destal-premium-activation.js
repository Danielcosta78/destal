// destal-premium-final-en.js
(function() {
  const config = {
    validKeys: {
      'FREE2023': { features: [], message: 'Free version activated' },
      'PRO2023': { features: ['themes', 'emojis'], message: 'Pro features unlocked!' },
      'ULTRA2023': { features: ['themes', 'emojis', 'files', 'colors'], message: 'All premium features unlocked!' }
    },
    features: {
      'themes': {
        name: 'Premium Themes',
        apply() {
          $('head').append(`<style>
            .theme-matrix { --bg-color: #000; --text-color: #0f0; --card-bg: #121212; --border-color: #0f0; }
            .theme-deep-blue { --bg-color: #001a33; --text-color: #cce6ff; --card-bg: #003366; --border-color: #4da6ff; }
            .theme-dark-red { --bg-color: #1a0000; --text-color: #ff9999; --card-bg: #330000; --border-color: #ff4d4d; }
            .theme-nature-green { --bg-color: #001a00; --text-color: #99ff99; --card-bg: #003300; --border-color: #4dff4d; }
          </style>`);
          $('.premium-themes-container').show();
        },
        remove() {
          $('body').removeClass('theme-matrix theme-deep-blue theme-dark-red theme-nature-green');
          $('.premium-themes-container').hide();
        }
      },
      'emojis': {
        name: 'Emoji Pack',
        apply() {
          $('#sidebar .sidebar-content').prepend(`
            <div class="sidebar-section">
              <h5 class="sidebar-title"><i class="fas fa-smile"></i> Premium Emojis</h5>
              <button class="btn btn-secondary btn-sm toggle-emojis">Show Emojis</button>
              <div class="emoji-grid mt-2" style="display:none;">
                ${['😎','🚀','🌟','🎩','👑','💎','⚡','🔥','🌈'].map(e => `<span class="emoji-btn">${e}</span>`).join('')}
              </div>
            </div>
            <style>
              .emoji-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
              .emoji-btn { font-size: 24px; cursor: pointer; text-align: center; }
              .emoji-btn:hover { transform: scale(1.2); }
            </style>
          `);
        },
        remove() {
          $('.emoji-grid, .toggle-emojis').parent().remove();
        }
      },
      'files': { name: 'Larger Files', apply() {}, remove() {} },
      'colors': {
        name: 'Colored Names',
        apply() {
          $('head').append(`<style>
            .premium-name {
              background: linear-gradient(90deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              font-weight: bold;
            }
          </style>`);
          $('.message-author').addClass('premium-name');
        },
        remove() {
          $('.message-author').removeClass('premium-name');
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
    try {
      const saved = localStorage.getItem('destal-premium');
      if (saved) activation = JSON.parse(saved);
    } catch (e) { console.error('Load failed', e); }
  }

  function saveActivation() {
    localStorage.setItem('destal-premium', JSON.stringify(activation));
  }

  function activateKey(key) {
    key = key.trim().toUpperCase();
    if (!config.validKeys[key]) return { success: false, message: 'Invalid activation key' };
    if (activation.active) removeFeatures();
    activation = { active: true, key, features: config.validKeys[key].features };
    saveActivation();
    applyFeatures();
    return { success: true, message: config.validKeys[key].message };
  }

  function removePremium() {
    removeFeatures();
    activation = { active: false, key: null, features: [] };
    saveActivation();
    $('.activation-result').html(`<div class="alert alert-success">Premium features removed successfully</div>`);
    setTimeout(() => location.reload(), 1000);
  }

  function applyFeatures() {
    activation.features.forEach(f => config.features[f]?.apply?.());
  }

  function removeFeatures() {
    activation.features.forEach(f => config.features[f]?.remove?.());
  }

  function addPremiumSection() {
    $('#sidebar .sidebar-content').prepend(`
      <div class="sidebar-section premium-settings">
        <h5 class="sidebar-title"><i class="fas fa-crown"></i> Premium</h5>
        <div class="form-group">
          <input type="text" class="form-control mb-2 premium-key-input" placeholder="Enter activation key">
          <button class="btn btn-primary btn-sm btn-block activate-btn">Activate</button>
          ${activation.active ? `<button class="btn btn-danger btn-sm btn-block mt-2 remove-premium-btn">Remove Premium</button>` : ''}
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
    `);

    // Eventos
    $(document).on('change', '.theme-selector', function() {
      $('body').removeClass('theme-matrix theme-deep-blue theme-dark-red theme-nature-green');
      if ($(this).val()) $('body').addClass($(this).val());
    });

    $(document).on('click', '.activate-btn', function() {
      const key = $('.premium-key-input').val();
      const result = activateKey(key);
      $('.activation-result').html(`<div class="alert alert-${result.success ? 'success' : 'danger'}">${result.message}</div>`);
      if (result.success) setTimeout(() => location.reload(), 1000);
    });

    $(document).on('click', '.remove-premium-btn', removePremium);

    $(document).on('click', '.toggle-emojis', function() {
      $(this).next('.emoji-grid').slideToggle();
    });

    $(document).on('click', '.emoji-btn', function() {
      $('#messageText').val($('#messageText').val() + $(this).text());
    });

    if (activation.active && activation.features.includes('themes')) {
      $('.premium-themes-container').show();
    }
  }

  $(document).ready(() => setTimeout(init, 300));
})();
