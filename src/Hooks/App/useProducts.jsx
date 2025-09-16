// src/Hooks/App/useProducts.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLoadingState } from "src/Features/loadingSlice";
import { setAfterDiscountKey, setFormattedPrice } from "src/Functions/helper";

const useProducts = (loadingKey = "loadingProducts") => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { refetchFlag } = useSelector((state) => state.products);

  // Helper function để fetch single product by ID hoặc name
  const fetchSingleProduct = async (identifier, searchBy = "name") => {
    dispatch(updateLoadingState({ key: loadingKey, value: true }));
    try {
      let url = "https://localhost:7235/api/Product";
      let product = null;

      if (searchBy === "id") {
        url = `https://localhost:7235/api/Product/${identifier}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        product = data;
      } else {
        // Search by name - fetch all products and filter
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        product = data.find(
          (p) => 
            (p.name || p.title || p.Title || p.productName)?.toLowerCase() === identifier?.toLowerCase()
        );
      }

      if (!product) {
        throw new Error("Product not found");
      }

      const mappedProduct = mapApiDataToComponentFormat([product])[0];
      return mappedProduct;
    } catch (error) {
      console.error("Error fetching single product:", error);
      throw error;
    } finally {
      dispatch(updateLoadingState({ key: loadingKey, value: false }));
    }
  };

  // Helper function để mapping API data sang format component mong đợi
  const mapApiDataToComponentFormat = (apiProducts) => {
    return apiProducts.map((product) => {
      const mappedProduct = {
        Id: product.id || product.Id || product.productId,
        id: product.id || product.Id || product.productId, // Thêm lowercase id cho compatibility
        Title: product.name || product.title || product.Title || product.productName,
        Price: product.price || product.Price || product.originalPrice,
        Discount: product.discount || product.Discount || product.discountPercent || 0,
        AfterDiscount: product.afterDiscount || product.AfterDiscount || product.salePrice,
        ImageUrls: product.imageUrls || product.ImageUrls || product.images || (product.imageUrl ? [product.imageUrl] : []),
        AddedDate: product.addedDate || product.AddedDate || product.createdDate || product.dateAdded,
        Rate: product.rate || product.Rate || product.rating || product.averageRating || 0,
        Votes: product.votes || product.Votes || product.voteCount || product.reviewCount || 0,
        Colors: product.colors || product.Colors || product.availableColors || [],
        sold: product.sold || product.totalSold || product.soldCount || Math.floor(Math.random() * 2000) + 50, // Fallback với random number
        // Thêm thêm fields cho product details
        category: product.category || product.Category || product.productCategory || "Unknown",
        shortName: product.shortName || product.name || product.title || product.Title || product.productName,
        name: product.name || product.title || product.Title || product.productName,
        description: product.description || product.Description || product.productDescription || "",
        specifications: product.specifications || product.Specifications || product.specs || [],
        reviews: product.reviews || product.Reviews || product.customerReviews || [],
        stock: product.stock || product.Stock || product.stockQuantity || 0,
        brand: product.brand || product.Brand || product.brandName || "",
        tags: product.tags || product.Tags || product.productTags || [],
        Condition: product.condition || product.Condition || product.productCondition,
      };

      // Tính toán giá sau discount nếu chưa có
      if (!mappedProduct.AfterDiscount && mappedProduct.Price && mappedProduct.Discount > 0) {
        mappedProduct.AfterDiscount = mappedProduct.Price - (mappedProduct.Price * mappedProduct.Discount / 100);
      } else if (!mappedProduct.AfterDiscount) {
        mappedProduct.AfterDiscount = mappedProduct.Price;
      }

      // Apply helper functions
      setAfterDiscountKey(mappedProduct);
      setFormattedPrice(mappedProduct);
      
      return mappedProduct;
    });
  };

  const fetchProducts = async () => {
    dispatch(updateLoadingState({ key: loadingKey, value: true }));
    try {
      const response = await fetch("https://localhost:7235/api/Product");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Map API data to component format
      const mappedProducts = mapApiDataToComponentFormat(data);
      
      setProducts(mappedProducts);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
      setProducts([]);
    } finally {
      dispatch(updateLoadingState({ key: loadingKey, value: false }));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refetchFlag]);

  return { products, error, refetch: fetchProducts, fetchSingleProduct };
};

export default useProducts;