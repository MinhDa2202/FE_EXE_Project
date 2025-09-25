import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import s from '../../../SmartRecommendations/SmartRecommendations.module.scss';

const SmartRecommendations = ({ title = "Đề xuất cho bạn", maxItems = 6 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get user's viewing history and preferences from Redux
  const { searchProducts, favoritesProducts, wishList } = useSelector((state) => state?.products || {});
  const { isLoggedIn } = useSelector((state) => state?.auth || {});

  useEffect(() => {
    generateRecommendations();
  }, [searchProducts, favoritesProducts, wishList, isLoggedIn]);

  const generateRecommendations = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let suggestions = [];
      
      if (isLoggedIn) {
        // If user is logged in, use their data for personalized recommendations
        const userInterests = analyzeUserInterests();
        suggestions = generatePersonalizedRecommendations(userInterests);
      } else {
        // For anonymous users, show trending/popular products
        suggestions = generateTrendingRecommendations();
      }
      
      setRecommendations(suggestions.slice(0, maxItems));
      setIsLoading(false);
    }, 800);
  };

  const analyzeUserInterests = () => {
    const interests = {
      categories: {},
      priceRange: { min: Infinity, max: 0 },
      brands: {},
      totalViews: 0
    };

    // Analyze search history
    if (searchProducts && searchProducts.length > 0) {
      searchProducts.forEach(product => {
        if (product.category) {
          interests.categories[product.category] = (interests.categories[product.category] || 0) + 1;
        }
        if (product.price) {
          interests.priceRange.min = Math.min(interests.priceRange.min, product.price);
          interests.priceRange.max = Math.max(interests.priceRange.max, product.price);
        }
        if (product.brand) {
          interests.brands[product.brand] = (interests.brands[product.brand] || 0) + 1;
        }
        interests.totalViews++;
      });
    }

    // Analyze favorites and wishlist
    [...(favoritesProducts || []), ...(wishList || [])].forEach(product => {
      if (product.category) {
        interests.categories[product.category] = (interests.categories[product.category] || 0) + 2; // Higher weight
      }
      if (product.brand) {
        interests.brands[product.brand] = (interests.brands[product.brand] || 0) + 2;
      }
    });

    return interests;
  };

  const generatePersonalizedRecommendations = (interests) => {
    // Mock personalized recommendations based on user interests
    const mockProducts = [
      {
        id: 1,
        name: 'Máy tính xách tay chơi game Pro',
        price: 25000000,
        originalPrice: 30000000,
        discount: 17,
        image: '/src/Assets/Products/gaming-laptop/gaming-laptop-thum1.webp',
        category: 'Điện tử',
        brand: 'Gaming',
        rating: 4.8,
        reviews: 156,
        isNew: false,
        isHot: true
      },
      {
        id: 2,
        name: 'Chuột chơi game không dây',
        price: 1200000,
        originalPrice: 1500000,
        discount: 20,
        image: '/src/Assets/Products/wired-keyboard/wired-keyboard-thum1.webp',
        category: 'Điện tử',
        brand: 'Gaming',
        rating: 4.6,
        reviews: 89,
        isNew: true,
        isHot: false
      },
      {
        id: 3,
        name: 'Màn hình chơi game 4K',
        price: 8500000,
        originalPrice: 10000000,
        discount: 15,
        image: '/src/Assets/Products/gaming-monitor/gaming-monitor-thum1.webp',
        category: 'Điện tử',
        brand: 'Gaming',
        rating: 4.9,
        reviews: 234,
        isNew: false,
        isHot: true
      },
      {
        id: 4,
        name: 'Bàn phím cơ RGB',
        price: 2800000,
        originalPrice: 3500000,
        discount: 20,
        image: '/src/Assets/Products/wired-keyboard/wired-keyboard-thum2.webp',
        category: 'Điện tử',
        brand: 'Gaming',
        rating: 4.7,
        reviews: 167,
        isNew: true,
        isHot: false
      },
      {
        id: 5,
        name: 'Tai nghe chơi game Pro',
        price: 1800000,
        originalPrice: 2200000,
        discount: 18,
        image: '/src/Assets/Products/ps5-gamepad/ps5-gamepad-thum1.webp',
        category: 'Điện tử',
        brand: 'Gaming',
        rating: 4.5,
        reviews: 98,
        isNew: false,
        isHot: true
      },
      {
        id: 6,
        name: 'Ghế chơi game RGB',
        price: 4500000,
        originalPrice: 5500000,
        discount: 18,
        image: '/src/Assets/Products/comfort-chair/comfort-chair-thum1.webp',
        category: 'Nội thất',
        brand: 'Gaming',
        rating: 4.6,
        reviews: 76,
        isNew: true,
        isHot: false
      }
    ];

    // Sort by relevance score (mock algorithm)
    return mockProducts.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      
      // Category preference
      if (interests.categories[a.category]) scoreA += interests.categories[a.category] * 10;
      if (interests.categories[b.category]) scoreB += interests.categories[b.category] * 10;
      
      // Brand preference
      if (interests.brands[a.brand]) scoreA += interests.brands[a.brand] * 5;
      if (interests.brands[b.brand]) scoreB += interests.brands[b.brand] * 5;
      
      // Price range preference
      if (a.price >= interests.priceRange.min && a.price <= interests.priceRange.max) scoreA += 3;
      if (b.price >= interests.priceRange.min && b.price <= interests.priceRange.max) scoreB += 3;
      
      // Popularity factors
      scoreA += a.rating + (a.reviews / 100) + (a.isHot ? 2 : 0) + (a.isNew ? 1 : 0);
      scoreB += b.rating + (b.reviews / 100) + (b.isHot ? 2 : 0) + (b.isNew ? 1 : 0);
      
      return scoreB - scoreA;
    });
  };

  const generateTrendingRecommendations = () => {
    // Mock trending products for anonymous users
    return [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        price: 35000000,
        originalPrice: 40000000,
        discount: 12,
        image: '/src/Assets/Products/gaming-laptop/gaming-laptop-thum2.webp',
        category: 'Điện tử',
        brand: 'Apple',
        rating: 4.9,
        reviews: 342,
        isNew: true,
        isHot: true
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24',
        price: 28000000,
        originalPrice: 32000000,
        discount: 12,
        image: '/src/Assets/Products/canon-camera/canon-camera-thum1.webp',
        category: 'Điện tử',
        brand: 'Samsung',
        rating: 4.8,
        reviews: 289,
        isNew: true,
        isHot: true
      },
      {
        id: 3,
        name: 'MacBook Air M3',
        price: 42000000,
        originalPrice: 48000000,
        discount: 12,
        image: '/src/Assets/Products/gaming-laptop/gaming-laptop-thum3.webp',
        category: 'Điện tử',
        brand: 'Apple',
        rating: 4.9,
        reviews: 198,
        isNew: true,
        isHot: false
      }
    ];
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (isLoading) {
    return (
      <section className={s.section}>
        <div className="container">
          <div className={s.header}>
            <h2>{title}</h2>
            <div className={s.loadingIndicator}>
              <div className={s.spinner}></div>
              <span>Đang phân tích sở thích...</span>
            </div>
          </div>
          <div className={s.skeletonGrid}>
            {[...Array(maxItems)].map((_, index) => (
              <div key={index} className={s.skeletonCard}>
                <div className={s.skeletonImage}></div>
                <div className={s.skeletonContent}>
                  <div className={s.skeletonTitle}></div>
                  <div className={s.skeletonPrice}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={s.section}>
      <div className="container">
        <div className={s.header}>
          <h2>{title}</h2>
          <p className={s.subtitle}>
            {isLoggedIn 
              ? 'Dựa trên sở thích và lịch sử xem của bạn' 
              : 'Sản phẩm đang được ưa chuộng nhất'
            }
          </p>
        </div>
        
        <div className={s.recommendationsGrid}>
          {recommendations.map((product) => (
            <div 
              key={product.id} 
              className={s.productCard}
              onClick={() => handleProductClick(product.id)}
            >
              <div className={s.imageContainer}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className={s.productImage}
                  loading="lazy"
                />
                {product.discount > 0 && (
                  <div className={s.discountBadge}>
                    -{product.discount}%
                  </div>
                )}
                {product.isNew && (
                  <div className={s.newBadge}>Mới</div>
                )}
                {product.isHot && (
                  <div className={s.hotBadge}>Hot</div>
                )}
              </div>
              
              <div className={s.productInfo}>
                <h3 className={s.productName}>{product.name}</h3>
                <div className={s.brandCategory}>
                  <span className={s.brand}>{product.brand}</span>
                  <span className={s.category}>{product.category}</span>
                </div>
                
                <div className={s.priceSection}>
                  <span className={s.currentPrice}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className={s.originalPrice}>
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className={s.ratingSection}>
                  <div className={s.stars}>
                    {[...Array(5)].map((_, index) => (
                      <span 
                        key={index} 
                        className={`${s.star} ${index < Math.floor(product.rating) ? s.filled : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={s.rating}>{product.rating}</span>
                  <span className={s.reviews}>({product.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recommendations.length === 0 && (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>🔍</div>
            <h3>Chưa có đề xuất</h3>
            <p>Hãy xem thêm sản phẩm để nhận đề xuất phù hợp</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SmartRecommendations;
