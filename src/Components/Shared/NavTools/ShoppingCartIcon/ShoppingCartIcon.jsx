import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useReduxStore } from "src/Hooks/App/useReduxStore";
import SvgIcon from "../../MiniComponents/SvgIcon";
import ToolTip from "../../MiniComponents/ToolTip";
import s from "./ShoppingCartIcon.module.scss";

const ShoppingCartIcon = ({ visibility }) => {
  const { t } = useTranslation();
  const { orderProducts, isStoreReady } = useReduxStore();
  const { loginInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  console.log("ShoppingCartIcon - Render check:", {
    visibility,
    isStoreReady,
    orderProductsLength: orderProducts?.length || 0,
    willRender: isStoreReady && visibility,
  });

  // Don't render until Redux store is ready
  if (!isStoreReady || !visibility) {
    console.log("ShoppingCartIcon - Not rendering:", {
      isStoreReady,
      visibility,
    });
    return null;
  }

  const itemCount = orderProducts.length;
  const displayCount = itemCount > 99 ? "99+" : itemCount;

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("ShoppingCartIcon - Cart clicked:", {
      isSignIn: loginInfo.isSignIn,
      hasToken: !!loginInfo.token,
      itemCount,
      targetPath: "/payment",
      event: e,
    });

    // Use navigate instead of Link
    navigate("/payment");
  };

  const handleMouseDown = (e) => {
    console.log("ShoppingCartIcon - Mouse down event");
  };

  const handleMouseUp = (e) => {
    console.log("ShoppingCartIcon - Mouse up event");
  };

  return (
    <button
      type="button"
      className={s.cartContainer}
      aria-label={t("navTools.shoppingCart", "Shopping Cart")}
      title={t("navTools.shoppingCart", "Shopping Cart")}
      onClick={handleCartClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        pointerEvents: "auto",
        zIndex: 9999,
        position: "relative",
        background: "rgba(255,0,0,0.1)", // Temporary red background to see the button
      }}
    >
      <div className={s.iconWrapper}>
        <SvgIcon name="bag" />
        {itemCount > 0 && <span className={s.itemCount}>{displayCount}</span>}
      </div>

      <ToolTip
        bottom="26px"
        left="50%"
        content={t("navTools.shoppingCart", "Giỏ hàng")}
      />
    </button>
  );
};

export default ShoppingCartIcon;
