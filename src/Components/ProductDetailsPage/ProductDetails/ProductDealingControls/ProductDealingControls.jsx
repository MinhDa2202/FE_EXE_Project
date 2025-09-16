import { useNavigate } from "react-router-dom";
import AddToFavButton from "./AddToFavButton/AddToFavButton";
import s from "./ProductDealingControls.module.scss";

const ProductDealingControls = ({ productData, onReportProduct }) => {
  const navigate = useNavigate();

const handleMessageSeller = () => {
  navigate('/chat', {
    state: {
      productData: productData, // ✅ Truyền nguyên object đã được map đúng từ useSingleProduct
      sellerId: productData.sellerId || productData.SellerId,
      sellerName: productData.sellerName || "Người bán"
    }
  });
};

// console.log('productData for chat:', productData);


  const handleCallSeller = () => {
    // Logic để gọi điện cho người bán
    console.log("Call seller clicked");
  };

  const handleShareProduct = () => {
    // Logic để chia sẻ sản phẩm
    if (navigator.share) {
      navigator.share({
        title: productData.Title,
        text: `Xem sản phẩm: ${productData.Title}`,
        url: window.location.href,
      });
    } else {
      // Fallback cho các trình duyệt không hỗ trợ Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Đã copy link sản phẩm!");
    }
  };

  return (
    <section className={s.dealing}>
      <div className={s.primaryActions}>
        <button 
          className={s.messageSellerButton}
          onClick={handleMessageSeller}
        >
          <span className={s.buttonIcon}>💬</span>
          <span className={s.buttonText}>Nhắn tin</span>
        </button>
        
        <button 
          className={s.callSellerButton}
          onClick={handleCallSeller}
        >
          <span className={s.buttonIcon}>📞</span>
          <span className={s.buttonText}>Gọi điện</span>
        </button>
      </div>

      <div className={s.secondaryActions}>
        <AddToFavButton productData={productData} />
        
        <button 
          className={s.shareButton}
          onClick={handleShareProduct}
        >
          <span className={s.buttonIcon}>🔗</span>
          <span className={s.buttonText}>Chia sẻ</span>
        </button>

        <button 
          className={s.reportButton}
          onClick={onReportProduct}
        >
          <span className={s.buttonIcon}>⚠️</span>
          <span className={s.buttonText}>Báo cáo</span>
        </button>
      </div>

      <div className={s.sellerInfo}>
        <div className={s.sellerHeader}>
          <span className={s.sellerIcon}>👤</span>
          <h4>Thông tin người bán</h4>
        </div>
        <div className={s.sellerDetails}>
          <div className={s.sellerItem}>
            <span className={s.sellerLabel}>Tên:</span>
            <span className={s.sellerValue}>
              {productData.sellerName || "Chưa có thông tin"}
            </span>
          </div>
          <div className={s.sellerItem}>
            <span className={s.sellerLabel}>Đánh giá:</span>
            <span className={s.sellerValue}>
              ⭐ {productData.sellerRating || "Chưa có đánh giá"}
            </span>
          </div>
          <div className={s.sellerItem}>
            <span className={s.sellerLabel}>Đã bán:</span>
            <span className={s.sellerValue}>
              {productData.sellerSoldCount || "0"} sản phẩm
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDealingControls;