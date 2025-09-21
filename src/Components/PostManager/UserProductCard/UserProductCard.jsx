import { Link } from "react-router-dom";
import s from "./UserProductCard.module.scss";

const UserProductCard = ({ product, approvalStatus }) => {
  // Format price
  const formatPrice = (price) => {
    if (!price) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Get product image
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0].imageUrl || product.images[0];
    }
    if (product.imageUrl) {
      return product.imageUrl;
    }
    // Return null to show placeholder div instead
    return null;
  };

  return (
    <div className={s.userProductCard}>
      {/* Product Image */}
      <div className={s.imageContainer}>
        {getProductImage() ? (
          <img
            src={getProductImage()}
            alt={product.Title || product.title || "Product"}
            className={s.productImage}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={s.placeholderImage}
          style={{ display: getProductImage() ? "none" : "flex" }}
        >
          <div className={s.placeholderIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="1.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <polyline
                points="21,15 16,10 5,21"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <span className={s.placeholderText}>Không có ảnh</span>
        </div>
        <div className={s.imageOverlay}>
          <Link
            to={`/details?id=${product.Id || product.id}`}
            className={s.viewBtn}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Xem
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className={s.productInfo}>
        <h3 className={s.productTitle}>
          {product.Title || product.title || "Không có tiêu đề"}
        </h3>

        <div className={s.productMeta}>
          <div className={s.price}>
            <span className={s.currentPrice}>
              {formatPrice(product.Price || product.price)}
            </span>
            {product.OriginalPrice &&
              product.OriginalPrice > (product.Price || product.price) && (
                <span className={s.originalPrice}>
                  {formatPrice(product.OriginalPrice)}
                </span>
              )}
          </div>

          {/* Approval Status */}
          <div className={s.approvalStatus}>
            {approvalStatus === "approved" && (
              <span className={s.statusApproved}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Đã duyệt
              </span>
            )}
            {approvalStatus === "pending" && (
              <span className={s.statusPending}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <polyline
                    points="12,6 12,12 16,14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Chờ duyệt
              </span>
            )}
            {approvalStatus === "rejected" && (
              <span className={s.statusRejected}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="15"
                    y1="9"
                    x2="9"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="9"
                    y1="9"
                    x2="15"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Bị từ chối
              </span>
            )}
            {approvalStatus === "unknown" && (
              <span className={s.statusUnknown}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M9.09 9A3 3 0 0 1 12 6A3 3 0 0 1 15.09 9A3 3 0 0 1 12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="17"
                    x2="12.01"
                    y2="17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Không rõ
              </span>
            )}
          </div>
        </div>

        <div className={s.productDetails}>
          <p className={s.condition}>
            <strong>Tình trạng:</strong>{" "}
            {product.Condition || product.condition || "N/A"}
          </p>
          <p className={s.location}>
            <strong>Địa điểm:</strong>{" "}
            {product.Locations || product.location || "N/A"}
          </p>
          <p className={s.date}>
            <strong>Đăng ngày:</strong>{" "}
            {formatDate(product.AddedDate || product.createdAt)}
          </p>
        </div>

        {product.Descriptions && (
          <p className={s.description}>
            {product.Descriptions.length > 100
              ? `${product.Descriptions.substring(0, 100)}...`
              : product.Descriptions}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className={s.actionButtons}>
        <Link
          to={`/details?id=${product.Id || product.id}`}
          className={s.viewDetailBtn}
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default UserProductCard;
