#!/bin/bash

echo "Levantando aplicación frontend..."
npm run build
PORT=3001 npm run start > app-frontend.log 2>&1 &
PID_APP_FRONTEND=$!

# Opcional: Levanta el backend aquí, si lo necesitas. Por ejemplo:
# echo "Levantando backend..."
# PORT=3000 npm run start-backend > app-backend.log 2>&1 &
# PID_APP_BACKEND=$!

# Espera a que el frontend responda en el puerto 3001 antes de seguir
echo "Esperando que frontend esté disponible en el puerto 3001..."
while ! nc -z localhost 3001; do
  sleep 1
done

# Lo mismo para backend si aplica
# echo "Esperando que backend esté disponible en el puerto 3000..."
# while ! nc -z localhost 3000; do
#   sleep 1
# done

echo "Levantando frontend (Cloudflared tunnel)..."
cloudflared tunnel run --url http://localhost:3001 freeq-udp > frontend.log 2>&1 &
PID_FRONTEND=$!

echo "Levantando backend (Cloudflared tunnel)..."
cloudflared tunnel run --url http://localhost:3000 freeq-backend-udp > backend.log 2>&1 &
PID_BACKEND=$!

sleep 3

if ps -p $PID_FRONTEND > /dev/null; then
  echo "Frontend levantado correctamente (PID: $PID_FRONTEND)"
else
  echo "Error al levantar frontend. Verifica frontend.log"
fi

if ps -p $PID_BACKEND > /dev/null; then
  echo "Backend levantado correctamente (PID: $PID_BACKEND)"
else
  echo "Error al levantar backend. Verifica backend.log"
fi

echo "Log Frontend:"
cat frontend.log

echo "Log Backend:"
cat backend.log

echo "¡Servicios levantados!"
