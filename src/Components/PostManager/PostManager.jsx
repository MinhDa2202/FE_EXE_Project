import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { WEBSITE_NAME } from "src/Data/constants";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useUserProducts from "src/Hooks/App/useUserProducts";
import usePostApprovalStatus from "src/Hooks/App/usePostApprovalStatus";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import UserProductCard from "./UserProductCard/UserProductCard";
import s from "./PostManager.module.scss";

const PostManager = () => {
  const { t } = useTranslation();
  const { loginInfo } = useSelector((state) => state.user);
  const { userProducts, loading, error, refetch } = useUserProducts();
  const {
    approvalStatuses,
    loading: statusLoading,
    error: statusError,
    approvedCount,
    pendingCount,
  } = usePostApprovalStatus(userProducts);

  useScrollOnMount();

  // Define history paths for navigation
  const historyPaths = [
    { path: "/", label: t("nav.home") },
    { path: "/profile", label: t("nav.profile") },
    { path: "/post-manager", label: "Post Manager" },
  ];

  return (
    <>
      <Helmet>
        <title>Post Manager - {WEBSITE_NAME}</title>
        <meta
          name="description"
          content={`Quản lý tất cả sản phẩm bạn đã đăng trên ${WEBSITE_NAME}. Chỉnh sửa, xóa hoặc cập nhật thông tin sản phẩm của bạn.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.postManager} id="post-manager">
          <PagesHistory
            history={["/", t("nav.profile"), "Quản lý bài đăng"]}
            historyPaths={historyPaths}
          />

          {/* Header Section */}
          <section className={s.headerSection}>
            <div className={s.headerContent}>
              <h1 className={s.mainHeading}>Trạng thái bài đăng của bạn</h1>
              <p className={s.description}>
                Xin chào <strong>{loginInfo.username}</strong>! Kiểm tra trạng
                thái duyệt của các bài đăng trên {WEBSITE_NAME}.
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section className={s.statsSection}>
            <div className={s.statsGrid}>
              <div className={s.statCard}>
                <div className={s.statIcon}>
                  <svg
                    width="24"
                    height="24"
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
                <div className={s.statContent}>
                  <h3>{userProducts.length}</h3>
                  <p>Tổng bài đăng</p>
                </div>
              </div>
              <div className={s.statCard}>
                <div className={s.statIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12L11 14L15 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className={s.statContent}>
                  <h3 id="approved-count">
                    {statusLoading ? "-" : approvedCount}
                  </h3>
                  <p>Đã duyệt</p>
                </div>
              </div>
              <div className={s.statCard}>
                <div className={s.statIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <polyline
                      points="12,6 12,12 16,14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className={s.statContent}>
                  <h3 id="pending-count">
                    {statusLoading ? "-" : pendingCount}
                  </h3>
                  <p>Chờ duyệt</p>
                </div>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section className={s.productsSection}>
            {loading && (
              <div className={s.loadingSection}>
                <h2 className={s.sectionTitle}>Đang tải sản phẩm...</h2>
                <SkeletonCards numberOfCards={6} />
              </div>
            )}

            {error && (
              <div className={s.errorSection}>
                <div className={s.errorCard}>
                  <div className={s.errorIcon}>
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="12"
                        y1="8"
                        x2="12"
                        y2="12"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="12"
                        y1="16"
                        x2="12.01"
                        y2="16"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <h3>Không thể tải sản phẩm</h3>
                  <p>{error}</p>
                  <button className={s.retryBtn} onClick={refetch}>
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className={s.sectionHeader}>
                  <h2 className={s.sectionTitle}>
                    Bài đăng của bạn ({userProducts.length})
                  </h2>
                  <div className={s.filterControls}>
                    <select className={s.sortSelect}>
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="rejected">Bị từ chối</option>
                    </select>
                  </div>
                </div>

                <div className={s.productsGrid}>
                  {userProducts.length > 0 ? (
                    userProducts.map((product) => (
                      <UserProductCard
                        key={product.Id || product.id}
                        product={product}
                        approvalStatus={
                          approvalStatuses[product.Id || product.id]
                        }
                      />
                    ))
                  ) : (
                    <div className={s.emptyMessage}>
                      <p>Chưa có bài đăng nào</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default PostManager;
