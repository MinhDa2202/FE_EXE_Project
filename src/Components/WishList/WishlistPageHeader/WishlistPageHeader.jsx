import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import s from "./WishlistPageHeader.module.scss";

const WishlistPageHeader = () => {
  const { wishList } = useSelector((state) => state.products);
  const numberOfWishlist = wishList.length;
  const { t } = useTranslation();

  return (
    <header className={s.header}>
      <p>{t("wishlist", { numberOfWishlist })}</p>
    </header>
  );
};
export default WishlistPageHeader;
