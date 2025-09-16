import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import reportService from '../../Features/reportService';
import { WEBSITE_NAME } from "src/Data/constants";
import s from './MyReportsPage.module.scss';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportService.getMyReports();
      setReports(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách báo cáo. Vui lòng đảm bảo bạn đã đăng nhập.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    window.addEventListener('focus', fetchReports);
    return () => {
      window.removeEventListener('focus', fetchReports);
    };
  }, []);

  const handleRevokeReport = async (reportId) => {
    if (window.confirm('Bạn có chắc chắn muốn thu hồi báo cáo này không?')) {
      try {
        await reportService.revokeReport(reportId);
        setReports(currentReports =>
          currentReports.filter(report => report.id !== reportId)
        );
      } catch (err) {
        alert('Không thể thu hồi báo cáo. Vui lòng thử lại.');
        console.error(err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Đang tải báo cáo... - {WEBSITE_NAME}</title>
        </Helmet>
        <div className={s.pageContainer}>
          <div className={s.loadingContainer}>
            <div className={s.loadingSpinner}>
              <div className={s.spinner}></div>
              <p>Đang tải danh sách báo cáo của bạn...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Lỗi tải báo cáo - {WEBSITE_NAME}</title>
        </Helmet>
        <div className={s.pageContainer}>
          <div className={s.errorContainer}>
            <div className={s.errorMessage}>
              <span className={s.errorIcon}>⚠️</span>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Báo cáo của tôi - {WEBSITE_NAME}</title>
        <meta name="description" content={`Xem danh sách các báo cáo sản phẩm bạn đã gửi trên ${WEBSITE_NAME}`} />
      </Helmet>
      
      <div className={s.pageContainer}>
        <div className={s.reportsPage}>
          <div className={s.pageHeader}>
            <div className={s.headerContent}>
              <h1 className={s.title}>
                <span className={s.titleIcon}>📋</span>
                Báo cáo của tôi
              </h1>
              <p className={s.subtitle}>
                Quản lý và theo dõi các báo cáo sản phẩm bạn đã gửi
              </p>
            </div>
            <div className={s.statsCard}>
              <div className={s.statItem}>
                <span className={s.statNumber}>{reports.length}</span>
                <span className={s.statLabel}>Tổng báo cáo</span>
              </div>
              <div className={s.statDivider}></div>
              <div className={s.statItem}>
                <span className={s.statNumber}>
                  {reports.filter(r => !r.isResolved).length}
                </span>
                <span className={s.statLabel}>Đang xử lý</span>
              </div>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className={s.emptyState}>
              <div className={s.emptyIcon}>📝</div>
              <h3>Chưa có báo cáo nào</h3>
              <p>Bạn chưa gửi báo cáo nào. Khi bạn báo cáo sản phẩm vi phạm, chúng sẽ xuất hiện ở đây.</p>
            </div>
          ) : (
            <div className={s.reportsList}>
              {reports.map((report) => (
                <div key={report.id} className={s.reportCard}>
                  <div className={s.cardHeader}>
                    <div className={s.reportId}>
                      <span className={s.idLabel}>ID Sản phẩm:</span>
                      <span className={s.idValue}>{report.productId}</span>
                    </div>
                    <div className={s.statusBadge}>
                      <span className={`${s.status} ${report.isResolved ? s.resolved : s.pending}`}>
                        {report.isResolved ? (
                          <>
                            <span className={s.statusIcon}>✅</span>
                            Đã xử lý
                          </>
                        ) : (
                          <>
                            <span className={s.statusIcon}>⏳</span>
                            Đang xử lý
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className={s.cardContent}>
                    <div className={s.reasonSection}>
                      <h4 className={s.sectionTitle}>
                        <span className={s.sectionIcon}>🚨</span>
                        Lý do báo cáo
                      </h4>
                      <p className={s.reasonText}>{report.reason}</p>
                    </div>

                    <div className={s.metaInfo}>
                      <div className={s.metaItem}>
                        <span className={s.metaIcon}>📅</span>
                        <span className={s.metaLabel}>Ngày gửi:</span>
                        <span className={s.metaValue}>{formatDate(report.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {!report.isResolved && (
                    <div className={s.cardActions}>
                      <button
                        onClick={() => handleRevokeReport(report.id)}
                        className={s.revokeButton}
                      >
                        <span className={s.buttonIcon}>🗑️</span>
                        Thu hồi báo cáo
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyReportsPage;