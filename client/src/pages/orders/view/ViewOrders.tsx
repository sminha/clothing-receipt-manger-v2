import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ViewOrders.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DateTypeTab, { DateType } from '../../../components/DateTypeTab.tsx';
import RangeTab from '../../../components/RangeTab.tsx';
import DatePickerForm from '../../../components/DatePickerForm.tsx';
import SearchInput from '../../../components/SearchInput.tsx';
import UnshippedToggle from '../../../components/UnshippedToggle.tsx';
import Dropdown from '../../../components/Dropdown.tsx';
import buttonPng from '../../../assets/button.png';
import profileImg from '../../../assets/profileImage.jpg';
import excelImg from '../../../assets/excel.png';
import receiptImg from '../../../assets/receipt.png';
import trashcanImg from '../../../assets/trashcan.png';
import testReceiptImg from '../../../assets/test_receipt.png';
import { RootState, AppDispatch } from '../../../redux/store.ts';
import { PurchaseItem, PurchaseRecord, updatePurchase, deletePurchase, updateMissingQuantity, deleteProduct, getPurchases } from '../../../redux/slices/purchaseSlice.ts';
import { useFilteredPurchaseList } from '../../../hooks/useFilteredPurchaseList.ts';
// import VirtualizedGrid from '../../../components/VirtualizedGrid.tsx';

export default function ViewOrders() {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const userInfo = useSelector((state: RootState) => state.user);
  const purchaseList = useSelector((state: RootState) => state.purchase.records);

  // 프로필 모달
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색
  const [selectedType, setSelectedType] = useState<DateType>('all');
  const [selectedRange, setSelectedRange] = useState<'오늘' | '일주일' | '1개월' | '3개월'>('오늘');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedRange === null) return;

    const today = new Date();
    let newStart: Date | null = null;
    const newEnd: Date | null = today;

    switch (selectedRange) {
      case '오늘':
        newStart = today;
        break;
      case '일주일':
        newStart = new Date(today);
        newStart.setDate(today.getDate() - 6);
        break;
      case '1개월':
        newStart = new Date(today);
        newStart.setMonth(today.getMonth() - 1);
        break;
      case '3개월':
        newStart = new Date(today);
        newStart.setMonth(today.getMonth() - 3);
        break;
      default:
        break;
    }

    setStartDate(newStart);
    setEndDate(newEnd);
  }, [selectedRange]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isTodayRange = startDate?.setHours(0, 0, 0, 0) === today.getTime()
                        && endDate?.setHours(0, 0, 0, 0) === today.getTime();

    const isOneWeekRange = endDate.getMonth() === startDate.getMonth() 
                        && endDate.getDate() - startDate.getDate() === 6
                        && endDate?.setHours(0, 0, 0, 0) === today.getTime();

    const isOneMonthRange = endDate.getMonth() - startDate.getMonth() === 1
                        && startDate.getDate() === endDate.getDate()
                        && endDate?.setHours(0, 0, 0, 0) === today.getTime();

    const isThreeMonthsRange = endDate.getMonth() - startDate.getMonth() === 3
                            && startDate.getDate() === endDate.getDate()
                            && endDate?.setHours(0, 0, 0, 0) === today.getTime();

    if (isTodayRange) { setSelectedRange('오늘'); setCustomDateRange({ start: null, end: null}); }
    else if (isOneWeekRange) { setSelectedRange('일주일'); setCustomDateRange({ start: null, end: null}); }
    else if (isOneMonthRange) { setSelectedRange('1개월'); setCustomDateRange({ start: null, end: null}); }
    else if (isThreeMonthsRange) { setSelectedRange('3개월'); setCustomDateRange({ start: null, end: null}); }
    else { setSelectedRange(null); setCustomDateRange({ start: startDate, end: endDate}); }
  }, [startDate, endDate]);

  const [customDateRange, setCustomDateRange] = useState<{ start: Date | null; end: Date | null; }>({ start: null, end: null });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTarget, setSearchTarget] = useState<'vendor' | 'product'>('vendor');
  const [onlyUnshipped, setOnlyUnshipped] = useState(false);

  // 검색 결과
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  useEffect(() => {
    async function fetchPurchases() {
      if (!userInfo || !userInfo.id) return;

      const resultAction = await dispatch(getPurchases(userInfo.id));

      if (getPurchases.rejected.match(resultAction)) {
        alert(resultAction.payload || '사입내역 조회 실패');
      }
    }

    fetchPurchases();
  }, [dispatch, userInfo]);

  const [tempList, setTempList] = useState(purchaseList);

  const listToRender = tempList;
  
  const filteredList = useFilteredPurchaseList(purchaseList, {
    selectedType,
    selectedRange,
    customDateRange,
    keyword: searchKeyword,
    target: searchTarget,
    onlyUnshipped,
  });

  const totalItemsCount = listToRender.reduce((acc, record) => { return acc + record.items.length; }, 0);

  useEffect(() => {
    setTempList(purchaseList);
  }, [purchaseList]);

  useEffect(() => {
    setIsSearchClicked(false);
  }, [
    selectedType,
    selectedRange,
    customDateRange.start,
    customDateRange.end,
    searchKeyword,
    searchTarget,
    onlyUnshipped,
  ]);

  const handleSearch = () => {
    setTempList(filteredList);
  };

  // 정렬
  const [sortConfig, setSortConfig] = useState<{
    key: 'date' | 'createdAt' | 'vendor' | 'name' | 'unitPrice' | 'quantity' | 'totalAmount' | 'missingQuantity';
    direction: 'asc' | 'desc';
  }>({
    key: 'date',
    direction: 'desc'
  })

  const getSortedList = () => {
    const flatList = [...listToRender].sort((a, b) => b.date.localeCompare(a.date)).flatMap(purchase =>
      purchase.items.map(item => ({
        ...item,
        recordId: purchase.id,
        date: purchase.date,
        createdAt: purchase.createdAt,
        vendor: purchase.vendor,
        receiptImage: purchase.receiptImage,
      }))
    );

    return flatList.sort((a, b) => {
      const { key, direction } = sortConfig;
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  };

  // 전체 선택 토글
  const [selected, setSelected] = useState(false);

  // 행 선택 토글
  interface SelectedRow {
    recordId: string;
    itemId: string;
  }

  const [selectedRows, setSelectedRows] = useState<SelectedRow[]>([]);

  const toggleRowSelection = (recordId: string, itemId: string) => {
    setSelectedRows(prev => {
      const exists = prev.some(row => row.recordId === recordId && row.itemId === itemId);
      if (exists) {
        return prev.filter(row => !(row.recordId === recordId && row.itemId === itemId));
      } else {
        return [...prev, { recordId, itemId }];
      }
    });
  };

  const toggleSelectAllRows = () => {
    if (selected) {
      setSelectedRows([]);
      setSelected(false);
    } else {
      const allRows = getSortedList().map(row => ({
        recordId: row.recordId,
        itemId: row.itemId,
      }));
      setSelectedRows(allRows);
      setSelected(true);
    }
  };

  // [DEBUGGING]
  useEffect(() => console.log(purchaseList), []);
  // useEffect(() => { console.log(selectedRows); console.log(purchaseList) }, [selectedRows, purchaseList]);

  // 선택삭제
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteSelectedProducts = () => {
    if (selectedRows.length === 0) return;

    const recordsToUpdate: Record<string, string[]> = {};
    selectedRows.forEach(({ recordId, itemId }) => {
      if (!recordsToUpdate[recordId]) recordsToUpdate[recordId] = [];
      recordsToUpdate[recordId].push(itemId);
    });

    Object.entries(recordsToUpdate).forEach(([recordId, itemIds]) => {
      const record = purchaseList.find(r => r.id === recordId);
      if (!record) return;

      const remainingItems = record.items.filter(item => !itemIds.includes(item.itemId));

      if (remainingItems.length === 0) {
        dispatch(deletePurchase(recordId));
      } else {
        dispatch(updatePurchase({ ...record, items: remainingItems }));
      }
    });

    setSelectedRows([]);
  };
  
  // 미송수량 일괄 변경
  const [isUnreceivedModalOpen, setIsUnreceivedModalOpen] = useState<boolean>(false);

  const handleMissingQuantity = () => {
    for (const row of selectedRows) {
      dispatch(updateMissingQuantity({ recordId: row.recordId, itemId: row.itemId, missingQuantity: 0 }))
    };
  }

  // 엑셀 다운로드
  const formatCreatedAt = (isoString: string) => {
    const date = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const handleDownloadExcel = () => {
    if (!purchaseList || purchaseList.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const excelData = purchaseList.flatMap((record) =>
      record.items.map((item) => ({
        사입번호: record.id,
        사입일시: formatCreatedAt(record.date),
        등록일시: formatCreatedAt(record.createdAt),
        거래처명: record.vendor,
        상품사입번호: item.itemId,
        상품명: item.name,
        구분: item.category,
        컬러: item.color,
        사이즈: item.size,
        옵션: item.options,
        단가: item.unitPrice,
        수량: item.quantity,
        합계금액: item.totalAmount,
        미송수량: item.missingQuantity,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "사입내역");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    const yy = now.getFullYear().toString().slice(-2);
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());

    const dateString = `${yy}${mm}${dd}`;

    const timeString = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    saveAs(data, `사입내역_${dateString}_${timeString}.xlsx`);
  };

  // 사입번호 모달
  const [openedPurchaseId, setOpenedPurchaseId] = useState<string | null>(null);
  
  const handlePurchaseClick = (purchaseId: string) => {
    setOpenedPurchaseId(purchaseId);
  };

  const [isPurchaseDeleteModalOpen, setIsPurchaseDeleteModalOpen] = useState<boolean>(false);

  // 사입번호 수정 모달
  const [openedPurchaseEditId, setOpenedPurchaseEditId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState<PurchaseRecord | null>(null);

  useEffect(() => {
    if (openedPurchaseEditId !== null) {
      const purchaseToEdit = purchaseList.find(p => p.id === openedPurchaseEditId);
      if (purchaseToEdit) {
        setEditForm({ ...purchaseToEdit });
      }
    }
  }, [openedPurchaseEditId, purchaseList]);

  const handleEditFieldChange = (field: keyof PurchaseRecord, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleEditItemChange = (
    idx: number,
    field: keyof PurchaseItem,
    value: string | number
  ) => {
    if (!editForm) return;
    const updatedItems = [...editForm.items];
    updatedItems[idx] = {
      ...updatedItems[idx],
      [field]: field === 'unitPrice' || field === 'quantity' || field === 'missingQuantity'
        ? Number(value)
        : value,
      totalAmount:
        field === 'unitPrice' || field === 'quantity'
          ? field === 'unitPrice'
            ? Number(value) * updatedItems[idx].quantity
            : updatedItems[idx].unitPrice * Number(value)
          : updatedItems[idx].unitPrice * updatedItems[idx].quantity,
    };
    setEditForm({ ...editForm, items: updatedItems });
  };

  const handleDelete = (index: number) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      };
    });
  };

  const [openedProductAdd, setOpenedProductAdd] = useState(false);
  const [newProductForm, setNewProductForm] = useState<PurchaseItem | null>(null);

  const handleAddProduct = () => {
    if (!editForm) return;

    // const purchaseDate = new Date(editForm.date);
    // const purchaseId =
    //   purchaseDate.getFullYear().toString() +
    //   String(purchaseDate.getMonth() + 1).padStart(2, "0") +
    //   String(purchaseDate.getDate()).padStart(2, "0") +
    //   String(purchaseDate.getHours()).padStart(2, "0") +
    //   String(purchaseDate.getMinutes()).padStart(2, "0");
    const purchaseIdNumber = Number(editForm.id) || 0;
    const purchaseId = String(purchaseIdNumber).padStart(5, '0');

    const existingItems = editForm.items.filter(item =>
      item.itemId.startsWith(purchaseId)
    );

    let nextSeq = 1;
    if (existingItems.length > 0) {
      const maxSeq = Math.max(
        ...existingItems.map(item =>
          parseInt(item.itemId.slice(purchaseId.length), 10)
        )
      );
      nextSeq = maxSeq + 1;
    }

    const newItemId = `${purchaseId}${String(nextSeq).padStart(3, "0")}`;

    setNewProductForm({
      itemId: newItemId,
      name: '',
      category: '',
      color: '',
      size: '',
      options: '',
      unitPrice: 0,
      quantity: 0,
      totalAmount: 0,
      missingQuantity: 0,
    });

    setOpenedProductAdd(true);
  };

  const handleEditNewProductFieldChange = (field: keyof PurchaseItem, value: string | number) => {
    if (!newProductForm) return;

    const updatedValue =
      field === 'unitPrice' || field === 'quantity' || field === 'missingQuantity'
        ? Number(value)
        : value;

    let updatedTotalAmount = newProductForm.totalAmount;
    if (field === 'unitPrice') updatedTotalAmount = Number(value) * newProductForm.quantity;
    if (field === 'quantity') updatedTotalAmount = newProductForm.unitPrice * Number(value);

    setNewProductForm({
      ...newProductForm,
      [field]: updatedValue,
      totalAmount: updatedTotalAmount,
    });
  };

  const handleSaveNewProduct = () => {
    if (!editForm || !newProductForm) return;
    setEditForm({
      ...editForm,
      items: [...editForm.items, newProductForm],
    });
    setOpenedProductAdd(false);
  };

  const handleSaveEditedPurchase = () => {
    if (editForm) {
      dispatch(updatePurchase(editForm));
      setOpenedPurchaseEditId(null);
      setOpenedPurchaseId(editForm.id);
    }
  };

  const totalQuantityOfPurchaseEdit = editForm?.items.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;
  const totalPriceOfPurchaseEdit = editForm?.items.reduce((sum, item) => sum + Number(item.unitPrice) * Number(item.quantity), 0) ?? 0;
  const totalUnreceivedOfPurchaseEdit = editForm?.items.reduce((sum, item) => sum + Number(item.missingQuantity), 0) ?? 0;

  // 상품사입번호 모달
  const [openedProductId, setOpenedProductId] = useState<string | null>(null);

  const selectedProduct = React.useMemo(() => {
    if (!openedProductId) return null;
    
    for (const purchase of purchaseList) {
      const foundProduct = purchase.items.find((item) => item.itemId === openedProductId);
      if (foundProduct) {
        return { purchase, product: foundProduct };
      }
    }
    return null;
  }, [openedProductId, purchaseList]);

  const handleProductClick = (productId: string) => {
    setOpenedProductId(productId);
  };

  const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] = useState<boolean>(false);

  // 상품사입번호 수정 모달
  const [openedProductEditId, setOpenedProductEditId] = useState<string | null>(null);

  const [editPurchaseInfo, setEditPurchaseInfo] = useState<{ id: string; date: string; vendor: string } | null>(null);
  const [editProductForm, setEditProductForm] = useState<PurchaseItem | null>(null);

  const [purchaseInfo, setPurchaseInfo] = useState<{
    id: string;
    date: string;
    vendor: string;
  } | null>(null);

  useEffect(() => {
    if (openedProductEditId && selectedProduct) {
      setEditProductForm(selectedProduct.product);
      setPurchaseInfo({
        id: selectedProduct.purchase.id,
        date: selectedProduct.purchase.date,
        vendor: selectedProduct.purchase.vendor,
      });
    }
  }, [openedProductEditId, selectedProduct]);

  const handleOpenProductEdit = () => {
    if (selectedProduct) {
      setEditProductForm({ ...selectedProduct.product });
      setEditPurchaseInfo({
        id: selectedProduct.purchase.id,
        date: selectedProduct.purchase.date,
        vendor: selectedProduct.purchase.vendor,
      });
    }
  };

  const handleEditProductFieldChange = (field: keyof PurchaseItem, value: string | number) => {
    if (!editProductForm) return;

    const updatedValue =
      field === 'unitPrice' || field === 'quantity' || field === 'missingQuantity'
        ? Number(value)
        : value;

    let updatedTotalAmount = editProductForm.totalAmount;
    if (field === 'unitPrice') updatedTotalAmount = Number(value) * editProductForm.quantity;
    if (field === 'quantity') updatedTotalAmount = editProductForm.unitPrice * Number(value);

    setEditProductForm({
      ...editProductForm,
      [field]: updatedValue,
      totalAmount: updatedTotalAmount,
    });
  };

  const handleSaveEditedProduct = () => {
    if (!editProductForm || !editPurchaseInfo) return;

    const originalPurchase = purchaseList.find((p) => p.id === editPurchaseInfo.id);
    if (!originalPurchase) return;

    const updatedItems = originalPurchase.items.map(item =>
      item.itemId === editProductForm.itemId ? editProductForm : item
    );

    const updatedPurchase: PurchaseRecord = {
      ...originalPurchase,
      date: editPurchaseInfo.date,
      vendor: editPurchaseInfo.vendor,
      items: updatedItems,
    };

    dispatch(updatePurchase(updatedPurchase));
  };

  // [TODO] 위치 정리 필요  
  const [openedReceiptModalIndex, setOpenedReceiptModalIndex] = useState<number | null>(null);

  const handleReceiptClick = (index: number) => {
    setOpenedReceiptModalIndex(index);
  }

  // 미송수량 수정
  const [openedProductReservationId, setOpenedProductReservationId] = useState<string | null>(null);

  const selectedProductReservation = React.useMemo(() => {
    if (!openedProductReservationId) return null;
    
    for (const purchase of purchaseList) {
      const foundProduct = purchase.items.find((item) => item.itemId === openedProductReservationId);
      if (foundProduct) {
        return { purchase, product: foundProduct };
      }
    }
    return null;
  }, [openedProductReservationId, purchaseList]);

  const handleProductReservationClick = (productId: string) => {
    setOpenedProductReservationId(productId);
  };

  const [localMissingQuantity, setLocalMissingQuantity] = useState<number>(0);

  useEffect(() => {
    if (selectedProductReservation) {
      setLocalMissingQuantity(selectedProductReservation.product.missingQuantity);
    }
  }, [selectedProductReservation]);

  // 테이블 스크롤
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const header = headerRef.current;

    if (!body || !header) return;

    const handleScroll = () => {
      header.scrollLeft = body.scrollLeft;
    };

    body.addEventListener("scroll", handleScroll);
    return () => {
      body.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 페이지네이션
  const [itemsPerPage, setItemsPerPage] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
          <span className={styles.profileName} role="button" onClick={toggleDropdown}>{userInfo.name}님</span>
          {isDropdownOpen && (
            <div className={styles.dropdown} ref={dropdownRef}>
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
              <RangeTab selected={selectedRange} onSelect={setSelectedRange} disabled={selectedType === 'all'} />
              <div className={styles.datePickerFormWrapper}>
                <DatePickerForm
                  disabled={selectedType === 'all'}
                  value={selectedType === 'all' ? null : startDate}
                  onChange={setStartDate}
                />
                <DatePickerForm
                  disabled={selectedType === 'all'}
                  value={selectedType === 'all' ? null : endDate}
                  onChange={setEndDate}
                />
              </div>
            </div>
          </div>

          <div className={styles.condition}>
            <span className={styles.conditionTitle}>상세조건</span>
            <div className={styles.conditionWrapper}>
              <SearchInput
                keyword={searchKeyword}
                onKeywordChange={setSearchKeyword}
                target={searchTarget}
                onTargetChange={setSearchTarget}
              />
              <UnshippedToggle
                onlyUnshipped={onlyUnshipped}
                onChange={setOnlyUnshipped}
              />
            </div>
          </div>
          <div className={styles.searchButtonWrapper}>
            <button className={styles.searchButton} onClick={handleSearch}>검색</button>
          </div>
        </div>

        <div className={styles.resultWrapper}>
          <div className={styles.resultHeader}>
            <div className={styles.leftResultHeader}>
              <span className={styles.resultTitle}>전체 {totalItemsCount} 건</span>
            </div>
            <div className={styles.rightResultHeader}>
              <Dropdown
                options={['사입일시 기준', '등록일시 기준', '거래처명 기준', '상품명 기준', '상품단가 기준', '상품수량 기준', '금액합계 기준', '미송수량 기준']}
                width={'108px'}
                onChange={(selected: string) => {
                  switch (selected) {
                    case '사입일시 기준':
                      setSortConfig((prev) => ({ ...prev, key: 'date' }));
                      break;
                    case '등록일시 기준':
                      setSortConfig((prev) => ({ ...prev, key: 'createdAt' }));
                      break;
                    case '거래처명 기준':
                      setSortConfig((prev) => ({ ...prev, key: 'vendor' }));
                      break;
                    case '상품명 기준':
                      setSortConfig((prev) => ({ ...prev, key: 'name' }));
                      break;
                    case '상품단가 기준':
                      setSortConfig((prev) => ({ ...prev, key: 'unitPrice' }));
                      break;
                    case '상품수량 기준':
                      setSortConfig((prev) => ({ ...prev, key: 'quantity' }));
                      break;
                    case '금액합계 기준':
                      setSortConfig((prev) => ({ ...prev, key: 'totalAmount' }));
                      break;
                    case '미송수량 기준':
                      setSortConfig((prev) => ({ ...prev, key: 'missingQuantity' }));
                      break;
                  }
                }}
              />
              <Dropdown
                options={['내림차순', '오름차순']}
                width={'80px'}
                onChange={(selected: string) => {
                  setSortConfig((prev) => ({ ...prev, direction: selected === '오름차순' ? 'asc' : 'desc' }))
                }}
              />
              <Dropdown
                options={['50개씩', '100개씩', '150개씩', '200개씩']}
                width={'82px'}
                onChange={(selected: string) => {
                  setItemsPerPage(parseInt(selected, 10));
                }}
              />
            </div>
          </div>
          <hr className={styles.resultDivider}/>
          <div className={styles.resultNavBar}>
            <div className={styles.leftResultNavBar}>
              <button className={styles.navBarButton} onClick={() => setIsDeleteModalOpen(true)}>
                선택삭제
              </button>
              <button className={styles.navBarButton} onClick={() => setIsUnreceivedModalOpen(true)}>
                미송건 수령 완료
              </button>
            </div>
            <div className={styles.rightResultNavBar}>
              <button className={styles.downloadButton} onClick={handleDownloadExcel}>
                <img src={excelImg} className={styles.excelImg} />
                엑셀 다운로드
              </button>
            </div>
          </div>

          <div className={styles.resultContent}>
            <div className={styles.tableScrollContainer}>
              <div ref={headerRef} className={styles.headerWrapper}>
                <table className={styles.resultTable} style={{ marginTop: '10px' }}>
                  <colgroup>
                    <col style={{ width: '30px' }} />
                    <col style={{ width: '130px' }} />
                    <col style={{ width: '160px' }} />
                    <col style={{ width: '160px' }} />
                    <col style={{ width: '140px' }} />
                    <col style={{ width: '140px' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '80px' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '80px' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '80px' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>
                        <button
                          type="button"
                          className={`${styles.button} ${selected ? styles.selected : ''}`}
                          onClick={toggleSelectAllRows}
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
                </table>
              </div>

              <div ref={bodyRef} className={styles.bodyWrapper}>
                <table className={styles.resultTable}>
                  <colgroup>
                    <col style={{ width: "30px" }} />
                    <col style={{ width: "130px" }} />
                    <col style={{ width: "160px" }} />
                    <col style={{ width: "160px" }} />
                    <col style={{ width: "140px" }} />
                    <col style={{ width: "140px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "80px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "80px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: '80px' }} />
                  </colgroup>
                  <tbody className={styles.tbodyWrapper}>
                    {getSortedList().slice(startIndex, endIndex).map((row) => {
                      const isSelected = selectedRows.some(
                        r => r.recordId === row.recordId && r.itemId === row.itemId
                      );

                      return (
                        <tr
                          key={`${row.recordId}-${row.itemId}`}
                          style={{ backgroundColor: isSelected ? '#efe6e6' : 'transparent' }}
                          role='row'
                        >
                          <td>
                            <button
                              type="button"
                              className={`${styles.button} ${isSelected ? styles.selected : ''}`}
                              onClick={() => toggleRowSelection(row.recordId, row.itemId)}
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
                          <td>
                            <span
                              className={styles.textButton}
                              role="button"
                              onClick={() => handlePurchaseClick(row.recordId)}
                            >
                              {row.recordId}
                            </span>
                          </td>
                          <td>
                            <span
                              className={styles.textButton}
                              role="button"
                              onClick={() => handleProductClick(row.itemId)}
                            >
                              {row.itemId}
                            </span>
                          </td>
                          {/* <td>{row.date.replace(/-/g, '.').replace('T', ' ')}</td> */}
                          <td>{row.date}</td>
                          <td>{row.vendor}</td>
                          <td>{row.name}</td>
                          <td>{row.category}</td>
                          <td>{row.color || '-'}</td>
                          <td>{row.size || '-'}</td>
                          <td>{row.options || '-'}</td>
                          <td>{row.unitPrice.toLocaleString()}</td>
                          <td>{row.quantity}</td>
                          <td>{row.totalAmount.toLocaleString()}</td>
                          <td>
                            <span
                              className={styles.textButton}
                              role="button"
                              onClick={() => handleProductReservationClick(row.itemId)}
                            >
                              {row.missingQuantity}
                            </span>
                          </td>
                          <td>
                            <img
                              src={receiptImg}
                              className={styles.receiptImg}
                              onClick={() => handleReceiptClick(row.recordId)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* <VirtualizedGrid
                  data={getSortedList().slice(startIndex, endIndex)}
                  selectedRows={selectedRows}
                  toggleRowSelection={toggleRowSelection}
                  handlePurchaseClick={handlePurchaseClick}
                  handleProductClick={handleProductClick}
                  handleProductReservationClick={handleProductReservationClick}
                  handleReceiptClick={handleReceiptClick}
                  receiptImg={receiptImg}
                  toggleSelectAllRows={toggleSelectAllRows}
                  selectedAll={selected}
                  outerRef={bodyRef}
                /> */}
              </div>
            </div>
            <div className={styles.pagination}>
              <button className={styles.pageButton} onClick={handlePrev} disabled={currentPage === 1}>
                <FaChevronLeft size={10} />
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={currentPage === idx + 1 ? `${styles.activeButton}` : `${styles.pageButton}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button className={styles.pageButton} onClick={handleNext} disabled={currentPage === totalPages}>
                <FaChevronRight size={10} />  
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: '280px' }}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}></span>
              <button
                className={styles.closeButton}
                onClick={() => setIsDeleteModalOpen(false)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.periodContent}>
              <span>{selectedRows.length}건을 삭제하시겠습니까?</span>
            </div>
            <div className={styles.modalButton} style={{ justifyContent: 'center' }}>
              <button
                className={styles.deleteButton} 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className={styles.editButton}
                onClick={() => {
                  handleDeleteSelectedProducts();
                  setIsDeleteModalOpen(false);
                  setSelectedRows([]);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {isUnreceivedModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsUnreceivedModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: '280px' }}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}></span>
              <button
                className={styles.closeButton}
                onClick={() => setIsUnreceivedModalOpen(false)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.periodContent}>
              <span>{selectedRows.length}건의 미송건을 수령처리하시겠습니까?</span>
            </div>
            <div className={styles.modalButton} style={{ justifyContent: 'center' }}>
              <button
                className={styles.deleteButton} 
                onClick={() => setIsUnreceivedModalOpen(false)}
              >
                취소
              </button>
              <button
                className={styles.editButton}
                onClick={() => {
                  handleMissingQuantity();
                  setIsUnreceivedModalOpen(false);
                  setSelectedRows([]);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* [사입내역 조회] */}
      {openedPurchaseId !== null && (() => {
        const selectedPurchase = purchaseList.find(p => p.id === openedPurchaseId);
        if (!selectedPurchase) return null;

        const totalQuantity = selectedPurchase.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = selectedPurchase.items.reduce((sum, item) => sum + item.totalAmount, 0);
        const totalUnreceived = selectedPurchase.items.reduce((sum, item) => sum + item.missingQuantity, 0);

        return (
          <div className={styles.modalOverlay} onClick={() => setOpenedPurchaseId(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <span className={styles.periodTitle}>사입내역 조회</span>
                <button
                  className={styles.closeButton}
                  onClick={() => setOpenedPurchaseId(null)}
                  aria-label="모달 닫기"
                >
                  &times;
                </button>
              </div>
              <div className={styles.purchase}>
                <div className={styles.firstPurchaseRow}>
                  <span className={styles.purchaseRowTitle}>사입번호</span>
                  <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>
                    {selectedPurchase.id}
                  </span>
                </div>
                <div className={styles.purchaseRow}>
                  <span className={styles.purchaseRowTitle}>사입일시</span>
                  <span className={styles.purchaseRowContent}>
                    {selectedPurchase.date.replace('T', ' ').replace(/-/g, '.')}
                  </span>
                </div>
                <div className={styles.purchaseRow}>
                  <span className={styles.purchaseRowTitle}>거래처명</span>
                  <span className={styles.purchaseRowContent}>{selectedPurchase.vendor}</span>
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
                    {selectedPurchase.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>
                            {item.itemId}
                          </span>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.unitPrice.toLocaleString()}</td>
                        <td>{item.quantity}</td>
                        <td>{item.totalAmount.toLocaleString()}</td>
                        <td>{item.missingQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.hr}></div>
                <div className={styles.summaryRow}>
                  <div className={styles.totalItemWrapper}>
                    <span className={styles.totalItem}>{selectedPurchase.items.length}건</span>
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
                <button
                  className={styles.deleteButton} 
                  onClick={() => {
                    // dispatch(deletePurchase(openedPurchaseId));
                    setIsPurchaseDeleteModalOpen(true);
                  }}
                >
                  삭제
                </button>
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setOpenedPurchaseEditId(openedPurchaseId);
                    setOpenedPurchaseId(null);
                  }}
                >
                  수정
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* [사입내역 삭제] */}
      {isPurchaseDeleteModalOpen && openedPurchaseId && (
        <div className={styles.modalOverlay} onClick={() => setIsPurchaseDeleteModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: '280px' }}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}></span>
              <button
                className={styles.closeButton}
                onClick={() => setIsPurchaseDeleteModalOpen(false)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.periodContent}>
              <span>해당 사입내역을 삭제하시겠습니까?</span>
            </div>
            <div className={styles.modalButton} style={{ justifyContent: 'center' }}>
              <button
                className={styles.deleteButton} 
                onClick={() => setIsPurchaseDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className={styles.editButton}
                onClick={() => {
                  dispatch(deletePurchase(openedPurchaseId));
                  setIsPurchaseDeleteModalOpen(false);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* [사입내역 수정] */}
      {openedPurchaseEditId !== null && (
        <div className={styles.modalOverlay}  onClick={() => setOpenedPurchaseEditId(null)}>
          <div className={styles.modalContent}  onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>사입내역 수정</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedPurchaseEditId(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.purchase}>
              <div className={styles.firstPurchaseRow}>
                <span className={styles.purchaseRowTitle}>사입번호</span>
                <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>{openedPurchaseEditId}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사입일시</span>
                <input
                  type="datetime-local"
                  className={styles.productEditInput}
                  value={editForm?.date ?? ''}
                  onChange={(e) => handleEditFieldChange('date', e.target.value)}
                />
              </div>
              <div className={styles.purchaseRow} style={{ marginBottom: '12px' }}>
                <span className={styles.purchaseRowTitle}>거래처명</span>
                <input
                  className={styles.productEditInput}
                  value={editForm?.vendor ?? ''}
                  onChange={(e) => handleEditFieldChange('vendor', e.target.value)}
                />
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
                  {editForm?.items.map((_, idx) => (
                    <tr key={idx}>
                      <td className={styles.addInputRow}>
                        <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>{editForm?.items[idx].itemId}</span>
                      </td>
                      <td className={styles.addInputRow}>
                        <input
                          className={styles.addLongInput}
                          value={editForm?.items[idx]?.name ?? ''}
                          onChange={(e) => handleEditItemChange(idx, 'name', e.target.value)}
                        />
                      </td>
                      <td className={styles.addInputRow}>
                        <input
                          className={styles.addShortInput}
                          value={editForm?.items[idx].unitPrice ?? ''}
                          onChange={(e) => handleEditItemChange(idx, 'unitPrice', e.target.value)}
                        />
                      </td>
                      <td className={styles.addInputRow}>
                        <input
                          className={styles.addShortInput}
                          value={editForm?.items[idx].quantity ?? ''}
                          onChange={(e) => handleEditItemChange(idx, 'quantity', e.target.value)}
                        />
                      </td>
                      <td className={styles.addInputRow}>
                        <input
                          className={styles.addShortInput}
                          value={(Number(editForm?.items[idx].unitPrice) * Number(editForm?.items[idx].quantity)).toLocaleString()}
                          readOnly
                        />
                      </td>
                      <td className={styles.addInputRow}>
                        <input
                          className={styles.addShortInput}
                          value={editForm?.items[idx].missingQuantity ?? ''}
                          onChange={(e) => handleEditItemChange(idx, 'missingQuantity', e.target.value)}
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
                  <span className={styles.totalItem}>{editForm?.items.length ?? 0}건</span>
                </div>
                <div className={styles.totalQuantityWrapper}>
                  <span className={styles.totalQuantity}>{totalQuantityOfPurchaseEdit}개</span>
                </div>
                <div className={styles.totalPriceWrapper}>
                  <span className={styles.totalPrice}>{totalPriceOfPurchaseEdit.toLocaleString()}원</span>
                </div>
                <div className={styles.totalUnreceivedWrapper}>
                  <span className={styles.totalUnreceived}>{totalUnreceivedOfPurchaseEdit}개</span>
                </div>
              </div>
              <div className={styles.addProductButtonWrapper}>
                <button className={styles.addProductButton} onClick={() => handleAddProduct()}>상품 추가하기</button>
              </div>
            </div>
            <div className={styles.modalButton}>
              <button
                className={styles.deleteButton} 
                onClick={() => {
                  setOpenedPurchaseId(openedPurchaseEditId);
                  setOpenedPurchaseEditId(null);
                }}
              >
                취소
              </button>
              <button
                className={styles.editButton}
                onClick={() => {
                  handleSaveEditedPurchase();
                  setOpenedPurchaseId(openedPurchaseEditId);
                  setOpenedPurchaseEditId(null);
                }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* [상품 추가하기] */}
      {openedProductAdd && newProductForm && editForm && (
        <div className={styles.modalOverlay} onClick={() => setOpenedProductAdd(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>상품 추가하기</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedProductAdd(false)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.purchase}>
              <div className={styles.firstPurchaseRow}>
                <span className={styles.purchaseRowTitle}>사입번호</span>
                <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>{editForm.id}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품사입번호</span>
                <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>
                  {newProductForm.itemId}
                </span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사입일시</span>
                <span className={styles.purchaseRowContent}>{editForm.date.replace('T', ' ').replace(/-/g, '.')}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>거래처명</span>
                <span className={styles.purchaseRowContent}>{editForm.vendor}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품명</span>
                <input
                  className={styles.productEditInput}
                  value={newProductForm.name}
                  onChange={(e) => handleEditNewProductFieldChange('name', e.target.value)}
                />
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>구분</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={newProductForm.category}
                    onChange={(e) => handleEditNewProductFieldChange('category', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>컬러</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={newProductForm.color}
                    onChange={(e) => handleEditNewProductFieldChange('color', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사이즈</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={newProductForm.size}
                    onChange={(e) => handleEditNewProductFieldChange('size', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>기타옵션</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={newProductForm.options}
                    onChange={(e) => handleEditNewProductFieldChange('options', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>단가</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={newProductForm.unitPrice}
                    onChange={(e) => handleEditNewProductFieldChange('unitPrice', e.target.value)}
                  />
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>원</span>
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>수량</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={newProductForm.quantity}
                    onChange={(e) => handleEditNewProductFieldChange('quantity', e.target.value)}
                  />
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
                  <input
                    className={styles.purchaseEditInput}
                    value={newProductForm.totalAmount}
                    onChange={(e) => handleEditNewProductFieldChange('totalAmount', e.target.value)}
                  />
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>원</span>
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>미송수량</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={newProductForm.missingQuantity}
                    onChange={(e) => handleEditNewProductFieldChange('missingQuantity', e.target.value)}
                  />
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>개</span>
                </div>
              </div>
            </div>
            <div className={styles.modalButton}>
              <button
                className={styles.deleteButton}
                onClick={() => setOpenedProductAdd(false)}
              >
                취소
              </button>
              <button
                className={styles.editButton}
                onClick={handleSaveNewProduct}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* [상품별 사입내역 조회] */}
      {openedProductId && selectedProduct && (
        <div className={styles.modalOverlay} onClick={() => setOpenedProductId(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>상품별 사입내역 조회</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedProductId(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.purchase}>
              <div className={styles.firstPurchaseRow}>
                <span className={styles.purchaseRowTitle}>사입번호</span>
                <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>
                  {selectedProduct.purchase.id}
                </span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품사입번호</span>
                <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>
                  {selectedProduct.product.itemId}
                </span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사입일시</span>
                <span className={styles.purchaseRowContent}>{selectedProduct.purchase.date.replace('-', '.').replace('-', '.').replace('T', ' ')}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>거래처명</span>
                <span className={styles.purchaseRowContent}>{selectedProduct.purchase.vendor}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품명</span>
                <span className={styles.purchaseRowContent}>{selectedProduct.product.name}</span>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>구분</span>
                <span className={styles.purchaseRowContent}>{selectedProduct.product.category || '-'}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>컬러</span>
                <span className={styles.purchaseRowContent}>{selectedProduct.product.color || '-'}</span>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사이즈</span>
                <span className={styles.purchaseRowContent}>{selectedProduct.product.size || '-'}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>기타옵션</span>
                <span className={styles.purchaseRowContent}>{selectedProduct.product.options || '-'}</span>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>단가</span>
                <span className={styles.purchaseRowContent}>{Number(selectedProduct.product.unitPrice).toLocaleString()}원</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>수량</span>
                <span className={styles.purchaseRowContent}>{selectedProduct.product.quantity}개</span>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>금액합계</span>
                <span className={styles.purchaseRowContent}>
                  {(Number(selectedProduct.product.unitPrice) * Number(selectedProduct.product.quantity)).toLocaleString()}원
                </span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>미송수량</span>
                <span className={styles.purchaseRowContent}>{selectedProduct.product.missingQuantity}개</span>
              </div>
            </div>
            <div className={styles.modalButton}>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  // dispatch(deleteProduct({ recordId: selectedProduct.purchase.id, itemId: selectedProduct.product.itemId }))
                  setIsProductDeleteModalOpen(true);
                }}
              >
                삭제
              </button>
              <button
                className={styles.editButton}
                onClick={() => {
                  handleOpenProductEdit();
                  setOpenedProductEditId(selectedProduct.product.itemId); 
                  setOpenedProductId(null);
                }}
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* [상품별 사입내역 삭제] */}
      {isProductDeleteModalOpen && selectedProduct && (
        <div className={styles.modalOverlay} onClick={() => setIsProductDeleteModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: '280px' }}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}></span>
              <button
                className={styles.closeButton}
                onClick={() => setIsProductDeleteModalOpen(false)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.periodContent}>
              <span>해당 상품을 삭제하시겠습니까?</span>
            </div>
            <div className={styles.modalButton} style={{ justifyContent: 'center' }}>
              <button
                className={styles.deleteButton} 
                onClick={() => setIsProductDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className={styles.editButton}
                onClick={() => {
                  dispatch(deleteProduct({ recordId: selectedProduct.purchase.id, itemId: selectedProduct.product.itemId }))
                  setIsProductDeleteModalOpen(false);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* [상품별 사입내역 ] */}
      {openedProductEditId !== null && editProductForm && editPurchaseInfo && (
        <div className={styles.modalOverlay} onClick={() => setOpenedProductEditId(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>상품별 사입내역 수정</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedProductEditId(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.purchase}>
              <div className={styles.firstPurchaseRow}>
                <span className={styles.purchaseRowTitle}>사입번호</span>
                <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>{editPurchaseInfo.id}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품사입번호</span>
                <span className={styles.textButton} style={{ fontSize: '14px', cursor: 'default' }}>{openedProductEditId}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사입일시</span>
                <span className={styles.purchaseRowContent} style={{ fontSize: '14px' }}>{editPurchaseInfo.date.replace('-', '.').replace('-', '.').replace('T', ' ')}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>거래처명</span>
                <span className={styles.purchaseRowContent} style={{ fontSize: '14px' }}>{editPurchaseInfo.vendor}</span>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>상품명</span>
                <input
                  className={styles.productEditInput}
                  value={editProductForm?.name ?? ''}
                  onChange={(e) => handleEditProductFieldChange('name', e.target.value)}
                />
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>구분</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={editProductForm?.category ?? ''}
                    onChange={(e) => handleEditProductFieldChange('category', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>컬러</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={editProductForm?.color ?? ''}
                    onChange={(e) => handleEditProductFieldChange('color', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>사이즈</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={editProductForm?.size ?? ''}
                    onChange={(e) => handleEditProductFieldChange('size', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>기타옵션</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={editProductForm?.options ?? ''}
                    onChange={(e) => handleEditProductFieldChange('options', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.product}>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>단가</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={editProductForm?.unitPrice ?? ''}
                    onChange={(e) => handleEditProductFieldChange('unitPrice', e.target.value)}
                  />
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>원</span>
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>수량</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={editProductForm?.quantity ?? ''}
                    onChange={(e) => handleEditProductFieldChange('quantity', e.target.value)}
                  />
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
                  <input
                    className={styles.purchaseEditInput}
                    value={editProductForm?.totalAmount ?? ''}
                    onChange={(e) => handleEditProductFieldChange('totalAmount', e.target.value)}
                  />
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>원</span>
                </div>
              </div>
              <div className={styles.purchaseRow}>
                <span className={styles.purchaseRowTitle}>미송수량</span>
                <div className={styles.purchaseRowContent}>
                  <input
                    className={styles.purchaseEditInput}
                    value={editProductForm?.missingQuantity ?? ''}
                    onChange={(e) => handleEditProductFieldChange('missingQuantity', e.target.value)}
                  />
                </div>
                <div className={styles.unitWrapper}>
                  <span className={styles.unit}>개</span>
                </div>
              </div>
            </div>
            <div className={styles.modalButton}>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  setOpenedProductId(openedProductEditId);
                  setOpenedProductEditId(null);
                }}
              >
                취소
              </button>
              <button
                className={styles.editButton}
                onClick={() => {
                  handleSaveEditedProduct();
                  setOpenedProductId(openedProductEditId);
                  setOpenedProductEditId(null);
                }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {openedProductReservationId && selectedProductReservation && (
        <div className={styles.modalOverlay} onClick={() => setOpenedProductReservationId(null)}>
          <div className={styles.modalContentSmall} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.periodTitle}>미송수량 수정</span>
              <button
                className={styles.closeButton}
                onClick={() => setOpenedProductReservationId(null)}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>
            <div className={styles.reservationInputWrapper}>
              <button className={styles.reservationEditButton} onClick={() => setLocalMissingQuantity(localMissingQuantity - 1)}>–</button>
              <input
                className={styles.reservationInput}
                value={localMissingQuantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    setLocalMissingQuantity(value);
                  }
                }}
              />
              <button className={styles.reservationEditButton} onClick={() => setLocalMissingQuantity(localMissingQuantity + 1)}>+</button>
            </div>
            <div className={styles.modalButton}>
              <button className={styles.deleteButton} onClick={() => setOpenedProductReservationId(null)}>취소</button>
              <button
                className={styles.editButton}
                onClick={() => {
                  dispatch(updateMissingQuantity({
                    recordId: selectedProductReservation.purchase.id,
                    itemId: selectedProductReservation.product.itemId,
                    missingQuantity: localMissingQuantity,
                  }));
                  setOpenedProductReservationId(null);
                }}
              >
                수정
              </button>
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