import os
import sys
import django
from django.conf import settings

# Add the project directory to the sys.path
project_path = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_path)

# Configure Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "butifarra.settings")
django.setup()
