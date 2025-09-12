import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Profile.module.css';
import buttonPng from '../../assets/button.png';
import profileImg from '../../assets/profileImage.jpg';
import { AppDispatch, RootState } from '../../redux/store.ts';
import { setUserCompany, setUserName, setUserBirth, setUserPhone } from '../../redux/slices/userSlice.ts';

export default function EditProfilePage() {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const userInfo = useSelector((state: RootState) => state.user);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const name = userInfo.name;
  const [localCompany, setLocalCompany] = useState(userInfo.company);
  const [localName, setLocalName] = useState(userInfo.name);
  const [localBirth, setLocalBirth] = useState(userInfo.birth);
  const [localPhone, setLocalPhone] = useState(userInfo.phone);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleSave = () => {
    dispatch(setUserCompany(localCompany));
    dispatch(setUserName(localName));
    dispatch(setUserBirth(localBirth));
    dispatch(setUserPhone(localPhone));
    navigate('/view');
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
          <span className={styles.profileName} role="button" onClick={toggleDropdown}>{name}님</span>
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
            <span className={styles.nameInEdit}>{name}님</span>
            <img src={profileImg} className={styles.profileImageInEdit} />
          </div>

          <form className={styles.editForm}>
            <div className={styles.businessNameInputWrapper}>
              <label>상호명<span className={styles.necessary}> *</span></label>
              <input className={styles.businessNameInput} value={localCompany} onChange={(e) => setLocalCompany(e.target.value)} />
            </div>
            <div className={styles.nameInputWrapper}>
              <label>이름<span className={styles.necessary}> *</span></label>
              <input className={styles.nameInput} value={localName} onChange={(e) => setLocalName(e.target.value)} />
            </div>
            <div className={styles.birthdateInputWrapper}>
              <label>생년월일<span className={styles.necessary}> *</span></label>
              <input className={styles.birthdateInput} value={localBirth} onChange={(e) => setLocalBirth(e.target.value)} />
            </div>
            <div className={styles.phoneInputWrapper}>
              <label>전화번호<span className={styles.necessary}> *</span></label>
              <input className={styles.phoneInput} value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} />
            </div>
          </form>

          <div className={styles.editButtonWrapper}>
            <button className={styles.cancelButton} onClick={() => navigate('/view')}>취소</button>
            <button className={styles.saveButton} onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    </div>
  )
}