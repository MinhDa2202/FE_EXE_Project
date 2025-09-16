import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  try {
    const productsDataLocal = localStorage.getItem("productsSliceData");
    if (productsDataLocal) {
      const parsed = JSON.parse(productsDataLocal);
      // Ensure all required arrays exist
      return {
        saveBillingInfoToLocal: parsed.saveBillingInfoToLocal || false,
        favoritesProducts: Array.isArray(parsed.favoritesProducts) ? parsed.favoritesProducts : [],
        searchProducts: Array.isArray(parsed.searchProducts) ? parsed.searchProducts : [],
        orderProducts: Array.isArray(parsed.orderProducts) ? parsed.orderProducts : [],
        wishList: Array.isArray(parsed.wishList) ? parsed.wishList : [],
        productQuantity: parsed.productQuantity || 1,
        selectedProduct: parsed.selectedProduct || null,
        removeOrderProduct: parsed.removeOrderProduct || "",
        refetchFlag: parsed.refetchFlag || false,
      };
    }
  } catch (error) {
    console.warn("Error parsing products data from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem("productsSliceData");
  }
  
  return {
    saveBillingInfoToLocal: false,
    favoritesProducts: [],
    searchProducts: [],
    orderProducts: [],
    wishList: [],
    productQuantity: 1,
    selectedProduct: null,
    removeOrderProduct: "",
    refetchFlag: false,
  };
};

const initialState = getInitialState();

const productsSlice = createSlice({
  initialState,
  name: "productsSlice",
  reducers: {
    triggerRefetch: (state) => {
      state.refetchFlag = !state.refetchFlag;
    },
    updateProductsState: (state, { payload: { key, value } }) => {
      state[key] = value;
    },
    addToArray: (state, { payload: { key, value } }) => {
      state[key].push(value);
    },
    removeById: (state, { payload: { key, id } }) => {
      const updatedState = state[key].filter((item) => item.id !== id);
      state[key] = updatedState;
    },
    removeByKeyName: (state, { payload: { dataKey, itemKey, keyValue } }) => {
      const updatedState = state[dataKey].filter(
        (item) => item[itemKey] !== keyValue
      );
      state[dataKey] = updatedState;
    },
    setEmptyArrays: (state, { payload: { keys } }) => {
      for (let i = 0; i < keys.length; i++) state[keys[i]] = [];
    },
    transferProducts: (state, { payload: { from, to } }) => {
      state[to] = state[to].concat(state[from]);
      state[from] = [];
    },
  },
});

export const {
  triggerRefetch,
  updateProductsState,
  addToArray,
  removeById,
  removeByKeyName,
  setEmptyArrays,
  transferProducts,
} = productsSlice.actions;
export default productsSlice.reducer;
