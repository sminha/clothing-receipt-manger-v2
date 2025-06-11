import { useNavigate } from 'react-router-dom';
import styles from './IntroPage.module.css';
import buttonImage from '../../assets/button.gif';

export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.IntroPage}>
      <div className={styles.container}>
        <img src={buttonImage} className={styles.image} />
        <p className={styles.title}>의류 사입 내역 관리 서비스, 옷장</p>
        <p className={styles.description}>옷장은 ‘옷’과 ‘장끼’의 합성어로, 장끼는 ‘영수증’이라는 뜻의 동대문 은어에요.<br />의류 소매업을 하다보면 수백, 수천 장의 장끼들이 쌓이게 되는데요,<br />사입 내역부터 미송 내역까지 옷장으로 손쉽게 정리해보세요.</p>
        <button className={styles.button} onClick={() => navigate('/signup')}>바로 시작하기</button>
      </div>
    </div>
  )
}