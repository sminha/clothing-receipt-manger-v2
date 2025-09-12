import React from 'react';
import styles from './DateTypeTab.module.css';

export type DateType = 'all' | 'purchase' | 'register';

interface DateTypeTabProps {
  selected: DateType;
  onSelect: (type: DateType) => void;
}

const DateTypeTab: React.FC<DateTypeTabProps> = ({ selected, onSelect }) => {
  const sliderPosition = selected === 'all' ? '0%' : selected === 'purchase' ? '100%' : '200%';

  return (
    <div className={styles.tabWrapper}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${selected === 'all' ? styles.selected : ''}`}
          onClick={() => onSelect('all')}
        >
          전체
        </button>
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