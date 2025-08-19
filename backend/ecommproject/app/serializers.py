from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Category, Product, CartItem, Order, OrderItem

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ("id", "email", "name", "mobile", "password", "password2")
    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords didn't match."})
        return attrs
    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "name", "mobile", "is_staff")

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "description", "created_at")

class ProductSerializer(serializers.ModelSerializer):
    #category = CategorySerializer(read_only=True)
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Product
        fields = ("id","title","description","image","price","stock","category","owner","created_at")
    def get_owner(self, obj):
        return {
            "id": obj.owner.id,
            "name": obj.owner.name,
            "email": obj.owner.email
        }

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Product.objects.all(), source="product")
    class Meta:
        model = CartItem
        fields = ("id", "product", "product_id", "quantity")

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ("id","product","quantity","unit_price")

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ("id","user","total_amount","status","created_at","address","items")
        read_only_fields = ("user","total_amount","status","created_at","items")
