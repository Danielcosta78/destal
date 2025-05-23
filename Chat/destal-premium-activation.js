// destal-premium-activation.js
// Sistema completo de ativação premium para Destal Chat
(function() {
  // Configuração do sistema premium
  const premiumConfig = {
    // Chaves válidas e seus recursos
    validKeys: {
      // Chave gratuita (recursos básicos)
      'DESTAL-FREE': {
        name: 'Free Tier',
        features: ['basic-themes'],
        expires: null // Não expira
      },
      
      // Chave Pro (recursos intermediários)
      'DESTAL-PRO-2023': {
        name: 'Pro Version',
        features: ['themes', 'large-files', 'history'],
        expires: null
      },
      
      // Chave Ultra (todos recursos)
      'DESTAL-ULTRA-2023': {
        name: 'Ultra Version',
        features: ['themes', 'emojis', 'large-files', 'history', 'colored-names'],
        expires: null
      },
      
      // Chave de teste para desenvolvimento
      'DESTAL-TEST': {
        name: 'Test Version',
        features: ['themes', 'emojis', 'large-files', 'history', 'colored-names'],
        expires: null
      }
    },
    
    // Definição dos recursos
    features: {
      'themes': {
        description: 'Temas Premium',
        apply: applyPremiumThemes
      },
      'emojis': {
        description: 'Pacote de Emojis',
        apply: applyPremiumEmojis
      },
      'large-files': {
        description: 'Arquivos até 100MB',
        apply: applyLargeFiles
      },
      'history': {
        description: 'Histórico Estendido',
        apply: applyExtendedHistory
      },
      'colored-names': {
        description: 'Nomes Coloridos',
        apply: applyColoredNames
      },
      'basic-themes': {
        description: 'Temas Básicos',
        apply: applyBasicThemes
      }
    }
  };

  // Estado atual da ativação
  let currentActivation = {
    active: false,
    key: null,
    features: [],
    expiration: null
  };

  // Inicializa o sistema premium
  function initPremiumSystem() {
    loadActivation();
    injectUIElements();
    setupEventListeners();
    
    if (currentActivation.active) {
      applyAllFeatures();
      showPremiumBadge();
    }
  }

  // Carrega a ativação salva
  function loadActivation() {
    const saved = localStorage.getItem('destal-premium');
    if (saved) {
      currentActivation = JSON.parse(saved);
      
      // Verifica expiração
      if (currentActivation.expiration && new Date() > new Date(currentActivation.expiration)) {
        resetActivation();
      }
    }
  }

  // Salva o estado de ativação
  function saveActivation() {
    localStorage.setItem('destal-premium', JSON.stringify(currentActivation));
  }

  // Ativa uma chave premium
  function activatePremiumKey(key) {
    key = key.trim().toUpperCase();
    
    if (!premiumConfig.validKeys[key]) {
      return {
        success: false,
        message: 'Chave inválida. Por favor, verifique o código.'
      };
    }
    
    const keyInfo = premiumConfig.validKeys[key];
    
    // Verifica se a chave expirou
    if (keyInfo.expires && new Date() > new Date(keyInfo.expires)) {
      return {
        success: false,
        message: 'Esta chave expirou. Obtenha uma nova versão.'
      };
    }
    
    // Ativa os recursos
    currentActivation = {
      active: true,
      key: key,
      features: keyInfo.features,
      expiration: keyInfo.expires,
      tier: keyInfo.name
    };
    
    saveActivation();
    applyAllFeatures();
    showPremiumBadge();
    
    return {
      success: true,
      message: `Premium ativado com sucesso! (${keyInfo.name})`
    };
  }

  // Aplica todos os recursos ativos
  function applyAllFeatures() {
    currentActivation.features.forEach(feature => {
      if (premiumConfig.features[feature] && premiumConfig.features[feature].apply) {
        premiumConfig.features[feature].apply();
      }
    });
  }

  // ==============================================
  // IMPLEMENTAÇÃO DOS RECURSOS
  // ==============================================

  function applyPremiumThemes() {
    // Adiciona CSS para temas premium
    const css = `
      .theme-matrix {
        --bg-color: #000000;
        --text-color: #00ff00;
        --card-bg: #121212;
        --border-color: #00ff00;
      }
      .theme-ocean {
        --bg-color: #f0f8ff;
        --text-color: #005b96;
        --card-bg: #ffffff;
        --border-color: #005b96;
      }
    `;
    
    $('head').append(`<style id="premium-themes">${css}</style>`);
    
    // Adiciona seletor de temas
    if (!$('.theme-selector').length) {
      $('.navbar').append(`
        <select class="theme-selector form-control form-control-sm ml-2">
          <option value="">Tema Padrão</option>
          <option value="theme-matrix">Matrix</option>
          <option value="theme-ocean">Oceano</option>
        </select>
      `);
      
      $(document).on('change', '.theme-selector', function() {
        $('body').removeClass('theme-matrix theme-ocean');
        if ($(this).val()) {
          $('body').addClass($(this).val());
        }
      });
    }
  }

  function applyBasicThemes() {
    // Versão simplificada para free tier
    $('head').append(`
      <style>
        .theme-light {
          --bg-color: #f5f5f5;
          --text-color: #333333;
        }
        .theme-dark {
          --bg-color: #121212;
          --text-color: #e0e0e0;
        }
      </style>
    `);
  }

  function applyPremiumEmojis() {
    const emojis = ['🚀', '🎩', '👑', '💎', '🌟', '⚡'];
    
    // Adiciona botão de emojis
    $('.message-input-container').before(`
      <div class="emoji-picker-container">
        ${emojis.map(e => `<button class="emoji-btn">${e}</button>`).join('')}
      </div>
      <style>
        .emoji-picker-container {
          padding: 5px;
          display: flex;
          gap: 5px;
        }
        .emoji-btn {
          background: none;
          border: none;
          font-size: 1.2em;
          cursor: pointer;
        }
      </style>
    `);
    
    $(document).on('click', '.emoji-btn', function() {
      const currentText = $('#messageText').val();
      $('#messageText').val(currentText + $(this).text());
    });
  }

  function applyLargeFiles() {
    // Altera o limite para 100MB
    $(document).on('change', '#fileInput', function() {
      const file = this.files[0];
      if (file && file.size > 100000000) {
        alert('Arquivo muito grande (limite: 100MB)');
        $(this).val('');
      }
    });
  }

  function applyExtendedHistory() {
    // Aumenta o histórico para 1000 mensagens
    if (window.saveMessage) {
      const originalSave = window.saveMessage;
      window.saveMessage = function(msg) {
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        if (history.length >= 1000) {
          history.shift();
        }
        history.push(msg);
        localStorage.setItem('chatHistory', JSON.stringify(history));
      };
    }
  }

  function applyColoredNames() {
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

  // ==============================================
  // INTERFACE DO USUÁRIO
  // ==============================================

  function injectUIElements() {
    // Adiciona botão premium
    if (!$('#premium-btn').length) {
      $('.navbar').append(`
        <button id="premium-btn" class="btn btn-sm btn-warning ml-2">
          <i class="fas fa-crown"></i> Premium
        </button>
      `);
    }
    
    // Adiciona modal de ativação
    if (!$('#premium-modal').length) {
      $('body').append(`
        <div id="premium-modal" class="modal" style="display:none;">
          <div class="modal-content">
            <div class="modal-header">
              <h5><i class="fas fa-crown"></i> Ativação Premium</h5>
              <button class="close">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Digite sua chave de ativação:</label>
                <input type="text" id="premium-key-input" class="form-control">
              </div>
              <button id="activate-btn" class="btn btn-primary">Ativar</button>
              <div id="activation-result" class="mt-2"></div>
              
              <div class="premium-features mt-4">
                <h6><i class="fas fa-star"></i> Recursos Premium:</h6>
                <ul>
                  ${Object.entries(premiumConfig.features).map(([key, f]) => 
                    `<li>${f.description}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <style>
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .modal-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            padding: 20px;
          }
          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .premium-features {
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
        </style>
      `);
    }
  }

  function setupEventListeners() {
    // Botão premium
    $(document).on('click', '#premium-btn', function() {
      $('#premium-modal').show();
    });
    
    // Fechar modal
    $(document).on('click', '.close', function() {
      $('#premium-modal').hide();
    });
    
    // Ativar chave
    $(document).on('click', '#activate-btn', function() {
      const key = $('#premium-key-input').val();
      const result = activatePremiumKey(key);
      
      $('#activation-result').html(`
        <div class="alert alert-${result.success ? 'success' : 'danger'}">
          ${result.message}
        </div>
      `);
      
      if (result.success) {
        setTimeout(() => {
          $('#premium-modal').hide();
          location.reload();
        }, 1500);
      }
    });
  }

  function showPremiumBadge() {
    // Mostra badge na UI
    $('#premium-btn').html(`
      <i class="fas fa-crown"></i> ${currentActivation.tier}
    `).removeClass('btn-warning').addClass('btn-success');
  }

  function resetActivation() {
    currentActivation = {
      active: false,
      key: null,
      features: [],
      expiration: null
    };
    saveActivation();
    location.reload();
  }

  // ==============================================
  // INICIALIZAÇÃO
  // ==============================================

  // Espera o DOM estar pronto
  $(document).ready(function() {
    // Verifica se o chat está carregado
    if ($('.message-container').length) {
      initPremiumSystem();
    } else {
      // Tenta novamente após 1 segundo se o chat não estiver pronto
      setTimeout(initPremiumSystem, 1000);
    }
  });

})();
