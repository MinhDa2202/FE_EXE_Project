import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateLoadingState } from "src/Features/loadingSlice";
import { setAfterDiscountKey, setFormattedPrice } from "src/Functions/helper";

const useSingleProduct = (productName, loadingKey = "loadingProductDetails") => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();


const mapApiDataToComponentFormat = (apiProduct) => {
  
  const mappedProduct = {
    // Primary identifiers
    Id: apiProduct.id,
    id: apiProduct.id,
    
    // Product names
    Title: apiProduct.title,
    name: apiProduct.title,
    shortName: apiProduct.title,
    
    // Pricing
    Price: apiProduct.price,
    Discount: apiProduct.discount || 0,
    AfterDiscount: apiProduct.afterDiscount || apiProduct.price,
    
    // Images
    ImageUrls: apiProduct.imageUrls || [],
    
    // Dates
    AddedDate: apiProduct.createdAt,
    
    // Ratings
    Rate: apiProduct.rating || 0,
    Votes: apiProduct.reviewCount || 0,
    
    // Product details
    Descriptions: apiProduct.descriptions,
    category: apiProduct.categoryName || "Unknown",
    
    // Additional fields
    Colors: apiProduct.colors || [],
    sold: apiProduct.sold || Math.floor(Math.random() * 2000) + 50,
    specifications: apiProduct.specifications || [],
    reviews: apiProduct.reviews || [],
    stock: apiProduct.stock || 100,
    brand: apiProduct.brand || "",
    tags: apiProduct.tags || [],
    sizes: apiProduct.sizes || [],
    weight: apiProduct.weight || "",
    dimensions: apiProduct.dimensions || "",
    warranty: apiProduct.warranty || "",
    
    // Additional API fields
    condition: apiProduct.condition || "best",
    location: apiProduct.locations || "",
    isActive: apiProduct.isActive || true,
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
};

    const fetchSingleProduct = async (identifier, searchBy = "auto") => {
    if (!identifier) {
      setError("Product identifier is required");
      return;
    }
    let actualSearchBy = searchBy;
    if (searchBy === "auto") {
      // If identifier is numeric, assume it's an ID
      actualSearchBy = /^\d+$/.test(identifier) ? "id" : "name";
    }

    dispatch(updateLoadingState({ key: loadingKey, value: true }));
    try {
      let url = "https://localhost:7235/api/Product";
      let foundProduct = null;

      if (actualSearchBy === "id") {
        // Fetch by ID
        url = `https://localhost:7235/api/Product/${identifier}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        foundProduct = await response.json();
      } else {
        // Search by name - fetch all products and filter
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        foundProduct = data.find(
          (p) => 
            (p.name || p.title || p.Title || p.productName)?.toLowerCase() === identifier?.toLowerCase()
        );
      }

      if (!foundProduct) {
        throw new Error("Product not found");
      }

      const mappedProduct = mapApiDataToComponentFormat(foundProduct);
      setProduct(mappedProduct);
      setError(null);
    } catch (error) {
      console.error("Error fetching single product:", error);
      setError(error.message || "Failed to fetch product details");
      setProduct(null);
    } finally {
      dispatch(updateLoadingState({ key: loadingKey, value: false }));
    }
  };

  useEffect(() => {
    if (productName) {
      fetchSingleProduct(productName);
    }
  }, [productName]);

  return { product, error, refetch: () => fetchSingleProduct(productName) };
};

export default useSingleProduct;