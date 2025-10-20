# josephpi

## Configuración de cookies de sesión y CSRF

El backend de Django permite ajustar las banderas de las cookies para que el frontend pueda
recuperar la sesión tanto en entornos HTTP locales como en despliegues bajo HTTPS.

| Variable | Valor por defecto | Cuándo cambiarla |
| --- | --- | --- |
| `SESSION_COOKIE_SAMESITE` | `Lax` | Usa `None` solo cuando el frontend consuma la API desde otro dominio servido bajo HTTPS. |
| `CSRF_COOKIE_SAMESITE` | `Lax` | Igual que la variable anterior. |
| `SESSION_COOKIE_SECURE` | `True` si `SESSION_COOKIE_SAMESITE=None`, en caso contrario `False` | Activa `True` solo en despliegues HTTPS que necesiten `SameSite=None`. |
| `CSRF_COOKIE_SECURE` | `True` si `CSRF_COOKIE_SAMESITE=None`, en caso contrario `False` | Igual que la variable anterior. |

### Desarrollo local (HTTP)

No necesitas tocar ninguna variable de entorno: las cookies se enviarán con `SameSite=Lax` y
las banderas `Secure` desactivadas, por lo que funcionarán con `python manage.py runserver`.

### Despliegue con HTTPS

1. Establece `SESSION_COOKIE_SAMESITE=None` y `CSRF_COOKIE_SAMESITE=None` en tu entorno.
2. Opcionalmente puedes fijar explícitamente `SESSION_COOKIE_SECURE=True` y
   `CSRF_COOKIE_SECURE=True` (se activan automáticamente cuando `SameSite=None`).
3. Ejecuta Django tras un terminador TLS o usa certificados locales, por ejemplo:

   ```bash
   python manage.py runserver 0.0.0.0:8000 --cert-file /ruta/a/cert.pem --key-file /ruta/a/key.pem
   ```

   Cualquier configuración que exponga la aplicación bajo HTTPS (Nginx, Caddy, etc.) es válida.

Con esta configuración el frontend podrá seguir recuperando la sesión sin que el navegador
bloquee las cookies en función del entorno.

## Puesta en marcha rápida

### Backend (Django)

1. Ve al directorio del backend e instala las dependencias mínimas:

   ```bash
   cd butifarra
   python -m venv .venv
   source .venv/bin/activate  # En Windows: .venv\\Scripts\\activate
   pip install "django==5.2.5" "djangorestframework==3.15.2" "django-cors-headers==4.6.0"
   ```

2. Ejecuta las migraciones (incluyen datos de demostración listos para usar):

   ```bash
   python manage.py migrate
   python manage.py runserver 0.0.0.0:8000
   ```

   La migración `0004_seed_initial_content` crea tres cuentas base y pobla actividades,
   torneos, proyectos PSU y citas psicológicas.

3. Opcionalmente puedes volver a poblar la base de datos desde cero usando el script SQL local:

   ```bash
   sqlite3 db.sqlite3 < sample_data.sql
   ```

   El script inserta los mismos registros de demostración y puede reutilizarse siempre que
   la base de datos esté vacía.

### Frontend (Vite + React)

1. Instala las dependencias y levanta el servidor de desarrollo:

   ```bash
   cd butifarra-frontend/frontend-cadi
   npm install
   npm run dev
   ```

2. La aplicación consume la API de Django en `http://localhost:8000`. Asegúrate de iniciar el
   backend con antelación para que las peticiones autenticadas funcionen (las cookies de sesión
   se comparten gracias a la configuración CORS/CSRF explicada arriba).

### Cuentas de demostración

Tras las migraciones tendrás estas credenciales disponibles:

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador CADI | `admin_cadi` | `Admin123!` |
| Coordinador CADI | `coordinador_cadi` | `Coordinador123` |
| Beneficiario | `beneficiario_demo` | `Beneficiario123` |

Los botones del panel administrativo y del portal de beneficiarios están conectados a la API
real y utilizan la base de datos SQLite local (`db.sqlite3`).

### Navegación por roles

La plataforma muestra una única barra lateral dinámica con los accesos permitidos según el rol
del usuario autenticado:

| Rol | Inicio | Opciones destacadas |
| --- | --- | --- |
| Beneficiario | `/inicio` | Explorar actividades (`/actividades`), torneos (`/torneos`), PSU y voluntariados (`/psu`) y citas psicológicas (`/citas`). |
| Coordinador CADI | `/admin/inicio` | Puede acceder a todas las secciones administrativas (gestión de actividades, torneos, campañas, reportes y personas) además de las páginas para beneficiarios. |
| Administrador CADI | `/admin/inicio` | Mismas opciones que el coordinador con privilegios completos de creación y edición. |

Todos los botones y enlaces del panel redirigen a las vistas correspondientes del frontend y
consumen los servicios REST del backend.
