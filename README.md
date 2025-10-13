## Como conectar el frontend con el backend
# Pasos rápidos

# Instala dependencias
cd frontend
npm install

# Crea tu archivo .env 
En la parte de frontend/app existe un archivo llamado .env.example solo duplica el archivo .env.example y renómbralo a .env
Edita .env y coloca tu URL de backend:

# OPCIÓN A: IP local (dispositivo físico en la misma red Wi-Fi)
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000

# Arranca el backend
cd ../backend
npm install   # si es la primera vez
npm run dev
Debes ver: API en http://localhost:3000

# Arranca el frontend (Expo)
cd ../frontend
npx expo start -c

# Abre la app en tu Android con Expo Go (o en emulador).

# Confirma en la consola de Expo:
API_URL = http://TU_IP_LOCAL:3000 (o tu ngrok)

# ¿Cómo obtengo mi IP local?
Windows (PowerShell):
ipconfig
Busca “Dirección IPv4”, algo como 192.168.1.10.

(o ip a). Toma la IP de tu interfaz Wi-Fi.

# Asegúrate de que PC y teléfono estén en la misma red Wi-Fi.

# Notas por plataforma
Android (dispositivo físico con Expo Go): usa http://<IP_DE_TU_PC>:3000.
Android Emulator (AVD): el host se ve como http://10.0.2.2:3000.
iOS Simulator: normalmente funciona http://localhost:3000.

# Estructura relevante
frontend/
  app/
    login.tsx        # POST /auth/login
    register.tsx     # POST /auth/register
    api.ts           # helper para peticiones (usa EXPO_PUBLIC_API_URL)
  .env.example        # ejemplo a copiar (NO se sube .env)
  .gitignore          # ignora node_modules, .expo, .env

# Endpoints en uso
POST /auth/register → { email, password, name }
POST /auth/login → { email, password } → { token }
GET /health → ping del backend

## Problemas comunes
# “Network request failed” (Expo):
Verifica que el backend esté corriendo en tu PC.

# Confirmar que el API_URL mostrado en la consola de Expo coincide con tu .env.
Asegúrate de que el teléfono y la PC están en la misma red.

# Revisa firewall de Windows (permitir Node/puerto 3000).
Si no puedes usar IP local, usa ngrok.

# Cambio en .env y Expo no lo toma:
npx expo start -c

## Con emulador Android: usa http://10.0.2.2:3000 en .env.
# Errores de compilación por caché:
Detén Expo.
Borra caché: npx expo start -c.

# Convenciones del repo
No subir: frontend/.env, frontend/node_modules, frontend/.expo/.
Por eso existe frontend/.gitignore y .env.example (cada quien crea su .env local).

## Resumen express
cd frontend
npm install
cp .env.example .env     # o copiar/renombrar en Windows
# Edita .env -> EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000
cd ../backend
npm run dev
cd ../frontend
npx expo start -c


Si algo no te funciona, comparte capturas de:

lo que imprime Expo (API_URL = ...)

el error en pantalla/consola

y tu .env (ocultando datos sensibles).
