import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Signup.module.css';
import buttonGif from '../../../assets/button.gif';
import { RootState } from '../../../redux/store.ts';
import { setName, setBirth, setGender, setCarrier, setPhone } from '../../../redux/slices/signupSlice.ts';
import { setUserName, setUserBirth, setUserGender, setUserCarrier, setUserPhone } from '../../../redux/slices/userSlice.ts';

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signupInfo = useSelector((state: RootState) => state.signup);

  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  // const [code, setCode] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(180);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // useEffect(() => {
  //   console.log('회원가입 화면:', signupInfo);
  // }, []);
  
  return (
    <div className={styles.IntroPage}>
      <div className={styles.container}>
        <img src={buttonGif} className={styles.image} />
        <p className={styles.title}>회원가입</p>
        <p className={styles.description}>사입 내역부터 미송 내역까지 옷장으로 손쉽게 정리해보세요.</p>
          {/* {!isCodeSent ?  */}
          <>
            <form className={styles.form} autoComplete="off">
              <div className={styles.nameInputWrapper}>
                <input name="name" className={styles.nameInput} placeholder="이름" onChange={(e) => { dispatch(setName(e.target.value)); dispatch(setUserName(e.target.value)); }} />
              </div>
              <div className={styles.birthdateInputWrapper}>
                <input name="birthdate" className={styles.birthdateInput} placeholder="생년월일" onChange={(e) => { dispatch(setBirth(e.target.value)); dispatch(setUserBirth(e.target.value)); }} />
                <p className={styles.birthdateInputText}>–</p>
                <input name="gender" className={styles.genderInput} onChange={(e) => { dispatch(setGender(e.target.value as 'male' | 'female' | '')); dispatch(setUserGender(e.target.value  as 'male' | 'female' | '')); }} />
                <p className={styles.birthdateInputText}>●●●●●●</p>
              </div>
              <div className={styles.phoneInputWrapper}>
                <select className={styles.telcompanyInput} defaultValue="" onChange={(e) => { dispatch(setCarrier(e.target.value)); dispatch(setUserCarrier(e.target.value)); }}>
                  <option value="" disabled>통신사</option>
                  <option value="SKT">SKT</option>
                  <option value="KT">KT</option>
                  <option value="LGU+">LG U+</option>
                  <option value="알뜰폰">알뜰폰</option>
                </select>
                <input name="phone"className={styles.phoneInput} placeholder="휴대폰 번호" onChange={(e) => { dispatch(setPhone(e.target.value)); dispatch(setUserPhone(e.target.value)); }} />
              </div>
            </form>
            {/* <button className={styles.button} onClick={() => setIsCodeSent(true)}>인증번호 받기</button> */}
            <button className={styles.button} onClick={() => navigate('/login')}>회원가입하기</button>
          </>
           {/* :
           <>
             <form className={styles.form} autoComplete="off">
               <div className={styles.codeInputWrapper}>
                 <input name="code" className={styles.codeInput} placeholder="인증번호 6자리를 입력해주세요." autoComplete="off" />
                 <p className={styles.counter}>{display}</p>
               </div>
             </form>
             <button className={styles.button} onClick={() => navigate('/login')}>회원가입하기</button>
           </> */}
          
        <div className={styles.loginWrapper}>
          <p className={styles.loginText}>이미 계정이 있으신가요?</p>
          <button className={styles.loginButton} onClick={() => navigate('/login')}>로그인</button>
        </div>
      </div>
    </div>
  )
}