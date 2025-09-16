import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import s from './LuckySpin.module.scss';

const LuckySpin = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  // Danh sách phần quà với màu sắc và tỷ lệ trúng
  const prizes = [
    { id: 1, name: "Giảm 50%", color: "#FF6B6B", probability: 5, code: "SPIN50" },
    { id: 2, name: "Giảm 30%", color: "#4ECDC4", probability: 10, code: "SPIN30" },
    { id: 3, name: "Giảm 20%", color: "#45B7D1", probability: 15, code: "SPIN20" },
    { id: 4, name: "Giảm 15%", color: "#96CEB4", probability: 20, code: "SPIN15" },
    { id: 5, name: "Giảm 10%", color: "#FFEAA7", probability: 25, code: "SPIN10" },
    { id: 6, name: "Miễn phí vận chuyển", color: "#DDA0DD", probability: 10, code: "FREESHIP" },
    { id: 7, name: "Tặng quà bí mật", color: "#FFB347", probability: 10, code: "MYSTERY" },
    { id: 8, name: "Chúc may mắn lần sau", color: "#98D8C8", probability: 5, code: "NEXT" }
  ];

  // Tính toán góc cho mỗi phần quà
  const getPrizeAngle = (index) => {
    const segmentAngle = 360 / prizes.length;
    return index * segmentAngle;
  };

  // Quay vòng quay
  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    // Chọn phần quà dựa trên tỷ lệ xác suất
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    let selectedPrize = prizes[0];

    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability) {
        selectedPrize = prize;
        break;
      }
    }

    // Tính toán góc quay để trỏ vào phần quà được chọn
    const targetAngle = getPrizeAngle(prizes.indexOf(selectedPrize));
    const spinDuration = 5000; // 5 giây
    const totalRotation = 360 * 5 + targetAngle; // Quay 5 vòng + góc đích

    // Animation quay
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function để tạo hiệu ứng chậm dần
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = currentRotation + (totalRotation * easeOut);
      
      setCurrentRotation(currentAngle);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Kết thúc quay
        setTimeout(() => {
          setResult(selectedPrize);
          setShowResult(true);
          setIsSpinning(false);
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  };

  // Đóng popup
  const handleClose = () => {
    onClose();
    setShowResult(false);
    setResult(null);
    setCurrentRotation(0);
  };

  // Copy mã giảm giá
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    // Có thể thêm toast notification ở đây
  };

  if (!isOpen) return null;

  return (
    <div className={s.overlay}>
      <div className={s.luckySpinContainer}>
        {/* Header */}
        <div className={s.header}>
          <div className={s.titleSection}>
            <div className={s.titleIcon}>🎰</div>
            <h2 className={s.title}>Vòng quay may mắn</h2>
          </div>
          <button className={s.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Vòng quay */}
        <div className={s.wheelSection}>
          <div className={s.wheelContainer}>
            <div 
              ref={wheelRef}
              className={s.wheel}
              style={{ 
                transform: `rotate(${currentRotation}deg)`,
                transition: isSpinning ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              {prizes.map((prize, index) => {
                const angle = getPrizeAngle(index);
                const segmentAngle = 360 / prizes.length;
                const textAngle = angle + segmentAngle / 2;
                
                return (
                  <div
                    key={prize.id}
                    className={s.segment}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      backgroundColor: prize.color
                    }}
                  >
                    <div 
                      className={s.segmentText}
                      style={{
                        transform: `rotate(${textAngle}deg) translateY(-60px)`
                      }}
                    >
                      {prize.name}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Mũi tên chỉ */}
            <div className={s.pointer}></div>
          </div>

          {/* Nút quay */}
          <button 
            className={`${s.spinButton} ${isSpinning ? s.spinning : ''}`}
            onClick={spinWheel}
            disabled={isSpinning}
          >
            <span className={s.spinIcon}>🔄</span>
            <span className={s.spinText}>
              {isSpinning ? 'Đang quay...' : 'Quay ngay!'}
            </span>
          </button>
        </div>

        {/* Hiển thị kết quả */}
        {showResult && result && (
          <div className={s.resultCard}>
            <div className={s.resultIcon}>🎉</div>
            <h3 className={s.resultTitle}>Chúc mừng!</h3>
            <p className={s.resultText}>
              Bạn đã nhận được: <strong>{result.name}</strong>
            </p>
            
            {result.code && (
              <div className={s.codeSection}>
                <span className={s.codeLabel}>Mã giảm giá:</span>
                <div className={s.codeContainer}>
                  <span className={s.codeText}>{result.code}</span>
                  <button 
                    className={s.copyButton}
                    onClick={() => copyCode(result.code)}
                  >
                    📋
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gợi ý */}
        <div className={s.tipSection}>
          <span className={s.tipIcon}>💡</span>
          <span className={s.tipText}>
            Mẹo: Đăng nhập mỗi ngày để có cơ hội quay thưởng!
          </span>
        </div>
      </div>
    </div>
  );
};

export default LuckySpin;
