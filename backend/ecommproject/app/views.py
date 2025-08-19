from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Category, Product, CartItem, Order, OrderItem
from .serializers import (
    RegisterSerializer, UserSerializer, CategorySerializer,
    ProductSerializer, CartItemSerializer, OrderSerializer
)
from .permissions import IsAdminOrReadOnly, IsOwnerOrAdmin

# Custom token serializer to include user info
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["is_staff"] = user.is_staff
        return token
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({"user": UserSerializer(self.user).data})
        return data

class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = (AllowAny,)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)

# Logout (blacklist refresh)
class LogoutView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail":"Logged out"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error":"Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

# Product: create by authenticated users (owner set to request.user)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("owner","category").all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = (IsOwnerOrAdmin,)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        # Anyone can list/retrieve (handled by global IsAuthenticatedOrReadOnly),
        # For unsafe, require authentication + IsOwnerOrAdmin checked at object level
        if self.request.method in ("POST",):
            return [IsAuthenticated()]
        return super().get_permissions()


# List all products of logged-in user
class MyProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# Retrieve, Update, Delete only logged-in user’s products
class MyProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow the logged-in user’s own products
        return Product.objects.filter(owner=self.request.user)
    

    # @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    # def my_products(self, request):
    #     user = request.user
    #     if user.is_staff:
    #         qs = Product.objects.all()
    #     else:
    #         qs = Product.objects.filter(owner=user)
    #     page = self.paginate_queryset(qs)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return self.get_paginated_response(serializer.data)
    #     serializer = self.get_serializer(qs, many=True)
    #     return Response(serializer.data)

# Cart endpoints
from rest_framework.views import APIView

class CartView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        items = CartItem.objects.filter(user=request.user).select_related("product")
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        # add item (or increase quantity)
        serializer = CartItemSerializer(data=request.data, context={"request":request})
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        quantity = serializer.validated_data.get("quantity",1)
        obj, created = CartItem.objects.get_or_create(user=request.user, product=product,
                                                      defaults={"quantity": quantity})
        if not created:
            obj.quantity += quantity
            obj.save()
        return Response(CartItemSerializer(obj).data, status=status.HTTP_201_CREATED)

    def put(self, request):
        # update quantity: expects { "product_id": <id>, "quantity": <n> }
        product = Product.objects.filter(pk=request.data.get("product_id")).first()
        if not product:
            return Response({"detail":"Product not found"}, status=404)
        try:
            ci = CartItem.objects.get(user=request.user, product=product)
        except CartItem.DoesNotExist:
            return Response({"detail":"Item not in cart"}, status=404)
        qty = int(request.data.get("quantity", 1))
        if qty <= 0:
            ci.delete()
            return Response({"detail":"Item removed"}, status=200)
        ci.quantity = qty
        ci.save()
        return Response(CartItemSerializer(ci).data)

class RemoveCartItemView(generics.DestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        cart_item_id = kwargs.get("pk")
        try:
            cart_item = CartItem.objects.get(id=cart_item_id, user=request.user)
            cart_item.delete()
            return Response({"message": "Item removed"}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

# Place order
class PlaceOrderView(APIView):
    permission_classes = (IsAuthenticated,)

    @transaction.atomic
    def post(self, request):
        address = request.data.get("address", "")
        cart_items = CartItem.objects.select_related("product").filter(user=request.user)
        if not cart_items.exists():
            return Response({"detail":"Cart empty"}, status=400)
        total = 0
        for ci in cart_items:
            if ci.product.stock < ci.quantity:
                return Response({"detail":f"Not enough stock for {ci.product.title}"}, status=400)
            total += ci.product.price * ci.quantity

        order = Order.objects.create(user=request.user, total_amount=total, address=address, status="PLACED")
        order_items = []
        for ci in cart_items:
            OrderItem.objects.create(order=order, product=ci.product, quantity=ci.quantity, unit_price=ci.product.price)
            # reduce stock
            ci.product.stock = max(0, ci.product.stock - ci.quantity)
            ci.product.save()
        # clear cart
        cart_items.delete()
        return Response({"detail":"Order placed", "order_id": order.id}, status=201)

# Order history for user; admin can view all
class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.prefetch_related("items").all().order_by("-created_at")
        return Order.objects.prefetch_related("items").filter(user=user).order_by("-created_at")
