import React from 'react/addons';
import reduce from 'lodash/collection/reduce';
import _ from 'lodash';
import { WatchStoresMixin } from 'flux-core';
import { State } from 'react-router';
import { Alert } from 'react-bootstrap';
import serviceActions from '../actions/serviceActions';
import logActions from '../actions/logActions';
import servicesStore from '../stores/servicesStore';
import logStore from '../stores/logStore';

import LoadingSpinner from './LoadingSpinner';
import LogViewer from './LogViewer';

var PureRenderMixin = React.addons.PureRenderMixin;
var createFragment = React.addons.createFragment;

export default React.createClass({
    displayName: 'ServicesLogs',

    mixins: [ PureRenderMixin, WatchStoresMixin, State ],
    stores: [ servicesStore, logStore ],

    getInitialState() {
        return this.getState();
    },

    getState() {
        return {
            live: logStore.getLive(),
            logs: logStore.getLogItems(),
            loading: logStore.getLoading(),
            error: logStore.getError(),
            warning: logStore.getWarning(),
        };
    },

    componentWillMount: function() {
      this.timer = null;
    },

    componentDidMount() {
        logActions.loadLogs(this.props.type, this.props.service);
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.service !== this.props.service || nextProps.type !== this.props.type) {
            logActions.loadLogs(this.props.type, nextProps.service);
        }
    },

    componentWillUpdate(nextProps, nextState) {
        // Setup log refresh loop if required
        if (nextState.live && this.timer === null) {
            logActions.loadNewLogs();

            this.timer = setInterval(function() {
                logActions.loadNewLogs();
            }, 10000);
        } else if (!nextState.live && this.timer !== null) {
            clearInterval(this.timer)
        }
    },

    componentWillUnmount() {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    onWarningDismiss() {
        logActions.clearWarning();
    },

    render: function() {
        if (this.state.loading) {
            return (
                <div className="log-lines-info">
                    <LoadingSpinner />
                </div>
            );
        } else if (this.state.error !== null ) {
            return (
                <Alert bsStyle="danger"><strong>Error loading logs</strong> {this.state.error}</Alert>
            );
        } else {
            let alert = null;
            if (this.state.warning !== null ) {
                alert = (
                    <Alert bsStyle="warning" onDismiss={this.onWarningDismiss}><strong>Error loading logs</strong> {this.state.warning}</Alert>
                );
            }

            if (this.state.logs.size === 0) {
                return (
                    <Alert bsStyle="info">No logs found.</Alert>
                );
            } else {
                return (
                    <div>
                        {alert}
                        <LogViewer logs={this.state.logs} />
                    </div>
                );
            }
        }
    }
});
