#!/bin/bash

# Script de inicialización para Vision4K en Docker
echo "🚀 Iniciando configuración de Vision4K..."

# Generar APP_KEY si no existe
if [ -z "$APP_KEY" ]; then
    echo "🔑 Generando APP_KEY..."
    php artisan key:generate
fi

# Configurar permisos
echo "📁 Configurando permisos..."
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Ejecutar migraciones
echo "� Ejecutando migraciones..."
php artisan migrate --force

# Ejecutar seeders
echo "🌱 Ejecutando seeders..."
php artisan db:seed --class=AdminUserSeeder --force

# Limpiar y cachear configuración
echo "⚡ Cacheando configuración..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Actualizar certificados SSL
echo "🔒 Actualizando certificados SSL..."
php artisan ssl:update-certificates

# Instalar dependencias de Node.js si es necesario
if [ -f /var/www/html/package.json ]; then
    echo "📦 Instalando dependencias de Node.js..."
    npm install
    npm run build
fi

echo "✅ Configuración completada!"
echo "🌐 Aplicación disponible en: http://localhost:8000"
echo ""
echo "📋 Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f app"
echo "  - Ejecutar comandos: docker-compose exec app php artisan"
echo "  - Reiniciar: docker-compose restart"
