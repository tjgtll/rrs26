import { useRef, useState } from 'react';
import { z } from 'zod';
import { useFormStore } from '../store/formStore';
import { formSchema } from '../schemas/formSchema';
import {
  validateImage,
  convertToBase64,
  getPasswordStrength,
} from '../utils/formUtils';
import { CountryAutocomplete } from './CountryAutocomplete';
import type { UncontrolledFormProps } from '../types';

export const UncontrolledForm = ({ onSuccess }: UncontrolledFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);
  const countries = useFormStore((state) => state.countries);

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const [imageBase64, setImageBase64] = useState('');
  const [countryValue, setCountryValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, image: validation.error || 'Error' }));
      return;
    }
    const base64 = await convertToBase64(file);
    setImageBase64(base64);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordStrength(getPasswordStrength(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      name: nameRef.current?.value || '',
      age: Number(ageRef.current?.value),
      email: emailRef.current?.value || '',
      gender: genderRef.current?.value as 'male' | 'female' | 'other',
      terms: termsRef.current?.checked || false,
      password: passwordRef.current?.value || '',
      confirmPassword: confirmRef.current?.value || '',
      country: countryValue, // используем состояние, а не ref
      imageBase64,
    };
    try {
      formSchema.parse(formData);
      addSubmission(formData);
      onSuccess();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0])
            newErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div>
        <label htmlFor="uc-name">Name *</label>
        <input id="uc-name" ref={nameRef} />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="uc-age">Age *</label>
        <input
          id="uc-age"
          type="number"
          ref={ageRef}
          data-testid="uc-age-input"
        />
        {errors.age && <span style={{ color: 'red' }}>{errors.age}</span>}
      </div>

      <div>
        <label htmlFor="uc-email">Email *</label>
        <input id="uc-email" type="email" ref={emailRef} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="uc-gender">Gender *</label>
        <select id="uc-gender" ref={genderRef}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label>
          <input id="uc-terms" type="checkbox" ref={termsRef} /> I accept the
          Terms and Conditions
        </label>
        {errors.terms && <span style={{ color: 'red' }}>{errors.terms}</span>}
      </div>

      <div>
        <label htmlFor="uc-password">Password *</label>
        <input
          id="uc-password"
          type="password"
          ref={passwordRef}
          onChange={onPasswordChange}
        />
        {passwordStrength && <small>Strength: {passwordStrength}</small>}
        {errors.password && (
          <span style={{ color: 'red' }}>{errors.password}</span>
        )}
      </div>

      <div>
        <label htmlFor="uc-confirm">Confirm Password *</label>
        <input id="uc-confirm" type="password" ref={confirmRef} />
        {errors.confirmPassword && (
          <span style={{ color: 'red' }}>{errors.confirmPassword}</span>
        )}
      </div>

      <div>
        <label htmlFor="uc-country">Country *</label>
        <CountryAutocomplete
          id="uc-country"
          options={countries}
          value={countryValue}
          onSelect={setCountryValue}
        />
        {errors.country && (
          <span style={{ color: 'red' }}>{errors.country}</span>
        )}
      </div>

      <div>
        <label htmlFor="uc-image">Profile Image * (PNG/JPEG, max 2MB)</label>
        <input
          id="uc-image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleImageChange}
        />
        {errors.image && <span style={{ color: 'red' }}>{errors.image}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
