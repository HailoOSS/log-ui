import React from 'react/addons';
import reduce from 'lodash/collection/reduce';
import {constants} from '../flux';
import ServiceIcon from 'icon-web-components/lib/material/action/ic_extension_24px';
import {Button, Table} from 'react-bootstrap';
import {Link} from 'react-router';

var PureRenderMixin = React.addons.PureRenderMixin;
var RouteNames = constants.RouteNames;
var createFragment = React.addons.createFragment;

export default React.createClass({
    displayName: 'ServicesTab',

    mixins: [PureRenderMixin],

    render: function() {
        var services = reduce(this.props.services, (res, s) => {
            res[ s ] = (
                <li><Link to={RouteNames.SERVICE_LOGS} params={{service: s}}>{s.replace(/^com.hailocab./, '')}</Link></li>
            );
            return res;
        }, {});

        return (
            <ul className="nav nav-sidebar sidebar-tab-services">
                {createFragment(services)}
            </ul>
        );
    }
});
