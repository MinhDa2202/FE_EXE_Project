import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('main'); // 'main', 'compare', 'analyze', 'chat'
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChat = () => {
    setOpen(!open);
    if (!open) {
      setCurrentMode('main');
      setSelectedProducts([]);
      setSelectedProduct(null);
      setComparisonResult(null);
      setAnalysisResult(null);
      setShowResult(false);
    }
    if (!open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Allow external toggle via header AI button
  useEffect(() => {
    const handler = () => setOpen(prev => !prev);
    window.addEventListener('chat:toggle', handler);
    return () => window.removeEventListener('chat:toggle', handler);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMode, selectedProducts, selectedProduct]);

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

  // Chọn/bỏ chọn sản phẩm cho so sánh
  const handleProductSelectForCompare = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else if (selectedProducts.length < 2) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // Chọn sản phẩm cho phân tích
  const handleProductSelectForAnalysis = (product) => {
    if (selectedProduct && selectedProduct.id === product.id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };

  // So sánh sản phẩm
  const handleCompareProducts = async () => {
    if (selectedProducts.length !== 2) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7235/api/Product/compare/${selectedProducts[0].id}/${selectedProducts[1].id}`,
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
        setShowResult(true);
      } else {
        console.error("Lỗi khi so sánh sản phẩm:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi so sánh sản phẩm:", error);
    } finally {
      setIsLoading(false);
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
        setShowResult(true);
      } else {
        const errorText = await response.text();
        console.error("Lỗi khi phân tích sản phẩm:", errorText);
        setAnalysisResult({ error: errorText });
        setShowResult(true);
      }
    } catch (error) {
      console.error("Lỗi khi phân tích sản phẩm:", error);
      setAnalysisResult({ error: "Đã xảy ra lỗi không mong muốn." });
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse HTML/Markdown từ Gemini response
  const parseResult = (result) => {
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
    return "Không thể hiển thị kết quả.";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Chat functions
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      from: 'user',
      text: input,
      timestamp: getCurrentTime(),
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('https://localhost:7235/api/Ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      const data = await res.json();
      
      let aiReply;
      
      if (data && data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          aiReply = candidate.content.parts[0].text;
        } else {
          aiReply = 'Không nhận được phản hồi từ AI.';
        }
      } else {
        aiReply = 'Không nhận được phản hồi từ AI.';
      }
      
      if (!aiReply || aiReply.trim() === '') {
        aiReply = JSON.stringify(data, null, 2);
      }

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          from: 'ai',
          text: aiReply,
          timestamp: getCurrentTime(),
          id: Date.now() + 1
        }]);
      }, 1000);

    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          from: 'ai',
          text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          timestamp: getCurrentTime(),
          id: Date.now() + 1
        }]);
      }, 1000);
    }
  };

  const renderMainMenu = () => (
    <div style={{
      textAlign: 'center',
      padding: '40px 20px',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤖</div>
      <div style={{
        color: '#2d3748',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '8px'
      }}>
        Trợ lý AI - Recloop Mart
      </div>
      <div style={{
        color: '#64748b',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '24px'
      }}>
        Tôi có thể giúp bạn so sánh sản phẩm và phân tích tình trạng<br />
        bằng công nghệ AI tiên tiến. Hãy chọn chức năng bạn muốn!
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={() => {
            setCurrentMode('compare');
            fetchProducts();
          }}
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
        >
          🔍 So Sánh Sản Phẩm
        </button>
        
        <button
          onClick={() => {
            setCurrentMode('analyze');
            fetchProducts();
          }}
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(240, 147, 251, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(240, 147, 251, 0.3)';
          }}
        >
          🧠 Phân Tích Sản Phẩm Bằng AI
        </button>

        <button
          onClick={() => setCurrentMode('chat')}
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
        >
          💬 Chat với AI
        </button>
      </div>
    </div>
  );

  const renderCompareMode = () => (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>🔍 So Sánh Sản Phẩm</h3>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          Chọn 2 sản phẩm để so sánh chi tiết
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          background: '#f8fafc',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '16px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>
            Đã chọn: {selectedProducts.length}/2 sản phẩm
          </p>
          {selectedProducts.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedProducts.map((product) => (
                <span key={product.id} style={{
                  padding: '4px 8px',
                  background: '#667eea',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {product.title}
                </span>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Đang tải sản phẩm...
          </div>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelectForCompare(product)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: selectedProducts.find((p) => p.id === product.id) ? '#f0f9ff' : '#fff',
                  borderColor: selectedProducts.find((p) => p.id === product.id) ? '#0ea5e9' : '#e2e8f0'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = selectedProducts.find((p) => p.id === product.id) ? '#e0f2fe' : '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = selectedProducts.find((p) => p.id === product.id) ? '#f0f9ff' : '#fff';
                }}
              >
                <img
                  src={product.imageUrls?.[0] || "/placeholder.jpg"}
                  alt={product.title}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    marginRight: '12px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>
                    {product.title}
                  </h4>
                  <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#64748b' }}>
                    {formatPrice(product.price)}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                    {product.condition || "—"}
                  </p>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid #cbd5e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selectedProducts.find((p) => p.id === product.id) ? '#667eea' : 'transparent'
                }}>
                  {selectedProducts.find((p) => p.id === product.id) && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#fff'
                    }}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setCurrentMode('main')}
          style={{
            padding: '12px 20px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Quay lại
        </button>
        
        <button
          onClick={handleCompareProducts}
          disabled={selectedProducts.length !== 2 || isLoading}
          style={{
            flex: 1,
            padding: '12px 20px',
            background: selectedProducts.length === 2 && !isLoading 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#e2e8f0',
            border: 'none',
            borderRadius: '8px',
            color: selectedProducts.length === 2 && !isLoading ? '#fff' : '#94a3b8',
            cursor: selectedProducts.length === 2 && !isLoading ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {isLoading ? "Đang so sánh..." : "So sánh ngay"}
        </button>
      </div>
    </div>
  );

  const renderAnalyzeMode = () => (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: '#fff',
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>🧠 Phân Tích Sản Phẩm Bằng AI</h3>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          Chọn 1 sản phẩm để AI phân tích tình trạng
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          background: '#f8fafc',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '16px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>
            Đã chọn: {selectedProduct ? 1 : 0}/1 sản phẩm
          </p>
          {selectedProduct && (
            <span style={{
              padding: '4px 8px',
              background: '#f093fb',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {selectedProduct.title}
            </span>
          )}
        </div>

        {isLoading && !products.length ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Đang tải sản phẩm...
          </div>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelectForAnalysis(product)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: selectedProduct?.id === product.id ? '#fdf2f8' : '#fff',
                  borderColor: selectedProduct?.id === product.id ? '#ec4899' : '#e2e8f0'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = selectedProduct?.id === product.id ? '#fce7f3' : '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = selectedProduct?.id === product.id ? '#fdf2f8' : '#fff';
                }}
              >
                <img
                  src={product.imageUrls?.[0] || "/placeholder.jpg"}
                  alt={product.title}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    marginRight: '12px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>
                    {product.title}
                  </h4>
                  <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#64748b' }}>
                    {formatPrice(product.price)}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                    {product.condition || "—"}
                  </p>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid #cbd5e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selectedProduct?.id === product.id ? '#f093fb' : 'transparent'
                }}>
                  {selectedProduct?.id === product.id && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#fff'
                    }}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setCurrentMode('main')}
          style={{
            padding: '12px 20px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Quay lại
        </button>
        
        <button
          onClick={handleAnalyzeProduct}
          disabled={!selectedProduct || isLoading}
          style={{
            flex: 1,
            padding: '12px 20px',
            background: selectedProduct && !isLoading 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : '#e2e8f0',
            border: 'none',
            borderRadius: '8px',
            color: selectedProduct && !isLoading ? '#fff' : '#94a3b8',
            cursor: selectedProduct && !isLoading ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {isLoading ? "Đang phân tích..." : "Phân tích ngay"}
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    const isCompareMode = currentMode === 'compare';
    const result = isCompareMode ? comparisonResult : analysisResult;
    const selectedItems = isCompareMode ? selectedProducts : [selectedProduct].filter(Boolean);

    return (
      <div>
        <div style={{
          background: isCompareMode 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
            {isCompareMode ? '🔍 Kết quả so sánh' : '🧠 Kết quả phân tích'}
          </h3>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '16px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>
              Sản phẩm đã chọn:
            </h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {selectedItems.map((product) => (
                <div key={product.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <img
                    src={product.imageUrls?.[0] || "/placeholder.jpg"}
                    alt={product.title}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
                      {product.title}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#fff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            minHeight: '200px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                {isCompareMode ? 'Đang so sánh...' : 'Đang phân tích...'}
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: parseResult(result)
                }}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#1e293b'
                }}
              />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              setShowResult(false);
              setComparisonResult(null);
              setAnalysisResult(null);
            }}
            style={{
              padding: '12px 20px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Chọn lại sản phẩm
          </button>
          
          <button
            onClick={() => setCurrentMode('main')}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Về menu chính
          </button>
        </div>
      </div>
    );
  };

  const renderChatMode = () => (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>💬 Chat với AI</h3>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          Hỏi đáp mọi thứ với AI thông minh
        </p>
      </div>

      {/* Messages */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '20px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>👋</div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              Chào mừng đến với AI Assistant!
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              Hãy bắt đầu cuộc trò chuyện với tôi
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: 'flex',
                marginBottom: '16px',
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start'
              }}>
                {msg.from === 'ai' && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '50%',
                    marginRight: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}>
                    🤖
                  </div>
                )}
                
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.from === 'user'
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : '#f1f5f9',
                    color: msg.from === 'user' ? '#fff' : '#1e293b',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    wordWrap: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                  
                  {msg.timestamp && (
                    <div style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      marginTop: '4px',
                      textAlign: msg.from === 'user' ? 'right' : 'left',
                      paddingLeft: msg.from === 'ai' ? '8px' : '0',
                      paddingRight: msg.from === 'user' ? '8px' : '0'
                    }}>
                      {msg.timestamp}
                    </div>
                  )}
                </div>
                
                {msg.from === 'user' && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                    borderRadius: '50%',
                    marginLeft: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4a5568',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    👤
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div style={{
                display: 'flex',
                marginBottom: '16px',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  marginRight: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  🤖
                </div>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: '#94a3b8',
                    borderRadius: '50%',
                    animation: 'typingDot 1.4s infinite ease-in-out'
                  }}></div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: '#94a3b8',
                    borderRadius: '50%',
                    animation: 'typingDot 1.4s infinite ease-in-out 0.2s'
                  }}></div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: '#94a3b8',
                    borderRadius: '50%',
                    animation: 'typingDot 1.4s infinite ease-in-out 0.4s'
                  }}></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat input */}
      <form onSubmit={sendMessage} style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhắn tin với AI..."
            disabled={isTyping}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            style={{
              padding: '12px 16px',
              background: input.trim() && !isTyping 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : '#e2e8f0',
              border: 'none',
              borderRadius: '24px',
              color: input.trim() && !isTyping ? '#fff' : '#94a3b8',
              cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Gửi
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setCurrentMode('main')}
          style={{
            padding: '12px 20px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Quay lại
        </button>
      </div>
    </div>
  );

  return (
    <>
      {open && (
        <div className="chat-widget" style={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          width: 480,
          height: 600,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 9999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 40,
                height: 40,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                🤖
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>
                  Trợ lý AI
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  opacity: 0.9
                }}>
                  So sánh & Phân tích sản phẩm
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            padding: '24px 20px',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            scrollBehavior: 'smooth'
          }}>
            {currentMode === 'main' && renderMainMenu()}
            {currentMode === 'compare' && !showResult && renderCompareMode()}
            {currentMode === 'analyze' && !showResult && renderAnalyzeMode()}
            {showResult && renderResult()}
            {currentMode === 'chat' && renderChatMode()}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <button
        className="chat-button"
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" fill="#fff" viewBox="0 0 24 24">
          <path d="M12 3C6.48 3 2 6.97 2 12c0 1.86.63 3.58 1.69 5L2 21l4.34-1.38C8.42 20.37 10.16 21 12 21c5.52 0 10-3.97 10-9s-4.48-9-10-9z"/>
        </svg>
      </button>

      <style>{`
        @keyframes chatSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.9);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes typingDot {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
        
        @media (max-width: 480px) {
          .chat-widget {
            width: calc(100vw - 20px) !important;
            height: calc(100vh - 100px) !important;
            bottom: 80px !important;
            right: 10px !important;
            left: 10px !important;
            border-radius: 16px !important;
          }
          
          .chat-button {
            width: 56px !important;
            height: 56px !important;
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
