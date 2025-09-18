import { useTranslation } from "react-i18next";
import IconWithCount from "../../NavTools/IconWithCount/IconWithCount";
import OrderMenuIcon from "../../NavTools/OrderMenuIcon/OrderMenuIcon";
import SearchProductsInput from "../../NavTools/SearchInput/SearchProductsInput";
import UserMenuIcon from "../../NavTools/UserMenuIcon/UserMenuIcon";
import { useReduxStore } from "../../../../Hooks/App/useReduxStore";
import s from "./NavTools.module.scss";

const NavTools = ({ showHeart = true, showUser = true }) => {
  const { t } = useTranslation();
  const { favoritesProducts, isStoreReady } = useReduxStore();

  // Don't render until Redux store is ready
  if (!isStoreReady) {
    return null;
  }

  return (
    <>
      <div className={s.navTools}>
        <SearchProductsInput />

        <div className={s.tools}>
          <IconWithCount
            props={{
              visibility: showHeart,
              iconName: "heart",
              routePath: "/favorites",
              countLength: favoritesProducts.length,
              title: t("navTools.favorite"),
            }}
          />



          <OrderMenuIcon visibility={showUser} />
          <UserMenuIcon visibility={showUser} />
        </div>
      </div>


    </>
  );
};

export default NavTools;
