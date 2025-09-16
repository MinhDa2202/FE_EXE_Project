import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoginData } from "src/Features/userSlice";

const useLoadLoginFromLocalStorage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = localStorage.getItem("userSliceData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.loginInfo?.isSignIn) {
          dispatch(setLoginData(parsed.loginInfo));
        }
      } catch (err) {
        console.error("Failed to parse userSliceData:", err);
      }
    }
  }, [dispatch]);
};

export default useLoadLoginFromLocalStorage;
