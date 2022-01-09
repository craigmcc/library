import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders nav bar title', () => {
  render(<App />);
  const linkElement = screen.getByText(/library management/i);
  expect(linkElement).toBeInTheDocument();
});
