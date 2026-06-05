document.addEventListener('DOMContentLoaded', () => {
    // Elementos principales
    const btnToggle = document.getElementById('btn-toggle');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const apisToggleInput = document.getElementById('apis-toggle');

    // Elementos del switch flotante NSFW en la cabecera
    const nsfwToggleInput = document.getElementById('nsfw-toggle');
    const nsfwLabel = document.getElementById('nsfw-label');

    // Elementos de Configuración de API (en el panel colapsable)
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsContent = document.getElementById('settings-content');
    const settingsArrow = document.getElementById('settings-arrow');
    
    const danbooruLoginInput = document.getElementById('danbooru-login');
    const danbooruApiKeyInput = document.getElementById('danbooru-apikey');
    const gelbooruUserIdInput = document.getElementById('gelbooru-userid');
    const gelbooruApiKeyInput = document.getElementById('gelbooru-apikey');
    
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const settingsMessage = document.getElementById('settings-message');

    // Detectar si estamos en el contexto real de la extensión de Chrome/Brave
    const isExtensionContext = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

    // Función para traducir los elementos HTML estáticos con atributos data-i18n y data-i18n-placeholder
    const translateHTML = () => {
        if (!isExtensionContext) return;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.textContent = message;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.placeholder = message;
            }
        });
    };

    // Traducir la interfaz inmediatamente
    translateHTML();

    // Función para actualizar la interfaz del popup basada en el estado de la extensión
    const updateUI = (enabled) => {
        if (enabled) {
            statusDot.className = 'status-dot active';
            statusText.textContent = isExtensionContext ? chrome.i18n.getMessage('statusActive') : 'Activado';
            
            btnToggle.textContent = isExtensionContext ? chrome.i18n.getMessage('btnTurnOff') : 'OFF';
            btnToggle.className = 'btn btn-active'; // Estilo rojo (para desactivar)
        } else {
            statusDot.className = 'status-dot inactive';
            statusText.textContent = isExtensionContext ? chrome.i18n.getMessage('statusInactive') : 'Desactivado';
            
            btnToggle.textContent = isExtensionContext ? chrome.i18n.getMessage('btnTurnOn') : 'ON';
            btnToggle.className = 'btn btn-inactive'; // Estilo verde (para activar)
        }
    };

    // Función para actualizar la etiqueta de texto y color de NSFW
    const updateNsfwUI = (nsfwEnabled) => {
        nsfwToggleInput.checked = !!nsfwEnabled;
        if (nsfwEnabled) {
            nsfwLabel.textContent = 'NSFW';
            nsfwLabel.className = 'nsfw-text-label nsfw';
        } else {
            nsfwLabel.textContent = 'SFW';
            nsfwLabel.className = 'nsfw-text-label sfw';
        }
    };

    // --- 1. Alternar visualización de la sección de Ajustes ---
    settingsToggle.addEventListener('click', () => {
        const isOpen = settingsContent.classList.toggle('open');
        settingsArrow.textContent = isOpen ? '▲' : '▼';
    });

    // --- 2. Cargar datos iniciales de configuración y estado ---
    if (isExtensionContext) {
        // Cargar estado ON/OFF
        chrome.storage.local.get(['enabled'], (result) => {
            updateUI(result.enabled !== false);
        });

        // Cargar credenciales guardadas y switches
        chrome.storage.local.get([
            'danbooruLogin',
            'danbooruApiKey',
            'gelbooruUserId',
            'gelbooruApiKey',
            'apisEnabled',
            'nsfwEnabled'
        ], (result) => {
            if (result.danbooruLogin) danbooruLoginInput.value = result.danbooruLogin;
            if (result.danbooruApiKey) danbooruApiKeyInput.value = result.danbooruApiKey;
            if (result.gelbooruUserId) gelbooruUserIdInput.value = result.gelbooruUserId;
            if (result.gelbooruApiKey) gelbooruApiKeyInput.value = result.gelbooruApiKey;
            
            apisToggleInput.checked = result.apisEnabled !== false; // Activo por defecto
            updateNsfwUI(result.nsfwEnabled);
        });

        // Alternar estado ON/OFF al pulsar el botón principal
        btnToggle.addEventListener('click', () => {
            chrome.storage.local.get(['enabled'], (result) => {
                const newEnabled = result.enabled === false; // Si era false, ahora es true
                chrome.storage.local.set({ enabled: newEnabled }, () => {
                    updateUI(newEnabled);
                });
            });
        });

        // Alternar el switch principal de APIs (Guardar y aplicar inmediatamente)
        apisToggleInput.addEventListener('change', () => {
            const newApisEnabled = apisToggleInput.checked;
            chrome.storage.local.set({ apisEnabled: newApisEnabled }, () => {
                // Si se activa, y hay credenciales, solicitar refrescar caché de imágenes inmediatamente
                if (newApisEnabled) {
                    chrome.storage.local.get([
                        'danbooruLogin',
                        'danbooruApiKey',
                        'gelbooruUserId',
                        'gelbooruApiKey'
                    ], (result) => {
                        if ((result.danbooruLogin && result.danbooruApiKey) || (result.gelbooruUserId && result.gelbooruApiKey)) {
                            chrome.runtime.sendMessage({ action: 'fetchImageBoards' });
                        }
                    });
                }
            });
        });

        // Alternar el switch flotante de NSFW (Guardar y aplicar inmediatamente)
        nsfwToggleInput.addEventListener('change', () => {
            const newNsfwEnabled = nsfwToggleInput.checked;
            updateNsfwUI(newNsfwEnabled);
            
            chrome.storage.local.set({ nsfwEnabled: newNsfwEnabled }, () => {
                // Si el switch principal de APIs está activo, y hay credenciales, solicitar refrescar caché
                chrome.storage.local.get([
                    'apisEnabled',
                    'danbooruLogin',
                    'danbooruApiKey',
                    'gelbooruUserId',
                    'gelbooruApiKey'
                ], (result) => {
                    const apisEnabled = result.apisEnabled !== false;
                    if (apisEnabled && ((result.danbooruLogin && result.danbooruApiKey) || (result.gelbooruUserId && result.gelbooruApiKey))) {
                        chrome.runtime.sendMessage({ action: 'fetchImageBoards' });
                    }
                });
            });
        });

        // Guardar la configuración de APIs del panel colapsable
        btnSaveSettings.addEventListener('click', () => {
            const danbooruLogin = danbooruLoginInput.value.trim();
            const danbooruApiKey = danbooruApiKeyInput.value.trim();
            const gelbooruUserId = gelbooruUserIdInput.value.trim();
            const gelbooruApiKey = gelbooruApiKeyInput.value.trim();
            const apisEnabled = apisToggleInput.checked;

            chrome.storage.local.set({
                danbooruLogin,
                danbooruApiKey,
                gelbooruUserId,
                gelbooruApiKey
            }, () => {
                const savedMsg = isExtensionContext ? chrome.i18n.getMessage('settingsSaved') : '¡Configuración guardada!';
                showMessage(savedMsg, 'success');
                
                // Si las APIs están habilitadas y hay credenciales, solicitar al background que refresque
                if (apisEnabled && ((danbooruLogin && danbooruApiKey) || (gelbooruUserId && gelbooruApiKey))) {
                    const queryingMsg = isExtensionContext ? chrome.i18n.getMessage('settingsQuerying') : '¡Guardado! Consultando APIs...';
                    showMessage(queryingMsg, 'success');
                    chrome.runtime.sendMessage({ action: 'fetchImageBoards' }, (response) => {
                        if (response && response.urls && response.urls.length > 0) {
                            const countStr = response.urls.length.toString();
                            const successMsg = isExtensionContext ? chrome.i18n.getMessage('settingsSuccess', [countStr]) : `¡Éxito! ${countStr} imágenes listas.`;
                            showMessage(successMsg, 'success');
                        } else {
                            const fetchingMsg = isExtensionContext ? chrome.i18n.getMessage('settingsFetching') : 'Conexión lista. (Cargando imágenes en segundo plano...)';
                            showMessage(fetchingMsg, 'success');
                        }
                    });
                }
            });
        });

    } else {
        // --- Modo Simulación (Para pruebas abriendo el HTML localmente) ---
        console.warn('Ejecutándose en modo simulación (fuera de extensión).');
        
        let mockEnabled = true;
        let mockNsfwEnabled = false;
        
        updateUI(mockEnabled);
        updateNsfwUI(mockNsfwEnabled);

        btnToggle.addEventListener('click', () => {
            mockEnabled = !mockEnabled;
            updateUI(mockEnabled);
        });

        apisToggleInput.addEventListener('change', () => {
            console.log('Simulado: Cambiado switch de APIs a:', apisToggleInput.checked);
        });

        nsfwToggleInput.addEventListener('change', () => {
            mockNsfwEnabled = nsfwToggleInput.checked;
            updateNsfwUI(mockNsfwEnabled);
            console.log('Simulado: Cambiado switch de NSFW a:', mockNsfwEnabled);
        });

        btnSaveSettings.addEventListener('click', () => {
            showMessage('Simulado: Guardando en navegador...', 'success');
        });
    }

    // Auxiliar para mostrar alertas en los ajustes
    function showMessage(text, type) {
        settingsMessage.textContent = text;
        settingsMessage.className = `settings-message ${type}`;
        
        // Limpiar mensaje tras 4 segundos
        setTimeout(() => {
            if (settingsMessage.textContent === text) {
                settingsMessage.textContent = '';
                settingsMessage.className = 'settings-message';
            }
        }, 4000);
    }
});
