# actividades/urls.py

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"api/actividades", views.ActivityViewSet, basename="activity")
router.register(r"api/torneos", views.TournamentViewSet, basename="tournament")
router.register(r"api/campanas", views.CommunicationCampaignViewSet, basename="campaign")
router.register(r"api/proyectos", views.VolunteerProjectViewSet, basename="project")
router.register(r"api/inscripciones", views.VolunteerRegistrationViewSet, basename="registration")
router.register(r"api/citas", views.PsychologicalSessionViewSet, basename="session")
router.register(r"api/actividad-inscripciones", views.ActivityEnrollmentViewSet, basename="activity-enrollment")


urlpatterns = [
    path("", views.login_view, name="login"),
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path("logout/", views.logout_view, name="logout"),
    path("index/", views.index, name="index"),
    path("api/login/", views.api_login),
    path("api/logout/", views.api_logout),
    path("api/session/", views.api_session),
    path("api/register/", views.api_register),
    path("api/csrf/", views.api_csrf),
    path("api/dashboard/", views.dashboard_summary),
    path("api/home/", views.beneficiary_summary),
    path("api/user/activities/", views.user_activities),
    path("", include(router.urls)),
]
