# API Design

## Purpose

This document defines the HTTP interface exposed by the Puhen Svqt backend.

The API is responsible for providing data and operations to frontend clients.

Version 2 primarily uses Server-Side Rendered Handlebars pages, while Version 2.1 introduces React as the primary frontend client.

The API therefore becomes a central communication layer between the React frontend and the existing backend.

---

# API Architecture

The backend supports two types of routes during the transition from Version 2 to Version 2.1.

## Server-Side Routes

Version 2 uses routes that render Handlebars views and return HTML.

Examples:


GET /
GET /product/:slug
GET /admin
GET /admin/products


These routes belong to the existing Version 2 frontend.

---

## REST API Routes

Version 2.1 introduces REST API routes that return JSON.

These routes are consumed by React.

Examples:


GET /api/products
GET /api/products/:id
GET /api/categories
POST /api/products
PATCH /api/products/:id
DELETE /api/products/:id


The API should contain the same business rules used by the existing application.

---

# HTTP Methods

The API follows REST conventions.

| Method | Purpose                    |
| ------ | -------------------------- |
| GET    | Retrieve resources         |
| POST   | Create resources           |
| PUT    | Replace existing resources |
| PATCH  | Update part of a resource  |
| DELETE | Remove resources           |

---

# Endpoint Naming

Endpoints use:

* lowercase;
* plural resource names;
* nouns instead of verbs.

Good examples:


GET /api/products
GET /api/categories
POST /api/products
DELETE /api/products/:id


Avoid:


/getProducts
/createProduct
/deleteProduct


---

# URL Structure

Resource identifiers are passed as route parameters.

Examples:


GET /api/products/:id
PATCH /api/products/:id
DELETE /api/products/:id


Slug-based public product details may use:


GET /api/products/slug/:slug


Query parameters may be used for:

* search;
* filtering;
* pagination;
* sorting.

Example:


GET /api/products?category=categoryId
GET /api/products/search?q=bouquet


---

# Request Format

The API accepts JSON request bodies for applicable requests.

Example:

json
{
    "name": "Handmade Teddy Bear",
    "price": 39.99,
    "shortDescription": "Handmade decorative teddy bear",
    "categoryIds": ["category-id"]
}


---

# Response Format

Successful requests return JSON.

Example:

json
{
    "id": "product-id",
    "name": "Handmade Teddy Bear",
    "price": 39.99
}


Collections return arrays.

json
[
    {
        "id": "1",
        "name": "Bouquet"
    },
    {
        "id": "2",
        "name": "Teddy Bear"
    }
]


---

# HTTP Status Codes

The API follows standard HTTP status codes.

| Status | Meaning               |
| ------ | --------------------- |
| 200    | OK                    |
| 201    | Created               |
| 204    | No Content            |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 409    | Conflict              |
| 500    | Internal Server Error |

---

# Error Responses

The API should use a consistent JSON error format.

Example:

json
{
    "message": "Product not found"
}


Validation errors may return:

json
{
    "message": "Validation failed",
    "errors": [
        "Product name is required.",
        "Price must be greater than zero."
    ]
}


Consistent error responses allow the React frontend to display meaningful error states.

---

# Authentication

Protected API endpoints require authentication.

Authentication uses JWT stored in an HTTP-only cookie.

Examples of protected operations:


POST /api/products
PATCH /api/products/:id
DELETE /api/products/:id

POST /api/categories
PATCH /api/categories/:id
DELETE /api/categories/:id


Public endpoints remain accessible without authentication.

---

# Current API Responsibilities

During Version 2.1 the API will support the existing catalog and administration functionality.

## Public Catalog

The React frontend will consume endpoints for:

* retrieving products;
* retrieving product details;
* retrieving categories;
* filtering by category;
* searching products;
* retrieving similar products.

---

## Administration

The React Admin Panel will consume endpoints for:

* administrator authentication;
* product creation;
* product editing;
* product deletion;
* category creation;
* category editing;
* category deletion;
* image management where supported.

---

# API and Architecture

The API follows the application's layered architecture.


React
   ↓
API Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL


Controllers coordinate HTTP requests.

Services execute business logic.

Repositories access the database.

The React frontend must not communicate directly with Prisma or PostgreSQL.

---

# API Design Principles

## Consistency

Endpoints follow consistent naming conventions.

---

## Predictability

Resources behave consistently throughout the API.

---

## Statelessness

Each request contains the information required for processing.

Authentication is verified independently for each request.

---

## Separation of Concerns

Controllers coordinate requests.

Services execute business logic.

Repositories access the database.

React is responsible for presentation and client-side interaction.

---

## Reusability

The API should not contain logic that is specific to a particular React component.

---

## Future Compatibility

The API should remain reusable for future frontend applications and integrations.

---

# Future API

Future versions may introduce endpoints for:


GET /api/customers
POST /api/customers/register
POST /api/customers/login

GET /api/orders
POST /api/orders

GET /api/cart
POST /api/cart/items
DELETE /api/cart/items/:id

GET /api/reviews
POST /api/reviews


These endpoints will be introduced when the corresponding e-commerce functionality is developed.

---

# Version Evolution

## Version 2

The backend primarily renders Handlebars views.

## Version 2.1

React becomes the primary frontend and consumes REST API endpoints.

## Version 3+

The API will expand as customer accounts, shopping cart, orders, payments, and other e-commerce functionality are introduced.
