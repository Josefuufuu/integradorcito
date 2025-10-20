from django.contrib import admin

from . import models


@admin.register(models.Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "start",
        "end",
        "capacity",
        "seats_taken",
        "status",
    )
    list_filter = ("category", "status")
    search_fields = ("title", "description", "location")


@admin.register(models.Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ("name", "sport", "start_date", "end_date", "phase")
    search_fields = ("name", "sport")


@admin.register(models.CommunicationCampaign)
class CommunicationCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "channel",
        "segment",
        "scheduled_at",
        "status",
    )
    list_filter = ("channel", "segment", "status")
    search_fields = ("name", "message")


@admin.register(models.VolunteerProject)
class VolunteerProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "type",
        "state",
        "start_date",
        "end_date",
        "total_slots",
        "confirmed_slots",
    )
    list_filter = ("type", "state")
    search_fields = ("name", "area")


@admin.register(models.VolunteerRegistration)
class VolunteerRegistrationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "project", "created_at")
    search_fields = ("full_name", "email")
    autocomplete_fields = ("project",)


@admin.register(models.PsychologicalSession)
class PsychologicalSessionAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "counselor",
        "start",
        "modality",
        "available_slots",
        "status",
    )
    list_filter = ("modality", "status")
    search_fields = ("title", "counselor")


@admin.register(models.UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    list_filter = ("role",)
    search_fields = ("user__username", "user__first_name", "user__last_name")
