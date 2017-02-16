import defaults from 'lodash/object/defaults';

import {dispatcher, constants} from '../flux';
import discoveryService from '../services/discoveryService';

export default {
    readServices() {
        discoveryService.services()
        .then(res => {
            dispatcher.dispatch({
                action: constants.ActionTypes.SERVICES_LOAD_SUCCESS,
                ...res
            });
        })
        .catch(err => {
            console.log(err);
            dispatcher.dispatch({
                action: constants.ActionTypes.SERVICES_LOAD_ERROR,
                error: err
            });
        });
    }
};
