import { useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { updateProductsState } from "src/Features/productsSlice";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import SkeletonProductDetails from "../../Shared/SkeletonLoaders/DetailsPage/SkeletonProductDetails";
import ProductPreview from "../ProductPreview/ProductPreview";
import ProductColorsSection from "./ProductColorsSection/ProductColorsSection";
import ProductDealingControls from "./ProductDealingControls/ProductDealingControls";
import s from "./ProductDetails.module.scss";
import ProductFirstInfos from "./ProductFirstInfos/ProductFirstInfos";
import ProductSizes from "./ProductSizes/ProductSizes";

const ProductDetails = ({ productData: originalProductData, onReportProduct }) => {
  if (!originalProductData) return <Navigate to="product-not-found" />;

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
      dispatch(updateProductsState({ key: "previewImg", value: productData.otherImages[0] }));
    }
  }, [productData]);

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
              
              {/* Quick Buy Section */}
              <div className={s.quickBuySection}>
                <div className={s.quantitySelector}>
                  <label>Số lượng:</label>
                  <div className={s.quantityControls}>
                    <button className={s.quantityBtn}>-</button>
                    <input type="number" value="1" min="1" className={s.quantityInput} />
                    <button className={s.quantityBtn}>+</button>
                  </div>
                </div>
                
                <div className={s.actionButtons}>
                  <button className={s.quickBuyBtn}>
                    <span className={s.btnIcon}>⚡</span>
                    Mua ngay
                  </button>
                  <button className={s.addToCartBtn}>
                    <span className={s.btnIcon}>🛒</span>
                    Thêm vào giỏ
                  </button>
                  <button className={s.wishlistBtn}>
                    <span className={s.btnIcon}>❤️</span>
                  </button>
                </div>
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
              <button className={`${s.tabBtn} ${s.active}`}>Mô tả chi tiết</button>
              <button className={s.tabBtn}>Đánh giá khách hàng</button>
              <button className={s.tabBtn}>Thông số kỹ thuật</button>
            </div>
            
            <div className={s.tabContent}>
              <div className={s.descriptionTab}>
                <ProductColorsSection productData={productData} />
                {productData?.sizes && <ProductSizes productData={productData} />}
                <ProductDealingControls productData={productData} onReportProduct={onReportProduct} />
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