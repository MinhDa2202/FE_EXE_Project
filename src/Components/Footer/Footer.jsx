import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { WEBSITE_NAME } from "src/Data/constants";
import CopyRightsText from "./CopyRightsText/CopyRightsText";
import s from "./Footer.module.scss";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={s.footer}>
      <div className={s.footerContainer}>
        <section className={s.sections}>
          {/* Column 1: Recloop Mart */}
          <section className={s.section1}>
            <div className={s.logoSection}>
              <Link to="/" className={s.logo}>
                {WEBSITE_NAME}
              </Link>
              <p className={s.description}>
                Nền tảng mua bán hàng cũ an toàn và tiện lợi. 
                Chúng tôi cung cấp giải pháp tối ưu để kết nối 
                người mua và người bán một cách đáng tin cậy.
              </p>
            </div>
            

          </section>

          {/* Column 2: Dịch Vụ */}
          <section className={s.section2}>
            <h4>Dịch Vụ</h4>
            <ul>
              <li><Link to="/products">Sản phẩm</Link></li>
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </section>

          {/* Column 3: Hỗ Trợ */}
          <section className={s.section3}>
            <h4>Hỗ Trợ</h4>
            <ul>
              <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link to="/support">Hỗ trợ khách hàng</Link></li>
              <li><a href="tel:0389761025">Hotline: 0389761025</a></li>
              <li><Link to="/chat">Chat trực tuyến</Link></li>
            </ul>
          </section>

          {/* Column 4: Pháp Lý */}
          <section className={s.section4}>
            <h4>Pháp Lý</h4>
            <ul>
              <li><Link to="/privacy">Chính sách bảo mật</Link></li>
              <li><Link to="/terms">Điều khoản sử dụng</Link></li>
              <li><Link to="/service-terms">Điều khoản dịch vụ</Link></li>
              <li><Link to="/return-policy">Chính sách trả hàng</Link></li>
            </ul>
          </section>
        </section>

        {/* Bottom section with copyright and links */}
        <div className={s.bottomSection}>
          <div className={s.copyright}>
            <p>© 2024 {WEBSITE_NAME}. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className={s.bottomLinks}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
