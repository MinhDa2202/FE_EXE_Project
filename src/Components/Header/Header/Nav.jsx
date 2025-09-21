import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import s from "./Nav.module.scss";

const Nav = () => {
  const { t, i18n } = useTranslation();
  const navDirection = i18n.dir() === "ltr" ? "ltr" : "rtl";
  const { isSignIn } = useSelector((state) => state.user.loginInfo);

  return (
    <nav className={s.nav} dir={navDirection}>
      <ul>
        <li>
          <NavLink to="/">{t("nav.home")}</NavLink>
        </li>

        <li>
          <NavLink to="/products">{t("nav.products", "Products")}</NavLink>
        </li>

        {/* Post Manager - chỉ hiển thị khi đã đăng nhập */}
        {isSignIn && (
          <li>
            <NavLink to="/post-manager">
              {t("nav.postManager", "Post Manager")}
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to="/about">{t("nav.about")}</NavLink>
        </li>

        <li>
          <NavLink to="/contact">{t("nav.contact")}</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
