import React from 'react/addons';
import moment from 'moment';
import classNames from 'classnames';
import { WatchStoresMixin } from 'flux-core';
import { Navigation, State } from 'react-router';
import { Tabs, Tab } from 'react-bootstrap';
import { constants } from '../flux';
import serviceActions from '../actions/serviceActions';
import logActions from '../actions/logActions';
import servicesStore from '../stores/servicesStore';
import logStore from '../stores/logStore';

import { Glyphicon } from 'react-bootstrap';
import Timepicker from './Timepicker';

var PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
    displayName: 'LogControls',

    mixins: [ PureRenderMixin, WatchStoresMixin, Navigation, State ],
    stores: [ logStore ],

    getInitialState() {
        return this.getState();
    },

    getState() {
        return {
            live: logStore.getLive(),
            query: logStore.getQuery(),
            timeFrom: logStore.getTimeFrom(),
            timeTo: logStore.getTimeTo(),
            currentPage: logStore.getCurrentPage(),
            total: logStore.getTotal(),
            loading: logStore.getLoading(),
        };
    },

    componentDidUpdate(prevProps, prevState) {
        if(prevState !== this.state) {
            process.nextTick(() => {
                const routes = this.getRoutes();
                const route = routes[routes.length - 1].name;
                const params = this.getParams();
                let query = this.getQuery();
                query.page = this.state.currentPage;
                query.query = this.state.query;
                query.from = this.state.timeFrom;
                if (moment.isMoment(query.from)) {
                    query.from = query.from.format("YYYY-MM-DD HH:mm:ss")
                }
                query.to = this.state.timeTo;
                if (moment.isMoment(query.to)) {
                    query.to = query.to.format("YYYY-MM-DD HH:mm:ss")
                }
                this.replaceWith(route, params, query);
            })
        }
    },

    onClickNewer(e) {
        logActions.prevPage();
        logActions.reloadLogs();
    },

    onClickOlder(e) {
        logActions.nextPage();
        logActions.reloadLogs();
    },

    onClickReload(e) {
        logActions.reloadLogs();
    },

    onFormSubmit(e) {
        e.preventDefault();

        let q = this.refs.query.getDOMNode().value;

        logActions.setQuery(q);
        logActions.reloadLogs();
    },

    handleTimeRangeChange(timeFrom, timeTo) {
        logActions.setTimeRange(timeFrom, timeTo);
        logActions.reloadLogs();
    },

    onToggleLive() {
        if (this.canEnableLiveMode()) {
            logActions.toggleLive();
        }
    },

    hasOlder() {
        if (this.state.loading || this.state.live) {
            return false;
        }

        return (this.state.currentPage * constants.MAX_LOGS) < this.state.total;
    },

    hasNewer() {
        if (this.state.loading || this.state.live) {
            return false;
        }

        return this.state.currentPage > 0
    },

    canReload() {
        return !this.state.loading;
    },

    canEnableLiveMode() {
        if (this.state.loading) {
            return false;
        }

        if (this.state.currentPage > 0) {
            return false;
        }

        if (this.state.timeTo !== '' && this.state.timeTo !== 'now') {
            return false;
        }

        return true;
    },

    render() {
        return (
            <div className="log-controls">
                <div className="control-buttons btn-group">
                    <button type="button" className="btn btn-default" disabled={!this.hasOlder()} onClick={this.onClickOlder}><Glyphicon glyph="menu-left" /></button>
                    <button type="button" className="btn btn-default" disabled={!this.hasNewer()} onClick={this.onClickNewer}><Glyphicon glyph="menu-right" /></button>
                    <button type="button" className="btn btn-default" disabled={!this.canReload()} onClick={this.onClickReload}><Glyphicon glyph="refresh" /></button>
                </div>
                <form className="search-form" onSubmit={this.onFormSubmit}>
                    <div className="control-input-group control-query">
                        <input type="text"
                            className="form-control input-search col-xs-2"
                            name="query"
                            ref="query"
                            placeholder="Search..."
                            defaultValue={this.state.query}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />
                    </div>

                    <button type="submit" className="hidden" />
                </form>
                <div className="timepicker-footer">
                    <Timepicker
                        timeFrom={this.state.timeFrom}
                        timeTo={this.state.timeTo}
                        canLiveReload={this.canEnableLiveMode()}
                        onChange={this.handleTimeRangeChange}
                        onToggleLive={this.onToggleLive}
                        isLive={this.state.live}
                    />
                </div>
            </div>
        );
    }
});
