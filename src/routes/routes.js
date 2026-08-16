import { Router } from 'express';
import homeController from '../controllers/home-controller.js';
import adminLoginController from '../controllers/admin-login-controller.js';
import adminProductsController from '../controllers/admin-products-controller.js';
import adminController from '../controllers/admin-home-controller.js';

const routes = Router();

routes.use('/', homeController);
routes.use('/admin/login', adminLoginController);
routes.use('/admin', adminController);
routes.use('/admin/products', adminProductsController);

export default routes;