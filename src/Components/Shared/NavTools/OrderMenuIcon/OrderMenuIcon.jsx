import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useToggle from "src/Hooks/Helper/useToggle";
import SvgIcon from "../../MiniComponents/SvgIcon";
import ToolTip from "../../MiniComponents/ToolTip";
import OrderMenu from "../../OrderMenu/OrderMenu";
import s from "./OrderMenuIcon.module.scss";

const OrderMenuIcon = ({ visibility }) => {
  const { t } = useTranslation();
  const [isMenuOrderActive, toggleMenuOrderActive] = useToggle(false);
  const orderContainerRef = useRef();
  const activeClass = isMenuOrderActive ? s.active : "";

  useEffect(() => {
    if (!isMenuOrderActive) return;

    const handleClickOutside = (event) => {
      if (!orderContainerRef?.current || !event?.target) return;
      
      const isOrderIconClicked = orderContainerRef.current.contains(event.target);
      if (isOrderIconClicked) return;

      toggleMenuOrderActive(false);
    };

    document.addEventListener("click", handleClickOutside);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOrderActive, toggleMenuOrderActive]);

  function openMenu() {
    toggleMenuOrderActive(true);
  }

  if (!visibility) return null;

  return (
    <div
      className={`${s.orderContainer} ${activeClass}`}
      onClick={toggleMenuOrderActive}
      onFocus={openMenu}
      aria-label={t("navTools.orderMenu")}
      aria-haspopup="true"
      ref={orderContainerRef}
    >
      <SvgIcon name="bag" />
      <ToolTip bottom="26px" left="50%" content={t("navTools.orderMenu")} />

      <OrderMenu isActive={isMenuOrderActive} toggler={toggleMenuOrderActive} />
    </div>
  );
};

export default OrderMenuIcon;