import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProductCard from "../Shared/ProductsCards/ProductCard/ProductCard";
import s from "./ProductsCategory.module.scss";

const ProductsCategory = ({ products, customization }) => {
  const { t } = useTranslation();
  
  
  const hasProducts = products && products.length > 0;

  if (!hasProducts)
    return (
      <div className={s.notFoundMessage}>
        <p>{t("common.weDontHaveProducts")}</p>
        <p>
          {t("common.backTo")} <Link to="/">{t("common.home")}</Link>
        </p>
      </div>
    );

  return (
    <div className={s.products}>
      {products?.map((product) => {
        // Transform product properties from camelCase to PascalCase for ProductCard
        const transformedProduct = {
          ...product,
          Id: product.id,
          Title: product.title,
          Price: product.price,
          Discount: product.discount,
          AfterDiscount: product.afterDiscount,
          ImageUrls: product.imageUrls,
          AddedDate: product.addedDate,
        };

        return (
          <ProductCard
            product={transformedProduct}
            key={product.id}
            customization={customization}
          />
        );
      })}
    </div>
  );
};

export default ProductsCategory;