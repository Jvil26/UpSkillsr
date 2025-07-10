from django.core.management.base import BaseCommand
from skills.models import Skill
import csv


class Command(BaseCommand):
    help = "Prefill skills from a CSV file"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str, help="Name of csv file")

    def handle(self, *args, **kwargs):
        file_path = kwargs["file_path"]
        with open(file_path, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:
                name = row["skill"].strip().capitalize()
                category = row["category"].strip().capitalize()
                Skill.objects.get_or_create(category=category, name=name)
