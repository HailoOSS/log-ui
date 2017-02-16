import defaults from 'lodash/object/defaults';

import {dispatcher, constants} from '../flux';
import logService from '../services/logService';

export default {
    search(req) {
        logService.search(req)
        .then(res => {
            dispatcher.dispatch({
                action: constants.ActionTypes.LOGS_LOAD_SUCCESS,
                ...res
            });
        })
        .catch(err => {
            dispatcher.dispatch({
                action: constants.ActionTypes.LOGS_LOAD_ERROR,
                error: err,
                message: parseError(err)
            });
        });
    },

    searchNew(req) {
        logService.search(req)
        .then(res => {
            dispatcher.dispatch({
                action: constants.ActionTypes.LOGS_LOAD_NEW_SUCCESS,
                ...res
            });
        })
        .catch(err => {
            dispatcher.dispatch({
                action: constants.ActionTypes.LOGS_LOAD_NEW_ERROR,
                error: err,
                message: parseError(err)
            });
        });
    },

    loadFilters(req) {
        logService.filters(req)
        .then(res => {
            dispatcher.dispatch({
                action: constants.ActionTypes.FILTERS_LOAD_SUCCESS,
                ...res
            });
        })
        .catch(err => {
            console.log(err);
            dispatcher.dispatch({
                action: constants.ActionTypes.FILTERS_LOAD_ERROR,
                error: err,
                message: parseError(err)
            });
        });
    }
};

var parseError = function(err) {
    if (err.name === "HttpServerError") {
        try {
            return JSON.parse(err.message).payload;
        } catch (e) {
            return err.message;
        }
    } else if (err.message) {
        return err.message;
    } else {
        return err;
    }
};
