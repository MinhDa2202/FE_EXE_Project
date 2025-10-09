import { useTranslation } from "react-i18next";
import s from "./BuyButton.module.scss";

const BuyButton = () => {
  const { t } = useTranslation();

  return (
    <button type="button" className={s.buyButton} disabled>
      {t("buttons.buyNow")}
    </button>
  );
};
export default BuyButton;
