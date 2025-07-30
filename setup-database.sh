#!/bin/bash

# Script para configurar la base de datos de Vision4K
echo "🚀 Configurando base de datos Vision4K..."

# Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
php artisan migrate --force

# Poblar la base de datos
echo "🌱 Poblando base de datos..."
php artisan db:populate --force

# Crear enlace simbólico para storage
echo "🔗 Creando enlace simbólico para storage..."
php artisan storage:link

# Limpiar cache
echo "🧹 Limpiando cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "✅ Base de datos configurada exitosamente!"
echo "🔑 Credenciales de administrador:"
echo "   Email: admin@vision4k.com"
echo "   Password: password"
echo ""
echo "🌐 Para acceder al dashboard, inicia sesión y ve a /dashboard"
