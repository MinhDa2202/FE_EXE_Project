import { useState } from 'react';
import LuckySpin from './LuckySpin';
import s from './LuckySpinDemo.module.scss';

const LuckySpinDemo = () => {
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState(false);

  const openLuckySpin = () => {
    setIsLuckySpinOpen(true);
  };

  const closeLuckySpin = () => {
    setIsLuckySpinOpen(false);
  };

  return (
    <div className={s.demoContainer}>
      <div className={s.demoContent}>
        <h2 className={s.demoTitle}>🎰 Vòng quay may mắn</h2>
        <p className={s.demoDescription}>
          Nhấn vào nút bên dưới để mở vòng quay may mắn và có cơ hội nhận những phần quà hấp dẫn!
        </p>
        
        <button className={s.demoButton} onClick={openLuckySpin}>
          <span className={s.buttonIcon}>🎯</span>
          <span className={s.buttonText}>Mở vòng quay may mắn</span>
        </button>

        <div className={s.prizesPreview}>
          <h3 className={s.prizesTitle}>🎁 Các phần quà có thể nhận:</h3>
          <div className={s.prizesGrid}>
            <div className={s.prizeItem}>
              <span className={s.prizeIcon}>💰</span>
              <span className={s.prizeName}>Giảm 50%</span>
            </div>
            <div className={s.prizeItem}>
              <span className={s.prizeIcon}>🎉</span>
              <span className={s.prizeName}>Giảm 30%</span>
            </div>
            <div className={s.prizeItem}>
              <span className={s.prizeIcon}>🚚</span>
              <span className={s.prizeName}>Miễn phí vận chuyển</span>
            </div>
            <div className={s.prizeItem}>
              <span className={s.prizeIcon}>🎁</span>
              <span className={s.prizeName}>Quà bí mật</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lucky Spin Popup */}
      <LuckySpin 
        isOpen={isLuckySpinOpen} 
        onClose={closeLuckySpin} 
      />
    </div>
  );
};

export default LuckySpinDemo;
