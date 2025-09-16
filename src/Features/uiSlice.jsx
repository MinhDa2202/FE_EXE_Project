import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAddProductModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAddProductModal: (state) => {
      state.isAddProductModalOpen = true;
    },
    closeAddProductModal: (state) => {
      state.isAddProductModalOpen = false;
    },
  },
});

export const { openAddProductModal, closeAddProductModal } = uiSlice.actions;
export default uiSlice.reducer;