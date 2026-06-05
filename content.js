let isEnabled = true;
const michiruUrl = 'https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABbo3kWQKnq3FzliOp0bmKxCDBF8wlIGkeXF2DDA-tkSUoYWeEWXWI50L-KYg_-CYCj7CumrrPPd8nGEnwC8jH1ADaojSY2Gdhk-8wbLV81zqVjBU.jpg?r=db3';

const replace = () => {
    const imgs = document.getElementsByTagName('img');
    
    for (const img of imgs) {
        // Guardamos la imagen original solo si no la hemos guardado ya
        // y si la imagen actual no es la de Michiru (para evitar sobrescribirla con la de Michiru)
        if (img.src !== michiruUrl) {
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
            }
            img.src = michiruUrl;
        }
    }
};

const restore = () => {
    const imgs = document.getElementsByTagName('img');
    
    for (const img of imgs) {
        // Si la imagen tiene una original guardada, la restauramos
        if (img.dataset.originalSrc) {
            img.src = img.dataset.originalSrc;
            delete img.dataset.originalSrc;
        }
    }
};

// 1. Obtener el estado inicial desde el almacenamiento local
chrome.storage.local.get({ enabled: true }, (result) => {
    isEnabled = result.enabled;
    if (isEnabled) {
        replace();
    }
});

// 2. Ejecutar el reemplazo en bucle si la extensión está activa
window.setInterval(() => {
    if (isEnabled) {
        replace();
    }
}, 500);

// 3. Escuchar cambios de estado en tiempo real (por ejemplo, al hacer click en el popup)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && 'enabled' in changes) {
        isEnabled = changes.enabled.newValue;
        if (isEnabled) {
            replace();
        } else {
            restore();
        }
    }
});