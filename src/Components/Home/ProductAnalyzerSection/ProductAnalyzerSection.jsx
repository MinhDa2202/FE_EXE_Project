import { useState } from "react";
import s from "./ProductAnalyzerSection.module.scss";

const ProductAnalyzerSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Fetch tất cả sản phẩm
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7235/api/Product", {
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
    setSelectedProduct(null);
    setShowAnalysis(false);
    setAnalysisResult(null);
  };

  // Chọn sản phẩm
  const handleProductSelect = (product) => {
    if (selectedProduct && selectedProduct.id === product.id) {
      setSelectedProduct(null); // Bỏ chọn nếu nhấn lại
    } else {
      setSelectedProduct(product); // Chọn sản phẩm mới
    }
  };

  // Phân tích sản phẩm
  const handleAnalyzeProduct = async () => {
    if (!selectedProduct) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7235/api/ProductAnalyzer/analyze`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: selectedProduct.id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
        setShowAnalysis(true);
      } else {
        const errorText = await response.text();
        console.error("Lỗi khi phân tích sản phẩm:", errorText);
        setAnalysisResult({ error: errorText });
        setShowAnalysis(true);
      }
    } catch (error) {
      console.error("Lỗi khi phân tích sản phẩm:", error);
      setAnalysisResult({ error: "Đã xảy ra lỗi không mong muốn." });
      setShowAnalysis(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse HTML/Markdown từ Gemini response
  const parseAnalysisResult = (result) => {
    if (!result) return "";
    if (result.error) return `<p class="error">${result.error}</p>`;

    try {
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        return result.candidates[0].content.parts[0].text
          .replace(/\n/g, "<br/>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      }
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
    }
    return "Không thể hiển thị kết quả phân tích.";
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section className={s.analyzerSection}>
      <div className={s.container}>
        <div className={s.header}>
          <h2 className={s.title}>Phân Tích Sản Phẩm Bằng AI</h2>
          <p className={s.description}>
            Chọn một sản phẩm để AI phân tích tình trạng chi tiết qua hình ảnh.
          </p>
        </div>

        <div className={s.analyzerCard}>
          <div className={s.cardContent}>
            <div className={s.analyzerIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12a10 10 0 0 0-7.07 2.93L12 22V12z"/></svg>
            </div>
            <h3 className={s.cardTitle}>Phân tích thông minh</h3>
            <p className={s.cardDescription}>
              Hiểu rõ hơn về tình trạng sản phẩm với công nghệ phân tích hình ảnh tiên tiến.
            </p>
          </div>
          <button className={s.analyzerButton} onClick={handleOpenModal}>
            Bắt đầu phân tích
          </button>
        </div>

        {isModalOpen && (
          <div className={s.modal}>
            <div className={s.modalOverlay} onClick={handleCloseModal}></div>
            <div className={s.modalContent}>
              <div className={s.modalHeader}>
                <h3>
                  {showAnalysis ? "Kết quả phân tích" : "Chọn sản phẩm để phân tích"}
                </h3>
                <button className={s.closeButton} onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              {showAnalysis ? (
                <div className={s.analysisResult}>
                  {selectedProduct && (
                    <div className={s.selectedProduct}>
                      <img
                        src={selectedProduct.imageUrls?.[0] || "/placeholder.jpg"}
                        alt={selectedProduct.title}
                        className={s.productImage}
                      />
                      <div className={s.productInfo}>
                        <h4>{selectedProduct.title}</h4>
                        <p className={s.price}>{formatPrice(selectedProduct.price)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className={s.analysisContent}>
                    {isLoading ? (
                      <div className={s.loading}>Đang phân tích...</div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: parseAnalysisResult(analysisResult),
                        }}
                      />
                    )}
                  </div>
                  
                  <div className={s.modalActions}>
                    <button
                      className={s.backButton}
                      onClick={() => {
                        setShowAnalysis(false);
                        setAnalysisResult(null);
                      }}
                    >
                      Chọn lại sản phẩm
                    </button>
                  </div>
                </div>
              ) : (
                <div className={s.modalBody}>
                  <div className={s.selectedInfo}>
                    <p>Đã chọn: {selectedProduct ? "1" : "0"}/1 sản phẩm</p>
                    {selectedProduct && (
                      <div className={s.selectedList}>
                        <span className={s.selectedTag}>
                          {selectedProduct.title}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={s.productList}>
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className={`${s.productItem} ${
                          selectedProduct && selectedProduct.id === product.id
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
                        <div className={`${s.radio} ${selectedProduct && selectedProduct.id === product.id ? s.selected : ""}`}>
                          {selectedProduct && selectedProduct.id === product.id && (
                            <div className={s.radioInner}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={s.modalActions}>
                <button
                  className={s.analyzerButton}
                  onClick={handleAnalyzeProduct}
                  disabled={!selectedProduct || isLoading}
                >
                  {isLoading ? "Đang phân tích..." : "Phân tích ngay"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductAnalyzerSection;