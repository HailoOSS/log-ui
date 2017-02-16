import React from 'react/addons';
import classNames from 'classnames';

import {WatchStoresMixin} from 'flux-core';
import transitionStore from '../stores/transitionStore';

var PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
    displayName: 'LoadingBar',

    mixins: [ PureRenderMixin, WatchStoresMixin ],

    stores: [ transitionStore ],

    getState() {
        return {
            isLoading: transitionStore.isLoading
        };
    },

    getInitialState() {
        return this.getState();
    },

    render() {
        var {className, ...props} = this.props,
            cls = classNames('loadingBar', this.state.isLoading && 'is-loading', className);

        return <div className={cls} {...props}></div>;
    }
});
