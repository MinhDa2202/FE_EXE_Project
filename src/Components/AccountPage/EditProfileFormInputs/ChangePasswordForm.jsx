import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/Features/alertsSlice";
import { changePassword } from "src/Functions/apiFunctions";
import EditProfileInput from "./EditProfileInput";
import s from "./EditProfileInputs.module.scss";

const ChangePasswordForm = ({ onSubmit }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loginInfo } = useSelector((state) => state.user);
  const { token } = loginInfo;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (newPassword !== confirmPassword) {
      dispatch(showAlert({
        alertText: "New password and confirm password do not match",
        alertState: "error",
        alertType: "alert"
      }));
      return;
    }

    if (newPassword.length < 6) {
      dispatch(showAlert({
        alertText: "New password must be at least 6 characters long",
        alertState: "error",
        alertType: "alert"
      }));
      return;
    }

    setIsLoading(true);

    try {
      const passwordData = {
        OldPassword: oldPassword,
        NewPassword: newPassword
      };

      // Get token from Redux state
      if (!token) {
        throw new Error('No authentication token found');
      }
      const result = await changePassword(passwordData, token);

      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Show success message
      dispatch(showAlert({
        alertText: "Password changed successfully",
        alertState: "success",
        alertType: "alert"
      }));

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error) {
      console.error('Password change error:', error);
      dispatch(showAlert({
        alertText: error.message || "Failed to change password",
        alertState: "error",
        alertType: "alert"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={s.inputs}>
      <section className={s.passwordInputs}>
        <EditProfileInput
          inputData={{
            type: "password",
            label: t("inputsLabels.passwordChanges"),
            name: "oldPassword",
            value: oldPassword,
            setValue: setOldPassword,
            placeholder: t("inputsPlaceholders.currentPass"),
            required: true,
          }}
        />

        <EditProfileInput
          inputData={{
            type: "password",
            label: "New Password",
            name: "newPassword",
            value: newPassword,
            setValue: setNewPassword,
            placeholder: t("inputsPlaceholders.newPass"),
            required: true,
          }}
        />

        <EditProfileInput
          inputData={{
            type: "password",
            label: "Confirm New Password",
            name: "confirmPassword",
            value: confirmPassword,
            setValue: setConfirmPassword,
            placeholder: t("inputsPlaceholders.confirmPass"),
            required: true,
          }}
        />
      </section>

      <div className={s.buttonContainer}>
        <button
          type="submit"
          disabled={isLoading}
          className={s.submitButton}
          onClick={handleSubmit}
        >
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </button>
      </div>
    </section>
  );
};
export default ChangePasswordForm;