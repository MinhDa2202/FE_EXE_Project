import { useTranslation } from "react-i18next";
import s from "./PaymentForm.module.scss";

const PaymentForm = ({
  paymentMethod,
  onPaymentMethodChange,
  shippingInfo,
  onShippingInfoChange,
  onSubmit
}) => {
  const { t } = useTranslation();

  const paymentMethods = [
    {
      id: "credit-card",
      name: t("payment.creditCard", "Thẻ tín dụng"),
      icon: "💳"
    },
    {
      id: "paypal",
      name: t("payment.paypal", "PayPal"),
      icon: "🅿️"
    },
    {
      id: "bank-transfer",
      name: t("payment.bankTransfer", "Chuyển khoản ngân hàng"),
      icon: "🏦"
    },
    {
      id: "cod",
      name: t("payment.cod", "Thanh toán khi nhận hàng"),
      icon: "💵"
    }
  ];

  const handleInputChange = (field) => (e) => {
    onShippingInfoChange(field, e.target.value);
  };

  return (
    <div className={s.paymentForm}>
      {/* Shipping Information */}
      <div className={s.section}>
        <h3>{t("payment.shippingInfo", "Thông tin giao hàng")}</h3>
        <div className={s.formGrid}>
          <div className={s.inputGroup}>
            <label htmlFor="fullName">
              {t("payment.fullName", "Họ và tên")} *
            </label>
            <input
              type="text"
              id="fullName"
              value={shippingInfo.fullName}
              onChange={handleInputChange("fullName")}
              placeholder={t("payment.fullNamePlaceholder", "Nhập họ và tên")}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="email">
              {t("payment.email", "Email")} *
            </label>
            <input
              type="email"
              id="email"
              value={shippingInfo.email}
              onChange={handleInputChange("email")}
              placeholder={t("payment.emailPlaceholder", "example@email.com")}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="phone">
              {t("payment.phone", "Số điện thoại")} *
            </label>
            <input
              type="tel"
              id="phone"
              value={shippingInfo.phone}
              onChange={handleInputChange("phone")}
              placeholder={t("payment.phonePlaceholder", "0123456789")}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="address">
              {t("payment.address", "Địa chỉ")} *
            </label>
            <input
              type="text"
              id="address"
              value={shippingInfo.address}
              onChange={handleInputChange("address")}
              placeholder={t("payment.addressPlaceholder", "Số nhà, tên đường")}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="city">
              {t("payment.city", "Thành phố")} *
            </label>
            <input
              type="text"
              id="city"
              value={shippingInfo.city}
              onChange={handleInputChange("city")}
              placeholder={t("payment.cityPlaceholder", "Hồ Chí Minh")}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="zipCode">
              {t("payment.zipCode", "Mã bưu điện")}
            </label>
            <input
              type="text"
              id="zipCode"
              value={shippingInfo.zipCode}
              onChange={handleInputChange("zipCode")}
              placeholder={t("payment.zipCodePlaceholder", "700000")}
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className={s.section}>
        <h3>{t("payment.paymentMethod", "Phương thức thanh toán")}</h3>
        <div className={s.paymentMethods}>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`${s.paymentOption} ${
                paymentMethod === method.id ? s.selected : ""
              }`}
              onClick={() => onPaymentMethodChange(method.id)}
            >
              <div className={s.methodIcon}>{method.icon}</div>
              <div className={s.methodInfo}>
                <span className={s.methodName}>{method.name}</span>
              </div>
              <div className={s.radioButton}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => onPaymentMethodChange(method.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Card Details */}
      {paymentMethod === "credit-card" && (
        <div className={s.section}>
          <h3>{t("payment.cardDetails", "Thông tin thẻ")}</h3>
          <div className={s.formGrid}>
            <div className={s.inputGroup}>
              <label htmlFor="cardNumber">
                {t("payment.cardNumber", "Số thẻ")} *
              </label>
              <input
                type="text"
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>

            <div className={s.inputGroup}>
              <label htmlFor="cardName">
                {t("payment.cardName", "Tên trên thẻ")} *
              </label>
              <input
                type="text"
                id="cardName"
                placeholder={t("payment.cardNamePlaceholder", "NGUYEN VAN A")}
              />
            </div>

            <div className={s.inputGroup}>
              <label htmlFor="expiryDate">
                {t("payment.expiryDate", "Ngày hết hạn")} *
              </label>
              <input
                type="text"
                id="expiryDate"
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>

            <div className={s.inputGroup}>
              <label htmlFor="cvv">
                {t("payment.cvv", "CVV")} *
              </label>
              <input
                type="text"
                id="cvv"
                placeholder="123"
                maxLength="4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
