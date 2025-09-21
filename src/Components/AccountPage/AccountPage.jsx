import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { WEBSITE_NAME } from "src/Data/constants";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import AccountMenuSection from "./AccountMenuSection/AccountMenuSection";
import s from "./AccountPage.module.scss";
import EditProfileForm from "./EditProfileForm/EditProfileForm";

const AccountPage = () => {
  const { loginInfo } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const location = useLocation();

  useScrollOnMount();

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/password')) {
      return 'password';
    }
    return 'profile';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <Helmet>
        <title>Profile</title>
        <meta
          name="description"
          content={`Update your personal information easily on ${WEBSITE_NAME}. Manage your account details, shipping addresses, and preferences for a personalized shopping experience.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.accountPage} id="account-page">
          <div className={s.wrapper}>
            <PagesHistory history={["/", t("nav.profile")]} />

            <p className={s.welcomeMessage}>
              {t("common.welcome")}
              {"! "}
              <Link to="/profile">{loginInfo.username}</Link>
            </p>
          </div>

          <div className={s.accountPageContent}>
            <AccountMenuSection />
            <EditProfileForm activeTab={activeTab} />
          </div>
        </main>
      </div>
    </>
  );
};
export default AccountPage;
