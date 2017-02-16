var debug = require('debug')('hailo:app:store:hob');

import {HobStore} from 'hob-web-bundle';
import {constants, dispatcher, utils} from '../flux';

const store = new HobStore();

store.dispatchToken = dispatcher.register(payload => {
    var data = store.data;

    switch (payload.action) {
        case constants.ActionTypes.HOB_LIST_LOAD_SUCCESS:
            store.merge(payload.hobs);
            break;
    }

    if (store.data !== data) store.emitChange();
});

// Load HOBs as soon as this module is required
utils.hobUtils.loadList({count: 100});

export default store;
