// src/store.ts
import { configureStore, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DidDht, PresentationExchange } from '@web5/dids';
import { Close, Order, Rfq, TbdexHttpClient } from '@tbdex/http-client';
import { MockProviderDid, State, Offering, Transaction } from './types';

// Mock provider DIDs
const mockProviderDids: Record<string, MockProviderDid> = {
    aquafinance_capital: {
        uri: 'did:dht:qewzcx3fj8uuq7y551deqdfd1wbe6ymicr8xnua3xzkdw4n6j3bo',
        name: 'AquaFinance Capital',
        description: 'Provides exchanges with the Ghanaian Cedis: GHS to USDC, GHS to KES'
    },
    swiftliquidity_solutions: {
        uri: 'did:dht:zz3m6ph36p1d8qioqfhp5dh5j6xn49cequ1yw9jnfxbz1uyfnddy',
        name: 'SwiftLiquidity Solutions',
        description: 'Offers exchange rates with the South African Rand: ZAR to BTC and EUR to ZAR.'
    },
    flowback_financial: {
        uri: 'did:dht:gxwaxgihty7ar5u44gcmmdbw4ka1rbpj8agu4fom6tmsaz7aoffo',
        name: 'Flowback Financial',
        description: 'Offers international rates with various currencies - USD to GBP, GBP to CAD.'
    },
    vertex_liquid_assets: {
        uri: 'did:dht:7zkzxjf84xuy6icw6fyjcn3uw14fty4umqd3nc4f8ih881h6bjby',
        name: 'Vertex Liquid Assets',
        description: 'Offers currency exchanges between African currencies - MAD to EGP, GHS to NGN.'
    },
    titanium_trust: {
        uri: 'did:dht:kuggrw7nx3n4ehz455stdkdeuaekfjimhnbenpo8t4xz9gb8qzyy',
        name: 'Titanium Trust',
        description: 'Provides offerings to exchange USD to African currencies - USD to GHS, USD to KES.'
    }
};

// Initial state
const initialState: State = {
    balance: parseFloat(localStorage.getItem('walletBalance') || '100'),
    transactions: [],
    transactionsLoading: true,
    pfiAllowlist: Object.keys(mockProviderDids).map((key) => ({
        pfiUri: mockProviderDids[key].uri,
        pfiName: mockProviderDids[key].name,
        pfiDescription: mockProviderDids[key].description,
    })),
    selectedTransaction: null,
    offering: null,
    payinCurrencies: [],
    payoutCurrencies: [],
    offerings: [],
    customerDid: null,
    customerCredentials: [],
};

// Thunks for async operations
export const fetchOfferings = createAsyncThunk('wallet/fetchOfferings', async (_, { getState }) => {
    const state = getState() as State;
    const allOfferings: Offering[] = [];

    for (const pfi of state.pfiAllowlist) {
        const offerings = await TbdexHttpClient.getOfferings({ pfiDid: pfi.pfiUri });
        allOfferings.push(...offerings);
    }
    return allOfferings;
});

// Wallet slice
const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setBalance(state, action: PayloadAction<number>) {
            state.balance = action.payload;
            localStorage.setItem('walletBalance', action.payload.toString());
        },
        selectTransaction(state, action: PayloadAction<Transaction | null>) {
            state.selectedTransaction = action.payload;
        },
        setOffering(state, action: PayloadAction<Offering | null>) {
            state.offering = action.payload;
        },
        updateTransactions(state, action: PayloadAction<Transaction[]>) {
            const existingExchangeIds = state.transactions.map((tx) => tx.id);
            const updatedExchanges = [...state.transactions];

            action.payload.forEach((newTx) => {
                const existingTxIndex = updatedExchanges.findIndex((tx) => tx.id === newTx.id);
                if (existingTxIndex > -1) {
                    updatedExchanges[existingTxIndex] = newTx;
                } else {
                    updatedExchanges.push(newTx);
                }
            });

            state.transactions = updatedExchanges;
        },
        // Other reducers...
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOfferings.fulfilled, (state, action) => {
            state.offerings = action.payload;
            // Call updateCurrencies here or in a separate function
        });
        // Other async thunks...
    },
});

export const { setBalance, selectTransaction, setOffering, updateTransactions } = walletSlice.actions;

const store = configureStore({
    reducer: {
        wallet: walletSlice.reducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
