import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';
import { FaChevronDown } from 'react-icons/fa';

interface DropdownProps {
  options: string[];
  width: string;
  onChange?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, width, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(() => { return options[0] !== '50개씩' ? options[0] : options[1] })
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);

    if (onChange) onChange(option);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownWrapper} style={{ width }} ref={dropdownRef}>
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

export default Dropdown;
