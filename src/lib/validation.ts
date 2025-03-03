/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates a password against security requirements
 * 
 * Requirements:
 * - At least 10 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 * 
 * @param password - The password to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validatePassword = (password: string): ValidationResult => {
  if (password.length < 10) {
    return {
      isValid: false,
      message: "Password must be at least 10 characters long",
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      isValid: false,
      message:
        "Password must include uppercase, lowercase, numbers, and special characters",
    };
  }

  return { isValid: true };
}; 