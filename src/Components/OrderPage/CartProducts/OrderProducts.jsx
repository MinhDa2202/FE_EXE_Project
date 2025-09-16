import { useTranslation } from "react-i18next";
import { useReduxStore } from "src/Hooks/App/useReduxStore";
import OrderProduct from "./OrderProduct";
import s from "./OrderProducts.module.scss";

const OrderProducts = () => {
  const { t } = useTranslation();
  const { orderProducts, isStoreReady } = useReduxStore();
  const productsTable = "cartPage.productsTable";

  // Don't render until store is ready
  if (!isStoreReady) {
    return null;
  }

  return (
    <table className={s.orderProducts}>
      <thead>
        <tr>
          <th>{t(`${productsTable}.product`)}</th>
          <th>{t(`${productsTable}.price`)}</th>
          <th>{t(`${productsTable}.quantity`)}</th>
          <th>{t(`${productsTable}.subtotal`)}</th>
        </tr>
      </thead>

      <tbody>
        {orderProducts.map((product) => (
          <OrderProduct key={product.id} data={product} />
        ))}
      </tbody>
    </table>
  );
};
export default OrderProducts;
