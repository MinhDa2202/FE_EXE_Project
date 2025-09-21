import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import s from "./CompareSection.module.scss";

const CompareSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  // Fetch tất cả sản phẩm
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await fetch("/api/Product", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Lỗi khi tải sản phẩm:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mở modal và tải sản phẩm
  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchProducts();
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProducts([]);
    setShowComparison(false);
    setComparisonResult(null);
  };

  // Chọn/bỏ chọn sản phẩm
  const handleProductSelect = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      // Bỏ chọn sản phẩm
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else if (selectedProducts.length < 2) {
      // Chọn sản phẩm (tối đa 2)
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // So sánh sản phẩm
  const handleCompareProducts = async () => {
    if (selectedProducts.length !== 2) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/Product/compare/${selectedProducts[0].id}/${selectedProducts[1].id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComparisonResult(data.result);
        setShowComparison(true);
      } else {
        console.error("Lỗi khi so sánh sản phẩm:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi so sánh sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse HTML/Markdown từ Gemini response
  const parseComparisonResult = (result) => {
    try {
      const parsed = JSON.parse(result);
      if (
        parsed.candidates &&
        parsed.candidates[0] &&
        parsed.candidates[0].content
      ) {
        return parsed.candidates[0].content.parts[0].text;
      }
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
    }
    return result;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section className={s.compareSection}>
      <div className={s.container}>
        <div className={s.header}>
          <h2 className={s.title}>So Sánh Sản Phẩm</h2>
          <p className={s.description}>
            Chọn 2 sản phẩm bất kỳ để so sánh chi tiết các thông số và tính năng
          </p>
        </div>

        <div className={s.compareCard}>
          <div className={s.cardContent}>
            <div className={s.compareIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className={s.cardTitle}>So sánh thông minh</h3>
            <p className={s.cardDescription}>
              So sánh chi tiết hai sản phẩm để tìm ra lựa chọn phù hợp nhất cho
              bạn.
            </p>
          </div>
          <button className={s.compareButton} onClick={handleOpenModal}>
            Bắt đầu so sánh
          </button>
        </div>

        {/* Modal */}
        {isModalOpen &&
          createPortal(
            <div className={s.modal}>
              <div className={s.modalOverlay} onClick={handleCloseModal}></div>
              <div className={s.modalContent}>
                <div className={s.modalHeader}>
                  <h3>
                    {showComparison
                      ? "Kết quả so sánh"
                      : "Chọn sản phẩm để so sánh"}
                  </h3>
                  <button className={s.closeButton} onClick={handleCloseModal}>
                    ×
                  </button>
                </div>

                {showComparison ? (
                  // Hiển thị kết quả so sánh
                  <div className={s.comparisonResult}>
                    <div className={s.selectedProducts}>
                      {selectedProducts.map((product) => (
                        <div key={product.id} className={s.selectedProduct}>
                          <img
                            src={product.imageUrls?.[0] || "/placeholder.jpg"}
                            alt={product.title}
                            className={s.productImage}
                          />
                          <div className={s.productInfo}>
                            <h4>{product.title}</h4>
                            <p className={s.price}>
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={s.comparisonContent}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: parseComparisonResult(comparisonResult)
                            .replace(/\n/g, "<br/>")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />
                    </div>

                    <div className={s.modalActions}>
                      <button
                        className={s.backButton}
                        onClick={() => setShowComparison(false)}
                      >
                        Chọn lại sản phẩm
                      </button>
                    </div>
                  </div>
                ) : (
                  // Hiển thị danh sách sản phẩm
                  <div className={s.modalBody}>
                    <div className={s.selectedInfo}>
                      <p>Đã chọn: {selectedProducts.length}/2 sản phẩm</p>
                      {selectedProducts.length > 0 && (
                        <div className={s.selectedList}>
                          {selectedProducts.map((product) => (
                            <span key={product.id} className={s.selectedTag}>
                              {product.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={s.productList}>
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className={`${s.productItem} ${
                            selectedProducts.find((p) => p.id === product.id)
                              ? s.selected
                              : ""
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          <img
                            src={product.imageUrls?.[0] || "/placeholder.jpg"}
                            alt={product.title}
                            className={s.productImage}
                          />
                          <div className={s.productInfo}>
                            <h4 className={s.productTitle}>{product.title}</h4>
                            <p className={s.productPrice}>
                              {formatPrice(product.price)}
                            </p>
                            <p className={s.productCondition}>
                              {product.condition || "—"}
                            </p>
                          </div>
                          <div
                            className={`${s.radio} ${
                              selectedProducts.find((p) => p.id === product.id)
                                ? s.selected
                                : ""
                            }`}
                          >
                            {selectedProducts.find(
                              (p) => p.id === product.id
                            ) && <div className={s.radioInner}></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={s.modalActions}>
                  <button
                    className={s.compareButton}
                    onClick={handleCompareProducts}
                    disabled={selectedProducts.length !== 2 || isLoading}
                  >
                    {isLoading ? "Đang so sánh..." : "So sánh ngay"}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </section>
  );
};

export default CompareSection;
