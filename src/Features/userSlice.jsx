import { createSlice } from "@reduxjs/toolkit";

const initialStateLocal = localStorage.getItem("userSliceData");

const initialState = initialStateLocal
  ? JSON.parse(initialStateLocal)
  : {
      loginInfo: {
        username: "",
        emailOrPhone: "",
        token: "",
        address: "",
        isSignIn: false,
      },
      signedUpUsers: [],
    };

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setLoginData: (state, { payload }) => {
      state.loginInfo = { ...payload };
    },
    signOut: (state) => {
      state.loginInfo = {
        username: "",
        emailOrPhone: "",
        token: "",
        address: "",
        isSignIn: false,
      };
      localStorage.removeItem("token");
      localStorage.removeItem("userSliceData");
    },
    newSignUp: (state, { payload }) => {
      state.signedUpUsers = payload;
      state.loginInfo.isSignIn = true;
    },
    updateUserData: (state, { payload }) => {
      Object.assign(state.loginInfo, payload.updatedUserData);
    },
  },
});

export const { setLoginData, signOut, newSignUp, updateUserData } = userSlice.actions;
export default userSlice.reducer;
