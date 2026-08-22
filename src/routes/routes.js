import { Router } from 'express';
import homeController from '../controllers/home-controller.js';
import adminAuthController from '../controllers/admin-auth-controller.js';
import adminProductsController from '../controllers/admin-products-controller.js';
import adminController from '../controllers/admin-home-controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth-middleware.js';

const routes = Router();

routes.use('/', homeController);
routes.use('/admin', adminAuthController);
routes.use('/admin', authMiddleware, isAdmin, adminController);
routes.use('/admin/products', authMiddleware, isAdmin, adminProductsController);

export default routes;