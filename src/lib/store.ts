import { configureStore } from '@reduxjs/toolkit'
import walletReducer from './wallet-slice'
import offeringReducer from './offering-slice'
import exchangeReducer from './exchange-slice'

export const store = configureStore({
    reducer: {
        wallet: walletReducer,
        offering: offeringReducer,
        exchange: exchangeReducer
    },
})

export default store;

// Infer the type of store
//export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;