import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AddOrder.module.css';
import buttonPng from '../../../assets/button.png';
import profileImg from '../../../assets/profileImage.jpg';
import trashcanImg from '../../../assets/trashcan.png';

export default function AddOrder() {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productList, setProductList] = useState([
    {
      name: '',
      category: '',
      color: '',
      size: '',
      option: '',
      unitPrice: '',
      quantity: '',
      unreceived: '',
    },
  ]);

  const totalQuantity = productList.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const totalPrice = productList.reduce((acc, item) => acc + Number(item.unitPrice || 0) * Number(item.quantity || 0), 0);
  const totalUnreceived = productList.reduce((acc, item) => acc + Number(item.unreceived || 0), 0);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedList = [...productList];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };
    setProductList(updatedList);
  };

  const handleDelete = (index: number) => {
    setProductList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    const newProduct = {
      name: '',
      category: '',
      color: '',
      size: '',
      option: '',
      unitPrice: '',
      quantity: '',
      unreceived: '',
    };

    setProductList(prev => [...prev, newProduct]);
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
              <div className={styles.dropdownItem} onClick={() => navigate('/profile')}>계정정보</div>
              <div className={styles.dropdownItem}>다크모드</div>
              <div className={styles.dropdownItem}>로그아웃</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.contentTitleWrapper}>
        <span className={styles.contentTitle}>사입 내역 추가</span>
          <label htmlFor="fileInput" className={styles.customUploadButton}>
            영수증으로 추가하기
          </label>
          <input
            id="fileInput"
            type="file"
            style={{ display: 'none' }}
            // onChange={handleFileChange}
          />
        </div>
        <div className={styles.addWrapper}>
          <div className={styles.addRow}>
            <span className={styles.addTitle}>사입일시</span>
            <input type="datetime-local" className={styles.addInput} />
          </div>

          <div className={styles.addRow}>
            <span className={styles.addTitle}>거래처명</span>
            <input className={styles.addInput} />
          </div>

          <div className={styles.addRow}>
            <span className={styles.addTitle}>상품목록</span>
            <div className={styles.productTableWrapper}>
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>상품명</th>
                    <th>구분</th>
                    <th>컬러</th>
                    <th>사이즈</th>
                    <th>기타옵션</th>
                    <th>단가</th>
                    <th>수량</th>
                    <th>금액합계</th>
                    <th>미송수량</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product, index) => (
                    <>
                    <tr key={index}>
                      <td>
                        <input
                          className={styles.addLongInput}
                          value={product.name}
                          onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.addMiddleInput}
                          value={product.category}
                          onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.addMiddleInput}
                          value={product.color}
                          onChange={(e) => handleInputChange(index, 'color', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.addMiddleInput}
                          value={product.size}
                          onChange={(e) => handleInputChange(index, 'size', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.addMiddleInput}
                          value={product.option}
                          onChange={(e) => handleInputChange(index, 'option', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.addMiddleInput}
                          type="number"
                          value={product.unitPrice}
                          onChange={(e) => handleInputChange(index, 'unitPrice', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.addShortInput}
                          value={product.quantity}
                          onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.addMiddleInputTotalPrice}
                          value={
                            product.unitPrice && product.quantity
                              ? (Number(product.unitPrice) * Number(product.quantity)).toLocaleString()
                              : ''
                          }
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          className={styles.addShortInput}
                          value={product.unreceived}
                          onChange={(e) => handleInputChange(index, 'unreceived', e.target.value)}
                        />
                      </td>
                    </tr>
                    <td className={styles.deleteCell}>
                      <button
                        className={styles.trashcanButton}
                        onClick={() => handleDelete(index)}
                      >
                        <img src={trashcanImg} className={styles.trashcanImage} />
                      </button>
                    </td>
                    </>
                  ))}
                </tbody>
              </table>
              <div className={styles.hr}></div>
              <div className={styles.summaryRow}>
                <div className={styles.totalItemWrapper}>
                  <span className={styles.totalItem}>{productList.length}건</span>
                </div>
                <div className={styles.totalQuantityWrapper}>
                  <span className={styles.totalQuantity}>{totalQuantity}개</span>
                </div>
                <div className={styles.totalPriceWrapper}>
                  <span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className={styles.totalUnreceivedWrapper}>
                  <span className={styles.totalUnreceived}>{totalUnreceived}개</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.addProductButtonWrapper}>
            <button className={styles.addProductButton} onClick={() => handleAddProduct()}>상품 추가하기</button>
          </div>
        </div>
        <div className={styles.addPurchaseButtonWrapper}>
          <button className={styles.addPurchaseButton} onClick={() => navigate('/view')}>추가하기</button>
        </div>
      </div>
    </div>
  )
}