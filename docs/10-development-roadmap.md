# Development Roadmap

## Purpose

This document defines the planned evolution of the Puhen Svqt application.

The project is developed incrementally, with each version building upon the existing architecture and functionality.

The roadmap is divided into:

* Version 1 — Original application
* Version 2 — Backend and catalog foundation
* Version 2.1 — React course and frontend migration
* Version 3 — Full e-commerce development

---

# Version 1 — Original Application

The original application was built using:

* Vanilla JavaScript
* lit-html
* Firebase
* Firestore
* Firebase Authentication
* Firebase Storage

The main purpose was to provide a basic product catalog.

---

# Version 2 — Backend and Catalog Foundation

## Goal

Build a scalable backend and complete product catalog with administration functionality.

### Infrastructure

* PostgreSQL
* Prisma ORM
* Express.js
* Handlebars
* Repository Pattern
* Service Layer
* MVC-inspired architecture
* JWT authentication
* Zod validation

### Authentication

* Administrator login
* Logout
* Authentication middleware
* Authorization middleware
* Protected routes
* Administrator seed

### Product Management

* Create products
* Edit products
* Delete products
* Product details
* Product listing
* Product validation
* Product images

### Category Management

* Create categories
* Edit categories
* Delete categories
* Assign products to categories
* Browse products by category

### Public Website

* Home page
* Product catalog
* Product details
* Category filtering
* Search
* Similar products
* Navigation
* Footer

### Administration

* Dashboard
* Product management
* Category management
* Basic image management

### Current Status

Version 2 is feature-complete for the current catalog scope.

Remaining work:

* bug fixing;
* error handling;
* final cleanup;
* documentation synchronization.

These tasks will be completed after the React course migration where appropriate.

---

# Version 2.1 — React Frontend

## Goal

Use the existing Puhen Svqt project as the main course project for the ReactJS course.

Version 2.1 will introduce React while preserving the existing backend and database architecture.

---

## React Learning

The implementation will follow the ReactJS course progressively.

New concepts will be applied directly to the project as they are introduced during the course.

Expected concepts include:

* React components
* JSX
* Props
* State
* Events
* Conditional rendering
* Lists
* Forms
* useState
* useEffect
* React Router
* API requests
* Authentication
* Protected routes
* Reusable components

---

## Frontend Migration

The existing Handlebars frontend will gradually be replaced by React.

### Public Catalog

* React application setup
* Layout
* Header
* Navigation
* Footer
* Product listing
* Category filtering
* Search
* Product details
* Similar products

### Administration

* React Admin layout
* Login
* Protected routes
* Dashboard
* Product management
* Create product
* Edit product
* Delete product
* Category management
* Image management where supported

---

## Backend / API

The existing backend will be adapted to provide the API required by React.

* REST API routes
* JSON responses
* API validation
* API authentication
* API authorization
* Consistent API errors

The existing architecture remains:


Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL


The backend is not rewritten.

---

## Version 2.1 Finalization

After the main React functionality is implemented:

* bug fixing;
* error handling;
* loading states;
* empty states;
* validation feedback;
* responsive improvements;
* final cleanup;
* documentation update.

Version 2.1 will serve as the ReactJS course project.

---

# Version 3 — Full E-Commerce

## Goal

Transform the React-based catalog into a complete online store.

### Customer Accounts

* Customer registration
* Customer login
* Customer profile
* Password reset

### Shopping Experience

* Shopping cart
* Wishlist
* Favorites
* Product reviews

### Orders

* Checkout
* Order creation
* Order history
* Order status tracking

### Payments

* Payment gateway integration
* Secure payments
* Payment confirmation

### Shipping

* Shipping addresses
* Shipping methods
* Delivery tracking

---

# Version 4 — Business Growth

## Goal

Expand the platform with business-oriented features.

### Inventory

* Stock management
* Low stock notifications
* Product availability

### Marketing

* Discount codes
* Promotions
* Featured products
* Newsletter integration

### Analytics

* Sales reports
* Product statistics
* Customer insights
* Dashboard analytics

### Administration

* Administrator management
* User roles
* Permission management

---

# Future Ideas

Potential future improvements include:

* Product variants
* Product customization
* Multi-language support
* Multi-currency support
* Gift cards
* Digital products
* AI-powered product recommendations
* Customer support chat
* Mobile application
* Barcode generation
* Invoice generation

---

# Development Principles

Each new feature should:

* Follow the established architecture.
* Respect the coding standards.
* Include validation.
* Maintain backward compatibility where appropriate.
* Preserve separation of concerns.
* Be documented before implementation where appropriate.
* Be implemented incrementally.
* Reuse existing backend functionality whenever possible.

---

# Success Criteria

The project will be considered successful when it:

* Provides a reliable administration interface.
* Offers an intuitive customer experience.
* Supports secure authentication.
* Uses a maintainable frontend and backend architecture.
* Scales without major architectural redesign.
* Serves as a strong portfolio project.
* Functions as a complete online store.
