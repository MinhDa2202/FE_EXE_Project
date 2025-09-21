import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { pagesRequireSignIn } from "../Data/globalVariables";
import { showAlert } from "../Features/alertsSlice";
import { setLoginData } from "../Features/userSlice";

const RequiredAuth = ({ children }) => {
  const { loginInfo } = useSelector((state) => state.user);
  const { isSignIn, token } = loginInfo;
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);
  const pathName = location.pathname;
  const isLoginOrSignUpPage = pathName === "/login" || pathName === "/signup";

  console.log("RequiredAuth - Path analysis:", {
    pathName,
    isLoginPage: pathName === "/login",
    isSignUpPage: pathName === "/signup",
    isLoginOrSignUpPage,
    locationObject: location,
  });

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userSliceData = localStorage.getItem("userSliceData");
        const storedToken = localStorage.getItem("token");

        console.log("RequiredAuth - Initializing auth state:", {
          pathName,
          userSliceData: !!userSliceData,
          storedToken: !!storedToken,
          currentIsSignIn: isSignIn,
          currentToken: !!token,
        });

        if (userSliceData) {
          const parsed = JSON.parse(userSliceData);
          if (
            parsed.loginInfo?.isSignIn &&
            (parsed.loginInfo?.token || storedToken)
          ) {
            // Ensure Redux state matches localStorage
            if (
              !isSignIn ||
              token !== (parsed.loginInfo?.token || storedToken)
            ) {
              console.log(
                "RequiredAuth - Updating Redux state from localStorage"
              );
              dispatch(
                setLoginData({
                  ...parsed.loginInfo,
                  token: parsed.loginInfo?.token || storedToken,
                  isSignIn: true,
                })
              );
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
        // Clear corrupted data
        localStorage.removeItem("userSliceData");
        localStorage.removeItem("token");
      } finally {
        setIsInitialized(true);
      }
    };

    // Only initialize once
    if (!isInitialized) {
      initializeAuth();
    }
  }, [dispatch, isInitialized]);

  // Don't render anything until initialization is complete
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  // Check authentication from both Redux state and localStorage
  const checkAuthentication = () => {
    console.log("RequiredAuth - checkAuthentication called:", {
      reduxIsSignIn: isSignIn,
      reduxToken: !!token,
      pathName,
    });

    // First check Redux state
    if (isSignIn && token) {
      console.log("RequiredAuth - Authenticated via Redux state");
      return true;
    }

    // Fallback to localStorage check
    try {
      const userSliceData = localStorage.getItem("userSliceData");
      const storedToken = localStorage.getItem("token");

      console.log("RequiredAuth - localStorage check:", {
        hasUserSliceData: !!userSliceData,
        hasStoredToken: !!storedToken,
      });

      if (userSliceData) {
        const parsed = JSON.parse(userSliceData);
        const isAuthenticatedFromStorage =
          parsed.loginInfo?.isSignIn &&
          (parsed.loginInfo?.token || storedToken);

        console.log("RequiredAuth - localStorage auth result:", {
          loginInfoIsSignIn: parsed.loginInfo?.isSignIn,
          hasTokenInLoginInfo: !!parsed.loginInfo?.token,
          hasStoredToken: !!storedToken,
          finalResult: isAuthenticatedFromStorage,
        });

        return isAuthenticatedFromStorage;
      }
    } catch (error) {
      console.error("Error checking localStorage auth:", error);
    }

    console.log("RequiredAuth - No authentication found");
    return false;
  };

  const isAuthenticated = checkAuthentication();
  const isPageRequiringSignIn = (page) =>
    pagesRequireSignIn.includes(page) && !isAuthenticated;

  console.log("RequiredAuth - Auth check:", {
    pathName,
    reduxIsSignIn: isSignIn,
    reduxHasToken: !!token,
    isAuthenticated,
    isLoginOrSignUpPage,
    requiresAuth: pagesRequireSignIn.includes(pathName),
    willRedirect: isPageRequiringSignIn(pathName),
  });

  // TEMPORARY: Allow access to /payment for debugging
  console.log("RequiredAuth - Checking payment bypass:", {
    pathName,
    isPaymentPath: pathName === "/payment",
  });

  if (pathName === "/payment") {
    console.log(
      "RequiredAuth - TEMPORARY: Allowing access to /payment for debugging"
    );
    return children;
  }

  if (isLoginOrSignUpPage && isAuthenticated) {
    console.log(
      "RequiredAuth - Redirecting authenticated user from auth page to home:",
      {
        pathName,
        isLoginOrSignUpPage,
        isAuthenticated,
      }
    );
    return <Navigate to="/" />;
  }
  if (isPageRequiringSignIn(pathName)) {
    console.log("RequiredAuth - Redirecting to login, user not authenticated");
    loginFirstAlert();
    return <Navigate to="/login" />;
  }

  function loginFirstAlert() {
    const alertText = t("toastAlert.pageRequiringSignIn");
    const alertState = "warning";
    setTimeout(
      () => dispatch(showAlert({ alertText, alertState, alertType: "alert" })),
      300
    );
  }

  return children;
};

export default RequiredAuth;
