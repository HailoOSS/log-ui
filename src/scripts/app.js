var debug = require('debug')('hailo:app:bootstrap');
import React from 'react';

import {actions} from './flux';
import router from './router';

// Enable debug logs in development
if (process.env.NODE_ENV === 'development') {
    var dbg = 'hailo:*';
    require('debug').enable(dbg);
    debug('starting with debug', dbg);
}

// Run router
var container = document.getElementById('app');
router.run((Handler, state) => {
    actions.routeChange(state, Handler);
    React.render(<Handler />, container, () => {
        actions.routeChangeSuccess(state, Handler);
    });
});
