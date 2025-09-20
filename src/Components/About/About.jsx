import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "src/Data/constants";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import BreadcrumbWrapper from "../Shared/MiniComponents/PagesHistory/BreadcrumbWrapper";
import s from "./About.module.scss";

const About = () => {
  const { t } = useTranslation();

  useScrollOnMount();

  // Define history paths for navigation
  const historyPaths = [
    { path: "/", label: t("nav.home") },
    { path: "/about", label: t("nav.about") }
  ];

  return (
    <>
      <Helmet>
        <title>About - {WEBSITE_NAME}</title>
        <meta
          name="description"
          content={`${WEBSITE_NAME} is South Asia's leading e-commerce platform since 2015, offering 1M+ products from 10,500 sellers and 300 brands in Bangladesh.`}
        />
      </Helmet>

      <main className={s.aboutPage}>
        <div className="container">
          <BreadcrumbWrapper 
            history={["/", t("nav.about")]} 
            historyPaths={historyPaths}
            pageType="about"
            variant="clean"
          />
          
          {/* About Us Section */}
          <section className={s.aboutUsSection}>
            <h1 className={s.mainHeading}>Về chúng tôi {WEBSITE_NAME}</h1>
            <p className={s.description}>
              Nền tảng thương mại điện tử hàng đầu Nam Á từ năm 2015, cung cấp hơn 1M sản phẩm từ 10,500 người bán và 300 thương hiệu tại Bangladesh.
            </p>
          </section>

          {/* Statistics Section */}
          <section className={s.statsSection}>
            <h2 className={s.statsHeading}>Sellers active on our site</h2>
            <div className={s.statsGrid}>
              <div className={s.statCard}>
                <div className={s.statIcon}>
                  <span>🛒</span>
                </div>
                <div className={s.statNumber}>10.5k</div>
                <div className={s.statText}>Người bán hoạt động trên trang web của chúng tôi</div>
              </div>
              
              <div className={s.statCard}>
                <div className={s.statIcon}>
                  <span>💰</span>
                </div>
                <div className={s.statNumber}>33k</div>
                <div className={s.statText}>Doanh số sản phẩm hàng tháng</div>
              </div>
              
              <div className={s.statCard}>
                <div className={s.statIcon}>
                  <span>👥</span>
                </div>
                <div className={s.statNumber}>45.5k</div>
                <div className={s.statText}>Khách hàng hoạt động trên trang web của chúng tôi</div>
              </div>
              
              <div className={s.statCard}>
                <div className={s.statIcon}>
                  <span>📈</span>
                </div>
                <div className={s.statNumber}>25k</div>
                <div className={s.statText}>Doanh thu hàng năm trên trang web của chúng tôi</div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className={s.missionSection}>
            <div className={s.missionCard}>
              <h2 className={s.missionHeading}>Sứ mệnh của chúng tôi</h2>
              <p className={s.missionDescription}>
                Cung cấp trải nghiệm mua sắm trực tuyến tốt nhất với sản phẩm chất lượng, giá cả cạnh tranh và dịch vụ khách hàng xuất sắc.
              </p>
              
              <div className={s.servicesGrid}>
                <div className={s.serviceItem}>
                  <div className={s.serviceIcon}>
                    <span>🎯</span>
                  </div>
                  <h3 className={s.serviceTitle}>Sản phẩm chất lượng</h3>
                  <p className={s.serviceDescription}>
                    Lựa chọn sản phẩm chất lượng cao từ người bán đáng tin cậy
                  </p>
                </div>
                
                <div className={s.serviceItem}>
                  <div className={s.serviceIcon}>
                    <span>🚚</span>
                  </div>
                  <h3 className={s.serviceTitle}>Giao hàng nhanh</h3>
                  <p className={s.serviceDescription}>
                    Giao hàng nhanh chóng và đáng tin cậy trên toàn quốc
                  </p>
                </div>
                
                <div className={s.serviceItem}>
                  <div className={s.serviceIcon}>
                    <span>💬</span>
                  </div>
                  <h3 className={s.serviceTitle}>Hỗ trợ 24/7</h3>
                  <p className={s.serviceDescription}>
                    Hỗ trợ khách hàng suốt ngày đêm cho mọi nhu cầu của bạn
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Leadership Team Section */}
          <section className={s.leadershipSection}>
            <h2 className={s.leadershipHeading}>Đội ngũ lãnh đạo của chúng tôi</h2>
            <div className={s.teamGrid}>
              <div className={s.teamCard}>
                <div className={s.nameBadge}>Nguyên Vũ</div>
                <h3 className={s.memberName}>Nguyễn Vũ</h3>
                <div className={s.memberTitle}>CEO</div>
                <p className={s.memberDescription}>
                  Overseeing the overall strategic direction, managing team coordination, and leading the backend development team.
                </p>
              </div>
              
              <div className={s.teamCard}>
                <div className={s.nameBadge}>Tín Huy</div>
                <h3 className={s.memberName}>Tín Huy</h3>
                <div className={s.memberTitle}>CMO</div>
                <p className={s.memberDescription}>
                  Driving user growth through marketing strategies, campaigns, branding, and community engagement.
                </p>
              </div>
              
              <div className={s.teamCard}>
                <div className={s.nameBadge}>Quang Nhật</div>
                <h3 className={s.memberName}>Quang Nhật</h3>
                <div className={s.memberTitle}>CONTENT & MEDIA</div>
                <p className={s.memberDescription}>
                  Creating product visuals, promotional content, and brand media assets.
                </p>
              </div>
              
              <div className={s.teamCard}>
                <div className={s.nameBadge}>Minh Khải</div>
                <h3 className={s.memberName}>Minh Khải</h3>
                <div className={s.memberTitle}>MOD</div>
                <p className={s.memberDescription}>
                  Moderating content, supporting users, resolving disputes, and maintaining community order.
                </p>
              </div>
              
              <div className={s.teamCard}>
                <div className={s.nameBadge}>Xuân Ý</div>
                <h3 className={s.memberName}>Xuân Ý</h3>
                <div className={s.memberTitle}>QA & SUPPORT</div>
                <p className={s.memberDescription}>
                  Ensuring product quality and platform stability through continuous testing.
                </p>
              </div>
              
              <div className={s.teamCard}>
                <div className={s.nameBadge}>Minh Đà</div>
                <h3 className={s.memberName}>Minh Đà</h3>
                <div className={s.memberTitle}>CTO</div>
                <p className={s.memberDescription}>
                  Leading the development and optimization of the platform's frontend experience.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default About;
