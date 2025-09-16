import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkDateBeforeMonthToPresent } from "src/Functions/helper";
import s from "./ProductCard.module.scss";
import ProductCardIcons from "./ProductCardIcons/ProductCardIcons";
import ProductCardInfo from "./ProductCardInfo/ProductCardInfo";

const ProductCard = ({
  product,
  customization = {
    stopHover: false,
    showDiscount: true,
    showFavIcon: true,
    showDetailsIcon: true,
    showRemoveIcon: false,
    showNewText: true,
    showWishList: false,
    showColors: false,
  },
  removeFrom,
  loading = "eager",
}) => {
  // Debug: Log received product
  // console.log("ProductCard received product:", product);
  
  // Safe destructuring với fallback values
  const {
    Id: id = null,
    Title: name = "Sản phẩm không có tên",
    Discount: discount = 0,
    ImageUrls: imageUrls = [],
    AddedDate: addedDate = null,
  } = product || {};

  // Debug: Log destructured values
  // console.log("Destructured values:", { id, name, discount, imageUrls, addedDate });

  const {
    stopHover,
    showDiscount,
    showNewText,
    showFavIcon,
    showDetailsIcon,
    showRemoveIcon,
    showWishList,
    showColors,
  } = customization;

  const noHoverClass = stopHover ? s.noHover : "";
  const hideDiscountClass = discount <= 0 ? s.hide : "";
  const hideNewClass = shouldHideNewWord();
  const { loadingProductDetails } = useSelector((state) => state.loading);
  const navigateTo = useNavigate();
  
  const iconsData = {
    showFavIcon,
    showDetailsIcon,
    showRemoveIcon,
    showWishList,
  };

  function shouldHideNewWord() {
    if (!addedDate) return s.hide;
    return checkDateBeforeMonthToPresent(addedDate) ? s.hide : "";
  }
function navigateToProductDetails() {
  if (loadingProductDetails || !id) return;
  
  
  // Sử dụng ID thay vì tên sản phẩm
  navigateTo(`/details?id=${id}`);
}

  // Handle missing or invalid product data
  if (!product || !id) {
    return (
      <div className={`${s.card} ${s.errorCard}`}>
        <div className={s.errorMessage}>
          <p>Lỗi hiển thị sản phẩm</p>
        </div>
      </div>
    );
  }

  // Get image with fallback
  const getProductImage = () => {
    if (imageUrls && imageUrls.length > 0 && typeof imageUrls[0] === 'string' && imageUrls[0].trim() !== '') {
      return imageUrls[0];
    }
    return "/placeholder-image.jpg"; // Fallback image
  };

  return (
    <div className={`${s.card} ${noHoverClass}`} data-product-card>
      <div className={s.productImg}>
        <div className={s.imgHolder}>
          <img
            src={getProductImage()}
            alt={name}
            aria-label={name}
            loading={loading}
            onClick={navigateToProductDetails}
            onError={(e) => {
              // Handle broken image
              e.target.src = "/placeholder-image.jpg";
              e.target.onerror = null; // Prevent infinite loop
            }}
          />
        </div>

        <div className={s.layerContent}>
          {!hideNewClass && showNewText && (
            <div className={s.new}>New</div>
          )}
          
          {!hideDiscountClass && showDiscount && discount > 0 && (
            <div className={s.discount}>-{discount}%</div>
          )}

          <ProductCardIcons
            iconsData={iconsData}
            productId={id}
            navigateToProductDetails={navigateToProductDetails}
            product={product}
            removeFrom={removeFrom}
          />
        </div>
      </div>

      <ProductCardInfo
        product={product}
        showColors={showColors}
        navigateToProductDetails={navigateToProductDetails}
      />
    </div>
  );
};

export default ProductCard;