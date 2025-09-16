import ProductCardDetailsIcon from "./ProductCardDetailsIcon";
import ProductCardFavIcon from "./ProductCardFavIcon";
import s from "./ProductCardIcons.module.scss";
import ProductCardRemoveIcon from "./ProductCardRemoveIcon";

const ProductCardIcons = ({
  iconsData: { showFavIcon, showDetailsIcon, showRemoveIcon },
  productId,
  navigateToProductDetails,
  product,
  removeFrom,
}) => {
  return (
    <div className={s.icons} data-product-icons-hover>
      {showFavIcon && (
        <ProductCardFavIcon product={product} productId={productId} />
      )}

      {showDetailsIcon && (
        <ProductCardDetailsIcon
          navigateToProductDetails={navigateToProductDetails}
        />
      )}

      {showRemoveIcon && (
        <ProductCardRemoveIcon productId={productId} removeFrom={removeFrom} />
      )}

    </div>
  );
};
export default ProductCardIcons;
