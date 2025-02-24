export const validatePassword = (password: string): {
  isValid: boolean;
  message?: string;
} => {
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