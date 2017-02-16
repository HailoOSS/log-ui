import React from 'react';
import {State, Link, RouteHandler} from 'react-router';

import flux from '../flux.js';
import {constants} from '../flux';

import routeStore from '../stores/routeStore';
import webDiscoveryStore from '../stores/webDiscoveryStore';
import sessionStore from '../stores/sessionStore';

import {PortalHeader} from 'portal-web-bundle';
import LoadingBar from '../components/LoadingBar';

export default React.createClass({
    displayName: 'LayoutContainer',

    mixins: [routeStore],

    getInitialState() {
        return this.getState();
    },

    getState() {
        return {
            params: routeStore.state.params
        }
    },

    render() {
        let compProps = {
            className: 'hailo-portal-header',
            fluid: false,
            fixedTop: false,
            stores: {webDiscoveryStore, sessionStore, regionStore: flux.stores.regionStore},
            flux
        };

        return (
            <div className='hailo-layout'>
                <LoadingBar />
                <PortalHeader {...compProps} portalName='Logs' />
                <div className='hailo-portal-body container'>
                    <RouteHandler />
                </div>
            </div>
        );
    }
});
