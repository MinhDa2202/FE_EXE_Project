import { useTranslation } from "react-i18next";
import RateStars from "../../../Shared/MidComponents/RateStars/RateStars";
import s from "./ProductFirstInfos.module.scss";

const ProductFirstInfos = ({ productData }) => {
  const { Title, Price, votes, rate, condition, location, AddedDate } =
    productData;
  const { t } = useTranslation();

  // Hàm xác định màu sắc và style cho condition
  const getConditionStyle = (condition) => {
    if (!condition) return { className: s.conditionDefault, icon: "❓" };
    
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("mới") || conditionLower.includes("new")) {
      return { className: s.conditionNew, icon: "✨" };
    } else if (conditionLower.includes("tốt") || conditionLower.includes("good")) {
      return { className: s.conditionGood, icon: "👍" };
    } else if (conditionLower.includes("khá") || conditionLower.includes("fair")) {
      return { className: s.conditionFair, icon: "⚠️" };
    } else if (conditionLower.includes("cũ") || conditionLower.includes("old")) {
      return { className: s.conditionOld, icon: "🔄" };
    }
    return { className: s.conditionDefault, icon: "📦" };
  };

  const conditionStyle = getConditionStyle(condition);

  return (
    <section className={s.firstInfos}>
      <div className={s.titleSection}>
        <h1 className={s.productName}>{Title}</h1>
        {condition && (
          <div className={`${s.conditionBadge} ${conditionStyle.className}`}>
            <span className={s.conditionIcon}>{conditionStyle.icon}</span>
            <span className={s.conditionText}>{condition}</span>
          </div>
        )}
      </div>

      <div className={s.rateAndReviews}>
        <div className={s.ratingSection}>
          <RateStars rate={rate} />
          <span className={s.reviews}>{t("detailsPage.reviews", { votes })}</span>
        </div>

        <div className={s.verticalLine} />

        <div className={s.stockStatus}>
          <span className={s.stockIcon}>✅</span>
          <span className={s.greenText}>{t("detailsPage.inStock")}</span>
        </div>
      </div>

      <div className={s.priceSection}>
        <span className={s.priceLabel}>Giá:</span>
        <span className={s.price} aria-label={`Price: ${Price}`}>
          {Price && !isNaN(parseFloat(Price))
            ? parseFloat(Price).toLocaleString("vi-VN", {
                useGrouping: true,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) + " đ"
            : "Liên hệ"}
        </span>
      </div>

      <div className={s.metaInfo}>
        <div className={s.metaItem}>
          <span className={s.metaIcon}>📍</span>
          <div className={s.metaContent}>
            <span className={s.metaLabel}>Địa chỉ:</span>
            <span className={s.metaValue}>
              {location || "Chưa có thông tin"}
            </span>
          </div>
        </div>

        {AddedDate && (
          <div className={s.metaItem}>
            <span className={s.metaIcon}>🕐</span>
            <div className={s.metaContent}>
              <span className={s.metaLabel}>Thời gian tạo:</span>
              <span className={s.metaValue}>
                {new Date(AddedDate).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductFirstInfos;