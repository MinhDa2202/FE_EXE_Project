import { useDispatch, useSelector } from "react-redux";
import { updateGlobalState } from "src/Features/globalSlice";
import { updateProductsState } from "src/Features/productsSlice";
import PreviewImages from "./ProductImages/PreviewImages";
import s from "./ProductPreview.module.scss";

const ProductPreview = ({ productData, handleZoomInEffect }) => {
  const { previewImg } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const { Title, otherImages } = productData;
  const hasOtherImages = otherImages?.length !== 0 && otherImages;

  function setZoomInPreview(value = false) {
    dispatch(updateGlobalState({ key: "isZoomInPreviewActive", value: value }));
  }

  // Tìm index của ảnh hiện tại - sửa logic
  const currentImageIndex = otherImages?.findIndex(img => img === previewImg);
  const validCurrentIndex = currentImageIndex !== -1 ? currentImageIndex : 0;
  
  // console.log('Current image state:', { 
  //   previewImg, 
  //   currentImageIndex, 
  //   validCurrentIndex, 
  //   otherImages: otherImages?.slice(0, 3) // Log first 3 images for debug
  // });

  // Hàm chuyển đến ảnh trước
  const handlePrevImage = () => {
    // console.log('Prev Image clicked', { hasOtherImages, otherImagesLength: otherImages?.length, validCurrentIndex });
    if (!hasOtherImages || otherImages.length <= 1) return;
    
    const prevIndex = validCurrentIndex > 0 ? validCurrentIndex - 1 : otherImages.length - 1;
    const prevImage = otherImages[prevIndex];
    // console.log('Switching to prev image:', prevImage, 'at index:', prevIndex);
    dispatch(updateGlobalState({ key: "previewImg", value: prevImage }));
  };

  // Hàm chuyển đến ảnh tiếp theo
  const handleNextImage = () => {
    // console.log('Next Image clicked', { hasOtherImages, otherImagesLength: otherImages?.length, validCurrentIndex });
    if (!hasOtherImages || otherImages.length <= 1) return;
    
    const nextIndex = validCurrentIndex < otherImages.length - 1 ? validCurrentIndex + 1 : 0;
    const nextImage = otherImages[nextIndex];
    // console.log('Switching to next image:', nextImage, 'at index:', nextIndex);
    dispatch(updateGlobalState({ key: "previewImg", value: nextImage }));
  };

  return (
    <section className={s.images}>
      {hasOtherImages && <PreviewImages productData={productData} />}

      <div className={s.previewImgHolder}>
        <img
          src={previewImg}
          alt={Title}
          onMouseMove={handleZoomInEffect}
          onMouseEnter={() => setZoomInPreview(true)}
          onMouseLeave={() => setZoomInPreview(false)}
        />
        
        {/* Navigation Buttons cho ảnh chính */}
        {hasOtherImages && otherImages.length > 1 && (
          <>
            <button 
              className={`${s.navButton} ${s.prevButton}`}
              onClick={handlePrevImage}
              aria-label="Ảnh trước"
            >
              ‹
            </button>
            <button 
              className={`${s.navButton} ${s.nextButton}`}
              onClick={handleNextImage}
              aria-label="Ảnh tiếp theo"
            >
              ›
            </button>
          </>
        )}
      </div>
    </section>
  );
};
export default ProductPreview;
