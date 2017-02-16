import {session} from 'web-toolkit';
import {constants, dispatcher, utils} from '../flux';

session.dispatchToken = dispatcher.register(function(payload) {
    switch (payload.action) {

        case constants.ActionTypes.AUTH_LOGIN_SUCCESS:
            session.update(payload.session);
            utils.webDiscoveryUtils.loadWebapps();
            break;

        case constants.ActionTypes.AUTH_LOGOUT_SUCCESS:
            session.reset();
            utils.webDiscoveryUtils.loadWebapps();
            session.emitChange();
            break;
    }
});

export default session;
