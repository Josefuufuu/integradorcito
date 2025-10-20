from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('actividades', '0002_create_test_admin'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150, verbose_name='Título')),
                ('category', models.CharField(choices=[('DEPORTE', 'Deporte'), ('CULTURA', 'Cultura'), ('SALUD', 'Salud / PSU'), ('VOLUNTARIADO', 'Voluntariado')], default='DEPORTE', max_length=20, verbose_name='Categoría')),
                ('description', models.TextField(verbose_name='Descripción')),
                ('location', models.CharField(max_length=120, verbose_name='Lugar')),
                ('start', models.DateTimeField(verbose_name='Fecha y hora de inicio')),
                ('end', models.DateTimeField(verbose_name='Fecha y hora de fin')),
                ('capacity', models.PositiveIntegerField(verbose_name='Cupos disponibles')),
                ('seats_taken', models.PositiveIntegerField(default=0, verbose_name='Inscritos')),
                ('status', models.CharField(choices=[('DRAFT', 'Borrador'), ('OPEN', 'Inscripciones abiertas'), ('CLOSED', 'Cerrada'), ('FINISHED', 'Finalizada')], default='OPEN', max_length=15, verbose_name='Estado')),
                ('image_url', models.URLField(blank=True, max_length=500, verbose_name='Imagen')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='activities_created', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['start', 'title'],
            },
        ),
        migrations.CreateModel(
            name='CommunicationCampaign',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120, verbose_name='Nombre')),
                ('message', models.TextField(verbose_name='Mensaje')),
                ('channel', models.CharField(choices=[('EMAIL', 'Correo electrónico'), ('PUSH', 'Notificación push'), ('SMS', 'SMS')], default='EMAIL', max_length=15, verbose_name='Canal')),
                ('segment', models.CharField(choices=[('TODOS', 'Toda la comunidad'), ('ESTUDIANTES', 'Estudiantes'), ('COLABORADORES', 'Colaboradores')], default='TODOS', max_length=20, verbose_name='Segmento')),
                ('scheduled_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Programado para')),
                ('status', models.CharField(choices=[('BORRADOR', 'Borrador'), ('PROGRAMADA', 'Programada'), ('ENVIADA', 'Enviada'), ('CANCELADA', 'Cancelada')], default='PROGRAMADA', max_length=12, verbose_name='Estado')),
                ('metrics_sent', models.PositiveIntegerField(default=0, verbose_name='Enviados')),
                ('metrics_opened', models.PositiveIntegerField(default=0, verbose_name='Visualizaciones')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='campaigns_created', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-scheduled_at'],
            },
        ),
        migrations.CreateModel(
            name='PsychologicalSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150, verbose_name='Título')),
                ('counselor', models.CharField(max_length=120, verbose_name='Profesional')),
                ('start', models.DateTimeField(verbose_name='Inicio')),
                ('end', models.DateTimeField(verbose_name='Fin')),
                ('modality', models.CharField(choices=[('PRESENCIAL', 'Presencial'), ('VIRTUAL', 'Virtual'), ('HIBRIDA', 'Híbrida')], default='PRESENCIAL', max_length=15, verbose_name='Modalidad')),
                ('available_slots', models.PositiveIntegerField(default=0, verbose_name='Cupos disponibles')),
                ('location', models.CharField(blank=True, max_length=120, verbose_name='Lugar')),
                ('status', models.CharField(choices=[('DISPONIBLE', 'Disponible'), ('LLENO', 'Sin cupos'), ('FINALIZADA', 'Finalizada')], default='DISPONIBLE', max_length=15, verbose_name='Estado')),
                ('notes', models.TextField(blank=True, verbose_name='Notas')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['start'],
            },
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('ADMIN', 'Administrador CADI'), ('COORDINATOR', 'Coordinador CADI'), ('BENEFICIARIO', 'Beneficiario')], default='BENEFICIARIO', max_length=20, verbose_name='Rol')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='VolunteerProject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120, verbose_name='Nombre')),
                ('description', models.TextField(verbose_name='Descripción')),
                ('type', models.CharField(choices=[('PSU', 'Programa de Servicio Universitario'), ('VOLUNTARIADO', 'Voluntariado'), ('COMUNIDAD', 'Proyección social')], default='VOLUNTARIADO', max_length=20, verbose_name='Tipo')),
                ('area', models.CharField(blank=True, max_length=80, verbose_name='Área')),
                ('start_date', models.DateField(verbose_name='Inicio')),
                ('end_date', models.DateField(verbose_name='Fin')),
                ('state', models.CharField(choices=[('INSCRIPCION', 'Inscripción'), ('ACTIVO', 'En ejecución'), ('CERRADO', 'Cerrado')], default='INSCRIPCION', max_length=15, verbose_name='Estado')),
                ('total_slots', models.PositiveIntegerField(default=0, verbose_name='Cupo total')),
                ('confirmed_slots', models.PositiveIntegerField(default=0, verbose_name='Inscripciones confirmadas')),
                ('location', models.CharField(blank=True, max_length=120, verbose_name='Lugar')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='ActivityEnrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('PENDING', 'Pendiente'), ('CONFIRMED', 'Confirmada'), ('CANCELLED', 'Cancelada')], default='PENDING', max_length=12)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='actividades.activity')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activity_enrollments', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='VolunteerRegistration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=150, verbose_name='Nombre completo')),
                ('email', models.EmailField(max_length=254, verbose_name='Correo')),
                ('phone', models.CharField(blank=True, max_length=30, verbose_name='Teléfono')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registrations', to='actividades.volunteerproject')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddConstraint(
            model_name='activityenrollment',
            constraint=models.UniqueConstraint(fields=('activity', 'user'), name='unique_activity_enrollment'),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='format',
            field=models.CharField(max_length=40, verbose_name='Formato'),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='sport',
            field=models.CharField(choices=[('Fútbol', 'Fútbol'), ('Baloncesto', 'Baloncesto'), ('Voleibol', 'Voleibol'), ('Tenis de Mesa', 'Tenis de Mesa')], max_length=30, verbose_name='Deporte'),
        ),
    ]
