import React from 'react';
import { HistoryLocation, create, Route, RouteHandler, NotFoundRoute, Redirect } from 'react-router';

import {constants} from './flux';
var RouteNames = constants.RouteNames;

// Containers
import LayoutContainer from './containers/Layout';
import FluidLayoutContainer from './containers/FluidLayout';
import AuthenticatedContainer from './containers/Authenticated';

// Pages
import LoginPage from './pages/Login';
import LogoutPage from './pages/Logout';
import NotFoundPage from './pages/NotFound';
import IndexPage from './pages/Index';
import ServiceLogsPage from './pages/ServiceLogs';
import AccessLogsPage from './pages/AccessLogs';

// Define routes
var routes = (
    <Route>
        <Route handler={LayoutContainer}>
            <Route name={RouteNames.LOGIN} path='login' handler={LoginPage} />
            <Route name={RouteNames.LOGOUT} path='logout' handler={LogoutPage} />
            <Route handler={AuthenticatedContainer}>
                <Route name={RouteNames.HOME} path="/" handler={IndexPage}/>
            </Route>
        </Route>
        <Route handler={FluidLayoutContainer}>
            <Route handler={AuthenticatedContainer}>
                <Route name={RouteNames.SERVICE_LOGS} path="services/:service?" handler={ServiceLogsPage} />
                <Route name={RouteNames.ACCESS_LOGS} path="access_logs/:service?" handler={AccessLogsPage} />
            </Route>
        </Route>
    </Route>
);

export default create({
    location: HistoryLocation,
    routes: routes
});
