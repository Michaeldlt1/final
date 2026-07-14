# Documentación de despliegue de BookTrack

## Resumen
BookTrack es una aplicación full-stack compuesta por un frontend desarrollado con Vite y un backend con FastAPI. El despliegue actual está preparado para ejecutarse en un VPS mediante contenedores Docker, con publicación automática desde GitHub Actions.

## Arquitectura actual
- Frontend: servido con Nginx en un contenedor Docker.
- Backend: ejecutado con Uvicorn en un contenedor Docker sobre el puerto 8000.
- Base de datos: PostgreSQL.
- Despliegue automático: GitHub Actions construye y publica las imágenes en GHCR y despliega en el VPS por SSH.

## Componentes de despliegue

### 1. VPS
El proyecto está preparado para desplegarse en un VPS remoto mediante SSH. La pipeline de GitHub Actions utiliza las credenciales almacenadas en secretos para conectar con el servidor y ejecutar los comandos de actualización de los contenedores.

Datos detectados en el repositorio:
- Host remoto configurado por GitHub Actions mediante `VPS_HOST`.
- Usuario remoto configurado mediante `VPS_USER`.
- Clave SSH configurada mediante `VPS_SSH_KEY`.
- Directorios de despliegue esperados en el servidor:
  - `/opt/apps/booktrack-api`
  - `/opt/apps/booktrack-web`

### 2. Portainer
No existe un archivo de configuración de Portainer dentro del repositorio, pero la arquitectura está preparada para ser gestionada desde un entorno Docker del VPS. En la práctica, Portainer puede utilizarse para:
- ver los contenedores del backend y frontend;
- revisar logs y recursos;
- reiniciar o recrear contenedores;
- administrar los stacks o servicios del servidor.

Recomendación:
- Registrar los servicios `booktrack-api` y `booktrack-web` en Portainer como contenedores o stacks para facilitar el monitoreo y la gestión operativa.

### 3. Traefik
No existe configuración de Traefik en el repositorio. La app ya está preparada para servir el frontend y el backend mediante contenedores, pero la exposición pública por dominio o subdominios debe configurarse en el VPS o en el proxy inverso correspondiente.

Datos observados que ayudan a esta integración:
- El frontend se expone en el puerto 80 del contenedor.
- El backend escucha en el puerto 8000.
- El dominio configurado en CORS es `https://caiza.byronrm.com`.

Recomendación:
- Configurar rutas en Traefik para exponer el frontend y el backend con reglas de enrutamiento claras.
- Usar el dominio `caiza.byronrm.com` como origen permitido para la API.

### 4. Base de datos
La aplicación está preparada para usar PostgreSQL.

Datos configurados:
- Motor: PostgreSQL
- Host esperado: `booktrack-postgres`
- Puerto: `5432`
- Base de datos: `booktrack`
- Usuario: `booktrack_admin`

Variable de entorno usada por la app:
- `DATABASE_URL`

Ejemplo detectado en el repositorio:
- `postgresql://booktrack_admin:***@booktrack-postgres:5432/booktrack`

> La contraseña real debe mantenerse en el entorno del servidor o en secretos y no debe exponerse en repositorios públicos.

### 5. GitHub Actions
El proyecto ya incluye un workflow de despliegue automático en `.github/workflows/deploy.yml`.

Funcionamiento:
1. Se dispara al hacer `push` a la rama `main`.
2. Construye y publica dos imágenes Docker en GHCR:
   - `ghcr.io/michaeldlt1/booktrack-api:latest`
   - `ghcr.io/michaeldlt1/booktrack-web:latest`
3. Conecta por SSH al VPS y ejecuta:
   - `docker compose pull`
   - `docker compose up -d --force-recreate`
   - limpieza de imágenes antiguas con `docker image prune -f`

### 6. Variables de entorno
El proyecto incluye un ejemplo de variables de entorno en `backend/.env.example` con los siguientes valores principales:
- `DATABASE_URL`
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES=1440`
- `CORS_ORIGINS=https://caiza.byronrm.com`

## Flujo de despliegue actual
1. El desarrollador hace `push` a `main`.
2. GitHub Actions construye las imágenes Docker.
3. Las imágenes se suben a GHCR.
4. El workflow accede al VPS por SSH.
5. Se actualizan los servicios del backend y frontend en sus respectivos directorios.
6. Los contenedores se recrean con la nueva imagen.

## Recomendaciones operativas
- Mantener los secretos de despliegue en GitHub Secrets y en variables de entorno del VPS.
- Usar Portainer para supervisar el estado de los contenedores en producción.
- Definir reglas de routing en Traefik para frontend y backend.
- Mantener la base de datos PostgreSQL en un contenedor o servicio estable y con respaldo periódico.
- Revisar periódicamente los logs del backend y del frontend para detectar problemas de inicio o dependencias.

## Notas
Este README documenta la configuración de despliegue que ya está implementada o inferida del repositorio. Si el entorno del VPS usa Portainer, Traefik o un stack Docker distinto, esos detalles pueden ajustarse en futuras versiones de esta documentación.

# URLS DEL PROYECTO
caiza.byronrm.com - front
pqmsf.byronrm.com - db
portainermsf.byronrm.com - portainer 
backtorre.byronrm.com - backend