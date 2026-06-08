#!/bin/bash

# Nombres de los archivos de salida
OUTPUT_ZIP="everythingMichiru.zip"
OUTPUT_XPI="everythingMichiru.xpi"

# Limpiar archivos anteriores si existen
rm -f "$OUTPUT_ZIP" "$OUTPUT_XPI"

echo "Empaquetando la extensión 'Everything Michiru'..."

# Comprimir solo los archivos necesarios de la extensión
zip -r "$OUTPUT_ZIP" manifest.json content.js popup.js background.js rules.json index.html index.css icons/ _locales/ -x "*.DS_Store*"

if [ $? -eq 0 ]; then
  # Generar el archivo .xpi para Firefox (copia del zip)
  cp "$OUTPUT_ZIP" "$OUTPUT_XPI"
  
  echo "--------------------------------------------------"
  echo "¡Éxito! Se han creado los archivos:"
  echo "  - $OUTPUT_ZIP (para Chrome, Brave, Edge, etc.)"
  echo "  - $OUTPUT_XPI (para Firefox y derivados)"
  echo "Ahora puedes compartir estos archivos con otros usuarios."
  echo "--------------------------------------------------"
else
  echo "Error al crear el archivo comprimido. Asegúrate de tener instalado 'zip' en tu sistema."
fi
