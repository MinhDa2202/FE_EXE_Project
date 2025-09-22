import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard";

const SearchProducts = ({ product }) => {
  // Add safety check for product
  if (!product) {
    return null;
  }

  try {
    return <ProductCard product={product} />;
  } catch (error) {
    console.error('Error rendering ProductCard:', error);
    return <div>Error loading product</div>;
  }
};
export default SearchProducts;
