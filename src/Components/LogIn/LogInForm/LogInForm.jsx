// LogInForm.jsx
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { showAlert } from "src/Features/alertsSlice";
import { setLoginData } from "src/Features/userSlice";
import { updateInput } from "src/Features/formsSlice";
import { simpleValidationCheck } from "src/Functions/componentsFunctions";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import s from "./LogInForm.module.scss";

const LogInForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWebsiteOnline = useOnlineStatus();
  const { emailOrPhone, password } = useSelector((state) => state.forms.login);

  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [loginPayload, setLoginPayload] = useState(null);

  async function login(e) {
    e.preventDefault();

    if (!isWebsiteOnline) {
      internetConnectionAlert(dispatch, t);
      return;
    }

    const inputs = e.target.querySelectorAll("input");
    const isFormValid = simpleValidationCheck(inputs);
    if (!isFormValid) return;

    const payload = {
      email: emailOrPhone.trim().toLowerCase(),
      password: password.trim(),
    };

    try {
      const response = await fetch("/api/Auth/login", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "EMAIL_NOT_CONFIRMED") {
          dispatch(
            showAlert({
              alertText: "Email chưa xác thực. OTP đã được gửi lại.",
              alertState: "warning",
              alertType: "alert",
            })
          );
          setLoginPayload(payload);
          setOtpStep(true);
          return;
        }
        throw new Error(data.title || "Login failed");
      }

      handleLoginSuccess(data);
    } catch (err) {
      dispatch(
        showAlert({
          alertText: t("toastAlert.loginFailed"),
          alertState: "error",
          alertType: "alert",
        })
      );
    }
  }

  function handleLoginSuccess(data) {
    if (data.token) {
      localStorage.setItem("token", data.token);
      const loginState = {
        username: data.user.fullName,
        emailOrPhone: data.user.email,
        token: data.token,
        address: data.user.address || "",
        gender: data.user.gender || "",
        dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : "",
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
          alertText: t("toastAlert.loginSuccess"),
          alertState: "success",
          alertType: "alert",
        })
      );
      navigate("/");
    }
  }

  async function verifyLoginOTP(e) {
    e.preventDefault();

    if (!otp.trim()) {
      dispatch(
        showAlert({
          alertText: "Vui lòng nhập mã OTP",
          alertState: "error",
          alertType: "alert",
        })
      );
      return;
    }

    try {
      setOtpLoading(true);
      const response = await fetch("/api/Auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginPayload.email,
          otp: otp.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "OTP không hợp lệ");
      }

      // Sau khi xác thực thành công → đăng nhập lại
      setOtpStep(false);
      setOtp("");
      await loginWithVerifiedEmail(loginPayload);
    } catch (error) {
      dispatch(
        showAlert({
          alertText: error.message || "Xác thực OTP thất bại",
          alertState: "error",
          alertType: "alert",
        })
      );
    } finally {
      setOtpLoading(false);
    }
  }

  async function loginWithVerifiedEmail(payload) {
    try {
      const response = await fetch("/api/Auth/login", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Đăng nhập lại thất bại");
      handleLoginSuccess(data);
    } catch (err) {
      dispatch(
        showAlert({
          alertText: err.message,
          alertState: "error",
          alertType: "alert",
        })
      );
    }
  }

  function backToLogin() {
    setOtpStep(false);
    setOtp("");
    setLoginPayload(null);
  }

  // OTP UI
  if (otpStep) {
    return (
      <div className={s.loginContainer}>
        <div className={s.rightSide}>
          <div className={s.formContainer}>
            <div className={s.formSection}>
              <h2 className={s.loginTitle}>Xác thực OTP</h2>
              <p>
                OTP đã gửi đến <strong>{loginPayload?.email}</strong>
              </p>

              <form onSubmit={verifyLoginOTP} className={s.loginForm}>
                <div className={s.inputGroup}>
                  <input
                    type="text"
                    placeholder="Nhập OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    className={s.input}
                    disabled={otpLoading}
                  />
                </div>

                <div className={s.otpActions}>
                  <button
                    type="submit"
                    disabled={otpLoading}
                    className={s.loginButton}
                  >
                    {otpLoading ? "Đang xác thực..." : "Xác thực"}
                  </button>
                  <button
                    type="button"
                    onClick={backToLogin}
                    className={s.backButton}
                    disabled={otpLoading}
                  >
                    Quay lại đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login UI
  return (
    <div className={s.loginContainer}>
      <div className={s.rightSide}>
        <div className={s.formContainer}>
          <div className={s.formSection}>
            <h2 className={s.loginTitle}>{t("loginSignUpPage.login")}</h2>
            <p className={s.loginSubtitle}>
              {t("loginSignUpPage.enterDetails")}
            </p>

            <form onSubmit={login} className={s.loginForm}>
              {/* Email */}
              <div className={s.inputGroup}>
                <div className={s.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22,6 12,13 2,6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={emailOrPhone}
                  placeholder="Email address"
                  className={s.input}
                  required
                  onChange={(e) =>
                    dispatch(
                      updateInput({
                        formName: "login",
                        key: "emailOrPhone",
                        value: e.target.value,
                      })
                    )
                  }
                />
              </div>

              {/* Password */}
              <div className={s.inputGroup}>
                <div className={s.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="16"
                      r="1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 11V7a5 5 0 0 1 10 0v4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  className={s.input}
                  required
                  onChange={(e) =>
                    dispatch(
                      updateInput({
                        formName: "login",
                        key: "password",
                        value: e.target.value,
                      })
                    )
                  }
                />
              </div>

              {/* Options */}
              <div className={s.formOptions}>
                <label className={s.rememberMe}>
                  <input type="checkbox" className={s.checkbox} />
                  <span className={s.checkboxLabel}>Remember me</span>
                </label>
                <Link to="/forgot-password" className={s.forgotPassword}>
                  {t("loginSignUpPage.forgotPassword")}
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" className={s.loginButton}>
                {t("buttons.login")}
              </button>
            </form>

            {/* Sign up */}
            <div className={s.signUpSection}>
              <p className={s.signUpText}>
                {t("loginSignUpPage.dontHaveAcc")}{" "}
                <Link to="/signup" className={s.signUpLink}>
                  {t("nav.signUp")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;

function internetConnectionAlert(dispatch, t) {
  dispatch(
    showAlert({
      alertText: t("toastAlert.loginFailed"),
      alertState: "error",
      alertType: "alert",
    })
  );
}
