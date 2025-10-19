# actividades/models.py
from django.db import models
from django.utils.translation import gettext_lazy as _

class Tournament(models.Model):
    class Sports(models.TextChoices):
        FUTBOL = "Fútbol"
        BALONCESTO = "Baloncesto"
        VOLEIBOL = "Voleibol"
        TENIS_DE_MESA = "Tenis de Mesa"

    name = models.CharField(_("Nombre"), max_length=100)
    sport = models.CharField(_("Deporte"), max_length=20, choices=Sports.choices)
    format = models.CharField(_("Formato"), max_length=20)  # Round-robin, Eliminación directa, etc.
    max_teams = models.PositiveIntegerField(_("Equipos máximos"))
    current_teams = models.PositiveIntegerField(_("Equipos inscritos"), default=0)
    start_date = models.DateField(_("Fecha de inicio"))
    end_date = models.DateField(_("Fecha de fin"))
    description = models.TextField(_("Descripción"), blank=True)
    phase = models.CharField(_("Fase"), max_length=30, default="Planificación")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
