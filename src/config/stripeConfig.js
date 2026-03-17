import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51T9YyMRpvtxvIL1xSgtNnHynGehekCgFmslUWJBnTTeyfCueUNzXDUNuzaAheitLrwCIeOWDFb05JXuq3IMVmZYr00oQ3D1EfY',
);

export default stripePromise;
