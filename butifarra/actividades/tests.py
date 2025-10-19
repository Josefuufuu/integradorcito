import json

from django.contrib.auth import get_user_model
from django.test import TestCase


class RegistrationTests(TestCase):
    def test_api_register_logs_in_user(self):
        payload = {
            "username": "api_user",
            "email": "api_user@example.com",
            "password1": "super-secret-123",
            "password2": "super-secret-123",
        }

        response = self.client.post(
            "/api/register/",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertTrue(data.get("ok"))
        self.assertIn("user", data)

        User = get_user_model()
        created_user = User.objects.get(username=payload["username"])
        self.assertEqual(str(created_user.pk), self.client.session.get("_auth_user_id"))
        self.assertEqual(created_user.email, payload["email"])
