import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  gamingLaptop, 
  productImg1, 
  productImg2, 
  productImg3, 
  ps5, 
  stereo 
} from 'src/Assets/Images/Images';

const FlashSaleBanner = () => {
  // Featured Products Data - 6 products with available images
  const featuredProducts = [
    {
      id: 1,
      name: "Gaming Laptop Pro",
      brand: "GamingTech",
      price: "35.000.000₫",
      originalPrice: "60.000.000₫",
      discount: "-50%",
      image: gamingLaptop,
      rating: 4.8,
      reviews: 542,
      badge: "New"
    },
    {
      id: 2,
      name: "Premium Product 1",
      brand: "Brand A",
      price: "28.000.000₫",
      originalPrice: "56.000.000₫",
      discount: "-50%",
      image: productImg1,
      rating: 4.8,
      reviews: 289,
      badge: "Hot"
    },
    {
      id: 3,
      name: "Premium Product 2",
      brand: "Brand B",
      price: "8.500.000₫",
      originalPrice: "17.000.000₫",
      discount: "-50%",
      image: productImg2,
      rating: 4.8,
      reviews: 198,
      badge: "Sale"
    },
    {
      id: 4,
      name: "Premium Product 3",
      brand: "Brand C",
      price: "2.500.000₫",
      originalPrice: "5.000.000₫",
      discount: "-50%",
      image: productImg3,
      rating: 4.9,
      reviews: 156,
      badge: "Best"
    },
    {
      id: 5,
      name: "PlayStation 5",
      brand: "Sony",
      price: "12.000.000₫",
      originalPrice: "24.000.000₫",
      discount: "-50%",
      image: ps5,
      rating: 4.7,
      reviews: 89,
      badge: "Hot"
    },
    {
      id: 6,
      name: "Premium Audio System",
      brand: "AudioTech",
      price: "45.000.000₫",
      originalPrice: "90.000.000₫",
      discount: "-50%",
      image: stereo,
      rating: 4.9,
      reviews: 234,
      badge: "Premium"
    }
  ];

  // Product Categories
  const categories = [
    { name: "Smartphones", icon: "📱", count: "150+", color: "#3b82f6" },
    { name: "Laptops", icon: "💻", count: "80+", color: "#10b981" },
    { name: "Audio", icon: "🎧", count: "120+", color: "#f59e0b" },
    { name: "Gaming", icon: "🎮", count: "95+", color: "#ef4444" }
  ];

  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 20,
    minutes: 20,
    seconds: 7
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time.toString().padStart(2, '0');

  return (
    <div style={{
      width: '100%',
      padding: '3rem 0',
      margin: '3rem 0',
      position: 'relative',
    }}>
      {/* Main Container */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          {/* Left Side - Title and Description */}
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '1.5rem',
            }}>
              <span>⚡</span>
              <span>Featured Products</span>
            </div>
            
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#1f2937',
              margin: '0 0 1rem 0',
              lineHeight: 1.1,
            }}>
              Discover Amazing
              <span style={{ color: '#3b82f6', marginLeft: '0.5rem' }}>Products</span>
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              lineHeight: 1.6,
              margin: 0,
            }}>
              Explore our curated collection of premium products with exclusive deals and discounts.
            </p>
          </div>

          {/* Right Side - Flash Sale Countdown */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            minWidth: '200px',
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#9ca3af',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textAlign: 'center',
            }}>
              Flash Sale Ends In:
            </div>
            
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}>
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  minWidth: '40px',
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#1f2937',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{formatTime(value)}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#9ca3af',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}>{unit.slice(0, 1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1f2937',
            margin: '0 0 1.5rem 0',
          }}>
            Shop by Category
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {categories.map((category, index) => (
              <Link 
                key={index}
                to="/products" 
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: category.color,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'white',
                }}>
                  {category.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: '0.25rem',
                  }}>
                    {category.name}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                  }}>
                    {category.count} Products
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products Grid Section */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1f2937',
              margin: 0,
            }}>
              Featured Products
            </h3>
            
            <Link to="/products" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
            }}
            >
              View All Products
              <span>→</span>
            </Link>
          </div>
          
          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {featuredProducts.map((product) => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
              }}
              >
                {/* Product Badges */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  zIndex: 10,
                }}>
                  <div style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    {product.discount}
                  </div>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    {product.badge}
                  </div>
                </div>

                {/* Product Image */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  marginTop: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}>
                    {product.name}
                  </div>
                  
                  <div style={{
                    fontSize: '1rem',
                    color: '#6b7280',
                    marginBottom: '1rem',
                  }}>
                    {product.brand}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '0.25rem',
                    }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{
                          color: i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db',
                          fontSize: '1rem',
                        }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                    }}>
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}>
                    <span style={{
                      fontSize: '1.3rem',
                      fontWeight: 900,
                      color: '#ef4444',
                    }}>
                      {product.price}
                    </span>
                    <span style={{
                      fontSize: '1rem',
                      color: '#9ca3af',
                      textDecoration: 'line-through',
                    }}>
                      {product.originalPrice}
                    </span>
                  </div>
                  
                  <button style={{
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: '200px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
