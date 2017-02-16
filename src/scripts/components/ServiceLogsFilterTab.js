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

import FilterInput from './FilterInput';

var PureRenderMixin = React.addons.PureRenderMixin;
var RouteNames = constants.RouteNames;

const ServiceFilterInput = React.createClass({
    displayName: 'ServiceLogsFilterTab',

    mixins: [ PureRenderMixin, Navigation ],

    onFilterChange(value) {
        this.transitionTo(RouteNames.SERVICE_LOGS, {service: value});
    },

    render: function() {
        let services = this.props.services || [];
        let options = _.map(services, (service, k) => {
            return {value: service, label: service};
        });

        return (
            <div className="filter-group">
                <h4>Service</h4>
                <Select
                    name={this.props.field}
                    options={options}
                    value={this.props.service}
                    clearable={false}
                    onChange={this.onFilterChange}
                />
            </div>
        );
    }
});

export default React.createClass({
    displayName: 'ServiceLogsFilterTab',

    componentDidMount() {
        logActions.loadFilters(this.props.type, this.props.service, ['loglevel', 'component', 'service_version', 'host', 'instance_role']);
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.type !== this.props.type || nextProps.service !== this.props.service) {
            logActions.loadFilters(nextProps.type, nextProps.service, ['loglevel', 'component', 'service_version', 'host', 'instance_role']);
        }
    },

    render: function() {
        return (
            <div className='filter-tab'>
                <ServiceFilterInput service={this.props.service} services={this.props.services} />
                <FilterInput label="Log Level" field="loglevel" />
                <FilterInput label="Component" field="component" />
                <FilterInput label="Service Version" field="service_version" />
                <FilterInput label="Host" field="host" />
                <FilterInput label="Machine Class" field="instance_role" />
            </div>
        );
    }
});
