export type AuthFields = {
  email: string;
  password: string;
  confirmPassword: string;
};
export function validateAuth(values: AuthFields, register: boolean) {
  const errors: Partial<Record<keyof AuthFields, string>> = {};
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address";
  if (!values.password) errors.password = "Password is required";
  else if (register && values.password.length < 6)
    errors.password = "Password must be at least 6 characters";
  if (register) {
    if (!values.confirmPassword)
      errors.confirmPassword = "Confirm password is required";
    else if (values.confirmPassword !== values.password)
      errors.confirmPassword = "Passwords do not match";
  }
  return errors;
}
