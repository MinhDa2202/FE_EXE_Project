import { useTranslation } from "react-i18next";
import MyProfileInputs from "../EditProfileFormInputs/MyProfileInputs";
import ChangePasswordForm from "../EditProfileFormInputs/ChangePasswordForm";
import s from "./EditProfileForm.module.scss";

const EditProfileForm = ({ activeTab = 'profile' }) => {
  const { t } = useTranslation();

  const renderContent = () => {
    switch (activeTab) {
      case 'password':
        return (
          <form>
            <h2>Change Password</h2>
            <ChangePasswordForm />
          </form>
        );
      case 'profile':
      default:
        return (
          <div>
            <h2>{t("accountPage.editProfile")}</h2>
            <MyProfileInputs />
          </div>
        );
    }
  };

  return (
    <div className={s.profileForm}>
      {renderContent()}
    </div>
  );
};
export default EditProfileForm;
