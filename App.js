import React from 'react';
import Navigation from './componente/Navigation';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51OD7zLHn21NxuraN8ywJbesaVTMhrD9yx04jL3oJohcZMOh9DAXBKwjD0xtZ7X0BYn5eSyPcjMwG3YOt3lKL572r00UJnJUVCM">
      <Navigation />
    </StripeProvider>
  );
}


