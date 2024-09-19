// Ajoutez ces lignes au début du fichier
jest.mock('react-speech-recognition');
jest.mock('react-speech-kit');
jest.mock('lottie-react');

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import 'regenerator-runtime/runtime';

// Supprime l'avertissement act()
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

configure({ asyncUtilTimeout: 5000 });
