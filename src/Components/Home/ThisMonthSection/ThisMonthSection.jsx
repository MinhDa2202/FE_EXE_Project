// src/Components/Home/ThisMonthSection/ThisMonthSection.jsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useProducts from "src/Hooks/App/useProducts";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle";
import SkeletonCards from "../../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import s from "./ThisMonthSection.module.scss";

const ThisMonthSection = () => {
  const { t } = useTranslation();
  const thisMonthSection = "sectionTitles.thisMonthSection";
  const { products, error } = useProducts("loadingThisMonthProducts");
  const { loadingThisMonthProducts } = useSelector((state) => state.loading);

  // Filter function cho best selling - products có sold > 1000
  const filterThisMonthProducts = () => {
    return products.filter((product) => product.sold > 1000);
  };

  return (
    <section className={s.thisMonthSection}>
      <div className={s.wrapper}>
        <SectionTitle
          eventName={t(`${thisMonthSection}.title`)}
          sectionName={t(`${thisMonthSection}.bestSelling`)}
        />

        <Link to="/products" className={s.viewAllBtn}>
          {t("buttons.viewAll")}
        </Link>
      </div>

      {/* Show error message if API call fails */}
      {error && (
        <div className={s.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {/* Show skeleton loader while loading */}
      {loadingThisMonthProducts && (
        <div className={s.skeletonWrapper}>
          <SkeletonCards numberOfCards={6} />
        </div>
      )}

      {/* Show products slider when data is loaded */}
      {!loadingThisMonthProducts && !error && products.length > 0 && (
        <ProductsSlider 
          filterFun={filterThisMonthProducts} 
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
      )}

      {/* Show message when no products found */}
      {!loadingThisMonthProducts && !error && products.length === 0 && (
        <div className={s.noProducts}>
          <p>Không có sản phẩm best selling nào.</p>
        </div>
      )}
    </section>
  );
};

export default ThisMonthSection;