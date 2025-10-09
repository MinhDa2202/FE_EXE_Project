import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useUserProducts from "src/Hooks/App/useUserProducts";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle";
import s from "./MyPostsSection.module.scss";

const MyPostsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginInfo } = useSelector((state) => state.user);
  const { isSignIn } = loginInfo;
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Get user products only if signed in
  const { userProducts } = useUserProducts(isSignIn);

  const handleSectionClick = () => {
    if (!isSignIn) {
      setShowLoginModal(true);
    } else {
      navigate("/post-manager");
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleSignupClick = () => {
    setShowLoginModal(false);
    navigate("/signup");
  };

  return (
    <>
      {/* Section nhỏ có thể click */}
      <section className={s.myPostsSection}>
        <div className={s.sectionCard} onClick={handleSectionClick}>
          {!isSignIn && (
            <div className={s.newBadge}>
              <span className={s.badgeText}>Mới!</span>
            </div>
          )}
          <div className={s.cardIcon}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 7L12 3L4 7L12 11L20 7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12L12 16L20 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 17L12 21L20 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={s.cardContent}>
            <h3 className={s.cardTitle}>Trạng thái bài đăng</h3>
            <p className={s.cardDescription}>
              {isSignIn
                ? `Kiểm tra trạng thái ${userProducts?.length || 0} bài đăng`
                : "Xem trạng thái bài đăng của bạn"}
            </p>
          </div>
          <div className={s.cardArrow}>
            <span className={s.arrowIcon}>→</span>
          </div>
        </div>
      </section>

      {/* Modal đăng nhập */}
      {showLoginModal && (
        <div
          className={s.modalOverlay}
          onClick={() => setShowLoginModal(false)}
        >
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h3>Đăng nhập để xem sản phẩm của bạn</h3>
              <button
                className={s.closeBtn}
                onClick={() => setShowLoginModal(false)}
              >
                ×
              </button>
            </div>
            <div className={s.modalContent}>
              <p>Bạn cần đăng nhập để xem và quản lý các sản phẩm đã đăng.</p>
              <div className={s.modalActions}>
                <button className={s.loginBtn} onClick={handleLoginClick}>
                  Đăng nhập
                </button>
                <button className={s.signupBtn} onClick={handleSignupClick}>
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section hiển thị sản phẩm khi đã đăng nhập */}
      {isSignIn && (
        <section className={s.productsSection}>
          <SectionTitle
            title="Trạng thái bài đăng của bạn"
            subTitle="Kiểm tra trạng thái duyệt bài đăng"
          />
        </section>
      )}
    </>
  );
};

export default MyPostsSection;
