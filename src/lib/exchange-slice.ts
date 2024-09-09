// src/store/exchangeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TbdexHttpClient, Rfq } from '@tbdex/http-client';
import { Jwt, PresentationExchange } from '@web5/credentials'

// Async thunk to create an exchange
export const createExchange = createAsyncThunk(
    'exchange/create',
    async ({ offering, amount, payoutPaymentDetails, customerDid, customerCredentials }, thunkAPI) => { // Expect customerDid and customerCredentials to be passed as arguments
        try {
            // Select credentials required for the exchange
            const selectedCredentials = PresentationExchange.selectCredentials({
                vcJwts: customerCredentials, // Obtained from the state
                presentationDefinition: offering.data.requiredClaims,
            });

            // Create RFQ (Request for Quote)
            const rfq = Rfq.create({
                metadata: {
                    from: customerDid.uri,
                    to: offering.metaData.from,
                    protocol: '1.0',
                },
                data: {
                    offeringId: offering.id,
                    payin: {
                        amount: amount.toString(),
                        kind: offering.data.payin.methods[0].kind,
                        paymentDetails: {}, // Payment details for payin
                    },
                    payout: {
                        kind: offering.data.payout.methods[0].kind,
                        paymentDetails: payoutPaymentDetails, // Payment details for payout
                    },
                    claims: selectedCredentials, // Attach selected credentials
                },
            });

            // Verify offering requirements
            await rfq.verifyOfferingRequirements(offering);

            // Sign RFQ message
            await rfq.sign(customerDid); // Sign RFQ using the customer's portable DID

            // Create exchange using TbdexHttpClient
            const exchangeResponse = await TbdexHttpClient.createExchange(rfq);

            return exchangeResponse; // Return the response to update state
        } catch (error) {
            console.error('Failed to create exchange', error);
            return thunkAPI.rejectWithValue('Failed to create exchange'); // Handle error
        }
    }
);

// Slice definition
const exchangeSlice = createSlice({
    name: 'exchange',
    initialState: {
        isCreating: false,
        exchange: null,
        error: null,
    },
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
                state.error = action.payload;
            });
    },
});

export const { resetExchangeState } = exchangeSlice.actions;

export default exchangeSlice.reducer;
