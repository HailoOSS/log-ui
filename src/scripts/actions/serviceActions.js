import {dispatcher, constants} from '../flux';

export default {
    loadServices() {
        dispatcher.dispatch({
            action: constants.ActionTypes.SERVICES_LOAD
        });
    }
};
