import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { showAlert } from "src/Features/alertsSlice";
import { walletService } from "src/Services/walletApi";
import PayOSWebhook from "../PayOSWebhook/PayOSWebhook";
import s from "./PaymentSummary.module.scss";

const PaymentSummary = ({ items, paymentMethod, onSubmit }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [walletBalance, setWalletBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [showWebhook, setShowWebhook] = useState(false);

  // Load wallet balance on component mount
  useEffect(() => {
    const loadWalletBalance = async () => {
      try {
        setLoadingBalance(true);
        const balance = await walletService.getBalance();
        setWalletBalance(balance || 0);
      } catch (error) {
        console.error("Failed to load wallet balance:", error);
        setWalletBalance(0);
      } finally {
        setLoadingBalance(false);
      }
    };

    loadWalletBalance();
  }, []);

  const summary = useMemo(() => {
    if (!items || items.length === 0) {
      return {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0,
      };
    }

    const subtotal = items.reduce((sum, item) => {
      const price = item.afterDiscount || item.price || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);

    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const tax = subtotal * 0.1; // 10% tax
    const discount = subtotal > 200 ? subtotal * 0.05 : 0; // 5% discount over $200
    const total = subtotal + shipping + tax - discount;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
    };
  }, [items]);

  const handleCheckout = async () => {
    if (!items || items.length === 0) {
      dispatch(
        showAlert({
          alertText: t(
            "payment.emptyCartAlert",
            "Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán."
          ),
          alertState: "warning",
          alertType: "alert",
        })
      );
      return;
    }

    setIsProcessing(true);

    try {
      dispatch(
        showAlert({
          alertText: t("payment.processingPayment", "Đang xử lý thanh toán..."),
          alertState: "info",
          alertType: "alert",
        })
      );

      const totalAmount = parseFloat(summary.total);

      // Call wallet deposit API
      const depositResult = await walletService.deposit(totalAmount);

      // Show webhook component to listen for PayOS confirmation
      setShowWebhook(true);

      // Update wallet balance
      const newBalance = await walletService.getBalance();
      setWalletBalance(newBalance || 0);

      dispatch(
        showAlert({
          alertText: t(
            "payment.paymentInitiated",
            "Thanh toán đã được khởi tạo. Đang chờ xác nhận..."
          ),
          alertState: "info",
          alertType: "alert",
        })
      );

      // Call parent onSubmit callback
      onSubmit(depositResult);
    } catch (error) {
      console.error("Payment failed:", error);
      dispatch(
        showAlert({
          alertText: t(
            "payment.paymentFailed",
            "Thanh toán thất bại. Vui lòng thử lại."
          ),
          alertState: "error",
          alertType: "alert",
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodName = () => {
    const methods = {
      "credit-card": t("payment.creditCard", "Thẻ tín dụng"),
      paypal: t("payment.paypal", "PayPal"),
      "bank-transfer": t("payment.bankTransfer", "Chuyển khoản ngân hàng"),
      cod: t("payment.cod", "Thanh toán khi nhận hàng"),
    };
    return methods[paymentMethod] || methods["credit-card"];
  };

  const handleWebhookReceived = (webhookData) => {
    if (webhookData.success) {
      dispatch(
        showAlert({
          alertText: t(
            "payment.paymentSuccess",
            "Thanh toán thành công! Cảm ơn bạn đã mua hàng."
          ),
          alertState: "success",
          alertType: "alert",
        })
      );
    } else {
      dispatch(
        showAlert({
          alertText: t(
            "payment.paymentFailed",
            "Thanh toán thất bại. Vui lòng thử lại."
          ),
          alertState: "error",
          alertType: "alert",
        })
      );
    }
  };

  return (
    <div className={s.paymentSummary}>
      <div className={s.summaryHeader}>
        <h3>{t("payment.orderSummary", "Tóm tắt đơn hàng")}</h3>
      </div>

      <div className={s.summaryContent}>
        {/* Wallet Balance */}
        <div className={`${s.summaryRow} ${s.walletBalance}`}>
          <span>{t("payment.walletBalance", "Số dư ví")}</span>
          <span>
            {loadingBalance ? (
              <span className={s.loading}>...</span>
            ) : (
              `$${walletBalance.toFixed(2)}`
            )}
          </span>
        </div>

        <div className={s.divider}></div>

        <div className={s.summaryRow}>
          <span>{t("payment.subtotal", "Tạm tính")}</span>
          <span>${summary.subtotal}</span>
        </div>

        <div className={s.summaryRow}>
          <span>{t("payment.shipping", "Phí vận chuyển")}</span>
          <span className={summary.shipping === "0.00" ? s.free : ""}>
            {summary.shipping === "0.00"
              ? t("payment.freeShipping", "Miễn phí")
              : `$${summary.shipping}`}
          </span>
        </div>

        <div className={s.summaryRow}>
          <span>{t("payment.tax", "Thuế")}</span>
          <span>${summary.tax}</span>
        </div>

        {parseFloat(summary.discount) > 0 && (
          <div className={`${s.summaryRow} ${s.discount}`}>
            <span>{t("payment.discount", "Giảm giá")}</span>
            <span>-${summary.discount}</span>
          </div>
        )}

        <div className={s.divider}></div>

        <div className={`${s.summaryRow} ${s.total}`}>
          <span>{t("payment.total", "Tổng cộng")}</span>
          <span>${summary.total}</span>
        </div>
      </div>

      <div className={s.paymentMethodInfo}>
        <div className={s.methodLabel}>
          {t("payment.selectedMethod", "Phương thức thanh toán")}:
        </div>
        <div className={s.methodValue}>{getPaymentMethodName()}</div>
      </div>

      <button
        className={`${s.checkoutButton} ${isProcessing ? s.processing : ""}`}
        onClick={handleCheckout}
        disabled={!items || items.length === 0 || isProcessing}
      >
        {isProcessing ? (
          <>
            <span className={s.spinner}></span>
            {t("payment.processing", "Đang xử lý...")}
          </>
        ) : (
          t("payment.completeOrder", "Hoàn tất đơn hàng")
        )}
      </button>

      <div className={s.securityInfo}>
        <div className={s.securityIcon}>🔒</div>
        <p>
          {t(
            "payment.securityNote",
            "Thông tin thanh toán của bạn được bảo mật và mã hóa"
          )}
        </p>
      </div>

      {/* PayOS Webhook Status */}
      {showWebhook && (
        <PayOSWebhook onWebhookReceived={handleWebhookReceived} />
      )}
    </div>
  );
};

export default PaymentSummary;
