import React from 'react/addons';
import reduce from 'lodash/collection/reduce';
import _ from 'lodash';
import { constants } from '../flux';
import { WatchStoresMixin } from 'flux-core';
import { State, Navigation } from 'react-router';
import { Tabs, Tab } from 'react-bootstrap';
import Select from 'react-select';
import logActions from '../actions/logActions';
import logStore from '../stores/logStore';
import servicesStore from '../stores/servicesStore';

var PureRenderMixin = React.addons.PureRenderMixin;
var RouteNames = constants.RouteNames;

export default React.createClass({
    displayName: 'ServiceLogsFilterInput',

    mixins: [ PureRenderMixin, WatchStoresMixin, Navigation, State ],
    stores: [ logStore ],

    getInitialState() {
        return this.getState();
    },

    getState() {
        let value = null;
        let options = [];
        let filter = logStore.getFilters().get(this.props.field);
        let filterValues = logStore.getFilterValues().get(this.props.field);
        if (filterValues) {
            options = filterValues.map((v, k) => {
                return {value: v, label: v};
            }).toJS();
        }
        if (filter) {
            value = filter.toJS();
        }

        return {
            options,
            value,
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state, this.state.value) {
            process.nextTick(() => {
                const routes = this.getRoutes();
                const route = routes[routes.length - 1].name;
                const params = this.getParams();
                let query = this.getQuery();
                if (!query.filter)  query.filter = {}
                query.filter[this.props.field] = this.state.value;
                this.replaceWith(route, params, query);
            })
        }
    },

    onFilterChange(value, values) {
        let filterValues = [];
        for (var i = values.length - 1; i >= 0; i--) {
            filterValues.push(values[i].value);
        }
        logActions.setFilter(this.props.field, filterValues);
        logActions.reloadLogs();
    },

    render: function() {
        return (
            <div className="filter-group">
                <h4>{this.props.label}</h4>
                <Select
                    name={this.props.field}
                    options={this.state.options}
                    value={this.state.value}
                    multi={true}
                    onChange={this.onFilterChange}
                />
            </div>
        );
    }
});
