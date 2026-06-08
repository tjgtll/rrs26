import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FormState, FormData, FormSubmissionInput } from '../types';

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      submissions: [],
      countries: [
        'Belarus',
        'USA',
        'Canada',
        'UK',
        'Germany',
        'France',
        'Japan',
        'Australia',
        'Russia',
        'China',
        'India',
      ],
      addSubmission: (data: FormSubmissionInput) => {
        const newSubmission: FormData = {
          ...data,
          id: crypto.randomUUID(),
          submittedAt: Date.now(),
        };
        set((state) => ({
          submissions: [newSubmission, ...state.submissions],
          highlightNewId: newSubmission.id,
        }));
        setTimeout(() => set({ highlightNewId: null }), 3000);
      },
      highlightNewId: null,
      setHighlightNewId: (id) => set({ highlightNewId: id }),
    }),
    { name: 'form-submissions' }
  )
);
