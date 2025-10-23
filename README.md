# React E-Commerce Application

A complete e-commerce application built with React, featuring product management, user authentication, shopping cart, wishlist, and order management.

## Features

### Product Management
- Display products dynamically from fake REST API
- Product categories and filtering
- Dynamic search functionality
- Sorting by name, price, and stock
- Stock management (products with 0 stock cannot be added to cart/wishlist)

### User Authentication
- Google OAuth login using Firebase
- User profile management
- Protected routes for authenticated users

### Shopping Experience
- Add products to cart
- Wishlist functionality
- Cart management (update quantities, remove items)
- Checkout process with address selection
- Order placement and tracking

### Admin Features
- Order status management
- Update order status (On Process → Shipped → Delivered)
- Order overview and statistics

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Authentication**: Firebase Auth with Google OAuth
- **State Management**: React Context API
- **Styling**: Custom CSS with responsive design
- **Icons**: Lucide React
- **API**: JSON Server (fake REST API)
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── ProductFilters.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── WishlistContext.jsx
├── hooks/
│   └── useProducts.js
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   ├── Checkout.jsx
│   ├── Dashboard.jsx
│   └── AdminPanel.jsx
├── services/
│   ├── firebase.js
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Install JSON Server (for API)
```bash
npm install -g json-server
```

### 3. Environment Variables
Create a `.env` file in the root directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Start the Development Servers

#### Terminal 1: Start JSON Server (API)
```bash
npm run json-server
```
This will start the fake REST API on `http://localhost:3001`

#### Terminal 2: Start React Development Server
```bash
npm run dev
```
This will start the React app on `http://localhost:5173`

## Usage

### For Users:
1. **Browse Products**: Visit the home page to see all products
2. **Search & Filter**: Use the search bar and filters to find specific products
3. **Login**: Click "Login" and sign in with your Google account
4. **Shopping**: Add products to cart or wishlist
5. **Checkout**: Proceed to checkout, add delivery address, and place orders
6. **Dashboard**: View your profile, wishlist, and order history

### For Admin:
1. Visit `/admin` to access the admin panel
2. View all orders and their current status
3. Update order status from "On Process" to "Shipped" to "Delivered"

## API Endpoints

The JSON Server provides the following endpoints:

- `GET /products` - Get all products
- `GET /categories` - Get all categories
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order
- `GET /addresses` - Get addresses
- `POST /addresses` - Create address

## Key Features Implementation

### Stock Management
- Products with `stock: 0` are visually marked as "Out of Stock"
- Cannot add out-of-stock products to cart or wishlist
- Stock count is displayed on product cards

### Authentication Flow
- Google OAuth integration with Firebase
- User state managed through AuthContext
- Protected routes redirect to login if not authenticated

### Cart & Wishlist
- Persistent storage using localStorage (per user)
- Real-time updates across components
- Quantity management in cart

### Order Management
- Orders created with "On Process" status by default
- Admin can update status through dedicated panel
- Order history available in user dashboard

## Build for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for interview purposes and is free to use for educational purposes.
