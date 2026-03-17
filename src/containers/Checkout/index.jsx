import { useLocation } from 'react-router-dom';
import stripePromise from '../../config/stripeConfig';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/Stripe/CheckoutForm';

export function Checkout() {
  const location = useLocation();

  const clientSecret = location?.state?.clientSecret;

  const options = {
    clientSecret,
  };

  if (!clientSecret) {
    return <h2>Erro ao iniciar pagamento</h2>;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
