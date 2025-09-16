import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { productCardCustomizations } from "src/Data/staticData";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard";
import s from "./FavoriteProducts.module.scss";

const FavoriteProducts = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favoritesProducts } = useSelector((state) => state.products);

  useScrollOnMount(160);

  // API Base URL
  const API_BASE_URL = "https://localhost:7235/api";

  // Get auth token from localStorage or Redux state
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : "";
  };
  // console.log("authToken:", localStorage.getItem("token"));

  // API call to get favorites
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/Favorite`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách yêu thích");
      }

      const favorites = await response.json();

      // Dispatch action to update Redux store
      dispatch({
        type: "SET_FAVORITES_PRODUCTS",
        payload: favorites,
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  // API call to add favorite
  const addToFavorites = async (productId) => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/Favorite`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ProductId: productId }),
      });

      if (!response.ok) {
        throw new Error("Không thể thêm vào danh sách yêu thích");
      }

      // Refresh favorites list after adding
      await fetchFavorites();
    } catch (err) {
      setError(err.message);
      console.error("Error adding to favorites:", err);
    }
  };

  // API call to remove favorite
  const removeFromFavorites = async (productId) => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/Favorite/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Không thể xóa khỏi danh sách yêu thích");
      }

      // Update Redux store by removing the product
      dispatch({
        type: "REMOVE_FROM_FAVORITES",
        payload: productId,
      });
    } catch (err) {
      setError(err.message);
      console.error("Error removing from favorites:", err);
    }
  };

  // Fetch favorites when component mounts
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={s.favProducts}>
        <div className={s.loading}>Đang tải danh sách yêu thích...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={s.favProducts}>
        <div className={s.error}>
          Lỗi: {error}
          <button onClick={fetchFavorites} className={s.retryButton}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!favoritesProducts || favoritesProducts.length === 0) {
    return (
      <div className={s.emptyWrapper}>
        <h2 className={s.emptyTitle}>Danh sách yêu thích trống</h2>
        <div className={s.emptyStateContainer}>
          <div className={s.emptyIcon}>❤️</div>{" "}
          {/* Placeholder for an actual icon component */}
          <p className={s.emptyMessage}>
            {" "}
            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. Hãy khám phá cửa
            hàng và lưu lại những sản phẩm bạn yêu thích!
          </p>
          <button
            onClick={() => (window.location.href = "/products")}
            className={s.browseButton}
          >
            Khám phá sản phẩm ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.favProducts}>
      {favoritesProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          customization={productCardCustomizations.wishListProducts}
          removeFrom="favoritesProducts"
          onRemoveFromFavorites={() => removeFromFavorites(product.id)}
        />
      ))}
    </div>
  );
};

export default FavoriteProducts;
