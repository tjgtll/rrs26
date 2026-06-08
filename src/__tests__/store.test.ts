import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFormStore } from '../store/formStore';

describe('formStore', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [], highlightNewId: null });
  });

  it('adds submission and sets highlight', () => {
    const { addSubmission } = useFormStore.getState();
    addSubmission({
      name: 'John',
      age: 25,
      email: 'john@example.com',
      gender: 'male',
      terms: true,
      password: 'Pass123!',
      confirmPassword: 'Pass123!',
      country: 'USA',
      imageBase64: 'data:image/png;base64,xxx',
    });
    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].name).toBe('John');
    expect(state.highlightNewId).toBe(state.submissions[0].id);
  });

  it('removes highlight after 3 seconds', () => {
    vi.useFakeTimers();
    const { addSubmission } = useFormStore.getState();
    addSubmission({
      name: 'Jane',
      age: 30,
      email: 'jane@example.com',
      gender: 'female',
      terms: true,
      password: 'Pass123!',
      confirmPassword: 'Pass123!',
      country: 'Canada',
      imageBase64: '',
    });
    expect(useFormStore.getState().highlightNewId).not.toBeNull();
    vi.advanceTimersByTime(3000);
    expect(useFormStore.getState().highlightNewId).toBeNull();
    vi.useRealTimers();
  });
});
