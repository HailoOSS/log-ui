import React from 'react/addons';
import reduce from 'lodash/collection/reduce';
import forEach from 'lodash/collection/forEach';
import moment from 'moment';
import {constants} from '../flux';
import ServiceIcon from 'icon-web-components/lib/material/action/ic_extension_24px';
import {OverlayTrigger, Tooltip, Popover, Button, Table, Glyphicon} from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import {Link} from 'react-router';

import * as rangeUtils from '../utils/rangeUtils';
import * as datemath from '../utils/datemath';

var PureRenderMixin = React.addons.PureRenderMixin;
var RouteNames = constants.RouteNames;
var createFragment = React.addons.createFragment;

const TimepickerPopover = React.createClass({
    displayName: 'TimepickerPopover',

    mixins: [PureRenderMixin],

    handleFromChange(value) {
        this.props.onChange(moment(parseInt(value)), this.props.raw.to);
    },

    handleToChange(value) {
        this.props.onChange(this.props.raw.from, moment(parseInt(value)));
    },

    handleQuickSelect(option) {
        this.props.onChange(option.from, option.to);
        this.props.onClose();
    },

    handleToggleLiveTail() {
        this.props.onToggleLive();
    },

    handleClose() {
        this.props.onClose();
    },

    render() {
        let quickRanges = {};
        forEach(this.props.options, (group, i) => {
            let options = {};

            forEach(group, (option, j) => {
                options[option.display] = <li><a onClick={this.handleQuickSelect.bind(null, option)} data-from={option.from} data-to={option.to}>{option.display}</a></li>
            })

            quickRanges[i] = <ul>{options}</ul>
        })

        let refreshOptions = {};

        let fromDateTime = moment.isMoment(this.props.raw.from) ? this.props.raw.from : undefined;
        let fromText = moment.isMoment(this.props.raw.from) ? undefined : this.props.raw.from;

        let toDateTime = moment.isMoment(this.props.raw.to) ? this.props.raw.to : undefined;
        let toText = moment.isMoment(this.props.raw.to) ? undefined : this.props.raw.to;

        return (
            <div className="timepicker-popover">
                <div className="row">
                    <form name="timeForm" className="timepicker-absolute-section col-sm-4">
                        <h3>Time range</h3>
                        <div className="input-group">
                            <label className="small">From:</label>
                            <DateTimeField dateTime={fromDateTime} defaultText={fromText} onChange={this.handleFromChange} inputFormat="YYYY-MM-DD HH:mm" ></DateTimeField>
                        </div>

                        <div className="input-group">
                            <label className="small">To:</label>
                            <DateTimeField dateTime={toDateTime} defaultText={toText} onChange={this.handleToChange} inputFormat="YYYY-MM-DD HH:mm" ></DateTimeField>
                        </div>

                        <div className="input-group live-tail-toggle">
                            <button type="button" className="btn btn-default" disabled={!this.props.canLiveReload} onClick={this.handleToggleLiveTail}>Live tail: {this.props.isLive ? 'Enabled' : 'Disabled'}</button>
                        </div>

                        <div className="input-group close-popup-button">
                            <button type="button" className="btn btn-default" onClick={this.handleClose}>Close</button>
                        </div>
                    </form>

                    <div className="timepicker-relative-section col-sm-8">
                        <h3>Quick ranges</h3>
                        {quickRanges}
                    </div>

                </div>
            </div>
        );
    }
});

export default React.createClass({
    displayName: 'Timepicker',

    mixins: [PureRenderMixin],

    propTypes:{
        timeFron: React.PropTypes.number.isRequired,
        timeTo:   React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            open: false,
        }
    },

    handleClick() {
        this.setState({
            open: !this.state.open,
        })
    },

    handleClose() {
        this.setState({
            open: false,
        })
    },

    render: function() {
        // make copies if they are moment  (do not want to return out internal moment, because they are mutable!)
        const timeFrom = moment.isMoment(this.props.timeFrom) ? moment(this.props.timeFrom) : this.props.timeFrom ;
        const timeTo = moment.isMoment(this.props.timeTo) ? moment(this.props.timeTo) : this.props.timeTo;

        const time = {
            from: datemath.parse(timeFrom, false),
            to: datemath.parse(timeTo, true),
        }
        const timeRaw = {
            from: timeFrom,
            to: timeTo
        }

        const rangeString = rangeUtils.describeTimeRange(time, timeRaw);
        const raw = {from: this.props.timeFrom, to: this.props.timeTo};

        const tooltip = (
            <Tooltip>{rangeUtils.formatDate(time.from)}<br />to<br />{rangeUtils.formatDate(time.to)}</Tooltip>
        )

        let popover;
        if (this.state.open) {
            const options = rangeUtils.getRelativeTimesList(this.rangeString)

            popover = (
                <TimepickerPopover time={time} timeRaw={timeRaw} raw={raw} options={options} isLive={this.props.isLive} canLiveReload={this.props.canLiveReload} onToggleLive={this.props.onToggleLive} onClose={this.handleClose} onChange={this.props.onChange} />
            );
        }

        let refreshLabel;
        if (this.props.isLive) {
            refreshLabel = (
                <span className="text-warning">
                    &nbsp;
                    Live-tail enabled
                </span>
            );
        }

        return (
            <div>
                {popover}
                <OverlayTrigger placement="bottom" overlay={tooltip}>
                    <button type="button" className="btn btn-default timepicker-btn" onClick={this.handleClick}>
                        <Glyphicon glyph="time" />
                        <span> {rangeString}</span>
                        {refreshLabel}
                    </button>
                </OverlayTrigger>
            </div>
        );
    }
});
