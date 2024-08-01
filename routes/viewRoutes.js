const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const viewRouter = express.Router();

viewRouter.use(viewsController.alerts);
viewRouter.get('/', authController.isLoggedIn, viewsController.getOverview);
viewRouter.get(
  '/tour/:slug',
  authController.isLoggedIn,
  viewsController.getTours,
);
viewRouter.get(
  '/login',
  authController.isLoggedIn,
  viewsController.getLoginForm,
);
viewRouter.get('/me', authController.protect, viewsController.getAccount);
viewRouter.get(
  '/my-tours',
  // bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours,
);

viewRouter.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData,
);
module.exports = viewRouter;
