import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateLoadingState } from "src/Features/loadingSlice";

const useUserProducts = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { loginInfo } = useSelector((state) => state.user);
  const { refetchFlag } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  // Map API data to component format
  const mapApiDataToComponentFormat = (apiData) => {
    return apiData.map((item) => {
      const mappedProduct = {
        Id: item.id || item.Id,
        id: item.id || item.Id,
        Title: item.title || item.Title,
        title: item.title || item.Title,
        Descriptions: item.descriptions || item.Descriptions,
        descriptions: item.descriptions || item.Descriptions,
        Price: parseFloat(item.price || item.Price || 0),
        price: parseFloat(item.price || item.Price || 0),
        OriginalPrice: parseFloat(
          item.originalPrice || item.OriginalPrice || 0
        ),
        originalPrice: parseFloat(
          item.originalPrice || item.OriginalPrice || 0
        ),
        Discount: parseFloat(item.discount || item.Discount || 0),
        discount: parseFloat(item.discount || item.Discount || 0),
        Condition: item.condition || item.Condition,
        condition: item.condition || item.Condition,
        Locations: item.locations || item.Locations,
        location: item.locations || item.Locations,
        CategoryId: item.categoryId || item.CategoryId,
        categoryId: item.categoryId || item.CategoryId,
        AddedDate: item.addedDate || item.AddedDate || item.createdAt,
        addedDate: item.addedDate || item.AddedDate || item.createdAt,
        createdAt: item.addedDate || item.AddedDate || item.createdAt,
        images: item.images || [],
        imageUrl: item.imageUrl || (item.images && item.images[0]?.imageUrl),
        userEmail: item.userEmail,
        userName: item.userName,
        views: item.views || 0,
        likes: item.likes || 0,
      };

      // Calculate after discount if not provided
      if (
        !mappedProduct.AfterDiscount &&
        mappedProduct.Price &&
        mappedProduct.Discount > 0
      ) {
        mappedProduct.AfterDiscount =
          mappedProduct.Price -
          (mappedProduct.Price * mappedProduct.Discount) / 100;
      } else if (!mappedProduct.AfterDiscount) {
        mappedProduct.AfterDiscount = mappedProduct.Price;
      }

      return mappedProduct;
    });
  };

  // Function to fetch user's products
  const fetchUserProducts = async () => {
    // Get token from both sources for reliability
    const reduxToken = loginInfo.token;
    const localStorageToken = localStorage.getItem("token");

    // Use localStorage token as fallback if Redux token is missing
    const token = reduxToken || localStorageToken;

    if (!token || !loginInfo.isSignIn) {
      setError("Bạn cần đăng nhập để xem sản phẩm của mình");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, try to fetch user-specific products if endpoint exists
      let response;
      let url = "/api/Product/user"; // Try user-specific endpoint first

      response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // If user-specific endpoint returns 400/404, fall back to all products
      if (
        !response.ok &&
        (response.status === 400 || response.status === 404)
      ) {
        console.log(
          "User-specific endpoint not available, fetching all products"
        );
        url = "/api/Product";

        response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          );
        } else if (response.status === 403) {
          throw new Error("Bạn không có quyền truy cập thông tin này.");
        } else if (response.status === 400) {
          throw new Error(
            "Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin đăng nhập."
          );
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();

      // Map API data to component format
      let mappedProducts = mapApiDataToComponentFormat(
        Array.isArray(data) ? data : []
      );

      // If we fetched all products, filter by current user
      if (url.includes("/Product") && !url.includes("/user")) {
        // Filter products by user email or user ID
        mappedProducts = mappedProducts.filter((product) => {
          // Try to match by email first (most reliable)
          if (product.userEmail && loginInfo.emailOrPhone) {
            return (
              product.userEmail.toLowerCase() ===
              loginInfo.emailOrPhone.toLowerCase()
            );
          }

          // Try to match by user name
          if (product.userName && loginInfo.username) {
            return (
              product.userName.toLowerCase() ===
              loginInfo.username.toLowerCase()
            );
          }

          // If no user info in product, we can't determine ownership
          // In a real app, you'd want to ensure products have user association
          return false;
        });
      }

      // Sort by newest first
      mappedProducts.sort((a, b) => {
        const dateA = new Date(a.AddedDate || 0);
        const dateB = new Date(b.AddedDate || 0);
        return dateB - dateA;
      });

      setUserProducts(mappedProducts);
      setError(null);
    } catch (error) {
      console.error("Error fetching user products:", error);
      setError(
        error.message || "Không thể tải sản phẩm của bạn. Vui lòng thử lại sau."
      );
      setUserProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch function
  const refetch = () => {
    fetchUserProducts();
  };

  // Effect to fetch products on mount and when dependencies change
  useEffect(() => {
    if (
      loginInfo.isSignIn &&
      (loginInfo.token || localStorage.getItem("token"))
    ) {
      fetchUserProducts();
    } else {
      setUserProducts([]);
      setError(null);
    }
  }, [
    loginInfo.isSignIn,
    loginInfo.token,
    loginInfo.emailOrPhone,
    refetchFlag,
  ]);

  return {
    userProducts,
    loading,
    error,
    refetch,
    fetchUserProducts,
  };
};

export default useUserProducts;
