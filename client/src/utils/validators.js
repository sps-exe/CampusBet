/**
 * CampusArena — Form Validators
 * Used by Login, Signup, and other forms for client-side validation.
 */

import { isValidCollegeEmail } from './colleges';

// ─── Password Strength ────────────────────────────────────────────────────────

/**
 * Evaluates the strength of a password.
 * @param {string} password
 * @returns {'weak' | 'medium' | 'strong'}
 */
export const getPasswordStrength = (password) => {
  if (!password || password.length < 6) return 'weak';

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
};

/**
 * Returns the percentage fill for a password strength bar.
 * @param {'weak' | 'medium' | 'strong'} strength
 * @returns {number} 0-100
 */
export const getStrengthPercent = (strength) => {
  return { weak: 33, medium: 66, strong: 100 }[strength] || 0;
};

/**
 * Returns human-readable strength label.
 * @param {'weak' | 'medium' | 'strong'} strength
 * @returns {string}
 */
export const getStrengthLabel = (strength) => {
  return { weak: 'Weak', medium: 'Medium', strong: 'Strong' }[strength] || '';
};

/**
 * Validates whether a string is a strong enough password.
 * @param {string} password
 * @returns {boolean}
 */
export const isStrongPassword = (password) => {
  if (!password || password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
};

// ─── Login Form Validator ──────────────────────────────────────────────────────

/**
 * Validates the login form fields.
 * @param {{ email: string, password: string }} data
 * @returns {Record<string, string>} errors object (empty = valid)
 */
export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password?.trim()) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

// ─── Signup Form Validator ─────────────────────────────────────────────────────

/**
 * Validates the signup form fields.
 * @param {{ name: string, email: string, college: string, password: string, confirmPassword: string, role: string, agreedToTerms: boolean }} data
 * @returns {Record<string, string>} errors object (empty = valid)
 */
export const validateSignupForm = (data) => {
  const { name, email, college, password, confirmPassword, agreedToTerms } = data;
  const errors = {};

  // Name
  if (!name?.trim()) {
    errors.name = 'Full name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email
  if (!email?.trim()) {
    errors.email = 'College email is required';
  } else if (!isValidCollegeEmail(email)) {
    errors.email = 'Use your institutional email (e.g. you@college.ac.in)';
  }

  // College
  if (!college?.trim()) {
    errors.college = 'Please confirm your college name';
  }

  // Password
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Password must include at least one uppercase letter';
  } else if (!/\d/.test(password)) {
    errors.password = 'Password must include at least one number';
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.password = 'Password must include at least one special character';
  }

  // Confirm Password
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Terms
  if (!agreedToTerms) {
    errors.agreedToTerms = 'You must agree to the Terms & Conditions';
  }

  return errors;
};
