
import { useState } from "react";
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
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import SvgIcon from "../Shared/MiniComponents/SvgIcon";
import s from "./SearchPage.module.scss";
import SearchProducts from "./SearchProducts/SearchProducts";

const SearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loadingSearchProducts } = useSelector((state) => state.loading);
  const { searchProducts } = useSelector((state) => state.products);
  const isWebsiteOnline = useOnlineStatus();
  const searchQuery = decodeURIComponent(searchParams.get("query") || "");
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  const PRODUCTS_PER_PAGE = 12;
  const hasResults = searchProducts.length > 0;
  const displayedProducts = showAllProducts ? searchProducts : searchProducts.slice(0, PRODUCTS_PER_PAGE);
  const hasMoreProducts = searchProducts.length > PRODUCTS_PER_PAGE;
  
  // Popular search suggestions
  const searchSuggestions = [
    "iPhone", "Samsung", "Xiaomi", "Gaming", "Laptop", 
    "Headphones", "Camera", "Monitor", "Keyboard", "Mouse"
  ];

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
  };



  useUpdateLoadingState({
    loadingState: loadingSearchProducts,
    loadingKey: "loadingSearchProducts",
    actionMethod: updateLoadingState,
    delays: SIMPLE_DELAYS,
    dependencies: [searchProducts],
  });
  useScrollOnMount(160);

  return (
    <>
      <Helmet>
        <title>Search</title>
        <meta
          name="description"
          content={`Find what you\`re looking for quickly and easily on ${WEBSITE_NAME}\`s search page. Enter the product name or keywords to discover a wide range of options tailored to your preferences.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.searchPage}>
          <PagesHistory history={["/", t("history.results")]} />

          {/* Search Header */}
          <div className={s.searchHeader}>
            <div className={s.headerTop}>
              <button
                className={s.backButton}
                onClick={() => navigate("/")}
                aria-label={t("common.back")}
              >
                <SvgIcon name="arrowLeftShort" />
                {t("common.back")}
              </button>
            </div>

            {searchQuery && (
              <div className={s.searchInfo}>
                <h1 className={s.searchTitle}>
                  {t("search.resultsFor")}: <span className={s.searchQuery}>"{searchQuery}"</span>
                </h1>
                <div className={s.resultsCount}>
                  <SvgIcon name="search" />
                  <span>{searchProducts.length} {t("search.productsFound")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
          <section className={s.searchResults}>
            {(loadingSearchProducts || !isWebsiteOnline) && (
              <div className={s.loadingSection}>
                <SkeletonCards />
              </div>
            )}
            
            {!loadingSearchProducts && isWebsiteOnline && hasResults && (
              <>
                <div className={s.products}>
                  {displayedProducts.map((product) => (
                    <SearchProducts key={product.id} product={product} />
                  ))}
                </div>
                
                {hasMoreProducts && !showAllProducts && (
                  <div className={s.viewMoreSection}>
                    <button 
                      className={s.viewMoreButton}
                      onClick={() => setShowAllProducts(true)}
                    >
                      <SvgIcon name="eye" />
                      {t("common.viewAllProducts")} ({searchProducts.length - PRODUCTS_PER_PAGE} {t("common.more")})
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
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        className={s.suggestionTag}
                        onClick={() => handleSuggestionClick(suggestion)}
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
