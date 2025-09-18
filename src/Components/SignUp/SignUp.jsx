import React from 'react';
import SignUpForm from './SignUpForm/SignUpForm';
import s from './SignUp.module.scss';
import { Helmet } from 'react-helmet-async';

const SignUp = () => {
  return (
    <>
    <Helmet>
      <title>Sign Up</title>
      <meta name="description" content="Sign up for an account" />
    </Helmet>
    <div className={s.signupContainer}>
      {/* Signup Form - Full Width */}
      <div className={s.rightSide}>
        <SignUpForm />
      </div>
    </div>
    </>
  );
};

export default SignUp;
