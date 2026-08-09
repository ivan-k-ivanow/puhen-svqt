# Learning Guide

## Purpose

This document outlines the technical concepts, architectural patterns, and technologies implemented throughout the development of **Puhen Svqt Version 2**.

It serves as a reference for understanding the knowledge demonstrated by each project milestone and complements the project documentation.

---

# Milestone 1 - Project Setup

## Goal

Establish the project's foundation and development environment.

### Concepts

- Node.js project initialization
- npm and package management
- Project structure
- Express.js
- Express Handlebars
- Static assets
- Environment variables
- PostgreSQL
- Prisma ORM
- Prisma Studio

### Knowledge Gained

- Creating a Node.js project from scratch
- Configuring an Express application
- Configuring Handlebars as the view engine
- Organizing a scalable backend project
- Connecting Prisma to PostgreSQL
- Using environment variables securely
- Managing database connections
- Inspecting the database using Prisma Studio

### Completion Criteria

- Express application starts successfully
- Handlebars renders views
- PostgreSQL is connected
- Prisma Client is generated
- Prisma Studio displays the database

---

# Milestone 2 - Authentication

## Goal

Implement secure administrator authentication.

### Concepts

- Authentication
- Authorization
- bcrypt
- JSON Web Tokens (JWT)
- Cookies
- Protected routes
- Authentication middleware
- Login workflow
- Logout workflow

### Knowledge Gained

- Password hashing and verification
- JWT generation and validation
- Cookie-based authentication
- Route protection using middleware
- Administrator authentication
- Session management

### Completion Criteria

- Administrator login works
- Administrator logout works
- Protected routes require authentication
- JWT authentication functions correctly

---

# Milestone 3 - Categories

## Goal

Implement a complete CRUD module using the application's architecture.

### Concepts

- CRUD operations
- MVC Architecture
- Repository Pattern
- Service Layer
- Zod Validation
- Prisma CRUD operations

### Knowledge Gained

- Building reusable repositories
- Separating business logic into services
- Validating input using Zod
- Creating CRUD controllers
- Rendering dynamic Handlebars views
- Protecting administrator functionality

### Completion Criteria

- Categories can be created
- Categories can be edited
- Categories can be deleted
- Validation errors are handled correctly

---

# Milestone 4 - Products

## Goal

Develop the core product management module.

### Concepts

- Database relationships
- One-to-many relationships
- Search
- Filtering
- Product catalog
- Dynamic content

### Knowledge Gained

- Designing relational database models
- Connecting Products and Categories
- Building advanced CRUD modules
- Implementing search functionality
- Filtering data
- Displaying related information

### Completion Criteria

- Product CRUD is complete
- Product search works
- Category filtering works
- Product details page displays correctly

---

# Milestone 5 - Images

## Goal

Manage product images.

### Concepts

- Image management
- Resource relationships
- Image validation
- Data organization

### Knowledge Gained

- Associating images with products
- Managing related resources
- Validating image data
- Displaying product images

### Completion Criteria

- Images can be added
- Images can be removed
- Products display the correct image

---

# Milestone 6 - Public Website

## Goal

Build the public-facing product catalog.

### Concepts

- Public routing
- Dynamic pages
- Catalog browsing
- Navigation
- Search interface
- Responsive layouts

### Knowledge Gained

- Creating dynamic pages
- Building reusable Handlebars partials
- Displaying products and categories
- Building a user-friendly catalog
- Responsive web design

### Completion Criteria

- Visitors can browse products
- Search functionality works
- Category filtering works
- Responsive layout functions correctly

---

# Milestone 7 - Administration

## Goal

Complete the administrator interface.

### Concepts

- Administration dashboards
- Content management
- Protected interfaces
- Administrator workflows

### Knowledge Gained

- Designing administration panels
- Managing application content
- Organizing administrative navigation
- Restricting access to protected pages

### Completion Criteria

- Administrator dashboard is complete
- Product management works
- Category management works
- Image management works

---

# Milestone 8 - User Experience

## Goal

Improve usability and overall user experience.

### Concepts

- Form validation
- Error handling
- Success messages
- Responsive design
- User feedback

### Knowledge Gained

- Building intuitive forms
- Displaying validation errors
- Improving usability
- Creating responsive interfaces
- Providing meaningful user feedback

### Completion Criteria

- Validation messages display correctly
- Success and error messages work
- Pages are responsive
- Empty states are handled

---

# Milestone 9 - Security

## Goal

Apply fundamental web application security practices.

### Concepts

- Password security
- Authorization
- Route protection
- Secure cookies
- Authentication validation

### Knowledge Gained

- Securing administrator accounts
- Protecting sensitive routes
- Validating authentication tokens
- Preventing unauthorized access

### Completion Criteria

- Administrator routes are protected
- Passwords are securely stored
- JWT validation functions correctly
- Secure cookies are implemented

---

# Milestone 10 - Deployment

## Goal

Deploy the application to a production environment.

### Concepts

- Production environments
- Hosted PostgreSQL
- Environment configuration
- Deployment workflow

### Knowledge Gained

- Deploying Node.js applications
- Connecting to hosted PostgreSQL databases
- Managing production environment variables
- Verifying production deployments

### Completion Criteria

- Application is deployed
- Production database is connected
- Administrator authentication works
- Public website is accessible

---

# Technologies

## Runtime

- Node.js

## Backend

- Express.js

## Database

- PostgreSQL
- Prisma ORM

## Validation

- Zod

## Authentication

- JSON Web Tokens (JWT)
- bcrypt
- cookie-parser

## Templating

- Express Handlebars

## Version Control

- Git
- GitHub

---

# Architectural Patterns

The project demonstrates the following architectural patterns:

- MVC (Model–View–Controller)
- Repository Pattern
- Service Layer Pattern
- Middleware Pattern
- Layered Architecture

---

# Skills Demonstrated

Upon completion of Version 2, the project demonstrates experience with:

- Express application development
- MVC architecture
- Repository Pattern
- Service Layer architecture
- PostgreSQL database design
- Prisma ORM
- Authentication and authorization
- JWT implementation
- Password hashing with bcrypt
- CRUD application development
- Relational database modeling
- Form validation with Zod
- Dynamic Handlebars views
- Administrator interfaces
- Responsive web development
- Production deployment
- Git and GitHub workflow

---

# Future Learning

Future versions of Puhen Svqt will expand the project with additional technologies and concepts, including:

- React
- REST API development
- Shopping cart functionality
- Customer accounts
- Order management
- Payment integration
- Cloudinary
- Inventory management
- Role-based authorization
- Performance optimization
- Automated testing
- CI/CD pipelines