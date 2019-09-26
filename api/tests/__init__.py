from django.test import TestCase

class StatusTest(TestCase):
    def test_status_health_url(self):
        response = self.client.get('/api/status/health')
        self.assertEquals(response.status_code, 200)