import { useState } from 'react';
import LuckySpin from './LuckySpin';
import s from './LuckySpinTrigger.module.scss';

const LuckySpinTrigger = ({ 
  children, 
  className, 
  variant = 'default',
  size = 'medium',
  showIcon = true 
}) => {
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState(false);

  const openLuckySpin = () => {
    setIsLuckySpinOpen(true);
  };

  const closeLuckySpin = () => {
    setIsLuckySpinOpen(false);
  };

  const getButtonClass = () => {
    const baseClass = s.triggerButton;
    const variantClass = s[variant];
    const sizeClass = s[size];
    
    return `${baseClass} ${variantClass} ${sizeClass} ${className || ''}`.trim();
  };

  return (
    <>
      <button className={getButtonClass()} onClick={openLuckySpin}>
        {showIcon && <span className={s.triggerIcon}>🎰</span>}
        {children}
      </button>

      <LuckySpin 
        isOpen={isLuckySpinOpen} 
        onClose={closeLuckySpin} 
      />
    </>
  );
};

export default LuckySpinTrigger;
