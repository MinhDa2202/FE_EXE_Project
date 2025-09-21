import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoginData } from "src/Features/userSlice";

const useLoadLoginFromLocalStorage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userSliceData = localStorage.getItem("userSliceData");
        const storedToken = localStorage.getItem("token");

        if (userSliceData) {
          const parsed = JSON.parse(userSliceData);
          if (
            parsed.loginInfo?.isSignIn &&
            (parsed.loginInfo?.token || storedToken)
          ) {
            // Ensure we have a valid token
            const validToken = parsed.loginInfo?.token || storedToken;
            dispatch(
              setLoginData({
                ...parsed.loginInfo,
                token: validToken,
                isSignIn: true,
              })
            );
          }
        }
      } catch (err) {
        console.error("Failed to parse userSliceData:", err);
        // Clear corrupted data
        localStorage.removeItem("userSliceData");
        localStorage.removeItem("token");
      }
    };

    loadUserData();
  }, [dispatch]);
};

export default useLoadLoginFromLocalStorage;
