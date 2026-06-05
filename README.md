# Everything Michiru 🦝

A browser extension that replaces every image with pictures of Michiru Kagemori!

*This is a fork from [girltwinktaako/everythingMichiru](https://github.com/girltwinktaako/everythingMichiru).*

---

## 🚀 Cómo instalar la extensión (Para Usuarios)

Para que otros usuarios puedan instalar y usar esta extensión de forma rápida y sencilla, deben seguir estos pasos:

### Paso 1: Descargar y descomprimir la extensión
1. Descarga el código de la extensión en formato **ZIP** (desde el botón verde "Code" -> "Download ZIP" en GitHub, o pídele al creador el archivo `everythingMichiru.zip`).
2. Descomprime el archivo `.zip` en una carpeta de tu ordenador (por ejemplo, en el Escritorio).

### Paso 2: Cargar la extensión en el navegador
1. Abre tu navegador basado en Chromium (como **Brave**, **Google Chrome**, **Edge** o **Opera**).
2. En la barra de direcciones, escribe la ruta de extensiones del navegador:
   * **Brave:** `brave://extensions/`
   * **Chrome:** `chrome://extensions/`
3. En la esquina superior derecha de la página de extensiones, **activa** el interruptor de **Modo de desarrollador** (Developer mode).
4. Haz clic en el botón **Cargar descomprimida** (Load unpacked) que aparecerá en la parte superior izquierda.
5. Selecciona la carpeta que acabas de descomprimir (la que contiene el archivo `manifest.json`).

¡Y listo! La extensión estará activa inmediatamente en tu navegador.

---

## 🛠️ Cómo empaquetar la extensión (Para Desarrolladores)

Si eres el creador y quieres compilar/empaquetar la extensión en un solo archivo `.zip` limpio (sin archivos de desarrollo como `.git` o scripts) para enviárselo a tus amigos o usuarios:

1. Abre la terminal en la carpeta del proyecto.
2. Ejecuta el script de empaquetado:
   ```bash
   ./package.sh
   ```
3. Se generará un archivo llamado `everythingMichiru.zip` listo para enviar.
