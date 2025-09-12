import React, { useState } from 'react';
import styles from './SearchInput.module.css';
import { FaChevronDown } from 'react-icons/fa';

const options: { label: string; value: 'vendor' | 'product' }[] = [
  { label: '거래처명', value: 'vendor' },
  { label: '상품명', value: 'product' },
];

type Props = {
  keyword: string;
  onKeywordChange: (value: string) => void;
  target: 'vendor' | 'product';
  onTargetChange: (value: 'vendor' | 'product') => void;
};

const SearchInput: React.FC<Props> = ({ keyword, onKeywordChange, target, onTargetChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const handleSelect = (value: 'vendor' | 'product') => {
    onTargetChange(value);
    setIsOpen(false);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.filterWrapper} onClick={toggleDropdown}>
        <span>{options.find(opt => opt.value === target)?.label ?? '거래처명'}</span>
        <FaChevronDown size={10} className={styles.icon} />
        {isOpen && (
          <ul className={styles.dropdown}>
            {options.map(option => (
              <li key={option.value} onClick={() => handleSelect(option.value)}>
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="text"
        placeholder="입력하세요"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchInput;
