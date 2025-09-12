import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  company: string;
  name: string;
  birth: string;
  gender: 'male' | 'female' | '';
  carrier: string;
  phone: string;
}

const initialState: UserState = {
  company: '',
  name: '',
  birth: '',
  gender: '',
  carrier: '',
  phone: '',
};

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
    setUserGender(state, action: PayloadAction<'male' | 'female' | ''>) {
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