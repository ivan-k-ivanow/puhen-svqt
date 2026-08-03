# Coding Standards

## Purpose

This document defines the coding standards and conventions used throughout the Puhen Svqt project.

The goal is to maintain a clean, consistent, and maintainable codebase by ensuring that all modules follow the same structure, naming conventions, and development practices.

These standards should be followed throughout the lifetime of the project.

---

# General Principles

The project follows several core software engineering principles:

- Write readable code before clever code.
- Prefer consistency over personal preference.
- Keep functions small and focused.
- Each module should have a single responsibility.
- Avoid duplicated code.
- Follow established project conventions.

---

# Project Structure

The application follows a modular MVC architecture.

```
src/
│
├── config/
├── controllers/
├── middlewares/
├── repositories/
├── routes/
├── schemas/
├── services/
├── utils/
├── views/
├── public/
└── lib/
```

Each folder has a single responsibility and should only contain files related to that responsibility.

---

# File Naming

All files use **kebab-case**.

Examples:

```
product.controller.js
product.service.js
product.repository.js
product.schema.js
product.routes.js
auth.middleware.js
error.utils.js
```

Avoid:

```
ProductController.js
productController.js
Product.controller.js
```

---

# Folder Naming

Folders use **kebab-case**.

Examples:

```
controllers
middlewares
repositories
schemas
services
utils
```

---

# Prisma Models

Prisma models use **PascalCase** and singular names.

Example:

```prisma
model Product

model Category

model Image

model User
```

Database tables use plural names through Prisma mapping.

```prisma
@@map("products")
```

---

# Variables

Variables use **camelCase**.

Examples:

```javascript
const product

const productId

const categoryName

const currentUser
```

Avoid abbreviations unless they are universally understood.

---

# Constants

Constants use **UPPER_SNAKE_CASE**.

Example:

```javascript
const MAX_UPLOAD_SIZE

const JWT_EXPIRATION
```

---

# Functions

Function names should clearly describe their purpose.

Examples:

```javascript
createProduct()

updateProduct()

deleteProduct()

getProductById()

getAllProducts()
```

Avoid vague names.

Examples:

```
doStuff()

handle()

test()

run()
```

---

# Controllers

Controllers coordinate HTTP requests.

Responsibilities:

- Receive requests.
- Validate input.
- Call services.
- Render views.
- Return JSON.
- Redirect users.

Controllers should **not** contain business logic.

---

# Services

Services implement business logic.

Responsibilities:

- Execute business rules.
- Coordinate operations.
- Call repositories.
- Prepare data.

Services should not contain HTTP-specific logic.

---

# Repositories

Repositories communicate with the database.

Responsibilities:

- Execute Prisma queries.
- Retrieve entities.
- Persist entities.
- Hide database implementation details.

Repositories should never contain business rules.

---

# Validation

Validation is performed using Zod.

Each module owns its own schema.

Examples:

```
product.schema.js

category.schema.js

user.schema.js
```

Validation occurs before business logic is executed.

---

# Routes

Routes should remain simple.

Example:

```
GET /products

GET /products/:id

POST /products

PUT /products/:id

DELETE /products/:id
```

Routes should delegate responsibility to controllers.

---

# Error Handling

Errors should be handled as close to their source as possible.

Controllers are responsible for:

- Rendering error pages.
- Returning HTTP status codes.
- Displaying validation messages.

Business errors should originate from the Service layer.

---

# Imports

Import order should remain consistent.

1. Node modules

2. External packages

3. Internal modules

Example:

```javascript
import express from "express";

import bcrypt from "bcrypt";

import { productService } from "../services/product.service.js";

import { getErrorMessage } from "../utils/error.utils.js";
```

---

# Comments

Code should be self-explanatory.

Comments should explain **why**, not **what**.

Good:

```javascript
// Products are soft-deleted to preserve order history.
```

Bad:

```javascript
// Increment i.
i++;
```

---

# Code Style

- Prefer early returns.
- Avoid deeply nested conditions.
- Keep functions focused.
- Use descriptive variable names.
- Prefer async/await over promise chains.

Example:

```javascript
if (!product) {
    return res.status(404).render("404");
}
```

instead of

```javascript
if (product) {
    ...
}
```

---

# Separation of Concerns

Every layer has a single responsibility.

| Layer | Responsibility |
|--------|----------------|
| Routes | URL mapping |
| Controllers | Request handling |
| Services | Business logic |
| Repositories | Database access |
| Prisma | ORM |
| PostgreSQL | Data storage |

---

# Future Growth

As new modules are introduced, they should follow the same structure.

Example:

```
product/

category/

order/

customer/

wishlist/

review/
```

Every module should contain:

- Controller
- Service
- Repository
- Validation Schema
- Routes

This consistency ensures that every feature is organized in the same predictable manner.

---

# Guiding Principle

Every developer working on the project should be able to understand any module by looking at its structure alone.

Consistency is preferred over individual coding style.