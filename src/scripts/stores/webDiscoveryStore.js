import {WebDiscoveryStore} from 'portal-web-bundle';
import {constants, dispatcher, utils} from '../flux';

let store = new WebDiscoveryStore();

store.dispatchToken = dispatcher.register(payload => {
    var data = store.data;

    switch (payload.action) {
        case constants.ActionTypes.WEBAPP_LIST_LOAD_SUCCESS:
            store.merge(payload.webapps);
            break;
    }

    if (store.data !== data) store.emitChange();
});

export default store;
