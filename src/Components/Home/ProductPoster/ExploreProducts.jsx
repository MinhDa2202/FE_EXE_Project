import { productsData } from "src/Data/productsData";
import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard";
import s from "./ExploreProducts.module.scss";

const ExploreProducts = ({ numOfProducts = -1, customization, products }) => {
  const productsToDisplay = products || productsData;
  
  // Fix logic filtering - numOfProducts = -1 means show all
  const filteredProducts = numOfProducts === -1 
    ? productsToDisplay 
    : productsToDisplay.slice(0, numOfProducts);

  // Debug logging
  // console.log("ExploreProducts - products to display:", filteredProducts);
  // console.log("ExploreProducts - numOfProducts:", numOfProducts);

  // Handle empty products array
  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className={s.products}>
        <div className={s.noProducts}>
          <p>Không có sản phẩm nào để hiển thị</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.products}>
      {filteredProducts.map((product, index) => {
        // Generate unique key - prioritize product.Id, fallback to index
        const uniqueKey = product?.Id || product?.id || `product-${index}`;
        
        // Debug each product
        // console.log(`Product ${index}:`, product, `Key: ${uniqueKey}`);
        
        return (
          <ProductCard
            product={product}
            key={uniqueKey}
            customization={customization}
          />
        );
      })}
    </div>
  );
};

export default ExploreProducts;