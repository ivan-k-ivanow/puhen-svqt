# Functional Requirements

## Overview

This document defines the functional behavior of the application from the perspective of its users. Functional requirements describe what the system must do and how different users interact with it.

---

# Visitor

Visitors are unauthenticated users who can browse the public website.

### Product Catalog

- Browse all available products.
- View product details.
- Browse products by category.
- Search for products.
- View featured products.
- View similar products.

### Navigation

- Navigate through the website.
- Access the FAQ page.
- Access the contact page.

---

# Administrator

Administrators have full access to the administration panel.

### Authentication

- Log in securely.
- Log out.
- Access protected administration pages.

### Product Management

- Create products.
- Edit products.
- Delete products.
- Upload product images.
- Assign categories.
- Mark products as featured.
- Control product visibility.

### Category Management

- Create categories.
- Edit categories.
- Delete categories.

### Image Management

- Upload images.
- Remove images.
- Select a primary image.

---

# Future Customer

Future versions of the application will introduce registered customers.

### Customer Account

- Register.
- Log in.
- Manage profile.

### Shopping

- Add products to cart.
- Remove products from cart.
- Complete orders.
- Save favorite products.
- Submit product reviews.

---

# System

The application shall:

- Validate all user input.
- Authenticate administrators.
- Authorize protected operations.
- Store all data securely.
- Display appropriate error messages.
- Prevent unauthorized access.