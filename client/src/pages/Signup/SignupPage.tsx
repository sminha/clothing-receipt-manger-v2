import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import buttonImage from '../../assets/button.gif';

export default function SignupPage() {
  const navigate = useNavigate();
  
  return (
    <div className={styles.IntroPage}>
      <div className={styles.container}>
        <img src={buttonImage} className={styles.image} />
        <p className={styles.title}>회원가입</p>
        <p className={styles.description}>사입 내역부터 미송 내역까지 옷장으로 손쉽게 정리해보세요.</p>
        <form className={styles.form}>
          <div className={styles.nameInputWrapper}>
            <input className={styles.nameInput} placeholder="이름"></input>
          </div>
          <div className={styles.birthdateInputWrapper}>
            <input className={styles.birthdateInput} placeholder="생년월일"></input>
            <p className={styles.birthdateInputText}>–</p>
            <input className={styles.genderInput}></input>
            <p className={styles.birthdateInputText}>●●●●●●</p>
          </div>
          <div className={styles.phoneInputWrapper}>
            <input className={styles.telcompanyInput} placeholder="통신사"></input>
            <input className={styles.phoneInput} placeholder="휴대폰 번호"></input>
          </div>
        </form>
        <button className={styles.button}>인증번호 받기</button>
        <div className={styles.loginWrapper}>
          <p className={styles.loginText}>이미 계정이 있으신가요?</p>
          <button className={styles.loginButton} onClick={() => navigate('/login')}>로그인</button>
        </div>
      </div>
    </div>
  )
}