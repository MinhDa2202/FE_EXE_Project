import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { showAlert } from "src/Features/alertsSlice";
import { setLoginData } from "src/Features/userSlice";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import s from "./SignUpForm.module.scss";

// Reusable input icon
const InputIcon = ({ children }) => (
  <div className={s.inputIcon}>{children}</div>
);

// Helper: check xem response có yêu cầu OTP không
const needsOtpVerification = (text) => {
  const lower = text.toLowerCase();
  return (
    lower.includes("verify") ||
    lower.includes("otp") ||
    lower.includes("email") ||
    lower.includes("xác thực")
  );
};

const SignUpForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWebsiteOnline = useOnlineStatus();
  const { username, emailOrPhone, password } = useSelector(
    (state) => state.forms.signUp
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: username.split(" ")[0] || "",
      lastName: username.split(" ").slice(1).join(" ") || "",
      email: emailOrPhone,
      password: password,
    }));
  }, [username, emailOrPhone, password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // OTP states
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [signupData, setSignupData] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Loading state for the main signup button
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (resendCountdown > 0) {
      interval = setInterval(
        () => setResendCountdown((prev) => prev - 1),
        1000
      );
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const startResendCountdown = () => setResendCountdown(60);

  const resetOtpState = () => {
    setOtpStep(false);
    setOtp("");
    setSignupData(null);
    setResendCountdown(0);
  };

  // Handle successful registration
  const handleSuccessfulRegistration = (data, signupPayload) => {
    const loginState = {
      username: data?.user?.fullName || signupPayload.fullName,
      emailOrPhone: data?.user?.email || signupPayload.email,
      token: data?.token || null,
      address: data?.user?.address || "",
      isSignIn: true,
    };

    dispatch(setLoginData(loginState));
    localStorage.setItem(
      "userSliceData",
      JSON.stringify({
        loginInfo: loginState,
        signedUpUsers: [],
      })
    );

    dispatch(
      showAlert({
        alertText: t("toastAlert.signUpSuccess") || "Registration successful",
        alertState: "success",
        alertType: "alert",
      })
    );

    navigate("/");
  };

  // Send OTP
  async function sendOTP(signupPayload) {
    try {
      setOtpLoading(true);

      const response = await fetch("https://localhost:7235/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupPayload),
      });

      const text = await response.text();
      if (!response.ok || needsOtpVerification(text)) {
        dispatch(
          showAlert({
            alertText: t("toastAlert.otpSent") || "OTP sent to your email",
            alertState: "success",
            alertType: "alert",
          })
        );
        setOtpStep(true);
        setSignupData(signupPayload);
        startResendCountdown();
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (needsOtpVerification(text)) {
        dispatch(
          showAlert({
            alertText: "OTP sent to your email",
            alertState: "success",
            alertType: "alert",
          })
        );
        setOtpStep(true);
        setSignupData(signupPayload);
        startResendCountdown();
        return;
      }

      handleSuccessfulRegistration(data, signupPayload);
    } catch (error) {
      console.error("Send OTP error:", error);
      dispatch(
        showAlert({
          alertText: "Failed to send OTP",
          alertState: "error",
          alertType: "alert",
        })
      );
    } finally {
      setOtpLoading(false);
    }
  }

  // Verify OTP
  async function verifyOTPAndRegister(e) {
    e.preventDefault();
    if (!otp.trim()) {
      return dispatch(
        showAlert({
          alertText: "Please enter OTP",
          alertState: "error",
          alertType: "alert",
        })
      );
    }

    try {
      setOtpLoading(true);
      const otpResponse = await fetch(
        "https://localhost:7235/api/Auth/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: signupData.email, otp: otp.trim() }),
        }
      );

      if (!otpResponse.ok) throw new Error(await otpResponse.text());

      dispatch(
        showAlert({
          alertText: "Email verified successfully. Please login to continue.",
          alertState: "success",
          alertType: "alert",
        })
      );
      resetOtpState();
      navigate("/");
    } catch (error) {
      dispatch(
        showAlert({
          alertText: error.message || "Invalid OTP",
          alertState: "error",
          alertType: "alert",
        })
      );
    } finally {
      setOtpLoading(false);
    }
  }

  // Resend OTP
  async function resendOTP() {
    if (resendCountdown > 0) return;
    try {
      setOtpLoading(true);
      setOtp("");
      const response = await fetch(
        "https://localhost:7235/api/Auth/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: signupData.email }),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      dispatch(
        showAlert({
          alertText: "OTP has been resent to your email",
          alertState: "success",
          alertType: "alert",
        })
      );
      startResendCountdown();
    } catch (error) {
      dispatch(
        showAlert({
          alertText: error.message || "Failed to resend OTP",
          alertState: "error",
          alertType: "alert",
        })
      );
    } finally {
      setOtpLoading(false);
    }
  }

  // Signup
  async function signUp(e) {
    e.preventDefault();
    if (!isWebsiteOnline) {
      return dispatch(
        showAlert({
          alertText: t("toastAlert.loginFailed"),
          alertState: "error",
          alertType: "alert",
        })
      );
    }

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      !formData.agreeToTerms
    ) {
      return dispatch(
        showAlert({
          alertText: "Please fill all fields and agree to terms",
          alertState: "error",
          alertType: "alert",
        })
      );
    }

    if (formData.password !== formData.confirmPassword) {
      return dispatch(
        showAlert({
          alertText: "Passwords do not match",
          alertState: "error",
          alertType: "alert",
        })
      );
    }

    setIsLoading(true); // Set loading to true before API call
    try {
      const payload = {
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
      };
      await sendOTP(payload);
    } finally {
      setIsLoading(false); // Set loading to false after API call completes or fails
    }
  }

  // Back to signup
  const backToSignup = () => resetOtpState();

  // Render OTP verification form
  if (otpStep) {
    return (
      <div className={s.formSection}>
        <h2 className={s.signupTitle}>{"Verify OTP"}</h2>
        <p className={s.signupSubtitle}>{`OTP has been sent to ${signupData?.email}`}</p>

        <form onSubmit={verifyOTPAndRegister} className={s.signupForm}>
          <div className={s.inputGroup}>
            <div className={s.inputIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder={"Enter OTP"}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              className={s.input}
              disabled={otpLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={otpLoading}
            className={`${s.signupButton} ${otpLoading ? s.loading : ''}`}
          >
            {otpLoading ? (
              <>
                <span className={s.spinner}></span>
                {"Loading..."}
              </>
            ) : (
              <>
                <span className={s.checkIcon}>✓</span>
                {"Verify"}
              </>
            )}
          </button>
        </form>
        
        <div className={s.loginSection}>
          <button
            type="button"
            onClick={backToSignup}
            className={s.loginLink}
            disabled={otpLoading}
          >
            <span className={s.backIcon}>←</span>
            {"Back"}
          </button>
          
          <div className={s.resendSection}>
            {resendCountdown > 0 ? (
              <p className={s.loginText}>
                {"Resend in"}
                <strong> {resendCountdown}s</strong>
              </p>
            ) : (
              <button
                type="button"
                onClick={resendOTP}
                className={s.loginLink}
                disabled={otpLoading}
              >
                <span className={s.resendIcon}>↻</span>
                {"Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render normal signup form
  return (
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

        <form onSubmit={signUp} className={s.signupForm}>
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
          <button
            type="submit"
            className={`${s.signupButton} ${isLoading ? s.loading : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={s.spinner}></span>
                {"Creating Account..."}
              </>
            ) : (
              "Create Account"
            )}
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
  );
};

export default SignUpForm;
