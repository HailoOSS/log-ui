import React from 'react/addons';
import reduce from 'lodash/collection/reduce';
import sortBy from 'lodash/collection/sortBy';
import moment from 'moment'
import classNames from 'classnames';
import { WatchStoresMixin } from 'flux-core';
import { State } from 'react-router';
import { OverlayTrigger, Tooltip, Glyphicon, Collapse, Well } from 'react-bootstrap';
import serviceActions from '../actions/serviceActions';
import logActions from '../actions/logActions';
import servicesStore from '../stores/servicesStore';
import logStore from '../stores/logStore';

var PureRenderMixin = React.addons.PureRenderMixin;
var createFragment = React.addons.createFragment;

export default React.createClass({
    displayName: 'LogLine',

    mixins: [PureRenderMixin],

    getInitialState() {
        return {
            open: false,
        };
    },

    hostToHexCode(host) {
        let hash = 0;
        for (let i = 0; i < host.length; i++) {
           hash = host.charCodeAt(i) + ((hash << 5) - hash);
        }

        let c = (hash & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        let hex = "00000".substring(0, 6 - c.length) + c;

        return "#" + hex
    },

    toggleOpen() {
        this.setState({
            open: !this.state.open
        });
    },

    render: function() {
        let logLevel, component;
        if (this.props.log.logLevel) {
            logLevel = (
                <span className={"log-level log-level-" + this.props.log.logLevel.toLowerCase()}>[<span>{this.props.log.logLevel}</span>]</span>
            );
        }
        if (this.props.log.component) {
            component = (
                <span className="log-component">[<span>{this.props.log.component}</span>]</span>
            );
        }

        const tooltip = (
            <Tooltip id={"log-host-"+this.props.log.id}>{this.props.log.hostname}</Tooltip>
        );

        let logParams = [];
        let params = {};

        if (this.state.open) {
            logParams = sortBy(this.props.log.params, 'key')
        }

        logParams.map(param => {
            params[param.key] = (
                <tr>
                    <td scope="row">{param.key}</td>
                    <td>{param.value}</td>
                </tr>
            );
        })

        return (
            <div className={classNames(['log-item', {'log-item-active': this.state.open}])}>
                <Glyphicon glyph={this.state.open ? "menu-down" : "menu-right"} onClick={this.toggleOpen} />
                <OverlayTrigger placement="top" overlay={tooltip}>
                    <div className="host-pixel" style={{
                        "backgroundColor": this.hostToHexCode(this.props.log.hostname)
                    }} />
                </OverlayTrigger>
                <span className="log-timestamp">{moment(this.props.log.timestamp).format("YYYY-MM-DD HH:mm:ss")}</span>
                {logLevel}
                {component}
                <span className="log-message">{this.props.log.message}</span>
                <Collapse in={this.state.open}>
                  <div>
                    <Well>
                      <table className="table table-condensed log-params">
                        {createFragment(params)}
                      </table>
                    </Well>
                  </div>
                </Collapse>
            </div>
        );
    }
});
