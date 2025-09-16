// src/Components/Home/TodaySection/TodaySection.jsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useProducts from "src/Hooks/App/useProducts";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle";
import SkeletonCards from "../../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import EventCounter from "./EventCounter";
import s from "./TodaySection.module.scss";

const TodaySection = () => {
  const todaysSection = "sectionTitles.todaysSection";
  const { t } = useTranslation();
  const { products, error } = useProducts("loadingTodayProducts");
  const { loadingTodayProducts } = useSelector((state) => state.loading);

  // Filter function cho flash sales - products có sold > 100
  const filterFlashSalesProducts = () => {
    return products.filter((product) => product.sold > 100);
  };

  return (
    <section className={s.todaysSection} id="todays-section">
      <div className={s.flashSaleHeader}>
        <div className={s.headerContent}>
          <div className={s.titleSection}>
            <div className={s.flashSaleBadge}>
              <span className={s.badgeIcon}>⚡</span>
              <span className={s.badgeText}>FLASH SALE</span>
            </div>
            <h2 className={s.sectionTitle}>
              Limited Time Offers
              <span className={s.highlightText}> Up to 70% Off</span>
            </h2>
            <p className={s.sectionDescription}>
              Don't miss out on these incredible deals! Shop now before they're gone.
            </p>
          </div>
          
          <div className={s.countdownSection}>
            <div className={s.countdownLabel}>Sale Ends In:</div>
            <EventCounter eventName="flash-sales" timeEvent="3 23 19 56" />
          </div>
        </div>
      </div>

      {/* Show error message if API call fails */}
      {error && (
        <div className={s.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {/* Show skeleton loader while loading */}
      {loadingTodayProducts && (
        <div className={s.skeletonWrapper}>
          <SkeletonCards numberOfCards={6} />
        </div>
      )}

      {/* Show products slider when data is loaded */}
      {!loadingTodayProducts && !error && products.length > 0 && (
        <div className={s.productsContainer}>
          <ProductsSlider 
            filterFun={filterFlashSalesProducts} 
            loading="lazy" 
            customization={{
              stopHover: false,
              showDiscount: true,
              showFavIcon: true,
              showDetailsIcon: true,
              showRemoveIcon: false,
              showNewText: true,
              showWishList: true,
              showColors: false,
            }}
          />
        </div>
      )}

      {/* Show message when no products found */}
      {!loadingTodayProducts && !error && products.length === 0 && (
        <div className={s.noProducts}>
          <p>Không có sản phẩm flash sale nào.</p>
        </div>
      )}

      <div className={s.actionSection}>
        <Link to="/products" className={s.viewProductsBtn}>
          <span className={s.buttonText}>View All Flash Sales</span>
          <span className={s.buttonIcon}>→</span>
        </Link>
        
        <div className={s.saleInfo}>
          <div className={s.infoItem}>
            <span className={s.infoIcon}>🚚</span>
            <span className={s.infoText}>Free Shipping</span>
          </div>
          <div className={s.infoItem}>
            <span className={s.infoIcon}>🔄</span>
            <span className={s.infoText}>Easy Returns</span>
          </div>
          <div className={s.infoItem}>
            <span className={s.infoIcon}>🛡️</span>
            <span className={s.infoText}>2 Year Warranty</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodaySection;