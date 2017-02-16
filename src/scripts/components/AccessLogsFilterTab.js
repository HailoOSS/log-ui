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

export default React.createClass({
    displayName: 'AccessLogsFilterTab',

    componentDidMount() {
        logActions.loadFilters(this.props.type, this.props.service, ['host', 'instance_role', 'verb', 'response']);
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.type !== this.props.type || nextProps.service !== this.props.service) {
            logActions.loadFilters(nextProps.type, nextProps.service, ['host', 'instance_role', 'verb', 'response']);
        }
    },

    render: function() {
        return (
            <div className='filter-tab'>
                <FilterInput label="Host" field="host" />
                <FilterInput label="Machine Class" field="instance_role" />
                <FilterInput label="Request Method" field="verb" />
                <FilterInput label="Response Code" field="response" />
            </div>
        );
    }
});
