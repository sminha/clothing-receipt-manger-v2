import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignupState {
  name: string;
  birth: string;
  gender: 'male' | 'female' | '';
  carrier: string;
  phone: string;
}

const initialState: SignupState = {
  name: '',
  birth: '',
  gender: '',
  carrier: '',
  phone: '',
};

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
    setGender(state, action: PayloadAction<'male' | 'female' | ''>) {
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