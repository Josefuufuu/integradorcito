# Credenciales de prueba

Para desarrollar y validar las funcionalidades que requieren autenticación (por ejemplo, crear torneos) se puede utilizar el superusuario que se crea automáticamente cuando el proyecto corre con `DEBUG=True`.

- **Usuario:** `torneos_admin`
- **Correo:** `torneos_admin@example.com`
- **Contraseña:** `torneos123`

Asegúrate de haber ejecutado las migraciones de Django para que el usuario se cree:

```bash
python manage.py migrate
```

Una vez iniciada la sesión desde el frontend, las peticiones autenticadas (como la creación o edición de torneos) se realizarán con la cookie de sesión configurada y ya no deberían devolver `401 Unauthorized`.
