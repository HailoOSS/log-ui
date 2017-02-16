import React from 'react';

import {actions, constants} from '../flux';
import sessionStore from '../stores/sessionStore';

export default React.createClass({
    displayName: 'LogoutPage',

    statics: {
        willTransitionTo(transition, params, query) {
            var path = query.redirect || constants.RouteNames.LOGIN;
            if (sessionStore.isAuthenticated) {
                actions.logout();
            }
            transition.redirect(path, params);
        }
    },

    render() {
        return null;
    }
});
