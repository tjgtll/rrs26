import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useFormStore } from '../store/formStore';
import { formSchema, type FormSchema } from '../schemas/formSchema';
import {
  validateImage,
  convertToBase64,
  getPasswordStrength,
} from '../utils/formUtils';
import { CountryAutocomplete } from './CountryAutocomplete';
import type { RHFFormProps } from '../types';

export const RHFForm = ({ onSuccess }: RHFFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);
  const countries = useFormStore((state) => state.countries);
  const [passwordStrength, setPasswordStrength] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: 'male',
      terms: false,
      password: '',
      confirmPassword: '',
      country: '',
      imageBase64: '',
    },
  });

  const onPasswordChange = (value: string) => {
    setPasswordStrength(getPasswordStrength(value));
  };

  const onSubmit = (data: FormSchema) => {
    addSubmission(data);
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div>
        <label htmlFor="rhf-name">Name *</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <input id="rhf-name" {...field} />}
        />
        {errors.name && (
          <span style={{ color: 'red' }}>{errors.name.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="rhf-age">Age *</label>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <input
              id="rhf-age"
              type="number"
              data-testid="rhf-age-input"
              onChange={(e) => field.onChange(Number(e.target.value))}
              value={field.value ?? ''}
            />
          )}
        />
        {errors.age && (
          <span style={{ color: 'red' }}>{errors.age.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="rhf-email">Email *</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <input id="rhf-email" {...field} />}
        />
        {errors.email && (
          <span style={{ color: 'red' }}>{errors.email.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="rhf-gender">Gender *</label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <select id="rhf-gender" {...field}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          )}
        />
      </div>

      <div>
        <label>
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />{' '}
          I accept the Terms and Conditions
        </label>
        {errors.terms && (
          <span style={{ color: 'red' }}>{errors.terms.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="rhf-password">Password *</label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              id="rhf-password"
              type="password"
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onPasswordChange(e.target.value);
              }}
            />
          )}
        />
        {passwordStrength && <small>Strength: {passwordStrength}</small>}
        {errors.password && (
          <span style={{ color: 'red' }}>{errors.password.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="rhf-confirm">Confirm Password *</label>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <input id="rhf-confirm" type="password" {...field} />
          )}
        />
        {errors.confirmPassword && (
          <span style={{ color: 'red' }}>{errors.confirmPassword.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="rhf-country">Country *</label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountryAutocomplete
              id="rhf-country"
              options={countries}
              value={field.value}
              onSelect={field.onChange}
            />
          )}
        />
        {errors.country && (
          <span style={{ color: 'red' }}>{errors.country.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="rhf-image">Profile Image * (PNG/JPEG, max 2MB)</label>
        <input
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const validation = validateImage(file);
            if (!validation.valid) {
              setValue('imageBase64', '', { shouldValidate: true });
              return;
            }
            const base64 = await convertToBase64(file);
            setValue('imageBase64', base64, { shouldValidate: true });
          }}
        />
        {errors.imageBase64 && (
          <span style={{ color: 'red' }}>{errors.imageBase64.message}</span>
        )}
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};
