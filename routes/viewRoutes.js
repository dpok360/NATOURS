const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const viewRouter = express.Router();

viewRouter.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);
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
viewRouter.get('/my-tours', authController.protect, viewController.getMyTours);

viewRouter.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);

module.exports = viewRouter;
