import React, { useState, useEffect } from 'react';
import styles from './LaptopSaleAd.module.scss';

const LaptopSaleAd = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 11,
    seconds: 51,
    milliseconds: 46
  });

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds, milliseconds } = prevTime;
        
        if (milliseconds > 0) {
          milliseconds--;
        } else if (seconds > 0) {
          seconds--;
          milliseconds = 99;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
          milliseconds = 99;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
          milliseconds = 99;
        }
        
        return { hours, minutes, seconds, milliseconds };
      });
    }, 10);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time.toString().padStart(2, '0');

  const saleTabs = [
    { date: '12/08', time: '9h - 11h', active: true },
    { date: '13/08', time: '9h - 11h', active: false },
    { date: '14/08', time: '9h - 11h', active: false },
    { date: '15/08', time: '9h - 11h', active: false }
  ];

  const laptops = [
    {
      name: 'Laptop ASUS Vivobook 14 X1404VA-NK394W',
      specs: 'i3-1315U Intel UHD, 8GB 512GB, 14.0" Full HD',
      price: '8.630.000₫',
      originalPrice: '12.690.000₫',
      sold: 0,
      total: 5
    },
    {
      name: 'Laptop Dell Vostro 3530',
      specs: 'i5-1334U Intel UHD, 16GB 256GB, 15.6" Full HD',
      price: '12.990.000₫',
      originalPrice: '18.990.000₫',
      sold: 0,
      total: 5
    },
    {
      name: 'Laptop Dell Inspiron 15 3520',
      specs: 'i3-1315U Intel UHD, 8GB 512GB, 15.6" Full HD',
      price: '9.990.000₫',
      originalPrice: '14.990.000₫',
      sold: 0,
      total: 5
    },
    {
      name: 'Laptop Lenovo V14 G3 IAP',
      specs: 'i3-1315U Intel UHD, 8GB 512GB, 14.0" WUXGA',
      price: '7.990.000₫',
      originalPrice: '11.990.000₫',
      sold: 0,
      total: 5
    },
    {
      name: 'Laptop Lenovo IdeaPad Slim 3 OLED',
      specs: 'i5-1334U Intel UHD, 16GB 256GB, 14.0" WUXGA',
      price: '11.990.000₫',
      originalPrice: '16.990.000₫',
      sold: 0,
      total: 5
    }
  ];

  return (
    <div className={styles.laptopSaleAd}>
      {/* Header Banner */}
      <div className={styles.headerBanner}>
        <div className={styles.waveEffect}></div>
        <h1 className={styles.headerTitle}>LAPTOP GIẢM ĐẬM - CHẬM LÀ TIẾC</h1>
      </div>

      {/* Main Content Frame */}
      <div className={styles.mainFrame}>
        {/* Gift Box Icons */}
        <div className={styles.giftBoxTopLeft}></div>
        <div className={styles.giftBoxTopRight}></div>

        {/* Sale Schedule Tabs */}
        <div className={styles.saleSchedule}>
          {saleTabs.map((tab, index) => (
            <div 
              key={index} 
              className={`${styles.saleTab} ${tab.active ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.active && <div className={styles.giftIcon}></div>}
              <span className={styles.tabTime}>{tab.time}</span>
              <span className={styles.tabDate}>{tab.date}</span>
            </div>
          ))}
        </div>

        {/* Countdown Timer */}
        <div className={styles.countdownSection}>
          <span className={styles.countdownLabel}>BẮT ĐẦU SAU:</span>
          <div className={styles.countdownTimer}>
            <div className={styles.timeSegment}>
              <span className={styles.timeValue}>{formatTime(timeLeft.hours)}</span>
            </div>
            <span className={styles.timeSeparator}>:</span>
            <div className={styles.timeSegment}>
              <span className={styles.timeValue}>{formatTime(timeLeft.minutes)}</span>
            </div>
            <span className={styles.timeSeparator}>:</span>
            <div className={styles.timeSegment}>
              <span className={styles.timeValue}>{formatTime(timeLeft.seconds)}</span>
            </div>
            <span className={styles.timeSeparator}>:</span>
            <div className={styles.timeSegment}>
              <span className={styles.timeValue}>{formatTime(timeLeft.milliseconds)}</span>
            </div>
          </div>
        </div>

        {/* Product Listings */}
        <div className={styles.productSection}>
          <div className={styles.scrollArrow}></div>
          <div className={styles.productGrid}>
            {laptops.map((laptop, index) => (
              <div key={index} className={styles.productCard}>
                <div className={styles.laptopImage}>
                  <div className={styles.screenContent}></div>
                  <div className={styles.softwareIcons}>
                    <div className={styles.softwareIcon}>AI</div>
                    <div className={styles.softwareIcon}>Ps</div>
                    <div className={styles.softwareIcon}>Pr</div>
                    <div className={styles.softwareIcon}>W</div>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.specs}>{laptop.specs}</div>
                  <div className={styles.productName}>{laptop.name}</div>
                  <div className={styles.pricing}>
                    <span className={styles.currentPrice}>{laptop.price}</span>
                    <span className={styles.originalPrice}>{laptop.originalPrice}</span>
                  </div>
                  <div className={styles.salesProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${(laptop.sold / laptop.total) * 100}%` }}></div>
                      <div className={styles.runningMascot}></div>
                    </div>
                    <span className={styles.progressText}>Đã bán {laptop.sold}/{laptop.total} suất</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className={styles.footerDisclaimer}>
          Chỉ áp dụng thanh toán online thành công – Mỗi SĐT chỉ được mua 1 sản phẩm cùng loại
        </div>
      </div>
    </div>
  );
};

export default LaptopSaleAd;
