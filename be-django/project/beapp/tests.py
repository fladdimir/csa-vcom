from django.test import TestCase

from .models import Truck


class exampleTestCase(TestCase):
    def test_1(self):
        truck_name = "truck_1"
        Truck.objects.create(name=truck_name)
        truck = Truck.objects.get(name=truck_name)
        self.assertEqual(truck.name, truck_name)
