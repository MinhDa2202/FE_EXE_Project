import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import s from "./SignUpButtons.module.scss";

const SignUpButtons = () => {
  const { t } = useTranslation();

  return (
    <div className={s.buttons}>
      <button type="submit" className={s.createAccBtn}>
        {t("buttons.createAccount")}
      </button>

      <p>
        <span>{t("loginSignUpPage.alreadyHaveAcc")}</span>
        <Link to="/login">{t("buttons.login")}</Link>
      </p>
    </div>
  );
};
export default SignUpButtons;