from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, LogoutView, CategoryListCreateView, MyProductListCreateView,
    MyProductDetailView,CategoryDetailView,ProductViewSet,
    CartView, PlaceOrderView, OrderViewSet,RemoveCartItemView
)

router = DefaultRouter()
router.register("products", ProductViewSet, basename="products")
router.register("orders", OrderViewSet, basename="orders")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path('admin/categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('admin/categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path("my-products/", MyProductListCreateView.as_view(), name="my-products"),
    path("my-products/<int:pk>/", MyProductDetailView.as_view(), name="my-product-detail"),
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/add/", CartView.as_view(), name="cart-add"),
    path("cart/update/", CartView.as_view(), name="cart-update"),
    path("cart/remove/<int:pk>/", RemoveCartItemView.as_view(), name="cart-remove"),
   
    path("place-order/", PlaceOrderView.as_view(), name="place-order"),
    #path("myorders/", OrderViewSet.as_view(), name="myorders"),
    path("", include(router.urls)),
]
