import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { WEBSITE_NAME } from "src/Data/constants";
import brandLogo from "src/Assets/Images/brand-logo.png";
import useNavToolsProps from "src/Hooks/App/useNavToolsProps";
import NavTools from "../../Shared/MidComponents/NavTools/NavTools";
import s from "./Header.module.scss";
import authStyles from "./Nav.module.scss";
import MobileNavIcon from "./MobileNavIcon";
import Nav from "./Nav";
import { openAddProductModal } from "src/Features/uiSlice";

const Header = () => {
  const navToolsProps = useNavToolsProps();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isSignIn } = useSelector((state) => state.user.loginInfo);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddProduct = () => {
    dispatch(openAddProductModal());
  };

  return (
    <header className={`${s.header} ${isScrolled ? s.scrolled : ""}`} dir="ltr">
      <div className={s.container}>
        {/* Logo Section */}
        <div className={s.logoSection}>
          <Link to="/" aria-label={WEBSITE_NAME} className={s.brandLink}>
            <img src={brandLogo} alt={WEBSITE_NAME} className={s.brandLogo} />
          </Link>
        </div>

        {/* Navigation Section */}
        <div className={s.navSection}>
          <Nav />
        </div>

        {/* Search Section */}
        <div className={s.searchSection}>
          <NavTools {...navToolsProps} />
        </div>

        {/* Main Action Buttons Section - Search, Add Product, AI */}
        <div className={s.mainActionsSection}>
          {/* Add Product Button */}
          <button
            className={s.addButton}
            onClick={handleAddProduct}
            type="button"
            title="Thêm sản phẩm"
          >
            <span className={s.addIcon}>+</span>
            <span className={s.addText}>
              Thêm sản phẩm
            </span>
          </button>

          {/* AI Assistant button */}
          <button
            type="button"
            className={s.aiButton}
            onClick={() => window.dispatchEvent(new Event("chat:toggle"))}
            title="Trợ lý AI"
          >
            <span className={s.aiIcon}>🤖</span>
            <span className={s.aiText}>AI</span>
          </button>
        </div>

        {/* Auth Actions Section */}
        <div className={s.actionsSection}>
          {/* Auth Buttons */}
          {!isSignIn && (
            <>
              <Link to="/login" className={authStyles.loginLink}>
                Đăng nhập
              </Link>
              <Link to="/signup" className={authStyles.signUpLink}>
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Icon */}
        <MobileNavIcon />
      </div>
    </header>
  );
};

export default Header;
