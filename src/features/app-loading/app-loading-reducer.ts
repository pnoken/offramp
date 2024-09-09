import { createSlice } from '@reduxjs/toolkit';
import { not, pipe, prop } from 'ramda';
import { clear } from 'redux/clear';
import { RootState } from 'redux/root-reducer';

const slice = 'appLoading';
const initialState = { appIsLoading: true };

export const {
    actions: { finishAppLoading },
    reducer,
} = createSlice({
    name: slice,
    initialState,
    reducers: {
        finishAppLoading: state => {
            state.appIsLoading = false;
        },
    },
    extraReducers: {
        [clear.type]: () => initialState,
    },
});

export type AppLoadingState = ReturnType<typeof reducer>;

/**
 * SELECTORS
 */

const getAppLoadingSlice = (state: RootState) => state[slice];

const getAppFinishedLoading = pipe(
    getAppLoadingSlice,
    prop<'appIsLoading'>('appIsLoading'),
    not,
);

export { getAppFinishedLoading, slice };
