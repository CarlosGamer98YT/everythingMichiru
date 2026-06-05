// Escuchar mensajes desde el popup o el content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchImageBoards') {
        fetchImageBoardUrls()
            .then(urls => sendResponse({ urls }))
            .catch(err => {
                console.error('Error en fetchImageBoards:', err);
                sendResponse({ urls: [] });
            });
        return true; // Mantiene el canal abierto para respuesta asíncrona
    }
});

// Función para consultar las APIs de Danbooru y Gelbooru con las credenciales del usuario
async function fetchImageBoardUrls() {
    const settings = await chrome.storage.local.get([
        'danbooruLogin',
        'danbooruApiKey',
        'gelbooruUserId',
        'gelbooruApiKey',
        'nsfwEnabled'
    ]);

    const urls = [];
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Determinar los filtros de clasificación basados en el switch de NSFW
    // rating:g en Danbooru es "General" (SFW). Si NSFW está activo, no filtramos por clasificación.
    const danbooruRatingFilter = settings.nsfwEnabled ? '' : '+rating:g';
    // rating:general en Gelbooru es "General" (SFW). Si NSFW está activo, no filtramos por clasificación.
    const gelbooruRatingFilter = settings.nsfwEnabled ? '' : '+rating:general';

    // 1. Consulta a Danbooru
    // Usamos el operador de búsqueda OR (prefijando con ~) para obtener imágenes de ambas etiquetas en una sola consulta
    if (settings.danbooruLogin && settings.danbooruApiKey) {
        try {
            await delay(200); // Pequeño retraso de cortesía
            console.log(`Consultando Danbooru con operador OR (NSFW: ${!!settings.nsfwEnabled})...`);
            
            const response = await fetch(
                `https://danbooru.donmai.us/posts.json?tags=~kagemori_michiru+~michiru_kagemori${danbooruRatingFilter}&limit=100&login=${encodeURIComponent(settings.danbooruLogin)}&api_key=${encodeURIComponent(settings.danbooruApiKey)}`,
                { 
                    headers: { 
                        'User-Agent': 'EverythingMichiruExtension/2.0'
                    } 
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    data.forEach(post => {
                        const imgUrl = post.large_file_url || post.file_url;
                        if (imgUrl) {
                            urls.push(imgUrl);
                        }
                    });
                }
                console.log(`Danbooru: Cargadas ${urls.length} imágenes.`);
            } else {
                console.error('Error en API Danbooru, Status:', response.status);
            }
        } catch (e) {
            console.error('Error al realizar fetch en Danbooru:', e);
        }
    }

    const beforeGelbooruCount = urls.length;

    // 2. Consulta a Gelbooru
    // Realizamos consultas para ambas etiquetas (kagemori_michiru y michiru_kagemori) por separado para asegurar compatibilidad total
    if (settings.gelbooruUserId && settings.gelbooruApiKey) {
        const gelbooruTags = ['kagemori_michiru', 'michiru_kagemori'];
        
        for (const tag of gelbooruTags) {
            try {
                await delay(200); // Esperar 200ms antes de cada petición a Gelbooru para respetar el límite de 10 req/s
                console.log(`Consultando Gelbooru para etiqueta: ${tag} (NSFW: ${!!settings.nsfwEnabled})...`);
                
                const response = await fetch(
                    `https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=${tag}${gelbooruRatingFilter}&json=1&limit=100&user_id=${encodeURIComponent(settings.gelbooruUserId)}&api_key=${encodeURIComponent(settings.gelbooruApiKey)}`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    const posts = data && data.post;
                    if (Array.isArray(posts)) {
                        posts.forEach(post => {
                            if (post.file_url) {
                                urls.push(post.file_url);
                            }
                        });
                    }
                } else {
                    console.error(`Error en API Gelbooru (${tag}), Status:`, response.status);
                }
            } catch (e) {
                console.error(`Error al realizar fetch en Gelbooru para ${tag}:`, e);
            }
        }
        console.log(`Gelbooru: Cargadas ${urls.length - beforeGelbooruCount} imágenes.`);
    }

    // 3. Eliminar duplicados si alguna imagen coincide en ambas búsquedas o plataformas
    const uniqueUrls = [...new Set(urls)];
    console.log(`Total de imágenes únicas cargadas de los ImageBoards: ${uniqueUrls.length}`);

    // Guardar en almacenamiento local para la caché
    if (uniqueUrls.length > 0) {
        await chrome.storage.local.set({
            imageBoardUrls: uniqueUrls,
            imageBoardUrlsTimestamp: Date.now()
        });
        console.log('Guardado en caché de la extensión.');
    }

    return uniqueUrls;
}
