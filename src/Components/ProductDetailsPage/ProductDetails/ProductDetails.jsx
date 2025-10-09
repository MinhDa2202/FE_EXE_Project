import { useEffect, useRef, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { updateProductsState } from "src/Features/productsSlice";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import SkeletonProductDetails from "../../Shared/SkeletonLoaders/DetailsPage/SkeletonProductDetails";
import ProductPreview from "../ProductPreview/ProductPreview";
import ProductColorsSection from "./ProductColorsSection/ProductColorsSection";
import ProductDealingControls from "./ProductDealingControls/ProductDealingControls";
import ProductReviews from "../ProductReviews/ProductReviews";
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

            {/* Right: Product Info & Quick Actions */}
            <div className={s.productInfoSection}>
              <ProductFirstInfos productData={productData} />
              
              {/* Action Buttons */}
              <div className={s.actionButtons}>
                <button className={s.wishlistBtn}>
                  <span className={s.btnIcon}>❤️</span>
                </button>
              </div>

              {/* Product Highlights */}
              <div className={s.productHighlights}>
                <div className={s.highlightItem}>
                  <span className={s.highlightIcon}>🚚</span>
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className={s.highlightItem}>
                  <span className={s.highlightIcon}>🔄</span>
                  <span>Đổi trả 30 ngày</span>
                </div>
                <div className={s.highlightItem}>
                  <span className={s.highlightIcon}>🛡️</span>
                  <span>Bảo hành chính hãng</span>
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
              {activeTab === "description" && (
                <div className={s.descriptionTab}>
                  <ProductColorsSection productData={productData} />
                  {productData?.sizes && (
                    <ProductSizes productData={productData} />
                  )}
                  <ProductDealingControls
                    productData={productData}
                    onReportProduct={onReportProduct}
                  />
                </div>
              )}

              {/* Chỉ hiển thị nội dung reviews cho sản phẩm đã duyệt */}
              {activeTab === "reviews" && productData?.isApproved && (
                <div className={s.reviewsTab}>
                  <ProductReviews productId={productData?.id} />
                </div>
              )}

              {activeTab === "specifications" && (
                <div className={s.specificationsTab}>
                  <div className={s.specifications}>
                    <h3>Thông số kỹ thuật</h3>
                    <div className={s.specTable}>
                      <div className={s.specRow}>
                        <span className={s.specLabel}>Thương hiệu:</span>
                        <span className={s.specValue}>
                          {productData?.brand || "Đang cập nhật"}
                        </span>
                      </div>
                      <div className={s.specRow}>
                        <span className={s.specLabel}>Danh mục:</span>
                        <span className={s.specValue}>
                          {productData?.category || "Đang cập nhật"}
                        </span>
                      </div>
                      <div className={s.specRow}>
                        <span className={s.specLabel}>Xuất xứ:</span>
                        <span className={s.specValue}>
                          {productData?.origin || "Đang cập nhật"}
                        </span>
                      </div>
                      <div className={s.specRow}>
                        <span className={s.specLabel}>Bảo hành:</span>
                        <span className={s.specValue}>
                          {productData?.warranty || "12 tháng"}
                        </span>
                      </div>
                      <div className={s.specRow}>
                        <span className={s.specLabel}>Trọng lượng:</span>
                        <span className={s.specValue}>
                          {productData?.weight || "Đang cập nhật"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
