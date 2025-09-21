import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "src/Data/constants";
import { productCardCustomizations } from "src/Data/staticData";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useGetSearchParam from "src/Hooks/Helper/useGetSearchParam";
import { useEffect, useState } from "react";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import CategoriesSection from "../Home/CategoriesSection/CategoriesSection";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import ProductsCategory from "./ProductsCategory";
import s from "./ProductsCategoryPage.module.scss";

const ProductsCategoryPage = () => {
  const { t } = useTranslation();
  const categoryId = useGetSearchParam("id");
  const categoryName = useGetSearchParam("name");
  const categoryTypeTrans = t(`categoriesData.${categoryName}`);
  const isWebsiteOnline = useOnlineStatus();

  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  // Helper function to map categoryName to categoryId
  const getCategoryIdFromCategoryName = (categoryName, categories) => {
    if (!categoryName || !categories.length) return null;

    // Find matching category by name (case insensitive)
    const matchingCategory = categories.find(
      (cat) => cat.name && cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    return matchingCategory ? matchingCategory.id : null;
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setLoadingError(null);

      try {
        // Fetch categories and products in parallel
        const [categoriesResponse, productsResponse] = await Promise.allSettled(
          [fetch("/api/Category"), fetch("/api/Product")]
        );

        // Handle categories response
        let categoriesData = [];
        if (
          categoriesResponse.status === "fulfilled" &&
          categoriesResponse.value.ok
        ) {
          categoriesData = await categoriesResponse.value.json();
          setAllCategories(categoriesData);
        } else {
          console.warn(
            "⚠️ Categories API failed:",
            categoriesResponse.reason || "Unknown error"
          );
        }

        // Handle products response
        let productsData = [];
        if (
          productsResponse.status === "fulfilled" &&
          productsResponse.value.ok
        ) {
          productsData = await productsResponse.value.json();
          setAllProducts(productsData);
        } else {
          console.error(
            "❌ Products API failed:",
            productsResponse.reason || "Unknown error"
          );
          throw new Error("Failed to fetch products");
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setLoadingError(error.message);
        setAllProducts([]);
        setAllCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array - only run once on mount

  // Filter products when categoryId or allProducts change
  useEffect(() => {
    if (!allProducts.length) {
      setFilteredProducts([]);
      return;
    }

    if (!categoryId) {
      setFilteredProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter((product) => {
      // First try to get categoryId directly
      let productCategoryId =
        product.categoryId ||
        product.category_id ||
        product.CategoryId ||
        product.category?.id;

      // If no direct categoryId, map from categoryName using categories data
      if (!productCategoryId && product.categoryName && allCategories.length) {
        productCategoryId = getCategoryIdFromCategoryName(
          product.categoryName,
          allCategories
        );
      }

      // Convert both to numbers for comparison
      const targetCategoryId = Number(categoryId);
      const currentCategoryId = Number(productCategoryId);

      const isMatch =
        !isNaN(currentCategoryId) && currentCategoryId === targetCategoryId;

      return isMatch;
    });

    setFilteredProducts(filtered);
  }, [categoryId, allProducts, allCategories]);

  useScrollOnMount(0);

  return (
    <>
      <Helmet>
        <title>{categoryName || "Products"}</title>
        <meta
          name="description"
          content={`Discover a wide range of products categorized for easy browsing on ${WEBSITE_NAME}. Explore our extensive selection by category or type to find exactly what you're looking for.`}
        />
      </Helmet>
      <div className="container">
        <main className={s.categoryPage}>
          <PagesHistory
            history={["/", categoryTypeTrans || categoryName || "Products"]}
          />
          <section className={s.categoryContent} id="category-page">
            {/* Show error message if loading failed */}
            {loadingError && (
              <div className={s.errorMessage}>
                <p>❌ Error loading products: {loadingError}</p>
                <button onClick={() => window.location.reload()}>
                  🔄 Retry
                </button>
              </div>
            )}

            {/* Show products when loaded and online */}
            {!isLoading && isWebsiteOnline && !loadingError && (
              <>
                {filteredProducts.length > 0 ? (
                  <ProductsCategory
                    products={filteredProducts}
                    customization={productCardCustomizations.categoryProducts}
                  />
                ) : (
                  <div className={s.noProducts}>
                    <h3>🔍 No products found</h3>
                    <p>
                      {categoryId
                        ? `No products found in category "${
                            categoryName || categoryId
                          }"`
                        : "No products available"}
                    </p>
                    {categoryId && (
                      <button
                        onClick={() => (window.location.href = "/products")}
                        className={s.viewAllButton}
                      >
                        View All Products
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Show loading skeleton */}
            {(isLoading || !isWebsiteOnline) && (
              <div className={s.skeletonCards}>
                <SkeletonCards numberOfCards={4} />
              </div>
            )}
          </section>
          <CategoriesSection />
        </main>
      </div>
    </>
  );
};

export default ProductsCategoryPage;
