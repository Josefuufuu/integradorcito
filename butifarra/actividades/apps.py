from django.apps import AppConfig


class ActividadesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "actividades"

    def ready(self):
        # Import signal handlers.
        from . import signals  # noqa: F401
