import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getInitialState = () => {
  try {
    const productsDataLocal = localStorage.getItem("productsSliceData");
    if (productsDataLocal) {
      const parsed = JSON.parse(productsDataLocal);
      // Ensure all required arrays exist, but DON'T restore products from localStorage
      // to avoid conflicts with fresh API data
      return {
        saveBillingInfoToLocal: parsed.saveBillingInfoToLocal || false,
        favoritesProducts: Array.isArray(parsed.favoritesProducts)
          ? parsed.favoritesProducts
          : [],
        searchProducts: Array.isArray(parsed.searchProducts)
          ? parsed.searchProducts
          : [],
        orderProducts: Array.isArray(parsed.orderProducts)
          ? parsed.orderProducts
          : [],
        wishList: Array.isArray(parsed.wishList) ? parsed.wishList : [],
        productQuantity: parsed.productQuantity || 1,
        selectedProduct: parsed.selectedProduct || null,
        removeOrderProduct: parsed.removeOrderProduct || "",
        refetchFlag: parsed.refetchFlag || false,
        products: [], // Always start with empty array, will be populated from API
      };
    }
  } catch (error) {
    console.warn("Error parsing products data from localStorage:", error);
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
    products: [], // Start with empty array, will be populated from API
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error("Failed to fetch products from API:", action.error);
        // Leave products empty when API fails, search will work when API is available
        state.products = [];
      });
  },
});

export const fetchProducts = createAsyncThunk(
  "productsSlice/fetchProducts",
  async () => {
    const response = await fetch("https://schand20250922153400.azurewebsites.net/api/Product");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Map API data to component format (based on useProducts.jsx)
    const mappedProducts = data.map((product) => ({
      Id: product.id || product.Id || product.productId,
      id: product.id || product.Id || product.productId,
      Title:
        product.name || product.title || product.Title || product.productName,
      name:
        product.name || product.title || product.Title || product.productName,
      Price: product.price || product.Price || product.originalPrice,
      Discount:
        product.discount || product.Discount || product.discountPercent || 0,
      AfterDiscount:
        product.afterDiscount || product.AfterDiscount || product.salePrice,
      ImageUrls:
        product.imageUrls ||
        product.ImageUrls ||
        product.images ||
        (product.imageUrl ? [product.imageUrl] : []),
      category: product.category || product.Category || product.categoryName,
      shortName:
        product.shortName ||
        product.name ||
        product.title ||
        product.Title ||
        product.productName,
      description:
        product.description ||
        product.Description ||
        product.productDescription ||
        "",
      brand: product.brand || product.Brand || product.brandName || "",
      Condition:
        product.condition || product.Condition || product.productCondition,
      locations: product.location || product.locations || product.address || "",
      rating: product.rating || product.rate || product.averageRating || 0,
      reviews: product.reviewCount || product.voteCount || product.votes || 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
    }));

    return mappedProducts;
  }
);

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
