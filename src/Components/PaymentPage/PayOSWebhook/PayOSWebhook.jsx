import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { walletService } from "src/Services/walletApi";
import s from "./PayOSWebhook.module.scss";

const PayOSWebhook = ({ onWebhookReceived }) => {
  const { t } = useTranslation();
  const [webhookStatus, setWebhookStatus] = useState("idle"); // idle, listening, received, error
  const [webhookData, setWebhookData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId = null;

    const checkWebhook = async () => {
      try {
        setWebhookStatus("listening");
        const response = await walletService.getPayOSWebhook();
        
        if (response) {
          setWebhookData(response);
          setWebhookStatus("received");
          onWebhookReceived?.(response);
          
          // Stop checking after receiving webhook
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error("Webhook check failed:", error);
        setError(error.message);
        setWebhookStatus("error");
      }
    };

    // Start checking for webhook every 3 seconds
    intervalId = setInterval(checkWebhook, 3000);

    // Cleanup on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [onWebhookReceived]);

  const getStatusIcon = () => {
    switch (webhookStatus) {
      case "listening":
        return "🔄";
      case "received":
        return "✅";
      case "error":
        return "❌";
      default:
        return "⏳";
    }
  };

  const getStatusText = () => {
    switch (webhookStatus) {
      case "listening":
        return t("payment.webhookListening", "Đang chờ xác nhận thanh toán...");
      case "received":
        return t("payment.webhookReceived", "Đã nhận xác nhận thanh toán!");
      case "error":
        return t("payment.webhookError", "Lỗi khi kiểm tra thanh toán");
      default:
        return t("payment.webhookIdle", "Sẵn sàng kiểm tra thanh toán");
    }
  };

  if (webhookStatus === "idle") {
    return null;
  }

  return (
    <div className={`${s.webhookStatus} ${s[webhookStatus]}`}>
      <div className={s.statusHeader}>
        <span className={s.statusIcon}>{getStatusIcon()}</span>
        <span className={s.statusText}>{getStatusText()}</span>
      </div>

      {error && (
        <div className={s.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {webhookData && (
        <div className={s.webhookDetails}>
          <h4>{t("payment.paymentDetails", "Chi tiết thanh toán")}</h4>
          <div className={s.detailsGrid}>
            {webhookData.code && (
              <div className={s.detailItem}>
                <span className={s.label}>{t("payment.code", "Mã")}:</span>
                <span className={s.value}>{webhookData.code}</span>
              </div>
            )}
            {webhookData.desc && (
              <div className={s.detailItem}>
                <span className={s.label}>{t("payment.description", "Mô tả")}:</span>
                <span className={s.value}>{webhookData.desc}</span>
              </div>
            )}
            {webhookData.success !== undefined && (
              <div className={s.detailItem}>
                <span className={s.label}>{t("payment.status", "Trạng thái")}:</span>
                <span className={`${s.value} ${webhookData.success ? s.success : s.failed}`}>
                  {webhookData.success 
                    ? t("payment.successful", "Thành công") 
                    : t("payment.failed", "Thất bại")
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PayOSWebhook;
