// destal-premium-menu.js
// Sistema premium simplificado com tudo no menu lateral
(function() {
  // Configuração em português
  const config = {
    chavesValidas: {
      'FREE2023': { 
        recursos: [],
        mensagem: 'Versão gratuita ativada'
      },
      'PRO2023': { 
        recursos: ['temas', 'emojis'],
        mensagem: 'Recursos Pro ativados!'
      },
      'ULTRA2023': { 
        recursos: ['temas', 'emojis', 'arquivos', 'cores'],
        mensagem: 'Todos recursos premium ativados!'
      }
    },
    
    recursos: {
      'temas': {
        nome: 'Temas Visuais',
        aplicar: function() {
          // Adiciona os temas premium
          $('head').append(`
            <style>
              .tema-matrix {
                --bg-color: #000;
                --text-color: #0f0;
                --card-bg: #121212;
                --border-color: #0f0;
              }
              .tema-azul-profundo {
                --bg-color: #001a33;
                --text-color: #cce6ff;
                --card-bg: #003366;
                --border-color: #4da6ff;
              }
              .tema-escuro-vermelho {
                --bg-color: #1a0000;
                --text-color: #ff9999;
                --card-bg: #330000;
                --border-color: #ff4d4d;
              }
              .tema-verde-natureza {
                --bg-color: #001a00;
                --text-color: #99ff99;
                --card-bg: #003300;
                --border-color: #4dff4d;
              }
            </style>
          `);
        }
      },
      'emojis': {
        nome: 'Pacote de Emojis',
        aplicar: function() {
          const emojis = ['😎', '🚀', '🌟', '🎩', '👑', '💎', '⚡', '🔥', '🌈'];
          
          // Adiciona botão de emojis no menu
          $('#sidebar').append(`
            <div class="sidebar-section">
              <h5 class="sidebar-title"><i class="fas fa-smile"></i> Emojis Premium</h5>
              <div class="emoji-container" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
                ${emojis.map(e => `
                  <span class="emoji-btn" style="font-size: 24px; cursor: pointer; text-align: center;">${e}</span>
                `).join('')}
              </div>
            </div>
          `);
          
          // Insere emoji no chat
          $(document).on('click', '.emoji-btn', function() {
            $('#messageText').val($('#messageText').val() + $(this).text());
          });
        }
      },
      'arquivos': {
        nome: 'Arquivos Grandes',
        aplicar: function() {
          $(document).on('change', '#fileInput', function() {
            const file = this.files[0];
            if (file && file.size > 100000000) { // 100MB
              alert('Arquivo muito grande (limite: 100MB)');
              $(this).val('');
            }
          });
        }
      },
      'cores': {
        nome: 'Nomes Coloridos',
        aplicar: function() {
          $('head').append(`
            <style>
              .nome-colorido {
                background: linear-gradient(90deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: bold;
              }
            </style>
          `);
          $('.message-author').addClass('nome-colorido');
        }
      }
    }
  };

  // Estado atual
  let ativacao = {
    ativo: false,
    chave: null,
    recursos: []
  };

  // Inicialização
  function iniciar() {
    carregarAtivacao();
    adicionarMenuPremium();
    if (ativacao.ativo) {
      aplicarRecursos();
    }
  }

  function carregarAtivacao() {
    const salvo = localStorage.getItem('destal-premium');
    if (salvo) {
      ativacao = JSON.parse(salvo);
    }
  }

  function salvarAtivacao() {
    localStorage.setItem('destal-premium', JSON.stringify(ativacao));
  }

  function ativarChave(chave) {
    chave = chave.trim().toUpperCase();
    
    if (!config.chavesValidas[chave]) {
      return {
        sucesso: false,
        mensagem: 'Chave de ativação inválida'
      };
    }
    
    ativacao = {
      ativo: true,
      chave: chave,
      recursos: config.chavesValidas[chave].recursos
    };
    
    salvarAtivacao();
    aplicarRecursos();
    
    return {
      sucesso: true,
      mensagem: config.chavesValidas[chave].mensagem
    };
  }

  function aplicarRecursos() {
    ativacao.recursos.forEach(recurso => {
      if (config.recursos[recurso] && config.recursos[recurso].aplicar) {
        config.recursos[recurso].aplicar();
      }
    });
  }

  function adicionarMenuPremium() {
    // Adiciona seção de ativação premium no menu
    $('#sidebar .sidebar-content').append(`
      <div class="sidebar-section">
        <h5 class="sidebar-title"><i class="fas fa-crown"></i> Premium</h5>
        <div class="form-group">
          <input type="text" class="form-control form-control-sm mb-2 chave-premium-input" placeholder="Digite sua chave">
          <button class="btn btn-primary btn-sm btn-block ativar-premium-btn">Ativar</button>
        </div>
        <div class="resultado-ativacao mt-2"></div>
      </div>
      
      <div class="sidebar-section temas-premium-container" style="display: none;">
        <h5 class="sidebar-title"><i class="fas fa-palette"></i> Temas Premium</h5>
        <select class="form-control form-control-sm seletor-tema">
          <option value="">Tema Padrão</option>
          <option value="tema-matrix">Matrix</option>
          <option value="tema-azul-profundo">Azul Profundo</option>
          <option value="tema-escuro-vermelho">Vermelho Escuro</option>
          <option value="tema-verde-natureza">Verde Natureza</option>
        </select>
      </div>
    `);
    
    // Evento para trocar temas
    $(document).on('change', '.seletor-tema', function() {
      $('body').removeClass('tema-matrix tema-azul-profundo tema-escuro-vermelho tema-verde-natureza');
      if ($(this).val()) {
        $('body').addClass($(this).val());
      }
    });
    
    // Evento para ativar premium
    $(document).on('click', '.ativar-premium-btn', function() {
      const chave = $('.chave-premium-input').val();
      const resultado = ativarChave(chave);
      
      $('.resultado-ativacao').html(`
        <div class="alert alert-${resultado.sucesso ? 'success' : 'danger'} p-2">
          ${resultado.mensagem}
        </div>
      `);
      
      if (resultado.sucesso) {
        $('.temas-premium-container').show();
        setTimeout(() => {
          $('.resultado-ativacao').empty();
        }, 3000);
      }
    });
    
    // Mostra seção de temas se já estiver ativo
    if (ativacao.ativo && ativacao.recursos.includes('temas')) {
      $('.temas-premium-container').show();
    }
  }

  // Inicia quando o DOM estiver pronto
  $(document).ready(function() {
    // Espera o menu carregar
    setTimeout(iniciar, 500);
  });

})();
