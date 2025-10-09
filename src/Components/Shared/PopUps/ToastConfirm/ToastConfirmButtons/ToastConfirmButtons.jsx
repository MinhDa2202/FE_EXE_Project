import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateAlertState } from "src/Features/alertsSlice";
import s from "./ToastConfirmButtons.module.scss";

const ToastConfirmButtons = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function handleConfirm() {
    closeConfirmToast();
  }

  function closeConfirmToast() {
    dispatch(
      updateAlertState({ key: "isAlertActive", value: false, type: "confirm" })
    );
  }

  return (
    <div className={s.buttons}>
      <button type="button" onClick={handleConfirm}>
        {t("common.confirm")}
      </button>
      <button type="button" onClick={closeConfirmToast}>
        {t("common.cancel")}
      </button>
    </div>
  );
};
export default ToastConfirmButtons;
