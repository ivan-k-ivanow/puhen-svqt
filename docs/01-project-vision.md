# Project Vision

## Overview

Puhen Svqt is a full-stack web application developed for a real family business that specializes in handcrafted gifts and decorations.

The project started as a Firebase-based product catalog and has evolved into a scalable application built using Node.js, Express, PostgreSQL, Prisma, and JWT authentication.

The application is developed incrementally throughout the Full-Stack JavaScript learning journey and serves simultaneously as:

* a real business application;
* a learning platform;
* a portfolio project;
* a foundation for a future complete e-commerce platform.

---

## Vision

To build a modern, scalable, and maintainable e-commerce platform that supports the daily operations of the Puhen Svqt business while demonstrating professional full-stack software development practices.

---

## Business Goals

* Present products through a modern and responsive website.
* Simplify product management through an administration panel.
* Improve maintainability by replacing Firebase with a relational database.
* Prepare the application for future online sales.
* Support future business growth without requiring major architectural changes.

---

## Technical Goals

* Build a clean layered architecture using Express.
* Use PostgreSQL as the primary database.
* Manage database access through Prisma ORM.
* Implement secure JWT authentication.
* Validate incoming data using Zod.
* Separate business logic from presentation logic.
* Expose reusable backend functionality through REST API endpoints.
* Support multiple frontend clients.
* Use React for the modern frontend.
* Keep the backend independent from the frontend technology.

---

## Learning Goals

This project serves as the primary learning platform throughout the Full-Stack JavaScript learning journey.

Instead of creating multiple unrelated course projects, newly learned technologies are integrated into this application whenever appropriate.

The project currently demonstrates knowledge of:

* Node.js
* Express
* PostgreSQL
* Prisma
* JWT authentication
* bcrypt
* Zod
* MVC and layered architecture
* Repository Pattern
* Service Layer
* Handlebars
* Vanilla JavaScript

The next learning stage introduces:

* React
* React Router
* React component architecture
* React state management
* API integration
* React forms
* Client-side validation
* Protected routes

Future technologies may include:

* TypeScript
* Docker
* Cloud Deployment
* Automated Testing
* CI/CD

---

## Target Users

### Visitors

Visitors can:

* browse products;
* explore categories;
* search the catalog;
* filter products;
* view product details;
* view similar products.

### Administrator

The administrator manages:

* products;
* categories;
* product images;
* website content.

### Future Customers

Future versions will introduce:

* customer accounts;
* shopping carts;
* wishlists;
* orders;
* online payments;
* customer reviews.

---

# Project Evolution

## Version 1

The original application was based on:

* Vanilla JavaScript
* lit-html
* Firebase
* Firestore
* Firebase Authentication
* Firebase Storage

---

## Version 2 — Backend and Catalog Foundation

Version 2 introduced the current backend architecture and the first complete catalog and administration system.

### Technologies

* Node.js
* Express
* PostgreSQL
* Prisma ORM
* Handlebars
* JWT Authentication
* bcrypt
* Zod

### Main functionality

* Administrator authentication
* Product management
* Category management
* Product images
* Product search
* Category filtering
* Product details
* Similar products
* Public catalog
* Administration panel

Version 2 primarily uses Handlebars and server-rendered pages.

The current version is considered feature-complete, with bug fixing, error handling, and final cleanup remaining.

---

## Version 2.1 — React Frontend

Version 2.1 introduces React as part of the ReactJS course.

The purpose of Version 2.1 is to migrate the existing frontend functionality from Handlebars and Vanilla JavaScript to React while preserving the existing backend and database architecture.

### Main goals

* Learn React through the real Puhen Svqt project.
* Build the public catalog using React.
* Build the administration panel using React.
* Connect React to the existing Express backend through REST API endpoints.
* Reuse the existing business logic and database layer.
* Introduce reusable React components.
* Introduce client-side state management.
* Introduce React Router.
* Introduce API communication.
* Implement loading, error, and empty states.

Version 2.1 is also the primary course project for the ReactJS course.

---

## Version 3 — Full E-Commerce Development

After the React migration is completed, Version 3 will focus on transforming the application into a complete online store.

Planned functionality includes:

* Customer accounts
* Shopping cart
* Wishlist
* Orders
* Checkout
* Online payments
* Shipping
* Product reviews
* Inventory management

## Version Roadmap

V2
│
├── Backend ✅
├── Database ✅
├── Auth ✅
├── Catalog ✅
├── Admin ✅
└── Final bugs/error handling 🟡
        │
        ▼
V2.1
│
├── React course
├── Public Catalog → React
├── Admin → React
├── REST API
└── React course requirements
        │
        ▼
V3
│
├── Cart
├── Customers
├── Orders
├── Checkout
├── Payments
└── Full E-commerce

---

## Guiding Principles

* Business requirements drive technical decisions.
* Build for maintainability rather than short-term convenience.
* Keep the architecture modular and scalable.
* Separate concerns between layers.
* Keep the backend independent from the frontend.
* Reuse existing functionality whenever possible.
* Design today for future expansion.
* Treat the project as a real production application rather than only a course assignment.
