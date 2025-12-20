package com.tribal.service.impl;

import com.tribal.model.*;
import com.tribal.repository.*;
import com.tribal.service.BuyerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BuyerServiceImpl implements BuyerService {

    private final ProductRepository productRepository;
    private final BuyerRepository buyerRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final WishlistRepository wishlistRepository;

    public BuyerServiceImpl(ProductRepository productRepository,
                            BuyerRepository buyerRepository,
                            CartRepository cartRepository,
                            OrderRepository orderRepository,
                            ReviewRepository reviewRepository,
                            WishlistRepository wishlistRepository) {
        this.productRepository = productRepository;
        this.buyerRepository = buyerRepository;
        this.cartRepository = cartRepository;
        this.reviewRepository = reviewRepository;
        this.wishlistRepository = wishlistRepository;
        this.orderRepository = orderRepository;
    }

    // --------------------- Products ---------------------
    @Override
    public List<Product> listProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + productId));
    }

    // ----------------------- Cart -----------------------
    @Override
    @Transactional
    public Cart addToCart(Long buyerId, Long productId, int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be > 0");
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new NoSuchElementException("Buyer not found: " + buyerId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + productId));

        if (product.getStock() != null && product.getStock() < quantity) {
            throw new IllegalStateException("Insufficient stock");
        }

        Optional<Cart> existing = cartRepository.findByBuyerIdAndProductIdAndOrderIsNull(buyerId, productId);
        if (existing.isPresent()) {
            Cart item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartRepository.save(item);
        }

        Cart cart = Cart.builder()
                .buyer(buyer)
                .product(product)
                .quantity(quantity)
                .build();
        return cartRepository.save(cart);
    }

    @Override
    public List<Cart> getCart(Long buyerId) {
        return cartRepository.findByBuyerIdAndOrderIsNull(buyerId);
    }

    @Override
    @Transactional
    public Cart updateCartItem(Long cartItemId, int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be > 0");
        Cart item = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new NoSuchElementException("Cart item not found: " + cartItemId));
        if (item.getOrder() != null) throw new IllegalStateException("Cannot update an item already placed in order");
        item.setQuantity(quantity);
        return cartRepository.save(item);
    }

    @Override
    @Transactional
    public void removeCartItem(Long cartItemId) {
        Cart item = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new NoSuchElementException("Cart item not found: " + cartItemId));
        cartRepository.delete(item);
    }

    // ---------------------- Orders ----------------------
    @Override
    @Transactional
    public List<Order> placeOrder(Long buyerId) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new NoSuchElementException("Buyer not found: " + buyerId));
        List<Cart> activeCart = cartRepository.findByBuyerIdAndOrderIsNull(buyerId);
        if (activeCart.isEmpty()) return Collections.emptyList();

        Map<Seller, List<Cart>> grouped = activeCart.stream()
                .collect(Collectors.groupingBy(c -> c.getProduct().getSeller()));

        List<Order> created = new ArrayList<>();
        for (Map.Entry<Seller, List<Cart>> entry : grouped.entrySet()) {
            Seller seller = entry.getKey();
            List<Cart> items = entry.getValue();
            double total = items.stream()
                    .mapToDouble(i -> Optional.ofNullable(i.getProduct().getPrice()).orElse(0.0) * i.getQuantity())
                    .sum();
            Order order = Order.builder()
                    .buyer(buyer)
                    .seller(seller)
                    .status("Pending")
                    .totalAmount(total)
                    .build();
            order = orderRepository.save(order);
            for (Cart item : items) {
                item.setOrder(order);
                cartRepository.save(item);
                
                // Decrement product stock
                Product product = item.getProduct();
                if (product.getStock() != null && product.getStock() >= item.getQuantity()) {
                    product.setStock(product.getStock() - item.getQuantity());
                    productRepository.save(product);
                }
            }
            created.add(order);
        }
        return created;
    }

    @Override
    public List<Order> getOrders(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    // ---------------------- Reviews ---------------------
    @Override
    public Review addReview(Long buyerId, Long productId, int rating, String comment) {
        if (rating < 1 || rating > 5) throw new IllegalArgumentException("Rating must be 1..5");
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new NoSuchElementException("Buyer not found: " + buyerId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + productId));
        Review review = Review.builder()
                .buyer(buyer)
                .product(product)
                .rating(rating)
                .comment(comment)
                .build();
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    // --------------------- Wishlist ---------------------
    @Override
    @Transactional
    public Product addToWishlist(Long buyerId, Long productId) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new NoSuchElementException("Buyer not found: " + buyerId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + productId));
        Optional<Wishlist> existing = wishlistRepository.findByBuyerIdAndProductId(buyerId, productId);
        if (existing.isPresent()) {
            return product; // already in wishlist
        }
        Wishlist wl = Wishlist.builder().buyer(buyer).product(product).build();
        wishlistRepository.save(wl);
        return product;
    }

    @Override
    public List<Product> getWishlist(Long buyerId) {
        return wishlistRepository.findByBuyerId(buyerId).stream()
                .map(Wishlist::getProduct)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long buyerId, Long productId) {
        wishlistRepository.deleteByBuyerIdAndProductId(buyerId, productId);
    }

    // ---------------------- Profile ---------------------
    @Override
    public Buyer getProfile(Long buyerId) {
        return buyerRepository.findById(buyerId).orElse(null);
    }

    @Override
    @Transactional
    public Buyer updateProfile(Long buyerId, Buyer updatedBuyer) {
        Optional<Buyer> opt = buyerRepository.findById(buyerId);
        if (opt.isEmpty()) return null;
        Buyer b = opt.get();
        if (updatedBuyer.getName() != null) b.setName(updatedBuyer.getName());
        if (updatedBuyer.getEmail() != null) b.setEmail(updatedBuyer.getEmail());
        if (updatedBuyer.getPassword() != null) b.setPassword(updatedBuyer.getPassword());
        if (updatedBuyer.getConfirmPassword() != null) b.setConfirmPassword(updatedBuyer.getConfirmPassword());
        if (updatedBuyer.getPhone() != null) b.setPhone(updatedBuyer.getPhone());
        if (updatedBuyer.getAddress() != null) b.setAddress(updatedBuyer.getAddress());
        if (updatedBuyer.getPincode() != null) b.setPincode(updatedBuyer.getPincode());
        return buyerRepository.save(b);
    }

    // ------------------ Search / Filter -----------------
    @Override
    public List<Product> searchProducts(String keyword) {
        if (keyword == null) keyword = "";
        return productRepository.searchByKeyword(keyword);
    }
    @Override
    public List<Product> filterProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    @Override
    public List<Product> filterProductsByPriceRange(double min, double max) {
        return productRepository.findByPriceBetween(min, max);
    }
}
