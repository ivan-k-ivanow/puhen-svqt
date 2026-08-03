# Development Roadmap

## Purpose

This document defines the planned evolution of the Puhen Svqt application.

The project is developed incrementally, with each version introducing a well-defined set of features while building upon the existing architecture.

The roadmap serves as a guide for development priorities and long-term planning.

---

# Project Vision

Puhen Svqt begins as a handcrafted product catalog with a dedicated administration panel.

Over time, it will evolve into a complete e-commerce platform featuring customer accounts, shopping cart functionality, online payments, and order management.

Each version introduces new functionality while preserving the established architecture and coding standards.

---

# Version 2 – Product Catalog

## Goal

Build a production-ready catalog management system for handmade products.

### Infrastructure

- PostgreSQL database
- Prisma ORM
- Express.js backend
- Handlebars server-side rendering
- Repository pattern
- MVC architecture
- JWT authentication
- Zod validation

---

### Authentication

- Administrator login
- Logout
- Authentication middleware
- Authorization middleware
- Protected routes
- Administrator account provisioned through database seed

---

### Product Management

- Create product
- Edit product
- Delete product
- Product details
- Product listing
- Product validation
- Product images

---

### Category Management

- Create category
- Edit category
- Delete category
- Assign products to categories
- Browse products by category

---

### Image Management

- Upload product images
- Primary product image
- Multiple product images
- Image deletion

---

### Public Website

- Home page
- Product catalog
- Product details
- Category browsing
- Search products
- Responsive design

---

### Administration

- Dashboard
- Product management
- Category management
- Image management

---

### Deployment

- Production database
- Environment configuration
- Initial deployment
- Administrator seed

---

# Version 3 – Modern Frontend

## Goal

Introduce a modern frontend while preserving the existing backend.

### Frontend

- React
- React Router
- Component architecture
- State management
- Responsive UI

---

### Backend

- Expand REST API
- JSON responses
- API validation
- API documentation

---

### Features

- Improved search
- Product filtering
- Pagination
- Better administration dashboard

---

# Version 4 – E-Commerce

## Goal

Transform the catalog into a complete online store.

### Customer Accounts

- Customer registration
- Customer login
- Customer profile
- Password reset

---

### Shopping Experience

- Shopping cart
- Wishlist
- Product reviews
- Favorites

---

### Orders

- Checkout
- Order creation
- Order history
- Order status tracking

---

### Payments

- Payment gateway integration
- Secure payments
- Payment confirmation

---

### Shipping

- Shipping addresses
- Shipping methods
- Delivery tracking

---

# Version 5 – Business Growth

## Goal

Expand the platform with business-oriented features.

### Inventory

- Stock management
- Low stock notifications
- Product availability

---

### Marketing

- Discount codes
- Promotions
- Featured products
- Newsletter integration

---

### Analytics

- Sales reports
- Product statistics
- Customer insights
- Dashboard analytics

---

### Administration

- Administrator management
- User roles
- Permission management

---

# Future Ideas

Potential future improvements include:

- Product variants
- Product customization
- Multi-language support
- Multi-currency support
- Gift cards
- Digital products
- AI-powered product recommendations
- Customer support chat
- Mobile application
- Barcode generation
- Invoice generation

---

# Development Principles

Each new feature should:

- Follow the established architecture.
- Respect the coding standards.
- Include validation.
- Maintain backward compatibility.
- Preserve separation of concerns.
- Be documented before implementation where appropriate.

---

# Success Criteria

The project will be considered successful when it:

- Provides a reliable administration interface.
- Offers an intuitive customer experience.
- Supports secure authentication.
- Scales without architectural redesign.
- Serves as a maintainable long-term codebase.
- Functions as a complete online store.