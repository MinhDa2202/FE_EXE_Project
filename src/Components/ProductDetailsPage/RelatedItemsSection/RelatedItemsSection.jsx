// src/Components/ProductDetailsPage/RelatedItemsSection/RelatedItemsSection.jsx
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useProducts from "src/Hooks/App/useProducts";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle";
import SkeletonCards from "../../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import s from "./RelatedItemsSection.module.scss";

const RelatedItemsSection = ({ productType, currentProduct }) => {
  const { t } = useTranslation();
  const { products, error } = useProducts("loadingRelatedProducts");
  const { loadingRelatedProducts } = useSelector((state) => state.loading);

  // Filter function cho related items
  const filterRelatedProducts = () => {
    if (!products || products.length === 0) return [];
    
    // Filter by category, exclude current product
    let relatedProducts = products.filter(product => {
      // Skip current product
      if (currentProduct && product.Id === currentProduct.Id) {
        return false;
      }
      
      // Filter by category if available
      if (productType && product.category) {
        return product.category.toLowerCase() === productType.toLowerCase();
      }
      
      return true;
    });
    
    // If no category matches or no category specified, return random products
    if (relatedProducts.length === 0) {
      relatedProducts = products.filter(product => 
        !currentProduct || product.Id !== currentProduct.Id
      );
    }
    
    // Shuffle and limit to 8 products
    const shuffled = relatedProducts.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  };

  const relatedItemsSection = "sectionTitles.relatedItemsSection";

  return (
    <section className={s.relatedItemsSection}>
      <SectionTitle
        eventName={t(`${relatedItemsSection}.title`)}
        sectionName={t(`${relatedItemsSection}.relatedItems`)}
      />

      {/* Show error message if API call fails */}
      {error && (
        <div className={s.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {/* Show skeleton loader while loading */}
      {loadingRelatedProducts && (
        <div className={s.skeletonWrapper}>
          <SkeletonCards numberOfCards={4} />
        </div>
      )}

      {/* Show products slider when data is loaded */}
      {!loadingRelatedProducts && !error && products.length > 0 && (
        <ProductsSlider 
          filterFun={filterRelatedProducts}
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

      {/* Show message when no related products found */}
      {!loadingRelatedProducts && !error && (products.length === 0 || filterRelatedProducts().length === 0) && (
        <div className={s.noProducts}>
          <p>Không tìm thấy sản phẩm liên quan.</p>
        </div>
      )}
    </section>
  );
};

export default RelatedItemsSection;