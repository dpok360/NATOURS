const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const viewRouter = express.Router();

viewRouter.use(viewController.alerts);
viewRouter.get('/', authController.isLoggedIn, viewController.getOverview);
viewRouter.get(
  '/tour/:slug',
  authController.isLoggedIn,
  viewController.getTours,
);
viewRouter.get(
  '/login',
  authController.isLoggedIn,
  viewController.getLoginForm,
);
viewRouter.get('/me', authController.protect, viewController.getAccount);
viewRouter.get(
  '/my-tours',
  // bookingController.createBookingCheckout,
  authController.protect,
  viewController.getMyTours,
);

viewRouter.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);
module.exports = viewRouter;
