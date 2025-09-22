import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateLoadingState } from "src/Features/loadingSlice";
import productService from "src/Services/productService";

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

  // Function to fetch user's products using ProductService
  const fetchUserProducts = async () => {
    if (!loginInfo.isSignIn || !loginInfo.token) {
      setError("Bạn cần đăng nhập để xem sản phẩm của mình");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching user products with loginInfo:", loginInfo);

      // Use ProductService to get user products
      const rawProducts = await productService.getUserProducts(loginInfo);
      console.log("Raw user products:", rawProducts);

      // Format products for display
      const formattedProducts = rawProducts.map((product) =>
        productService.formatProductForDisplay(product)
      );
      console.log("Formatted user products:", formattedProducts);

      // Map to component format
      const mappedProducts = mapApiDataToComponentFormat(formattedProducts);

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
