import { Router } from 'express';
import homeController from '../controllers/home-controller.js';
import adminAuthController from '../controllers/admin-auth-controller.js';
import adminProductsController from '../controllers/admin-products-controller.js';
import adminController from '../controllers/admin-home-controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth-middleware.js';
import categoryController from '../controllers/category-controller.js';
import productController from '../controllers/product-controller.js';

const routes = Router();


routes.use('/api/auth', adminAuthController);
routes.use('/admin', authMiddleware, isAdmin, adminController);
routes.use('/admin/products', authMiddleware, isAdmin, adminProductsController);
routes.use('/admin/categories', authMiddleware, isAdmin, categoryController);

// Handlebars API endpoints
routes.use('/product', productController);

// React API endpoints
routes.use('/', homeController);
routes.use('/api/products', productController);

export default routes;