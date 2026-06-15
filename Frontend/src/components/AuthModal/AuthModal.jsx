import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const MODE = { LOGIN: 'login', SIGNUP: 'signup', FORGOT: 'forgot', RESET: 'reset' };

const AuthModal = ({ onClose }) => {
  const { login, register, handleForgotPassword, handleResetPassword } = useAuth();
  const [mode, setMode] = useState(MODE.LOGIN);
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const form = e.target;

    try {
      if (mode === MODE.LOGIN) {
        await login(form.email.value, form.password.value);
        onClose();
      } else if (mode === MODE.SIGNUP) {
        await register(form.name.value, form.email.value, form.password.value);
        onClose();
      } else if (mode === MODE.FORGOT) {
        const res = await handleForgotPassword(form.email.value);
        if (res.exists) {
          setResetEmail(form.email.value);
          setMode(MODE.RESET);
        }
      } else if (mode === MODE.RESET) {
        await handleResetPassword(resetEmail, form.password.value);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="auth-overlay" onClick={handleOverlay}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>&times;</button>

        <h2 className="auth-title">
          {mode === MODE.LOGIN && 'Welcome Back'}
          {mode === MODE.SIGNUP && 'Create Account'}
          {mode === MODE.FORGOT && 'Forgot Password'}
          {mode === MODE.RESET && 'Reset Password'}
        </h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === MODE.SIGNUP && (
            <input name="name" type="text" placeholder="Full Name" className="form-input" required />
          )}
          {mode !== MODE.RESET && (
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="form-input"
              required
              defaultValue={mode === MODE.FORGOT ? '' : undefined}
            />
          )}
          {mode !== MODE.FORGOT && (
            <input
              name="password"
              type="password"
              placeholder={mode === MODE.RESET ? 'New Password (min 6 chars)' : 'Password'}
              className="form-input"
              required
              minLength={6}
            />
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-black btn-submit" disabled={submitting}>
            {submitting
              ? 'PLEASE WAIT...'
              : mode === MODE.LOGIN ? 'LOGIN'
              : mode === MODE.SIGNUP ? 'SIGN UP'
              : mode === MODE.FORGOT ? 'SEND LINK'
              : 'RESET PASSWORD'}
          </button>
        </form>

        <div className="auth-footer">
          {mode === MODE.LOGIN && (
            <>
              <button className="auth-link" onClick={() => switchMode(MODE.FORGOT)}>Forgot Password?</button>
              <span>Don't have an account? <button className="auth-link" onClick={() => switchMode(MODE.SIGNUP)}>Sign Up</button></span>
            </>
          )}
          {mode === MODE.SIGNUP && (
            <span>Already have an account? <button className="auth-link" onClick={() => switchMode(MODE.LOGIN)}>Login</button></span>
          )}
          {mode === MODE.FORGOT && (
            <span>Remember your password? <button className="auth-link" onClick={() => switchMode(MODE.LOGIN)}>Login</button></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
