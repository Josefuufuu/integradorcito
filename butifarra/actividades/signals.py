from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import UserProfile


@receiver(post_save, sender=get_user_model())
def ensure_user_profile(sender, instance, created, **kwargs):
    """Create a profile for every user if it does not exist."""

    if created:
        UserProfile.objects.create(user=instance)
        return

    if not hasattr(instance, "profile"):
        UserProfile.objects.create(user=instance)
