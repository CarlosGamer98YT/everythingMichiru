#!/bin/bash

# Nombre del archivo de salida
OUTPUT="everythingMichiru.zip"

# Limpiar archivo anterior si existe
if [ -f "$OUTPUT" ]; then
  rm "$OUTPUT"
fi

echo "Empaquetando la extensión 'Everything Michiru'..."

# Comprimir solo los archivos necesarios de la extensión
zip -r "$OUTPUT" manifest.json content.js index.html index.css icons/ -x "*.DS_Store*"

if [ $? -eq 0 ]; then
  echo "--------------------------------------------------"
  echo "¡Éxito! Se ha creado el archivo: $OUTPUT"
  echo "Ahora puedes compartir este archivo ZIP con otros usuarios."
  echo "--------------------------------------------------"
else
  echo "Error al crear el archivo ZIP. Asegúrate de tener instalado 'zip' en tu sistema."
fi
