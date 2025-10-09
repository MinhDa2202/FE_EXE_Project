import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
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
    approvedCount,
    pendingCount,
  } = usePostApprovalStatus(userProducts);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const PRODUCTS_PER_PAGE = 8;

  useScrollOnMount();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...userProducts];

    // Apply filter
    if (filterBy !== "all") {
      filtered = filtered.filter((product) => {
        const status = approvalStatuses[product.Id || product.id];
        return status === filterBy;
      });
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.AddedDate || 0) - new Date(b.AddedDate || 0);
        case "approved":
          const statusA = approvalStatuses[a.Id || a.id];
          const statusB = approvalStatuses[b.Id || b.id];
          if (statusA === "approved" && statusB !== "approved") return -1;
          if (statusA !== "approved" && statusB === "approved") return 1;
          return 0;
        case "pending":
          const statusA2 = approvalStatuses[a.Id || a.id];
          const statusB2 = approvalStatuses[b.Id || b.id];
          if (statusA2 === "pending" && statusB2 !== "pending") return -1;
          if (statusA2 !== "pending" && statusB2 === "pending") return 1;
          return 0;
        case "newest":
        default:
          return new Date(b.AddedDate || 0) - new Date(a.AddedDate || 0);
      }
    });

    return filtered;
  }, [userProducts, approvalStatuses, sortBy, filterBy]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilter) => {
    setFilterBy(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

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
                    Bài đăng của bạn ({filteredAndSortedProducts.length})
                  </h2>
                  <div className={s.filterControls}>
                    <select
                      className={s.filterSelect}
                      value={filterBy}
                      onChange={(e) => handleFilterChange(e.target.value)}
                    >
                      <option value="all">Tất cả</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="pending">Chờ duyệt</option>
                    </select>
                    <select
                      className={s.sortSelect}
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="pending">Chờ duyệt</option>
                    </select>
                  </div>
                </div>

                <div className={s.productsGrid}>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <UserProductCard
                        key={product.Id || product.id}
                        product={product}
                        approvalStatus={
                          approvalStatuses[product.Id || product.id]
                        }
                        compact={true}
                      />
                    ))
                  ) : (
                    <div className={s.emptyMessage}>
                      <p>Không tìm thấy bài đăng nào</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={s.pagination}>
                    <button
                      className={`${s.pageBtn} ${
                        currentPage === 1 ? s.disabled : ""
                      }`}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹ Trước
                    </button>

                    <div className={s.pageNumbers}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            className={`${s.pageBtn} ${
                              currentPage === page ? s.active : ""
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      className={`${s.pageBtn} ${
                        currentPage === totalPages ? s.disabled : ""
                      }`}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau ›
                    </button>
                  </div>
                )}

                {/* Results info */}
                <div className={s.resultsInfo}>
                  <p>
                    Hiển thị {startIndex + 1}-
                    {Math.min(endIndex, filteredAndSortedProducts.length)}
                    trong tổng số {filteredAndSortedProducts.length} bài đăng
                  </p>
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
