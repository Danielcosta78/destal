// destal-premium-floating.js
// Sistema premium com botão flutuante e chaves permanentes
(function() {
  // Configuração do sistema
  const config = {
    // Chaves válidas (agora sem expiração)
    keys: {
      'FREE': { name: 'Free', features: [] },
      'PRO': { name: 'Pro', features: ['themes', 'emojis'] },
      'ULTRA': { name: 'Ultra', features: ['themes', 'emojis', 'files', 'history', 'colors'] },
      'TEST': { name: 'Test', features: ['themes', 'emojis', 'files', 'history', 'colors'] }
    },
    
    // Definição dos recursos
    features: {
      'themes': {
        name: 'Temas Premium',
        apply: function() {
          // Adiciona temas extras
          $('head').append(`
            <style>
              .theme-matrix { --bg-color: #000; --text-color: #0f0; }
              .theme-ice { --bg-color: #f0f8ff; --text-color: #005588; }
              .theme-sunset { --bg-color: #fff8f0; --text-color: #882200; }
            </style>
          `);
          
          // Adiciona seletor de temas
          $('body').append(`
            <select class="destal-theme-selector" style="position:fixed; bottom:70px; right:20px; z-index:1000;">
              <option value="">Tema Padrão</option>
              <option value="theme-matrix">Matrix</option>
              <option value="theme-ice">Gelo</option>
              <option value="theme-sunset">Pôr do Sol</option>
            </select>
          `);
          
          $('.destal-theme-selector').change(function() {
            $('body').removeClass('theme-matrix theme-ice theme-sunset');
            if ($(this).val()) $('body').addClass($(this).val());
          });
        }
      },
      
      'emojis': {
        name: 'Emojis Especiais',
        apply: function() {
          const emojis = ['🚀', '🎩', '👑', '💎', '✨', '⚡'];
          
          // Adiciona botão flutuante de emojis
          $('body').append(`
            <div class="destal-emoji-picker" style="display:none; position:fixed; bottom:120px; right:20px; background:rgba(255,255,255,0.9); padding:10px; border-radius:10px; z-index:1000;">
              ${emojis.map(e => `<span class="destal-emoji" style="font-size:24px; cursor:pointer; margin:5px;">${e}</span>`).join('')}
            </div>
          `);
          
          // Mostra/oculta o painel de emojis
          $(document).on('click', '.destal-emoji-btn', function() {
            $('.destal-emoji-picker').toggle();
          });
          
          // Insere emoji no chat
          $(document).on('click', '.destal-emoji', function() {
            $('#messageText').val($('#messageText').val() + $(this).text());
          });
        }
      },
      
      'files': {
        name: 'Arquivos Grandes',
        apply: function() {
          $(document).on('change', '#fileInput', function() {
            const file = this.files[0];
            if (file && file.size > 100000000) { // 100MB
              alert('Arquivo muito grande (limite: 100MB)');
              $(this).val('');
            }
          });
        }
      },
      
      'history': {
        name: 'Histórico Extendido',
        apply: function() {
          // Implementação do histórico maior
          console.log('Histórico extendido ativado');
        }
      },
      
      'colors': {
        name: 'Cores Personalizadas',
        apply: function() {
          $('head').append(`
            <style>
              .destal-color-name {
                background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            </style>
          `);
          $('.message-author').addClass('destal-color-name');
        }
      }
    }
  };

  // Estado atual
  let currentStatus = {
    active: false,
    key: null,
    tier: null,
    features: []
  };

  // Inicialização
  function init() {
    loadStatus();
    createFloatingButton();
    if (currentStatus.active) applyFeatures();
  }

  // Carrega o status salvo
  function loadStatus() {
    const saved = localStorage.getItem('destal-premium');
    if (saved) {
      currentStatus = JSON.parse(saved);
      console.log('Status premium carregado:', currentStatus);
    }
  }

  // Salva o status
  function saveStatus() {
    localStorage.setItem('destal-premium', JSON.stringify(currentStatus));
  }

  // Ativa uma chave
  function activateKey(key) {
    key = key.trim().toUpperCase();
    
    if (!config.keys[key]) {
      return { success: false, message: 'Chave inválida' };
    }
    
    currentStatus = {
      active: true,
      key: key,
      tier: config.keys[key].name,
      features: config.keys[key].features
    };
    
    saveStatus();
    applyFeatures();
    
    return { 
      success: true, 
      message: `Premium ativado! (${config.keys[key].name})` 
    };
  }

  // Aplica os recursos ativos
  function applyFeatures() {
    currentStatus.features.forEach(feat => {
      if (config.features[feat] && config.features[feat].apply) {
        config.features[feat].apply();
      }
    });
  }

  // Cria o botão flutuante
  function createFloatingButton() {
    // Remove se já existir
    $('.destal-premium-btn').remove();
    
    // Cria o botão principal
    $('body').append(`
      <button class="destal-premium-btn" 
              style="position:fixed; bottom:20px; right:20px; 
                     width:50px; height:50px; border-radius:50%; 
                     background:rgba(255,215,0,0.5); border:none; 
                     color:white; font-size:20px; cursor:pointer;
                     z-index:1000; backdrop-filter:blur(5px);">
        <i class="fas fa-crown"></i>
      </button>
    `);
    
    // Cria o modal de ativação
    $('body').append(`
      <div class="destal-premium-modal" 
           style="display:none; position:fixed; top:0; left:0; 
                  width:100%; height:100%; background:rgba(0,0,0,0.7); 
                  z-index:2000; display:flex; justify-content:center; 
                  align-items:center;">
        <div style="background:white; padding:20px; border-radius:10px; max-width:400px;">
          <h3><i class="fas fa-crown"></i> Ativar Premium</h3>
          <input type="text" class="destal-key-input" 
                 placeholder="Digite sua chave" 
                 style="width:100%; padding:10px; margin:10px 0;">
          <button class="destal-activate-btn" 
                  style="background:gold; border:none; padding:10px 20px; 
                         border-radius:5px; cursor:pointer;">
            Ativar
          </button>
          <div class="destal-result" style="margin-top:10px;"></div>
          
          <div style="margin-top:20px; border-top:1px solid #eee; padding-top:10px;">
            <h4>Chaves de Teste:</h4>
            <ul>
              <li><strong>FREE</strong> - Versão gratuita</li>
              <li><strong>PRO</strong> - Temas e Emojis</li>
              <li><strong>ULTRA</strong> - Todos recursos</li>
            </ul>
          </div>
        </div>
      </div>
    `);
    
    // Eventos do botão
    $(document).on('click', '.destal-premium-btn', function() {
      $('.destal-premium-modal').show();
    });
    
    // Fechar modal
    $(document).on('click', '.destal-premium-modal', function(e) {
      if ($(e.target).hasClass('destal-premium-modal')) {
        $('.destal-premium-modal').hide();
      }
    });
    
    // Ativar chave
    $(document).on('click', '.destal-activate-btn', function() {
      const key = $('.destal-key-input').val();
      const result = activateKey(key);
      
      $('.destal-result').html(`
        <div style="color:${result.success ? 'green' : 'red'}">
          ${result.message}
        </div>
      `);
      
      if (result.success) {
        setTimeout(() => {
          $('.destal-premium-modal').hide();
          location.reload();
        }, 1500);
      }
    });
    
    // Adiciona ícone de coroa se não existir
    if (!$('i.fa-crown').length) {
      $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">');
    }
  }

  // Inicia quando o DOM estiver pronto
  $(document).ready(function() {
    // Verifica se o chat está carregado
    if ($('.message-container').length) {
      init();
    } else {
      // Tenta novamente após 1 segundo
      setTimeout(init, 1000);
    }
  });

})();
