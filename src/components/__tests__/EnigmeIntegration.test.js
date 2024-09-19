import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserProvider } from '../../context/UserContext';
import App from '../../App';

const queryClient = new QueryClient();

const renderApp = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <App />
      </UserProvider>
    </QueryClientProvider>
  );
};

describe('Enigme Integration', () => {
  it('navigates from main menu to enigme page', async () => {
    renderApp();
    const enigmeLink = await screen.findByText(/Commencer une énigme/i);
    fireEvent.click(enigmeLink);
    await waitFor(() => {
      expect(screen.getByText(/Énigme/i)).toBeInTheDocument();
    });
  });

  // Ajoutez d'autres tests d'intégration selon vos besoins
});