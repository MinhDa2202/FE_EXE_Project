import { useTranslation } from "react-i18next";
import { useState } from "react";
import IconWithCount from "../../NavTools/IconWithCount/IconWithCount";
import OrderMenuIcon from "../../NavTools/OrderMenuIcon/OrderMenuIcon";
import SearchProductsInput from "../../NavTools/SearchInput/SearchProductsInput";
import UserMenuIcon from "../../NavTools/UserMenuIcon/UserMenuIcon";
import SpinWheel from "../../PopUps/SpinWheel/SpinWheel";
import { useReduxStore } from "../../../../Hooks/App/useReduxStore";
import s from "./NavTools.module.scss";

const NavTools = ({ showHeart = true, showUser = true }) => {
  const { t } = useTranslation();
  const { favoritesProducts, isStoreReady } = useReduxStore();
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);

  const handleSpinWheelOpen = () => {
    setIsSpinWheelOpen(true);
  };

  const handleSpinWheelClose = () => {
    setIsSpinWheelOpen(false);
  };

  const handleSpinComplete = (prize) => {
    console.log('🎉 Spin completed! Prize:', prize);
    // Here you can add logic to apply the discount or show notification
    setTimeout(() => {
      setIsSpinWheelOpen(false);
    }, 2000);
  };

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

          {/* Spin Wheel Game Button */}
          <button
            className={s.gameButton}
            onClick={handleSpinWheelOpen}
            title="🎰 Vòng quay may mắn"
            aria-label="Vòng quay may mắn"
          >
            <span className={s.gameIcon}>🎰</span>
          </button>

          <OrderMenuIcon visibility={showUser} />
          <UserMenuIcon visibility={showUser} />
        </div>
      </div>

      {/* Spin Wheel Modal */}
      <SpinWheel
        isOpen={isSpinWheelOpen}
        onClose={handleSpinWheelClose}
        onSpinComplete={handleSpinComplete}
      />
    </>
  );
};

export default NavTools;
