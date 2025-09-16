import { productCardCustomizations } from "src/Data/staticData";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import { useReduxStore } from "src/Hooks/App/useReduxStore";
import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard";
import s from "./WishProducts.module.scss";

const WishProducts = () => {
  const { wishList, isStoreReady } = useReduxStore();
  useScrollOnMount(160);

  // Don't render until store is ready
  if (!isStoreReady) {
    return null;
  }

  return (
    <div className={s.wishProducts}>
      {wishList.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          customization={productCardCustomizations.wishListProducts}
          removeFrom="wishList"
        />
      ))}
    </div>
  );
};
export default WishProducts;
