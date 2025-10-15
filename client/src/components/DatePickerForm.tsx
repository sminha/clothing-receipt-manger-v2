import React from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePickerForm.module.css';
import calendarImg from '../assets/calendar.png';

interface DatePickerFormProps {
  disabled?: boolean;
  value?: Date | null;
  onChange: (date: Date | null) => void;
}

const DatePickerForm: React.FC<DatePickerFormProps> = ({ disabled, value, onChange }) => {
  return (
    <div className={styles.datePickerWrapper}>
      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat="yyyy.MM.dd"
        locale={ko}
        customInput={<CustomInput disabled={disabled} />}
        popperPlacement="bottom-end"
        disabled={disabled}
      />
    </div>
  );
};

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const CustomInput = React.forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ value, onClick, disabled }, ref) => (
    <button className={styles.inputButton} onClick={onClick} ref={ref} disabled={disabled}>
      <span>{value || '날짜 선택'}</span>
      <img src={calendarImg} className={styles.image} alt="날짜 선택 아이콘" />
    </button>
  )
);

export default DatePickerForm;