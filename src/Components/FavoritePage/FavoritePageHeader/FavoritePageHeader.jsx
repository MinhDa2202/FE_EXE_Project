import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import s from "./FavoritePageHeader.module.scss";

const FavoritePageHeader = () => {
  const { favoritesProducts } = useSelector(
    (state) => state.products
  );
  const { t } = useTranslation();
  const numberOfProducts = favoritesProducts.length;
  const labelTrans = t("favoritePage.title", { numberOfProducts });

  return (
    <header className={s.header}>
      <p>{labelTrans}</p>
    </header>
  );
};
export default FavoritePageHeader;
