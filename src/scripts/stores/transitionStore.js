var debug = require('debug')('hailo:app:store:transition');
import {TransitionStore} from 'flux-core';
import {constants, dispatcher} from '../flux';

const {ActionTypes, RouteNames, TransitionKeys, TransitionStatus} = constants;

var store = new TransitionStore();

store.dispatchToken = dispatcher.register(payload => {
    var data = store.data;

    switch (payload.action) {

        // Authentication

        case ActionTypes.AUTH_LOGIN:
            store.setError(TransitionKeys.LOGIN, undefined);
            store.setStatus(TransitionKeys.LOGIN, TransitionStatus.LOADING);
            break;

        case ActionTypes.AUTH_LOGIN_ERROR:
            store.setError(TransitionKeys.LOGIN, payload.error);
            store.setStatus(TransitionKeys.LOGIN, TransitionStatus.ERROR);
            break;

        case ActionTypes.AUTH_LOGIN_SUCCESS:
            store.setStatus(TransitionKeys.LOGIN, TransitionStatus.SUCCESS);
            store.setStatus(TransitionKeys.LOGOUT, TransitionStatus.PENDING);
            break;

        case ActionTypes.AUTH_LOGOUT:
            store.setStatus(TransitionKeys.LOGOUT, TransitionStatus.LOADING);
            break;

        case ActionTypes.AUTH_LOGOUT_ERROR:
            store.setStatus(TransitionKeys.LOGOUT, TransitionStatus.ERROR);
            break;

        case ActionTypes.AUTH_LOGOUT_SUCCESS:
            store.setStatus(TransitionKeys.LOGIN, TransitionStatus.PENDING);
            store.setStatus(TransitionKeys.LOGOUT, TransitionStatus.SUCCESS);
            break;
    }

    if (store.data !== data) store.emitChange();
});

export default store;
