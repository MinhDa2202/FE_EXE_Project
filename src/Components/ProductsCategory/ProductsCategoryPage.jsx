import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "src/Data/constants";
import { productCardCustomizations } from "src/Data/staticData";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useGetSearchParam from "src/Hooks/Helper/useGetSearchParam";
import { useEffect, useState } from "react";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import CategoriesSection from "../Home/CategoriesSection/CategoriesSection";
import BreadcrumbWrapper from "../Shared/MiniComponents/PagesHistory/BreadcrumbWrapper";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import ProductsCategory from "./ProductsCategory";
import s from "./ProductsCategoryPage.module.scss";

const ProductsCategoryPage = () => {
  const { t } = useTranslation();
  const categoryId = useGetSearchParam("id");
  const categoryName = useGetSearchParam("name");
  const categoryTypeTrans = t(`${categoryName}`);
  const isWebsiteOnline = useOnlineStatus();

  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  // Helper function to map categoryName to categoryId
  const getCategoryIdFromCategoryName = (categoryName, categories) => {
    if (!categoryName || !categories.length) return null;
    
    const matchingCategory = categories.find(cat =>
      cat.name && cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    return matchingCategory ? matchingCategory.id : null;
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setLoadingError(null);

      try {
        const [categoriesResponse, productsResponse] = await Promise.allSettled([
          fetch("https://localhost:7235/api/Category"),
          fetch("https://localhost:7235/api/Product")
        ]);

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
  }, []);

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
      let productCategoryId = product.categoryId ||
                             product.category_id ||
                             product.CategoryId ||
                             product.category?.id;
      
      if (!productCategoryId && product.categoryName && allCategories.length) {
        productCategoryId = getCategoryIdFromCategoryName(
          product.categoryName,
          allCategories
        );
      }
      
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
          <div className={s.headerSection}>
            <BreadcrumbWrapper 
              history={["/", categoryTypeTrans || categoryName || 'Products']} 
              historyPaths={[
                { path: "/", label: t("nav.home") || "Home" },
                { path: `/category/${categoryName}`, label: categoryTypeTrans || categoryName || 'Products' }
              ]}
              pageType="productsCategory"
              variant="clean"
            />
            <div className={s.categoryHeader}>

              {!isLoading && filteredProducts.length > 0 && (
                <div className={s.resultsInfo}>
                  <span className={s.productCount}>{filteredProducts.length} sản phẩm</span>
                </div>
              )}
            </div>
          </div>

          <section className={s.categoryContent} id="category-page">
            {/* Loading State */}
            {(isLoading || !isWebsiteOnline) && (
              <div className={s.loadingContainer}>
                <div className={s.loadingHeader}>
                  <div className={s.loadingTitle}></div>
                  <div className={s.loadingSubtitle}></div>
                </div>
                <div className={s.skeletonGrid}>
                  <SkeletonCards numberOfCards={8} />
                </div>
              </div>
            )}

            {/* Error State */}
            {loadingError && (
              <div className={s.errorContainer}>
                <div className={s.errorIcon}>⚠️</div>
                <h3 className={s.errorTitle}>Oops! Có lỗi xảy ra</h3>
                <p className={s.errorMessage}>
                  Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className={s.retryButton}
                >
                  <span>🔄</span>
                  Thử lại
                </button>
              </div>
            )}
            
            {/* Products Display */}
            {!isLoading && isWebsiteOnline && !loadingError && (
              <>
                {filteredProducts.length > 0 ? (
                  <div className={s.productsContainer}>
                    <ProductsCategory
                      products={filteredProducts}
                      customization={productCardCustomizations.categoryProducts}
                    />
                  </div>
                ) : (
                  <div className={s.emptyState}>
                    <div className={s.emptyIcon}>🔍</div>
                    <h3 className={s.emptyTitle}>Không tìm thấy sản phẩm</h3>
                    <p className={s.emptyDescription}>
                      {categoryId 
                        ? `Hiện tại chưa có sản phẩm nào trong danh mục "${categoryName || categoryId}"` 
                        : "Không có sản phẩm nào khả dụng"
                      }
                    </p>
                    <div className={s.emptyActions}>
                      <button 
                        onClick={() => window.location.href = '/products'}
                        className={s.viewAllButton}
                      >
                        <span>🛍️</span>
                        Xem tất cả sản phẩm
                      </button>
                      <button 
                        onClick={() => window.history.back()}
                        className={s.backButton}
                      >
                        <span>↩️</span>
                        Quay lại
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
          
          <div className={s.categoriesWrapper}>
            <CategoriesSection />
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductsCategoryPage;
