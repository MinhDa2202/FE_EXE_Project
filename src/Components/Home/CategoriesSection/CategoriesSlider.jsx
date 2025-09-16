import { useEffect, useRef, useState } from "react";
import useSlider from "src/Hooks/App/useSlider";
import SliderButtons from "../../Shared/MidComponents/ProductsSlider/SliderButtons/SliderButtons";
import CategoryCard from "../../Shared/ProductsCards/CategoryCard/CategoryCard";
import s from "./CategoriesSlider.module.scss";

const CategoriesSlider = () => {
  const sliderRef = useRef();
  const { handleNextBtn, handlePrevBtn } = useSlider(sliderRef);
  const [categories, setCategories] = useState([]);

  const categoryToIconMap = {
    Phone: "mobile",
    Laptop: "computer",
    SmartWatch: "smartWatch",
    Camera: "camera",
    HeadPhones: "headphone",
    Gaming: "gamepad",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://localhost:7235/api/Category");
        const data = await response.json();
        const combinedData = data.map((category) => {
          const iconName = categoryToIconMap[category.name] || "questionMark";
          return { ...category, iconName };
        });
        setCategories(combinedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <SliderButtons
        handlePrevBtn={handlePrevBtn}
        handleNextBtn={handleNextBtn}
      />

      <div className={s.categoriesSlider} ref={sliderRef}>
        {categories.map((categoryData) => (
          <CategoryCard categoryData={categoryData} key={categoryData.id} />
        ))}
      </div>
    </>
  );
};
export default CategoriesSlider;
