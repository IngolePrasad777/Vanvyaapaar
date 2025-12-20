# VanVyaapaar Frontend

A modern React frontend for the VanVyaapaar tribal crafts marketplace, built with TypeScript, Tailwind CSS, and Vite.

## Features

### Public Features
- **Landing Page**: Hero section, featured products, categories, testimonials
- **Product Catalog**: Search, filter, and browse authentic tribal crafts
- **Product Details**: Detailed product information with images and reviews
- **Authentication**: Login and registration for buyers and sellers

### Buyer Features
- **Dashboard**: Overview of orders, cart, and recommendations
- **Shopping Cart**: Add, update, and remove items
- **Wishlist**: Save products for later
- **Order Management**: View order history and status
- **Profile Management**: Update personal information

### Seller Features
- **Dashboard**: Sales overview and product management
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order status
- **Profile Management**: Manage seller information and bank details

### Admin Features
- **Dashboard**: Platform overview and statistics
- **User Management**: Manage buyers and sellers
- **Product Management**: Review and approve products
- **Order Management**: Monitor all platform orders

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** for form handling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend server running on http://localhost:8080

### Installation

1. **Install dependencies**
   ```bash
   cd vanvyapaar-frontend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your backend URL if different from default.

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   └── layout/         # Layout components (headers, sidebars, etc.)
├── pages/              # Page components
│   ├── public/         # Public pages (landing, products, etc.)
│   ├── auth/           # Authentication pages
│   ├── buyer/          # Buyer dashboard pages
│   ├── seller/         # Seller dashboard pages
│   └── admin/          # Admin dashboard pages
├── services/           # API service functions
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
├── lib/                # Utility functions and configurations
└── App.tsx             # Main app component with routing
```

## Key Features Implementation

### Authentication & Authorization
- JWT-based authentication with automatic token refresh
- Role-based access control (Buyer, Seller, Admin)
- Protected routes with redirect logic

### State Management
- Zustand for global state (auth, cart, etc.)
- Persistent storage for user session
- Optimistic updates for better UX

### UI/UX Design
- Responsive design for mobile, tablet, and desktop
- Tribal-inspired color scheme and typography
- Loading states and error handling
- Toast notifications for user feedback

### API Integration
- Axios interceptors for request/response handling
- Error handling with user-friendly messages
- Loading states for all async operations

## API Endpoints Used

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup/buyer` - Buyer registration
- `POST /auth/signup/seller` - Seller registration

### Products
- `GET /buyer/products` - Get all products
- `GET /buyer/products/{id}` - Get product details
- `GET /buyer/search` - Search products
- `GET /buyer/filter/category` - Filter by category
- `GET /buyer/filter/price` - Filter by price range

### Buyer Operations
- `POST /buyer/{id}/cart/add/{productId}` - Add to cart
- `GET /buyer/{id}/cart` - Get cart items
- `PUT /buyer/cart/{cartItemId}` - Update cart item
- `DELETE /buyer/cart/{cartItemId}` - Remove from cart
- `POST /buyer/{id}/orders` - Place order
- `GET /buyer/{id}/orders` - Get orders
- `POST /buyer/{id}/wishlist/{productId}` - Add to wishlist
- `GET /buyer/{id}/wishlist` - Get wishlist
- `DELETE /buyer/{id}/wishlist/{productId}` - Remove from wishlist

## Styling Guidelines

### Color Palette
- **Primary**: Orange tones (#f59532, #e35d00)
- **Tribal**: Earth tones (#a58640, #76552f)
- **Neutral**: Grays for text and backgrounds

### Typography
- **Display**: Playfair Display for headings
- **Body**: Inter for body text

### Components
- Consistent button styles with hover effects
- Card-based layouts with subtle shadows
- Form inputs with focus states
- Loading skeletons for better perceived performance

## Development Guidelines

### Code Organization
- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Implement proper error boundaries
- Use custom hooks for reusable logic

### Performance
- Lazy loading for route components
- Image optimization with proper alt tags
- Debounced search functionality
- Optimistic updates for better UX

### Accessibility
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance

## Contributing

1. Follow the existing code style and structure
2. Add TypeScript types for new features
3. Include proper error handling
4. Test on multiple screen sizes
5. Update documentation for new features

## License

This project is part of the VanVyaapaar tribal crafts marketplace platform.