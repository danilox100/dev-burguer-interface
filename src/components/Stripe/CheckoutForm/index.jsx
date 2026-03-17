import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { useState } from 'react';
import './styles.css';
import { useCart } from '../../../hooks/CartContext';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm() {
  const { cartProducts, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/complete',
      },
      redirect: 'if_required',
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const products = cartProducts.map((product) => ({
          id: product.id,
          quantity: product.quantity,
          price: product.price,
        }));
        const { status } = await api.post(
          '/orders',
          { products },
          {
            validateStatus: () => true,
          },
        );

        if (status === 200 || status === 201) {
          toast.success('Pedido realizado com sucesso!');

          setTimeout(() => {
            navigate(
              `/complete?payment_intent_client_secret=${paymentIntent.client_secret}`,
            );
            clearCart();
          }, 3000);
        } else if (status === 409) {
          toast.error('Falha ao realizar o seu pedido');
        } else {
          throw new Error();
        }
      } catch (error) {
        toast.error('Falha no Sistema! Tente novamente mais tarde');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="payment-form">
        <PaymentElement />

        <button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className="button"
        >
          {isLoading ? 'Processando...' : 'Pagar'}
        </button>
      </form>
    </div>
  );
}
