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
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

const routes = new Router();
const upload = multer(multerConfig);

/**
 * Public routes
 */

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index);
routes.put(
  '/deliveryman/:id/:delivery',
  upload.single('file'),
  DeliveryController.update
);

routes.get('/delivery/problems', DeliveryProblemsController.index);
routes.get('/delivery/:delivery_id/problems', DeliveryProblemsController.show);
routes.post(
  '/delivery/:delivery_id/problems',
  DeliveryProblemsController.store
);
routes.delete(
  '/problem/:problem_id/cancel-delivery',
  DeliveryProblemsController.delete
);

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
routes.put(
  '/admin/deliveryman/:id',
  upload.single('file'),
  DeliverymanManagementController.update
);
routes.delete('/admin/deliveryman/:id', DeliverymanManagementController.delete);

routes.get('/admin/delivery', DeliveryManagementController.index);
routes.post('/admin/delivery', DeliveryManagementController.store);
routes.delete('/admin/delivery/:id', DeliveryManagementController.delete);

export default routes;
