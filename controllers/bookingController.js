const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFacotory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1.get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  //2.create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });
  //3.cretae session as res
  res.status(200).json({
    status: 'success',
    session,
  });
});

// const createBookingCheckout = async (session) => {
//   try {
//     const tour = session.client_reference_id;
//     console.log('Session Data:', session);
//     if (!tour) throw new Error('Missing client_reference_id in session.');
//     const user = (await User.findOne({ email: session.customer_email })).id;
//     console.log('User ID:', user);
//     if (!user) throw new Error('User not found for given customer_email.');
//     if (!session.line_items || session.line_items.data.length === 0) {
//       throw new Error('line_items is missing or empty.');
//     }
//     const lineItem = session.line_items.data[0];
//     const price = lineItem.price.unit_amount / 100;
//     console.log('Line Item:', lineItem);
//     console.log('Price:', price);
//     await Booking.create({ tour, user, price });
//   } catch (error) {
//     throw error;
//   }
// };

// exports.webhookCheckout = async (req, res, next) => {
//   const signature = req.headers['stripe-signature'];

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   } catch (err) {
//     return res.status(400).send(`webhook error: ${err.message}`);
//   }
//   if (event.type === 'checkout.session.completed') {
//     const sessionId = event.data.object.id;
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     await createBookingCheckout(session);
//   }
//   res.status(200).send({ received: true });
// };
const createBookingCheckout = async (session) => {
  try {
    const tour = session.client_reference_id;
    console.log('Session Data:', session);
    if (!tour) throw new Error('Missing client_reference_id in session.');

    const user = await User.findOne({ email: session.customer_email });
    if (!user) throw new Error('User not found for given customer_email.');

    if (!session.line_items || session.line_items.data.length === 0) {
      throw new Error('line_items is missing or empty.');
    }

    const lineItem = session.line_items.data[0];
    const price = lineItem.price.unit_amount / 100;

    console.log('Tour ID:', tour);
    console.log('User ID:', user.id);
    console.log('Line Item:', lineItem);
    console.log('Price:', price);

    await Booking.create({ tour, user: user.id, price });
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const sessionId = event.data.object.id;
    try {
      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items'], // Ensure line items are included
      });

      // Pass the full session data to createBookingCheckout
      await createBookingCheckout(session);
    } catch (error) {
      console.error('Error retrieving session or creating booking:', error);
      return res.status(500).send(`Webhook error: ${error.message}`);
    }
  }

  res.status(200).send({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
