package com.tribal.controller;

import com.tribal.dto.ReviewRequest;
import com.tribal.model.Cart;
import com.tribal.model.Order;
import com.tribal.model.Product;
import com.tribal.model.Review;
import com.tribal.model.Buyer;
import com.tribal.service.BuyerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/buyer")
public class BuyerController {

    @Autowired
    private BuyerService buyerService;

    // *************** PRODUCTS *********************

    @GetMapping("/products")
    public ResponseEntity<?> listProducts() {
        List<Product> products = buyerService.listProducts();
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No products available");
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<?> getProduct(@PathVariable Long productId) {
        try {
            Product product = buyerService.getProduct(productId);
            return ResponseEntity.ok(product);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No product found with ID: " + productId);
        }
    }

    // *************** CART *********************

    @PostMapping("/{buyerId}/cart/add/{productId}")
    public ResponseEntity<?> addToCart(@PathVariable Long buyerId,
                                       @PathVariable Long productId,
                                       @RequestParam(defaultValue = "1") int quantity) {
        try {
            Cart cart = buyerService.addToCart(buyerId, productId, quantity);
            return ResponseEntity.status(HttpStatus.CREATED).body(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/{buyerId}/cart")
    public ResponseEntity<?> getCart(@PathVariable Long buyerId) {
        List<Cart> cartItems = buyerService.getCart(buyerId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Cart is empty");
        }
        return ResponseEntity.ok(cartItems);
    }

    @PutMapping("/cart/{cartItemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long cartItemId,
                                            @RequestParam int quantity) {
        try {
            Cart updated = buyerService.updateCartItem(cartItemId, quantity);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found: " + cartItemId);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/cart/{cartItemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long cartItemId) {
        try {
            buyerService.removeCartItem(cartItemId);
            return ResponseEntity.ok("🗑️ Cart item removed: " + cartItemId);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found: " + cartItemId);
        }
    }

    // *************** ORDERS *********************

    @PostMapping("/{buyerId}/orders")
    public ResponseEntity<?> placeOrder(@PathVariable Long buyerId) {
        List<Order> orders = buyerService.placeOrder(buyerId);
        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Order could not be placed");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(orders);
    }

    @GetMapping("/{buyerId}/orders")
    public ResponseEntity<?> getOrders(@PathVariable Long buyerId) {
        List<Order> orders = buyerService.getOrders(buyerId);
        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No orders found for buyer: " + buyerId);
        }
        return ResponseEntity.ok(orders);
    }

    // *************** REVIEWS *********************

    @PostMapping("/reviews")
    public ResponseEntity<?> addReview(@Valid @RequestBody ReviewRequest req) {
        try {
            Review review = buyerService.addReview(req.getBuyerId(), req.getProductId(), req.getRating(), req.getComment());
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<?> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = buyerService.getProductReviews(productId);
        if (reviews.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No reviews for product ID: " + productId);
        }
        return ResponseEntity.ok(reviews);
    }

    // *************** WISHLIST *********************

    @PostMapping("/{buyerId}/wishlist/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long buyerId, @PathVariable Long productId) {
        try {
            Product p = buyerService.addToWishlist(buyerId, productId);
            return ResponseEntity.status(HttpStatus.CREATED).body(p);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{buyerId}/wishlist")
    public ResponseEntity<?> getWishlist(@PathVariable Long buyerId) {
        List<Product> items = buyerService.getWishlist(buyerId);
        if (items.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Wishlist is empty");
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/{buyerId}/wishlist/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long buyerId, @PathVariable Long productId) {
        buyerService.removeFromWishlist(buyerId, productId);
        return ResponseEntity.ok("Removed from wishlist: product " + productId);
    }

    // *************** PROFILE *********************

    @GetMapping("/{buyerId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long buyerId) {
        Buyer b = buyerService.getProfile(buyerId);
        if (b == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Buyer not found: " + buyerId);
        return ResponseEntity.ok(b);
    }

    @PutMapping("/{buyerId}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long buyerId, @RequestBody Buyer updated) {
        Buyer b = buyerService.updateProfile(buyerId, updated);
        if (b == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Buyer not found: " + buyerId);
        return ResponseEntity.ok(b);
    }

    // *************** SEARCH / FILTER *********************

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String keyword) {
        List<Product> products = buyerService.searchProducts(keyword);
        if (products.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No products match the search");
        return ResponseEntity.ok(products);
    }

    @GetMapping("/filter/category")
    public ResponseEntity<?> filterByCategory(@RequestParam String category) {
        List<Product> products = buyerService.filterProductsByCategory(category);
        if (products.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No products in category: " + category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/filter/price")
    public ResponseEntity<?> filterByPrice(@RequestParam double min, @RequestParam double max) {
        List<Product> products = buyerService.filterProductsByPriceRange(min, max);
        if (products.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No products in price range");
        return ResponseEntity.ok(products);
    }
}
