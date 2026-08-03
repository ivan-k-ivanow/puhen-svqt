# API Design

## Purpose

This document defines the HTTP interface exposed by the Puhen Svqt backend.

It documents the available endpoints, request methods, response formats, and API design principles.

Although Version 2 primarily uses Server-Side Rendering (SSR), the backend is designed to expose a REST API for future frontend applications such as React.

---

# API Architecture

The backend supports two types of routes.

## Server-Side Routes (SSR)

These routes render Handlebars views and return HTML.

Example:

```
GET /

GET /products

GET /products/:id

GET /login
```

---

## REST API

These endpoints return JSON.

They are intended for:

- React
- Mobile applications
- Third-party integrations

Example:

```
GET /api/products

GET /api/products/:id

POST /api/products
```

---

# HTTP Methods

The API follows REST conventions.

| Method | Purpose |
|----------|----------|
| GET | Retrieve data |
| POST | Create resources |
| PUT | Replace existing resources |
| PATCH | Update part of a resource |
| DELETE | Remove resources |

---

# Endpoint Naming

Endpoints use:

- lowercase
- plural resource names
- nouns instead of verbs

Good examples:

```
GET /api/products

GET /api/categories

POST /api/products

DELETE /api/products/:id
```

Avoid:

```
/getProducts

/createProduct

/deleteProduct
```

---

# URL Structure

Resource identifiers are passed as route parameters.

Examples:

```
GET /api/products

GET /api/products/:id

PUT /api/products/:id

DELETE /api/products/:id
```

Nested resources may be introduced where appropriate.

Example:

```
GET /api/categories/:id/products
```

---

# Request Format

The API accepts JSON request bodies.

Example:

```json
{
    "name": "Handmade Teddy Bear",
    "price": 39.99
}
```

---

# Response Format

Successful requests return JSON.

Example:

```json
{
    "id": "clx123",
    "name": "Handmade Teddy Bear",
    "price": 39.99
}
```

Collections return arrays.

```json
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
```

---

# HTTP Status Codes

The API follows standard HTTP status codes.

| Status | Meaning |
|---------|----------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# Error Responses

Errors are returned using a consistent JSON format.

Example:

```json
{
    "message": "Product not found"
}
```

Validation errors may return:

```json
{
    "message": "Validation failed",
    "errors": [
        "Product name is required.",
        "Price must be greater than zero."
    ]
}
```

---

# Authentication

Protected endpoints require authentication.

Authentication is performed using JWT stored inside HTTP-only cookies.

Examples:

```
POST /api/products

PUT /api/products/:id

DELETE /api/products/:id
```

Public endpoints remain accessible without authentication.

---

# Version 2 Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /login | Login page |
| POST | /login | Authenticate administrator |
| POST | /logout | Logout administrator |

---

## Products

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /products | Product catalog |
| GET | /products/:id | Product details |
| GET | /products/create | Create product form |
| POST | /products/create | Create product |
| GET | /products/:id/edit | Edit product form |
| POST | /products/:id/edit | Update product |
| POST | /products/:id/delete | Delete product |

---

## Categories

Future implementation.

---

## Images

Future implementation.

---

# Future API Endpoints

Future versions will introduce:

```
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
```

---

# API Design Principles

The API follows several design principles.

## Consistency

Endpoints follow consistent naming conventions.

---

## Predictability

Resources behave similarly throughout the API.

---

## Statelessness

Every request contains all information required for processing.

Authentication is verified independently for every request.

---

## Separation of Concerns

Controllers coordinate requests.

Services execute business logic.

Repositories access the database.

---

## Future Compatibility

The API is designed so that future frontend applications can reuse the existing backend without modification.

---

# Future Evolution

Version 2 primarily serves Handlebars views.

Version 3 will introduce a React frontend consuming the REST API.

The business layer will remain unchanged, allowing both clients to reuse the same services and repositories.