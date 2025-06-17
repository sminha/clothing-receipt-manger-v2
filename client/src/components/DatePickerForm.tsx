import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePickerForm.module.css';
import calendarImg from '../assets/calendar.png';

const DatePickerForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className={styles.datePickerWrapper}>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        dateFormat="yyyy.MM.dd"
        locale={ko}
        customInput={<CustomInput />}
        popperPlacement="bottom-end"
      />
    </div>
  );
};

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const CustomInput = React.forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ value, onClick }, ref) => (
    <button className={styles.inputButton} onClick={onClick} ref={ref}>
      <span>{value || '날짜 선택'}</span>
      <img src={calendarImg} className={styles.image} />
    </button>
  )
);

// const CustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
//   <button className={styles.inputButton} onClick={onClick} ref={ref}>
//     <span>{value || '날짜 선택'}</span>
//     <img src={calendarImg} className={styles.image} />
//   </button>
// ));

export default DatePickerForm;