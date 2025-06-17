import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import buttonPng from '../../assets/button.png';
import profileImg from '../../assets/profileImage.jpg';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div className={styles.myPage}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={buttonPng} className={styles.logoImg} />
          <span className={styles.logoText}>옷장</span>
        </div>
        <div className={styles.navBar}>
          <Link to="/view" className={styles.menu}>조회</Link>
          <Link to="/add" className={styles.menu}>추가</Link>
          <Link to="" className={styles.menu}>내 통계</Link>
        </div>
        <div className={styles.profile}>
          <img src={profileImg} className={styles.profileImage} />
          <span className={styles.profileName} role="button" onClick={toggleDropdown}>스즈님</span>
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem}>계정정보</div>
              <div className={styles.dropdownItem}>다크모드</div>
              <div className={styles.dropdownItem}>로그아웃</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.edit}>
          <span className={styles.editTitle}>내 정보 수정</span>
          <div className={styles.editProfileImage}>
            <span className={styles.nameInEdit}>스즈님</span>
            <img src={profileImg} className={styles.profileImageInEdit} />
          </div>

          <form className={styles.editForm}>
            <div className={styles.businessNameInputWrapper}>
              <label>상호명<span className={styles.necessary}> *</span></label>
              <input className={styles.businessNameInput} placeholder="스즈" />
            </div>
            <div className={styles.nameInputWrapper}>
              <label>이름<span className={styles.necessary}> *</span></label>
              <input className={styles.nameInput} placeholder="홍길동" />
            </div>
            <div className={styles.birthdateInputWrapper}>
              <label>생년월일<span className={styles.necessary}> *</span></label>
              <input className={styles.birthdateInput} placeholder="901020" />
            </div>
            <div className={styles.phoneInputWrapper}>
              <label>전화번호<span className={styles.necessary}> *</span></label>
              <input className={styles.phoneInput} placeholder="010-1234-5678" />
            </div>
          </form>

          <div className={styles.editButtonWrapper}>
            <button className={styles.cancelButton} onClick={() => navigate('/mypage')}>취소</button>
            <button className={styles.saveButton} onClick={() => navigate('/mypage')}>저장</button>
          </div>
        </div>
      </div>
    </div>
  )
}