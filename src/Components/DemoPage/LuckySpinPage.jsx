import { Helmet } from "react-helmet-async";
import { WEBSITE_NAME } from "src/Data/constants";
import LuckySpinDemo from "../Shared/PopUps/LuckySpin/LuckySpinDemo";
import s from "./LuckySpinPage.module.scss";

const LuckySpinPage = () => {
  return (
    <>
      <Helmet>
        <title>Vòng quay may mắn - {WEBSITE_NAME}</title>
        <meta
          name="description"
          content="Tham gia vòng quay may mắn để nhận những phần quà hấp dẫn từ Recloops Mart!"
        />
      </Helmet>

      <main className={s.luckySpinPage}>
        <LuckySpinDemo />
      </main>
    </>
  );
};

export default LuckySpinPage;
