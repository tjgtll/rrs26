export interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  imageBase64: string;
  submittedAt: number;
}

export type FormSubmissionInput = Omit<FormData, 'id' | 'submittedAt'>;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface CountryAutocompleteProps {
  id: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}

export interface UncontrolledFormProps {
  onSuccess: () => void;
}

export interface RHFFormProps {
  onSuccess: () => void;
}

export interface FormState {
  submissions: FormData[];
  countries: string[];
  addSubmission: (data: FormSubmissionInput) => void;
  highlightNewId: string | null;
  setHighlightNewId: (id: string | null) => void;
}
