import React from 'react';

import {Navigation, State} from 'react-router';
import {WatchStoresMixin} from 'flux-core';

import {LoginHandler} from 'auth-web-bundle';

import flux from '../flux';
import sessionStore from '../stores/sessionStore';
import transitionStore from '../stores/transitionStore';

const {RouteNames, TransitionKeys, TransitionStatus} = flux.constants;

export default React.createClass({
    displayName: 'LoginPage',

    mixins: [
        Navigation,
        State,
        WatchStoresMixin
    ],

    stores: [ transitionStore ],

    statics: {
        willTransitionTo(transition, params, query) {
            if (sessionStore.isAuthenticated && query.redirect) {
                transition.redirect(query.redirect, params);
            }
        }
    },

    getState() {
        return {
            status: transitionStore.getStatus(TransitionKeys.LOGIN)
        }
    },

    getInitialState() {
        return this.getState();
    },

    componentDidUpdate() {
        if (this.state.status === TransitionStatus.SUCCESS) {
            const path = this.getQuery().redirect || RouteNames.HOME;
            process.nextTick(() => {
                this.transitionTo(path, this.getParams());
            });
        }
    },

    render() {
        var stores = {transitionStore};
        return (
            <div className="row">
                <div className="col-xs-12">
                    <LoginHandler flux={flux} stores={stores} />
                </div>
            </div>
        );
    }
});
