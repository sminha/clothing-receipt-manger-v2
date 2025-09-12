import React from 'react';
import styles from './UnshippedToggle.module.css';

type Props = {
  onlyUnshipped: boolean;
  onChange: (value: boolean) => void;
};

const UnshippedToggle: React.FC<Props> = ({ onlyUnshipped, onChange }) => {
  const toggleSelected = () => {
    onChange(!onlyUnshipped);
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${onlyUnshipped ? styles.selected : ''}`}
      onClick={toggleSelected}
    >
      <span className={styles.checkbox}>
        {onlyUnshipped && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className={styles.label}>미송건만 조회</span>
    </button>
  );
};

export default UnshippedToggle;