# Application Architecture

## Purpose

This document describes the internal architecture of the Puhen Svqt application.

It defines the architectural style, application layers, responsibilities, request lifecycle, and design principles used throughout the project.

The architecture is designed to support the current catalog and administration functionality while allowing the application to evolve into a complete e-commerce platform.

---

# Architectural Style

Puhen Svqt follows a layered architecture with clear separation between:

* Frontend
* HTTP/API layer
* Business logic
* Data access
* Database

The backend follows an MVC-inspired layered structure using:

* Controllers
* Services
* Repositories

The frontend is responsible only for presentation and client-side interaction.

---

# High-Level Architecture

mermaid
flowchart TD

React["React Frontend"]
Express["Express Server"]
Routes["Routes"]
Middleware["Middleware"]
Controllers["Controllers"]
Services["Services"]
Repositories["Repositories"]
Prisma["Prisma ORM"]
Database["PostgreSQL"]

React --> Express
Express --> Routes
Routes --> Middleware
Middleware --> Controllers
Controllers --> Services
Services --> Repositories
Repositories --> Prisma
Prisma --> Database


During Version 2, Handlebars is used as the presentation layer.

During Version 2.1, React becomes the primary frontend.

---

# Request Lifecycle

For React API requests:

mermaid
flowchart LR

React["React"]
Request["HTTP Request"]
Route["API Route"]
Middleware["Middleware"]
Controller["Controller"]
Service["Service"]
Repository["Repository"]
Prisma["Prisma"]
Database["PostgreSQL"]
Response["JSON Response"]

React --> Request
Request --> Route
Route --> Middleware
Middleware --> Controller
Controller --> Service
Service --> Repository
Repository --> Prisma
Prisma --> Database
Database --> Prisma
Prisma --> Repository
Repository --> Service
Service --> Controller
Controller --> Response
Response --> React


---

# Application Layers

## Frontend

The frontend is responsible for:

* displaying the user interface;
* handling user interaction;
* managing client-side state;
* handling navigation;
* sending API requests;
* displaying loading states;
* displaying errors;
* displaying returned data.

### Version 2

The frontend uses:

* Handlebars
* HTML
* CSS
* Vanilla JavaScript

### Version 2.1

The frontend uses:

* React
* React Router
* JavaScript
* reusable React components

The frontend must not access Prisma or PostgreSQL directly.

---

## Express Server

Express is the application's backend entry point.

Responsibilities:

* initialize the application;
* configure middleware;
* register routes;
* handle incoming HTTP requests;
* serve API endpoints;
* handle authentication;
* handle global errors.

---

## Routes

Routes define the application's HTTP interface.

Responsibilities:

* match URLs;
* match HTTP methods;
* apply middleware;
* delegate requests to controllers.

Routes should not contain business logic.

---

## Middleware

Middleware executes before controllers.

Responsibilities include:

* authentication;
* authorization;
* cookie parsing;
* validation;
* logging;
* static file serving.

Middleware should remain reusable and independent of business logic.

---

## Controllers

Controllers coordinate communication between HTTP requests and the business layer.

Responsibilities:

* receive requests;
* extract request data;
* call services;
* return JSON responses;
* render views where required by Version 2;
* redirect users where required by Version 2.

Controllers should remain thin.

They should not contain business logic or database queries.

---

## Services

Services contain the application's business logic.

Responsibilities:

* execute business rules;
* coordinate operations;
* validate business constraints;
* communicate with repositories;
* prepare data for the controller.

Services remain independent of the frontend technology.

---

## Repositories

Repositories provide the data access layer.

Responsibilities:

* execute database queries;
* retrieve entities;
* persist entities;
* hide Prisma implementation details.

Repositories should never contain business logic.

---

## Prisma ORM

Prisma acts as the bridge between the application and PostgreSQL.

Responsibilities:

* execute CRUD operations;
* generate SQL;
* manage relationships;
* map database records to JavaScript objects.

---

## PostgreSQL

PostgreSQL stores persistent application data.

Responsibilities:

* persist data;
* enforce relationships;
* maintain referential integrity;
* execute SQL queries.

---

# Dependency Direction

Application dependencies flow downward.

mermaid
flowchart TD

Controller --> Service
Service --> Repository
Repository --> Prisma
Prisma --> PostgreSQL


The frontend communicates with the backend through HTTP/API requests.

Lower backend layers never depend on higher layers.

For example:

* Services do not know about React.
* Repositories do not know about Controllers.
* Prisma does not know about business logic.
* The backend does not depend on React components.

---

# Rendering Strategy

## Version 2

Version 2 primarily uses Server-Side Rendering.

Controllers render Handlebars templates that generate HTML on the server.

mermaid
flowchart LR

Controller --> Service
Service --> Repository
Repository --> Prisma
Prisma --> Database
Database --> Handlebars
Handlebars --> Browser


---

## Version 2.1

Version 2.1 introduces a React frontend.

The backend provides JSON responses through API endpoints.

mermaid
flowchart LR

React --> API
API["Express REST API"]
API --> Controller
Controller --> Service
Service --> Repository
Repository --> Prisma
Prisma --> Database
Database --> Prisma
Prisma --> Repository
Repository --> Service
Service --> Controller
Controller --> API
API --> React


The React frontend becomes responsible for rendering the user interface.

---

# REST API

The backend exposes REST API endpoints for frontend clients.

Examples:


GET /api/products
GET /api/products/:id
GET /api/categories
POST /api/products
PATCH /api/products/:id
DELETE /api/products/:id


The API allows the existing backend to be reused by React and future clients.

---

# Design Principles

## Separation of Concerns

Each layer has one responsibility.

---

## Single Responsibility Principle

Every module should perform one clearly defined task.

---

## Modularity

Features are organized into independent modules.

---

## Reusability

Business logic should be reusable by different frontend clients.

---

## Scalability

New features should be added without redesigning the entire application.

---

## Maintainability

The architecture should remain understandable as the project grows.

---

# Version Evolution

## Version 2


Browser
   ↓
Express
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Prisma
   ↓
PostgreSQL


Presentation is primarily handled by Handlebars.

---

## Version 2.1


React
   ↓
REST API
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Prisma
   ↓
PostgreSQL


The backend architecture remains unchanged.

Only the primary presentation/client layer changes.

---

## Future Evolution

The architecture is designed to support future modules such as:

* Customer Accounts
* Shopping Cart
* Orders
* Payments
* Reviews
* Wishlist
* Inventory
* Notifications

These modules should integrate into the existing architecture while preserving layer responsibilities.
