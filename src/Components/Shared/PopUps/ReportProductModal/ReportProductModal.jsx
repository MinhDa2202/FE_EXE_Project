import React, { useState } from 'react';
import reportService from 'src/Features/reportService';
import s from './ReportProductModal.module.scss';

const REPORT_REASONS = [
  'Thông tin sai lệch/Lừa đảo',
  'Sản phẩm bị cấm',
  'Người bán không đáng tin cậy',
  'Hành vi quấy rối',
  'Khác',
];

const ReportProductModal = ({ productId, onClose, show }) => {
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedReason === 'Khác' && !details.trim()) {
      setError('Vui lòng nhập mô tả chi tiết cho lý do của bạn.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const finalReason =
      selectedReason === 'Khác'
        ? `Khác: ${details}`
        : `${selectedReason} - Chi tiết: ${details}`;

    try {
      await reportService.createReport({ productId, reason: finalReason });
      alert('Báo cáo của bạn đã được gửi thành công. Cảm ơn bạn!');
      handleClose();
    } catch (err) {
      setError('Gửi báo cáo thất bại. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state before closing
    setStep(1);
    setSelectedReason('');
    setDetails('');
    setError('');
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className={s.overlay} onClick={handleClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2>Báo cáo sản phẩm</h2>
          <button className={s.closeButton} onClick={handleClose}>&times;</button>
        </div>

        <div className={s.modalContent}>
          {step === 1 && (
            <div className={s.step1}>
              <div className={s.stepHeader}>
                <span className={s.stepIcon}>⚠️</span>
                <p className={s.stepDescription}>Vui lòng chọn lý do báo cáo:</p>
              </div>
              <ul className={s.reasonsList}>
                {REPORT_REASONS.map((reason) => (
                  <li key={reason}>
                    <button onClick={() => handleReasonSelect(reason)}>
                      <span className={s.reasonIcon}>📋</span>
                      <span className={s.reasonText}>{reason}</span>
                      <span className={s.arrowIcon}>→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 2 && (
            <form className={s.step2} onSubmit={handleSubmit}>
              <div className={s.stepHeader}>
                <button type="button" className={s.backButton} onClick={() => setStep(1)}>
                  ← Quay lại
                </button>
              </div>
              
              <div className={s.selectedReason}>
                <span className={s.reasonLabel}>Lý do đã chọn:</span>
                <span className={s.reasonValue}>{selectedReason}</span>
              </div>

              <div className={s.formGroup}>
                <label htmlFor="reportDetails" className={s.formLabel}>
                  Mô tả chi tiết (không bắt buộc):
                </label>
                <textarea
                  id="reportDetails"
                  rows="5"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Cung cấp thêm thông tin chi tiết..."
                  className={s.textarea}
                />
              </div>

              {error && <div className={s.error}>{error}</div>}
              
              <div className={s.formActions}>
                <button type="submit" disabled={isSubmitting} className={s.submitButton}>
                  {isSubmitting ? (
                    <>
                      <span className={s.spinner}></span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <span className={s.submitIcon}>📤</span>
                      Gửi báo cáo
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportProductModal;