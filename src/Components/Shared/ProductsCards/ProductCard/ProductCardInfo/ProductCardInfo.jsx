import { useTranslation } from "react-i18next";
import RateStars from "../../../MidComponents/RateStars/RateStars";
import ProductColors from "../../../MiniComponents/ProductColors/ProductColors";
import s from "./ProductCardInfo.module.scss";

const ProductCardInfo = ({ product, showColors, navigateToProductDetails }) => {
  // Safe destructuring với fallback values
  const {
    Title: shortName = "Sản phẩm không có tên",
    Price: price = 0,
    Discount: discount = 0,
    AfterDiscount: afterDiscount = 0,
    Rate: rate = 0,
    Votes: votes = 0,
    Colors: colors = [],
    Condition: condition,
    Locations: location = "",
    AddedDate: addedDate = null,
  } = product || {};

  const { t } = useTranslation();

  // Handle translation với fallback
  const translatedProductName = shortName ? t(shortName) : "Sản phẩm";

  // Format price display for Vietnamese currency
  const formatPrice = (priceValue) => {
    if (!priceValue || priceValue === 0) return "0";
    return new Intl.NumberFormat("vi-VN").format(parseFloat(priceValue));
  };

  // Get condition display text, class and icon - synchronized with ProductDetails
  const getConditionInfo = (condition) => {
    if (!condition) return { text: "Không rõ", class: "default", icon: "❓" };

    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("mới") || conditionLower.includes("new")) {
      return { text: condition, class: "new", icon: "✨" };
    } else if (
      conditionLower.includes("tốt") ||
      conditionLower.includes("good")
    ) {
      return { text: condition, class: "good", icon: "👍" };
    } else if (
      conditionLower.includes("khá") ||
      conditionLower.includes("fair")
    ) {
      return { text: condition, class: "fair", icon: "⚠️" };
    } else if (
      conditionLower.includes("cũ") ||
      conditionLower.includes("old")
    ) {
      return { text: condition, class: "old", icon: "🔄" };
    }
    return { text: condition, class: "default", icon: "📦" };
  };

  const conditionInfo = getConditionInfo(condition);

  // Check if item is recently added (within 7 days)
  const isRecentlyAdded = () => {
    if (!addedDate) return false;
    const now = new Date();
    const added = new Date(addedDate);
    const diffTime = Math.abs(now - added);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <section className={s.productInfo}>
      <strong className={s.productName}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigateToProductDetails();
          }}
        >
          {translatedProductName}
        </a>
      </strong>

      <div className={s.price}>
        <span className={s.currentPrice}>
          {formatPrice(afterDiscount || price)}₫
        </span>
        {discount > 0 && price > afterDiscount && (
          <del className={s.originalPrice}>{formatPrice(price)}₫</del>
        )}
      </div>

      <div className={s.metaInfo}>
        {condition && (
          <div className={`${s.conditionBadge} ${s[conditionInfo.class]}`}>
            <span className={s.conditionIcon}>{conditionInfo.icon}</span>
            <span>{conditionInfo.text}</span>
          </div>
        )}

        {isRecentlyAdded() && (
          <div className={`${s.conditionBadge} ${s.new}`}>
            <span className={s.conditionIcon}>✨</span>
            <span>Mới đăng</span>
          </div>
        )}
      </div>

      {location && <div className={s.locationInfo}>{location}</div>}

      <div className={s.rateContainer}>
        <RateStars rate={rate || 0} />
        <span className={s.numOfVotes}>({votes || 0} đánh giá)</span>
      </div>

      {showColors && colors && colors.length > 0 && (
        <div className={s.colors}>
          <ProductColors colors={colors} />
        </div>
      )}
    </section>
  );
};

export default ProductCardInfo;
