from django.utils.decorators import method_decorator
from rest_framework import exceptions
from . import models


def _action_auth_required(old_view):
    def new_view(request, *args, **kwargs):
        if not ('HTTP_AUTHORIZATION' in request.META):
            raise exceptions.NotAuthenticated("Authorization required")
        user = models.User.objects.filter(
            user_key=request.META.get('HTTP_AUTHORIZATION')
        ).first()
        if not user:
            raise exceptions.AuthenticationFailed("Invalid token")
        return old_view(request, user=user, *args, **kwargs)
    return new_view

action_auth_required = method_decorator(_action_auth_required)
