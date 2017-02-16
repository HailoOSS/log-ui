import React from 'react';
import { WatchStoresMixin } from 'flux-core';
import { State } from 'react-router';
import { Tabs, Tab } from 'react-bootstrap';
import serviceActions from '../actions/serviceActions';
import logActions from '../actions/logActions';
import servicesStore from '../stores/servicesStore';
import logStore from '../stores/logStore';

import ServicesList from '../components/ServicesList';
import ServicesTab from '../components/ServicesTab';
import ServiceLogs from '../components/ServiceLogs';
import ServiceLogsFilterTab from '../components/ServiceLogsFilterTab';
import LogControls from '../components/LogControls';

export default React.createClass({
    displayName: 'ServiceLogsPage',

    mixins: [ WatchStoresMixin, State ],
    stores: [ servicesStore ],

    getInitialState() {
        return this.getState();
    },

    getState() {
        return {
            services: servicesStore.getServices().toJS(),
        };
    },

    componentWillMount() {
        const query = this.getQuery();
        if (query.filter) {
            logActions.setFilters(query.filter);
        }
        if (query.query) {
            logActions.setQuery(query.query);
        }
        if (query.from && query.to) {
            logActions.setTimeRange(query.from, query.to);
        }
        if (query.page) {
            logActions.setPage(parseInt(query.page));
        }
    },

    componentDidMount() {
        serviceActions.loadServices();
    },

    componentWillReceiveProps(nextProps, nextState) {
        if (this.props.params.service != nextProps.params.service) {
            logActions.setPage(0);
        }
    },

    render() {
        return (
            <div>
                <div>
                    <div className="col-sm-3 col-md-2 app-sidebar">
                        <div className="sidebar-controls">
                            <div>
                                <a href="/" className="btn btn-default">Back</a>
                            </div>
                        </div>
                        <ServiceLogsFilterTab services={this.state.services} service={this.props.params.service} />
                    </div>
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 app-content">
                        <LogControls />
                        <ServiceLogs service={this.props.params.service}  />
                    </div>
                </div>
            </div>
        );
    }
});
