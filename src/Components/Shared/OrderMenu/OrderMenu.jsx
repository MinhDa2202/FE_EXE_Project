import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import SvgIcon from "../MiniComponents/SvgIcon";
import s from "./OrderMenu.module.scss";

const OrderMenu = ({ isActive }) => {
  const activeClass = isActive ? s.active : "";
  const { t } = useTranslation();

  return (
    <div className={`${s.orderMenu} ${activeClass}`}>
      <NavLink to="/don-mua" aria-label="Đơn mua page">
        <SvgIcon name="bag" />
        <span>{t("orderMenuItems.donMua")}</span>
      </NavLink>

      <NavLink to="/don-ban" aria-label="Đơn bán page">
        <SvgIcon name="bag" />
        <span>{t("orderMenuItems.donBan")}</span>
      </NavLink>
    </div>
  );
};
export default OrderMenu;