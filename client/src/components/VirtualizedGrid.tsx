import React, { useRef, useEffect } from 'react';
import { Grid, type CellComponentProps } from 'react-window';
import styles from './VirtualizedGrid.module.css';

export interface RowData {
  recordId: string;
  itemId: string;
  date: string;
  vendor: string;
  name: string;
  category: string;
  color: string;
  size: string;
  options?: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  missingQuantity: number;
}

export interface SelectedRow {
  recordId: string;
  itemId: string;
}

export type VirtualizedGridProps = {
  data: RowData[];
  selectedRows: SelectedRow[];
  toggleRowSelection: (recordId: string, itemId: string) => void;
  handlePurchaseClick: (purchaseId: string) => void;
  handleProductClick: (productId: string) => void;
  handleProductReservationClick: (productId: string) => void;
  handleReceiptClick: (recordId: string) => void;
  receiptImg: string;
  toggleSelectAllRows: () => void; // 추가
  selectedAll: boolean; // 추가
};

const columnWidths = [
  70, 130, 206, 166, 180, 150, 135, 113, 135, 112, 80, 100, 80, 100, 80,
];

const columnFields = [
  'checkbox','recordId','itemId','date','vendor','name','category','color','size','options',
  'unitPrice','quantity','totalAmount','missingQuantity','receiptImg'
] as const;

const rowHeight = 40;

export default function VirtualizedGrid({
  data,
  selectedRows,
  toggleRowSelection,
  handlePurchaseClick,
  handleProductClick,
  handleProductReservationClick,
  handleReceiptClick,
  receiptImg,
  toggleSelectAllRows,
  selectedAll
}: VirtualizedGridProps) {
  const CellComponent = ({
    columnIndex,
    rowIndex,
    style,
    rows,
    selectedRows: selRows,
    toggleRowSelection: toggle,
    handlePurchaseClick: onPurchase,
    handleProductClick: onProduct,
    handleProductReservationClick: onReserve,
    handleReceiptClick: onReceipt,
    receiptImg: imgSrc,
    toggleSelectAllRows,
    selectedAll
  }: CellComponentProps<VirtualizedGridProps & { rows: RowData[]; selectedRows: SelectedRow[] }>) => {
    // const { rows, selectedRows, toggleRowSelection } = data;

    // if (rowIndex === 0) {
    //   if (columnIndex === 0) {
    //     return (
    //       <div style={style} className={styles.headerCell}>
    //         <button
    //           type="button"
    //           className={`${styles.button} ${selectedAll ? styles.selected : ''}`}
    //           onClick={toggleSelectAllRows}
    //         >
    //           <span className={styles.checkbox}>
    //             {selectedAll && (
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="14"
    //                 height="14"
    //                 viewBox="0 0 24 24"
    //                 fill="none"
    //                 stroke="white"
    //                 strokeWidth="3"
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //               >
    //                 <polyline points="20 6 9 17 4 12" />
    //               </svg>
    //             )}
    //           </span>
    //         </button>
    //       </div>
    //     );
    //   }

    //   // 헤더 Row
    //   const headerLabels = [
    //     "", "사입번호", "상품사입번호", "사입일시", "거래처명", "상품명",
    //     "구분", "컬러", "사이즈", "기타옵션", "단가", "수량", "금액합계", "미송수량", "영수증"
    //   ];

    //   return (
    //     <div style={{ ...style, fontWeight: "bold", background: "#fff" }} className={styles.headerCell}>
    //       {headerLabels[columnIndex]}
    //     </div>
    //   );
    // }
    
    const row = rows[rowIndex - 1];
    if (!row) return null;

    const isSelected = selRows.some(
      (r) => r.recordId === row.recordId && r.itemId === row.itemId
    );

    const field = columnFields[columnIndex];

    const content = (() => {
      switch (field) {
        case 'checkbox':
          return (
            <button
              className={`${styles.button} ${isSelected ? styles.selected : ''}`}
              onClick={() => toggle(row.recordId, row.itemId)}
            >
              <span className={styles.checkbox}>
                {isSelected && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
            </button>
          );
        case 'recordId':
          return <span className={styles.textButton} onClick={() => onPurchase(row.recordId)}>{row.recordId}</span>;
        case 'itemId':
          return <span className={styles.textButton} onClick={() => onProduct(row.itemId)}>{row.itemId}</span>;
        case 'date':
          return row.date.replace(/-/g, '.').replace('T', ' ');
        case 'vendor': return row.vendor;
        case 'name': return row.name;
        case 'category': return row.category;
        case 'color': return row.color;
        case 'size': return row.size;
        case 'options': return row.options || '-';
        case 'unitPrice': return row.unitPrice.toLocaleString();
        case 'quantity': return row.quantity;
        case 'totalAmount': return row.totalAmount.toLocaleString();
        case 'missingQuantity':
          return <span className={styles.textButton} onClick={() => onReserve(row.itemId)}>{row.missingQuantity}</span>;
        case 'receiptImg':
          return <img src={imgSrc} className={styles.receiptImg} onClick={() => onReceipt(row.recordId)} />;
        default: return null;
      }
    })();

    return (
      <div style={{ ...style }} className={`${styles.cell} ${isSelected ? styles.rowSelected : ''}`}>
        {content}
      </div>
    );
  };

  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
  const width = typeof window !== 'undefined' ? Math.min(totalWidth, window.innerWidth) : totalWidth;

  return (
    <Grid
      columnCount={columnWidths.length}
      columnWidth={index => columnWidths[index]}
      rowCount={data.length + 1} // +1 헤더 row
      rowHeight={rowHeight}
      style={{ width, height: 600 }}
      cellComponent={CellComponent}
      cellProps={{
        rows: data,
        selectedRows,
        toggleRowSelection,
        handlePurchaseClick,
        handleProductClick,
        handleProductReservationClick,
        handleReceiptClick,
        receiptImg,
        toggleSelectAllRows,
        selectedAll: selectedRows.length === data.length && data.length > 0,
      }}
    />
  );
}