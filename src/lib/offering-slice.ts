import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TbdexHttpClient, Offering } from '@tbdex/http-client';

// Define the state type
interface OfferingsState {
    matchedOfferings: Offering[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Async thunk to fetch and filter offerings
export const fetchOfferings = createAsyncThunk<Offering[], void, { rejectValue: string }>(
    'offerings/fetchOfferings',
    async (_, thunkAPI) => {
        try {
            // Fetch offerings using TbdexHttpClient
            const offerings = await TbdexHttpClient.getOfferings({ pfiDid: "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y" });

            // Filter offerings based on the currency pair
            const filteredOfferings = offerings.filter(
                (offering) =>
                    offering.data.payin.currencyCode === "GHS" &&
                    offering.data.payout.currencyCode === "USDC"
            );

            return filteredOfferings;
        } catch (error) {
            return thunkAPI.rejectWithValue('Cannot fetch offerings');
        }
    }
);

const initialState: OfferingsState = {
    matchedOfferings: [],
    status: 'idle',
    error: null,
};

const offeringsSlice = createSlice({
    name: 'offerings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOfferings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOfferings.fulfilled, (state, action: PayloadAction<Offering[]>) => {
                state.status = 'succeeded';
                state.matchedOfferings = action.payload;
            })
            .addCase(fetchOfferings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'An error occurred';
            });
    },
});

export default offeringsSlice.reducer;
