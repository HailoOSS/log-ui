import React from 'react';
import {Navigation, RouteHandler, State} from 'react-router';
import {WatchStoresMixin} from 'flux-core';
import sessionStore from '../stores/sessionStore';
import {constants} from '../flux';
const RouteNames = constants.RouteNames;

export default React.createClass({
    displayName: 'AuthenticatedContainer',

    mixins: [
        Navigation,
        State,
        WatchStoresMixin
    ],

    stores: [ sessionStore ],

    statics: {
        willTransitionTo(transition, params) {
            if (!sessionStore.isAuthenticated) {
                return transition.redirect(RouteNames.LOGIN, params, {
                    redirect: transition.path
                });
            }
        }
    },

    getState() {
        return {
            isAuthenticated: sessionStore.isAuthenticated
        };
    },

    getInitialState() {
        return this.getState();
    },

    componentDidUpdate() {
        if (!this.state.isAuthenticated) {
            process.nextTick(() => {
                this.transitionTo(RouteNames.LOGIN, this.getParams());
            });
        }
    },

    render() {
        return <RouteHandler />;
    }
});
