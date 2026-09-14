# Learning Guide

## Purpose

This document describes the technical concepts, architectural patterns, and technologies learned and applied while developing Puhen Svqt.

The project is used as a practical learning platform.

Version 2 focuses on backend development, database architecture, authentication, catalog management, and server-rendered interfaces.

Version 2.1 introduces React and applies the concepts learned during the ReactJS course directly to the existing project.

---

# Part I — Version 2

## Milestone 1 — Project Setup

### Concepts

* Node.js
* npm
* Express.js
* Express Handlebars
* Static assets
* Environment variables
* PostgreSQL
* Prisma ORM

### Knowledge Gained

* Creating a Node.js project
* Configuring Express
* Configuring Handlebars
* Organizing a layered backend
* Connecting Prisma to PostgreSQL
* Using environment variables
* Managing database connections
* Using Prisma Studio

---

# Milestone 2 — Database

### Concepts

* Relational databases
* PostgreSQL
* Prisma schema
* Migrations
* Relationships
* Constraints
* Database seeding

### Knowledge Gained

* Designing relational models
* Creating Prisma models
* Creating migrations
* Working with relationships
* Seeding an administrator
* Using Prisma Client

---

# Milestone 3 — Authentication

### Concepts

* Authentication
* Authorization
* bcrypt
* JWT
* Cookies
* HTTP-only cookies
* Middleware
* Protected routes

### Knowledge Gained

* Password hashing
* Password verification
* JWT creation
* JWT verification
* Cookie-based authentication
* Protected administrator routes
* Authentication middleware
* Authorization middleware

---

# Milestone 4 — Categories

### Concepts

* CRUD
* Repository Pattern
* Service Layer
* Controllers
* Zod validation
* Prisma CRUD

### Knowledge Gained

* Creating repositories
* Separating business logic
* Creating service methods
* Validating input
* Building CRUD controllers
* Working with database relationships

---

# Milestone 5 — Products

### Concepts

* CRUD
* Database relationships
* Many-to-many relationships
* Slugs
* Search
* Filtering
* Related products

### Knowledge Gained

* Designing product modules
* Working with Product and Category relationships
* Creating product slugs
* Implementing search
* Filtering products
* Loading related data
* Building product details

---

# Milestone 6 — Images

### Concepts

* Related resources
* Image URLs
* Image management
* Resource deletion

### Knowledge Gained

* Associating images with products
* Managing related resources
* Displaying product images
* Removing product images

Cloud storage will be introduced later.

---

# Milestone 7 — Public Website

### Concepts

* Server-Side Rendering
* Handlebars
* Dynamic pages
* Client-side JavaScript
* Fetch API
* Search
* Filtering
* Responsive design

### Knowledge Gained

* Rendering dynamic content
* Building public catalog pages
* Creating search functionality
* Creating asynchronous filtering
* Working with browser APIs
* Connecting frontend JavaScript to backend endpoints

---

# Milestone 8 — Administration

### Concepts

* Administration dashboards
* Protected interfaces
* CRUD workflows
* Authentication
* Authorization

### Knowledge Gained

* Designing admin interfaces
* Protecting administrator functionality
* Managing application content
* Connecting admin interfaces with backend functionality

---

# Part II — Version 2.1 React Course

## React Setup

### Concepts

* React application structure
* Components
* JSX
* Rendering

### Knowledge Gained

* Creating React applications
* Understanding component-based architecture
* Building reusable UI components
* Rendering dynamic data

### Puhen Svqt Application

The first React components will replace parts of the existing Handlebars frontend.

---

# Components and Props

### Concepts

* Components
* Props
* Component composition
* Reusable components

### Puhen Svqt Application

Potential components include:


Header
Footer
ProductCard
CategoryButton
Search
ProductList
ProductDetails


---

# State

### Concepts

* useState
* Component state
* State updates
* Event handling

### Puhen Svqt Application

State will be used for:

* category filtering;
* search input;
* search results;
* forms;
* mobile navigation;
* UI states.

---

# Lists and Conditional Rendering

### Concepts

* Rendering arrays
* Keys
* Conditional rendering
* Empty states

### Puhen Svqt Application

Products and categories will be rendered dynamically from API data.

---

# API Communication

### Concepts

* HTTP requests
* Fetch API
* Async operations
* Loading states
* Error states

### Puhen Svqt Application

React will communicate with the existing Express backend.


React
   ↓
REST API
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma


---

# useEffect

### Concepts

* useEffect
* Side effects
* Data fetching
* Component lifecycle

### Puhen Svqt Application

useEffect may be used for:

* loading products;
* loading categories;
* loading product details;
* loading similar products;
* reacting to search/filter changes where appropriate.

---

# React Router

### Concepts

* Client-side routing
* Route parameters
* Nested routes
* Protected routes
* Navigation

### Puhen Svqt Application

Routes will include:


/
 /product/:slug
 /login
 /admin
 /admin/products
 /admin/categories


---

# React Forms

### Concepts

* Controlled inputs
* Form state
* Form submission
* Validation
* Error messages

### Puhen Svqt Application

Forms will include:

* Login
* Create product
* Edit product
* Create category
* Edit category

---

# Authentication in React

### Concepts

* Authentication state
* Protected routes
* API authentication
* Logout

### Puhen Svqt Application

React will communicate with the existing JWT-based backend authentication system.

The backend remains responsible for authentication and authorization.

---

# Reusable Components

### Goal

Avoid duplicated UI and logic.

Potential reusable components:


ProductCard
ProductGrid
CategoryFilter
SearchBox
Button
FormField
Loading
ErrorMessage
EmptyState


The exact component structure will evolve during the React course.

---

# React Admin Panel

### Concepts

* Component composition
* Forms
* Routing
* State
* API communication
* Protected routes

### Puhen Svqt Application

The existing Admin Panel will be migrated to React.

---

# UX and Error Handling

### Concepts

* Loading states
* Error states
* Empty states
* User feedback
* Form validation

These concepts will be implemented after the core React functionality is working.

---

# Part III — Future Learning

After the React course, the project will continue toward full e-commerce functionality.

Future technologies and concepts may include:

* TypeScript
* Shopping cart architecture
* Customer accounts
* Order management
* Payment integration
* Cloud storage
* Inventory management
* Role-based authorization
* Automated testing
* Performance optimization
* Docker
* CI/CD
* Cloud deployment

---

# Architectural Patterns Learned

The project demonstrates:

* MVC-inspired architecture
* Repository Pattern
* Service Layer Pattern
* Middleware Pattern
* Layered Architecture
* Component-based frontend architecture

---

# Skills Demonstrated

Upon completion of Version 2.1, the project will demonstrate experience with:

* Node.js
* Express
* PostgreSQL
* Prisma
* JWT authentication
* bcrypt
* Zod
* Repository Pattern
* Service Layer
* CRUD development
* Relational database modeling
* REST API development
* React
* React Router
* React components
* React state
* React forms
* API integration
* Protected frontend routes
* Responsive frontend development

---

# Learning Philosophy

The project follows a practical learning approach:


Learn a concept
      ↓
Understand the concept
      ↓
Apply it to Puhen Svqt
      ↓
Test the implementation
      ↓
Document what was learned


The goal is not simply to complete a course project, but to understand how each technology contributes to a real-world application.
