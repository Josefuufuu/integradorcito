from django.db import transaction
from django.db.models import F
from django.utils import timezone
from rest_framework import serializers

from .models import (
    Activity,
    ActivityEnrollment,
    CommunicationCampaign,
    PsychologicalSession,
    Tournament,
    UserProfile,
    VolunteerProject,
    VolunteerRegistration,
)


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField(allow_blank=True)
    last_name = serializers.CharField(allow_blank=True)
    role = serializers.CharField()


class ActivitySerializer(serializers.ModelSerializer):
    start_date = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()
    available_seats = serializers.IntegerField(read_only=True)

    class Meta:
        model = Activity
        fields = (
            "id",
            "title",
            "category",
            "description",
            "location",
            "start",
            "end",
            "start_date",
            "start_time",
            "end_time",
            "capacity",
            "seats_taken",
            "available_seats",
            "status",
            "image_url",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "seats_taken",
            "available_seats",
            "created_at",
            "updated_at",
        )

    def get_start_date(self, obj):
        return obj.start.date().isoformat()

    def get_start_time(self, obj):
        return obj.start.time().strftime("%H:%M")

    def get_end_time(self, obj):
        return obj.end.time().strftime("%H:%M")

    def validate(self, attrs):
        start = attrs.get("start", getattr(self.instance, "start", None))
        end = attrs.get("end", getattr(self.instance, "end", None))

        if start and end and end <= start:
            raise serializers.ValidationError("La hora de fin debe ser posterior a la de inicio.")

        return attrs


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = "__all__"


class CommunicationCampaignSerializer(serializers.ModelSerializer):
    scheduled_at = serializers.DateTimeField(default_timezone=timezone.get_current_timezone())

    class Meta:
        model = CommunicationCampaign
        fields = (
            "id",
            "name",
            "message",
            "channel",
            "segment",
            "scheduled_at",
            "status",
            "metrics_sent",
            "metrics_opened",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("metrics_sent", "metrics_opened", "created_at", "updated_at")


class VolunteerProjectSerializer(serializers.ModelSerializer):
    inscripciones_confirmadas = serializers.SerializerMethodField()

    class Meta:
        model = VolunteerProject
        fields = (
            "id",
            "name",
            "description",
            "type",
            "area",
            "start_date",
            "end_date",
            "state",
            "total_slots",
            "confirmed_slots",
            "inscripciones_confirmadas",
            "location",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("confirmed_slots", "created_at", "updated_at")

    def get_inscripciones_confirmadas(self, obj):
        return obj.confirmed_slots


class VolunteerRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerRegistration
        fields = ("id", "project", "full_name", "email", "phone", "created_at")
        read_only_fields = ("created_at",)

    def validate_project(self, value):
        if value.state != VolunteerProject.States.REGISTRATION:
            raise serializers.ValidationError("El proyecto no admite nuevas inscripciones.")
        return value

    def create(self, validated_data):
        project = validated_data["project"]
        with transaction.atomic():
            VolunteerProject.objects.filter(pk=project.pk).update(
                confirmed_slots=F("confirmed_slots") + 1
            )
            project.refresh_from_db(fields=["confirmed_slots"])
            registration = super().create(validated_data)
        return registration


class PsychologicalSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PsychologicalSession
        fields = (
            "id",
            "title",
            "counselor",
            "start",
            "end",
            "modality",
            "available_slots",
            "location",
            "status",
            "notes",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class ActivityEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityEnrollment
        fields = ("id", "activity", "user", "status", "created_at")
        read_only_fields = ("created_at",)


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = UserProfile
        fields = ("user", "role")
