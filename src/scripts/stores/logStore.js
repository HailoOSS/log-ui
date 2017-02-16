import {fromJS} from 'immutable';
import {Store} from 'web-core';
import _ from 'lodash';
import moment from 'moment';
var {constants, dispatcher} = require('../flux');

import logUtils from '../utils/logUtils';

export default class LogStore extends Store {
    constructor() {
       super({
            live: false,
            currentSearch: null,
            query: '',
            from: 'now-1h',
            to: 'now',
            prevLoadTime: null,
            currentPage: 0,

            filters: {},
            filterValues: {},
            total: 0,
            logItems: [],
            error: null,
            warning: null,
            loading: true,
        });
    }

    getLive() {
        return this.data.get('live');
    }

    toggleLive() {
        // Live reload is not possible if the time range is not set to "time to
        // now".
        if (this.getTimeTo() !== '' && this.getTimeTo() !== 'now') {
            this.data = this.data.set('live', fromJS(false));
            return;
        }

        this.data = this.data.set('live', fromJS(!this.getLive()));
    }

    setLive(value) {
        this.data = this.data.set('live', fromJS(value));
    }


    getCurrentSearch() {
        return this.data.get('currentSearch');
    }

    setCurrentSearch(value) {
        this.data = this.data.set('currentSearch', fromJS(value));
    }

    getQuery() {
        return this.data.get('query');
    }

    setQuery(value) {
        this.data = this.data.set('query', fromJS(value));
    }

    getTimeFrom() {
        return this.data.get('from');
    }

    setTimeFrom(value) {
        this.data = this.data.set('from', fromJS(value));
    }

    getTimeTo() {
        return this.data.get('to');
    }

    setTimeTo(value) {
        this.data = this.data.set('to', fromJS(value));
    }

    getPrevLoadTime() {
        return this.data.get('prevLoadTime');
    }

    setPrevLoadTime(value) {
        this.data = this.data.set('prevLoadTime', fromJS(value));
    }

    setFilter(field, values) {
        this.data = this.data.setIn(['filters', field], fromJS(values));
    }

    setFilters(value) {
        this.data = this.data.set('filters', fromJS(value));
    }

    getFilters() {
        return this.data.get('filters');
    }

    getFilterValues() {
        return this.data.get('filterValues');
    }

    setFilterValues(value) {
        let filterValues = {};
        for (var i = value.length - 1; i >= 0; i--) {
            filterValues[value[i].field] = value[i].values;
        }
        this.data = this.data.set('filterValues', fromJS(filterValues));
    }

    getLogItems() {
        return this.data.get('logItems');
    }

    setLogItems(value) {
        this.data = this.data.set('logItems', fromJS(value));
    }

    getTotal() {
        return this.data.get('total');
    }

    setTotal(value) {
        this.data = this.data.set('total', fromJS(value));
    }

    getError() {
        return this.data.get('error');
    }

    setError(value) {
        this.data = this.data.set('error', fromJS(value));
    }

    getWarning() {
        return this.data.get('warning');
    }

    setWarning(value) {
        this.data = this.data.set('warning', fromJS(value));
    }

    getLoading() {
        return this.data.get('loading');
    }

    setLoading(value) {
        this.data = this.data.set('loading', fromJS(value));
    }

    getCurrentPage() {
        return this.data.get('currentPage');
    }
    setCurrentPage(value) {
        this.data = this.data.set('currentPage', fromJS(value));
    }

}

let store = new LogStore();

store.dispatchToken = dispatcher.register(payload => {
    let data = store.data;

    switch (payload.action) {
        case constants.ActionTypes.LOGS_LOAD:
            // Save current search
            store.setCurrentSearch({
                type: payload.type,
                filters: payload.filters,
            })

            // Append filters to any filters in payload
            store.getFilters().forEach((v, k) => {
                payload.filters.push({field: k, values: v});
            });

            store.setLoading(true);
            store.setLogItems([]);
            store.setLive(false);
            logUtils.search({
                type: payload.type,
                limit: constants.MAX_LOGS,
                offset: constants.MAX_LOGS * store.getCurrentPage(),
                from: store.getTimeFrom(),
                to: store.getTimeTo(),
                query: store.getQuery(),
                filters: payload.filters,
            });
            break;
        case constants.ActionTypes.LOGS_RELOAD:
        case constants.ActionTypes.REGION_SET_COMPLETE:
            // If there is no current search just ignore the reload request
            if (store.getCurrentSearch() === null) {
                break
            }

            var request = store.getCurrentSearch().toJS();

            // Append filters to any filters in payload
            store.getFilters().forEach((v, k) => {
                request.filters.push({field: k, values: v});
            });

            store.setLoading(true);
            store.setLogItems([]);
            logUtils.search({
                type: request.type,
                limit: constants.MAX_LOGS,
                offset: constants.MAX_LOGS * store.getCurrentPage(),
                from: store.getTimeFrom(),
                to: store.getTimeTo(),
                query: store.getQuery(),
                filters: request.filters,
            });
            break;
        case constants.ActionTypes.LOGS_LOAD_NEW:
            // If there is no current search just ignore the reload request
            if (store.getCurrentSearch() === null) {
                break
            }

            var request = store.getCurrentSearch().toJS();

            // Append filters to any filters in payload
            store.getFilters().forEach((v, k) => {
                request.filters.push({field: k, values: v});
            });


            logUtils.searchNew({
                type: request.type,
                limit: constants.MAX_LOGS,
                offset: constants.MAX_LOGS * store.getCurrentPage(),
                from: store.getPrevLoadTime(),
                to: moment().toISOString(),
                query: store.getQuery(),
                filters: request.filters,
            });
            break;

        case constants.ActionTypes.LOGS_LOAD_SUCCESS:
            store.setLogItems(payload.logs || []);
            store.setTotal(payload.total || 0);
            store.setPrevLoadTime(extractLastTimestamp(payload.logs, store.getPrevLoadTime()));
            store.setLoading(false);
            store.setError(null);
            break;

        case constants.ActionTypes.LOGS_LOAD_ERROR:
            store.setError(payload.message);
            store.setLoading(false);
            break;

        case constants.ActionTypes.LOGS_LOAD_NEW_SUCCESS:
            // Append new logs to existing logs
            let logs = store.getLogItems();
            logs = logs.push(...(payload.logs || []));
            logs = logs.slice(logs.size - constants.MAX_LOGS, logs.size);

            store.setLogItems(logs);
            store.setTotal(store.getTotal() + (payload.total || 0));
            store.setPrevLoadTime(extractLastTimestamp(logs.toJS(), store.getPrevLoadTime()));
            break;

        case constants.ActionTypes.LOGS_LOAD_NEW_ERROR:
            store.setWarning(payload.message);
            break;

        case constants.ActionTypes.FILTERS_LOAD:
            logUtils.loadFilters({
                type: payload.type,
                from: store.getTimeFrom(),
                to: store.getTimeTo(),
                filters: payload.filters,
                requestedFilters: payload.requestedFilters,
            });
            break;

        case constants.ActionTypes.FILTERS_LOAD_SUCCESS:
            store.setFilterValues(payload.filters || []);
            break;

        case constants.ActionTypes.FILTER_SET:
            store.setFilter(payload.field, payload.values);
            break;

        case constants.ActionTypes.FILTERS_SET:
            store.setFilters(payload.filters);
            break;

        case constants.ActionTypes.FILTERS_RESET:
            store.setFilters({});
            break;

        case constants.ActionTypes.SET_QUERY:
            store.setQuery(payload.query);
            break;

        case constants.ActionTypes.SET_TIME_RANGE:
            store.setTimeFrom(payload.from);
            store.setTimeTo(payload.to);

            // Disable live mode if time range is no longer valid
            if (store.getTimeTo() !== '' && store.getTimeTo() !== 'now') {
                store.setLive(false);
            }
            break;

        case constants.ActionTypes.TOGGLE_LIVE:
            store.toggleLive();
            break;

        case constants.ActionTypes.PREV_PAGE:
            if (store.getCurrentPage() > 0) {
                store.setCurrentPage(store.getCurrentPage() - 1);
            }
            break;

        case constants.ActionTypes.NEXT_PAGE:
            store.setCurrentPage(store.getCurrentPage() + 1);
            break;

        case constants.ActionTypes.SET_PAGE:
            store.setCurrentPage(payload.page);
            break;

        case constants.ActionTypes.CLEAR_WARNING:
            store.setWarning(null);
            break;
    }

    if (store.data !== data) store.emitChange();
});

function extractLastTimestamp(logs, prev) {
    if (!logs) {
        return prev;
    }

    if (logs.length == 0) {
        return prev;
    }

    let last = logs[logs.length-1];

    return last.timestamp;
}

export default store;
