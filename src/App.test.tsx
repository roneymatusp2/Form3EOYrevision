import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Form 3 Mathematics header', () => {
  render(<App />);
  const header = screen.getByText(/Form 3 Mathematics/i);
  expect(header).toBeInTheDocument();
});
