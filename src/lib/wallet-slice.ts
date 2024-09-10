// src/store/walletSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DidDht } from '@web5/dids';

// Async thunk to create a new wallet
export const createNewWallet = createAsyncThunk<
    { portableDid: any; did: string },
    void,
    { rejectValue: string }
>('wallet/createNewWallet', async (_, thunkAPI) => {
    try {
        const didDht = await DidDht.create({ options: { publish: true } }); // Create new DID

        const did = didDht.uri;
        const portableDid = await didDht.export(); // Export portable DID

        // Store the DID in local storage
        localStorage.setItem('customerDid', JSON.stringify(portableDid));

        return { portableDid, did }; // Return DID for further state management
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to create a new wallet'); // Handle errors
    }
});

interface WalletState {
    portableDid: any | null; // Initial portable DID state
    did: string | null; // Initial DID URI state
    isCreating: boolean; // State for creating process
    walletCreated: boolean; // State to confirm wallet creation
    error: string | null; // Error state
}

const initialState: WalletState = {
    portableDid: null,
    did: null,
    isCreating: false,
    walletCreated: false,
    error: null,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        clearWalletState: (state) => {
            state.portableDid = null;
            state.did = null;
            state.isCreating = false;
            state.walletCreated = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewWallet.pending, (state) => {
                state.isCreating = true; // Set creating state to true
                state.error = null;
            })
            .addCase(createNewWallet.fulfilled, (state, action) => {
                state.isCreating = false;
                state.walletCreated = true; // Wallet successfully created
                state.portableDid = action.payload.portableDid; // Store portable DID in state
                state.did = action.payload.did; // Store DID URI in state
            })
            .addCase(createNewWallet.rejected, (state, action) => {
                state.isCreating = false;
                state.walletCreated = false; // Reset wallet creation status
                state.error = action.payload ?? null; // Store error message
            });
    },
});

export const { clearWalletState } = walletSlice.actions; // Export clear action

export default walletSlice.reducer;
