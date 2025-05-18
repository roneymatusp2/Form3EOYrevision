import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page heading', async () => {
  render(<App />);
  const heading = await screen.findByText(/Form 3 Mathematics/i);
  expect(heading).toBeInTheDocument();
});
