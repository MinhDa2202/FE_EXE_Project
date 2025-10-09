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
          <NavLink to="/">Trang chủ</NavLink>
        </li>

        <li>
          <NavLink to="/products">Sản phẩm</NavLink>
        </li>

        {/* Post Manager - chỉ hiển thị khi đã đăng nhập */}
        {isSignIn && (
          <li>
            <NavLink to="/post-manager">
              Quản lý bài đăng
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to="/about">Về chúng tôi</NavLink>
        </li>

        <li>
          <NavLink to="/contact">Liên hệ</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
