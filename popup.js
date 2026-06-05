document.addEventListener('DOMContentLoaded', () => {
    // Elementos principales
    const btnToggle = document.getElementById('btn-toggle');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    // Elementos de Configuración de API
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsContent = document.getElementById('settings-content');
    const settingsArrow = document.getElementById('settings-arrow');
    
    const danbooruLoginInput = document.getElementById('danbooru-login');
    const danbooruApiKeyInput = document.getElementById('danbooru-apikey');
    const gelbooruUserIdInput = document.getElementById('gelbooru-userid');
    const gelbooruApiKeyInput = document.getElementById('gelbooru-apikey');
    const nsfwToggleInput = document.getElementById('nsfw-toggle');
    
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const settingsMessage = document.getElementById('settings-message');

    // Detectar si estamos en el contexto real de la extensión de Chrome/Brave
    const isExtensionContext = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

    // Función para actualizar la interfaz del popup basada en el estado de la extensión
    const updateUI = (enabled) => {
        if (enabled) {
            statusDot.className = 'status-dot active';
            statusText.textContent = 'Activado';
            
            btnToggle.textContent = 'OFF';
            btnToggle.className = 'btn btn-active'; // Estilo rojo (para desactivar)
        } else {
            statusDot.className = 'status-dot inactive';
            statusText.textContent = 'Desactivado';
            
            btnToggle.textContent = 'ON';
            btnToggle.className = 'btn btn-inactive'; // Estilo verde (para activar)
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

        // Cargar credenciales guardadas y switch de NSFW
        chrome.storage.local.get([
            'danbooruLogin',
            'danbooruApiKey',
            'gelbooruUserId',
            'gelbooruApiKey',
            'nsfwEnabled'
        ], (result) => {
            if (result.danbooruLogin) danbooruLoginInput.value = result.danbooruLogin;
            if (result.danbooruApiKey) danbooruApiKeyInput.value = result.danbooruApiKey;
            if (result.gelbooruUserId) gelbooruUserIdInput.value = result.gelbooruUserId;
            if (result.gelbooruApiKey) gelbooruApiKeyInput.value = result.gelbooruApiKey;
            nsfwToggleInput.checked = !!result.nsfwEnabled;
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

        // Guardar la configuración de APIs y el switch de NSFW
        btnSaveSettings.addEventListener('click', () => {
            const danbooruLogin = danbooruLoginInput.value.trim();
            const danbooruApiKey = danbooruApiKeyInput.value.trim();
            const gelbooruUserId = gelbooruUserIdInput.value.trim();
            const gelbooruApiKey = gelbooruApiKeyInput.value.trim();
            const nsfwEnabled = nsfwToggleInput.checked;

            chrome.storage.local.set({
                danbooruLogin,
                danbooruApiKey,
                gelbooruUserId,
                gelbooruApiKey,
                nsfwEnabled
            }, () => {
                showMessage('¡Configuración guardada!', 'success');
                
                // Si hay credenciales, solicitar al background que refresque los enlaces inmediatamente
                if ((danbooruLogin && danbooruApiKey) || (gelbooruUserId && gelbooruApiKey)) {
                    showMessage('¡Guardado! Consultando APIs...', 'success');
                    chrome.runtime.sendMessage({ action: 'fetchImageBoards' }, (response) => {
                        if (response && response.urls && response.urls.length > 0) {
                            showMessage(`¡Éxito! ${response.urls.length} imágenes listas.`, 'success');
                        } else {
                            showMessage('Conexión lista. (Cargando imágenes en segundo plano...)', 'success');
                        }
                    });
                }
            });
        });

    } else {
        // --- Modo Simulación (Para pruebas abriendo el HTML localmente) ---
        console.warn('Ejecutándose en modo simulación (fuera de extensión).');
        
        let mockEnabled = true;
        updateUI(mockEnabled);

        btnToggle.addEventListener('click', () => {
            mockEnabled = !mockEnabled;
            updateUI(mockEnabled);
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
