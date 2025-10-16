import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import dayjs from 'dayjs';

interface UserState {
  id: number | null;
  company: string;
  name: string;
  birth: string;
  gender: 'm' | 'f' | '';
  carrier: string;
  phone: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  id: null,
  company: '',
  name: '',
  birth: '',
  gender: '',
  carrier: '',
  phone: '',
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginInfo: Omit<UserState, 'id' | 'company' | 'gender' | 'carrier' | 'status' | 'error'>, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginInfo, {
        headers: { 'Content-Type': 'application/json' },
      });

      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || '로그인 실패');
      }
      return rejectWithValue('서버 오류');
    }
  }
);

export const editUser = createAsyncThunk(
  'user/editUser',
  async (userInfo: Omit<UserState, 'name' | 'birth' | 'gender' | 'carrier' | 'phone' | 'status' | 'error'>, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/users/${userInfo.id}`, userInfo, {
        headers: { 'Content-Type': 'application/json' },
      })

      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || '정보 수정 실패');
      }
      return rejectWithValue('서버 오류');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserCompany(state, action: PayloadAction<string>) {
      state.company = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setUserBirth(state, action: PayloadAction<string>) {
      state.birth = action.payload;
    },
    setUserGender(state, action: PayloadAction<'m' | 'f' | ''>) {
      state.gender = action.payload;
    },
    setUserCarrier(state, action: PayloadAction<string>) {
      state.carrier = action.payload;
    },
    setUserPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    resetUser(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const user = action.payload.user;
        state.id = user.id;
        state.company = user.company;
        state.name = user.name;
        // state.birth = user.birth;
        state.birth = dayjs(user.birth).format('YYMMDD');
        state.gender = user.gender;
        state.carrier = user.carrier;
        state.phone = user.phone;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(editUser.pending, (state) => {
        state.status = 'idle';
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const user = action.payload.user;
        state.company = user.company;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  }
});

export const {
  setUserCompany,
  setUserName,
  setUserBirth,
  setUserGender,
  setUserCarrier,
  setUserPhone,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;