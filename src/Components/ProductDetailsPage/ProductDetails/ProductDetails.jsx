import { useEffect, useRef, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { updateProductsState } from "src/Features/productsSlice";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import SkeletonProductDetails from "../../Shared/SkeletonLoaders/DetailsPage/SkeletonProductDetails";
import ProductPreview from "../ProductPreview/ProductPreview";
import ProductColorsSection from "./ProductColorsSection/ProductColorsSection";
import AddToFavButton from "./ProductDealingControls/AddToFavButton/AddToFavButton";
import s from "./ProductDetails.module.scss";
import ProductFirstInfos from "./ProductFirstInfos/ProductFirstInfos";
import ProductSizes from "./ProductSizes/ProductSizes";

const ProductDetails = ({
  productData: originalProductData,
  onReportProduct,
}) => {
  if (!originalProductData) return <Navigate to="product-not-found" />;

  const [activeTab, setActiveTab] = useState("description");

  const productData = useMemo(() => {
    return {
      ...originalProductData,
      shortName: originalProductData.Title,
      otherImages: originalProductData.ImageUrls || [],
    };
  }, [originalProductData]);

  const { loadingProductDetails } = useSelector((state) => state.loading);
  const { previewImg, isZoomInPreviewActive } = useSelector(
    (state) => state.global
  );
  const dispatch = useDispatch();
  const zoomInImgRef = useRef();
  const isWebsiteOnline = useOnlineStatus();
  const activeClass = isZoomInPreviewActive ? s.active : "";

  function handleZoomInEffect(e) {
    const imgRect = e.target.getClientRects()[0];
    const xPosition = e.clientX - imgRect.left;
    const yPosition = e.clientY - imgRect.top;
    const positions = `-${xPosition * 2}px, -${yPosition * 2}px`;

    zoomInImgRef.current.style.transform = `translate(${positions})`;
  }

  const handleMessageSeller = () => {
    navigate('/chat', {
      state: {
        productData: productData,
        sellerId: productData.sellerId || productData.SellerId,
        sellerName: productData.sellerName || "Người bán"
      }
    });
  };

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

  useEffect(() => {
    dispatch(
      updateProductsState({ key: "selectedProduct", value: productData })
    );
    if (productData.otherImages && productData.otherImages.length > 0) {
      dispatch(
        updateProductsState({
          key: "previewImg",
          value: productData.otherImages[0],
        })
      );
    }

    // Nếu sản phẩm chưa được duyệt và đang ở tab reviews, chuyển về description
    if (!productData?.isApproved && activeTab === "reviews") {
      setActiveTab("description");
    }
  }, [productData, activeTab]);

  return (
    <>
      {!loadingProductDetails && isWebsiteOnline && (
        <section className={s.detailsSection} id="details-section">
          <div className={s.productLayout}>
            {/* Left: Product Images with Zoom & 360° */}
            <div className={s.productImagesSection}>
              <ProductPreview
                productData={productData}
                handleZoomInEffect={handleZoomInEffect}
              />

              {/* 360° View Button */}
              <div className={s.view360Button}>
                <button className={s.view360Btn}>
                  <span className={s.view360Icon}>🔄</span>
                  <span>Xem 360°</span>
                </button>
              </div>
            </div>

            {/* Right: Product Info & Seller Actions */}
            <div className={s.productInfoSection}>
              <ProductFirstInfos productData={productData} />

              {/* Seller Actions & Info */}
              <div className={s.sellerActions}>
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
              </div>

            </div>
          </div>

          {/* Zoom Preview Overlay */}
          <div className={`${s.zoomInPreview} ${activeClass}`}>
            <img src={previewImg} alt="product preview" ref={zoomInImgRef} />
          </div>

          {/* Product Details Tabs */}
          <div className={s.productTabs}>
            <div className={s.tabButtons}>
              <button
                className={`${s.tabBtn} ${
                  activeTab === "description" ? s.active : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Mô tả chi tiết
              </button>
              {/* Chỉ hiển thị tab reviews cho sản phẩm đã duyệt */}
              {productData?.isApproved && (
                <button
                  className={`${s.tabBtn} ${
                    activeTab === "reviews" ? s.active : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Đánh giá & Bình luận
                </button>
              )}
              <button
                className={`${s.tabBtn} ${
                  activeTab === "specifications" ? s.active : ""
                }`}
                onClick={() => setActiveTab("specifications")}
              >
                Thông số kỹ thuật
              </button>
            </div>

            <div className={s.tabContent}>
              <div className={s.descriptionTab}>
                <ProductColorsSection productData={productData} />
                {productData?.sizes && <ProductSizes productData={productData} />}
              </div>
            </div>
          </div>
        </section>
      )}

      {(loadingProductDetails || !isWebsiteOnline) && (
        <SkeletonProductDetails />
      )}
    </>
  );
};

export default ProductDetails;
