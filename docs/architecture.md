# 🏗️ Arquitectura del Sistema - Vision4K

## 📱 Descripción General

Vision4K es una aplicación web moderna construida con una arquitectura **MVC** (Model-View-Controller) utilizando **Laravel** en el backend y **React** en el frontend, conectados a través de **Inertia.js**.

## 🛠️ Stack Tecnológico

### Backend

- **Framework**: Laravel 12
- **Lenguaje**: PHP 8.2+
- **Base de Datos**: PostgreSQL (recomendado) / SQLite (desarrollo)
- **Autenticación**: Laravel Breeze + Inertia
- **Storage**: Laravel Storage (local/cloud)
- **Cache**: File/Redis (configurable)

### Frontend

- **Framework**: React 18
- **Lenguaje**: TypeScript
- **Bridge**: Inertia.js 2.0
- **Estilos**: Tailwind CSS 4.0
- **Build Tool**: Vite
- **UI Components**: Radix UI + Headless UI

### Herramientas de Desarrollo

- **Package Manager**: Composer (PHP) + npm (JS)
- **Linting**: ESLint + Prettier
- **Testing**: Pest (PHP) + Jest (JS)
- **Type Checking**: TypeScript

## 📁 Estructura del Proyecto

```
📁 Vision4K/
├── 📁 app/                                 # Código Laravel
│   ├── 📁 Http/
│   │   ├── 📁 Controllers/
│   │   │   ├── WallpaperController.php     # Gestión wallpapers + API
│   │   │   ├── CategoryController.php      # Gestión categorías
│   │   │   ├── DashboardController.php     # Panel administración
│   │   │   └── Auth/                       # Controladores autenticación
│   │   ├── 📁 Middleware/
│   │   │   ├── HandleInertiaRequests.php   # Middleware Inertia
│   │   │   └── CheckPremium.php            # Middleware premium
│   │   └── 📁 Requests/                    # Form Request validations
│   ├── 📁 Models/
│   │   ├── User.php                        # Usuario + lógica premium
│   │   ├── Wallpaper.php                   # Wallpaper + relaciones
│   │   ├── Category.php                    # Categorías
│   │   ├── Download.php                    # Tracking descargas
│   │   └── Favorite.php                    # Sistema favoritos
│   ├── 📁 Policies/
│   │   ├── WallpaperPolicy.php             # Permisos wallpapers
│   │   └── CategoryPolicy.php              # Permisos categorías
│   └── 📁 Providers/
│       └── AuthServiceProvider.php         # Registro policies
├── 📁 database/
│   ├── 📁 migrations/                      # Esquema base de datos
│   ├── 📁 seeders/                         # Datos de prueba
│   └── 📁 factories/                       # Factories para testing
├── 📁 resources/
│   ├── 📁 js/
│   │   ├── 📁 pages/                       # Páginas React
│   │   │   ├── Welcome.tsx                 # Página principal
│   │   │   ├── Categories/Index.tsx        # Lista categorías
│   │   │   ├── Trending.tsx               # Wallpapers trending
│   │   │   ├── Premium.tsx                # Contenido premium
│   │   │   └── Dashboard/                 # Panel admin
│   │   ├── 📁 components/                 # Componentes reutilizables
│   │   │   ├── WallpaperModal.tsx         # Modal wallpaper
│   │   │   ├── CategoryCard.tsx           # Tarjeta categoría
│   │   │   ├── Header.tsx                 # Header navegación
│   │   │   └── Footer.tsx                 # Footer
│   │   ├── 📁 layouts/                    # Layouts base
│   │   ├── 📁 hooks/                      # Custom React hooks
│   │   ├── 📁 lib/                        # Utilidades
│   │   └── 📁 types/                      # TypeScript types
│   └── 📁 css/
│       └── app.css                        # Estilos Tailwind
├── 📁 routes/
│   ├── web.php                            # Rutas web principales
│   ├── auth.php                           # Rutas autenticación
│   └── api.php                            # API endpoints (futuro)
├── 📁 storage/
│   ├── 📁 app/public/                     # Archivos públicos
│   │   ├── 📁 wallpapers/                 # Wallpapers originales
│   │   ├── 📁 thumbnails/                 # Miniaturas
│   │   └── 📁 categories/                 # Imágenes categorías
│   └── 📁 logs/                           # Logs aplicación
└── 📁 public/
    ├── 📁 build/                          # Assets compilados
    └── index.php                         # Entry point
```

## 🔄 Flujo de Datos

### 1. Request Lifecycle

```
Browser → Laravel Router → Controller → Model → Database
   ↓
Inertia.js ← View (React) ← Controller Response ← Model
   ↓
React Component Render
```

### 2. Flujo de Autenticación

```
Login Form → Auth Controller → Validation → User Model → Session
     ↓
Inertia Redirect → Dashboard → Middleware Check → Authorized Access
```

### 3. Flujo de Descarga

```
Click Download → WallpaperController → Policy Check → Download Model
      ↓
File Response ← Storage ← Analytics Tracking ← User Limit Check
```

## 🎯 Patrones de Diseño Implementados

### 1. **Repository Pattern** (Futuro)

```php
interface WallpaperRepositoryInterface {
    public function getTrending(): Collection;
    public function getPremium(): Collection;
    public function getByCategory(Category $category): Collection;
}
```

### 2. **Service Layer Pattern**

```php
class DownloadService {
    public function processDownload(User $user, Wallpaper $wallpaper): DownloadResponse;
    public function trackDownload(Download $download): void;
    public function checkLimits(User $user): bool;
}
```

### 3. **Policy Pattern**

```php
class WallpaperPolicy {
    public function download(User $user, Wallpaper $wallpaper): bool;
    public function view(User $user, Wallpaper $wallpaper): bool;
}
```

### 4. **Factory Pattern**

```php
class ThumbnailFactory {
    public static function create(string $type): ThumbnailGenerator;
}
```

## 📡 Comunicación Frontend-Backend

### Inertia.js Bridge

```javascript
// En React
const { data } = usePage<PageProps>();

// Navegación
router.visit('/wallpapers', {
    data: { category: 'nature' },
    preserveState: true
});

// Forms
const form = useForm({
    title: '',
    description: '',
    file: null
});
```

### Shared Data

```php
// En HandleInertiaRequests.php
public function share(Request $request): array {
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => [
            'message' => fn () => $request->session()->get('message'),
        ],
        'categories' => Category::active()->get(),
    ]);
}
```

## 🔐 Seguridad

### Middleware Stack

```php
Route::middleware(['auth', 'verified', 'premium'])->group(function () {
    Route::get('/premium', [WallpaperController::class, 'premium']);
});
```

### CSRF Protection

- Automático en todas las forms con Inertia
- Token incluido en meta tags

### Authorization

- Policies para cada modelo
- Gates para permisos específicos
- Middleware para verificar roles

## 📊 Performance y Optimización

### Database Optimization

- Índices en campos de búsqueda frecuente
- Eager loading para evitar N+1 queries
- Paginación en listados grandes

### Frontend Optimization

- Code splitting por rutas
- Lazy loading de imágenes
- Compresión de assets con Vite

### Caching Strategy

```php
// Cache de categorías
Cache::remember('categories.active', 3600, function () {
    return Category::active()->get();
});

// Cache de wallpapers trending
Cache::remember('wallpapers.trending', 1800, function () {
    return Wallpaper::trending()->limit(20)->get();
});
```

## 🔧 Configuración de Entorno

### Development

```env
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

### Production

```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
FILESYSTEM_DISK=s3
```

## 📈 Escalabilidad

### Horizontal Scaling

- Load balancer para múltiples instancias
- CDN para assets estáticos
- Separación de storage en cloud

### Vertical Scaling

- Optimización de queries
- Cache layers (Redis)
- Database indexing

### Microservices (Futuro)

- Servicio de procesamiento de imágenes
- Servicio de analytics
- Servicio de notificaciones

---

Esta arquitectura proporciona una base sólida, escalable y mantenible para Vision4K, permitiendo un desarrollo ágil y una experiencia de usuario excepcional.
