import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { generateTestData } from '../../utils/generateTestData.ts';
import axios from 'axios';

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
  status: 'idle' | 'loading' | 'succeeded' | 'failed' ;
  error: string | null;
}

const initialState: PurchaseState = {
  records: [],
  status: 'idle',
  error: null,
};

export const postPurchase = createAsyncThunk(
  'purchase/postPurchase',
  async (purchaseInfo: Omit<PurchaseRecord, 'createdAt'> & { userId: number }, { rejectWithValue } ) => {
    try {
      const res = await axios.post('http://localhost:5000/api/purchase/add', purchaseInfo, {
        headers: { 'Content-Type': 'application/json' },
      })

      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || '사입내역 추가 실패');
      }
      return rejectWithValue('서버 오류');
    }
  }
);

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
    setTestData(state, action: PayloadAction<number>) {
      state.records = generateTestData(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postPurchase.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postPurchase.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(postPurchase.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
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
  setTestData,
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
