import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { useFormStore } from '../store/formStore';
import { describe, it, expect, beforeEach } from 'vitest';

describe('App', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [], highlightNewId: null });
  });

  it('renders buttons to open forms', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /Uncontrolled Form/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /React Hook Form/i })
    ).toBeInTheDocument();
  });

  it('opens uncontrolled form modal', async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole('button', { name: /Uncontrolled Form/i })
    );
    expect(
      screen.getByRole('heading', { name: /Uncontrolled Form/i })
    ).toBeInTheDocument();
  });

  it('opens React Hook Form modal', async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole('button', { name: /React Hook Form/i })
    );
    expect(
      screen.getByRole('heading', { name: /React Hook Form/i })
    ).toBeInTheDocument();
  });

  it('displays submission cards', () => {
    const { addSubmission } = useFormStore.getState();
    addSubmission({
      name: 'Test User',
      age: 20,
      email: 'test@example.com',
      gender: 'male',
      terms: true,
      password: 'Pass123!',
      confirmPassword: 'Pass123!',
      country: 'USA',
      imageBase64: '',
    });
    render(<App />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Age: 20')).toBeInTheDocument();
    expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
  });
});
