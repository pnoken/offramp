import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TbdexHttpClient, Rfq, Exchange } from '@tbdex/http-client';
import { PresentationExchange } from '@web5/credentials';
import { RootState } from './store';

interface ExchangeState {
    isCreating: boolean;
    isFetching: boolean;
    exchange: any | null;
    error: string | null;
    exchanges: Exchange[];
}

const initialState: ExchangeState = {
    isCreating: false,
    isFetching: false,
    exchange: null,
    error: null,
    exchanges: [],
};


// Async thunk to create an exchange
export const createExchange = createAsyncThunk<any, {
    offering: any;
    amount: string;
    payoutPaymentDetails: any;
}, { rejectValue: string }>(
    'exchange/create',
    async ({ offering, amount, payoutPaymentDetails }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { customerCredentials, customerDid } = state.wallet;
        console.log("customer credentials.", customerCredentials);
        try {
            // Select credentials required for the exchange
            const selectedCredentials = PresentationExchange.selectCredentials({
                vcJwts: customerCredentials as unknown as string[],
                presentationDefinition: offering.data.requiredClaims,
            });
            const { DidDht } = await import('@web5/dids');
            const signedCustomerDid = await DidDht.import({ portableDid: customerDid });

            // Create RFQ (Request for Quote)
            const rfq = Rfq.create({
                metadata: {
                    from: customerDid.uri,
                    to: offering.metadata.from,
                    protocol: '1.0',
                },
                data: {
                    offeringId: offering.metadata.id,
                    payin: {
                        amount: amount,
                        kind: offering.data.payin.methods[0].kind,
                        paymentDetails: {}, // Ensure this is an empty object, not null
                    },
                    payout: {
                        kind: offering.data.payout.methods[0].kind,
                        paymentDetails: payoutPaymentDetails,
                    },
                    claims: selectedCredentials,
                },
            });

            try {
                // Verify offering requirements
                await rfq.verifyOfferingRequirements(offering)
            } catch (e) {
                console.log("offering requirements not met", e);
            }

            // Sign RFQ message
            await rfq.sign(signedCustomerDid);

            console.log("rfq", rfq);

            // Create exchange using TbdexHttpClient
            const exchangeResponse = await TbdexHttpClient.createExchange(rfq);

            return exchangeResponse;

        } catch (error) {
            console.error('Failed to create exchange', error);
            return thunkAPI.rejectWithValue('Failed to create exchange: ' + (error as Error).message);
        }
    }
);

// New async thunk for fetching exchanges
export const fetchExchanges = createAsyncThunk<any, string, { state: RootState }>(
    'exchange/fetchExchanges',
    async (pfiUri, { getState }) => {
        const state = getState();
        const exchanges = await TbdexHttpClient.getExchanges({
            pfiDid: pfiUri,
            did: state.wallet.customerDid
        });
        return exchanges;
    }
);


// Slice definition
const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
        resetExchangeState: (state) => {
            state.isCreating = false;
            state.isFetching = false;
            state.exchange = null;
            state.exchanges = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createExchange.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createExchange.fulfilled, (state, action) => {
                state.isCreating = false;
                state.exchange = action.payload;
                state.error = null;
            })
            .addCase(createExchange.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload ?? 'An unknown error occurred';
                // Ensure we're not storing any non-serializable data
                state.exchange = null;
            })
            .addCase(fetchExchanges.pending, (state) => {
                state.isFetching = true;
                state.error = null;
            })
            .addCase(fetchExchanges.fulfilled, (state, action) => {
                state.isFetching = false;
                state.exchanges = action.payload;
                state.error = null;
            })
            .addCase(fetchExchanges.rejected, (state, action) => {
                state.isFetching = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetExchangeState } = exchangeSlice.actions;

export default exchangeSlice.reducer;
