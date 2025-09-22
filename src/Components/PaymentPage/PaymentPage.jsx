import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import { useReduxStore } from "src/Hooks/App/useReduxStore";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import s from "./PaymentPage.module.scss";
import PaymentSummary from "./PaymentSummary/PaymentSummary";
import PaymentForm from "./PaymentForm/PaymentForm";
import CartItems from "./CartItems/CartItems";

const PaymentPage = () => {
  const { t } = useTranslation();
  const { orderProducts, isStoreReady } = useReduxStore();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  console.log("PaymentPage - Component rendered:", {
    isStoreReady,
    orderProductsLength: orderProducts?.length || 0,
  });

  useScrollOnMount(200);

  // Don't render until store is ready
  if (!isStoreReady) {
    console.log("PaymentPage - Store not ready, not rendering");
    return null;
  }

  console.log("PaymentPage - Rendering payment page");

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleShippingInfoChange = (field, value) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    // Handle payment submission logic here
    console.log("Payment submitted:", {
      paymentMethod,
      shippingInfo,
      items: orderProducts,
    });
  };

  return (
    <div className="container">
      <main className={s.paymentPage}>
        {/* <PagesHistory history={["/", t("nav.payment", "Payment")]} /> */}

        <div className={s.pageHeader}>
          <h1>{t("payment.title", "Thanh toán")}</h1>
          <p>{t("payment.subtitle", "Hoàn tất đơn hàng của bạn")}</p>
        </div>

        <div className={s.paymentContent} id="payment-page">
          <div className={s.leftSection}>
            {/* Cart Items */}
            <CartItems items={orderProducts} />

            {/* Payment Form */}
            <PaymentForm
              paymentMethod={paymentMethod}
              onPaymentMethodChange={handlePaymentMethodChange}
              shippingInfo={shippingInfo}
              onShippingInfoChange={handleShippingInfoChange}
              onSubmit={handleSubmitPayment}
            />
          </div>

          <div className={s.rightSection}>
            {/* Payment Summary */}
            <PaymentSummary
              items={orderProducts}
              paymentMethod={paymentMethod}
              onSubmit={handleSubmitPayment}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
