import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { showAlert } from "src/Features/alertsSlice";
import { newSignUp, setLoginData } from "src/Features/userSlice";
import { simpleValidationCheck } from "src/Functions/componentsFunctions";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import SignUpButtons from "./SignUpButtons/SignUpButtons";
import s from "./SignUpForm.module.scss";
import SignUpFormInputs from "./SignUpFormInputs/SignUpFormInputs";

const SignUpForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWebsiteOnline = useOnlineStatus();
  const { username, emailOrPhone, password } = useSelector(
    (state) => state.forms.signUp
  );

  // OTP states
  const [otpStep, setOtpStep] = useState(false); // false: signup form, true: OTP verification
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [signupData, setSignupData] = useState(null); // Store signup data for OTP step
  const [resendCountdown, setResendCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const startResendCountdown = () => {
    setResendCountdown(60); // 60 seconds countdown
  };

  // Handle successful registration
  const handleSuccessfulRegistration = (data, signupPayload) => {
    // Xử lý token và login state
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
    } else {
      const loginState = {
        username: signupPayload.fullName,
        emailOrPhone: signupPayload.email,
        token: null,
        address: "",
        isSignIn: true,
      };
      dispatch(setLoginData(loginState));
    }

    dispatch(showAlert({
      alertText: t("toastAlert.signUpSuccess") || "Registration successful",
      alertState: "success",
      alertType: "alert",
    }));

    navigate("/"); // Chuyển trang sau đăng ký thành công
  };

  // Send OTP function - gọi register API để trigger gửi OTP
  async function sendOTP(signupPayload) {
    try {
      setOtpLoading(true);
      
      // Gọi register API để trigger gửi OTP
      const response = await fetch("https://localhost:7235/api/Auth/register", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Register response error:", errorText);
        
        // Nếu backend trả về lỗi nhưng vẫn gửi OTP thành công
        // (ví dụ: "Please verify your email" hoặc tương tự)
        if (errorText.includes("verify") || errorText.includes("OTP") || errorText.includes("email")) {
          console.log("OTP sent, need verification");
          
          dispatch(showAlert({
            alertText: t("toastAlert.otpSent") || "OTP sent to your email",
            alertState: "success",
            alertType: "alert",
          }));

          // Chuyển sang bước verify OTP
          setOtpStep(true);
          setSignupData(signupPayload);
          startResendCountdown();
          return;
        }
        
        throw new Error(errorText || "Failed to send OTP");
      }

      // Nếu register thành công - kiểm tra xem có cần OTP không
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("Registration success (JSON):", data);
      } else {
        const textResponse = await response.text();
        console.log("Registration success (Text):", textResponse);
        data = { message: textResponse };
      }

      // Kiểm tra xem response có yêu cầu verify email không
      const responseText = data.message || JSON.stringify(data);
      if (responseText.includes("xác thực") || responseText.includes("verify") || responseText.includes("OTP") || responseText.includes("email")) {
        console.log("Registration success but need OTP verification");
        
        dispatch(showAlert({
          alertText: "OTP sent to your email",
          alertState: "success",
          alertType: "alert",
        }));

        // Chuyển sang bước verify OTP
        setOtpStep(true);
        setSignupData(signupPayload);
        startResendCountdown();
        return;
      }

      // Nếu không cần OTP, xử lý đăng ký thành công luôn
      handleSuccessfulRegistration(data, signupPayload);

    } catch (error) {
      console.error("Send OTP error:", error);
      dispatch(showAlert({
        alertText: "Failed to send OTP",
        alertState: "error",
        alertType: "alert",
      }));
    } finally {
      setOtpLoading(false);
    }
  }

  // Verify OTP and complete registration
  async function verifyOTPAndRegister(e) {
    e.preventDefault();
    
    if (!otp.trim()) {
      dispatch(showAlert({
        alertText: "Please enter OTP",
        alertState: "error",
        alertType: "alert",
      }));
      return;
    }

    try {
      setOtpLoading(true);

      // Verify OTP using the provided API
      const otpResponse = await fetch("https://localhost:7235/api/Auth/verify-email", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
          otp: otp.trim(),
        }),
      });

      if (!otpResponse.ok) {
        const errorText = await otpResponse.text();
        throw new Error(errorText || "Invalid OTP");
      }

      console.log("OTP verified successfully");

      // Xử lý response từ verify API
      const contentType = otpResponse.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await otpResponse.json();
        console.log("OTP verification success (JSON):", data);
      } else {
        const textResponse = await otpResponse.text();
        console.log("OTP verification success (Text):", textResponse);
        data = { message: textResponse };
      }

      // Sau khi verify OTP thành công, hiển thị thông báo và chuyển về trang home
      dispatch(showAlert({
        alertText: "Email verified successfully. Please login to continue.",
        alertState: "success",
        alertType: "alert",
      }));

      // Reset form state
      setOtpStep(false);
      setOtp("");
      setSignupData(null);
      setResendCountdown(0);

      // Chuyển về trang home, user sẽ cần đăng nhập
      navigate("/");

    } catch (error) {
      console.error("OTP verification error:", error);
      dispatch(showAlert({
        alertText: error.message || "Invalid OTP",
        alertState: "error",
        alertType: "alert",
      }));
    } finally {
      setOtpLoading(false);
    }
  }

  // Resend OTP function - Updated to use new API endpoint
  async function resendOTP() {
    if (resendCountdown > 0) return;
    
    try {
      setOtpLoading(true);
      setOtp(""); // Clear current OTP
      
      // Gọi API resend-otp thay vì register
      const response = await fetch("https://localhost:7235/api/Auth/resend-otp", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to resend OTP");
      }

      console.log("OTP resent successfully");

      dispatch(showAlert({
        alertText: "OTP has been resent to your email",
        alertState: "success",
        alertType: "alert",
      }));

      startResendCountdown();

    } catch (error) {
      console.error("Resend OTP error:", error);
      dispatch(showAlert({
        alertText: error.message || "Failed to resend OTP",
        alertState: "error",
        alertType: "alert",
      }));
    } finally {
      setOtpLoading(false);
    }
  }


  // Initial signup function
  async function signUp(e) {
    e.preventDefault();
    console.log("SignUp function called");

    if (!isWebsiteOnline) {
      console.log("Website is offline");
      internetConnectionAlert(dispatch, t);
      return;
    }

    const inputs = e.target.querySelectorAll("input");
    const isFormValid = simpleValidationCheck(inputs);
    console.log("Form valid:", isFormValid);
    console.log("Form data:", { username, emailOrPhone, password });

    // Kiểm tra basic validation
    if (!username.trim() || !emailOrPhone.trim() || !password.trim()) {
      console.log("Basic validation failed - empty fields");
      dispatch(showAlert({
        alertText: "Please fill all fields",
        alertState: "error",
        alertType: "alert",
      }));
      return;
    }

    const payload = {
      fullName: username.trim(),
      email: emailOrPhone.trim().toLowerCase(),
      password: password.trim(),
    };

    console.log("Sending OTP to:", payload.email);

    // Gửi OTP thay vì đăng ký trực tiếp
    await sendOTP(payload);
  }

  // Back to signup form
  const backToSignup = () => {
    setOtpStep(false);
    setOtp("");
    setSignupData(null);
    setResendCountdown(0);
  };

  // Render OTP verification form
  if (otpStep) {
    return (
      <form className={s.form} onSubmit={verifyOTPAndRegister}>
        <h2>{"Verify OTP"}</h2>
        <p>{`OTP has been sent to ${signupData?.email}`}</p>

        <div className={s.inputGroup}>
          <input
            type="text"
            placeholder={"Enter OTP"}
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
          
          <div className={s.secondaryActions}>
            <button
              type="button"
              onClick={backToSignup}
              className={s.backButton}
              disabled={otpLoading}
            >
              <span className={s.backIcon}>←</span>
              {"Back"}
            </button>
            
            <div className={s.resendSection}>
              {resendCountdown > 0 ? (
                <div className={s.countdown}>
                  <span className={s.clockIcon}>⏱</span>
                  <span className={s.countdownText}>
                    {"Resend in"} 
                    <strong> {resendCountdown}s</strong>
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className={s.resendButton}
                  disabled={otpLoading}
                >
                  <span className={s.resendIcon}>↻</span>
                  {"Resend OTP"}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    );
  }

  // Render normal signup form
  return (
    <form action="POST" className={s.form} onSubmit={signUp}>
      <h2>{t("loginSignUpPage.createAccount")}</h2>
      <p>{t("loginSignUpPage.enterDetails")}</p>

      <SignUpFormInputs />
      <SignUpButtons />
    </form>
  );
};

export default SignUpForm;

function internetConnectionAlert(dispatch, t) {
  dispatch(showAlert({
    alertText: t("toastAlert.loginFailed"),
    alertState: "error",
    alertType: "alert",
  }));
}