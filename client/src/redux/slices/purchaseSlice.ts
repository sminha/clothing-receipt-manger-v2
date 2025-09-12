import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PurchaseItem {
  itemId: string;
  name: string;
  category: string;
  color: string;
  size: string;
  options: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  missingQuantity: number;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  createdAt: string;
  vendor: string;
  items: PurchaseItem[];
  receiptImage: string;
}

interface PurchaseState {
  records: PurchaseRecord[];
}

const initialState: PurchaseState = {
  records: [],
};

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    setPurchases(state, action: PayloadAction<PurchaseRecord[]>) {
      state.records = action.payload;
    },
    addPurchase(state, action: PayloadAction<PurchaseRecord>) {
      const newRecord = {
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.records.push(newRecord);
    },
    updatePurchase(state, action: PayloadAction<PurchaseRecord>) {
      const index = state.records.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deletePurchase(state, action: PayloadAction<string>) {
      state.records = state.records.filter((record) => record.id !== action.payload);
    },
    resetPurchases(state) {
      state.records = [];
    },
    updateMissingQuantity(state, action: PayloadAction<{
      recordId: string;
      itemId: string;
      missingQuantity: number;
    }>) {
      const { recordId, itemId, missingQuantity } = action.payload;
      const record = state.records.find((r) => r.id === recordId);
      if (!record) return;

      const item = record.items.find((i) => i.itemId === itemId);
      if (!item) return;

      item.missingQuantity = missingQuantity;
    },
    deleteProduct(state, action: PayloadAction<{recordId: string, itemId: string}>) {
      const { recordId, itemId } = action.payload;
      const record = state.records.find((r) => r.id === recordId);
      if (!record) return;

      record.items = record.items.filter((i) => i.itemId !== itemId);
    },
  },
});

export const {
  setPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
  resetPurchases,
  updateMissingQuantity,
  deleteProduct,
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
