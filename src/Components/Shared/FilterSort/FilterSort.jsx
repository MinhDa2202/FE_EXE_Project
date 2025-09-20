import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import SvgIcon from "../MiniComponents/SvgIcon";
import s from "./FilterSort.module.scss";

const FilterSort = ({ 
  products = [], 
  onFilteredProducts, 
  onFilterStateChange,
  showCategoryFilter = true,
  showPriceFilter = true,
  className = ""
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    customPriceMin: "",
    customPriceMax: "",
    sortBy: "default"
  });

  // Extract unique categories from products - memoized
  const categories = useMemo(() => {
    console.log("FilterSort - Products received:", products);
    const extractedCategories = products.map(product =>
      product.category || product.Category || product.productCategory || "Unknown"
    );
    console.log("FilterSort - Extracted categories:", extractedCategories);
    const uniqueCategories = [...new Set(extractedCategories)].filter(Boolean);
    console.log("FilterSort - Unique categories:", uniqueCategories);
    return uniqueCategories;
  }, [products]);

  // Extract price from product - memoized to avoid recreation
  const getProductPrice = useCallback((product) => {
    // Try multiple price fields
    const price = product.Price || product.price || product.AfterDiscount || product.afterDiscount || 0;
    
    if (typeof price === 'string') {
      // Xử lý chuỗi có thể chứa dấu phẩy, chấm, ký tự tiền tệ
      const numericPrice = parseFloat(price.replace(/[^\d.]/g, '')) || 0;
      return numericPrice;
    }
    
    return parseFloat(price) || 0;
  }, []);

  // Memoize currency type detection to avoid recalculation
  const currencyType = useMemo(() => {
    if (products.length === 0) return 'VND';
    
    const samplePrices = products.slice(0, 5).map(p => getProductPrice(p));
    const avgPrice = samplePrices.reduce((sum, price) => sum + price, 0) / samplePrices.length;
    
    // If average price is less than 10000, likely USD, otherwise VND
    return avgPrice < 10000 ? 'USD' : 'VND';
  }, [products]);

  // Memoize price ranges to avoid recreation
  const priceRanges = useMemo(() => {
    return currencyType === 'USD' ? [
      { value: "all", label: t("filter.allPrices", "All Prices") },
      { value: "0-50", label: "Under $50" },
      { value: "50-100", label: "$50 - $100" },
      { value: "100-500", label: "$100 - $500" },
      { value: "500-1000", label: "$500 - $1000" },
      { value: "1000-999999", label: "Over $1000" },
      { value: "custom", label: t("filter.customRange", "Custom Range") }
    ] : [
      { value: "all", label: t("filter.allPrices", "All Prices") },
      { value: "0-5000000", label: "Dưới 5 triệu" },
      { value: "5000000-10000000", label: "5 - 10 triệu" },
      { value: "10000000-20000000", label: "10 - 20 triệu" },
      { value: "20000000-50000000", label: "20 - 50 triệu" },
      { value: "50000000-999999999", label: "Trên 50 triệu" },
      { value: "custom", label: t("filter.customRange", "Custom Range") }
    ];
  }, [currencyType, t]);

  // Memoize sort options
  const sortOptions = useMemo(() => [
    { value: "default", label: t("sort.default", "Default") },
    { value: "name-asc", label: t("sort.nameAsc", "Name A-Z") },
    { value: "name-desc", label: t("sort.nameDesc", "Name Z-A") },
    { value: "price-asc", label: t("sort.priceAsc", "Price Low to High") },
    { value: "price-desc", label: t("sort.priceDesc", "Price High to Low") },
    { value: "newest", label: t("sort.newest", "Newest First") }
  ], [t]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    // Check if any filters are applied
    const hasAnyFilter = filters.category !== "all" || 
                        filters.priceRange !== "all" || 
                        filters.sortBy !== "default";

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(product =>
        (product.category || product.Category || product.productCategory || "Unknown") === filters.category
      );
    }

    // Price filter
    if (filters.priceRange !== "all") {
      if (filters.priceRange === "custom") {
        const minPrice = parseFloat(filters.customPriceMin) || 0;
        const maxPrice = parseFloat(filters.customPriceMax) || Infinity;
        filtered = filtered.filter(product => {
          const price = getProductPrice(product);
          return price >= minPrice && price <= maxPrice;
        });
      } else {
        const [min, max] = filters.priceRange.split("-").map(Number);
        filtered = filtered.filter(product => {
          const price = getProductPrice(product);
          return price >= min && price <= max;
        });
      }
    }

    // Sort products
    switch (filters.sortBy) {
      case "name-asc":
        filtered.sort((a, b) => (a.Title || a.name || "").localeCompare(b.Title || b.name || ""));
        break;
      case "name-desc":
        filtered.sort((a, b) => (b.Title || b.name || "").localeCompare(a.Title || a.name || ""));
        break;
      case "price-asc":
        filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        break;
      case "price-desc":
        filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.AddedDate || b.createdAt || 0) - new Date(a.AddedDate || a.createdAt || 0));
        break;
      default:
        // Keep original order
        break;
    }

    // Always call the callback with filtered results
    if (onFilteredProducts) {
      onFilteredProducts(filtered);
    }
    
    // Notify parent about filter state
    if (onFilterStateChange) {
      onFilterStateChange(hasAnyFilter);
    }
  }, [filters, products, getProductPrice, onFilteredProducts, onFilterStateChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      priceRange: "all",
      customPriceMin: "",
      customPriceMax: "",
      sortBy: "default"
    });
  };

  const hasActiveFilters = filters.category !== "all" || 
                          filters.priceRange !== "all" || 
                          filters.sortBy !== "default";

  return (
    <div className={`${s.filterSort} ${className}`}>
      <div className={s.filterHeader}>
        <button 
          className={s.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <SvgIcon name="filter" />
          <span>{t("filter.filterSort", "Filter & Sort")}</span>
          <SvgIcon name={isExpanded ? "chevronUp" : "chevronDown"} />
        </button>
        
        {hasActiveFilters && (
          <button className={s.clearButton} onClick={clearFilters}>
            <SvgIcon name="x" />
            <span>{t("filter.clear", "Clear")}</span>
          </button>
        )}
      </div>

      <div className={`${s.filterContent} ${isExpanded ? s.expanded : ""}`}>
        <div className={s.filterGrid}>
          {/* Category Filter */}
          {showCategoryFilter && categories.length > 0 && (
            <div className={s.filterGroup}>
              <label className={s.filterLabel}>
                <SvgIcon name="tag" />
                {t("filter.category", "Category")}
              </label>
              <select 
                className={s.filterSelect}
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="all">{t("filter.allCategories", "All Categories")}</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price Filter */}
          {showPriceFilter && (
            <div className={s.filterGroup}>
              <label className={s.filterLabel}>
                <SvgIcon name="dollar" />
                {t("filter.priceRange", "Price Range")}
              </label>
              <select 
                className={s.filterSelect}
                value={filters.priceRange}
                onChange={(e) => handleFilterChange("priceRange", e.target.value)}
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              
              {filters.priceRange === "custom" && (
                <div className={s.customPriceInputs}>
                  <input
                    type="number"
                    placeholder={t("filter.minPrice", "Min Price")}
                    value={filters.customPriceMin}
                    onChange={(e) => handleFilterChange("customPriceMin", e.target.value)}
                    className={s.priceInput}
                  />
                  <span className={s.priceSeparator}>-</span>
                  <input
                    type="number"
                    placeholder={t("filter.maxPrice", "Max Price")}
                    value={filters.customPriceMax}
                    onChange={(e) => handleFilterChange("customPriceMax", e.target.value)}
                    className={s.priceInput}
                  />
                </div>
              )}
            </div>
          )}

          {/* Sort Options */}
          <div className={s.filterGroup}>
            <label className={s.filterLabel}>
              <SvgIcon name="sort" />
              {t("filter.sortBy", "Sort By")}
            </label>
            <select 
              className={s.filterSelect}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className={s.activeFilters}>
            <span className={s.activeFiltersLabel}>
              {t("filter.activeFilters", "Active Filters")}:
            </span>
            <div className={s.filterTags}>
              {filters.category !== "all" && (
                <span className={s.filterTag}>
                  {t("filter.category", "Category")}: {filters.category}
                  <button onClick={() => handleFilterChange("category", "all")}>
                    <SvgIcon name="x" />
                  </button>
                </span>
              )}
              {filters.priceRange !== "all" && (
                <span className={s.filterTag}>
                  {t("filter.price", "Price")}: {
                    filters.priceRange === "custom" 
                      ? `${filters.customPriceMin || 0} - ${filters.customPriceMax || "∞"}`
                      : priceRanges.find(r => r.value === filters.priceRange)?.label
                  }
                  <button onClick={() => handleFilterChange("priceRange", "all")}>
                    <SvgIcon name="x" />
                  </button>
                </span>
              )}
              {filters.sortBy !== "default" && (
                <span className={s.filterTag}>
                  {t("filter.sort", "Sort")}: {sortOptions.find(s => s.value === filters.sortBy)?.label}
                  <button onClick={() => handleFilterChange("sortBy", "default")}>
                    <SvgIcon name="x" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSort;
