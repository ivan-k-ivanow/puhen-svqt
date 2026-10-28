# Puhen Svqt - Handmade Gifts

**Live Website:** [https://puhensvqt.com](https://puhensvqt.com)
**Backend API:** [https://api.puhensvqt.com](https://api.puhensvqt.com)
**GitHub Repository:** [https://github.com/ivan-k-ivanow/puhen-svqt](https://github.com/ivan-k-ivanow/puhen-svqt)

## About the Project

Puhen Svqt is an online catalog for handmade gifts and decorations. Visitors can explore products, filter them by category, view product details and images, and contact the shop to place an order. An authenticated administrator can manage products, categories, and product images through a dedicated admin panel.

## Features

- Product catalog with category filtering
- Product details, image gallery, and similar products
- Contact links for ordering
- Admin login and protected admin routes
- Create, read, update, and delete products
- Product category selection and image uploads
- Loading, success, and error feedback

## Technologies

- **Frontend:** React, Vite, React Router, CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Image Storage:** Supabase Storage
- **Deployment:** Render

## Project Structure

```text
puhen-svqt/
├── client/       # React frontend
├── server/       # Node.js/Express backend
├── prisma/       # Database schema and migrations
├── .env          # Local environment variables
└── README.md
```

## Local Installation

### Prerequisites

Install Node.js and npm. You will also need the required environment variables and access to the configured database.

### 1. Install dependencies

Run these commands from the project root:

```bash
npm install --prefix server
npm install --prefix client
```

### 2. Configure environment variables

Configure the root `.env` file with the required server-side variables, including `DATABASE_URL` and the authentication and storage secrets used by the application.

Create `client/.env` for local development:

```env
VITE_API_URL=http://localhost:3000
```

Never commit secret values or `.env` files to GitHub.

### 3. Start the backend

```bash
cd server
npm start or npm run dev
```

### 4. Start the frontend

Open a second terminal:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite in the terminal.

### Important: On first load you may have to wait 10-30 sec for Render to wake up the backend, because we are using the free plan.

---

# Functional Guide

## 1. Project Overview

**Application Name:** Puhen Svqt
**Category:** Handmade Gifts / Product Catalog

The application allows visitors to discover handmade gifts and decorations through an online catalog. It also provides an administrative interface for managing the products displayed on the website.

## 2. User Access & Permissions

**Guest visitors can:**

- Browse the catalog and filter products by category.
- View product details, images, and similar products.
- Use the available contact links to enquire about ordering.

**Administrators can:**

- Sign in and sign out.
- View and manage products.
- Create, edit, and delete products.
- Select product categories and upload product images.

## 3. Authentication & Session Handling

The admin login form sends credentials to the backend API. The backend validates them and issues an authentication token stored in an HTTP-only cookie. Authentication state is checked by the application, and protected admin routes require appropriate access. Logging out ends the authenticated session.

## 4. Routing Structure

React Router provides client-side navigation.

Main routes include:

- `/` - home page and product catalog
- `/products/:slug` - product details
- `/admin/login` - administrator login
- `/admin/products` - product management
- `/admin/products/create` - create a product
- `/admin/products/:id/edit` - edit a product

Admin routes are protected by authentication and authorization checks.

## 5. List → Details Flow

The catalog retrieves products from the API and displays them as product cards. Visitors can filter the catalog by category and open a product using its slug. The details page loads the selected product and displays its information, images, and similar products.

## 6. Data Source & Backend

The frontend communicates with a custom Node.js/Express REST API. PostgreSQL stores application data, Prisma handles database access, and Supabase Storage stores product images. The frontend and backend are deployed separately on Render.

## 7. Data Operations (CRUD)

Product management is available through the admin panel:

- **Create:** Submit the product form with its details, categories, and images.
- **Read:** Retrieve and display products in the catalog and admin table.
- **Update:** Load an existing product into the form and save changes.
- **Delete:** Send a deletion request to the API and update the list after success.

These operations require administrator access.

## 8. Forms & Validation

The application includes an admin login form and product forms for creating and editing products. Login data is validated by the backend, and protected API routes enforce authorization. Forms display feedback for successful and unsuccessful requests. Product validation is handled by the relevant client and server logic.

## 9. React-Specific Techniques

The application uses reusable React components and hooks such as `useState` and `useEffect` for state management and data loading. React Router handles navigation and URL parameters. Shared authentication state is used by admin-related components, and external CSS files provide component styling.

## 10. Typical User Flow

1. A visitor opens the website and browses the product catalog.
2. The visitor filters products by category.
3. The visitor opens a product details page and views its images.
4. The visitor uses a contact link to enquire about ordering.

An administrator can separately sign in to manage the catalog.

## 11. Error & Edge Case Handling

The interface handles loading, empty, and error states for data requests where implemented. Login failures are displayed to the user, and protected API routes reject requests without appropriate administrator access. Product pages account for missing image data.

---

## Notes for Reviewers

The deployed website contains real product data. Please do not edit or delete existing products when reviewing the admin panel. To test product management, create a separate test product and make changes only to that product.
