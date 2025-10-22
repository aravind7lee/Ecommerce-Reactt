# 🔧 Admin Panel Access Guide

## For Interviewers & Reviewers

### 🚀 Live Application URLs:
- **Frontend**: https://ecommercee-shopping-app.vercel.app/
- **Admin Panel**: https://ecommercee-shopping-app.vercel.app/admin
- **Backend API**: https://ecommerce-api-kt5a.onrender.com/api

### 🛠️ Admin Panel Features:

#### **Order Management:**
- View all customer orders
- Update order status: `On Process` → `Shipped` → `Delivered`
- Order statistics dashboard
- Customer details and order history

#### **Stock Management:**
- View low stock products (≤5 units)
- Restock out-of-stock items
- Real-time inventory updates

### 📱 How to Access Admin Panel:

#### **Method 1: Direct URL**
```
https://ecommercee-shopping-app.vercel.app/admin
```

#### **Method 2: Navigation**
1. Visit the main website
2. Click **"Admin Panel"** button in the navbar (red button)
3. Or scroll to footer and click **"🛠️ Admin Panel"**

### 🧪 Testing Admin Features:

#### **Test Order Status Updates:**
1. **Place an order** as a customer (login required)
2. **Go to Admin Panel** → Orders tab
3. **Click Edit button** on any order
4. **Change status** from dropdown (On Process → Shipped → Delivered)
5. **Verify in user dashboard** → Orders tab shows updated status

#### **Test Stock Management:**
1. **Go to Admin Panel** → Stock Management tab
2. **Find out-of-stock products** (Gaming Keyboard, Casual Hoodie, etc.)
3. **Enter new stock quantity** and click "Restock"
4. **Verify on main site** → Product becomes available for purchase

### 🎯 Key Admin Functionalities:

✅ **Real-time Order Updates** - Status changes reflect immediately  
✅ **Stock Management** - Restock products instantly  
✅ **Order Statistics** - Dashboard with processing/shipped/delivered counts  
✅ **Customer Management** - View customer details and order history  
✅ **Inventory Control** - Manage product availability  

### 📊 Sample Test Data:

**Out-of-Stock Products to Test:**
- Gaming Keyboard (ID: 6)
- Casual Hoodie (ID: 13) 
- Garden Tool Set (ID: 25)
- Essential Oils Set (ID: 38)

**Test Order Flow:**
1. Add products to cart → Checkout → Place order
2. Admin panel → Update order status
3. User dashboard → Verify status update

### 🔗 Quick Links:
- **Main Site**: [ecommercee-shopping-app.vercel.app](https://ecommercee-shopping-app.vercel.app/)
- **Admin Panel**: [ecommercee-shopping-app.vercel.app/admin](https://ecommercee-shopping-app.vercel.app/admin)
- **GitHub Repo**: [github.com/aravind7lee/Ecommerce-Reactt](https://github.com/aravind7lee/Ecommerce-Reactt)

---
**Built by Aravind Raja** | **Tech Stack**: React.js, Firebase Auth, REST API, Vercel + Render