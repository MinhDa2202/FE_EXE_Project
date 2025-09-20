
import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { WEBSITE_NAME } from "src/Data/constants";
import { SIMPLE_DELAYS } from "src/Data/globalVariables";
import { updateLoadingState } from "src/Features/loadingSlice";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useUpdateLoadingState from "src/Hooks/App/useUpdateLoadingState";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import BreadcrumbWrapper from "../Shared/MiniComponents/PagesHistory/BreadcrumbWrapper";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import SvgIcon from "../Shared/MiniComponents/SvgIcon";
import s from "./SearchPage.module.scss";
import enhancements from "./SearchPageEnhancements.module.scss";

import SearchProductWrapper from "./SearchProductWrapper/SearchProductWrapper";
import FilterSort from "../Shared/FilterSort/FilterSort";

const SearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loadingSearchProducts } = useSelector((state) => state.loading);
  const { searchProducts } = useSelector((state) => state.products);
  const isWebsiteOnline = useOnlineStatus();
  const searchQuery = decodeURIComponent(searchParams.get("query") || "");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false); // Track if filters are applied
  
  const PRODUCTS_PER_PAGE = 12;
  const hasResults = searchProducts.length > 0;
  // Logic hiển thị sản phẩm: chỉ hiển thị khi có kết quả thực sự
  const productsToShow = hasFiltersApplied ? filteredProducts : searchProducts;
  const displayedProducts = showAllProducts ? productsToShow : productsToShow.slice(0, PRODUCTS_PER_PAGE);
  const hasMoreProducts = productsToShow.length > PRODUCTS_PER_PAGE;
  const shouldShowProducts = productsToShow.length > 0;
  
  // Popular search suggestions
  const searchSuggestions = [
    "iPhone", "Samsung", "Xiaomi", "Gaming", "Laptop", 
    "Headphones", "Camera", "Monitor", "Keyboard", "Mouse"
  ];

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  const handleFilteredProducts = useCallback((filtered) => {
    setFilteredProducts(filtered);
  }, []);

  const handleFilterStateChange = useCallback((hasFilters) => {
    setHasFiltersApplied(hasFilters);
  }, []);



  useUpdateLoadingState({
    loadingState: loadingSearchProducts,
    loadingKey: "loadingSearchProducts",
    actionMethod: updateLoadingState,
    delays: SIMPLE_DELAYS,
    dependencies: [searchProducts],
  });
  useScrollOnMount(160);

  // Reset filter state when search query changes
  useEffect(() => {
    setHasFiltersApplied(false);
    setFilteredProducts([]);
  }, [searchQuery]);

  return (
    <>
      <Helmet>
        <title>{searchQuery ? `Search results for "${searchQuery}" - ${WEBSITE_NAME}` : `Search - ${WEBSITE_NAME}`}</title>
        <meta
          name="description"
          content={searchQuery 
            ? `Found ${searchProducts.length} products matching "${searchQuery}". Browse our selection of high-quality products on ${WEBSITE_NAME}.`
            : `Find what you're looking for quickly and easily on ${WEBSITE_NAME}'s search page. Enter the product name or keywords to discover a wide range of options tailored to your preferences.`
          }
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={searchQuery ? `Search results for "${searchQuery}"` : "Search Products"} />
        <meta property="og:description" content={`Discover amazing products on ${WEBSITE_NAME}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={searchQuery ? `Search results for "${searchQuery}"` : "Search Products"} />
        <link rel="canonical" href={`${window.location.origin}/search${searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : ''}`} />
        
        {/* Structured Data for Search Results */}
        {searchQuery && hasResults && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SearchResultsPage",
              "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": searchProducts.length,
                "itemListElement": displayedProducts.slice(0, 5).map((product, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Product",
                    "name": product.Title || "Product",
                    "url": `${window.location.origin}/details?id=${product.Id}`
                  }
                }))
              }
            })}
          </script>
        )}
      </Helmet>

      <div className="container">
        <main className={`${s.searchPage} ${enhancements.smoothTransition}`} role="main" aria-label="Search results page">
          <BreadcrumbWrapper 
            history={["/", t("history.results")]} 
            historyPaths={[
              { path: "/", label: t("nav.home") || "Home" },
              { path: "/search", label: t("history.results") }
            ]}
            pageType="search"
            variant="clean"
          />

          {/* Search Header */}
          <div className={s.searchHeader}>
            {searchQuery && (
              <div className={s.searchInfo}>
                <h1 className={s.searchTitle}>
                  {t("search.resultsFor")}: <span className={`${s.searchQuery} ${enhancements.gradientText}`}>"{searchQuery}"</span>
                </h1>
                <div className={s.resultsCount}>
                  <SvgIcon name="search" />
                  <span>
                    {filteredProducts.length > 0 ? filteredProducts.length : searchProducts.length} {t("search.productsFound")}
                    {filteredProducts.length > 0 && filteredProducts.length !== searchProducts.length && (
                      <span className={s.filteredNote}> ({t("search.filtered", "filtered from")} {searchProducts.length})</span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Filter & Sort */}
          {!loadingSearchProducts && isWebsiteOnline && hasResults && (
            <div>
              {searchProducts && searchProducts.length > 0 && (
                <FilterSort 
                  products={searchProducts}
                  onFilteredProducts={handleFilteredProducts}
                  onFilterStateChange={handleFilterStateChange}
                  showCategoryFilter={true}
                  showPriceFilter={true}
                />
              )}
            </div>
          )}

          {/* No filtered results message */}
          {!loadingSearchProducts && isWebsiteOnline && hasResults && hasFiltersApplied && !shouldShowProducts && (
            <div className={s.noFilteredResults}>
              <div className={s.noResultsIcon}>
                <SvgIcon name="filter" />
              </div>
              <h3 className={s.noResultsTitle}>
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc
              </h3>
              <p className={s.noResultsMessage}>
                Có {searchProducts.length} sản phẩm cho "{searchQuery}" nhưng không có sản phẩm nào phù hợp với điều kiện lọc hiện tại.
              </p>
              <p className={s.noResultsSuggestion}>
                Hãy thử điều chỉnh bộ lọc hoặc xóa một số điều kiện để xem thêm kết quả.
              </p>
            </div>
          )}

          {/* Search Results */}
          <section className={s.searchResults} aria-label="Search results" role="region">
            {(loadingSearchProducts || !isWebsiteOnline) && (
              <div className={s.loadingSection}>
                <SkeletonCards />
              </div>
            )}
            
            {!loadingSearchProducts && isWebsiteOnline && hasResults && shouldShowProducts && (
              <>
                <div className={s.products}>
                  {displayedProducts.map((product, index) => (
                    <SearchProductWrapper 
                      key={product.id || product.Id || `product-${index}-${searchQuery}`} 
                      product={product} 
                      index={index}
                    />
                  ))}
                </div>
                
                {hasMoreProducts && !showAllProducts && (
                  <div className={s.viewMoreSection}>
                    <button 
                      className={`${s.viewMoreButton} ${enhancements.enhancedHover} ${enhancements.focusEnhanced} ${enhancements.microInteraction}`}
                      onClick={() => setShowAllProducts(true)}
                    >
                      <SvgIcon name="eye" />
                      {t("common.viewAllProducts")} ({productsToShow.length - PRODUCTS_PER_PAGE} {t("common.more")})
                    </button>
                  </div>
                )}
              </>
            )}

            {!loadingSearchProducts && isWebsiteOnline && !hasResults && (
              <div className={s.noResults}>
                <div className={s.noResultsIcon}>
                  <SvgIcon name="search" />
                </div>
                <h3 className={s.noResultsTitle}>
                  {t("search.noResultsTitle")}
                </h3>
                <p className={s.noResultsMessage}>
                  {t("search.noResultsMessage", { query: searchQuery })}
                </p>
                <p className={s.noResultsSuggestion}>
                  {t("search.tryDifferentKeywords")}
                </p>
                
                <div className={s.suggestions}>
                  <h4 className={s.suggestionsTitle}>{t("search.popularSearches")}:</h4>
                  <div className={s.suggestionTags}>
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion}
                        className={`${s.suggestionTag} ${enhancements.floatingTag} ${enhancements.enhancedHover} ${enhancements.focusEnhanced} ${enhancements.microInteraction}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};
export default SearchPage;
