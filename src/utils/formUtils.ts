export const validateImage = (
  file: File
): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/png', 'image/jpeg'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PNG or JPEG images allowed' };
  }
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 2MB' };
  }
  return { valid: true };
};

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getPasswordStrength = (password: string): string => {
  let score = 0;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score === 4) return 'Strong';
  if (score >= 2) return 'Medium';
  return 'Weak';
};
