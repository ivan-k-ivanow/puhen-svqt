import { Router } from 'express';
import adminAuthController from '../controllers/admin-auth-controller.js';
import adminProductsController from '../controllers/admin-products-controller.js';
import productController from '../controllers/product-controller.js';
import { isAdmin } from '../middlewares/auth-middleware.js';
import categoryController from '../controllers/category-controller.js';

const routes = Router();

// general routes
routes.use('/api/products', productController);
routes.use('/api/auth', adminAuthController);

// admin routes
routes.use('/api/admin/products', isAdmin, adminProductsController);
routes.use('/api/admin/categories', isAdmin, categoryController);


export default routes;