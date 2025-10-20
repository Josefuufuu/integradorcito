from django.conf import settings
from django.db import models
from django.utils import timezone


class UserProfile(models.Model):
    class Roles(models.TextChoices):
        ADMIN = "ADMIN", "Administrador CADI"
        COORDINATOR = "COORDINATOR", "Coordinador CADI"
        BENEFICIARY = "BENEFICIARIO", "Beneficiario"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    role = models.CharField(
        "Rol",
        max_length=20,
        choices=Roles.choices,
        default=Roles.BENEFICIARY,
    )

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.get_username()} ({self.get_role_display()})"


class Activity(models.Model):
    class Categories(models.TextChoices):
        SPORTS = "DEPORTE", "Deporte"
        CULTURE = "CULTURA", "Cultura"
        HEALTH = "SALUD", "Salud / PSU"
        VOLUNTEER = "VOLUNTARIADO", "Voluntariado"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Borrador"
        OPEN = "OPEN", "Inscripciones abiertas"
        CLOSED = "CLOSED", "Cerrada"
        FINISHED = "FINISHED", "Finalizada"

    title = models.CharField("Título", max_length=150)
    category = models.CharField(
        "Categoría",
        max_length=20,
        choices=Categories.choices,
        default=Categories.SPORTS,
    )
    description = models.TextField("Descripción")
    location = models.CharField("Lugar", max_length=120)
    start = models.DateTimeField("Fecha y hora de inicio")
    end = models.DateTimeField("Fecha y hora de fin")
    capacity = models.PositiveIntegerField("Cupos disponibles")
    seats_taken = models.PositiveIntegerField("Inscritos", default=0)
    status = models.CharField(
        "Estado",
        max_length=15,
        choices=Status.choices,
        default=Status.OPEN,
    )
    image_url = models.URLField("Imagen", max_length=500, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="activities_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start", "title"]

    def __str__(self):
        return self.title

    @property
    def available_seats(self):
        return max(self.capacity - self.seats_taken, 0)


class ActivityEnrollment(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendiente"
        CONFIRMED = "CONFIRMED", "Confirmada"
        CANCELLED = "CANCELLED", "Cancelada"

    activity = models.ForeignKey(
        Activity,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="activity_enrollments",
    )
    status = models.CharField(
        max_length=12,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("activity", "user")


class Tournament(models.Model):
    class Sports(models.TextChoices):
        FUTBOL = "Fútbol"
        BALONCESTO = "Baloncesto"
        VOLEIBOL = "Voleibol"
        TENIS_DE_MESA = "Tenis de Mesa"

    name = models.CharField("Nombre", max_length=100)
    sport = models.CharField("Deporte", max_length=30, choices=Sports.choices)
    format = models.CharField("Formato", max_length=40)
    max_teams = models.PositiveIntegerField("Equipos máximos")
    current_teams = models.PositiveIntegerField("Equipos inscritos", default=0)
    start_date = models.DateField("Fecha de inicio")
    end_date = models.DateField("Fecha de fin")
    description = models.TextField("Descripción", blank=True)
    phase = models.CharField("Fase", max_length=30, default="Planificación")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class CommunicationCampaign(models.Model):
    class Channels(models.TextChoices):
        EMAIL = "EMAIL", "Correo electrónico"
        PUSH = "PUSH", "Notificación push"
        SMS = "SMS", "SMS"

    class Segments(models.TextChoices):
        ALL = "TODOS", "Toda la comunidad"
        STUDENTS = "ESTUDIANTES", "Estudiantes"
        STAFF = "COLABORADORES", "Colaboradores"

    class Status(models.TextChoices):
        DRAFT = "BORRADOR", "Borrador"
        SCHEDULED = "PROGRAMADA", "Programada"
        SENT = "ENVIADA", "Enviada"
        CANCELLED = "CANCELADA", "Cancelada"

    name = models.CharField("Nombre", max_length=120)
    message = models.TextField("Mensaje")
    channel = models.CharField(
        "Canal",
        max_length=15,
        choices=Channels.choices,
        default=Channels.EMAIL,
    )
    segment = models.CharField(
        "Segmento",
        max_length=20,
        choices=Segments.choices,
        default=Segments.ALL,
    )
    scheduled_at = models.DateTimeField("Programado para", default=timezone.now)
    status = models.CharField(
        "Estado",
        max_length=12,
        choices=Status.choices,
        default=Status.SCHEDULED,
    )
    metrics_sent = models.PositiveIntegerField("Enviados", default=0)
    metrics_opened = models.PositiveIntegerField("Visualizaciones", default=0)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="campaigns_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-scheduled_at"]

    def __str__(self):
        return self.name


class VolunteerProject(models.Model):
    class Types(models.TextChoices):
        PSU = "PSU", "Programa de Servicio Universitario"
        VOLUNTEERING = "VOLUNTARIADO", "Voluntariado"
        COMMUNITY = "COMUNIDAD", "Proyección social"

    class States(models.TextChoices):
        REGISTRATION = "INSCRIPCION", "Inscripción"
        ACTIVE = "ACTIVO", "En ejecución"
        CLOSED = "CERRADO", "Cerrado"

    name = models.CharField("Nombre", max_length=120)
    description = models.TextField("Descripción")
    type = models.CharField(
        "Tipo",
        max_length=20,
        choices=Types.choices,
        default=Types.VOLUNTEERING,
    )
    area = models.CharField("Área", max_length=80, blank=True)
    start_date = models.DateField("Inicio")
    end_date = models.DateField("Fin")
    state = models.CharField(
        "Estado",
        max_length=15,
        choices=States.choices,
        default=States.REGISTRATION,
    )
    total_slots = models.PositiveIntegerField("Cupo total", default=0)
    confirmed_slots = models.PositiveIntegerField("Inscripciones confirmadas", default=0)
    location = models.CharField("Lugar", max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class VolunteerRegistration(models.Model):
    project = models.ForeignKey(
        VolunteerProject,
        on_delete=models.CASCADE,
        related_name="registrations",
    )
    full_name = models.CharField("Nombre completo", max_length=150)
    email = models.EmailField("Correo")
    phone = models.CharField("Teléfono", max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} - {self.project.name}"


class PsychologicalSession(models.Model):
    class Modalities(models.TextChoices):
        PRESENTIAL = "PRESENCIAL", "Presencial"
        VIRTUAL = "VIRTUAL", "Virtual"
        HYBRID = "HIBRIDA", "Híbrida"

    class Status(models.TextChoices):
        AVAILABLE = "DISPONIBLE", "Disponible"
        FULL = "LLENO", "Sin cupos"
        FINISHED = "FINALIZADA", "Finalizada"

    title = models.CharField("Título", max_length=150)
    counselor = models.CharField("Profesional", max_length=120)
    start = models.DateTimeField("Inicio")
    end = models.DateTimeField("Fin")
    modality = models.CharField(
        "Modalidad",
        max_length=15,
        choices=Modalities.choices,
        default=Modalities.PRESENTIAL,
    )
    available_slots = models.PositiveIntegerField("Cupos disponibles", default=0)
    location = models.CharField("Lugar", max_length=120, blank=True)
    status = models.CharField(
        "Estado",
        max_length=15,
        choices=Status.choices,
        default=Status.AVAILABLE,
    )
    notes = models.TextField("Notas", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start"]

    def __str__(self):
        return self.title
