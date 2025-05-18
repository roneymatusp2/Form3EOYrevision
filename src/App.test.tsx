import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Conflito resolvido escolhendo a descrição mais específica
test('renders Form 3 Mathematics heading', () => {
  render(<App />);
  const heading = screen.getByText(/Form 3 Mathematics/i);
  expect(heading).toBeInTheDocument();
});