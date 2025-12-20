package com.tribal.service;

import com.tribal.model.Cart;
import com.tribal.model.Order;
import com.tribal.model.Product;
import com.tribal.model.Review;
import com.tribal.model.Buyer;

import java.util.List;

public interface BuyerService {
    // Products
    List<Product> listProducts();
    Product getProduct(Long productId);

    // Cart
    Cart addToCart(Long buyerId, Long productId, int quantity);
    List<Cart> getCart(Long buyerId);
    Cart updateCartItem(Long cartItemId, int quantity);
    void removeCartItem(Long cartItemId);

    // Orders
    List<Order> placeOrder(Long buyerId);
    List<Order> getOrders(Long buyerId);

    // Reviews
    Review addReview(Long buyerId, Long productId, int rating, String comment);
    List<Review> getProductReviews(Long productId);

    // --- WISHLIST ---
    Product addToWishlist(Long buyerId, Long productId);
    List<Product> getWishlist(Long buyerId);
    void removeFromWishlist(Long buyerId, Long productId);

    // --- PROFILE ---
    Buyer getProfile(Long buyerId);
    Buyer updateProfile(Long buyerId, Buyer updatedBuyer);

    // --- SEARCH / FILTER ---
    List<Product> searchProducts(String keyword);
    List<Product> filterProductsByCategory(String category);
    List<Product> filterProductsByPriceRange(double min, double max);
}
