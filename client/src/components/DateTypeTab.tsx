import React from 'react';
import styles from './DateTypeTab.module.css';

export type DateType = 'purchase' | 'register';

interface DateTypeTabProps {
  selected: DateType;
  onSelect: (type: DateType) => void;
}

const DateTypeTab: React.FC<DateTypeTabProps> = ({ selected, onSelect }) => {
  const sliderPosition = selected === 'purchase' ? '0%' : '100%';

  return (
    <div className={styles.tabWrapper}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${selected === 'purchase' ? styles.selected : ''}`}
          onClick={() => onSelect('purchase')}
        >
          사입일
        </button>
        <button
          className={`${styles.tabButton} ${selected === 'register' ? styles.selected : ''}`}
          onClick={() => onSelect('register')}
        >
          등록일
        </button>
        <div
          className={styles.slider}
          style={{ transform: `translateX(${sliderPosition})` }}
        />
      </div>
    </div>
  );
};

export default DateTypeTab;