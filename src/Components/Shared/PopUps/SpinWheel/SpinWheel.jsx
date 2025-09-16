import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './SpinWheel.module.scss';

const SpinWheel = ({ isOpen, onClose, onSpinComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const wheelRef = useRef(null);
  
  const prizes = [
    { id: 1, name: 'Giảm 50%', value: 50, color: '#FF6B6B', probability: 0.1 },
    { id: 2, name: 'Giảm 30%', value: 30, color: '#4ECDC4', probability: 0.2 },
    { id: 3, name: 'Giảm 20%', value: 20, color: '#45B7D1', probability: 0.3 },
    { id: 4, name: 'Giảm 10%', value: 10, color: '#96CEB4', probability: 0.4 },
    { id: 5, name: 'Miễn phí vận chuyển', value: 'free_shipping', color: '#FFEAA7', probability: 0.2 },
    { id: 6, name: 'Thử lại lần sau', value: 'try_again', color: '#DDA0DD', probability: 0.3 }
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Random prize based on probability
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedPrize = prizes[0];
    
    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability) {
        selectedPrize = prize;
        break;
      }
    }
    
    // Calculate rotation for the selected prize
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const targetRotation = 360 * 5 + (360 / prizes.length) * prizeIndex + Math.random() * 30;
    
    setRotation(prev => prev + targetRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setPrize(selectedPrize);
      
      if (onSpinComplete) {
        onSpinComplete(selectedPrize);
      }
    }, 3000);
  };

  const handleClose = () => {
    if (!isSpinning) {
      onClose();
    }
  };

  useEffect(() => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [rotation]);

  if (!isOpen) return null;

  const content = (
    <div className={s.overlay} role="dialog" aria-modal="true">
      <div className={s.modal}>
        <div className={s.header}>
          <h2>🎰 Vòng quay may mắn</h2>
          <button 
            className={s.closeBtn} 
            onClick={handleClose}
            disabled={isSpinning}
          >
            ×
          </button>
        </div>
        
        <div className={s.content}>
          <div className={s.wheelContainer}>
            <div 
              ref={wheelRef}
              className={`${s.wheel} ${isSpinning ? s.spinning : ''}`}
            >
              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index;
                const isEven = index % 2 === 0;
                
                return (
                  <div
                    key={prize.id}
                    className={`${s.segment} ${isEven ? s.even : s.odd}`}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      background: prize.color,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((360 / prizes.length) * Math.PI / 180)}% ${50 + 50 * Math.sin((360 / prizes.length) * Math.PI / 180)}%)`
                    }}
                  >
                    <div 
                      className={s.prizeText}
                      style={{
                        transform: `rotate(${-angle - 90}deg) translateY(-30px)`
                      }}
                    >
                      {prize.name}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className={s.pointer}></div>
          </div>
          
          <div className={s.controls}>
            <button
              className={`${s.spinBtn} ${isSpinning ? s.disabled : ''}`}
              onClick={spinWheel}
              disabled={isSpinning}
            >
              {isSpinning ? 'Đang quay...' : '🎯 Quay ngay!'}
            </button>
          </div>
          
          {prize && (
            <div className={s.result}>
              <div className={s.resultIcon}>
                {prize.value === 'free_shipping' ? '🚚' : 
                 prize.value === 'try_again' ? '😔' : '🎉'}
              </div>
              <h3>Chúc mừng!</h3>
              <p>Bạn đã nhận được: <strong>{prize.name}</strong></p>
              {prize.value !== 'try_again' && (
                <div className={s.coupon}>
                  <span>Mã giảm giá: </span>
                  <code>SPIN{prize.value === 'free_shipping' ? 'FREE' : prize.value}</code>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={s.footer}>
          <p>💡 Mẹo: Đăng nhập mỗi ngày để có cơ hội quay thưởng!</p>
        </div>
      </div>
    </div>
  );

  // Render in a portal to avoid clipping by transformed/overflow ancestors
  return createPortal(content, document.body);
};

export default SpinWheel;
