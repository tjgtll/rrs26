import { describe, it, expect } from 'vitest';
import {
  validateImage,
  getPasswordStrength,
  convertToBase64,
} from '../utils/formUtils';

describe('formUtils', () => {
  describe('validateImage', () => {
    it('validates PNG file under 2MB', () => {
      const file = new File(['dummy'], 'test.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });
      expect(validateImage(file).valid).toBe(true);
    });

    it('validates JPEG file under 2MB', () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });
      expect(validateImage(file).valid).toBe(true);
    });

    it('rejects wrong file type', () => {
      const file = new File(['dummy'], 'test.gif', { type: 'image/gif' });
      expect(validateImage(file).valid).toBe(false);
      expect(validateImage(file).error).toContain('Only PNG or JPEG');
    });

    it('rejects file over 2MB', () => {
      const file = new File(['dummy'], 'test.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 });
      expect(validateImage(file).valid).toBe(false);
      expect(validateImage(file).error).toContain('less than 2MB');
    });
  });

  describe('getPasswordStrength', () => {
    it('returns Weak for simple passwords', () => {
      expect(getPasswordStrength('abc')).toBe('Weak');
      expect(getPasswordStrength('12345')).toBe('Weak');
    });
    it('returns Medium for moderate passwords', () => {
      expect(getPasswordStrength('Abc123')).toBe('Medium');
      expect(getPasswordStrength('abc123!')).toBe('Medium');
    });
    it('returns Strong for complex passwords', () => {
      expect(getPasswordStrength('Abc123!@#')).toBe('Strong');
    });
  });

  describe('convertToBase64', () => {
    it('converts file to base64', async () => {
      const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
      const base64 = await convertToBase64(file);
      expect(base64).toMatch(/^data:text\/plain;base64,/);
    });
  });
});
