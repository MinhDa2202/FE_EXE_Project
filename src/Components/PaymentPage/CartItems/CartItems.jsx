import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import s from "./CartItems.module.scss";

const CartItems = ({ items }) => {
  const { t } = useTranslation();

  if (!items || items.length === 0) {
    return (
      <div className={s.emptyCart}>
        <div className={s.emptyIcon}>🛒</div>
        <h3>{t("payment.emptyCart", "Giỏ hàng trống")}</h3>
        <p>{t("payment.emptyCartDesc", "Thêm sản phẩm vào giỏ hàng để tiếp tục thanh toán")}</p>
        <Link to="/products" className={s.shopButton}>
          {t("payment.continueShopping", "Tiếp tục mua sắm")}
        </Link>
      </div>
    );
  }

  return (
    <div className={s.cartItems}>
      <div className={s.sectionHeader}>
        <h2>{t("payment.orderItems", "Sản phẩm trong đơn hàng")}</h2>
        <span className={s.itemCount}>
          {items.length} {t("payment.items", "sản phẩm")}
        </span>
      </div>

      <div className={s.itemsList}>
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const CartItem = ({ item }) => {
  const { t } = useTranslation();
  
  // Safe destructuring with fallback values
  const {
    id,
    name = "Sản phẩm",
    img = "/placeholder-image.jpg",
    price = 0,
    discount = 0,
    quantity = 1,
    afterDiscount,
  } = item || {};

  const finalPrice = afterDiscount || price;
  const subtotal = (finalPrice * quantity).toFixed(2);

  return (
    <div className={s.cartItem}>
      <div className={s.itemImage}>
        <img src={img} alt={name} />
      </div>
      
      <div className={s.itemDetails}>
        <div className={s.itemInfo}>
          <h4 className={s.itemName}>{name}</h4>
          <div className={s.priceInfo}>
            {discount > 0 && (
              <span className={s.originalPrice}>${price}</span>
            )}
            <span className={s.currentPrice}>${finalPrice}</span>
            {discount > 0 && (
              <span className={s.discount}>-{discount}%</span>
            )}
          </div>
        </div>
        
        <div className={s.quantityAndTotal}>
          <div className={s.quantity}>
            <span>{t("payment.quantity", "Số lượng")}: </span>
            <strong>{quantity}</strong>
          </div>
          <div className={s.subtotal}>
            <span>{t("payment.subtotal", "Tạm tính")}: </span>
            <strong>${subtotal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
