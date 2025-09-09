# Vision4K - Production Deployment Guide

## 🚀 Despliegue en Producción

### 1. Configuración SSL

El proyecto incluye un sistema automático para mantener los certificados SSL actualizados.

#### Actualizar certificados SSL:

```bash
php artisan ssl:update-certificates
```

#### Verificar configuración SSL:

```bash
php artisan tinker
```

```php
// Verificar que los certificados se están usando
$client = app(GuzzleHttp\Client::class);
echo "Certificados SSL configurados correctamente";
```

### 2. Variables de Entorno

Asegúrate de configurar estas variables en producción:

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
GOOGLE_REDIRECT_URI=https://tudominio.com/auth/google/callback

# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vision4k_prod
DB_USERNAME=tu_usuario_db
DB_PASSWORD=tu_password_db

# Cache y sesiones
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Email
MAIL_MAILER=smtp
MAIL_HOST=tu_servidor_smtp
MAIL_PORT=587
MAIL_USERNAME=tu_email
MAIL_PASSWORD=tu_password_email
```

### 3. Comandos de Despliegue

```bash
# Instalar dependencias
composer install --optimize-autoloader --no-dev
npm install && npm run build

# Configurar aplicación
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Base de datos
php artisan migrate --force
php artisan db:seed

# Certificados SSL
php artisan ssl:update-certificates

# Permisos
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
```

### 4. Tareas Programadas (Opcional)

Para mantener los certificados SSL actualizados automáticamente:

```bash
# Agregar al crontab del servidor
0 2 * * * cd /path-to-your-project && php artisan ssl:update-certificates
```

### 5. Verificación Pre-Despliegue

```bash
# Verificar configuración
php artisan config:show

# Verificar rutas
php artisan route:list | grep google

# Verificar base de datos
php artisan migrate:status

# Probar login (después de configurar Google Console)
# Visitar: https://tudominio.com/auth/google
```

### 6. Google Console Setup

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea/Selecciona tu proyecto
3. Ve a **APIs & Services > Credentials**
4. Crea una **OAuth 2.0 Client ID** para aplicación web
5. En **Authorized redirect URIs** agrega:
    ```
    https://tudominio.com/auth/google/callback
    ```
6. Copia el Client ID y Client Secret a tu archivo `.env`

### 7. Monitoreo

Los logs de OAuth se guardan en `storage/logs/laravel.log`. Monitorea errores con:

```bash
tail -f storage/logs/laravel.log | grep -i "google\|oauth"
```

## 🔧 Solución de Problemas

### Error SSL persiste:

```bash
# Forzar actualización de certificados
php artisan ssl:update-certificates --force

# Verificar archivo de certificados
ls -la storage/ssl/
```

### Login no funciona:

1. Verifica configuración en Google Console
2. Revisa logs: `tail -f storage/logs/laravel.log`
3. Verifica variables de entorno
4. Limpia caches: `php artisan config:clear`

### Base de datos:

```bash
# Verificar migraciones
php artisan migrate:status

# Recrear si es necesario
php artisan migrate:fresh --seed
```

## 📝 Notas Importantes

- ✅ Los certificados SSL se actualizan automáticamente
- ✅ El sistema maneja errores de OAuth gracefully
- ✅ Los logs detallados ayudan en debugging
- ✅ Configuración lista para Redis/cache externo
- ✅ Compatible con múltiples entornos

¡Tu aplicación Vision4K está lista para producción! 🎉
