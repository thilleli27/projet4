import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import LoginScreen from '../app/login';

// On simule Firebase pour ne pas avoir besoin d'une vraie connexion
jest.mock('../constants/firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));

describe('LoginScreen', () => {

  // Test 1 — l'écran s'affiche correctement
  it('affiche le formulaire de connexion', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  // Test 2 — erreur si champs vides
  it('affiche une erreur si les champs sont vides', () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Sign In'));
    expect(getByText('Please fill in all fields')).toBeTruthy();
  });

  // Test 3 — erreur si email invalide
  it('affiche une erreur si le format email est invalide', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'pasunemail');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'motdepasse');
    fireEvent.press(getByText('Sign In'));
    expect(getByText('Invalid email format')).toBeTruthy();
  });

  // Test 4 — erreur si mot de passe trop court
  it('affiche une erreur si le mot de passe est trop court', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'abc');
    fireEvent.press(getByText('Sign In'));
    expect(getByText('Password must be at least 6 characters')).toBeTruthy();
  });

});