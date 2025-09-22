import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "src/Data/constants";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import BreadcrumbWrapper from "../Shared/MiniComponents/PagesHistory/BreadcrumbWrapper";
import s from "./Contact.module.scss";

const Contact = () => {
  const { t } = useTranslation();

  useScrollOnMount();

  // Define history paths for navigation
  const historyPaths = [
    { path: "/", label: t("nav.home") },
    { path: "/contact", label: t("nav.contact") }
  ];

  return (
    <>
      <Helmet>
        <title>Contact - {WEBSITE_NAME}</title>
        <meta
          name="description"
          content={`Get in touch with ${WEBSITE_NAME}'s customer support team for assistance with your orders, inquiries, or feedback. We're here to help you with any questions you may have.`}
        />
      </Helmet>

      <main className={s.contactPage}>
        <div className="container">
          <BreadcrumbWrapper 
            history={["/", t("nav.contact")]} 
            historyPaths={historyPaths}
            pageType="contact"
            variant="clean"
          />
          
          <div className={s.contactContent}>
            {/* Left Section: Contact Information */}
            <div className={s.contactInfoCard}>
              {/* Call us section */}
              <div className={s.callSection}>
                <div className={s.contactIcon}>
                  <span>📞</span>
                </div>
                <h2 className={s.sectionHeading}>Gọi cho chúng tôi</h2>
                <p className={s.sectionDescription}>
                  Chúng tôi có sẵn 24/7, 7 ngày một tuần.
                </p>
                <a href="tel:0389761025" className={s.contactLink}>
                  0389761025
                </a>
              </div>
              
              {/* Divider */}
              <div className={s.divider}></div>
              
              {/* Write to us section */}
              <div className={s.writeSection}>
                <div className={s.contactIcon}>
                  <span>✉️</span>
                </div>
                <h2 className={s.sectionHeading}>Viết cho chúng tôi</h2>
                <p className={s.sectionDescription}>
                  Điền form của chúng tôi và chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.
                </p>
                <div className={s.emailSection}>
                  <span className={s.emailLabel}>Email khách hàng:</span>
                  <a href="mailto:recloopmart@gmail.com" className={s.contactLink}>
                    recloopmart@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Right Section: Contact Form */}
            <div className={s.contactFormCard}>
              <form className={s.contactForm}>
                <div className={s.formGroup}>
                  <label htmlFor="name" className={s.formLabel}>
                    Tên của bạn*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={s.formInput}
                    required
                  />
                </div>

                <div className={s.formGroup}>
                  <label htmlFor="email" className={s.formLabel}>
                    Email của bạn*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={s.formInput}
                    required
                  />
                </div>

                <div className={s.formGroup}>
                  <label htmlFor="phone" className={s.formLabel}>
                    Số điện thoại của bạn*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={s.formInput}
                    required
                  />
                </div>

                <div className={s.formGroup}>
                  <label htmlFor="message" className={s.formLabel}>
                    Tin nhắn của bạn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className={s.formTextarea}
                  ></textarea>
                </div>

                <div className={s.formButtons}>
                  <button type="reset" className={s.resetButton}>
                    Đặt lại
                  </button>
                  <button type="submit" className={s.submitButton}>
                    Gửi tin nhắn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
