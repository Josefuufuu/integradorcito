# actividades/urls.py

from django.urls import path

from . import views

urlpatterns = [
    path('', views.login_view, name='login'),  # Ruta principal de la aplicación
    path('login/', views.login_view, name='login'),  # Ruta para iniciar sesión
    path('register/', views.register_view, name='register'),  # Ruta para registro
    path('logout/', views.logout_view, name='logout'),
    path('index/', views.index, name='index'),  # Ruta para la página principal
    path('api/login/', views.api_login),
    path('api/logout/', views.api_logout),
    path('api/session/', views.api_session),
    # POST JSON payload: {"username", "email", "password1", "password2"}
    path('api/register/', views.api_register),
]
