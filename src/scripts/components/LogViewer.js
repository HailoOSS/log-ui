import React from 'react/addons';
import reduce from 'lodash/collection/reduce';

import LogLine from './LogLine';

var PureRenderMixin = React.addons.PureRenderMixin;
var createFragment = React.addons.createFragment;

export default React.createClass({
    displayName: 'LogViewer',

    mixins: [PureRenderMixin],

    componentWillUpdate(nextProps, nextState) {
        let node = this.getDOMNode();
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    },

    componentDidUpdate(nextProps, nextState) {
        if (this.shouldScrollBottom) {
            let node = this.getDOMNode();
            node.scrollTop = node.scrollHeight;
        }
    },

    componentDidMount() {
        let node = this.getDOMNode();
        node.scrollTop = node.scrollHeight;
    },

    render: function() {
        let logs = this.props.logs.toJS();
        let lines = {};

        for (var i = logs.length - 1; i >= 0; i--) {
            lines[logs[i].id] = <LogLine log={logs[i]} />;
        }

        return (
            <div className='log-items'>
                {createFragment(lines)}
            </div>
        );
    }
});
