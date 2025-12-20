package com.tribal.service;

import com.tribal.dto.ChatbotRequest;
import com.tribal.dto.ChatbotResponse;
import com.tribal.model.Product;
import com.tribal.model.Order;
import com.tribal.repository.ProductRepository;
import com.tribal.repository.OrderRepository;
import com.tribal.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {
    
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final SellerRepository sellerRepository;
    
    public ChatbotResponse processMessage(ChatbotRequest request) {
        String message = request.getMessage().toLowerCase().trim();
        String userRole = request.getUserRole();
        Long userId = request.getUserId();
        
        // Debug logging for all requests
        System.out.println("=== CHATBOT REQUEST DEBUG ===");
        System.out.println("Message: " + message);
        System.out.println("User Role: " + userRole);
        System.out.println("User ID: " + userId);
        System.out.println("=============================");
        
        // Welcome message
        if (isGreeting(message)) {
            return buildWelcomeResponse(userRole);
        }
        
        // Product search
        if (isProductSearch(message)) {
            return handleProductSearch(message);
        }
        
        // Order tracking
        if (isOrderTracking(message)) {
            return handleOrderTracking(message, userId);
        }
        
        // FAQ handling
        if (isFAQ(message)) {
            return handleFAQ(message);
        }
        
        // Role-specific queries
        switch (userRole) {
            case "SELLER":
                return handleSellerQuery(message, userId);
            case "ADMIN":
                return handleAdminQuery(message);
            case "BUYER":
                return handleBuyerQuery(message, userId);
            default:
                return handleGuestQuery(message);
        }
    }
    
    private boolean isGreeting(String message) {
        return message.matches(".*(hello|hi|hey|namaste|start|help).*");
    }
    
    private boolean isProductSearch(String message) {
        return message.matches(".*(show|find|search|products?|items?|handicraft|pottery|jewelry|textile|filter|category|price|range|more).*");
    }
    
    private boolean isOrderTracking(String message) {
        return message.matches(".*(track|order|status|#\\d+|details|reorder|specific|my orders|show.*order).*");
    }
    
    private boolean isFAQ(String message) {
        return message.matches(".*(shipping|return|refund|payment|contact|policy|about|vanvyaapaar).*");
    }
    
    private ChatbotResponse buildWelcomeResponse(String userRole) {
        String welcomeMessage;
        List<String> suggestions;
        
        switch (userRole) {
            case "BUYER":
                welcomeMessage = "🙏 Namaste! I'm VanMitra, your forest friend and guide at VanVyaapaar. \n\n🎨 Ready to explore authentic tribal crafts? I'm here to help you discover beautiful handmade treasures and assist with your shopping journey!";
                suggestions = Arrays.asList(
                    "🏺 Show handicraft products",
                    "📦 Track my orders", 
                    "🚚 Shipping policy",
                    "❓ How to place order?"
                );
                break;
            case "SELLER":
                welcomeMessage = "🙏 Namaste! I'm VanMitra, your trusted companion for growing your artisan business! \n\n🌟 Let me help you manage your beautiful creations and connect with customers who appreciate authentic tribal crafts.";
                suggestions = Arrays.asList(
                    "📋 Show my orders",
                    "➕ How to add product?",
                    "🔍 Check product status", 
                    "📖 Seller guidelines"
                );
                break;
            case "ADMIN":
                welcomeMessage = "🙏 Namaste! I'm VanMitra, your platform management assistant. \n\n🛡️ Ready to help you oversee our vibrant marketplace of tribal artisans and ensure everything runs smoothly!";
                suggestions = Arrays.asList(
                    "👥 Pending sellers count",
                    "📊 Today's orders",
                    "📈 Platform stats",
                    "⚙️ User management"
                );
                break;
            default:
                welcomeMessage = "🙏 Namaste! I'm VanMitra, your friendly forest guide to VanVyaapaar! \n\n🌳 Welcome to India's premier marketplace for authentic tribal handicrafts. I'm here to help you explore our rich heritage of traditional artistry. How can I assist you today?";
                suggestions = Arrays.asList(
                    "🎨 What is VanVyaapaar?",
                    "🛍️ Show products", 
                    "📝 How to register?",
                    "📞 Contact us"
                );
        }
        
        return ChatbotResponse.builder()
                .message(welcomeMessage)
                .type("TEXT")
                .suggestions(suggestions)
                .build();
    }
    
    private ChatbotResponse handleProductSearch(String message) {
        try {
            // Extract price range if mentioned
            Pattern pricePattern = Pattern.compile("under ₹?(\\d+)|below ₹?(\\d+)|less than ₹?(\\d+)");
            Matcher priceMatcher = pricePattern.matcher(message);
            
            List<Product> products;
            String responseMessage;
            
            if (priceMatcher.find()) {
                double maxPrice = Double.parseDouble(priceMatcher.group(1) != null ? priceMatcher.group(1) : 
                                                   priceMatcher.group(2) != null ? priceMatcher.group(2) : 
                                                   priceMatcher.group(3));
                products = productRepository.findByPriceLessThanEqual(maxPrice);
                responseMessage = String.format("🎨 Wonderful! I found %d beautiful handcrafted treasures under ₹%.0f for you:", products.size(), maxPrice);
            } else if (message.contains("under ₹") || message.contains("under rs")) {
                // Handle "Under ₹5000" format
                Pattern underPricePattern = Pattern.compile("under ₹?(\\d+)");
                Matcher underMatcher = underPricePattern.matcher(message);
                if (underMatcher.find()) {
                    double maxPrice = Double.parseDouble(underMatcher.group(1));
                    products = productRepository.findByPriceLessThanEqual(maxPrice);
                    responseMessage = String.format("💰 Perfect! Here are beautiful handicrafts under ₹%.0f:", maxPrice);
                } else {
                    products = productRepository.findAll();
                    responseMessage = "🌟 Here's a curated selection of our most cherished handicraft masterpieces:";
                }
            } else if (message.contains("filter") || message.contains("category")) {
                return ChatbotResponse.builder()
                        .message("🎨 **Browse by Category** \n\n" +
                                "Choose a category to explore our beautiful tribal crafts:")
                        .type("TEXT")
                        .suggestions(Arrays.asList("🏺 Pottery", "💎 Jewelry", "🧵 Textiles", "🎨 Paintings", "🪵 Wood Crafts"))
                        .build();
            } else if (message.contains("price") && message.contains("range")) {
                return ChatbotResponse.builder()
                        .message("💰 **Shop by Price Range** \n\n" +
                                "Find beautiful handicrafts within your budget:")
                        .type("TEXT")
                        .suggestions(Arrays.asList("Under ₹500", "Under ₹1000", "Under ₹2000", "Under ₹5000", "Show all products"))
                        .build();
            } else if (message.contains("more") && message.contains("products")) {
                products = productRepository.findAll();
                responseMessage = "🌟 Here's our complete collection of beautiful tribal handicrafts:";
                // Show more products (up to 10)
                if (products.size() > 10) {
                    products = products.subList(0, 10);
                    responseMessage += " (Showing 10 items)";
                }
            } else if (message.contains("pottery")) {
                products = productRepository.findByCategoryContainingIgnoreCase("pottery");
                responseMessage = "🏺 Ah, pottery! Here are our exquisite clay creations, shaped by skilled tribal hands with centuries-old techniques:";
            } else if (message.contains("jewelry") || message.contains("jewellery")) {
                products = productRepository.findByCategoryContainingIgnoreCase("jewelry");
                responseMessage = "💎 Discover our stunning jewelry collection - each piece tells a story of tribal heritage and artisan mastery:";
            } else if (message.contains("textile")) {
                products = productRepository.findByCategoryContainingIgnoreCase("textile");
                responseMessage = "🧵 Explore our magnificent textile collection - woven with love, tradition, and the finest natural materials:";
            } else {
                products = productRepository.findAll();
                responseMessage = "🌟 Here's a curated selection of our most cherished handicraft masterpieces:";
            }
            
            // Limit to top 5 products
            if (products.size() > 5) {
                products = products.subList(0, 5);
                responseMessage += " (Showing top 5)";
            }
            
            // Debug logging for products
            System.out.println("=== PRODUCT SEARCH DEBUG ===");
            System.out.println("Search query: " + message);
            System.out.println("Products found: " + products.size());
            if (!products.isEmpty()) {
                System.out.println("Sample product: " + products.get(0));
            }
            System.out.println("============================");
            
            return ChatbotResponse.builder()
                    .message(responseMessage)
                    .type("PRODUCT_LIST")
                    .data(Arrays.asList(products.toArray()))
                    .suggestions(Arrays.asList("Show more products", "Filter by category", "Price range"))
                    .build();
                    
        } catch (Exception e) {
            return ChatbotResponse.builder()
                    .message("🤔 I couldn't find products right now. Please try again or browse our catalog directly.")
                    .type("TEXT")
                    .suggestions(Arrays.asList("Browse all products", "Contact support"))
                    .build();
        }
    }
    
    private ChatbotResponse handleOrderTracking(String message, Long userId) {
        if (userId == null) {
            return ChatbotResponse.builder()
                    .message("🔐 Please login to track your orders. I can help you once you're signed in!")
                    .type("TEXT")
                    .suggestions(Arrays.asList("Login", "Register", "Guest browsing"))
                    .build();
        }
        
        try {
            // Handle specific order suggestions
            if (message.contains("order details") || message.contains("details")) {
                return ChatbotResponse.builder()
                        .message("📋 **Order Details Help** \n\n" +
                                "To get detailed information about a specific order, please provide the order number. \n\n" +
                                "Example: Type '#123' or 'Order 123' to track order number 123.")
                        .type("TEXT")
                        .suggestions(Arrays.asList("Track my orders", "Contact support", "Order history"))
                        .build();
            } else if (message.contains("order history") || message.contains("history")) {
                // Redirect to show all orders
                List<Order> orders = orderRepository.findByBuyerId(userId);
                
                if (orders.isEmpty()) {
                    return ChatbotResponse.builder()
                            .message("📋 **Order History** \n\n" +
                                    "You haven't placed any orders yet! \n\n🎨 Ready to explore our beautiful handicrafts?")
                            .type("TEXT")
                            .suggestions(Arrays.asList("Show products", "Browse categories", "How to order"))
                            .build();
                }
                
                // Create order data for history view
                List<Map<String, Object>> orderData = orders.stream().map(order -> {
                    Map<String, Object> orderInfo = new HashMap<>();
                    orderInfo.put("id", order.getId());
                    orderInfo.put("status", order.getStatus());
                    orderInfo.put("totalAmount", order.getTotalAmount());
                    orderInfo.put("orderDate", order.getOrderDate() != null ? order.getOrderDate().toString() : "Date not available");
                    orderInfo.put("type", "ORDER");
                    return orderInfo;
                }).collect(Collectors.toList());
                
                return ChatbotResponse.builder()
                        .message(String.format("📚 **Complete Order History** \n\nYou have %d orders in total:", orders.size()))
                        .type("ORDER_LIST")
                        .data(Arrays.asList(orderData.toArray()))
                        .suggestions(Arrays.asList("Track specific order", "Reorder items", "Contact support"))
                        .build();
            } else if (message.contains("reorder")) {
                return ChatbotResponse.builder()
                        .message("🔄 **Reorder Items** \n\n" +
                                "I'd love to help you reorder! Please visit your order history to see previous purchases and easily reorder your favorite items.")
                        .type("TEXT")
                        .suggestions(Arrays.asList("Track my orders", "Show products", "Contact support"))
                        .build();
            } else if (message.contains("specific") && message.contains("order")) {
                return ChatbotResponse.builder()
                        .message("🎯 **Track Specific Order** \n\n" +
                                "Please provide your order number to track it. \n\n" +
                                "You can type: '#123' or 'Order 123' or just '123'")
                        .type("TEXT")
                        .suggestions(Arrays.asList("Track all orders", "Contact seller", "Order help"))
                        .build();
            }
            
            // Extract order ID if mentioned
            Pattern orderPattern = Pattern.compile("#(\\d+)|(\\d+)");
            Matcher orderMatcher = orderPattern.matcher(message);
            
            if (orderMatcher.find()) {
                String orderIdStr = orderMatcher.group(1) != null ? orderMatcher.group(1) : orderMatcher.group(2);
                Long orderId = Long.parseLong(orderIdStr);
                
                // Find specific order
                Order order = orderRepository.findById(orderId).orElse(null);
                if (order != null && order.getBuyer().getId().equals(userId)) {
                    return ChatbotResponse.builder()
                            .message(String.format("📦 **Order #%d Status**: %s\n💰 **Total**: ₹%.2f\n📅 **Order Date**: %s\n\n🎯 Your order is being handled with care by our artisans!", 
                                    order.getId(), order.getStatus(), order.getTotalAmount(), 
                                    order.getOrderDate() != null ? order.getOrderDate().toString() : "Date not available"))
                            .type("ORDER_INFO")
                            .data(Arrays.asList(order))
                            .suggestions(Arrays.asList("Track another order", "Contact seller", "Order history"))
                            .build();
                } else {
                    return ChatbotResponse.builder()
                            .message("❌ Order not found or doesn't belong to you. Please check the order number.")
                            .type("TEXT")
                            .suggestions(Arrays.asList("Show my orders", "Contact support"))
                            .build();
                }
            } else {
                // Show all user orders
                List<Order> orders = orderRepository.findByBuyerId(userId);
                
                // Debug logging
                System.out.println("=== ORDER TRACKING DEBUG ===");
                System.out.println("User ID: " + userId);
                System.out.println("Orders found: " + orders.size());
                
                if (orders.isEmpty()) {
                    System.out.println("No orders found for user");
                    System.out.println("============================");
                    return ChatbotResponse.builder()
                            .message("📋 You haven't placed any orders yet! \n\n🎨 Ready to explore our beautiful handicrafts? I can help you discover amazing tribal treasures!")
                            .type("TEXT")
                            .suggestions(Arrays.asList("Show products", "Browse categories", "How to order"))
                            .build();
                }
                
                // Create a simplified order data structure for display
                List<Map<String, Object>> orderData = orders.stream().limit(5).map(order -> {
                    Map<String, Object> orderInfo = new HashMap<>();
                    orderInfo.put("id", order.getId());
                    orderInfo.put("status", order.getStatus());
                    orderInfo.put("totalAmount", order.getTotalAmount());
                    // Null-safe handling for orderDate
                    orderInfo.put("orderDate", order.getOrderDate() != null ? order.getOrderDate().toString() : "Date not available");
                    orderInfo.put("type", "ORDER"); // Add type to distinguish from products
                    return orderInfo;
                }).collect(Collectors.toList());
                
                System.out.println("Order data structure: " + orderData);
                System.out.println("============================");
                
                return ChatbotResponse.builder()
                        .message(String.format("📋 You have %d orders. Here are your recent orders:", orders.size()))
                        .type("ORDER_LIST")
                        .data(Arrays.asList(orderData.toArray()))
                        .suggestions(Arrays.asList("Track specific order", "Order details", "Reorder"))
                        .build();
            }
        } catch (Exception e) {
            // Enhanced error logging
            System.out.println("=== ORDER TRACKING ERROR ===");
            System.out.println("User ID: " + userId);
            System.out.println("Error message: " + e.getMessage());
            System.out.println("Error type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            System.out.println("============================");
            
            return ChatbotResponse.builder()
                    .message("🤔 I couldn't fetch your orders right now. Please try again later.")
                    .type("TEXT")
                    .suggestions(Arrays.asList("Try again", "Contact support"))
                    .build();
        }
    }
    
    private ChatbotResponse handleFAQ(String message) {
        if (message.contains("shipping")) {
            return ChatbotResponse.builder()
                    .message("🚚 **Shipping & Delivery Information** \n\n" +
                            "🎁 **FREE shipping** on orders above ₹500 \n" +
                            "📅 **Delivery**: 3-7 business days across India \n" +
                            "💰 **Cash on Delivery** available \n" +
                            "📱 **Real-time tracking** for all orders \n" +
                            "🏔️ **Special care** for fragile handicrafts \n\n" +
                            "Your precious tribal treasures will be packed with love and delivered safely to your doorstep! 🏠✨")
                    .type("FAQ")
                    .suggestions(Arrays.asList("🔄 Return policy", "💳 Payment methods", "📞 Contact us"))
                    .build();
        } else if (message.contains("return") || message.contains("refund")) {
            return ChatbotResponse.builder()
                    .message("🔄 **Return & Refund Policy** \n\n" +
                            "📅 **7-day return** window from delivery \n" +
                            "✨ **Products must be unused** and in original condition \n" +
                            "💸 **Refund processed** within 3-5 business days \n" +
                            "🤝 **Contact the artisan** directly for returns \n" +
                            "📦 **Original packaging** required \n\n" +
                            "We understand that sometimes things don't work out. Our artisans are committed to your satisfaction! 😊")
                    .type("FAQ")
                    .suggestions(Arrays.asList("🚚 Shipping policy", "❓ How to return?", "🆘 Contact support"))
                    .build();
        } else if (message.contains("payment")) {
            return ChatbotResponse.builder()
                    .message("💳 **Secure Payment Options** \n\n" +
                            "💳 **Cards**: All major Credit/Debit cards \n" +
                            "📱 **UPI**: GPay, PhonePe, Paytm & more \n" +
                            "🏦 **Net Banking**: All major banks supported \n" +
                            "💰 **Cash on Delivery**: Available nationwide \n" +
                            "🔒 **Razorpay Gateway**: Bank-level security \n\n" +
                            "Your payments are 100% secure with us. Support our artisans with confidence! 🛡️✨")
                    .type("FAQ")
                    .suggestions(Arrays.asList("❌ Payment issues", "💸 Refund status", "🛒 Order help"))
                    .build();
        } else if (message.contains("contact")) {
            return ChatbotResponse.builder()
                    .message("📞 Contact Us:\n• Email: support@vanvyaapaar.com\n• Phone: +91-9876543210\n• WhatsApp: +91-9876543210\n• Working Hours: 9 AM - 6 PM")
                    .type("FAQ")
                    .suggestions(Arrays.asList("Technical support", "Order help", "Seller support"))
                    .build();
        } else if (message.contains("about") || message.contains("vanvyaapaar")) {
            return ChatbotResponse.builder()
                    .message("🎨 About VanVyaapaar:\nIndia's premier marketplace for authentic tribal handicrafts. We connect skilled artisans with customers worldwide, preserving traditional crafts while providing sustainable livelihoods.")
                    .type("FAQ")
                    .suggestions(Arrays.asList("How to buy?", "Seller registration", "Product categories"))
                    .build();
        }
        
        return getDefaultResponse();
    }
    
    private ChatbotResponse handleSellerQuery(String message, Long userId) {
        if (message.contains("orders") || message.contains("my orders")) {
            try {
                List<Order> orders = orderRepository.findBySellerId(userId);
                
                // Debug logging for seller orders
                System.out.println("=== SELLER ORDERS DEBUG ===");
                System.out.println("Seller ID: " + userId);
                System.out.println("Orders found: " + orders.size());
                
                if (orders.isEmpty()) {
                    System.out.println("No orders found for seller");
                    System.out.println("===========================");
                    return ChatbotResponse.builder()
                            .message("📦 No customer orders yet! \n\n🌟 Don't worry, your beautiful creations will find their way to customers soon. Keep creating amazing handicrafts!")
                            .type("TEXT")
                            .suggestions(Arrays.asList("Add new product", "Product guidelines", "Marketing tips"))
                            .build();
                }
                
                // Create simplified order data for display
                List<Map<String, Object>> orderData = orders.stream().limit(5).map(order -> {
                    Map<String, Object> orderInfo = new HashMap<>();
                    orderInfo.put("id", order.getId());
                    orderInfo.put("status", order.getStatus());
                    orderInfo.put("totalAmount", order.getTotalAmount());
                    // Null-safe handling for orderDate
                    orderInfo.put("orderDate", order.getOrderDate() != null ? order.getOrderDate().toString() : "Date not available");
                    orderInfo.put("buyerName", order.getBuyer() != null ? order.getBuyer().getName() : "Customer");
                    orderInfo.put("type", "ORDER");
                    return orderInfo;
                }).collect(Collectors.toList());
                
                System.out.println("Order data structure: " + orderData);
                System.out.println("===========================");
                
                return ChatbotResponse.builder()
                        .message(String.format("📦 You have %d orders from customers! Here's your recent business activity:", orders.size()))
                        .type("ORDER_LIST")
                        .data(Arrays.asList(orderData.toArray()))
                        .suggestions(Arrays.asList("Update order status", "Order details", "Customer contact"))
                        .build();
            } catch (Exception e) {
                // Enhanced error logging for seller orders
                System.out.println("=== SELLER ORDERS ERROR ===");
                System.out.println("Seller ID: " + userId);
                System.out.println("Error message: " + e.getMessage());
                System.out.println("Error type: " + e.getClass().getSimpleName());
                e.printStackTrace();
                System.out.println("===========================");
                
                return ChatbotResponse.builder()
                        .message("🤔 Couldn't fetch your orders. Please try again.")
                        .type("TEXT")
                        .build();
            }
        } else if (message.contains("add product") || message.contains("how to add")) {
            return ChatbotResponse.builder()
                    .message("➕ **How to Add Your Beautiful Creations**: \n\n" +
                            "1️⃣ Go to 'My Products' section \n" +
                            "2️⃣ Click 'Add New Product' \n" +
                            "3️⃣ Fill in your craft details with love \n" +
                            "4️⃣ Upload clear, beautiful images \n" +
                            "5️⃣ Set a fair price for your artistry \n" +
                            "6️⃣ Submit for admin approval \n\n" +
                            "🎨 Remember: Each product tells a story of your heritage and skill!")
                    .type("TEXT")
                    .suggestions(Arrays.asList("📖 Product guidelines", "📸 Image requirements", "💰 Pricing tips"))
                    .build();
        } else if (message.contains("pending") || message.contains("status")) {
            return ChatbotResponse.builder()
                    .message("⏳ **Product Status Guide**: \n\n" +
                            "🔄 **Pending**: Your beautiful creation is under admin review \n" +
                            "✅ **Approved**: Live on marketplace, ready for customers! \n" +
                            "❌ **Rejected**: Needs some adjustments - check feedback \n\n" +
                            "🎯 Check 'My Products' section for detailed status and admin feedback.")
                    .type("TEXT")
                    .suggestions(Arrays.asList("📦 Show my products", "📋 Approval guidelines", "📞 Contact admin"))
                    .build();
        }
        
        return getDefaultResponse();
    }
    
    private ChatbotResponse handleAdminQuery(String message) {
        if (message.contains("pending sellers") || message.contains("sellers count")) {
            try {
                long pendingCount = sellerRepository.countByAdminApprovalStatus("PENDING");
                return ChatbotResponse.builder()
                        .message(String.format("👥 Pending Sellers: %d sellers awaiting approval", pendingCount))
                        .type("TEXT")
                        .suggestions(Arrays.asList("Review sellers", "Approved sellers", "Platform stats"))
                        .build();
            } catch (Exception e) {
                return getDefaultResponse();
            }
        } else if (message.contains("orders") || message.contains("today")) {
            try {
                long totalOrders = orderRepository.count();
                return ChatbotResponse.builder()
                        .message(String.format("📊 Platform Stats:\n• Total Orders: %d\n• Check admin dashboard for detailed analytics", totalOrders))
                        .type("TEXT")
                        .suggestions(Arrays.asList("User management", "Product moderation", "Sales reports"))
                        .build();
            } catch (Exception e) {
                return getDefaultResponse();
            }
        }
        
        return getDefaultResponse();
    }
    
    private ChatbotResponse handleBuyerQuery(String message, Long userId) {
        if (message.contains("how to order") || message.contains("place order")) {
            return ChatbotResponse.builder()
                    .message("🛒 How to Place Order:\n1. Browse products\n2. Add to cart\n3. Review cart items\n4. Proceed to checkout\n5. Choose payment method\n6. Confirm order")
                    .type("TEXT")
                    .suggestions(Arrays.asList("Browse products", "My cart", "Payment help"))
                    .build();
        }
        
        return getDefaultResponse();
    }
    
    private ChatbotResponse handleGuestQuery(String message) {
        if (message.contains("register") || message.contains("sign up")) {
            return ChatbotResponse.builder()
                    .message("📝 Registration:\n• Buyer: Quick registration with email\n• Seller: Detailed registration with business info\n• Both get instant access to platform features")
                    .type("TEXT")
                    .suggestions(Arrays.asList("Register as buyer", "Register as seller", "Login"))
                    .build();
        }
        
        return getDefaultResponse();
    }
    
    private ChatbotResponse getDefaultResponse() {
        return ChatbotResponse.builder()
                .message("🤔 I didn't quite understand that. Could you please rephrase or try one of these options?")
                .type("TEXT")
                .suggestions(Arrays.asList(
                    "Show products",
                    "Track orders", 
                    "Shipping policy",
                    "Contact support"
                ))
                .build();
    }
}