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

**Project:** Пухен Свят  
**Current focus:** React public catalog migration  
**Architecture:** React + Vite frontend, Express backend, Prisma, PostgreSQL/Supabase

---

# Milestone 1 — React Setup

### Goal

Create the React frontend while preserving the existing backend.

- [x] Create React application
- [x] Configure React development environment with Vite
- [x] Configure project structure with a separate `client/` folder
- [x] Understand React entry point (`main.jsx`)
- [x] Create first components
- [x] Connect React frontend to Express backend
- [x] Configure `VITE_API_URL`
- [x] Preserve the existing backend architecture

---

# Milestone 2 — React Fundamentals

### Goal

Apply the concepts taught during the React course.

- [x] Components
- [x] JSX
- [x] Props
- [x] State with `useState`
- [x] Events and event handlers
- [x] Conditional rendering
- [x] Lists and keys
- [x] Reusable components
- [x] `useEffect` for API requests
- [ ] Review and reinforce the concepts throughout the project
- [ ] Practice `useContext` if a real use case arises

These concepts will continue to be applied as new functionality is implemented. `useContext` will only be introduced when shared state genuinely requires it.

---

# Milestone 3 — Public Catalog

### Goal

Rebuild the existing public catalog using React.

## Layout

- [x] Create React homepage
- [x] Create Header component
- [x] Create Footer component
- [ ] Complete navigation behavior
- [ ] Implement functional hamburger menu
- [ ] Complete responsive navigation

## Products

- [x] Create product list component (`Products.jsx`)
- [x] Create reusable product card (`ProductCard.jsx`)
- [x] Load active products from the API
- [x] Display product images
- [x] Display product information
- [x] Display product prices
- [x] Link product cards to their details pages
- [x] Preserve existing CSS classes during migration

## Categories

- [x] Retrieve category information through the products API
- [x] Create category filter component (`ProductFilters.jsx`)
- [x] Generate category buttons dynamically
- [x] Filter products by category
- [x] Implement the "All" filter
- [x] Support products assigned to multiple categories
- [x] Link products to categories in the database
- [ ] Test filtering with a larger catalog

## Search

- [ ] Implement functional search input
- [ ] Add search state
- [ ] Implement product search
- [ ] Implement search results dropdown
- [ ] Navigate to the selected search result
- [ ] Make search work together with category filters
- [ ] Handle empty search results

## Product Details

- [x] Create product details page (`ProductDetails.jsx`)
- [x] Configure `/product/:slug` route
- [x] Create API endpoint to fetch a product by slug
- [x] Connect React to the product details API
- [x] Display product name
- [x] Display product description
- [x] Display product price
- [x] Display product image
- [x] Display product categories
- [x] Associate products with categories in Supabase
- [x] Add order links for Instagram and Facebook
- [ ] Implement interactive image gallery
- [ ] Fetch similar products dynamically
- [ ] Exclude the current product from similar products
- [ ] Link similar product cards to the correct details pages
- [ ] Handle missing products and API errors
- [ ] Improve loading and error states

---

# Milestone 4 — React Router

### Goal

Introduce client-side navigation.

- [x] Install and configure React Router
- [x] Configure the home route (`/`)
- [x] Configure the product details route (`/product/:slug`)
- [x] Use `Link` for React Router navigation where implemented
- [ ] Complete navigation links across the application
- [ ] Implement login route
- [ ] Implement admin routes
- [ ] Implement protected admin routes
- [ ] Handle unknown routes
- [ ] Test direct navigation to product URLs
- [ ] Test navigation between pages without full page reloads

---

# Milestone 5 — React Forms

### Goal

Migrate administration forms to React.

- [ ] Login form
- [ ] Product create form
- [ ] Product edit form
- [ ] Category create form
- [ ] Category edit form
- [ ] Form state
- [ ] Form submission
- [ ] Validation feedback
- [ ] API error feedback
- [ ] Success feedback

---

# Milestone 6 — React Admin Panel

### Goal

Rebuild the administration panel using React.

## Authentication

- [ ] Admin login
- [ ] Authentication state
- [ ] Protected routes
- [ ] Logout

## Dashboard

- [ ] Admin layout
- [ ] Navigation
- [ ] Dashboard

## Products

- [ ] Product list
- [ ] Create product
- [ ] Edit product
- [ ] Delete product

## Categories

- [ ] Category list
- [ ] Create category
- [ ] Edit category
- [ ] Delete category

## Images

- [ ] Display product images in the admin panel
- [ ] Delete image
- [ ] Prepare upload integration for future storage

---

# Milestone 7 — API Integration

### Goal

Connect React to the Express backend.

- [x] Connect React to the existing backend
- [x] Implement product list API integration
- [x] Implement product details API integration
- [x] Return product data as JSON
- [x] Return JSON responses for missing products and server errors
- [x] Load product categories and images through Prisma relations
- [ ] Complete category API where required
- [ ] Implement authentication API integration
- [ ] Implement admin API integration
- [ ] Review API validation
- [ ] Standardize API error responses

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

The React frontend communicates with the backend through API requests. Database access remains in the backend.

---

# Milestone 8 — UX and Error Handling

### Goal

Improve the React application's user experience.

- [ ] Loading states
- [ ] Error states
- [x] Basic empty state for category filtering
- [ ] Form validation errors
- [ ] Consistent API error handling
- [ ] 401 handling
- [ ] 403 handling
- [ ] 404 handling
- [ ] Success feedback
- [ ] Responsive design review
- [ ] Check mobile navigation
- [ ] Check browser console for errors and warnings
- [ ] Check network requests
- [ ] Test all public catalog links

---

# Milestone 9 — React Course Finalization

### Goal

Complete the React migration and review the concepts learned during the course.

- [ ] Review course requirements
- [ ] Review project requirements
- [ ] Complete required React functionality
- [ ] Review component responsibilities
- [x] Introduce reusable `ProductCard` component
- [x] Introduce reusable `ProductFilters` component
- [ ] Refactor further only where it improves clarity
- [ ] Remove unnecessary code
- [ ] Test public catalog
- [ ] Test product details and similar products
- [ ] Test search and category filters together
- [ ] Test admin panel
- [ ] Remove old Handlebars routes and views after successful migration
- [ ] Update documentation
- [ ] Prepare project presentation/submission

---

# Version 3 — E-Commerce

Future development after the React course.

- [ ] Customer accounts
- [ ] Customer registration
- [ ] Customer login
- [ ] Shopping cart
- [ ] Wishlist
- [ ] Checkout
- [ ] Orders
- [ ] Payments
- [ ] Reviews
- [ ] Shipping
- [ ] Inventory
- [ ] Discounts
- [ ] Coupons
- [ ] Analytics

---

# Current Next Steps

Continue with the public catalog in this order:

1. Implement the search bar.
2. Make the search work together with category filters.
3. Implement dynamic similar products.
4. Implement the hamburger menu and complete navigation.
5. Review loading and error states.
6. Test the public catalog and finish the remaining React fundamentals review.

**Current implementation note:** `Products.jsx` remains responsible for fetching products, managing the selected category, and filtering the list. `ProductFilters.jsx` renders the category controls, and `ProductCard.jsx` renders an individual product. Further component refactoring can wait until there is a clear benefit.
