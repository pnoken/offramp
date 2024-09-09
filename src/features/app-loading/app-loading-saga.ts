import { createAction } from '@reduxjs/toolkit';
import { handleFetchCurrentUsersProfile } from 'features/user-profile/user-profile-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import { finishAppLoading, slice } from './app-loading-reducer';

const loadApp = createAction(`${slice}/loadApp`);

function* handleLoadApp() {
    yield call(handleFetchCurrentUsersProfile);
    yield put(finishAppLoading());
}

function* watchLoadApp() {
    yield takeEvery(loadApp.type, handleLoadApp);
}

export { handleLoadApp, loadApp, watchLoadApp };
