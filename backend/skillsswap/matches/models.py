from django.db import models

# Create your models here.
class MatchRequest(models.Model):
    from_user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='sent_requests')
    to_user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='received_requests')

    skills_offered_by_from_user = models.ForeignKey('users.UserSkill', on_delete=models.CASCADE, related_name='offer_matches')
    skills_offered_by_to_user = models.ForeignKey('users.UserSkill', on_delete=models.CASCADE, related_name='want_matches')

    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user', 'skills_offered_by_from_user', 'skills_offered_by_to_user')

