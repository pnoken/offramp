import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TbdexHttpClient, Rfq, Quote, Order, OrderStatus, Close, Message } from '@tbdex/http-client';

const offeringsSlice = createSlice({
    name: 'offerings',
    initialState: {
        matchedOfferings: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOfferings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOfferings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.matchedOfferings = action.payload; // Update state with filtered offerings
            })
            .addCase(fetchOfferings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Update state with error message
            });
    },
});

// Async thunk to fetch and filter offerings
export const fetchOfferings = createAsyncThunk(
    'offerings/fetchOfferings',
    async ({ pfiDid = "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y", payinCurrencyCode = "GHS", payoutCurrencyCode = "USDC" }, thunkAPI) => {
        try {
            // Fetch offerings using TbdexHttpClient
            const offerings = await TbdexHttpClient.getOfferings({ pfiDid });

            // Filter offerings based on the currency pair
            const filteredOfferings = offerings.filter(
                (offering) =>
                    offering.data.payin.currencyCode === payinCurrencyCode &&
                    offering.data.payout.currencyCode === payoutCurrencyCode
            );

            return filteredOfferings; // Return filtered offerings
        } catch (error) {
            return thunkAPI.rejectWithValue('Cannot fetch offerings');
        }
    }
);


export default offeringsSlice.reducer;
