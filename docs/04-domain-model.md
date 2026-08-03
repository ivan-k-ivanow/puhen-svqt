# Domain Model

## Purpose

The Domain Model defines the core business entities of the Puhen Svqt application, their responsibilities, relationships, and business rules.

It represents the business domain independently of any implementation details, programming language, framework, or database technology.

This document serves as the foundation for the database design, application architecture, and future system development.

---

# Core Domain

The primary purpose of the application is to manage and present handcrafted products offered by the Puhen Svqt business.

The domain revolves around four primary business entities:

- Product
- Category
- Image
- User

Future versions will introduce additional entities such as Customers, Orders, Reviews, and Wishlists.

---

# Product

## Purpose

Represents a handcrafted item that is available for display and future purchase through the Puhen Svqt website.

Products are the central entity of the application.

---

## Responsibilities

A Product is responsible for:

- Storing product information.
- Belonging to a category.
- Displaying one or more images.
- Being visible or hidden from the public website.
- Being marked as featured.
- Being managed by an authenticated administrator.

---

## Relationships

A Product:

- Belongs to one Category.
- Has one or more Images.
- Is managed by a User (Administrator).

---

## Business Rules

- Every product must have a name.
- Every product must belong to a category.
- Every product must contain at least one image.
- Hidden products are not visible to guests.
- Featured products may appear on the homepage.
- Product names should be unique.

---

## Future Extensions

Future versions may include:

- Product variants
- Inventory
- Discounts
- Reviews
- Wishlist support

---

# Category

## Purpose

Represents a logical collection of products.

Categories improve product organization, navigation, and discovery.

---

## Responsibilities

A Category is responsible for:

- Organizing products.
- Supporting navigation.
- Supporting filtering.
- Improving product discovery.

---

## Relationships

A Category:

- Contains many Products.

---

## Business Rules

- Category names must be unique.
- A category may contain multiple products.
- Products cannot exist without a category.
- Categories containing products cannot be deleted until those products are reassigned or removed.

---

## Future Extensions

Future versions may support:

- Nested categories
- Category images
- Category descriptions
- SEO metadata

---

# Image

## Purpose

Represents an image associated with a product.

Images provide visual representation of handmade products.

---

## Responsibilities

An Image is responsible for:

- Storing the image location.
- Representing the product visually.
- Supporting image galleries.
- Identifying the primary product image.

---

## Relationships

An Image:

- Belongs to one Product.

A Product:

- Contains one or more Images.

---

## Business Rules

- Every image belongs to exactly one product.
- Every product must have a primary image.
- Multiple images may be associated with a single product.

---

## Future Extensions

Future versions may support:

- Image ordering
- Image optimization
- Multiple image sizes
- Cloud storage
- Image metadata

---

# User

## Purpose

Represents an authenticated administrator responsible for managing the application.

During Version 2, only administrator accounts exist.

---

## Responsibilities

A User is responsible for:

- Authenticating into the system.
- Managing products.
- Managing categories.
- Managing product images.
- Maintaining website content.

---

## Relationships

A User:

- Manages many Products.

---

## Business Rules

- Only authenticated users may access the administration panel.
- User email addresses must be unique.
- Passwords must be securely hashed before storage.

---

## Future Extensions

Future versions will introduce:

- Customer accounts
- User roles
- Permissions
- User profiles
- Password recovery

---

# Future Domain Entities

The following entities are planned for future versions of the application.

They are intentionally documented now to ensure that current architectural decisions support future expansion.

## Customer

Registered users capable of placing orders, managing personal information, and interacting with products.

---

## Order

Represents a customer's purchase.

Contains one or more Order Items.

---

## Order Item

Represents a single product within an order.

Stores quantity and purchase price.

---

## Wishlist

Represents products saved by customers for future purchase.

---

## Review

Represents customer feedback and product ratings.

---

# Domain Relationships

Current Version

User

↓

Product

↓

Category

↓

Image

Future Version

Customer

↓

Order

↓

Order Item

↓

Product

↓

Category

↓

Image

↓

Review

↓

Wishlist

---

# Domain Evolution

The domain model is designed to evolve incrementally.

Version 2 focuses on product management and administration.

Future versions will extend the existing model rather than replacing it.

The architecture should allow new business entities to be introduced with minimal impact on existing functionality.