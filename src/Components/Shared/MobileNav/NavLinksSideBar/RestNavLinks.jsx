import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getRestMobileNavData } from "src/Data/staticData";
import { camelCase } from "src/Functions/helper";
import { useReduxStore } from "src/Hooks/App/useReduxStore";
import IconWithCountAndLabel from "../../NavTools/IconWithCountAndLabel/IconWithCountAndLabel";

const RestNavLinks = () => {
  const { isMobileMenuActive } = useSelector((state) => state.global);
  const { loginInfo } = useSelector((state) => state.user);
  const { favoritesProducts, orderProducts, wishList, isStoreReady } = useReduxStore();
  const { t } = useTranslation();

  // Don't render until store is ready
  if (!isStoreReady) {
    return null;
  }

  const restMobileNavData = getRestMobileNavData({
    orderProducts,
    favoritesProducts,
    wishList,
  });

  return restMobileNavData.map(
    ({ iconName, routePath, countLength, text, id }) => (
      <li key={"mobile-nav-link-" + id}>
        <IconWithCountAndLabel
          props={{
            iconName: iconName,
            visibility: loginInfo.isSignIn,
            routePath: routePath,
            countLength: countLength,
            text: text === "my order" ? "đơn hàng của tôi" : text === "favorite" ? "yêu thích" : "danh sách yêu thích",
            ariaHidden: !isMobileMenuActive,
            tabIndex: isMobileMenuActive ? 0 : -1,
          }}
        />
      </li>
    )
  );
};

export default RestNavLinks;
