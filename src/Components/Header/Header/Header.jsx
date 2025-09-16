import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
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

  const handleAddProduct = () => {
    dispatch(openAddProductModal());
  };

  return (
    <header className={s.header} dir="ltr">
      <div className={s.container}>
        <h1 className={s.brand}>
          <Link to="/" aria-label={WEBSITE_NAME} className={s.brandLink}>
            <img src={brandLogo} alt={WEBSITE_NAME} className={s.brandLogo} />
          </Link>
        </h1>

        <div className={s.headerContent}>
          <Nav />

          <div className={s.rightActions}>
            {/* Search + icons first to match desired layout */}
            <NavTools {...navToolsProps} />

            {/* AI Assistant button */}
            <button
              type="button"
              className={s.aiButton}
              onClick={() => window.dispatchEvent(new Event("chat:toggle"))}
            >
              <span className={s.aiIcon}>🐱‍👤</span>
              {t("nav.aiAssistant", "Trợ lý AI")}
              <span className={s.caret}>▾</span>
            </button>

            {/* Add Product */}
            <button
              className={s.addButton}
              onClick={handleAddProduct}
              type="button"
            >
              <span className={s.addIcon}>+</span>
              {t("products.addProduct", "Add Product")}
            </button>

            {/* Auth Buttons */}
            <Link to="/login" className={authStyles.loginLink}>
              {t("nav.logIn", "Log In")}
            </Link>
            <Link to="/signup" className={authStyles.signUpLink}>
              {t("nav.signUp", "Sign Up")}
            </Link>

          </div>
        </div>

        <MobileNavIcon />
      </div>
    </header>
  );
};

export default Header;
