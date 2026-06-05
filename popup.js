document.addEventListener('DOMContentLoaded', () => {
    const btnToggle = document.getElementById('btn-toggle');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    // Función para actualizar la interfaz del popup basada en el estado
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

    // Detectar si estamos en el contexto real de la extensión de Chrome/Brave
    const isExtensionContext = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

    if (isExtensionContext) {
        // --- Contexto Real de la Extensión ---
        // Obtener el estado actual (por defecto true si no existe)
        chrome.storage.local.get({ enabled: true }, (result) => {
            updateUI(result.enabled);
        });

        // Manejar el click en el botón de alternar
        btnToggle.addEventListener('click', () => {
            chrome.storage.local.get({ enabled: true }, (result) => {
                const newEnabled = !result.enabled;
                
                // Guardar el nuevo estado en el almacenamiento local
                chrome.storage.local.set({ enabled: newEnabled }, () => {
                    updateUI(newEnabled);
                });
            });
        });
    } else {
        // --- Modo Simulación (Para pruebas locales abriendo el HTML en el navegador) ---
        console.warn('Ejecutándose fuera del contexto de extensión. Cargando modo simulación.');
        
        // Simular estado inicial activo
        let mockEnabled = true;
        updateUI(mockEnabled);

        btnToggle.addEventListener('click', () => {
            mockEnabled = !mockEnabled;
            updateUI(mockEnabled);
        });
    }
});
