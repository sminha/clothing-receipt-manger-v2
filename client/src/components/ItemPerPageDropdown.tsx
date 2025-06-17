import React, { useState } from 'react';
import styles from './ItemPerPageDropdown.module.css';
import { FaChevronDown } from 'react-icons/fa';

const options = ['50개씩', '100개씩', '150개씩', '200개씩'];

const ItemPerPageDropdown: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.selectedBox} onClick={toggleDropdown}>
        <span>{selectedOption}</span>
        <FaChevronDown size={10} />
      </div>
      {isOpen && (
        <ul className={styles.optionList}>
          {options.map(option => (
            <li key={option} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemPerPageDropdown;
