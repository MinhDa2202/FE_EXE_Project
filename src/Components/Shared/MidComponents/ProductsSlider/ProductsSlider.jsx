// src/Components/Shared/MidComponents/ProductsSlider/ProductsSlider.jsx
import { useRef } from "react";
import { productsData } from "src/Data/productsData";
import { shouldDisplaySliderButtons } from "src/Functions/conditions";
import useSlider from "src/Hooks/App/useSlider";
import useGetResizeWindow from "src/Hooks/Helper/useGetResizeWindow";
import ProductCard from "../../ProductsCards/ProductCard/ProductCard";
import s from "./ProductsSlider.module.scss";
import SliderButtons from "./SliderButtons/SliderButtons";

const ProductsSlider = ({
  filterFun = () => productsData,
  customization,
  loading,
  products = null, // Thêm prop products để nhận data từ API
}) => {
  // Nếu có products từ API thì dùng, không thì dùng filterFun với productsData
  const filteredProducts = products ? filterFun(products) : filterFun();
  
  const sliderRef = useRef();
  const { handleNextBtn, handlePrevBtn } = useSlider(sliderRef);
  const { windowWidth } = useGetResizeWindow();

  const shouldDisplayButtons = shouldDisplaySliderButtons(
    windowWidth,
    filteredProducts
  );

  // Debug logging
  // console.log("ProductsSlider - filteredProducts:", filteredProducts);

  return (
    <>
      {shouldDisplayButtons && (
        <SliderButtons
          handleNextBtn={handleNextBtn}
          handlePrevBtn={handlePrevBtn}
        />
      )}

      <div className={s.productsSlider} ref={sliderRef} dir="ltr">
        {filteredProducts.map((product, index) => {
          // Generate unique key - prioritize product.Id or product.id
          const uniqueKey = product?.Id || product?.id || `slider-product-${index}`;
          
          return (
            <ProductCard
              product={product}
              key={uniqueKey}
              customization={customization}
              loading={loading}
            />
          );
        })}
      </div>
    </>
  );
};

export default ProductsSlider;