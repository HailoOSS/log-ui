import keyMirror from 'react/lib/keyMirror';

export default {
    MAX_LOGS: 300,

    ActionTypes: keyMirror({
        LOGS_RELOAD: null,
        LOGS_LOAD: null,
        LOGS_LOAD_SUCCESS: null,
        LOGS_LOAD_ERROR: null,

        LOGS_LOAD_NEW: null,
        LOGS_LOAD_NEW_SUCCESS: null,
        LOGS_LOAD_NEW_ERROR: null,

        FILTERS_LOAD: null,
        FILTERS_LOAD_SUCCESS: null,
        FILTERS_LOAD_ERROR: null,

        SERVICES_LOAD: null,
        SERVICES_LOAD_SUCCESS: null,
        SERVICES_LOAD_ERROR: null,

        FILTER_SET: null,
        FILTERS_SET: null,
        FILTERS_RESET: null,
        SET_QUERY: null,
        SET_TIME_RANGE: null,
        TOGGLE_LIVE: null,
        CLEAR_WARNING: null,

        PREV_PAGE: null,
        NEXT_PAGE: null,
        SET_PAGE: null,
    }),

    RouteNames: keyMirror({
        HOME: 0,
        SERVICE_LOGS: 0,
        ACCESS_LOGS: 0
    }),

    LoadingStatus: keyMirror({
        PENDING: null,
        LOADING: null,
        LOADED: null,
        ERROR: null,
        UPDATING: null,
        UPDATED: null
    })
};
