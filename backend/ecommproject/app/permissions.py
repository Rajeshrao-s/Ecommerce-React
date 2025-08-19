from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    For categories and some admin-only ops:
    safe methods -> everyone
    write -> staff (is_staff)
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    For product edit/delete: owner or staff can modify, others read-only.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user and request.user.is_staff:
            return True
        return obj.owner == request.user
