import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import s from './LogIn.module.scss';

const LogIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <div className={s.loginContainer}>
      {/* Login Form - Full Width */}
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

          {/* Login Form */}
          <div className={s.formSection}>
            <h2 className={s.loginTitle}>Log in to Recloop Mart</h2>
            <p className={s.loginSubtitle}>Your trusted tech marketplace</p>

            <form onSubmit={handleSubmit} className={s.loginForm}>
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

              {/* Password Field */}
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

              {/* Remember Me and Forgot Password */}
              <div className={s.formOptions}>
                <label className={s.rememberMe}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className={s.checkbox}
                  />
                  <span className={s.checkboxLabel}>Remember me</span>
                </label>
                <Link to="/forgot-password" className={s.forgotPassword}>
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button type="submit" className={s.loginButton}>
                Log In
              </button>
            </form>

            {/* Sign Up Link */}
            <div className={s.signUpSection}>
              <p className={s.signUpText}>
                Don't have an account?{' '}
                <Link to="/signup" className={s.signUpLink}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
