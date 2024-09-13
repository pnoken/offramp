// src/store/walletSlice.js
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DidDht } from '@web5/dids';
import Cookies from 'js-cookie';

// Define the structure for a token balance
interface TokenBalance {
    token: string;
    amount: number;
    usdRate: number;
    image: string;
}

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

// Add this new async thunk
export const setUserCredentials = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('wallet/setUserCredentials', async (credentials, thunkAPI) => {
    try {
        Cookies.set('userCredentials', credentials);
        return credentials;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to set user credentials');
    }
});

// Extend the WalletState interface
interface WalletState {
    portableDid: any | null; // Initial portable DID state
    did: string | null; // Initial DID URI state
    isCreating: boolean; // State for creating process
    walletCreated: boolean; // State to confirm wallet creation
    error: string | null; // Error state
    userCredentials: string | null; // New property for user credentials
    tokenBalances: TokenBalance[]; // New property for token balances
}

const storedDid = localStorage.getItem('customerDid');

const initialState: WalletState = {
    portableDid: storedDid ? JSON.parse(storedDid) : null,
    did: null,
    isCreating: false,
    walletCreated: false,
    error: null,
    userCredentials: Cookies.get('userCredentials') || null, // New initial value
    tokenBalances: [
        { token: 'USDC', amount: 100.50, usdRate: 1, image: `/images/currencies/usdc.png` },
        { token: 'USDT', amount: 75.25, usdRate: 1, image: `/images/currencies/usdt.png` },
        { token: 'GHS', amount: 500.00, usdRate: 0.0833, image: `/images/currencies/ghs.png` },
        { token: 'KES', amount: 10000.00, usdRate: 0.00694, image: `/images/currencies/kes.png` },
        { token: 'USD', amount: 500.00, usdRate: 1, image: `/images/currencies/usd.png` },
        { token: 'NGN', amount: 10000.00, usdRate: 0.00060, image: `/images/currencies/ngn.png` }
    ],
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
            state.tokenBalances = []; // Clear token balances
        },
        clearUserCredentials: (state) => {
            state.userCredentials = null;
            Cookies.remove('userCredentials');
        },
        updateTokenBalance: (state, action: PayloadAction<TokenBalance>) => {
            const index = state.tokenBalances.findIndex(tb => tb.token === action.payload.token);
            if (index !== -1) {
                state.tokenBalances[index] = action.payload;
            } else {
                state.tokenBalances.push(action.payload);
            }
        },
        removeTokenBalance: (state, action: PayloadAction<string>) => {
            state.tokenBalances = state.tokenBalances.filter(tb => tb.token !== action.payload);
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
            })
            .addCase(setUserCredentials.fulfilled, (state, action) => {
                state.userCredentials = action.payload;
            })
            .addCase(setUserCredentials.rejected, (state, action) => {
                state.error = action.payload ?? null;
            });
    },
});

export const {
    clearWalletState,
    clearUserCredentials,
    updateTokenBalance,
    removeTokenBalance
} = walletSlice.actions; // Export clear actions

export default walletSlice.reducer;
