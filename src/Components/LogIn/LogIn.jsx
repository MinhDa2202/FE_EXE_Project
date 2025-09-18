import { Helmet } from "react-helmet-async";
import { signUpImg } from "src/Assets/Images/Images";
import { WEBSITE_NAME } from "src/Data/constants";
import s from "./LogIn.module.scss";
import LogInForm from "./LogInForm/LogInForm";

const LogIn = () => {

  return (
    <>
      <Helmet>
        <title>Login in</title>
        <meta
          name="description"
          content={`Log in to your ${WEBSITE_NAME} account to access personalized shopping features, track orders, and manage your account details securely.`}
        />
      </Helmet>

      <main className={s.LogInPage} id="login-page">

          <LogInForm />
      </main>
    </>
  );
};
export default LogIn;
