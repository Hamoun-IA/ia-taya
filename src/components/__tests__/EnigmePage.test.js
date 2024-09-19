import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserProvider } from '../../context/UserContext';
import EnigmePage from '../EnigmePage';
import { axe, toHaveNoViolations } from 'jest-axe';

jest.mock('react-speech-recognition');
jest.mock('react-speech-kit');
jest.mock('lottie-react');

const queryClient = new QueryClient();

const renderEnigmePage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <EnigmePage />
      </UserProvider>
    </QueryClientProvider>
  );
};

expect.extend(toHaveNoViolations);

describe('EnigmePage', () => {
  it('renders without crashing', () => {
    renderEnigmePage();
    expect(screen.getByText(/Énigme/i)).toBeInTheDocument();
  });

  it('allows changing difficulty', () => {
    renderEnigmePage();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'difficile' } });
    expect(select.value).toBe('difficile');
  });

  it('shows loading animation when generating enigma', async () => {
    renderEnigmePage();
    await waitFor(() => {
      expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    });
  });

  it('should have no accessibility violations', async () => {
    const { container } = renderEnigmePage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Ajoutez d'autres tests selon les fonctionnalités de votre composant
});