from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Task.objects.filter(owner=self.request.user)

        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)

        priority_param = self.request.query_params.get('priority')
        if priority_param:
            qs = qs.filter(priority=priority_param)

        search = self.request.query_params.get('search')
        if search:
            from django.db.models import Q
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))

        ordering = self.request.query_params.get('ordering')
        allowed_ordering = {'due_date', '-due_date', 'priority', '-priority', 'created_at', '-created_at'}
        if ordering in allowed_ordering:
            qs = qs.order_by(ordering)

        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
