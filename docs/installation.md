# 📦 Instalación - Vision4K

## 🚀 Instalación Rápida

### 📋 Requisitos Previos

- **PHP**: 8.2 o superior
- **Composer**: Última versión
- **Node.js**: 18+ y npm/yarn
- **Base de Datos**: PostgreSQL 13+ (recomendado) o MySQL 8+
- **Extensiones PHP**: fileinfo, gd, imagick (opcional)

### 🛠️ Configuración del Entorno

#### 1. Clonar el Proyecto

```bash
git clone <repository-url> vision4k
cd vision4k
```

#### 2. Instalar Dependencias PHP

```bash
composer install
```

#### 3. Instalar Dependencias JavaScript

```bash
npm install
# o
yarn install
```

#### 4. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate
```

#### 5. Configurar Base de Datos

Editar `.env` con tus credenciales:

**Para PostgreSQL** (Recomendado):

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=vision4k
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**Para MySQL**:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vision4k
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### 6. Ejecutar Migraciones y Seeders

```bash
# Ejecutar migraciones
php artisan migrate

# Ejecutar seeders (datos de prueba)
php artisan db:seed
```

#### 7. Configurar Storage

```bash
# Crear enlaces simbólicos para storage público
php artisan storage:link

# Crear directorios necesarios
mkdir -p storage/app/public/wallpapers
mkdir -p storage/app/public/thumbnails
mkdir -p storage/app/public/categories
```

#### 8. Compilar Assets

```bash
# Para desarrollo
npm run dev

# Para producción
npm run build
```

#### 9. Levantar el Servidor

```bash
# Servidor de desarrollo
php artisan serve

# Con puerto específico
php artisan serve --port=8080
```

---

## 🐳 Docker (Alternativa)

### Dockerfile

```dockerfile
FROM php:8.2-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pgsql pdo_pgsql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Crear usuario del sistema
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www

# Copiar código fuente
COPY . /var/www
COPY --chown=www:www . /var/www

# Cambiar al directorio de trabajo
WORKDIR /var/www

# Cambiar al usuario www
USER www

# Exponer puerto
EXPOSE 9000
CMD ["php-fpm"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
    app:
        build:
            context: .
            dockerfile: Dockerfile
        container_name: vision4k-app
        restart: unless-stopped
        working_dir: /var/www
        volumes:
            - ./:/var/www
        networks:
            - vision4k-network

    webserver:
        image: nginx:alpine
        container_name: vision4k-nginx
        restart: unless-stopped
        ports:
            - '8000:80'
        volumes:
            - ./:/var/www
            - ./docker/nginx:/etc/nginx/conf.d/
        networks:
            - vision4k-network

    database:
        image: postgres:15
        container_name: vision4k-db
        restart: unless-stopped
        environment:
            POSTGRES_DB: vision4k
            POSTGRES_USER: vision4k
            POSTGRES_PASSWORD: secret
        volumes:
            - postgres_data:/var/lib/postgresql/data
        ports:
            - '5432:5432'
        networks:
            - vision4k-network

    redis:
        image: redis:alpine
        container_name: vision4k-redis
        restart: unless-stopped
        ports:
            - '6379:6379'
        networks:
            - vision4k-network

volumes:
    postgres_data:

networks:
    vision4k-network:
        driver: bridge
```

### Comandos Docker

```bash
# Levantar containers
docker-compose up -d

# Ejecutar migraciones
docker-compose exec app php artisan migrate

# Instalar dependencias
docker-compose exec app composer install
docker-compose exec app npm install

# Ver logs
docker-compose logs -f app
```

---

## ⚙️ Configuración Avanzada

### 📧 Configuración de Email

#### Usando Mailtrap (Desarrollo)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@vision4k.com"
MAIL_FROM_NAME="Vision4K"
```

#### Usando Gmail (Producción)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@vision4k.com"
MAIL_FROM_NAME="Vision4K"
```

### 🗄️ Configuración de Cache

#### Redis (Recomendado para Producción)

```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

#### File Cache (Desarrollo)

```env
CACHE_DRIVER=file
SESSION_DRIVER=file
```

### 📁 Configuración de Almacenamiento

#### Local Storage

```env
FILESYSTEM_DISK=local
```

#### Amazon S3

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your_bucket_name
AWS_USE_PATH_STYLE_ENDPOINT=false
```

#### CloudFlare R2

```env
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET=your_bucket_name
CLOUDFLARE_R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
```

### 🔍 Configuración de Búsqueda

#### MeiliSearch (Recomendado)

```env
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=your_master_key
```

Instalar MeiliSearch:

```bash
# macOS
brew install meilisearch

# Ubuntu
curl -L https://install.meilisearch.com | sh

# Docker
docker run -it --rm -p 7700:7700 getmeili/meilisearch:latest
```

#### Configurar índices:

```bash
php artisan scout:import "App\\Models\\Wallpaper"
```

### 🖼️ Configuración de Imágenes

#### Intervention Image (ya incluido)

```env
# Calidad de compresión (1-100)
IMAGE_COMPRESSION_QUALITY=85

# Tamaños de thumbnails
THUMBNAIL_WIDTH=400
THUMBNAIL_HEIGHT=300

# Tamaños de preview
PREVIEW_WIDTH=1200
PREVIEW_HEIGHT=800
```

#### ImageMagick (Opcional, mejor rendimiento)

```bash
# Ubuntu
sudo apt-get install php-imagick

# macOS
brew install imagemagick
pecl install imagick
```

Configurar en `.env`:

```env
IMAGE_DRIVER=imagick
```

---

## 🔒 Configuración de Seguridad

### 🛡️ Variables de Seguridad

```env
# Clave de aplicación (NUNCA compartir)
APP_KEY=base64:generated_key

# Entorno de aplicación
APP_ENV=production
APP_DEBUG=false

# URL de la aplicación
APP_URL=https://your-domain.com

# Configuración de sesiones
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax

# Rate Limiting
RATE_LIMIT_DOWNLOADS=100  # Descargas por hora por IP
RATE_LIMIT_API=60         # Requests por minuto por IP
```

### 🔐 Configuración de Autenticación

```env
# JWT (si usas Laravel Sanctum)
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,your-domain.com

# OAuth (opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://your-domain.com/auth/github/callback
```

---

## 🚀 Comandos de Despliegue

### 🔄 Script de Actualización

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando despliegue..."

# Activar modo mantenimiento
php artisan down

# Actualizar código
git pull origin main

# Instalar/actualizar dependencias
composer install --no-dev --optimize-autoloader
npm ci

# Ejecutar migraciones
php artisan migrate --force

# Limpiar cachés
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Compilar assets
npm run build

# Optimizar aplicación
php artisan optimize

# Reiniciar caches
php artisan queue:restart

# Salir del modo mantenimiento
php artisan up

echo "✅ Despliegue completado!"
```

### 📊 Configuración de Monitoreo

#### Laravel Telescope (Desarrollo)

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

#### Laravel Horizon (Colas)

```bash
composer require laravel/horizon
php artisan horizon:install
php artisan migrate
```

Configurar supervisor:

```ini
[program:horizon]
process_name=%(program_name)s
command=php /path/to/vision4k/artisan horizon
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/path/to/vision4k/horizon.log
```

### 🔧 Configuración de Cron Jobs

```bash
# Editar crontab
crontab -e

# Añadir línea para Laravel Scheduler
* * * * * cd /path/to/vision4k && php artisan schedule:run >> /dev/null 2>&1
```

---

## ✅ Verificación de Instalación

### 🧪 Tests de Funcionamiento

```bash
# Ejecutar tests
php artisan test

# Test específico de funcionalidad
php artisan test --filter=WallpaperTest

# Test de performance
php artisan test --filter=PerformanceTest
```

### 🔍 Verificación Manual

1. **✅ Página Principal**: http://localhost:8000
2. **✅ Dashboard**: http://localhost:8000/dashboard
3. **✅ API Status**: http://localhost:8000/api/health
4. **✅ Storage Links**: Verificar que las imágenes se muestran correctamente

### 📋 Checklist Post-Instalación

- [ ] Base de datos conectada y migrada
- [ ] Storage configurado y enlazado
- [ ] Assets compilados
- [ ] Email configurado y testado
- [ ] Cache funcionando
- [ ] Cron jobs configurados
- [ ] Logs escribiendo correctamente
- [ ] SSL configurado (producción)
- [ ] Backup automatizado configurado
- [ ] Monitoreo activo

---

## 🆘 Resolución de Problemas

### 🐛 Errores Comunes

#### Error: "Class not found"

```bash
composer dump-autoload
```

#### Error: "Permission denied" en storage

```bash
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

#### Error en migraciones

```bash
# Resetear migraciones
php artisan migrate:fresh --seed

# Ver estado de migraciones
php artisan migrate:status
```

#### Assets no cargan

```bash
# Limpiar y recompilar
npm run clean
npm run build

# Verificar enlaces
php artisan storage:link
```

### 📞 Soporte

Para problemas específicos, revisar:

1. **Logs**: `storage/logs/laravel.log`
2. **Documentación**: Carpeta `docs/`
3. **Issues**: GitHub issues del proyecto
4. **Discord**: Canal de soporte del proyecto

---

¡Tu instalación de Vision4K está lista! 🎉
