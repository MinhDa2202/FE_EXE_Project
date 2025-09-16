import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import s from './SignUp.module.scss';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup attempt:', formData);
  };

  return (
    <div className={s.signupContainer}>
      {/* Signup Form - Full Width */}
      <div className={s.rightSide}>
        <div className={s.formContainer}>
          {/* Logo and Brand */}
          <div className={s.brandSection}>
            <div className={s.logo}>
              <img 
                src="/logo.png" 
                alt="Recloops Mart Logo" 
                className={s.logoImage}
              />
            </div>
          </div>

          {/* Signup Form */}
          <div className={s.formSection}>
            <h2 className={s.signupTitle}>Create your account</h2>
            <p className={s.signupSubtitle}>Join our trusted tech marketplace</p>

            <form onSubmit={handleSubmit} className={s.signupForm}>
              {/* Name Fields */}
              <div className={s.nameFields}>
                <div className={s.inputGroup}>
                  <div className={s.inputIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className={s.input}
                    required
                  />
                </div>
                <div className={s.inputGroup}>
                  <div className={s.inputIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className={s.input}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className={s.inputGroup}>
                <div className={s.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className={s.input}
                  required
                />
              </div>

              {/* Password Fields */}
              <div className={s.inputGroup}>
                <div className={s.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={s.input}
                  required
                />
              </div>

              <div className={s.inputGroup}>
                <div className={s.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={s.input}
                  required
                />
              </div>

              {/* Terms Agreement */}
              <div className={s.termsSection}>
                <label className={s.termsCheckbox}>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className={s.checkbox}
                    required
                  />
                  <span className={s.checkboxLabel}>
                    I agree to the{' '}
                    <Link to="/terms" className={s.termsLink}>
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className={s.termsLink}>
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Signup Button */}
              <button type="submit" className={s.signupButton}>
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <div className={s.loginSection}>
              <p className={s.loginText}>
                Already have an account?{' '}
                <Link to="/login" className={s.loginLink}>
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
