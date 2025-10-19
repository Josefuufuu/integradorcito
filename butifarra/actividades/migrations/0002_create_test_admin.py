from django.conf import settings
from django.db import migrations

def create_test_admin(apps, schema_editor):
    if not settings.DEBUG:
        return

    User = apps.get_model('auth', 'User')
    username = 'torneos_admin'
    if User.objects.filter(username=username).exists():
        return

    user = User.objects.create_user(
        username=username,
        email='torneos_admin@example.com',
        password='torneos123'
    )
    user.first_name = 'Admin'
    user.last_name = 'Torneos'
    user.is_staff = True
    user.is_superuser = True
    user.save()


def remove_test_admin(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    User.objects.filter(username='torneos_admin').delete()


class Migration(migrations.Migration):
    dependencies = [
        ('actividades', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_test_admin, remove_test_admin),
    ]
