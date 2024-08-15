import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const h2Element = screen.getByText(/Unlocking the future of Web5:/i);
  expect(h2Element).toBeInTheDocument();
});
