import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51PgLSl2MJQnEPzJbai0xqdy6bDYXi9XXjfIfIiVkOZ5qABs8aFd8gXxjqgDWT1MQhYrlqHqvx7j9eOyxWfEpPvOu001dT3Nucb',
);

exports.bookTour = async (tourId) => {
  try {
    //1.get checkout session from api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    // 2.create checkout form + charge c card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
