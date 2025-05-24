// destal-premium-final-en.js
(function() {
    // Configuração simplificada: só uma chave válida e dois recursos
    const config = {
        validKeys: {
            'PRO7373': { features: ['themes', 'emojis'], message: 'All premium features unlocked!' }
        },
        features: {
            themes: {
                name: 'Premium Themes',
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
                            /* Novos temas naturais */
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
                name: 'Emoji Pack',
                apply: function() {
                    if ($('.premium-emojis-toggle').length === 0) {
                        $('#sidebar .sidebar-content').append(`
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
                                    <span>🦥</span>
                                    <span>🦦</span>
                                    <span>🦩</span>
                                    <span>🧛‍♀️</span>
                                    <span>🧟‍♂️</span>
                                    <span>🧞‍♂️</span>
                                    <span>🧜‍♀️</span>
                                    <span>🦚</span>
                                    <span>🪶</span>
                                    <span>🪄</span>
                                    <span>🧩</span>
                                    <span>🛡️</span>
                                    <span>🏺</span>
                                    <span>🦋</span>
                                    <span>🐾</span>
                                    <span>🧿</span>
                                    <span>🕯️</span>
                                    <span>⚗️</span>
                                    <span>🧪</span>
                                    <span>🧸</span>
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
            }
        }
    };

    let activation = {
        active: false,
        key: null,
        features: []
    };

    // Global flag to track if PayPal SDK is loaded
    let paypalSdkLoaded = false;

    function init() {
        loadActivation();
        addPremiumSection(); // Add the section first so container exists

        // Load PayPal SDK script dynamically only if it's not already there
        if (!$('script[src*="paypal.com/sdk"]').length) {
            const paypalScript = document.createElement('script');
            paypalScript.src = "https://www.paypal.com/sdk/js?client-id=BAAkPzm10hAQfwuLQe5bVE_a0ncc5lBvxDLnhJKcBHgSHts8gGaPMjJaOA6Nc4Z34j2IMORrfkjgEnvBB8&components=hosted-buttons&disable-funding=venmo&currency=USD";
            paypalScript.onload = () => {
                console.log('PayPal SDK loaded.');
                paypalSdkLoaded = true; // Set flag
                // Attempt to render PayPal button after SDK loads, if not active
                if (!activation.active) {
                    showPaypalButton();
                }
            };
            paypalScript.onerror = () => {
                console.error('Failed to load PayPal SDK.');
            };
            document.head.appendChild(paypalScript);
        } else {
            // If script is already in DOM (e.g., hardcoded in HTML), assume it's loaded
            paypalSdkLoaded = true;
            // Attempt to render immediately if already loaded and not active
            if (!activation.active) {
                showPaypalButton();
            }
        }


        if (activation.active) {
            applyFeatures();
            hideActivationInput();
            hidePaypalButton(); // Hide PayPal button if premium is active
        } else {
            // If not active and SDK was already loaded, show it
            if (paypalSdkLoaded) {
                showPaypalButton();
            }
            // Otherwise, it will be shown when SDK loads in the onload callback
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

    function activateKey(key) {
        key = key.trim().toUpperCase();
        if (!config.validKeys[key]) {
            return { success: false, message: 'Invalid activation key' };
        }
        if (activation.active) {
            removeFeatures();
        }
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
        $('.activation-result').html(`<div class="alert alert-success">Premium features removed successfully</div>`);
        showActivationInput();
        showPaypalButton(); // Show PayPal button again
        setTimeout(() => location.reload(), 1000);
    }

    function applyFeatures() {
        activation.features.forEach(feature => {
            if (config.features[feature] && config.features[feature].apply) {
                config.features[feature].apply();
            }
        });
    }

    function removeFeatures() {
        activation.features.forEach(feature => {
            if (config.features[feature] && config.features[feature].remove) {
                config.features[feature].remove();
            }
        });
    }

    function hideActivationInput() {
        $('.premium-key-input').hide();
        $('.activate-btn').hide();
    }

    function showActivationInput() {
        $('.premium-key-input').show();
        $('.activate-btn').show();
    }

    function hidePaypalButton() {
        $('#paypal-container-V7HLZPTQNAF8W').hide();
    }

    function showPaypalButton() {
        const paypalContainer = $('#paypal-container-V7HLZPTQNAF8W');
        if (paypalSdkLoaded && typeof paypal !== 'undefined' && paypal.HostedButtons && paypalContainer.length) {
            // Ensure the container is visible before rendering
            paypalContainer.show();
            // Clear previous content to avoid duplicate buttons if re-rendering
            paypalContainer.empty();
            paypal.HostedButtons({
                hostedButtonId: "V7HLZPTQNAF8W",
            }).render("#paypal-container-V7HLZPTQNAF8W")
            .catch(error => {
                console.error("PayPal button rendering error:", error);
            });
        } else {
            // If SDK not loaded or container not ready, just ensure it's visible if it ever appears
            paypalContainer.show();
        }
    }

    function addPremiumSection() {
        // Remove seção anterior se existir
        $('.sidebar-section.premium-section').remove();

        // Cria a seção Premium no topo do menu
        $('#sidebar .sidebar-content').append(`
            <div class="sidebar-section premium-section">
                <h5 class="sidebar-title"><i class="fas fa-crown"></i> Premium</h5>
                <div class="form-group">
                    <input type="text" class="form-control mb-2 premium-key-input" placeholder="Enter activation key">
                    <button class="btn btn-primary btn-sm btn-block activate-btn">Activate</button>
                    <div id="paypal-container-V7HLZPTQNAF8W" class="mt-2"></div> ${activation.active ? `
                        <button class="btn btn-danger btn-sm btn-block mt-2 remove-premium-btn">Remove Premium</button>
                    ` : ''}
                </div>
                <div class="activation-result mt-2"></div>
            </div>

            <div class="sidebar-section premium-themes-container" style="display: none; margin-top: 15px;">
                <h5 class="sidebar-title"><i class="fas fa-palette"></i> Premium Themes</h5>
                <select class="form-control form-control-sm theme-selector" style="margin-top: 8px;">
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

        // Initial visibility based on activation status
        if (!activation.active) {
            $('.premium-themes-container').hide();
            // PayPal button will be shown by init() once SDK loads
        } else {
            $('.premium-themes-container').show();
            hideActivationInput();
            hidePaypalButton();
        }

        // Eventos
        $('.activate-btn').on('click', () => {
            const key = $('.premium-key-input').val();
            const res = activateKey(key);
            const resultDiv = $('.activation-result');
            if (res.success) {
                resultDiv.html(`<div class="alert alert-success">${res.message}</div>`);
                hideActivationInput();
                hidePaypalButton(); // Hide PayPal button
                if ($('.remove-premium-btn').length === 0) {
                    $('.premium-section .form-group').append(`
                        <button class="btn btn-danger btn-sm btn-block mt-2 remove-premium-btn">Remove Premium</button>
                    `);
                }
                $('.premium-themes-container').show();

                setTimeout(() => {
                    resultDiv.fadeOut('slow', () => {
                        resultDiv.html('').show();
                    });
                }, 4000);
            } else {
                resultDiv.html(`<div class="alert alert-danger">${res.message}</div>`);
                setTimeout(() => {
                    resultDiv.fadeOut('slow', () => {
                        resultDiv.html('').show();
                    });
                }, 4000);
            }
        });

        $(document).on('click', '.remove-premium-btn', () => {
            removePremium();
        });

        $('.theme-selector').on('change', function() {
            const theme = $(this).val();
            $('body').removeClass(
                'theme-matrix theme-deep-blue theme-dark-red theme-nature-green theme-sunset-glow theme-ocean-breeze theme-forest-mist theme-lavender-dream'
            );
            if (theme) {
                $('body').addClass(theme);
            }
        });

    }

    // Inicializa ao carregar o script
    $(document).ready(() => {
        init();
    });
})();
