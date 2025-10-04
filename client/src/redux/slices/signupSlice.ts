import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
interface SignupState {
  name: string;
  birth: string;
  gender: 'm' | 'f' | '';
  carrier: string;
  phone: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SignupState = {
  name: '',
  birth: '',
  gender: '',
  carrier: '',
  phone: '',
  status: 'idle',
  error: null,
};

export const signupUser = createAsyncThunk(
  'signup/signupUser',
  async (signupInfo: Omit<SignupState, 'status' | 'error'>, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', signupInfo, {
        headers: { 'Content-Type': 'application/json' },
      });

      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || '회원가입 실패');
      }
      return rejectWithValue('서버 오류');
    }
  }
);

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setBirth(state, action: PayloadAction<string>) {
      state.birth = action.payload;
    },
    setGender(state, action: PayloadAction<'m' | 'f' | ''>) {
      state.gender = action.payload;
    },
    setCarrier(state, action: PayloadAction<string>) {
      state.carrier = action.payload;
    },
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    resetSignup(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  },
});

export const {
  setName,
  setBirth,
  setGender,
  setCarrier,
  setPhone,
  resetSignup,
} = signupSlice.actions;

export default signupSlice.reducer;