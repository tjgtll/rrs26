import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UncontrolledForm } from '../components/UncontrolledForm';
import { useFormStore } from '../store/formStore';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('UncontrolledForm', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [], highlightNewId: null });
  });

  it('shows validation errors on submit with empty fields', async () => {
    render(<UncontrolledForm onSuccess={() => {}} />);
    const submit = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submit);
    expect(
      await screen.findByText(/First letter must be uppercase/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You must accept the Terms and Conditions/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Please select a country/i)).toBeInTheDocument();
  });

  it('submits valid data and calls onSuccess', async () => {
    const onSuccess = vi.fn();
    render(<UncontrolledForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/Name/i), 'John');
    await userEvent.type(screen.getByTestId('uc-age-input'), '25');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await userEvent.selectOptions(screen.getByLabelText(/Gender/i), 'male');
    await userEvent.click(screen.getByLabelText(/I accept/i));
    await userEvent.type(screen.getByLabelText(/^Password/i), 'Password123!');
    await userEvent.type(
      screen.getByLabelText(/Confirm Password/i),
      'Password123!'
    );
    await userEvent.type(screen.getByLabelText(/Country/i), 'USA');
    await waitFor(() => expect(screen.getByText('USA')).toBeInTheDocument());
    const option = screen.getByText('USA');
    await userEvent.click(option);

    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1024 });
    const fileInput = screen.getByLabelText(/Profile Image/i);
    await userEvent.upload(fileInput, file);

    const submit = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submit);
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
