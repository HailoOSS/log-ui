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
import AccessLogsFilterTab from '../components/AccessLogsFilterTab';
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

    componentDidMount() {
        serviceActions.loadServices();
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
                        <AccessLogsFilterTab type="ACCESS_LOGS" services={this.state.services} service={this.props.params.service} filters={this.state.filters} />
                    </div>
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 app-content">
                        <LogControls />
                        <ServiceLogs type="ACCESS_LOGS" service={this.props.params.service} filters={this.state.filters}  />
                    </div>
                </div>
            </div>
        );
    }
});
