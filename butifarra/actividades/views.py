import json
from datetime import timedelta

from django import forms
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

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
from .serializers import (
    ActivitySerializer,
    ActivityEnrollmentSerializer,
    CommunicationCampaignSerializer,
    PsychologicalSessionSerializer,
    TournamentSerializer,
    VolunteerProjectSerializer,
    VolunteerRegistrationSerializer,
)


def index(request):
    return HttpResponse("Bienvenidos al Centro Artístico y Deportivo")


def login_view(request):
    from django.contrib.auth.forms import AuthenticationForm

    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("index")
    else:
        form = AuthenticationForm()

    return render(request, "login.html", {"form": form})


def register_view(request):
    if request.method == "POST":
        form = ApiRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("/")
    else:
        form = ApiRegistrationForm()

    return render(request, "register.html", {"form": form})


def logout_view(request):
    logout(request)
    return redirect("/")


def _get_user_role(user):
    try:
        return user.profile.role
    except UserProfile.DoesNotExist:
        return UserProfile.Roles.BENEFICIARY


def _serialize_user(user):
    return {
        "id": user.id,
        "username": user.get_username(),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": _get_user_role(user),
    }


def _load_body(request):
    try:
        if not request.body:
            return {}
        return json.loads(request.body.decode("utf-8"))
    except (TypeError, ValueError, json.JSONDecodeError):
        return None


def _resolve_username(identifier):
    if not identifier:
        return None

    if "@" not in identifier:
        return identifier

    UserModel = get_user_model()
    try:
        user = UserModel.objects.get(email__iexact=identifier)
    except UserModel.DoesNotExist:
        return None

    return user.get_username()


class ApiRegistrationForm(forms.ModelForm):
    password1 = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = get_user_model()
        fields = ("username", "email", "first_name", "last_name")

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Las contraseñas no coinciden.")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data["password1"]
        user.set_password(password)
        if commit:
            user.save()
        return user


@csrf_exempt
def api_login(request):
    if request.method != "POST":
        return JsonResponse({"ok": False, "error": "Method not allowed"}, status=405)

    payload = _load_body(request)
    if payload is None:
        return JsonResponse({"ok": False, "error": "Invalid JSON"}, status=400)

    identifier = payload.get("username") or payload.get("email")
    password = payload.get("password")

    if not identifier or not password:
        return JsonResponse({"ok": False, "error": "Missing credentials"}, status=400)

    username = _resolve_username(identifier)
    if username is None:
        username = identifier

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"ok": False, "error": "Invalid credentials"}, status=401)

    login(request, user)
    return JsonResponse({"ok": True, "user": _serialize_user(user)}, status=200)


@csrf_exempt
def api_logout(request):
    if request.method != "POST":
        return JsonResponse({"ok": False, "error": "Method not allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"ok": False, "error": "Not authenticated"}, status=401)

    logout(request)
    return JsonResponse({"ok": True}, status=200)


@csrf_exempt
def api_session(request):
    if request.method != "GET":
        return JsonResponse({"ok": False, "error": "Method not allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"ok": False}, status=401)

    return JsonResponse({"ok": True, "user": _serialize_user(request.user)}, status=200)


@csrf_exempt
def api_register(request):
    if request.method != "POST":
        return JsonResponse({"ok": False, "error": "Method not allowed"}, status=405)

    payload = _load_body(request)
    if payload is None:
        return JsonResponse({"ok": False, "error": "Invalid JSON"}, status=400)

    form = ApiRegistrationForm(payload)
    if not form.is_valid():
        errors = {
            field: [str(error) for error in error_list]
            for field, error_list in form.errors.items()
        }
        return JsonResponse({"ok": False, "errors": errors}, status=400)

    user = form.save()
    login(request, user)
    return JsonResponse({"ok": True, "user": _serialize_user(user)}, status=200)


class IsAdminOrCoordinatorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if not request.user.is_authenticated:
            return False

        role = _get_user_role(request.user)
        return role in {UserProfile.Roles.ADMIN, UserProfile.Roles.COORDINATOR}


class IsAdminOrCoordinator(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        role = _get_user_role(request.user)
        return role in {UserProfile.Roles.ADMIN, UserProfile.Roles.COORDINATOR}


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAdminOrCoordinatorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAdminOrCoordinatorOrReadOnly]


class CommunicationCampaignViewSet(viewsets.ModelViewSet):
    queryset = CommunicationCampaign.objects.all()
    serializer_class = CommunicationCampaignSerializer
    permission_classes = [IsAdminOrCoordinatorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class VolunteerProjectViewSet(viewsets.ModelViewSet):
    queryset = VolunteerProject.objects.all()
    serializer_class = VolunteerProjectSerializer
    permission_classes = [IsAdminOrCoordinatorOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        estado = self.request.query_params.get("estado")
        if estado:
            qs = qs.filter(state__iexact=estado)
        return qs


class VolunteerRegistrationViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = VolunteerRegistration.objects.select_related("project")
    serializer_class = VolunteerRegistrationSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAdminOrCoordinator()]
        return [permissions.IsAuthenticated()]


class PsychologicalSessionViewSet(viewsets.ModelViewSet):
    queryset = PsychologicalSession.objects.all()
    serializer_class = PsychologicalSessionSerializer
    permission_classes = [IsAdminOrCoordinatorOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        upcoming = self.request.query_params.get("upcoming")
        if upcoming:
            now = timezone.now()
            qs = qs.filter(start__gte=now)
        return qs


class ActivityEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = ActivityEnrollment.objects.select_related("activity", "user")
    serializer_class = ActivityEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        if _get_user_role(self.request.user) == UserProfile.Roles.BENEFICIARY:
            qs = qs.filter(user=self.request.user)
        return qs


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard_summary(request):
    if _get_user_role(request.user) not in {
        UserProfile.Roles.ADMIN,
        UserProfile.Roles.COORDINATOR,
    }:
        return Response({"detail": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)

    now = timezone.now()
    week_ahead = now + timedelta(days=7)

    activities = Activity.objects.filter(start__gte=now).count()
    projects = VolunteerProject.objects.filter(state=VolunteerProject.States.REGISTRATION).count()
    tournaments = Tournament.objects.count()
    sessions = PsychologicalSession.objects.filter(start__range=(now, week_ahead)).count()
    campaigns = CommunicationCampaign.objects.count()

    return Response(
        {
            "ok": True,
            "metrics": {
                "upcoming_activities": activities,
                "active_projects": projects,
                "registered_tournaments": tournaments,
                "sessions_this_week": sessions,
                "campaigns": campaigns,
            },
            "recent_campaigns": CommunicationCampaignSerializer(
                CommunicationCampaign.objects.all()[:5], many=True
            ).data,
            "recent_activities": ActivitySerializer(
                Activity.objects.order_by("-created_at")[:5], many=True
            ).data,
        }
    )


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def beneficiary_summary(request):
    now = timezone.now()
    upcoming_activities = list(
        Activity.objects.filter(start__gte=now).order_by("start")[:6]
    )
    upcoming_sessions = list(
        PsychologicalSession.objects.filter(start__gte=now).order_by("start")[:3]
    )
    highlighted_campaigns = CommunicationCampaign.objects.filter(
        segment__in=[
            CommunicationCampaign.Segments.ALL,
            CommunicationCampaign.Segments.STUDENTS,
        ]
    ).order_by("-scheduled_at")[:3]

    enrollments = ActivityEnrollment.objects.filter(
        user=request.user, status=ActivityEnrollment.Status.CONFIRMED
    ).count()

    session_count = PsychologicalSession.objects.filter(
        status=PsychologicalSession.Status.AVAILABLE
    ).count()

    return Response(
        {
            "ok": True,
            "stats": {
                "upcoming": len(upcoming_activities),
                "enrollments": enrollments,
                "appointments": session_count,
                "favorites": 0,
            },
            "highlights": ActivitySerializer(upcoming_activities, many=True).data,
            "sessions": PsychologicalSessionSerializer(upcoming_sessions, many=True).data,
            "campaigns": CommunicationCampaignSerializer(
                highlighted_campaigns, many=True
            ).data,
        }
    )


@ensure_csrf_cookie
def api_csrf(request):
    if request.method != "GET":
        return JsonResponse({"ok": False, "error": "Method not allowed"}, status=405)

    token = get_token(request)
    return JsonResponse({"ok": True, "csrftoken": token}, status=200)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def user_activities(request):
    enrollments = (
        ActivityEnrollment.objects.select_related("activity")
        .filter(user=request.user)
        .order_by("activity__start")
    )

    serialized = []
    for enrollment in enrollments:
        data = ActivitySerializer(enrollment.activity).data
        data["enrollment_id"] = enrollment.id
        data["enrollment_status"] = enrollment.status
        serialized.append(data)

    return Response(serialized)
