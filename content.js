let isEnabled = true;
let apisEnabled = true;
let dynamicMichiruImages = [];

// Lista curada estática de imágenes oficiales y GIFs (como fallback inmediato y para tener variedad oficial)
const staticMichiruImages = [
    'https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABbo3kWQKnq3FzliOp0bmKxCDBF8wlIGkeXF2DDA-tkSUoYWeEWXWI50L-KYg_-CYCj7CumrrPPd8nGEnwC8jH1ADaojSY2Gdhk-8wbLV81zqVjBU.jpg?r=db3', // Netflix Promo
    'https://static.wikia.nocookie.net/brand-new-animal/images/1/1a/Michiru_Kagemori.png/revision/latest', // Michiru Forma Tanuki Oficial
    'https://static.wikia.nocookie.net/brand-new-animal/images/8/8c/Human_Michiru.png/revision/latest', // Michiru Humana
    'https://static.wikia.nocookie.net/brand-new-animal/images/6/62/065F1005-6CF3-496E-B71A-432A00EC95CE.jpeg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/a/a2/082B6DD2-EA1C-49E8-BDE3-085ABBA25BC3.jpeg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/6/64/0E0D8CEE-16C6-4186-88A7-2B83B8368BD2.gif/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/5/54/0E7BC71E-3246-4726-9AB1-0D258BFABCCD.jpeg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/c/ce/13905803-4E04-4079-8231-AF5F76B68BB7.jpeg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/c/c5/145BA3AE-6E64-4C9D-9280-01D602E2FA92.gif/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/a/a1/165B36FC-D186-4AEC-85EF-AA39C0FB8407.gif/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/e/eb/1E32626D-766C-45A9-80E4-C058EC0567FE.png/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/d/d6/2200821D-BCB5-496C-A383-7A98B11021B3.gif/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/7/7a/29144948-9944-4E5C-B296-18FBFFC7E4ED.jpeg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/2/2f/2D0C3AB9-8745-4953-8FF4-D737D1A7BD5E.jpeg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/b/b5/2D402D1C-BFE1-4EA1-BD03-431F582D18DD.png/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/5/50/32bGVF.png/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/f/f0/38C24D7A-D356-43D2-9744-0A5663009831.jpeg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/1/17/452373F8-CE1E-4A37-A538-E1ED27C2FECB.jpeg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/3/33/4Vb8GDF.jpg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/d/de/5AA237F0-AA29-4CDF-AB0C-6FEBF5FECBF4.gif/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/b/b4/5CD6FBC5-BADA-47D6-817D-277DD7CABFB4.gif/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/0/0a/612646B4-621A-412C-9951-3BC8EA54920F.gif/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/e/ec/761EC830-8A99-4906-B7A8-0350EE1BD89E.jpeg/revision/latest',
    'https://static.wikia.nocookie.net/brand-new-animal/images/0/0e/7AA3FE60-E266-47BF-8111-B874B64B38D2.jpeg/revision/latest'
];

// Obtener la lista combinada (estática + dinámica de APIs si están habilitadas y existen)
const getCombinedImagesList = () => {
    return apisEnabled ? [...staticMichiruImages, ...dynamicMichiruImages] : staticMichiruImages;
};

const replace = () => {
    const imgs = document.getElementsByTagName('img');
    const allImages = getCombinedImagesList();
    
    let replacementsCount = 0;
    const MAX_REPLACEMENTS_PER_TICK = 5; // 5 reemplazos de APIs por ciclo de 500ms = Máx 10 por segundo
    
    for (const img of imgs) {
        // Si la imagen ya tiene asignado un Michiru y su src actual sigue siendo ese, omitimos
        if (img.dataset.michiruSrc && img.src === img.dataset.michiruSrc) {
            continue;
        }

        // Si la imagen no está en nuestra lista de imágenes de Michiru
        if (!allImages.includes(img.src)) {
            // Guardamos el src original por si se desactiva
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
            }
            
            // Elegimos una imagen aleatoria de la lista completa
            const randomIndex = Math.floor(Math.random() * allImages.length);
            const chosenMichiru = allImages[randomIndex];
            
            // Comprobar si la imagen elegida proviene de las APIs de Danbooru o Gelbooru
            const isApiImage = chosenMichiru.includes('donmai.us') || chosenMichiru.includes('gelbooru.com');
            
            // Si es una imagen de API y ya alcanzamos el límite en este ciclo, la saltamos para el siguiente
            if (isApiImage && replacementsCount >= MAX_REPLACEMENTS_PER_TICK) {
                continue;
            }
            
            // Guardamos la Michiru asignada y actualizamos el src
            img.dataset.michiruSrc = chosenMichiru;
            img.src = chosenMichiru;
            
            // Solo contamos para el rate limit si es una imagen remota de las APIs
            if (isApiImage) {
                replacementsCount++;
            }
        }
    }
};

const restore = () => {
    const imgs = document.getElementsByTagName('img');
    
    for (const img of imgs) {
        if (img.dataset.originalSrc) {
            // Restaurar src original y limpiar atributos
            img.src = img.dataset.originalSrc;
            delete img.dataset.originalSrc;
            delete img.dataset.michiruSrc;
        }
    }
};

// 1. Obtener estado inicial e imágenes de ImageBoards en la caché
chrome.storage.local.get(['enabled', 'apisEnabled', 'imageBoardUrls'], (result) => {
    isEnabled = result.enabled !== false;
    apisEnabled = result.apisEnabled !== false;
    dynamicMichiruImages = result.imageBoardUrls || [];
    if (isEnabled) {
        replace();
    }
});

// 2. Ejecutar el reemplazo en bucle (500ms) para imágenes dinámicas
window.setInterval(() => {
    if (isEnabled) {
        replace();
    }
}, 500);

// 3. Escuchar cambios de estado e imágenes en tiempo real
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        // Cambios de estado Activo/Inactivo de la extensión completa
        if ('enabled' in changes) {
            isEnabled = changes.enabled.newValue;
            if (isEnabled) {
                replace();
            } else {
                restore();
            }
        }
        
        // Cambios en la activación de APIs
        if ('apisEnabled' in changes) {
            apisEnabled = changes.apisEnabled.newValue !== false;
            if (isEnabled) {
                if (!apisEnabled) {
                    // Si se acaban de desactivar las APIs, barremos y reemplazamos instantáneamente
                    // las imágenes activas de Gel/Dan por imágenes estáticas oficiales de Michiru
                    const imgs = document.getElementsByTagName('img');
                    for (const img of imgs) {
                        if (img.dataset.michiruSrc && 
                            (img.dataset.michiruSrc.includes('donmai.us') || img.dataset.michiruSrc.includes('gelbooru.com'))) {
                            
                            const randomIndex = Math.floor(Math.random() * staticMichiruImages.length);
                            const chosenStatic = staticMichiruImages[randomIndex];
                            
                            img.dataset.michiruSrc = chosenStatic;
                            img.src = chosenStatic;
                        }
                    }
                } else {
                    // Si se volvieron a activar, hacemos un replace para reintroducir variedad
                    replace();
                }
            }
        }
        
        // Cambios en la lista de imágenes (cuando se cargan nuevas APIs)
        if ('imageBoardUrls' in changes) {
            dynamicMichiruImages = changes.imageBoardUrls.newValue || [];
            if (isEnabled && apisEnabled) {
                replace();
            }
        }
    }
});