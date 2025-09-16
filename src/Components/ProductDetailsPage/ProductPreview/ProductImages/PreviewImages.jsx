import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { updateGlobalState } from "src/Features/globalSlice";
import s from "./PreviewImages.module.scss";
import ProductImages from "./ProductImages";

const PreviewImages = ({ productData }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (productData && productData.otherImages && productData.otherImages.length > 0) {
      setPreviewImg(productData.otherImages[0], dispatch);
    }
  }, [productData, dispatch]);

  // Kiểm tra khả năng scroll
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const canLeft = scrollLeft > 5;
      const canRight = scrollLeft < scrollWidth - clientWidth - 5;
      
      // console.log('Scroll check:', { scrollLeft, scrollWidth, clientWidth, canLeft, canRight });
      
      setCanScrollLeft(canLeft);
      setCanScrollRight(canRight);
    }
  };

  useEffect(() => {
    // Delay để đảm bảo DOM đã render xong
    const timer = setTimeout(() => {
      checkScrollability();
    }, 200); // Tăng delay lên 200ms
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      // Thêm resize listener để update khi window resize
      window.addEventListener('resize', checkScrollability);
      
      // Force check sau khi images load
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        if (img.complete) {
          checkScrollability();
        } else {
          img.addEventListener('load', checkScrollability);
        }
      });
      
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
        images.forEach(img => {
          img.removeEventListener('load', checkScrollability);
        });
        clearTimeout(timer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [productData?.otherImages]);

  // Hàm scroll thumbnails sang trái
  const scrollLeft = () => {
    // console.log('🔥 Scroll Left clicked!');
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // console.log('Container before scroll:', {
      //   scrollLeft: container.scrollLeft,
      //   scrollWidth: container.scrollWidth,
      //   clientWidth: container.clientWidth
      // });
      
      container.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
      
      // Update scroll state sau khi scroll
      setTimeout(() => {
        // console.log('Container after scroll:', {
        //   scrollLeft: container.scrollLeft,
        //   scrollWidth: container.scrollWidth,
        //   clientWidth: container.clientWidth
        // });
        checkScrollability();
      }, 300);
    }
  };

  // Hàm scroll thumbnails sang phải
  const scrollRight = () => {
    // console.log('🔥 Scroll Right clicked!');
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // console.log('Container before scroll:', {
      //   scrollLeft: container.scrollLeft,
      //   scrollWidth: container.scrollWidth,
      //   clientWidth: container.clientWidth
      // });
      
      container.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
      
      // Update scroll state sau khi scroll
      setTimeout(() => {
        // console.log('Container after scroll:', {
        //   scrollLeft: container.scrollLeft,
        //   scrollWidth: container.scrollWidth,
        //   clientWidth: container.clientWidth
        // });
        checkScrollability();
      }, 300);
    }
  };

  const hasMultipleImages = productData?.otherImages?.length > 1;
  const hasEnoughImagesToScroll = productData?.otherImages?.length > 1; // Hiện buttons khi có nhiều hơn 1 ảnh

  // console.log('PreviewImages render:', {
  //   hasMultipleImages,
  //   hasEnoughImagesToScroll,
  //   imagesCount: productData?.otherImages?.length,
  //   canScrollLeft,
  //   canScrollRight
  // });

  return (
    <div className={s.thumbnailContainer}>
      {/* Nút scroll trái */}
      {hasEnoughImagesToScroll && (
        <button 
          className={s.thumbnailNavButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollLeft();
          }}
          disabled={!canScrollLeft}
          aria-label="Cuộn thumbnails sang trái"
        >
          ‹
        </button>
      )}
      
      <div 
        className={s.otherImages}
        ref={scrollContainerRef}
        onScroll={checkScrollability}
      >
        {productData?.otherImages?.map((img, i) => (
          <ProductImages key={i} img={img} productData={productData} index={i} />
        ))}
      </div>
      
      {/* Nút scroll phải */}
      {hasEnoughImagesToScroll && (
        <button 
          className={s.thumbnailNavButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollRight();
          }}
          disabled={!canScrollRight}
          aria-label="Cuộn thumbnails sang phải"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default PreviewImages;

export function setPreviewImg(img, dispatch) {
  dispatch(updateGlobalState({ key: "previewImg", value: img }));
}
