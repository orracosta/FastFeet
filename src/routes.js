import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

import SessionController from './app/controllers/SessionController';

import RecipientManagementController from './app/controllers/Management/RecipientManagementController';
import DeliverymanManagementController from './app/controllers/Management/DeliverymanManagementController';
import DeliveryManagementController from './app/controllers/Management/DeliveryManagementController';
import DeliveryController from './app/controllers/DeliveryController';

const routes = new Router();
const upload = multer(multerConfig);

/**
 * Public routes
 */

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index);
routes.put('/deliveryman/:id/:delivery', DeliveryController.update);

/**
 * Auth routes
 */

routes.use(authMiddleware);

/**
 * Admin routes
 */

routes.use(adminMiddleware);

routes.get('/admin/recipients', RecipientManagementController.index);
routes.post('/admin/recipients', RecipientManagementController.store);
routes.put('/admin/recipients', RecipientManagementController.update);

routes.get('/admin/deliveryman', DeliverymanManagementController.index);
routes.post('/admin/deliveryman', DeliverymanManagementController.store);
routes.delete('/admin/deliveryman/:id', DeliverymanManagementController.delete);

routes.get('/admin/delivery', DeliveryManagementController.index);
routes.post('/admin/delivery', DeliveryManagementController.store);
routes.delete('/admin/delivery/:id', DeliveryManagementController.delete);

export default routes;
