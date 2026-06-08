#!/bin/bash

# Nombres de los archivos de salida
OUTPUT_ZIP="everythingMichiru.zip"
OUTPUT_XPI="everythingMichiru.xpi"

# Limpiar archivos anteriores si existen
rm -f "$OUTPUT_ZIP" "$OUTPUT_XPI"

echo "Preparando empaquetado cross-browser..."

# Respaldar manifest original
cp manifest.json manifest.json.bak

# --- 1. Generar manifest.json específico para Chrome ---
node -e '
const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
delete manifest.browser_specific_settings;
delete manifest.background.scripts;
fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, 4));
'

echo "Empaquetando extensión para Chrome/Brave ($OUTPUT_ZIP)..."
zip -r "$OUTPUT_ZIP" manifest.json content.js popup.js background.js rules.json index.html index.css icons/ _locales/ -x "*.DS_Store*"

# --- 2. Generar manifest.json específico para Firefox ---
node -e '
const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync("manifest.json.bak", "utf8"));
delete manifest.background.service_worker;
fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, 4));
'

echo "Empaquetando extensión para Firefox/Android ($OUTPUT_XPI)..."
zip -r "$OUTPUT_XPI" manifest.json content.js popup.js background.js rules.json index.html index.css icons/ _locales/ -x "*.DS_Store*"

# Restaurar manifest.json original para desarrollo local
mv manifest.json.bak manifest.json

if [ -f "$OUTPUT_ZIP" ] && [ -f "$OUTPUT_XPI" ]; then
  echo "--------------------------------------------------"
  echo "¡Éxito! Se han creado los archivos:"
  echo "  - $OUTPUT_ZIP (Limpio para Chrome, sin advertencias de Firefox)"
  echo "  - $OUTPUT_XPI (Limpio para Firefox y Android, sin advertencias de service_worker)"
  echo "Ahora puedes compartir estos archivos con otros usuarios."
  echo "--------------------------------------------------"
else
  echo "Error al crear los archivos de extensión. Asegúrate de tener instalado 'zip' en tu sistema."
fi
