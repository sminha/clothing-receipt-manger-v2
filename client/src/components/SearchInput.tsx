import React, { useState } from 'react';
import styles from './SearchInput.module.css';
import { FaChevronDown } from 'react-icons/fa';

const options = ['거래처명', '상품명'];

const SearchInput: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.filterWrapper} onClick={toggleDropdown}>
        <span>{selectedOption}</span>
        <FaChevronDown size={10} className={styles.icon} />
        {isOpen && (
          <ul className={styles.dropdown}>
            {options.map(option => (
              <li key={option} onClick={() => handleSelect(option)}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="text"
        placeholder="입력하세요"
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchInput;
