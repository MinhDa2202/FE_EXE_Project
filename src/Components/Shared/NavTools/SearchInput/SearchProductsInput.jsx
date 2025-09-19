import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { updateLoadingState } from "src/Features/loadingSlice";
import { updateProductsState } from "src/Features/productsSlice";
import { searchByObjectKey } from "src/Functions/helper";
import SvgIcon from "../../MiniComponents/SvgIcon";
import SearchInput from "./SearchInput";
import s from "./SearchProductsInput.module.scss";

const SearchProductsInput = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const searchRef = useRef("");
  const location = useLocation();
  const pathName = location.pathname;
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useSelector((state) => state.products);

  function handleSearchProducts(e) {
    e.preventDefault();
    
    const isEmptyQuery = searchRef.current?.trim()?.length === 0;
    if (isEmptyQuery) return;

    updateSearchProducts();
  }

  function updateSearchProducts() {
    dispatch(updateLoadingState({ key: "loadingSearchProducts", value: true }));

    const queryValue = searchRef.current || decodeURIComponent(searchParams.get("query") || "");
    const isEmptyQuery = queryValue?.trim()?.length === 0;

    if (isEmptyQuery) {
      dispatch(updateProductsState({ key: "searchProducts", value: [] }));
      dispatch(updateLoadingState({ key: "loadingSearchProducts", value: false }));
      return;
    }

    // If not on search page, navigate there
    if (pathName !== "/search") {
      navigateTo("/search?query=" + encodeURIComponent(queryValue));
      return;
    }

    // If on search page, update URL and search results
    const currentQuery = searchParams.get("query");
    const encodedQuery = encodeURIComponent(queryValue);
    
    // Update URL if query is different
    if (currentQuery !== encodedQuery) {
      navigateTo("/search?query=" + encodedQuery, { replace: true });
    }

    // Use products from Redux store (from API backend)
    const productsFound = getProducts(queryValue, products);

    dispatch(
      updateProductsState({ key: "searchProducts", value: productsFound })
    );
    
    dispatch(updateLoadingState({ key: "loadingSearchProducts", value: false }));
  }

  useEffect(() => {
    const isSearchPage = pathName === "/search";
    const queryFromUrl = searchParams.get("query");
    
    if (isSearchPage && queryFromUrl) {
      // Set the search ref to the URL query for consistency
      searchRef.current = decodeURIComponent(queryFromUrl);
      updateSearchProducts();
    }

    return () => {
      dispatch(
        updateLoadingState({ key: "loadingSearchProducts", value: true })
      );
    };
  }, [products, searchParams]); // Add searchParams as dependency

  return (
    <form
      className={s.searchContainer}
      onSubmit={handleSearchProducts}
      onClick={focusInput}
      role="search"
    >
      <SearchInput searchRef={searchRef} />

      <button type="submit" aria-label={t("tooltips.searchButton")}>
        <SvgIcon name="search" />
      </button>
    </form>
  );
};

export default SearchProductsInput;

function focusInput(e) {
  const searchInput = e.currentTarget.querySelector("#search-input");
  searchInput.focus();
}

function getProducts(query, products) {
  // Only search if we have products data from API
  if (!products || products.length === 0) {
    return [];
  }

  let productsFound = [];

  // Search in multiple fields simultaneously to get all matches
  const searchableFields = [
    "name",           // Primary field for API products
    "Title",          // Alternative field
    "title",          // Lowercase version
    "productName",    // Common API variations
    "product_name",
    "productTitle",
    "product_title",
    "description",    // Content fields
    "brand",          // Brand field
    "category",       // Category field
    "locations"       // Location field
  ];

  searchableFields.forEach((field) => {
    const foundInField = searchByObjectKey({
      data: products,
      key: field,
      query,
    });

    // Add found products to the collection
    productsFound = productsFound.concat(foundInField);
  });

  // Remove duplicates based on product id
  const uniqueProducts = productsFound.filter((product, index, self) => {
    return index === self.findIndex(p => p.id === product.id || p.Id === product.id || p.Id === product.Id);
  });

  return uniqueProducts;
}
