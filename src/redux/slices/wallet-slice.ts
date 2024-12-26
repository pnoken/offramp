// slices/walletSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching wallet balance from the contract
export const fetchWalletBalance = createAsyncThunk(
  "wallet/fetchWalletBalance",
  async (address, thunkAPI) => {
    try {
      // Assume `getWalletBalance` is a function interacting with the contract
      const balance = await getWalletBalance(address);
      return balance;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance = action.payload;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default walletSlice.reducer;
