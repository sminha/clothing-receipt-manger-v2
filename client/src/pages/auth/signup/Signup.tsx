import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import buttonGif from '../../../assets/button.gif';

export default function SignupPage() {
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const navigate = useNavigate();
  
  return (
    <div className={styles.IntroPage}>
      <div className={styles.container}>
        <img src={buttonGif} className={styles.image} />
        <p className={styles.title}>회원가입</p>
        <p className={styles.description}>사입 내역부터 미송 내역까지 옷장으로 손쉽게 정리해보세요.</p>
          {!isCodeSent ? 
          <>
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
            <button className={styles.button} onClick={() => setIsCodeSent(true)}>인증번호 받기</button>
          </>
          :
          <>
            <form className={styles.form}>
              <div className={styles.codeInputWrapper}>
                <input className={styles.codeInput} placeholder="인증번호 6자리를 입력해주세요."></input>
              </div>
            </form>
            <button className={styles.button} onClick={() => navigate('/login')}>회원가입하기</button>
          </>
          }
        <div className={styles.loginWrapper}>
          <p className={styles.loginText}>이미 계정이 있으신가요?</p>
          <button className={styles.loginButton} onClick={() => navigate('/login')}>로그인</button>
        </div>
      </div>
    </div>
  )
}