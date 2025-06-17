import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ViewOrders.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DateTypeTab, { DateType } from '../../../components/DateTypeTab.tsx';
import RangeTap from '../../../components/RangeTab.tsx';
import DatePickerForm from '../../../components/DatePickerForm.tsx';
import SearchInput from '../../../components/SearchInput.tsx';
import UnshippedToggle from '../../../components/UnshippedToggle.tsx';
import ItemPerPageDropdown from '../../../components/ItemPerPageDropdown.tsx';
import buttonPng from '../../../assets/button.png';
import profileImg from '../../../assets/profileImage.jpg';
import receiptImg from '../../../assets/receipt.png';
import trashcanImg from '../../../assets/trashcan.png';
import testReceiptImg from '../../../assets/test_receipt.png';

export default function ViewOrders() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<DateType>('purchase');
  const [selectedRange, setSelectedRange] = useState<'오늘' | '1주일' | '1개월' | '3개월'>('오늘');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openedPurchaseModalIndex, setOpenedPurchaseModalIndex] = useState<number | null>(null);
  const [openedPurchaseEditModalIndex, setOpenedPurchaseEditModalIndex] = useState<number | null>(null);
  const [openedProductModalIndex, setOpenedProductModalIndex] = useState<number | null>(null);
  const [openedProductEditModalIndex, setOpenedProductEditModalIndex] = useState<number | null>(null);
  const [openedReservationModalIndex, setOpenedReservationModalIndex] = useState<number | null>(null);
  const [openedReceiptModalIndex, setOpenedReceiptModalIndex] = useState<number | null>(null);
  const [productList, setProductList] = useState([
    {
      productNo: '202503010245001',
      name: '워싱로우라이즈부츠컷',
      unitPrice: '123000',
      quantity: '2',
      unreceived: '1',
    },
    {
      productNo: '202503010245002',
      name: '코튼셔츠',
      unitPrice: '18000',
      quantity: '3',
      unreceived: '1',
    },
    {
      productNo: '202503010245003',
      name: '스트라이프티셔츠',
      unitPrice: '17000',
      quantity: '1',
      unreceived: '1',
    },
  ]);

  const totalQuantity = productList.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const totalPrice = productList.reduce((acc, item) => acc + Number(item.unitPrice || 0) * Number(item.quantity || 0), 0);
  const totalUnreceived = productList.reduce((acc, item) => acc + Number(item.unreceived || 0), 0);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  
  const toggleSelected = () => {
    setSelected(prev => !prev);
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handlePurchaseClick = (index: number) => {
    setOpenedPurchaseModalIndex(index);
  };

  const handleProductClick = (index: number) => {
    setOpenedProductModalIndex(index);
  };

  const handleProductEditClick = (index: number) => {
    setOpenedProductEditModalIndex(index);
  };

  const handleReceiptClick = (index: number) => {
    setOpenedReceiptModalIndex(index);
  }

  const handleReservationClick = (index: number) => {
    setOpenedReservationModalIndex(index);
  }

  type ProductKey = 'productNo' | 'name' | 'unitPrice' | 'quantity' | 'unreceived';

  const handleInputChange = (index: number, key: ProductKey, value: string) => {
    const updatedList = [...productList];
    updatedList[index][key] = value;
    setProductList(updatedList);
  };

  const handleDelete = (index: number) => {
    setProductList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    const newProduct = {
      productNo: '',
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
        <span className={styles.contentTitle}>사입 내역 조회</span>
        <div className={styles.searchWrapper}>
          <div className={styles.period}>
            <span className={styles.periodTitle}>조회기간</span>
            <div className={styles.periodWrapper}>
              <DateTypeTab selected={selectedType} onSelect={setSelectedType} />
              <RangeTap selected={selectedRange} onSelect={setSelectedRange}/>
              <div className={styles.datePickerFormWrapper}>
                <DatePickerForm />
                <DatePickerForm />
              </div>
            </div>
          </div>

          <div className={styles.condition}>
            <span className={styles.conditionTitle}>상세조건</span>
            <div className={styles.conditionWrapper}>
              <SearchInput />
              <UnshippedToggle />
            </div>
          </div>
          <div className={styles.searchButtonWrapper}>
            <button className={styles.searchButton}>검색</button>
          </div>
        </div>

        <div className={styles.resultWrapper}>
          <div className={styles.resultHeader}>
            <div className={styles.leftResultHeader}>
              <span className={styles.resultTitle}>전체 162</span>
            </div>
            <div className={styles.rightResultHeader}>
              <ItemPerPageDropdown />
              <button className={styles.downloadButton}>엑셀 다운로드</button>
            </div>
          </div>

          <div className={styles.resultContent}>
            <div className={styles.tableScrollContainer}>
              <table className={styles.resultTable}>
                <thead>
                  <tr>
                    <th>
                      <button
                        type="button"
                        className={`${styles.button} ${selected ? styles.selected : ''}`}
                        onClick={toggleSelected}
                      >
                        <span className={styles.checkbox}>
                          {selected && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      </button>
                    </th>
                    <th>사입번호</th>
                    <th>상품사입번호</th>
                    <th>사입일시</th>
                    <th>거래처명</th>
                    <th>상품명</th>
                    <th>구분</th>
                    <th>컬러</th>
                    <th>사이즈</th>
                    <th>기타옵션</th>
                    <th>단가</th>
                    <th>수량</th>
                    <th>금액합계</th>
                    <th>미송수량</th>
                    <th>영수증</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(20)].map((_, index) => {
                    const isSelected = selectedRows.includes(index);
                    return (
                      <tr
                        key={index}
                        style={{ backgroundColor: isSelected ? '#efe6e6' : 'transparent' }}
                      >
                        <td>
                          <button
                            type="button"
                            className={`${styles.button} ${isSelected ? styles.selected : ''}`}
                            onClick={() => toggleRowSelection(index)}
                          >
                            <span className={styles.checkbox}>
                              {isSelected && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>
                          </button>
                        </td>
                        <td><span className={styles.textButton} role="button" onClick={() => handlePurchaseClick(index)}>202503010245</span></td>
                        <td><span className={styles.textButton} role="button" onClick={() => handleProductClick(index)}>202503010245001</span></td>
                        <td>2024.03.01. 02:45</td>
                        <td>에이상사</td>
                        <td>루즈핏티셔츠</td>
                        <td>상의</td>
                        <td>화이트</td>
                        <td>L</td>
                        <td>-</td>
                        <td>15,000</td>
                        <td>3</td>
                        <td>45,000</td>
                        <td><span className={styles.textButton} role="button" onClick={() => handleReservationClick(index)}>0</span></td>
                        <td>
                          <img src={receiptImg} className={styles.receiptImg} onClick={() => handleReceiptClick(index)}/>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination}>
              <button className={styles.pageButton}>
                <FaChevronLeft size={10} />
              </button>
              <button className={`${styles.pageButton} ${styles.active}`}>1</button>
              <button className={styles.pageButton}>2</button>
              <button className={styles.pageButton}>3</button>
              <span className={styles.ellipsis}>⋅⋅⋅</span>
              <button className={styles.pageButton}>10</button>
              <button className={styles.pageButton}>
                <FaChevronRight size={10} />  
              </button>
            </div>
          </div>
        </div>
      </div>

      {openedPurchaseModalIndex !== null && (
        <div className={styles.modalOverlay}  onClick={() => setOpenedPurchaseModalIndex(null)}>
          <div className={styles.modalContent}  onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>사입내역 조회</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedPurchaseModalIndex(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.purchase}>
              <div className={styles.firstPurchaseRow}>
                <span className={styles.purchaseRowTitle}>사입번호</span>
                <span className={styles.textButton} role="button" style={{ fontSize: '14px' }}>202503010245</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사입일시</span>
                <span className={styles.purchaseRowContent}>2025.03.01. 02:45</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>거래처명</span>
                <span className={styles.purchaseRowContent}>루프</span>
              </div>
            </div>
            <div className={styles.productTableWrapper}>
              <table className={styles.productTable}>
                <thead className={styles.productHeader}>
                  <tr>
                    <th>상품사입번호</th>
                    <th>상품명</th>
                    <th>단가</th>
                    <th>수량</th>
                    <th>금액합계</th>
                    <th>미송수량</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product, idx) => (
                    <tr key={idx}>
                      <td><span className={styles.textButton} role="button" style={{ fontSize: '14px' }}>{product.productNo}</span></td>
                      <td>{product.name}</td>
                      <td>{Number(product.unitPrice).toLocaleString()}</td>
                      <td>{product.quantity}</td>
                      <td>{(Number(product.unitPrice) * Number(product.quantity)).toLocaleString()}</td>
                      <td>{product.unreceived}</td>
                    </tr>
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
            <div className={styles.modalButton}>
              <button className={styles.deleteButton}>삭제</button>
              <button className={styles.editButton} onClick={() => { setOpenedPurchaseEditModalIndex(openedPurchaseModalIndex); setOpenedPurchaseModalIndex(null); }}>수정</button>
            </div>
          </div>
        </div>
      )}

      {openedPurchaseEditModalIndex !== null && (
        <div className={styles.modalOverlay}  onClick={() => setOpenedPurchaseEditModalIndex(null)}>
          <div className={styles.modalContent}  onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>사입내역 수정</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedPurchaseEditModalIndex(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.purchase}>
              <div className={styles.firstPurchaseRow}>
                <span className={styles.purchaseRowTitle}>사입번호</span>
                <span className={styles.textButton} role="button" style={{ fontSize: '14px', marginTop: '7px', marginBottom: '7px' }}>202503010245</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사입일시</span>
                <input type="datetime-local" className={styles.productEditInput} />
              </div>
              <div className={styles.purchaseRow} style={{ marginBottom: '12px' }}>
                <span className={styles.purchaseRowTitle}>거래처명</span>
                <input className={styles.productEditInput} placeholder="루프"/>
              </div>
            </div>
            <div className={styles.productTableWrapper}>
              <table className={styles.productTable}>
                <thead className={styles.productHeader}>
                  <tr>
                    <th>상품사입번호</th>
                    <th>상품명</th>
                    <th>단가</th>
                    <th>수량</th>
                    <th>금액합계</th>
                    <th>미송수량</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product, idx) => (
                    <tr key={idx}>
                      <td className={styles.addInputRow}>
                        <span className={styles.textButton} role="button" style={{ fontSize: '14px' }}>202503010245001</span>
                      </td>
                      <td className={styles.addInputRow}>
                        <input
                          className={styles.addLongInput}
                          value={product.name}
                          onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                        />
                      </td>
                      <td className={styles.addInputRow}>
                        <input
                          className={styles.addShortInput}
                          value={Number(product.unitPrice).toLocaleString()}
                          onChange={(e) => handleInputChange(idx, 'unitPrice', e.target.value)}
                        />
                      </td>
                      <td className={styles.addInputRow}>
                        <input
                          className={styles.addShortInput}
                          value={product.quantity}
                          onChange={(e) => handleInputChange(idx, 'quantity', e.target.value)}
                        />
                      </td>
                       <td className={styles.addInputRow}>
                        <input
                          className={styles.addShortInput}
                          value={(Number(product.unitPrice) * Number(product.quantity)).toLocaleString()}
                        />
                      </td>
                      <td className={styles.addInputRow}>
                        <input
                          className={styles.addShortInput}
                          value={product.unreceived}
                          onChange={(e) => handleInputChange(idx, 'unreceived', e.target.value)}
                        />
                      </td>
                      <td className={styles.deleteCell}>
                        <button
                          className={styles.trashcanButton}
                          onClick={() => handleDelete(idx)}
                        >
                          <img src={trashcanImg} className={styles.trashcanImage} />
                        </button>
                      </td>
                    </tr>
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
              <div className={styles.addProductButtonWrapper}>
                <button className={styles.addProductButton} onClick={() => handleAddProduct()}>상품 추가하기</button>
              </div>
            </div>
            <div className={styles.modalButton}>
              <button className={styles.deleteButton}  onClick={() => { setOpenedPurchaseEditModalIndex(null); setOpenedPurchaseModalIndex(openedPurchaseEditModalIndex); }}>취소</button>
              <button className={styles.editButton} onClick={() => { setOpenedPurchaseEditModalIndex(null); setOpenedPurchaseModalIndex(openedPurchaseEditModalIndex); }}>저장</button>
            </div>
          </div>
        </div>
      )}

      {openedProductModalIndex !== null && (
        <div className={styles.modalOverlay} onClick={() => setOpenedProductModalIndex(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>상품별 사입내역 조회</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedProductModalIndex(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.purchase}>
              <div className={styles.firstPurchaseRow}>
                <span className={styles.purchaseRowTitle}>사입번호</span>
                <span className={styles.textButton} role="button" style={{ fontSize: '14px' }}>202503010245</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품사입번호</span>
                <span className={styles.textButton} role="button" style={{ fontSize: '14px' }}>202503010245001</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사입일시</span>
                <span className={styles.purchaseRowContent}>2025.03.01. 02:45</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>거래처명</span>
                <span className={styles.purchaseRowContent}>루프</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품명</span>
                <span className={styles.purchaseRowContent}>워싱로우라이즈부츠컷</span>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>구분</span>
                <span className={styles.purchaseRowContent}>바지</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>컬러</span>
                <span className={styles.purchaseRowContent}>중청</span>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사이즈</span>
                <span className={styles.purchaseRowContent}>S</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>기본옵션</span>
                <span className={styles.purchaseRowContent}>-</span>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>단가</span>
                <span className={styles.purchaseRowContent}>23,000원</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>수량</span>
                <span className={styles.purchaseRowContent}>2개</span>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>금액합계</span>
                <span className={styles.purchaseRowContent}>46,000원</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>미송수량</span>
                <span className={styles.purchaseRowContent}>1개</span>
              </div>
            </div>
            <div className={styles.modalButton}>
              <button className={styles.deleteButton}>삭제</button>
              <button className={styles.editButton} onClick={() => { handleProductEditClick(openedProductModalIndex); setOpenedProductModalIndex(null); }}>수정</button>
            </div>
          </div>
        </div>
      )}

      {openedProductEditModalIndex !== null && (
        <div className={styles.modalOverlay} onClick={() => setOpenedProductEditModalIndex(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>상품별 사입내역 수정</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedProductEditModalIndex(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.purchase}>
              <div className={styles.firstPurchaseRow}>
                <span className={styles.purchaseRowTitle}>사입번호</span>
                <span className={styles.textButton} role="button" style={{ fontSize: '14px', marginTop: '7px', marginBottom: '7px' }}>202503010245</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품사입번호</span>
                <span className={styles.textButton} role="button" style={{ fontSize: '14px', marginTop: '7px', marginBottom: '7px' }}>202503010245001</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사입일시</span>
                <input type="datetime-local" className={styles.productEditInput} />
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>거래처명</span>
                <input className={styles.productEditInput} placeholder="루프"/>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품명</span>
                <input className={styles.productEditInput} placeholder="워싱로우라이즈부츠컷"/>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>구분</span>
                <div className={styles.purchaseRowContent}>
                  <input className={styles.purchaseEditInput} placeholder="바지"/>
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>컬러</span>
                <div className={styles.purchaseRowContent}>
                  <input className={styles.purchaseEditInput} placeholder="중청"/>
                </div>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사이즈</span>
                <div className={styles.purchaseRowContent}>
                  <input className={styles.purchaseEditInput} placeholder="S"/>
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>기본옵션</span>
                <div className={styles.purchaseRowContent}>
                  <input className={styles.purchaseEditInput} placeholder="-"/>
                </div>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>단가</span>
                <div className={styles.purchaseRowContent}>
                  <input className={styles.purchaseEditInputWithUnit} placeholder="23,000"/>
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>원</span>
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>수량</span>
                <div className={styles.purchaseRowContent}>
                  <input className={styles.purchaseEditInputWithUnit} placeholder="2"/>
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>개</span>
                </div>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>금액합계</span>
                <div className={styles.purchaseRowContent}>
                  <input className={styles.purchaseEditInputWithUnit} placeholder="46,000"/>
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>원</span>
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>미송수량</span>
                <div className={styles.purchaseRowContent}>
                  <input className={styles.purchaseEditInputWithUnit} placeholder="1"/>
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>개</span>
                </div>
              </div>
            </div>
            <div className={styles.modalButton}>
              <button className={styles.deleteButton} onClick={() => { setOpenedProductEditModalIndex(null); setOpenedProductModalIndex(openedProductEditModalIndex); }}>취소</button>
              <button className={styles.editButton} onClick={() => { setOpenedProductEditModalIndex(null); setOpenedProductModalIndex(openedProductEditModalIndex); }}>저장</button>
            </div>
          </div>
        </div>
      )}

      {openedReservationModalIndex !== null && (
        <div className={styles.modalOverlay} onClick={() => setOpenedReservationModalIndex(null)}>
          <div className={styles.modalContentSmall} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>미송수량 수정</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedReservationModalIndex(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.reservationInputWrapper}>
              <button className={styles.reservationEditButton}>–</button>
              <input className={styles.reservationInput} placeholder="0" />
              <button className={styles.reservationEditButton}>+</button>
            </div>
            <div className={styles.modalButton}>
              <button className={styles.deleteButton} onClick={() => setOpenedReservationModalIndex(null)}>취소</button>
              <button className={styles.editButton} onClick={() => setOpenedReservationModalIndex(null)}>수정</button>
            </div>
          </div>
        </div>
      )}

      {openedReceiptModalIndex !== null && (
        <div className={styles.modalOverlay} onClick={() => setOpenedReceiptModalIndex(null)}>
          <div className={styles.modalContentSmall} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>사입내역 영수증 조회</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedReceiptModalIndex(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.purchase}>
              <div className={styles.firstPurchaseRow}>
                <span className={styles.purchaseRowTitle}>사입번호</span>
                <span className={styles.textButton} role="button" style={{ fontSize: '14px' }}>202503010245</span>
              </div>
            </div>
            <div className={styles.testReceiptImageWrapper}>
              <img src={testReceiptImg} className={styles.testReceiptImage} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}