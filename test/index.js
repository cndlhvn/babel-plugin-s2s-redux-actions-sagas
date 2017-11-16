import { put, call,takeLatest } from 'redux-saga/effects';
import * as actions from '../actions';

export function* handleGetFaq(action) {
  try {
    const { data } = yield call(api.getFaq, action.payload)
    yield put(actions.getFaqSuccess(data))
  } catch (error) {
    yield put(actions.getFaqFailure(error))
  }
}


getHanage


export default [

];
