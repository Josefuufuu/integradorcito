from datetime import timedelta

from django.db import migrations
from django.utils import timezone


ADMIN_USERNAME = "admin_cadi"
COORDINATOR_USERNAME = "coordinador_cadi"
BENEFICIARY_USERNAME = "beneficiario_demo"


def _ensure_user(apps, username, password, *, first_name, last_name, email, role, is_staff=False, is_superuser=False):
    User = apps.get_model("auth", "User")
    UserProfile = apps.get_model("actividades", "UserProfile")

    now = timezone.now()
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "is_staff": is_staff,
            "is_superuser": is_superuser,
            "is_active": True,
            "date_joined": now,
        },
    )

    if created:
        user.set_password(password)
        user.save()
    else:
        updated = False
        for field, value in (
            ("email", email),
            ("first_name", first_name),
            ("last_name", last_name),
        ):
            if getattr(user, field) != value:
                setattr(user, field, value)
                updated = True
        if user.is_staff != is_staff:
            user.is_staff = is_staff
            updated = True
        if user.is_superuser != is_superuser:
            user.is_superuser = is_superuser
            updated = True
        if not user.is_active:
            user.is_active = True
            updated = True
        if updated:
            user.save(update_fields=["email", "first_name", "last_name", "is_staff", "is_superuser", "is_active"])

    UserProfile.objects.update_or_create(user=user, defaults={"role": role})
    return user


def seed_initial_data(apps, schema_editor):  # noqa: ARG001
    Activity = apps.get_model("actividades", "Activity")
    ActivityEnrollment = apps.get_model("actividades", "ActivityEnrollment")
    CommunicationCampaign = apps.get_model("actividades", "CommunicationCampaign")
    PsychologicalSession = apps.get_model("actividades", "PsychologicalSession")
    Tournament = apps.get_model("actividades", "Tournament")
    VolunteerProject = apps.get_model("actividades", "VolunteerProject")
    VolunteerRegistration = apps.get_model("actividades", "VolunteerRegistration")

    admin = _ensure_user(
        apps,
        ADMIN_USERNAME,
        "Admin123!",
        first_name="Ana",
        last_name="Cadiz",
        email="admin.cadi@example.com",
        role="ADMIN",
        is_staff=True,
        is_superuser=True,
    )
    coordinator = _ensure_user(
        apps,
        COORDINATOR_USERNAME,
        "Coordinador123",
        first_name="Carlos",
        last_name="Arango",
        email="coordinador.cadi@example.com",
        role="COORDINATOR",
        is_staff=True,
        is_superuser=False,
    )
    beneficiary = _ensure_user(
        apps,
        BENEFICIARY_USERNAME,
        "Beneficiario123",
        first_name="Laura",
        last_name="Ríos",
        email="beneficiario.demo@example.com",
        role="BENEFICIARIO",
        is_staff=False,
        is_superuser=False,
    )

    now = timezone.now()
    two_hours = timedelta(hours=2)

    def day_at(days: int, hour: int, minute: int = 0):
        return (now + timedelta(days=days)).replace(
            hour=hour,
            minute=minute,
            second=0,
            microsecond=0,
        )

    yoga_activity, _ = Activity.objects.update_or_create(
        title="Yoga al amanecer",
        defaults={
            "category": "DEPORTE",
            "description": "Sesión guiada de yoga para iniciar el día con energía.",
            "location": "Terraza Bienestar",
            "start": day_at(2, 7),
            "end": day_at(2, 7) + two_hours,
            "capacity": 25,
            "seats_taken": 12,
            "status": "OPEN",
            "image_url": "https://images.unsplash.com/photo-1552196563-55cd4e45efb3",
            "created_by_id": admin.id,
        },
    )

    dance_activity, _ = Activity.objects.update_or_create(
        title="Danza urbana intermedia",
        defaults={
            "category": "CULTURA",
            "description": "Coreografía urbana para mejorar coordinación y ritmo.",
            "location": "Salón 302-C",
            "start": day_at(4, 18),
            "end": day_at(4, 18) + two_hours,
            "capacity": 30,
            "seats_taken": 8,
            "status": "OPEN",
            "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            "created_by_id": coordinator.id,
        },
    )

    ActivityEnrollment.objects.update_or_create(
        activity=yoga_activity,
        user=beneficiary,
        defaults={"status": "CONFIRMED"},
    )
    Activity.objects.filter(pk=yoga_activity.pk).update(seats_taken=yoga_activity.enrollments.count())

    Tournament.objects.update_or_create(
        name="Liga interna de baloncesto",
        defaults={
            "sport": "Baloncesto",
            "format": "Todos contra todos",
            "max_teams": 8,
            "current_teams": 5,
            "start_date": (now + timedelta(days=10)).date(),
            "end_date": (now + timedelta(days=40)).date(),
            "description": "Competencia universitaria con fase final.",
            "phase": "Convocatoria",
        },
    )

    mindfulness_project, _ = VolunteerProject.objects.update_or_create(
        name="Acompañamiento Mindfulness",
        defaults={
            "description": "Programa PSU enfocado en respiración consciente para estudiantes de primer semestre.",
            "type": "PSU",
            "area": "Bienestar emocional",
            "start_date": (now + timedelta(days=3)).date(),
            "end_date": (now + timedelta(days=60)).date(),
            "state": "INSCRIPCION",
            "total_slots": 40,
            "confirmed_slots": 12,
            "location": "Sala múltiple CADI",
        },
    )

    volunteering_project, _ = VolunteerProject.objects.update_or_create(
        name="Voluntariado Hospitalario",
        defaults={
            "description": "Acompañamiento a pacientes pediátricos en clínicas aliadas.",
            "type": "VOLUNTARIADO",
            "area": "Proyección social",
            "start_date": (now + timedelta(days=15)).date(),
            "end_date": (now + timedelta(days=120)).date(),
            "state": "INSCRIPCION",
            "total_slots": 25,
            "confirmed_slots": 5,
            "location": "Clínica Valle Salud",
        },
    )

    VolunteerRegistration.objects.update_or_create(
        project=mindfulness_project,
        email=beneficiary.email,
        defaults={
            "full_name": f"{beneficiary.first_name} {beneficiary.last_name}",
            "phone": "+57 320 000 0000",
        },
    )
    VolunteerProject.objects.filter(pk=mindfulness_project.pk).update(
        confirmed_slots=mindfulness_project.registrations.count()
    )

    CommunicationCampaign.objects.update_or_create(
        name="Nueva agenda de acompañamiento",
        defaults={
            "message": "Agenda abierta para citas psicológicas del mes de abril.",
            "channel": "EMAIL",
            "segment": "ESTUDIANTES",
            "scheduled_at": now + timedelta(days=1),
            "status": "PROGRAMADA",
            "metrics_sent": 120,
            "metrics_opened": 86,
            "created_by_id": admin.id,
        },
    )

    CommunicationCampaign.objects.update_or_create(
        name="Convocatoria voluntariado cultural",
        defaults={
            "message": "Inscríbete y comparte tu talento artístico con comunidades aliadas.",
            "channel": "PUSH",
            "segment": "TODOS",
            "scheduled_at": now + timedelta(days=5),
            "status": "BORRADOR",
            "metrics_sent": 0,
            "metrics_opened": 0,
            "created_by_id": coordinator.id,
        },
    )

    PsychologicalSession.objects.update_or_create(
        title="Sesión grupal manejo del estrés",
        defaults={
            "counselor": "Psic. Diana Torres",
            "start": day_at(3, 14),
            "end": day_at(3, 14) + timedelta(hours=1, minutes=30),
            "modality": "PRESENCIAL",
            "available_slots": 6,
            "location": "Consultorio 2",
            "status": "DISPONIBLE",
            "notes": "Traer ropa cómoda.",
        },
    )

    PsychologicalSession.objects.update_or_create(
        title="Orientación individual primeros semestres",
        defaults={
            "counselor": "Psic. Andrés Gil",
            "start": day_at(5, 10),
            "end": day_at(5, 10) + timedelta(hours=1),
            "modality": "VIRTUAL",
            "available_slots": 3,
            "location": "Microsoft Teams",
            "status": "DISPONIBLE",
            "notes": "El enlace se enviará 24 horas antes.",
        },
    )


def unseed_initial_data(apps, schema_editor):  # noqa: ARG001
    Activity = apps.get_model("actividades", "Activity")
    CommunicationCampaign = apps.get_model("actividades", "CommunicationCampaign")
    PsychologicalSession = apps.get_model("actividades", "PsychologicalSession")
    Tournament = apps.get_model("actividades", "Tournament")
    VolunteerProject = apps.get_model("actividades", "VolunteerProject")
    VolunteerRegistration = apps.get_model("actividades", "VolunteerRegistration")
    User = apps.get_model("auth", "User")

    Activity.objects.filter(title__in=["Yoga al amanecer", "Danza urbana intermedia"]).delete()
    CommunicationCampaign.objects.filter(
        name__in=["Nueva agenda de acompañamiento", "Convocatoria voluntariado cultural"]
    ).delete()
    PsychologicalSession.objects.filter(
        title__in=[
            "Sesión grupal manejo del estrés",
            "Orientación individual primeros semestres",
        ]
    ).delete()
    Tournament.objects.filter(name="Liga interna de baloncesto").delete()
    VolunteerRegistration.objects.filter(email__in=["beneficiario.demo@example.com"]).delete()
    VolunteerProject.objects.filter(
        name__in=["Acompañamiento Mindfulness", "Voluntariado Hospitalario"]
    ).delete()

    usernames = [ADMIN_USERNAME, COORDINATOR_USERNAME, BENEFICIARY_USERNAME]
    User.objects.filter(username__in=usernames).delete()


def forwards(apps, schema_editor):  # noqa: D401, ARG001
    """Populate the platform with demo records for local usage."""
    seed_initial_data(apps, schema_editor)


def backwards(apps, schema_editor):  # noqa: D401, ARG001
    """Remove the demo records created for local usage."""
    unseed_initial_data(apps, schema_editor)


class Migration(migrations.Migration):
    dependencies = [
        ("actividades", "0003_platform_models"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
