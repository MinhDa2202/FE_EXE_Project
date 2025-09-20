// src/Components/ProductsPage/ProductsPage.jsx
import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { WEBSITE_NAME } from "src/Data/constants";
import { productCardCustomizations } from "src/Data/staticData";
import useProducts from "src/Hooks/App/useProducts";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import ExploreProducts from "../Home/ProductPoster/ExploreProducts";
import BreadcrumbWrapper from "../Shared/MiniComponents/PagesHistory/BreadcrumbWrapper";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import FilterSort from "../Shared/FilterSort/FilterSort";
import SvgIcon from "../Shared/MiniComponents/SvgIcon";
import s from "./ProductsPage.module.scss";

const ProductsPage = () => {
  const { t } = useTranslation();
  const { products, error, refetch } = useProducts("loadingProductsPage");
  const { loadingProductsPage } = useSelector((state) => state.loading);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false); // Track if filters are applied

  // Logic hiển thị sản phẩm: chỉ hiển thị khi có kết quả thực sự
  const productsToShow = hasFiltersApplied ? filteredProducts : products;
  const shouldShowProducts = productsToShow.length > 0;

  useScrollOnMount(0);

  return (
    <>
      <Helmet>
        <title>Products</title>
        <link rel="preconnect" href="https://localhost:7235/" />
        <meta
          name="description"
          content={`Explore the entire collection of products available on ${WEBSITE_NAME}. From fashion to electronics, browse our comprehensive catalog to find the perfect items for your needs.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.productsPage}>
          <BreadcrumbWrapper 
            history={["/", t("history.products")]} 
            historyPaths={[
              { path: "/", label: t("nav.home") || "Home" },
              { path: "/products", label: t("history.products") }
            ]}
            pageType="products"
            variant="clean"
          />

          <div className={s.pageHeader}>
            <h1>{t("products.title", "Products")}</h1>
          </div>

          {/* Filter & Sort */}
          {!loadingProductsPage && products.length > 0 && (
            <FilterSort
              products={products}
              onFilteredProducts={setFilteredProducts}
              onFilterStateChange={setHasFiltersApplied}
              showCategoryFilter={true}
              showPriceFilter={true}
            />
          )}

          <section className={s.products} id="products-section">
            {error && (
              <div className={s.errorMessage}>
                <p>{error}</p>
                <button onClick={refetch}>
                  Thử lại
                </button>
              </div>
            )}

            {/* No filtered results message */}
            {!loadingProductsPage && !error && products.length > 0 && hasFiltersApplied && !shouldShowProducts && (
              <div className={s.noFilteredResults}>
                <div className={s.noResultsIcon}>
                  <SvgIcon name="filter" />
                </div>
                <h3 className={s.noResultsTitle}>
                  Không tìm thấy sản phẩm nào phù hợp với bộ lọc
                </h3>
                <p className={s.noResultsMessage}>
                  Có {products.length} sản phẩm trong danh mục này nhưng không có sản phẩm nào phù hợp với điều kiện lọc hiện tại.
                </p>
                <p className={s.noResultsSuggestion}>
                  Hãy thử điều chỉnh bộ lọc hoặc xóa một số điều kiện để xem thêm kết quả.
                </p>
              </div>
            )}

            {/* Products Display */}
            {!loadingProductsPage && !error && shouldShowProducts && (
              <ExploreProducts
                customization={productCardCustomizations.allProducts}
                products={productsToShow}
              />
            )}

            {!loadingProductsPage && !error && products.length === 0 && (
              <div className={s.noProducts}>
                <p>Không tìm thấy sản phẩm nào.</p>
              </div>
            )}

            {loadingProductsPage && (
              <div className={s.SkeletonCards}>
                <SkeletonCards numberOfCards={8} />
              </div>
            )}
          </section>
        </main>
      </div>

    </>
  );
};

export default ProductsPage;
