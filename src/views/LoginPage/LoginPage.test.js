import {fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginPage from './LoginPage';
import { LoginProvider } from '../../context/LoginContext/LoginContext';

test('renders password input', () => {
  render( <LoginProvider> <LoginPage /> </LoginProvider>);

  const linkElement = screen.getByLabelText(/Hasło/)
  expect(linkElement).toBeInTheDocument();
});


test('renders email input', async () => {
  render( <LoginProvider> <LoginPage /> </LoginProvider>);

  const submitButton = screen.getByRole('button', {name: /Sign In/i})

  fireEvent.click(submitButton)

  const emailError = await screen.findByText(/E-Mail jest wymagany/i)
  const passwordError = await screen.findByText(/Hasło jest wymagane/i)

  expect(submitButton).toBeInTheDocument();
  expect(emailError).toBeInTheDocument();
  expect(passwordError).toBeInTheDocument();
});
