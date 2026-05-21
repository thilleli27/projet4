import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import RegisterScreen from '../app/register';

// On simule Firebase
jest.mock('../constants/firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));

describe('RegisterScreen', () => {

  // Test 1 — l'écran s'affiche correctement
  it('affiche le formulaire d\'inscription', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    expect(getByPlaceholderText('YourPseudo')).toBeTruthy();
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByText('Create my account →')).toBeTruthy();
  });

  // Test 2 — erreur si champs vides
  it('affiche une erreur si les champs sont vides', () => {
    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText('Create my account →'));
    expect(getByText('Please fill in all fields')).toBeTruthy();
  });

// Test 3 — erreur si pseudo trop court
it('affiche une erreur si le pseudo est trop court', () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('YourPseudo'), 'ab');
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'test@test.com');
    const passwordInputs = getAllByPlaceholderText('••••••••');
    fireEvent.changeText(passwordInputs[0], 'motdepasse');
    fireEvent.changeText(passwordInputs[1], 'motdepasse');
    fireEvent.press(getByText('Create my account →'));
    expect(getByText('Pseudonym must be at least 3 characters')).toBeTruthy();
  });

  // Test 4 — erreur si email invalide
  it('affiche une erreur si le format email est invalide', () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('YourPseudo'), 'MonPseudo');
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'pasunemail');
    const passwordInputs = getAllByPlaceholderText('••••••••');
    fireEvent.changeText(passwordInputs[0], 'motdepasse');
    fireEvent.changeText(passwordInputs[1], 'motdepasse');
    fireEvent.press(getByText('Create my account →'));
    expect(getByText('Invalid email format')).toBeTruthy();
  });

  // Test 5 — erreur si mot de passe trop court
  it('affiche une erreur si le mot de passe est trop court', () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('YourPseudo'), 'MonPseudo');
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'test@test.com');
    const passwordInputs = getAllByPlaceholderText('••••••••');
    fireEvent.changeText(passwordInputs[0], 'abc');
    fireEvent.changeText(passwordInputs[1], 'abc');
    fireEvent.press(getByText('Create my account →'));
    expect(getByText('Password must be at least 6 characters')).toBeTruthy();
  });

  // Test 6 — erreur si mots de passe différents
  it('affiche une erreur si les mots de passe ne correspondent pas', () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('YourPseudo'), 'MonPseudo');
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'test@test.com');
    const passwordInputs = getAllByPlaceholderText('••••••••');
    fireEvent.changeText(passwordInputs[0], 'motdepasse1');
    fireEvent.changeText(passwordInputs[1], 'motdepasse2');
    fireEvent.press(getByText('Create my account →'));
    expect(getByText('Passwords do not match')).toBeTruthy();
  });

});