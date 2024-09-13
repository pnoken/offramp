import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TbdexHttpClient, Rfq } from '@tbdex/http-client';
import { PresentationExchange } from '@web5/credentials';

// Async thunk to create an exchange
export const createExchange = createAsyncThunk<any, {
    offering: any;
    amount: string;
    payoutPaymentDetails: any;
    customerDid: any;
    customerCredentials: any;
}, { rejectValue: string }>(
    'exchange/create',
    async ({ offering, amount, payoutPaymentDetails, customerDid, customerCredentials }, thunkAPI) => {
        try {
            // Select credentials required for the exchange
            const selectedCredentials = PresentationExchange.selectCredentials({
                vcJwts: customerCredentials, //As JWT token
                presentationDefinition: offering.data.requiredClaims,
            });

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
                        paymentDetails: {}, // Payment details for payin
                    },
                    payout: {
                        kind: offering.data.payout.methods[0].kind,
                        paymentDetails: payoutPaymentDetails,
                    },
                    claims: selectedCredentials,
                },
            });

            console.log("rfq", rfq);

            // Verify offering requirements
            await rfq.verifyOfferingRequirements(offering);

            // Sign RFQ message
            await rfq.sign(customerDid);

            // Create exchange using TbdexHttpClient
            const exchangeResponse = await TbdexHttpClient.createExchange(rfq);

            return exchangeResponse;

        } catch (error) {
            console.error('Failed to create exchange', error);
            return thunkAPI.rejectWithValue('Failed to create exchange');
        }
    }
);

interface ExchangeState {
    isCreating: boolean;
    exchange: any | null;
    error: string | null;
}

const initialState: ExchangeState = {
    isCreating: false,
    exchange: null,
    error: null,
};

// Slice definition
const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
        resetExchangeState: (state) => {
            state.isCreating = false;
            state.exchange = null;
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
            });
    },
});

export const { resetExchangeState } = exchangeSlice.actions;

export default exchangeSlice.reducer;
