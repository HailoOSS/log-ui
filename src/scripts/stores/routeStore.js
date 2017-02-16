var debug = require('debug')('hailo:app:store:route');

import {RouteStore} from 'router-web-bundle';
import {constants, dispatcher} from '../flux';

var store = new RouteStore();

store.dispatchToken = dispatcher.register(payload => {
    var data = store.data;

    switch (payload.action) {
        case constants.ActionTypes.ROUTE_CHANGE:
        case constants.ActionTypes.ROUTE_CHANGE_SUCCESS:
            store.state = payload.state;
            break;
    }

    if (store.data !== data) store.emitChange();
});

export default store;
