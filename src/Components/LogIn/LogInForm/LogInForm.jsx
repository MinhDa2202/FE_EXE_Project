import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { showAlert } from "src/Features/alertsSlice";
import { setLoginData } from "src/Features/userSlice";
import { simpleValidationCheck } from "src/Functions/componentsFunctions";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import s from "./LogInForm.module.scss";
import LogInFormInputs from "./LogInFormInputs/LogInFormInputs";

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
      const response = await fetch("https://localhost:7235/api/Auth/login", {
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
          dispatch(showAlert({
            alertText: "Email chưa xác thực. OTP đã được gửi lại.",
            alertState: "warning",
            alertType: "alert",
          }));
          setLoginPayload(payload);
          setOtpStep(true);
          return;
        }

        throw new Error(data.title || "Login failed");
      }

      handleLoginSuccess(data);

    } catch (err) {
      dispatch(showAlert({
        alertText: t("toastAlert.loginFailed"),
        alertState: "error",
        alertType: "alert",
      }));
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
        isSignIn: true,
      };
      dispatch(setLoginData(loginState));
      localStorage.setItem("userSliceData", JSON.stringify({
        loginInfo: loginState,
        signedUpUsers: [],
      }));
      dispatch(showAlert({
        alertText: t("toastAlert.loginSuccess"),
        alertState: "success",
        alertType: "alert",
      }));
      navigate("/");
    }
  }

  async function verifyLoginOTP(e) {
    e.preventDefault();

    if (!otp.trim()) {
      dispatch(showAlert({
        alertText: "Vui lòng nhập mã OTP",
        alertState: "error",
        alertType: "alert",
      }));
      return;
    }

    try {
      setOtpLoading(true);
      const response = await fetch("https://localhost:7235/api/Auth/verify-email", {
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
      dispatch(showAlert({
        alertText: error.message || "Xác thực OTP thất bại",
        alertState: "error",
        alertType: "alert",
      }));
    } finally {
      setOtpLoading(false);
    }
  }

  async function loginWithVerifiedEmail(payload) {
    try {
      const response = await fetch("https://localhost:7235/api/Auth/login", {
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
      dispatch(showAlert({
        alertText: err.message,
        alertState: "error",
        alertType: "alert",
      }));
    }
  }

  function backToLogin() {
    setOtpStep(false);
    setOtp("");
    setLoginPayload(null);
  }

  // OTP UI nếu cần xác thực email
  if (otpStep) {
    return (
      <form className={s.form} onSubmit={verifyLoginOTP}>
        <h2>Xác thực OTP</h2>
        <p>OTP đã gửi đến <strong>{loginPayload?.email}</strong></p>

        <div className={s.inputGroup}>
          <input
            type="text"
            placeholder="Nhập OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            className={s.otpInput}
            disabled={otpLoading}
          />
        </div>

        <div className={s.otpActions}>
          <button
            type="submit"
            disabled={otpLoading}
            className={`${s.verifyButton} ${otpLoading ? s.loading : ''}`}
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
    );
  }

  return (
    <form className={s.form} onSubmit={login}>
      <h2>{t("loginSignUpPage.login")}</h2>
      <p>{t("loginSignUpPage.enterDetails")}</p>

      <LogInFormInputs />

      <div className={s.buttons}>
        <button type="submit" className={s.loginBtn}>
          {t("buttons.login")}
        </button>
        <a href="#">{t("loginSignUpPage.forgotPassword")}</a>
      </div>

      <p className={s.signUpMessage}>
        <span>{t("loginSignUpPage.dontHaveAcc")}</span>
        <Link to="/signup">{t("nav.signUp")}</Link>
      </p>
    </form>
  );
};

export default LogInForm;

function internetConnectionAlert(dispatch, t) {
  dispatch(showAlert({
    alertText: t("toastAlert.loginFailed"),
    alertState: "error",
    alertType: "alert",
  }));
}
