# Development Tasks

## Purpose

This document contains the implementation plan for Puhen Svqt.

Development is divided into versions and milestones.

Version 2 established the backend, database, authentication, catalog, and administration foundation.

Version 2.1 introduces React as part of the ReactJS course and migrates the existing public catalog and administration panel to React.

---

# Version 2 — Completed Foundation

## Milestone 1 — Project Setup

* [x] Node.js project
* [x] Express
* [x] Handlebars
* [x] Static files
* [x] Environment variables
* [x] Project structure

---

## Milestone 2 — Database

* [x] PostgreSQL
* [x] Prisma
* [x] User model
* [x] Category model
* [x] Product model
* [x] Image model
* [x] Migrations
* [x] Administrator seed

---

## Milestone 3 — Authentication

* [x] Login
* [x] Logout
* [x] JWT
* [x] HTTP-only cookie
* [x] Authentication middleware
* [x] Authorization middleware
* [x] Protected admin routes

---

## Milestone 4 — Categories

* [x] Category model
* [x] Create category
* [x] Get categories
* [x] Edit category
* [x] Delete category
* [x] Category validation
* [x] Product/category relationship

---

## Milestone 5 — Products

* [x] Product model
* [x] Product CRUD
* [x] Product validation
* [x] Product slug
* [x] Product details
* [x] Product search
* [x] Category filtering
* [x] Similar products

---

## Milestone 6 — Images

* [x] Image model
* [x] Add image URL
* [x] Delete image
* [x] Display product images
* [ ] Cloud storage upload

Cloud storage will be introduced later when production storage is configured.

---

## Milestone 7 — Public Website

* [x] Home page
* [x] Product catalog
* [x] Product details
* [x] Category filtering
* [x] Search
* [x] Similar products
* [x] Navigation
* [x] Footer

Latest products are intentionally postponed.

---

## Milestone 8 — Administration

* [x] Admin dashboard
* [x] Product management
* [x] Category management
* [x] Product image deletion

---

# Version 2 — Finalization

These tasks are intentionally postponed until after the main React migration where appropriate.

* [ ] Fix remaining bugs
* [ ] Complete error handling
* [ ] Add proper error states
* [ ] Add empty states
* [ ] Add 401 page
* [ ] Add 403 page
* [ ] Add 404 page
* [ ] Final cleanup
* [ ] Synchronize documentation

---

# Version 2.1 — React Course

## Milestone 1 — React Setup

### Goal

Create the React frontend while preserving the existing backend.

* [ ] Create React application
* [ ] Configure React development environment
* [ ] Configure project structure
* [ ] Understand React entry point
* [ ] Create first component
* [ ] Connect React frontend to Express backend

---

# Milestone 2 — React Fundamentals

### Goal

Apply the concepts taught during the React course.

* [ ] Components
* [ ] JSX
* [ ] Props
* [ ] State
* [ ] Events
* [ ] Conditional rendering
* [ ] Lists and keys
* [ ] Reusable components

These tasks will be implemented progressively as the corresponding course topics are introduced.

---

# Milestone 3 — Public Catalog

### Goal

Rebuild the existing public catalog using React.

### Layout

* [ ] React layout
* [ ] Header
* [ ] Navigation
* [ ] Footer

### Products

* [ ] Product list component
* [ ] Product card component
* [ ] Load products from API
* [ ] Display product images
* [ ] Display product information

### Categories

* [ ] Load categories from API
* [ ] Category buttons
* [ ] Category filtering
* [ ] All products filter

### Search

* [ ] Search input
* [ ] Search state
* [ ] Search API request
* [ ] Search results dropdown
* [ ] Search result navigation

### Product Details

* [ ] Product details route
* [ ] Load product by slug
* [ ] Display product information
* [ ] Display images
* [ ] Display categories
* [ ] Display similar products

---

# Milestone 4 — React Router

### Goal

Introduce client-side navigation.

* [ ] Configure React Router
* [ ] Home route
* [ ] Product details route
* [ ] Login route
* [ ] Admin route
* [ ] Protected admin routes
* [ ] Handle unknown routes

---

# Milestone 5 — React Forms

### Goal

Migrate administration forms to React.

* [ ] Login form
* [ ] Product create form
* [ ] Product edit form
* [ ] Category create form
* [ ] Category edit form
* [ ] Form state
* [ ] Form submission
* [ ] Validation feedback

---

# Milestone 6 — React Admin Panel

### Goal

Rebuild the administration panel using React.

### Authentication

* [ ] Admin login
* [ ] Authentication state
* [ ] Protected routes
* [ ] Logout

### Dashboard

* [ ] Admin layout
* [ ] Navigation
* [ ] Dashboard

### Products

* [ ] Product list
* [ ] Create product
* [ ] Edit product
* [ ] Delete product

### Categories

* [ ] Category list
* [ ] Create category
* [ ] Edit category
* [ ] Delete category

### Images

* [ ] Display product images
* [ ] Delete image
* [ ] Prepare upload integration for future storage

---

# Milestone 7 — API Integration

### Goal

Connect React to the Express backend.

* [ ] Create API routes
* [ ] Return JSON responses
* [ ] Product API
* [ ] Category API
* [ ] Authentication API
* [ ] Admin API
* [ ] API validation
* [ ] API error responses


The backend architecture remains:

Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL


---

# Milestone 8 — UX and Error Handling

### Goal

Improve the React application's user experience.

* [ ] Loading states
* [ ] Error states
* [ ] Empty states
* [ ] Form validation errors
* [ ] API errors
* [ ] 401 handling
* [ ] 403 handling
* [ ] 404 handling
* [ ] Success feedback
* [ ] Responsive design

---

# Milestone 9 — React Course Finalization

* [ ] Review course requirements
* [ ] Review project requirements
* [ ] Complete required React functionality
* [ ] Refactor reusable components
* [ ] Remove unnecessary code
* [ ] Test public catalog
* [ ] Test admin panel
* [ ] Update documentation
* [ ] Prepare project presentation/submission

---

# Version 3 — E-Commerce

Future development after the React course.

* [ ] Customer accounts
* [ ] Customer registration
* [ ] Customer login
* [ ] Shopping cart
* [ ] Wishlist
* [ ] Checkout
* [ ] Orders
* [ ] Payments
* [ ] Reviews
* [ ] Shipping
* [ ] Inventory
* [ ] Discounts
* [ ] Coupons
* [ ] Analytics
