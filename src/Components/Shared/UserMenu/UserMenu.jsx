import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import useSignOut from "src/Hooks/App/useSignOut";
import { useReduxStore } from "src/Hooks/App/useReduxStore";
import SvgIcon from "../MiniComponents/SvgIcon";
import s from "./UserMenu.module.scss";
import UserMenuItemWithCount from "./UserMenuItemWithCount";

const UserMenu = ({ isActive, toggler }) => {
  const { wishList, orderProducts, isStoreReady } = useReduxStore();
  const wishListLength = wishList.length;
  const orderProductsLength = orderProducts.length;
  const activeClass = isActive ? s.active : "";
  const navigateTo = useNavigate();
  const { t } = useTranslation();
  const signOut = useSignOut();

  function handleSignOut() {
    signOut();
    navigateTo("/", { replace: true });
  }

  // Don't render until store is ready
  if (!isStoreReady) {
    return null;
  }

  return (
    <div className={`${s.userMenu} ${activeClass}`}>
      <NavLink to="/profile" aria-label="Profile page">
        <SvgIcon name="user" />
        <span>{t("userMenuItems.profile")}</span>
      </NavLink>

      <NavLink to="/order" aria-label="Order page">
        <UserMenuItemWithCount
          props={{
            iconName: "bag",
            title: t("accountPage.accountMenuSection.myOrders"),
            countLength: orderProductsLength,
          }}
        />
      </NavLink>

      <NavLink to="/my-reports" aria-label="My Reports page">
        <SvgIcon name="exclamation" />
        <span>{t("userMenuItems.my_reports")}</span>
      </NavLink>

      <NavLink to="/reviews" aria-label="Reviews page">
        <SvgIcon name="solidStar" />
        <span>{t("userMenuItems.reviews")}</span>
      </NavLink>

      <NavLink to="/wishlist" aria-label="Wishlist page">
        <UserMenuItemWithCount
          props={{
            iconName: "save",
            title: t("userMenuItems.wishlist"),
            countLength: wishListLength,
          }}
        />
      </NavLink>

      <a href="#" onClick={handleSignOut} onBlur={toggler} aria-label="Logout">
        <SvgIcon name="boxArrowLeft" />
        <span>{t("userMenuItems.logout")}</span>
      </a>
    </div>
  );
};
export default UserMenu;
