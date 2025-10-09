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
    // TODO: Replace with real API call to get personalized recommendations
    // For now, return empty array to indicate no mock data
    return [];
  };

  const generateTrendingRecommendations = () => {
    // TODO: Replace with real API call to get trending products
    // For now, return empty array to indicate no mock data
    return [];
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
            <div className={s.emptyIcon}>✨</div>
            <h3>Đang chuẩn bị đề xuất cho bạn</h3>
            <p>Hãy khám phá thêm sản phẩm để nhận đề xuất phù hợp nhất</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SmartRecommendations;
