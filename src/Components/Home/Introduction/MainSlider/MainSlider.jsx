import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { gamingLaptop } from "src/Assets/Images/Images";
import s from "./MainSlider.module.scss";

function MainSlider() {
  const { t } = useTranslation();

  return (
    <section className={s.heroBanner}>
      <div className={s.heroContainer}>
        {/* Left Side - Content */}
        <div className={s.heroContent}>
          <div className={s.heroBadge}>
            <span className={s.badgeIcon}>🔥</span>
            <span className={s.badgeText}>Flash Sale - Up to 70% Off</span>
          </div>
          
          <h1 className={s.heroTitle}>
            Discover Amazing
            <span className={s.highlightText}> Tech Products</span>
          </h1>
          
          <p className={s.heroDescription}>
            Find everything you need at unbeatable prices.
          </p>
          
          <div className={s.heroActions}>
            <Link to="/products" className={s.ctaButton}>
              <span className={s.buttonText}>Shop Now</span>
              <span className={s.buttonIcon}>→</span>
            </Link>
            
            <button className={s.secondaryButton}>
              <span className={s.buttonIcon}>▶</span>
              <span className={s.buttonText}>Watch Demo</span>
            </button>
          </div>
          
          <div className={s.heroStats}>
            <div className={s.statItem}>
              <span className={s.statNumber}>10K+</span>
              <span className={s.statLabel}>Happy Customers</span>
            </div>
            <div className={s.statItem}>
              <span className={s.statNumber}>500+</span>
              <span className={s.statLabel}>Products</span>
            </div>
            <div className={s.statItem}>
              <span className={s.statNumber}>24/7</span>
              <span className={s.statLabel}>Support</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Product Showcase */}
        <div className={s.heroVisual}>
          <div className={s.productShowcase}>
            <div className={s.mainProduct}>
              <img 
                src={gamingLaptop} 
                alt="Gaming Laptop" 
                className={s.productImage}
              />
              <div className={s.floatingBadge}>
                <span className={s.discountText}>-30%</span>
              </div>
            </div>
            
            <div className={s.floatingElements}>
              <div className={`${s.floatingCard} ${s.floatingCard1}`}>
                <div className={s.cardIcon}>💻</div>
                <div className={s.cardText}>Gaming Laptop</div>
              </div>
              <div className={`${s.floatingCard} ${s.floatingCard2}`}>
                <div className={s.cardIcon}>📱</div>
                <div className={s.cardText}>Smartphone</div>
              </div>
              <div className={`${s.floatingCard} ${s.floatingCard3}`}>
                <div className={s.cardIcon}>🎮</div>
                <div className={s.cardText}>Gaming Gear</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainSlider;
