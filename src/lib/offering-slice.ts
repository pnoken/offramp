import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TbdexHttpClient, Offering } from '@tbdex/http-client';
import { mockProviderDids } from '@/constants/mockDids';

// Define the state type
interface OfferingsState {
    matchedOfferings: Offering[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Async thunk to fetch and filter offerings
export const fetchOfferings = createAsyncThunk<Offering[], { from: string; to: string }, { rejectValue: string }>(
    'offerings/fetchOfferings',
    async ({ from, to }, thunkAPI) => {
        try {
            const allOfferings: Offering[] = [];
            for (const pfi of Object.values(mockProviderDids)) {
                const offerings = await TbdexHttpClient.getOfferings({ pfiDid: pfi.uri });
                allOfferings.push(...offerings);
            }
            // Filter offerings based on the currency pair
            return allOfferings.filter(
                (offering) =>
                    offering.data.payin.currencyCode === from &&
                    offering.data.payout.currencyCode === to
            );
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
