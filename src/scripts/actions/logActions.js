import {dispatcher, constants} from '../flux';
import moment from 'moment';

export default {
    loadLogs(type, service) {
        dispatcher.dispatch({
            action: constants.ActionTypes.LOGS_LOAD,
            type: type,
            filters: [
                {field: 'service_name', values: [service]},
            ]
        });
    },

    loadFilters(type, service, filters) {
        dispatcher.dispatch({
            action: constants.ActionTypes.FILTERS_LOAD,
            type: type,
            filters: [
                {field: 'service_name', values: [service]},
            ],
            requestedFilters: filters
        });
    },

    reloadLogs() {
        dispatcher.dispatch({
            action: constants.ActionTypes.LOGS_RELOAD,
        });
    },

    loadNewLogs() {
        dispatcher.dispatch({
            action: constants.ActionTypes.LOGS_LOAD_NEW,
        });
    },

    loadMoreLogs() {
        dispatcher.dispatch({
            action: constants.ActionTypes.LOGS_RELOAD,
        });
    },

    setFilter(field, values) {
       dispatcher.dispatch({
           action: constants.ActionTypes.FILTER_SET,
           field,
           values,
       });
    },

    setFilters(filters) {
       dispatcher.dispatch({
           action: constants.ActionTypes.FILTERS_SET,
           filters
       });
    },

    setQuery(query) {
       dispatcher.dispatch({
           action: constants.ActionTypes.SET_QUERY,
           query
       });
    },

    setTimeRange(from, to) {
       dispatcher.dispatch({
           action: constants.ActionTypes.SET_TIME_RANGE,
           from,
           to,
       });
    },

    toggleLive() {
       dispatcher.dispatch({
           action: constants.ActionTypes.TOGGLE_LIVE
       });
    },

    nextPage() {
       dispatcher.dispatch({
           action: constants.ActionTypes.NEXT_PAGE
       });
    },

    prevPage() {
       dispatcher.dispatch({
           action: constants.ActionTypes.PREV_PAGE
       });
    },

    setPage(page) {
       dispatcher.dispatch({
           action: constants.ActionTypes.SET_PAGE,
           page: page,
       });
    },

    clearWarning() {
       dispatcher.dispatch({
           action: constants.ActionTypes.CLEAR_WARNING
       });
    }
};
