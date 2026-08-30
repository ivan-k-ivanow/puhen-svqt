# Development Tasks

## Purpose

This document contains the implementation plan for **Puhen Svqt Version 2**.

Development is divided into milestones.

Each milestone must be completed, tested, and committed before moving to the next one.

Every feature follows the same implementation workflow:

1. Database
2. Repository
3. Service
4. Validation
5. Controller
6. Routes
7. Views
8. Testing
9. Documentation

---

# Milestone 1 - Project Setup

## Goal

Create the project and make sure the application runs successfully.

### GitHub

- [ ] Create GitHub repository
- [ ] Clone repository locally
- [ ] Open project in VS Code
- [ ] Create README.md
- [ ] Add `.gitignore`

---

### Node Project

- [x] Run `npm init`
- [x] Set `"type": "module"`

---

### package.json

Add:

```json
"scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
}
```

---

### Install Packages

- [x] express
- [x] express-handlebars
- [x] prisma
- [x] @prisma/client
- [x] bcrypt
- [x] jsonwebtoken
- [x] cookie-parser
- [x] zod
- [x] dotenv
- [x] cors

---

### Create Folder Structure

```
src/

config/
controllers/
middlewares/
repositories/
routes/
schemas/
services/
utils/
views/
public/
lib/
```

---

### Express

- [x] Create `index.js`
- [x] Create Express application
- [x] Configure Handlebars
- [x] Configure static files
- [x] Register routes
- [x] Verify application starts

---

### Environment

Create `.env`

Add:

```
DATABASE_URL=
JWT_SECRET=
```

- [x] Install dotenv
- [x] Import `dotenv/config`

---

### Finish Checklist

- [x] Application runs successfully
- [x] Handlebars renders pages
    - [x] Rendered home page without the products
    - [x] Render Admin, create admin layout and add header and footer, then create
    

---

# Milestone 2 - Database

## Goal

Connect the application to PostgreSQL using Prisma.

### PostgreSQL

- [x] Create local PostgreSQL database (`puhen_svqt`)

---

### Prisma

- [x] Run `npx prisma init`
- [x] Configure `schema.prisma`
- [x] Configure datasource
- [x] Generate Prisma Client

---

### User Model

- [x] Create User model
- [x] Add email
- [x] Add password

---

### Migration

- [x] Create first migration
- [x] Apply migration

---

### Seed

- [x] Create administrator seed
- [x] Hash administrator password
- [x] Seed administrator

---

### Finish Checklist

- [x] Prisma connected
- [x] Administrator exists
- [x] Prisma Studio works

---

# Milestone 3 - Authentication

## Goal

Allow administrators to securely log into the application.

### Repository

- [x] Find user by email
- [x] Find user by id

---

### Service

- [x] Login
- [x] Logout

---

### Validation

- [x] Login schema

---

### JWT

- [x] Generate JWT
- [x] Verify JWT
- [x] Store JWT in cookie

---

### Middleware

- [x] Authentication middleware
- [x] Guest middleware

---

### Controller

- [x] Login page
- [x] Login action
- [x] Logout

---

### Views

- [x] Login page

---

### Finish Checklist

- [x] Administrator can login
- [x] Administrator can logout
- [x] Protected routes work

---

# Milestone 4 - Categories

## Goal

Complete Category CRUD.

### Database

- [x] Category model
- [x] Migration

---

### Repository

- [x] Create
- [x] Get All
- [x] Get By Id
- [x] Update
- [x] Delete

---

### Service

- [x] Create category
- [x] Edit category
- [x] Delete category
- [x] Get All categories

---

### Validation

- [x] Category schema

---

### Controller

- [x] Render on create product page
- [x] Create
- [ ] Delete // first we need relation to products which we dont have at the moment

---

### Views

- [ ] Dashboard
- [ ] Create
- [ ] Edit

---

### Finish Checklist

- [ ] Full Category CRUD completed

---

# Milestone 5 - Images

## Goal

Store product images.

**Version 2**

Images are stored as URLs.

(Cloudinary will be introduced in a future version.)

---

### Database

- [ ] Image model
- [ ] Migration

---

### Repository

- [ ] Add image
- [ ] Delete image

---

### Service

- [ ] Add image
- [ ] Delete image

---

### Validation

- [ ] Image schema

---

### Controller

- [ ] Upload page
- [ ] Delete image

---

### Views

- [ ] Upload page

---

### Finish Checklist

- [ ] Images can be managed

---

# Milestone 6 - Products

## Goal

Complete Product CRUD.

### Database

- [ ] Product model
- [ ] Product → Category relationship
- [ ] Product → Image relationship
- [ ] Migration

---

### Repository

- [ ] Create
- [ ] Get All
- [ ] Get By Id
- [ ] Get Latest
- [ ] Search
- [ ] Update
- [ ] Delete

---

### Service

- [ ] Product CRUD
- [ ] Latest products
- [ ] Search
- [ ] Filter by category

---

### Validation

- [ ] Product schema

---

### Controller

- [ ] Dashboard
- [ ] Details
- [ ] Create
- [ ] Edit
- [ ] Delete

---

### Views

- [ ] Dashboard
- [ ] Details
- [ ] Create
- [ ] Edit

---

### Finish Checklist

- [ ] Full Product CRUD completed

---

# Milestone 7 - Public Website

## Goal

Build the public catalog.

- [ ] Home page
- [ ] Latest products
- [ ] Product catalog
- [ ] Product details
- [ ] Browse by category
- [ ] Search
- [ ] Navigation
- [ ] Footer

---

### Finish Checklist

- [ ] Public website completed

---

# Milestone 8 - Administration

## Goal

Finish the administrator experience.

- [ ] Dashboard
- [ ] Product management
- [ ] Category management
- [ ] Image management

---

### Finish Checklist

- [ ] Administrator panel completed

---

# Milestone 9 - User Experience

- [ ] Success messages
- [ ] Error messages
- [ ] Empty states
- [ ] 401 page
- [ ] 403 page
- [ ] 404 page
- [ ] Responsive design

---

# Milestone 10 - Security

- [ ] Verify passwords using bcrypt
- [ ] Protect administrator routes
- [ ] Verify JWT on every request
- [ ] Store JWT in HTTP-only cookies

---

# Milestone 11 - Deployment

## Goal

Deploy the application.

### Database

- [ ] Create Supabase PostgreSQL database
- [ ] Update `DATABASE_URL`

---

### Application

- [ ] Run production migrations
- [ ] Seed administrator
- [ ] Test production database

---

### Deployment

- [ ] Deploy application
- [ ] Test production website

---

# Future Versions

## Version 3

- [ ] React frontend
- [ ] REST API
- [ ] Pagination
- [ ] Advanced Search

---

## Version 4

- [ ] Customer accounts
- [ ] Customer registration
- [ ] Shopping cart
- [ ] Checkout
- [ ] Orders
- [ ] Payments
- [ ] Wishlist
- [ ] Reviews

---

## Version 5

- [ ] Cloudinary
- [ ] Inventory management
- [ ] Product variants
- [ ] Discounts
- [ ] Coupons
- [ ] Analytics
- [ ] Newsletter
- [ ] Administrator management
- [ ] Roles & Permissions