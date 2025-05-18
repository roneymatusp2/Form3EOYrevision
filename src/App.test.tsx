import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page header', () => {
  render(<App />);
  const heading = screen.getByText(/Form 3 Mathematics/i);
  expect(heading).toBeInTheDocument();
});
