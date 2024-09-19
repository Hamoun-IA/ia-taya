import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';

const queryClient = new QueryClient();

test('renders main menu', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  );
  await waitFor(() => {
    const mainMenuElement = screen.getByText(/Jeu d'énigmes pour enfants/i);
    expect(mainMenuElement).toBeInTheDocument();
  });
});
