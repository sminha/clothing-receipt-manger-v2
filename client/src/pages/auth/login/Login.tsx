import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import buttonGif from '../../../assets/button.gif';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.IntroPage}>
      <div className={styles.container}>
        <img src={buttonGif} className={styles.image} />
        <p className={styles.title}>로그인</p>
        <p className={styles.description}>사입 내역부터 미송 내역까지 옷장으로 손쉽게 정리해보세요.</p>
        <form className={styles.form}>
          <div className={styles.nameInputWrapper}>
            <input className={styles.nameInput} placeholder="이름"></input>
          </div>
          <div className={styles.birthdateInputWrapper}>
            <input className={styles.birthdateInput} placeholder="생년월일"></input>
          </div>
          <div className={styles.phoneInputWrapper}>
            <input className={styles.phoneInput} placeholder="휴대폰 번호"></input>
          </div>
        </form>
        <button className={styles.button} onClick={() => navigate('/view')}>로그인</button>
        <div className={styles.signupWrapper}>
          <p className={styles.signupText}>옷장이 처음이신가요?</p>
          <button className={styles.signupButton} onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </div>
    </div>
  )
}