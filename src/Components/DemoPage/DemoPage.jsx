import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SmartRecommendations from '../Shared/Sections/SmartRecommendations/SmartRecommendations';
import SpinWheel from '../Shared/PopUps/SpinWheel/SpinWheel';
import s from './DemoPage.module.scss';

const DemoPage = () => {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);

  const handleSpinWheelOpen = () => {
    setIsSpinWheelOpen(true);
  };

  const handleSpinWheelClose = () => {
    setIsSpinWheelOpen(false);
  };

  const handleSpinComplete = (prize) => {
    console.log('🎉 Spin completed! Prize:', prize);
    // Here you can add logic to apply the discount or show notification
    setTimeout(() => {
      setIsSpinWheelOpen(false);
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Demo - Recloop Mart</title>
        <meta
          name="description"
          content="Demo page showcasing all the new user retention features and components"
        />
      </Helmet>

      <main className={s.demoPage}>
        <div className={s.container}>
          <header className={s.pageHeader}>
            <h1>🚀 Demo - Tính năng giữ chân người dùng</h1>
            <p>Khám phá các tính năng mới được tích hợp vào ứng dụng</p>
          </header>

          <section className={s.featuresSection}>
            <h2>✨ Các tính năng chính</h2>
            
            <div className={s.featuresGrid}>
              <div className={s.featureCard}>
                <div className={s.featureIcon}>🎰</div>
                <h3>Vòng quay may mắn</h3>
                <p>Mini game hấp dẫn với phần thưởng giảm giá và miễn phí vận chuyển</p>
                <button 
                  className={s.demoButton}
                  onClick={handleSpinWheelOpen}
                >
                  🎯 Thử ngay!
                </button>
              </div>

              <div className={s.featureCard}>
                <div className={s.featureIcon}>🤖</div>
                <h3>Chatbot tư vấn</h3>
                <p>Hỗ trợ khách hàng 24/7 với AI thông minh, tích hợp góc dưới màn hình</p>
                <div className={s.featureStatus}>
                  <span className={s.statusActive}>✅ Đã tích hợp</span>
                </div>
              </div>

              <div className={s.featureCard}>
                <div className={s.featureIcon}>💡</div>
                <h3>Đề xuất cho bạn</h3>
                <p>Gợi ý sản phẩm dựa trên lịch sử xem và sở thích cá nhân</p>
                <div className={s.featureStatus}>
                  <span className={s.statusActive}>✅ Đã tích hợp</span>
                </div>
              </div>

              <div className={s.featureCard}>
                <div className={s.featureIcon}>❤️</div>
                <h3>Wishlist</h3>
                <p>Lưu trữ sản phẩm yêu thích để mua sau</p>
                <div className={s.featureStatus}>
                  <span className={s.statusActive}>✅ Đã tích hợp</span>
                </div>
              </div>

              <div className={s.featureCard}>
                <div className={s.featureIcon}>🔔</div>
                <h3>Thông báo đẩy</h3>
                <p>Nhận thông báo về khuyến mãi và sản phẩm mới</p>
                <div className={s.featureStatus}>
                  <span className={s.statusPending}>⏳ Đang phát triển</span>
                </div>
              </div>

              <div className={s.featureCard}>
                <div className={s.featureIcon}>📱</div>
                <h3>Responsive Design</h3>
                <p>Giao diện tối ưu cho mọi thiết bị với UX/UI hiện đại</p>
                <div className={s.featureStatus}>
                  <span className={s.statusActive}>✅ Đã tích hợp</span>
                </div>
              </div>
            </div>
          </section>

          <section className={s.componentsSection}>
            <h2>🧩 Components demo</h2>
            
            <div className={s.componentDemo}>
              <h3>Smart Recommendations</h3>
              <p>Component gợi ý sản phẩm thông minh dựa trên hành vi người dùng</p>
              <SmartRecommendations />
            </div>
          </section>

          <section className={s.instructionsSection}>
            <h2>📋 Hướng dẫn sử dụng</h2>
            
            <div className={s.instructionsGrid}>
              <div className={s.instructionCard}>
                <h4>🎰 Vòng quay may mắn</h4>
                <ol>
                  <li>Nhấn vào nút 🎰 trên header</li>
                  <li>Chọn "Quay ngay!" để bắt đầu</li>
                  <li>Chờ vòng quay dừng và nhận phần thưởng</li>
                  <li>Sử dụng mã giảm giá khi mua hàng</li>
                </ol>
              </div>

              <div className={s.instructionCard}>
                <h4>🤖 Chatbot</h4>
                <ol>
                  <li>Nhấn vào icon chat góc dưới màn hình</li>
                  <li>Nhập câu hỏi hoặc yêu cầu hỗ trợ</li>
                  <li>Nhận phản hồi tự động từ AI</li>
                  <li>Chatbot hoạt động 24/7</li>
                </ol>
              </div>

              <div className={s.instructionCard}>
                <h4>💡 Đề xuất cho bạn</h4>
                <ol>
                  <li>Đăng nhập để có đề xuất cá nhân hóa</li>
                  <li>Xem sản phẩm để cải thiện gợi ý</li>
                  <li>Thêm vào wishlist để tối ưu hóa</li>
                  <li>Khám phá sản phẩm mới phù hợp</li>
                </ol>
              </div>
            </div>
          </section>

          <section className={s.techSection}>
            <h2>⚙️ Công nghệ sử dụng</h2>
            
            <div className={s.techGrid}>
              <div className={s.techItem}>
                <span className={s.techIcon}>⚛️</span>
                <span>React 18 + Hooks</span>
              </div>
              <div className={s.techItem}>
                <span className={s.techIcon}>🎨</span>
                <span>SCSS Modules</span>
              </div>
              <div className={s.techItem}>
                <span className={s.techIcon}>🔄</span>
                <span>Redux Toolkit</span>
              </div>
              <div className={s.techItem}>
                <span className={s.techIcon}>📱</span>
                <span>Responsive Design</span>
              </div>
              <div className={s.techItem}>
                <span className={s.techIcon}>🎭</span>
                <span>CSS Animations</span>
              </div>
              <div className={s.techItem}>
                <span className={s.techIcon}>🌐</span>
                <span>i18n Internationalization</span>
              </div>
            </div>
          </section>
        </div>

        {/* Spin Wheel Modal */}
        <SpinWheel
          isOpen={isSpinWheelOpen}
          onClose={handleSpinWheelClose}
          onSpinComplete={handleSpinComplete}
        />
      </main>
    </>
  );
};

export default DemoPage;
