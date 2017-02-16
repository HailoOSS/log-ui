import React from 'react';
import { WatchStoresMixin } from 'flux-core';
import { State, Link } from 'react-router';
import { Tabs, Tab } from 'react-bootstrap';
import { constants } from '../flux';
import serviceActions from '../actions/serviceActions';
import logActions from '../actions/logActions';
import servicesStore from '../stores/servicesStore';
import logStore from '../stores/logStore';

import ServicesList from '../components/ServicesList';

var RouteNames = constants.RouteNames;

export default React.createClass({
    displayName: 'IndexPage',

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
            <div className="row">
                <div className="col-xs-12">
                    <h2>Access Logs</h2>
                    <ul className="services-list list-group">
                        <li className="list-group-item"><Link to={RouteNames.ACCESS_LOGS} params={{service: 'hailo-2-api'}}>{'hailo-2-api'}</Link></li>
                    </ul>
                    <h2>Console Logs</h2>
                    <ServicesList services={this.state.services} />
                </div>
            </div>
        );
    }
});
