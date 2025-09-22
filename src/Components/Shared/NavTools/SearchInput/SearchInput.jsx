import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useLocation } from "react-router-dom";

const SearchInput = ({ searchRef }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  function handleSearchOnChange(e) {
    const inputValue = e.target.value;
    searchRef.current = inputValue;
  }

  // Set the input value from URL query when on search page
  useEffect(() => {
    const isSearchPage = location.pathname === "/search";
    const queryFromUrl = searchParams.get("query");

    if (isSearchPage && queryFromUrl) {
      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        const decodedQuery = decodeURIComponent(queryFromUrl);
        // Only update if the input value is different from URL query
        if (searchInput.value !== decodedQuery) {
          searchInput.value = decodedQuery;
          searchRef.current = decodedQuery;
        }
      }
    } else if (!isSearchPage) {
      // Clear search input when not on search page
      const searchInput = document.getElementById("search-input");
      if (searchInput && searchInput.value) {
        searchInput.value = "";
        searchRef.current = "";
      }
    }
  }, [searchParams, location.pathname, searchRef]);

  return (
    <input
      type="text"
      id="search-input"
      autoComplete="off"
      placeholder={t("inputsPlaceholders.whatYouLookingFor")}
      onChange={handleSearchOnChange}
      aria-label="Search product field"
    />
  );
};
export default SearchInput;
