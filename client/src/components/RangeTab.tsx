import React from 'react';
import styles from './RangeTab.module.css';

const rangeTypes = ['오늘', '일주일', '1개월', '3개월'] as const;
type RangeType = typeof rangeTypes[number];

interface RangeTabProps {
  selected: RangeType;
  onSelect: (type: RangeType) => void;
  disabled: boolean;
}

const RangeTab: React.FC<RangeTabProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className={styles.rangeTabContainer}>
      {rangeTypes.map((label) => (
        <button
          key={label}
          className={`${styles.rangeTabButton} ${selected === label ? styles.selected : ''}`}
          onClick={() => onSelect(label)}
          disabled={disabled}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default RangeTab;
