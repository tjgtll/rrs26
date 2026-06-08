import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RHFForm } from '../components/RHFForm';
import { useFormStore } from '../store/formStore';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('RHFForm', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [], highlightNewId: null });
  });

  it('disables submit button when form is invalid', async () => {
    render(<RHFForm onSuccess={() => {}} />);
    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/Name/i), 'John');
    await userEvent.type(screen.getByTestId('rhf-age-input'), '25');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await userEvent.selectOptions(screen.getByLabelText(/Gender/i), 'male');
    await userEvent.click(screen.getByLabelText(/I accept/i));
    await userEvent.type(screen.getByLabelText(/^Password/i), 'Password123!');
    await userEvent.type(
      screen.getByLabelText(/Confirm Password/i),
      'Password123!'
    );
    await userEvent.type(screen.getByLabelText(/Country/i), 'USA');
    const option = await screen.findByText('USA');
    await userEvent.click(option);

    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1024 });
    const fileInput = screen.getByLabelText(/Profile Image/i);
    await userEvent.upload(fileInput, file);

    await waitFor(() => expect(submit).not.toBeDisabled());
  });

  it('submits valid data and calls onSuccess', async () => {
    const onSuccess = vi.fn();
    render(<RHFForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/Name/i), 'Jane');
    await userEvent.type(screen.getByTestId('rhf-age-input'), '30');
    await userEvent.type(screen.getByLabelText(/Email/i), 'jane@example.com');
    await userEvent.selectOptions(screen.getByLabelText(/Gender/i), 'female');
    await userEvent.click(screen.getByLabelText(/I accept/i));
    await userEvent.type(screen.getByLabelText(/^Password/i), 'Secure123!');
    await userEvent.type(
      screen.getByLabelText(/Confirm Password/i),
      'Secure123!'
    );
    await userEvent.type(screen.getByLabelText(/Country/i), 'Canada');
    const option = await screen.findByText('Canada');
    await userEvent.click(option);

    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 500000 });
    const fileInput = screen.getByLabelText(/Profile Image/i);
    await userEvent.upload(fileInput, file);

    const submit = screen.getByRole('button', { name: /submit/i });
    await waitFor(() => expect(submit).not.toBeDisabled());
    await userEvent.click(submit);
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
